import { NextRequest, NextResponse } from 'next/server';
import { getUserById, updateUser, getUserActivityLogs, getUserActivityStats } from '@/lib/notion';

export async function GET(
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
    const user = await getUserById(id);

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // 사용자 활동 로그 가져오기
    const activityLogs = await getUserActivityLogs(id, 20);

    // 사용자 활동 통계 가져오기
    const activityStats = await getUserActivityStats(id);

    // 사용자 상세 정보와 함께 활동 로그와 통계도 반환
    const userDetails = {
      ...user,
      ...activityStats,
      activityLog: activityLogs.map(log => ({
        id: log.id,
        type: log.action,
        description: log.description,
        timestamp: log.timestamp,
        ip: log.ipAddress,
        details: log.details
      }))
    };

    return NextResponse.json(userDetails);

  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user' },
      { status: 500 }
    );
  }
}

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
    const { name, email, role, status, avatar, password } = body;

    // 사용자 존재 확인
    const existingUser = await getUserById(id);
    if (!existingUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // 이메일 중복 확인 (자신 제외)
    if (email && email !== existingUser.email) {
      const { getUserByEmail } = await import('@/lib/notion');
      const emailUser = await getUserByEmail(email);
      if (emailUser && emailUser.id !== id) {
        return NextResponse.json(
          { error: 'User with this email already exists' },
          { status: 409 }
        );
      }
    }

    // 사용자 정보 업데이트
    const updateData: Record<string, unknown> = {
      ...(name && { name }),
      ...(email && { email }),
      ...(role && { role }),
      ...(status && { status }),
      ...(avatar !== undefined && { avatar }),
      ...(password && { password }),
      lastActive: new Date().toISOString()
    };

    const success = await updateUser(id, updateData);
    if (!success) {
      return NextResponse.json(
        { error: 'Failed to update user' },
        { status: 500 }
      );
    }

    // 업데이트된 사용자 정보 가져오기
    const updatedUser = await getUserById(id);
    if (!updatedUser) {
      return NextResponse.json(
        { error: 'Failed to fetch updated user' },
        { status: 500 }
      );
    }

    // 사용자 활동 통계 가져오기
    const activityStats = await getUserActivityStats(id);

    // 사용자 정보에서 비밀번호 제거하고 활동 통계 포함
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...userWithoutPassword } = updatedUser;

    return NextResponse.json({
      ...userWithoutPassword,
      ...activityStats
    });

  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json(
      { error: 'Failed to update user' },
      { status: 500 }
    );
  }
}

export async function DELETE(
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

    // 사용자 존재 확인
    const user = await getUserById(id);
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // 관리자는 삭제할 수 없음
    if (user.role === 'admin') {
      return NextResponse.json(
        { error: 'Cannot delete admin user' },
        { status: 403 }
      );
    }

    // TODO: Notion에서 사용자 삭제 기능 구현
    // 현재는 상태를 'banned'로 변경하는 것으로 대체
    const success = await updateUser(id, { status: 'banned' });
    if (!success) {
      return NextResponse.json(
        { error: 'Failed to delete user' },
        { status: 500 }
      );
    }

    return NextResponse.json({ message: 'User deleted successfully' });

  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json(
      { error: 'Failed to delete user' },
      { status: 500 }
    );
  }
}
