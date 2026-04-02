import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createUser, getUserByEmail, getUserById, createSession, createActivityLog, grantDefaultPermissions } from '@/lib/notion';

export async function POST(request: NextRequest) {
  try {
    const { id, name, email, password } = await request.json();

    if (!id || !name || !email || !password) {
      return NextResponse.json(
        { message: '사용자 ID, 이름, 이메일, 비밀번호를 모두 입력해주세요.' },
        { status: 400 }
      );
    }

    // ID 형식 확인
    if (!/^[a-zA-Z0-9_]+$/.test(id)) {
      return NextResponse.json(
        { message: '사용자 ID는 영문, 숫자, 언더스코어(_)만 사용할 수 있습니다.' },
        { status: 400 }
      );
    }

    if (id.length < 3 || id.length > 20) {
      return NextResponse.json(
        { message: '사용자 ID는 3-20자 사이여야 합니다.' },
        { status: 400 }
      );
    }

    // 이메일 형식 검증
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { message: '올바른 이메일 형식을 입력해주세요.' },
        { status: 400 }
      );
    }

    // 비밀번호 길이 검증
    if (password.length < 6) {
      return NextResponse.json(
        { message: '비밀번호는 6자 이상이어야 합니다.' },
        { status: 400 }
      );
    }

    // ID 중복 확인
    const existingUserById = await getUserById(id);
    if (existingUserById) {
      return NextResponse.json(
        { message: '이미 사용 중인 사용자 ID입니다.' },
        { status: 409 }
      );
    }

    // 이메일 중복 확인
    const existingUserByEmail = await getUserByEmail(email);
    if (existingUserByEmail) {
      return NextResponse.json(
        { message: '이미 사용 중인 이메일입니다.' },
        { status: 409 }
      );
    }

    // 새 사용자 생성 (Notion에 저장)
    const newUser = await createUser({
      id,
      name,
      email,
      password, // 실제로는 해시화되어야 함
      role: 'user',
      avatar: '',
    });

    if (!newUser) {
      return NextResponse.json(
        { message: '사용자 생성에 실패했습니다.' },
        { status: 500 }
      );
    }

        // 사용자 정보에서 비밀번호 제거
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password: _, ...userWithoutPassword } = newUser;

    // 세션 토큰 생성
    const sessionToken = `session_${newUser.id}_${Date.now()}`;
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(); // 7일 후

    // IP 주소와 User Agent 가져오기
    const ipAddress = request.headers.get('x-forwarded-for') ||
      request.headers.get('x-real-ip') ||
      'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';

    // Notion에 세션 생성
    const session = await createSession({
      userId: newUser.id,
      sessionToken,
      ipAddress,
      userAgent,
      expiresAt,
    });

    if (!session) {
      console.error('Failed to create session for new user:', newUser.id);
      return NextResponse.json(
        { message: '세션 생성에 실패했습니다.' },
        { status: 500 }
      );
    }

    // 활동 로그 생성
    await createActivityLog({
      userId: newUser.id,
      action: 'register',
      description: `새 사용자가 회원가입했습니다.`,
      details: {
        email: newUser.email,
        name: newUser.name,
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

    // 기본 권한 부여
    try {
      const permissions = await grantDefaultPermissions(newUser.id, 'system');

      if (!permissions) {
        console.error(`Failed to grant permissions to user ${newUser.id}`);
      }
    } catch (error) {
      console.error('Error granting default permissions:', error);
      console.error('Error stack:', error instanceof Error ? error.stack : 'No stack');
      // 권한 부여 실패해도 회원가입은 성공으로 처리
    }


    return NextResponse.json({
      message: '회원가입이 완료되었습니다.',
      user: userWithoutPassword,
    });

  } catch (error) {
    console.error('Register error:', error);
    return NextResponse.json(
      { message: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
