import { NextResponse } from 'next/server';
import { getEventStats } from '@/lib/notion';

export async function GET(request: Request) {
  try {
    // URL에서 쿼리 파라미터 가져오기
    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    const stats = await getEventStats(startDate, endDate);
    return NextResponse.json(stats);
  } catch (error) {
    console.error('Error fetching event stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch event stats' },
      { status: 500 }
    );
  }
}
