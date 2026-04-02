import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getUserByEmail, updateUser, createSession, createActivityLog } from '@/lib/notion';
import { comparePassword } from '@/lib/password';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { message: '이메일과 비밀번호를 입력해주세요.' },
        { status: 400 }
      );
    }

    // 사용자 찾기 (Notion에서)
    const user = await getUserByEmail(email);

    if (!user) {
      return NextResponse.json(
        { message: '이메일 또는 비밀번호가 올바르지 않습니다.' },
        { status: 401 }
      );
    }

    // 비밀번호 확인 (해시화된 비밀번호와 비교)
    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { message: '이메일 또는 비밀번호가 올바르지 않습니다.' },
        { status: 401 }
      );
    }

    if (user.status !== 'active') {
      return NextResponse.json(
        { message: '계정이 비활성화되었습니다. 관리자에게 문의하세요.' },
        { status: 403 }
      );
    }

    // 로그인 횟수 증가 및 마지막 활동 시간 업데이트
    const newLoginCount = (user.loginCount || 0) + 1;
    const now = new Date().toISOString();

    await updateUser(user.id, {
      loginCount: newLoginCount,
      lastActive: now,
    });

    // 사용자 정보에서 비밀번호 제거
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...userWithoutPassword } = user;

    // 세션 토큰 생성
    const sessionToken = `session_${user.id}_${Date.now()}`;
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(); // 7일 후

    // IP 주소와 User Agent 가져오기
    const ipAddress = request.headers.get('x-forwarded-for') ||
      request.headers.get('x-real-ip') ||
      'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';

    // Notion에 세션 생성
    const session = await createSession({
      userId: user.id,
      sessionToken,
      ipAddress,
      userAgent,
      expiresAt,
    });

    if (!session) {
      console.error('Failed to create session for user:', user.id);
      return NextResponse.json(
        { message: '세션 생성에 실패했습니다.' },
        { status: 500 }
      );
    }

    // 활동 로그 생성
    await createActivityLog({
      userId: user.id,
      action: 'login',
      description: `사용자가 로그인했습니다. (${newLoginCount}번째 로그인)`,
      details: {
        loginCount: newLoginCount,
        sessionId: session.id,
      },
      ipAddress,
      userAgent,
    });

    // 쿠키 설정
    const cookieStore = await cookies();
    cookieStore.set('session_token', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7일
      path: '/',
    });

    return NextResponse.json({
      message: '로그인되었습니다.',
      user: userWithoutPassword,
    });

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { message: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
