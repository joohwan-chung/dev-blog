import { NextRequest, NextResponse } from 'next/server';
import { getAllUsers, createUser, getUserById, getUserActivityStats } from '@/lib/notion';

export async function GET(request: NextRequest) {
  try {
    // 실제 환경에서는 여기서 인증 확인을 해야 함
    // const authHeader = request.headers.get('authorization');
    // if (!authHeader || !isValidAdminToken(authHeader)) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const role = searchParams.get('role') || 'all';
    const status = searchParams.get('status') || 'all';

    // Notion에서 모든 사용자 가져오기
    const allUsers = await getAllUsers();

    if (!allUsers) {
      return NextResponse.json(
        { error: 'Failed to fetch users from database' },
        { status: 500 }
      );
    }

    // 사용자 데이터를 프론트엔드 형식에 맞게 변환하고 실제 활동 통계 조회
    const transformedUsers = await Promise.all(
      allUsers.map(async (user) => {
        // 각 사용자의 실제 활동 통계 조회
        const activityStats = await getUserActivityStats(user.id);

        return {
          ...user,
          // preferences가 문자열인 경우 파싱
          preferences: typeof user.preferences === 'string'
            ? JSON.parse(user.preferences)
            : user.preferences,
          // 실제 활동 통계 적용
          totalPosts: activityStats.totalPosts,
          totalComments: activityStats.totalComments,
          totalReactions: activityStats.totalReactions,
        };
      })
    );

    let filteredUsers = [...transformedUsers];

    // 검색 필터
    if (search) {
      filteredUsers = filteredUsers.filter(user =>
        user.name.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase())
      );
    }

    // 상태 필터
    if (status !== 'all') {
      filteredUsers = filteredUsers.filter(user => user.status === status);
    }

    // 역할 필터
    if (role !== 'all') {
      filteredUsers = filteredUsers.filter(user => user.role === role);
    }

    // 페이지네이션
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

    // 통계 계산
    const stats = {
      total: allUsers.length,
      active: allUsers.filter(user => user.status === 'active').length,
      inactive: allUsers.filter(user => user.status === 'inactive').length,
      banned: allUsers.filter(user => user.status === 'banned').length,
      admins: allUsers.filter(user => user.role === 'admin').length,
      users: allUsers.filter(user => user.role === 'user').length,
      guests: allUsers.filter(user => user.role === 'guest').length,
    };

    return NextResponse.json({
      users: paginatedUsers,
      pagination: {
        page,
        limit,
        total: filteredUsers.length,
        totalPages: Math.ceil(filteredUsers.length / limit)
      },
      stats
    });

  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // 실제 환경에서는 여기서 인증 확인을 해야 함
    // const authHeader = request.headers.get('authorization');
    // if (!authHeader || !isValidAdminToken(authHeader)) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }

    const body = await request.json();
    const { id, name, email, password, role = 'user' } = body;

    if (!id || !name || !email || !password) {
      return NextResponse.json(
        { error: 'ID, name, email, and password are required' },
        { status: 400 }
      );
    }

    // ID 형식 확인
    if (!/^[a-zA-Z0-9_]+$/.test(id)) {
      return NextResponse.json(
        { error: 'ID must contain only letters, numbers, and underscores' },
        { status: 400 }
      );
    }

    if (id.length < 3 || id.length > 20) {
      return NextResponse.json(
        { error: 'ID must be between 3 and 20 characters' },
        { status: 400 }
      );
    }

    // ID 중복 확인
    const existingUserById = await getUserById(id);
    if (existingUserById) {
      return NextResponse.json(
        { error: 'User with this ID already exists' },
        { status: 409 }
      );
    }

    // 이메일 중복 확인
    const { getUserByEmail } = await import('@/lib/notion');
    const existingUserByEmail = await getUserByEmail(email);
    if (existingUserByEmail) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 409 }
      );
    }

    // Notion에서 새 사용자 생성
    const newUser = await createUser({
      id,
      name,
      email,
      password,
      role: role as 'admin' | 'user' | 'guest',
      avatar: '',
    });

    if (!newUser) {
      return NextResponse.json(
        { error: 'Failed to create user' },
        { status: 500 }
      );
    }

    // 사용자 정보에서 비밀번호 제거
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...userWithoutPassword } = newUser;

    return NextResponse.json(userWithoutPassword, { status: 201 });

  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 }
    );
  }
}
