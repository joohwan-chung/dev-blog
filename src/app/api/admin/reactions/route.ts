import { NextRequest, NextResponse } from 'next/server';
import { notion } from '@/lib/notion';

// 관리자용 반응 데이터 가져오기
export async function GET() {
  try {
    
    if (!process.env.NOTION_REACTIONS_DATABASE_ID) {
      return NextResponse.json(
        { error: '반응 데이터베이스 설정이 필요합니다.' },
        { status: 500 }
      );
    }

    // 모든 반응 데이터 가져오기 (관리자용)
    const response = await notion.databases.query({
      database_id: process.env.NOTION_REACTIONS_DATABASE_ID,
      sorts: [
        {
          property: 'CreatedAt',
          direction: 'descending',
        },
      ],
    });

    const reactions = response.results.map((item: unknown) => {
      const itemObj = item as {
        id: string;
        properties: {
          PostId?: { title: { plain_text: string }[] };
          ReactionType?: { select: { name: string } };
          UserIp?: { rich_text: { plain_text: string }[] };
          CreatedAt?: { date: { start: string } };
        };
        last_edited_time: string;
      };
      
      return {
        id: itemObj.id,
        postId: itemObj.properties.PostId?.title?.[0]?.plain_text || '',
        reactionType: itemObj.properties.ReactionType?.select?.name || '',
        userIp: itemObj.properties.UserIp?.rich_text?.[0]?.plain_text || '',
        createdAt: itemObj.properties.CreatedAt?.date?.start || '',
        updatedAt: itemObj.last_edited_time || '',
      };
    });

    // 포스트 정보도 함께 가져오기
    const postIds = [...new Set(reactions.map(r => r.postId))];
    const posts: { [key: string]: { title: string; published: boolean } } = {};
    
    // 각 포스트 ID에 대해 개별적으로 조회
    for (const postId of postIds) {
      try {
        const page = await notion.pages.retrieve({ page_id: postId });
        const pageObj = page as {
          properties?: {
            Name?: { title: { plain_text: string }[] };
            Published?: { date: { start: string } };
          };
        };
        posts[postId] = {
          title: pageObj.properties?.Name?.title?.[0]?.plain_text || '알 수 없는 포스트',
          published: !!pageObj.properties?.Published?.date?.start,
        };
      } catch (error) {
        console.error(`Error fetching post ${postId}:`, error);
        posts[postId] = {
          title: '알 수 없는 포스트',
          published: false,
        };
      }
    }

    // 반응과 포스트 정보 결합
    const reactionsWithPosts = reactions.map((reaction) => {
      const post = posts[reaction.postId];
      return {
        ...reaction,
        postTitle: post?.title || '알 수 없는 포스트',
        postPublished: post?.published || false,
      };
    });

    return NextResponse.json({
      reactions: reactionsWithPosts,
      total: reactionsWithPosts.length,
    });
  } catch (error) {
    console.error('Error fetching reactions:', error);
    return NextResponse.json(
      { error: '반응을 가져오는데 실패했습니다.' },
      { status: 500 }
    );
  }
}

// 반응 삭제 (관리자용)
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const reactionId = searchParams.get('id');

    if (!reactionId) {
      return NextResponse.json(
        { error: '반응 ID가 필요합니다.' },
        { status: 400 }
      );
    }

    
    if (!process.env.NOTION_REACTIONS_DATABASE_ID) {
      return NextResponse.json(
        { error: '반응 데이터베이스 설정이 필요합니다.' },
        { status: 500 }
      );
    }

    await notion.pages.update({
      page_id: reactionId,
      archived: true,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting reaction:', error);
    return NextResponse.json(
      { error: '반응 삭제에 실패했습니다.' },
      { status: 500 }
    );
  }
}
