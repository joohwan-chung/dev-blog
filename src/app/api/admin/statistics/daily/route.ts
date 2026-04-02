import { NextResponse } from 'next/server';
import { notion } from '@/lib/notion';

export async function GET(request: Request) {
  try {
    if (!process.env.NOTION_EVENTS_DATABASE_ID) {
      return NextResponse.json(
        { error: 'NOTION_EVENTS_DATABASE_ID가 설정되지 않음' },
        { status: 500 }
      );
    }

    // URL에서 쿼리 파라미터 가져오기
    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    // 날짜 범위 설정 (기본값: 최근 7일)
    let startDateObj: Date;
    let endDateObj: Date;

    if (startDate && endDate) {
      startDateObj = new Date(startDate);
      endDateObj = new Date(endDate);
      // 시간을 00:00:00으로 설정
      startDateObj.setHours(0, 0, 0, 0);
      endDateObj.setHours(23, 59, 59, 999);
    } else {
      // 기본값: 최근 7일
      const today = new Date();
      const sevenDaysAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
      startDateObj = new Date(sevenDaysAgo.getFullYear(), sevenDaysAgo.getMonth(), sevenDaysAgo.getDate());
      endDateObj = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59, 999);
    }

    // 지정된 날짜 범위의 이벤트 조회
    const response = await notion.databases.query({
      database_id: process.env.NOTION_EVENTS_DATABASE_ID!,
      filter: {
        and: [
          {
            property: 'Timestamp',
            date: {
              on_or_after: startDateObj.toISOString(),
            },
          },
          {
            property: 'Timestamp',
            date: {
              on_or_before: endDateObj.toISOString(),
            },
          },
        ],
      },
    });

    // 일별 통계 초기화
    const dailyStatsMap = new Map<string, number>();
    
    // 지정된 날짜 범위의 모든 날짜 초기화
    const currentDate = new Date(startDateObj);
    while (currentDate <= endDateObj) {
      const dateString = currentDate.toISOString().split('T')[0];
      dailyStatsMap.set(dateString, 0);
      currentDate.setDate(currentDate.getDate() + 1);
    }

    // 각 이벤트의 날짜별 분류
    response.results.forEach((event: unknown) => {
      const eventObj = event as { properties: { Timestamp?: { date?: { start?: string } } } };
      const timestamp = eventObj.properties.Timestamp?.date?.start;
      if (timestamp) {
        const eventDate = new Date(timestamp);
        const dateString = eventDate.toISOString().split('T')[0];
        
        if (dailyStatsMap.has(dateString)) {
          dailyStatsMap.set(dateString, (dailyStatsMap.get(dateString) || 0) + 1);
        }
      }
    });

    // Map을 배열로 변환하고 날짜순 정렬
    const dailyStats = Array.from(dailyStatsMap.entries())
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => a.date.localeCompare(b.date));

    return NextResponse.json(dailyStats);
  } catch (error) {
    console.error('Error fetching daily stats:', error);
    return NextResponse.json(
      { error: '일별 통계 조회 실패' },
      { status: 500 }
    );
  }
}
