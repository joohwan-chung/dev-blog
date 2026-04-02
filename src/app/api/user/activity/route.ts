import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getSessionByToken, getUserActivityLogs, getUserActivityLogsByAction } from '@/lib/notion';

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

    // 쿼리 파라미터 가져오기
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    let activityLogs;

    if (action) {
      // 특정 액션의 활동 로그 조회
      activityLogs = await getUserActivityLogsByAction(session.userId, action, limit);
    } else {
      // 모든 활동 로그 조회
      activityLogs = await getUserActivityLogs(session.userId, limit, offset);
    }

    return NextResponse.json({
      activityLogs,
      pagination: {
        limit,
        offset,
        total: activityLogs.length,
      },
    });

  } catch (error) {
    console.error('Get user activity error:', error);
    return NextResponse.json(
      { message: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
