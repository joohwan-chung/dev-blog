import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getSessionByToken, getRecentActivityLogs } from '@/lib/notion';

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get('session_token');

    if (!sessionToken) {
      return NextResponse.json(
        { message: '인증이 필요합니다.' },
        { status: 401 }
      );
    }

    // Notion에서 세션 조회
    const session = await getSessionByToken(sessionToken.value);

    if (!session) {
      return NextResponse.json(
        { message: '유효하지 않은 세션입니다.' },
        { status: 401 }
      );
    }

    // 세션 만료 확인
    const now = new Date();
    const expiresAt = new Date(session.expiresAt);
    if (now > expiresAt) {
      return NextResponse.json(
        { message: '세션이 만료되었습니다.' },
        { status: 401 }
      );
    }

    // 사용자 권한 확인 (관리자만 접근 가능)
    // 실제로는 사용자 역할을 확인해야 하지만, 여기서는 간단히 구현
    // TODO: 사용자 역할 확인 로직 추가

    // 쿼리 파라미터 가져오기
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '100');

    // 최근 활동 로그 조회
    const activityLogs = await getRecentActivityLogs(limit);

    return NextResponse.json({
      activityLogs,
      pagination: {
        limit,
        total: activityLogs.length,
      },
    });

  } catch (error) {
    console.error('Get admin activity error:', error);
    return NextResponse.json(
      { message: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
