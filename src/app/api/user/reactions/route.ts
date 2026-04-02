import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

// 임시 사용자 반응 데이터 (실제로는 데이터베이스에서 가져와야 함)
const mockUserReactions = [
  {
    id: 'ur_001',
    userId: 'user_001',
    postId: 'react-optimization-guide',
    postTitle: 'React 컴포넌트 최적화 가이드',
    postSlug: 'react-optimization-guide',
    reactionType: 'like' as const,
    createdAt: '2024-01-15T10:30:00Z',
    postExcerpt: 'React 애플리케이션의 성능을 향상시키는 다양한 최적화 기법들을 알아보겠습니다.'
  },
  {
    id: 'ur_002',
    userId: 'user_001',
    postId: 'typescript-guide',
    postTitle: 'TypeScript 기초부터 고급까지',
    postSlug: 'typescript-guide',
    reactionType: 'recommend' as const,
    createdAt: '2024-01-14T15:20:00Z',
    postExcerpt: 'TypeScript의 기본 개념부터 고급 기능까지 단계별로 학습해보세요.'
  },
  {
    id: 'ur_003',
    userId: 'user_001',
    postId: 'nextjs-15-features',
    postTitle: 'Next.js 15 새로운 기능들',
    postSlug: 'nextjs-15-features',
    reactionType: 'like' as const,
    createdAt: '2024-01-13T09:15:00Z',
    postExcerpt: 'Next.js 15에서 추가된 새로운 기능들과 개선사항을 살펴보겠습니다.'
  },
  {
    id: 'ur_004',
    userId: 'user_001',
    postId: 'vue-vs-react',
    postTitle: 'Vue.js vs React 비교',
    postSlug: 'vue-vs-react',
    reactionType: 'not_recommend' as const,
    createdAt: '2024-01-12T16:30:00Z',
    postExcerpt: 'Vue.js와 React의 차이점과 각각의 장단점을 비교해보겠습니다.'
  },
  {
    id: 'ur_005',
    userId: 'user_001',
    postId: 'css-grid-guide',
    postTitle: 'CSS Grid 완벽 가이드',
    postSlug: 'css-grid-guide',
    reactionType: 'recommend' as const,
    createdAt: '2024-01-11T14:45:00Z',
    postExcerpt: 'CSS Grid를 활용한 레이아웃 디자인 기법을 마스터해보세요.'
  }
];

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

    // 세션 토큰에서 사용자 ID 추출 (실제로는 JWT 디코딩이나 세션 검증을 해야 함)
    // 토큰 형식: session_user_001_1234567890
    const tokenParts = sessionToken.value.split('_');
    const userId = tokenParts.length >= 3 ? `${tokenParts[1]}_${tokenParts[2]}` : null;

    if (!userId) {
      return NextResponse.json(
        { message: '유효하지 않은 세션입니다.' },
        { status: 401 }
      );
    }

    // 사용자의 반응 목록 필터링
    const userReactions = mockUserReactions.filter(reaction => reaction.userId === userId);

    // 쿼리 파라미터로 필터링
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');

    let filteredReactions = userReactions;
    if (type && type !== 'all') {
      filteredReactions = userReactions.filter(reaction => reaction.reactionType === type);
    }

    // 정렬 (최신순)
    filteredReactions.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return NextResponse.json(filteredReactions);

  } catch (error) {
    console.error('Get user reactions error:', error);
    return NextResponse.json(
      { message: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
