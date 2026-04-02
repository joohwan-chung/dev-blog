import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getSessionByToken, getUserById } from '@/lib/notion';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get('session_token');

    if (!sessionToken) {
      return NextResponse.json(null);
    }

    // Notion에서 세션 조회
    const session = await getSessionByToken(sessionToken.value);

    if (!session) {
      return NextResponse.json(null);
    }

    // 세션 만료 확인
    const now = new Date();
    const expiresAt = new Date(session.expiresAt);
    
    if (now > expiresAt) {
      return NextResponse.json(null);
    }

    // 사용자 찾기 (Notion에서)
    const user = await getUserById(session.userId);

    if (!user) {
      return NextResponse.json(null);
    }

    if (user.status !== 'active') {
      return NextResponse.json(null);
    }

    // 사용자 정보에서 비밀번호 제거
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...userWithoutPassword } = user;

    return NextResponse.json(userWithoutPassword);

  } catch (error) {
    console.error('Get user error:', error);
    return NextResponse.json(
      { message: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
