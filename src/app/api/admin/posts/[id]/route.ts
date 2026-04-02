import { NextResponse } from 'next/server';
import { updatePostStatus, updatePost, deletePost, getPostById } from '@/lib/notion';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const post = await getPostById(id);

    if (!post) {
      return NextResponse.json(
        { error: '포스트를 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    return NextResponse.json({ post });
  } catch (error) {
    console.error('Error fetching post:', error);
    return NextResponse.json(
      { error: '포스트를 가져오는데 실패했습니다.' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { title, description, tags, published, hidden, content, allowComments } = body;

    // 제목, 설명, 태그, 내용이 있으면 전체 업데이트, 없으면 상태만 업데이트
    if (title !== undefined || description !== undefined || tags !== undefined || content !== undefined) {
      const success = await updatePost(id, { title, description, tags, published, hidden, content, allowComments });
      
      if (success) {
        return NextResponse.json({ success: true });
      } else {
        return NextResponse.json(
          { error: '포스트 업데이트에 실패했습니다.' },
          { status: 500 }
        );
      }
    } else {
      const success = await updatePostStatus(id, { published, hidden, allowComments });

      if (success) {
        return NextResponse.json({ success: true });
      } else {
        return NextResponse.json(
          { error: '포스트 상태 업데이트에 실패했습니다.' },
          { status: 500 }
        );
      }
    }
  } catch (error) {
    console.error('Error updating post:', error);
    return NextResponse.json(
      { error: '포스트 업데이트에 실패했습니다.' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const success = await deletePost(id);

    if (success) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json(
        { error: '포스트 삭제에 실패했습니다.' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error deleting post:', error);
    return NextResponse.json(
      { error: '포스트 삭제에 실패했습니다.' },
      { status: 500 }
    );
  }
}