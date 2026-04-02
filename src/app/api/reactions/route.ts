import { NextRequest, NextResponse } from 'next/server';
import { getPostReactions, createReaction, deleteReaction, createUserReaction, createActivityLog, getSessionByToken, getUserById, checkUserPermission } from '@/lib/notion';
import { ReactionType } from '@/types/notion';
import { cookies } from 'next/headers';

// CORS 헤더 설정
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

// IP 주소 추출 함수
function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  
  if (realIp) {
    return realIp;
  }
  
  // 로컬 개발 환경에서는 기본값 사용
  return '127.0.0.1';
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const postId = searchParams.get('postId');

    if (!postId) {
      return NextResponse.json(
        { error: 'postId가 필요합니다.' },
        { status: 400, headers: corsHeaders }
      );
    }

    // 환경 변수 확인
    if (!process.env.NOTION_REACTIONS_DATABASE_ID) {
      return NextResponse.json(
        { error: '반응 데이터베이스 설정이 필요합니다.' },
        { status: 500, headers: corsHeaders }
      );
    }

    const reactions = await getPostReactions(postId);
    
    return NextResponse.json(reactions, { headers: corsHeaders });
  } catch (error) {
    console.error('Error fetching reactions:', error);
    return NextResponse.json(
      { error: '반응을 가져오는데 실패했습니다.' },
      { status: 500, headers: corsHeaders }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { postId, reactionType } = body;

    if (!postId || !reactionType) {
      return NextResponse.json(
        { error: 'postId와 reactionType이 필요합니다.' },
        { status: 400, headers: corsHeaders }
      );
    }

    // 유효한 반응 타입인지 확인
    const validReactionTypes: ReactionType[] = ['like', 'dislike', 'recommend', 'not_recommend'];
    if (!validReactionTypes.includes(reactionType)) {
      return NextResponse.json(
        { error: '유효하지 않은 반응 타입입니다.' },
        { status: 400, headers: corsHeaders }
      );
    }

    // 환경 변수 확인
    if (!process.env.NOTION_REACTIONS_DATABASE_ID) {
      return NextResponse.json(
        { error: '반응 데이터베이스 설정이 필요합니다.' },
        { status: 500, headers: corsHeaders }
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
      // 인증 실패해도 IP 기반 반응은 허용
    }

    let reaction = null;
    let updatedReactions = null;

    // 로그인한 사용자인 경우 User Reactions에 저장
    if (user && user.status === 'active') {
      try {
        // 반응 권한 확인
        const canReact = await checkUserPermission(user.id, 'reaction');
        
        if (canReact) {
          // User Reactions 데이터베이스에 저장
          const userReaction = await createUserReaction({
            userId: user.id,
            postId: postId,
            reactionType: reactionType,
          });

          if (userReaction) {
            // User Activity Logs에 저장
            const ipAddress = request.headers.get('x-forwarded-for') || 
                             request.headers.get('x-real-ip') || 
                             'unknown';
            const userAgent = request.headers.get('user-agent') || 'unknown';

            await createActivityLog({
              userId: user.id,
              action: 'reaction',
              description: `사용자가 ${reactionType} 반응을 추가했습니다.`,
              details: {
                reactionId: userReaction.id,
                postId: postId,
                reactionType: reactionType,
              },
              ipAddress,
              userAgent,
            });

            // User Reactions에서 Reaction 형태로 변환하여 반환
            reaction = {
              id: userReaction.id,
              postId: userReaction.postId,
              reactionType: userReaction.reactionType,
              userIp: 'logged_in_user', // 로그인한 사용자 표시
              createdAt: userReaction.createdAt,
              updatedAt: userReaction.createdAt,
            };

            // 간단한 반응 개수 반환 (실제로는 User Reactions에서 집계해야 함)
            updatedReactions = {
              [reactionType]: 1,
              total: 1,
            };
          }
        } else {
          console.log(`User ${user.id} does not have permission to react`);
          return NextResponse.json(
            { error: '반응 권한이 없습니다.' },
            { status: 403, headers: corsHeaders }
          );
        }
      } catch (error) {
        console.error('Error saving user reaction data:', error);
        return NextResponse.json(
          { error: '반응 생성에 실패했습니다.' },
          { status: 500, headers: corsHeaders }
        );
      }
    } else {
      // 익명 사용자인 경우 기본 Reactions 데이터베이스에 저장
      const userIp = getClientIp(request);
      reaction = await createReaction(postId, reactionType, userIp);

      if (!reaction) {
        return NextResponse.json(
          { error: '반응 생성에 실패했습니다.' },
          { status: 500, headers: corsHeaders }
        );
      }

      // 업데이트된 반응 개수 반환
      updatedReactions = await getPostReactions(postId);
    }
    
    return NextResponse.json(updatedReactions, { status: 201, headers: corsHeaders });
  } catch (error) {
    console.error('Error creating reaction:', error);
    return NextResponse.json(
      { error: '반응 생성에 실패했습니다.' },
      { status: 500, headers: corsHeaders }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const postId = searchParams.get('postId');

    if (!postId) {
      return NextResponse.json(
        { error: 'postId가 필요합니다.' },
        { status: 400, headers: corsHeaders }
      );
    }

    // 환경 변수 확인
    if (!process.env.NOTION_REACTIONS_DATABASE_ID) {
      return NextResponse.json(
        { error: '반응 데이터베이스 설정이 필요합니다.' },
        { status: 500, headers: corsHeaders }
      );
    }

    const userIp = getClientIp(request);
    
    // 사용자의 기존 반응 찾기
    const existingReaction = await getExistingReaction(postId, userIp);
    
    if (!existingReaction) {
      return NextResponse.json(
        { error: '삭제할 반응이 없습니다.' },
        { status: 404, headers: corsHeaders }
      );
    }

    const success = await deleteReaction(existingReaction.id);

    if (!success) {
      return NextResponse.json(
        { error: '반응 삭제에 실패했습니다.' },
        { status: 500, headers: corsHeaders }
      );
    }

    // 업데이트된 반응 개수 반환
    const updatedReactions = await getPostReactions(postId);
    
    return NextResponse.json(updatedReactions, { headers: corsHeaders });
  } catch (error) {
    console.error('Error deleting reaction:', error);
    return NextResponse.json(
      { error: '반응 삭제에 실패했습니다.' },
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

// 기존 반응 찾기 함수 (API에서 직접 사용)
async function getExistingReaction(postId: string, userIp: string) {
  try {
    const { Client } = await import('@notionhq/client');
    const notion = new Client({
      auth: process.env.NOTION_API_KEY,
    });

    const response = await notion.databases.query({
      database_id: process.env.NOTION_REACTIONS_DATABASE_ID!,
      filter: {
        and: [
          {
            property: 'PostId',
            title: {
              equals: postId,
            },
          },
          {
            property: 'UserIp',
            rich_text: {
              equals: userIp,
            },
          },
        ],
      },
    });

    if (response.results.length === 0) {
      return null;
    }

    const reactionObj = response.results[0] as unknown as {
      id: string;
      properties: {
        PostId: { title: { plain_text: string }[] };
        ReactionType: { select: { name: string } };
        UserIp: { rich_text: { plain_text: string }[] };
        CreatedAt: { date: { start: string } };
      };
      last_edited_time: string;
    };
    return {
      id: reactionObj.id,
      postId: reactionObj.properties.PostId.title[0]?.plain_text || '',
      reactionType: reactionObj.properties.ReactionType.select.name,
      userIp: reactionObj.properties.UserIp.rich_text[0]?.plain_text || '',
      createdAt: reactionObj.properties.CreatedAt.date?.start || '',
      updatedAt: reactionObj.last_edited_time || '',
    };
  } catch (error) {
    console.error('Error getting existing reaction:', error);
    return null;
  }
}
