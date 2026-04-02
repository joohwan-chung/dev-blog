import { NextRequest, NextResponse } from 'next/server';
import { getCommentsByPostId, createComment, createUserComment, createActivityLog, checkUserPermission } from '@/lib/notion';
import { cookies } from 'next/headers';
import { getSessionByToken, getUserById } from '@/lib/notion';

// CORS 헤더 설정
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const postId = searchParams.get('postId');

    if (!postId) {
      return NextResponse.json(
        { error: 'postId가 필요합니다.' },
        { status: 400 }
      );
    }

    // 환경 변수 확인
    if (!process.env.NOTION_COMMENTS_DATABASE_ID) {
      return NextResponse.json(
        { error: '댓글 데이터베이스 설정이 필요합니다.' },
        { status: 500 }
      );
    }

    const comments = await getCommentsByPostId(postId);
    
    return NextResponse.json(comments, { headers: corsHeaders });
  } catch (error) {
    console.error('Error fetching comments:', error);
    return NextResponse.json(
      { error: '댓글을 가져오는데 실패했습니다.' },
      { status: 500, headers: corsHeaders }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { postId, content, authorName, parentId } = body;

    if (!postId || !content) {
      return NextResponse.json(
        { error: 'postId와 content가 필요합니다.' },
        { status: 400 }
      );
    }

    if (content.trim().length === 0) {
      return NextResponse.json(
        { error: '댓글 내용을 입력해주세요.' },
        { status: 400 }
      );
    }

    // 환경 변수 확인
    if (!process.env.NOTION_COMMENTS_DATABASE_ID) {
      return NextResponse.json(
        { error: '댓글 데이터베이스 설정이 필요합니다.' },
        { status: 500 }
      );
    }

    // 사용자 인증 확인
    let user = null;
    try {
      const cookieStore = await cookies();
      const sessionToken = cookieStore.get('session_token');
      
      if (sessionToken) {
        const session = await getSessionByToken(sessionToken.value);
        if (session) {
          const now = new Date();
          const expiresAt = new Date(session.expiresAt);
          if (now <= expiresAt) {
            user = await getUserById(session.userId);
          }
        }
      }
    } catch (error) {
      console.error('Error checking user authentication:', error);
      // 인증 실패해도 익명 댓글은 허용
    }

    let comment = null;

    // 로그인한 사용자인 경우 User Comments에 저장
    if (user && user.status === 'active') {
      try {
        // 댓글 작성 권한 확인
        const canComment = await checkUserPermission(user.id, 'comment');
        
        if (canComment) {
          // User Comments 데이터베이스에 저장
          const userComment = await createUserComment({
            userId: user.id,
            postId: postId,
            content: content.trim(),
            authorName: authorName || user.name,
            parentId: parentId,
          });

          if (userComment) {
            // User Activity Logs에 저장
            const ipAddress = request.headers.get('x-forwarded-for') || 
                             request.headers.get('x-real-ip') || 
                             'unknown';
            const userAgent = request.headers.get('user-agent') || 'unknown';

            await createActivityLog({
              userId: user.id,
              action: 'comment',
              description: `사용자가 댓글을 작성했습니다.`,
              details: {
                commentId: userComment.id,
                postId: postId,
                content: content.trim().substring(0, 100) + (content.trim().length > 100 ? '...' : ''),
                parentId: parentId,
              },
              ipAddress,
              userAgent,
            });

            // User Comments에서 Comment 형태로 변환하여 반환
            comment = {
              id: userComment.id,
              content: userComment.content,
              postId: userComment.postId,
              postTitle: '', // 필요시 추가
              createdAt: userComment.createdAt,
              updatedAt: userComment.createdAt,
              isAnonymous: false,
              authorName: userComment.authorName,
              parentId: userComment.parentId,
              depth: parentId ? 1 : 0, // 간단한 depth 계산
            };
          }
        } else {
          return NextResponse.json(
            { error: '댓글 작성 권한이 없습니다.' },
            { status: 403, headers: corsHeaders }
          );
        }
      } catch (error) {
        console.error('Error saving user comment data:', error);
        return NextResponse.json(
          { error: '댓글 생성에 실패했습니다.' },
          { status: 500, headers: corsHeaders }
        );
      }
    } else {
      // 익명 사용자인 경우 기본 Comments 데이터베이스에 저장
      comment = await createComment(postId, content.trim(), authorName, parentId);

      if (!comment) {
        return NextResponse.json(
          { error: '댓글 생성에 실패했습니다.' },
          { status: 500, headers: corsHeaders }
        );
      }
    }

    return NextResponse.json(comment, { status: 201, headers: corsHeaders });
  } catch (error) {
    console.error('Error creating comment:', error);
    
    if (error instanceof Error && error.message.includes('대대댓글까지만')) {
      return NextResponse.json(
        { error: error.message },
        { status: 400, headers: corsHeaders }
      );
    }
    
    return NextResponse.json(
      { error: '댓글 생성에 실패했습니다.' },
      { status: 500, headers: corsHeaders }
    );
  }
}

// OPTIONS 요청 처리 (CORS preflight)
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: corsHeaders,
  });
}
