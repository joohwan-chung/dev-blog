import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const SERPER_URL = 'https://google.serper.dev/search';
const MAX_RESULTS = 10;

export interface WebSearchResult {
  title: string;
  url: string;
  snippet: string;
}

export async function GET(request: Request) {
  const apiKey = process.env.SERPER_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ results: [] });
  }

  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get('q')?.trim() ?? '';
    if (!q) {
      return NextResponse.json({ results: [] });
    }

    const res = await fetch(SERPER_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-KEY': apiKey,
      },
      body: JSON.stringify({ q, num: MAX_RESULTS }),
    });

    if (!res.ok) {
      console.error('Serper API error:', res.status, await res.text());
      return NextResponse.json({ results: [] });
    }

    const data = (await res.json()) as {
      organic?: Array<{ title?: string; link?: string; snippet?: string }>;
    };
    const organic = data.organic ?? [];
    const results: WebSearchResult[] = organic.slice(0, MAX_RESULTS).map((item) => ({
      title: item.title ?? '',
      url: item.link ?? '',
      snippet: item.snippet ?? '',
    }));

    return NextResponse.json({ results });
  } catch (error) {
    console.error('Web search error:', error);
    return NextResponse.json({ results: [] });
  }
}
