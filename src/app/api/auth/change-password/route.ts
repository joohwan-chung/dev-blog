import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getSessionByToken, getUserById, updateUser, createActivityLog } from '@/lib/notion';
import { comparePassword } from '@/lib/password';

export async function PUT(request: NextRequest) {
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

    const { currentPassword, newPassword } = await request.json();

    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { message: '현재 비밀번호와 새 비밀번호를 입력해주세요.' },
        { status: 400 }
      );
    }

    // 새 비밀번호 길이 검증
    if (newPassword.length < 6) {
      return NextResponse.json(
        { message: '새 비밀번호는 6자 이상이어야 합니다.' },
        { status: 400 }
      );
    }

    // 사용자 찾기
    const user = await getUserById(session.userId);

    if (!user) {
      return NextResponse.json(
        { message: '사용자를 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    // 현재 비밀번호 확인
    const isCurrentPasswordValid = await comparePassword(currentPassword, user.password);
    if (!isCurrentPasswordValid) {
      return NextResponse.json(
        { message: '현재 비밀번호가 올바르지 않습니다.' },
        { status: 401 }
      );
    }

    // 새 비밀번호로 업데이트
    const success = await updateUser(session.userId, {
      password: newPassword, // updateUser 함수에서 자동으로 해시화됨
      lastActive: new Date().toISOString(),
    });

    if (!success) {
      return NextResponse.json(
        { message: '비밀번호 변경에 실패했습니다.' },
        { status: 500 }
      );
    }

    // IP 주소와 User Agent 가져오기
    const ipAddress = request.headers.get('x-forwarded-for') || 
                     request.headers.get('x-real-ip') || 
                     'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';

    // 활동 로그 생성
    await createActivityLog({
      userId: session.userId,
      action: 'password_change',
      description: '사용자가 비밀번호를 변경했습니다.',
      details: {
        userEmail: user.email,
      },
      ipAddress,
      userAgent,
    });

    return NextResponse.json({
      message: '비밀번호가 성공적으로 변경되었습니다.',
    });

  } catch (error) {
    console.error('Change password error:', error);
    return NextResponse.json(
      { message: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
