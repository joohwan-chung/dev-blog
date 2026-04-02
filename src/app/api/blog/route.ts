import { NextResponse } from 'next/server';
import { getDatabasePages } from '@/lib/notion';

// API 라우트에서도 캐싱을 비활성화하여 항상 최신 데이터를 반환
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const posts = await getDatabasePages();
    return NextResponse.json(posts);
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch blog posts' },
      { status: 500 }
    );
  }
}
