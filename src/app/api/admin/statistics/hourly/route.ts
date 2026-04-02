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

    // 날짜 범위 설정 (기본값: 오늘)
    let startDateObj: Date;
    let endDateObj: Date;

    if (startDate && endDate) {
      startDateObj = new Date(startDate);
      endDateObj = new Date(endDate);
      // 시간을 00:00:00으로 설정
      startDateObj.setHours(0, 0, 0, 0);
      endDateObj.setHours(23, 59, 59, 999);
    } else {
      // 기본값: 오늘
      const today = new Date();
      startDateObj = new Date(today.getFullYear(), today.getMonth(), today.getDate());
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

    // 시간대별 통계 초기화 (0-23시)
    const hourlyStats = Array.from({ length: 24 }, (_, i) => ({
      hour: i,
      count: 0,
    }));

    // 각 이벤트의 시간대별 분류
    response.results.forEach((event: unknown) => {
      const eventObj = event as { properties: { Timestamp?: { date?: { start?: string } } } };
      const timestamp = eventObj.properties.Timestamp?.date?.start;
      if (timestamp) {
        const eventDate = new Date(timestamp);
        const hour = eventDate.getHours();
        if (hour >= 0 && hour <= 23) {
          hourlyStats[hour].count++;
        }
      }
    });

    return NextResponse.json(hourlyStats);
  } catch (error) {
    console.error('Error fetching hourly stats:', error);
    return NextResponse.json(
      { error: '시간대별 통계 조회 실패' },
      { status: 500 }
    );
  }
}
