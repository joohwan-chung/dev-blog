import { NextResponse } from 'next/server';
import { getRecentEvents } from '@/lib/notion';

export async function GET() {
  try {
    const events = await getRecentEvents(10); // 최근 10개 이벤트
    return NextResponse.json({ events });
  } catch (error) {
    console.error('Error fetching recent events:', error);
    return NextResponse.json(
      { error: 'Failed to fetch recent events' },
      { status: 500 }
    );
  }
}
