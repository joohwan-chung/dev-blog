import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getSessionByToken, getUserById, updateUser, createActivityLog } from '@/lib/notion';

export async function DELETE(request: NextRequest) {
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

    // 사용자 정보 업데이트 (아바타를 null로 설정)
    const success = await updateUser(session.userId, {
      avatar: '',
      lastActive: new Date().toISOString(),
    });

    if (!success) {
      return NextResponse.json(
        { message: '아바타 삭제에 실패했습니다.' },
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
      action: 'delete_avatar',
      description: '사용자가 프로필 이미지를 삭제했습니다.',
      details: {},
      ipAddress,
      userAgent,
    });

    // 업데이트된 사용자 정보 가져오기
    const updatedUser = await getUserById(session.userId);

    if (!updatedUser) {
      return NextResponse.json(
        { message: '업데이트된 사용자 정보를 가져올 수 없습니다.' },
        { status: 500 }
      );
    }

    // 사용자 정보에서 비밀번호 제거
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...userWithoutPassword } = updatedUser;

    return NextResponse.json({
      message: '아바타가 성공적으로 삭제되었습니다.',
      user: userWithoutPassword,
    });

  } catch (error) {
    console.error('Avatar delete error:', error);
    return NextResponse.json(
      { message: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
