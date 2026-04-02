import { NextResponse } from 'next/server';
import { getDatabasePages } from '@/lib/notion';
import { searchPosts } from '@/lib/notion-search';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get('q') ?? '';

    const pages = await getDatabasePages();
    const results = searchPosts(pages, q);

    return NextResponse.json({ results });
  } catch (error) {
    console.error('Error searching blog posts:', error);
    return NextResponse.json(
      { error: 'Failed to search blog posts' },
      { status: 500 }
    );
  }
}
