import { NextRequest, NextResponse } from 'next/server';
import { notion } from '@/lib/notion';

// CORS 헤더 설정
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

// 모든 댓글 조회 (관리자용)
export async function GET(request: NextRequest) {
  try {
    // 환경 변수 확인
    if (!process.env.NOTION_COMMENTS_DATABASE_ID) {
      return NextResponse.json(
        { error: '댓글 데이터베이스 설정이 필요합니다.' },
        { status: 500 }
      );
    }

    const { searchParams } = new URL(request.url);
    const pageSize = parseInt(searchParams.get('pageSize') || '20');
    const startCursor = searchParams.get('startCursor');

    const response = await notion.databases.query({
      database_id: process.env.NOTION_COMMENTS_DATABASE_ID,
      page_size: pageSize,
      start_cursor: startCursor || undefined,
      sorts: [
        {
          property: 'CreatedAt',
          direction: 'descending',
        },
      ],
    });

    const comments = response.results.map((comment: unknown) => {
      const commentObj = comment as {
        id: string;
        properties: {
          Content: { rich_text: { plain_text: string }[] };
          PostId: { title: { plain_text: string }[] };
          CreatedAt: { date: { start: string } };
          AuthorName: { rich_text: { plain_text: string }[] };
          IsAnonymous: { checkbox: boolean };
          ParentId: { rich_text: { plain_text: string }[] };
          Depth: { number: number };
          Hidden?: { checkbox: boolean };
          PostTitle?: { rich_text: { plain_text: string }[] };
          ReportCount?: { number: number };
          LastReportReason?: { rich_text: { plain_text: string }[] };
          LastReportedAt?: { date: { start: string } };
          ReportedBy?: { rich_text: { plain_text: string }[] };
          ReportReasons?: { rich_text: { plain_text: string }[] };
        };
        last_edited_time: string;
      };

      return {
        id: commentObj.id,
        content: commentObj.properties.Content.rich_text[0]?.plain_text || '',
        postId: commentObj.properties.PostId.title[0]?.plain_text || '',
        postTitle: commentObj.properties.PostTitle?.rich_text[0]?.plain_text || '',
        createdAt: commentObj.properties.CreatedAt.date?.start || '',
        updatedAt: commentObj.last_edited_time || '',
        isAnonymous: commentObj.properties.IsAnonymous.checkbox,
        authorName: commentObj.properties.AuthorName.rich_text[0]?.plain_text || '익명',
        parentId: commentObj.properties.ParentId.rich_text[0]?.plain_text || undefined,
        depth: commentObj.properties.Depth.number || 0,
        hidden: commentObj.properties.Hidden?.checkbox || false,
        reportCount: commentObj.properties.ReportCount?.number || 0,
        lastReportReason: commentObj.properties.LastReportReason?.rich_text[0]?.plain_text || '',
        lastReportedAt: commentObj.properties.LastReportedAt?.date?.start || '',
        reportedBy: commentObj.properties.ReportedBy?.rich_text?.map(text => text.plain_text) || [],
        reportReasons: commentObj.properties.ReportReasons?.rich_text?.map(text => text.plain_text) || [],
      };
    });

    return NextResponse.json({
      comments,
      nextCursor: response.next_cursor,
      hasMore: response.has_more,
    }, { headers: corsHeaders });
  } catch (error) {
    console.error('Error fetching comments:', error);
    return NextResponse.json(
      { error: '댓글을 가져오는데 실패했습니다.' },
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
