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

    // 날짜 범위 설정 (기본값: 모든 데이터)
    const queryOptions: Parameters<typeof notion.databases.query>[0] = {
      database_id: process.env.NOTION_EVENTS_DATABASE_ID!,
    };

    if (startDate && endDate) {
      const startDateObj = new Date(startDate);
      const endDateObj = new Date(endDate);
      startDateObj.setHours(0, 0, 0, 0);
      endDateObj.setHours(23, 59, 59, 999);

      queryOptions.filter = {
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
      };
    }

    // 지정된 날짜 범위의 이벤트 조회
    const response = await notion.databases.query(queryOptions);

    // 이벤트 타입별 개수 계산
    const eventTypeStats = {
      comment: 0,
      reaction: 0,
      click: 0,
      user_visit: 0,
    };

    response.results.forEach((event: unknown) => {
      const eventObj = event as { properties: { Type?: { select?: { name?: string } } } };
      const eventType = eventObj.properties.Type?.select?.name;
      if (eventType && eventTypeStats.hasOwnProperty(eventType)) {
        eventTypeStats[eventType as keyof typeof eventTypeStats]++;
      }
    });


    return NextResponse.json(eventTypeStats);
  } catch (error) {
    console.error('Error fetching event type stats:', error);
    return NextResponse.json(
      { error: '이벤트 타입 통계 조회 실패' },
      { status: 500 }
    );
  }
}
