import { NextRequest, NextResponse } from 'next/server';
import { createEvent } from '@/lib/notion';

// CORS 헤더 설정
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

// IP 주소 추출 함수
function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  
  if (realIp) {
    return realIp;
  }
  
  return '127.0.0.1';
}

export async function POST(request: NextRequest) {
  try {
    // 환경변수 확인
    if (!process.env.NOTION_EVENTS_DATABASE_ID) {
      return NextResponse.json(
        { error: '서버 설정 오류: 이벤트 데이터베이스 ID가 설정되지 않음' },
        { status: 500, headers: corsHeaders }
      );
    }

    if (!process.env.NOTION_API_KEY) {
      return NextResponse.json(
        { error: '서버 설정 오류: Notion API 키가 설정되지 않음' },
        { status: 500, headers: corsHeaders }
      );
    }

    const body = await request.json();
    const { type, description, page, userAgent, referrer } = body;

    if (!type || !description) {
      return NextResponse.json(
        { error: 'type과 description이 필요합니다.' },
        { status: 400, headers: corsHeaders }
      );
    }

    const userIp = getClientIp(request);
    const timestamp = new Date().toISOString();

    // 노션 데이터베이스에 이벤트 저장
    const event = await createEvent({
      type,
      description,
      timestamp,
      userIp,
      page: page || request.headers.get('referer') || 'unknown',
      userAgent: userAgent || request.headers.get('user-agent') || 'unknown',
      referrer: referrer || request.headers.get('referer') || 'direct'
    });

    if (!event) {
      return NextResponse.json(
        { error: '이벤트 저장에 실패했습니다.' },
        { status: 500, headers: corsHeaders }
      );
    }

    return NextResponse.json(
      { success: true, event },
      { status: 200, headers: corsHeaders }
    );
  } catch (error) {
    console.error('Error collecting event:', error);
    return NextResponse.json(
      { error: '이벤트 수집에 실패했습니다.' },
      { status: 500, headers: corsHeaders }
    );
  }
}

// OPTIONS 요청 처리 (CORS preflight)
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: corsHeaders,
  });
}
