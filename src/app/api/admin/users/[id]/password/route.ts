import { NextRequest, NextResponse } from 'next/server';
import { getUserById, updateUser } from '@/lib/notion';
import { hashPassword } from '@/lib/password';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // 실제 환경에서는 여기서 인증 확인을 해야 함
    // const authHeader = request.headers.get('authorization');
    // if (!authHeader || !isValidAdminToken(authHeader)) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }

    const { id } = await params;
    const body = await request.json();
    const { newPassword } = body;

    // 입력 검증
    if (!newPassword) {
      return NextResponse.json(
        { error: '새 비밀번호가 필요합니다.' },
        { status: 400 }
      );
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { error: '비밀번호는 최소 6자 이상이어야 합니다.' },
        { status: 400 }
      );
    }

    // 사용자 존재 확인
    const existingUser = await getUserById(id);
    if (!existingUser) {
      return NextResponse.json(
        { error: '사용자를 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    // 새 비밀번호 해시화
    const hashedPassword = await hashPassword(newPassword);

    // 사용자 비밀번호 업데이트
    const success = await updateUser(id, { 
      password: hashedPassword,
      lastActive: new Date().toISOString()
    });

    if (!success) {
      return NextResponse.json(
        { error: '비밀번호 변경에 실패했습니다.' },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      message: '비밀번호가 성공적으로 변경되었습니다.' 
    });

  } catch (error) {
    console.error('Error changing password:', error);
    return NextResponse.json(
      { error: '비밀번호 변경 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
