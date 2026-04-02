import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { deactivateSession, createActivityLog } from '@/lib/notion';

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get('session_token');

    if (sessionToken) {
      // 세션 토큰에서 사용자 ID 추출
      const tokenParts = sessionToken.value.split('_');
      const userId = tokenParts.length >= 3 ? `${tokenParts[1]}_${tokenParts[2]}` : null;

      if (userId) {
        // IP 주소와 User Agent 가져오기
        const ipAddress = request.headers.get('x-forwarded-for') || 
                         request.headers.get('x-real-ip') || 
                         'unknown';
        const userAgent = request.headers.get('user-agent') || 'unknown';

        // 활동 로그 생성
        await createActivityLog({
          userId,
          action: 'logout',
          description: '사용자가 로그아웃했습니다.',
          details: {
            sessionToken: sessionToken.value,
          },
          ipAddress,
          userAgent,
        });

        // Notion에서 세션 비활성화
        await deactivateSession(sessionToken.value);
      }
    }

    // 쿠키 삭제
    cookieStore.delete('session_token');

    return NextResponse.json({
      message: '로그아웃되었습니다.',
    });

  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { message: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
