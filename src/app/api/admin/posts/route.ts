import { NextResponse } from 'next/server';
import { getAllPostsForAdmin } from '@/lib/notion';

export async function GET() {
  try {
    const posts = await getAllPostsForAdmin();
    return NextResponse.json({ posts });
  } catch (error) {
    console.error('Error fetching admin posts:', error);
    return NextResponse.json(
      { error: '포스트 목록을 가져오는데 실패했습니다.' },
      { status: 500 }
    );
  }
}
