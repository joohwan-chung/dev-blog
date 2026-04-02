import { NextRequest, NextResponse } from 'next/server';
import { notion } from '@/lib/notion';

// CORS 헤더 설정
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'DELETE, PATCH, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

// 댓글 삭제
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: commentId } = await params;

    if (!commentId) {
      return NextResponse.json(
        { error: '댓글 ID가 필요합니다.' },
        { status: 400 }
      );
    }

    // Notion에서 댓글 삭제
    await notion.pages.update({
      page_id: commentId,
      archived: true,
    });

    return NextResponse.json(
      { message: '댓글이 삭제되었습니다.' },
      { status: 200, headers: corsHeaders }
    );
  } catch (error) {
    console.error('Error deleting comment:', error);
    return NextResponse.json(
      { error: '댓글 삭제에 실패했습니다.' },
      { status: 500, headers: corsHeaders }
    );
  }
}

// 댓글 숨김 상태 변경
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: commentId } = await params;
    const body = await request.json();
    const { hidden } = body;

    if (!commentId) {
      return NextResponse.json(
        { error: '댓글 ID가 필요합니다.' },
        { status: 400 }
      );
    }

    if (typeof hidden !== 'boolean') {
      return NextResponse.json(
        { error: '숨김 상태가 필요합니다.' },
        { status: 400 }
      );
    }

    // Notion에서 댓글 숨김 상태 업데이트
    await notion.pages.update({
      page_id: commentId,
      properties: {
        Hidden: {
          checkbox: hidden,
        },
      },
    });

    const message = hidden ? '댓글이 숨김 처리되었습니다.' : '댓글이 표시되었습니다.';

    return NextResponse.json(
      { message },
      { status: 200, headers: corsHeaders }
    );
  } catch (error) {
    console.error('Error updating comment:', error);
    return NextResponse.json(
      { error: '댓글 상태 변경에 실패했습니다.' },
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
