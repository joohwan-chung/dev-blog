import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

// 임시 사용자 댓글 데이터 (실제로는 데이터베이스에서 가져와야 함)
const mockUserComments = [
  {
    id: 'uc_001',
    userId: 'user_001',
    postId: 'react-optimization-guide',
    postTitle: 'React 컴포넌트 최적화 가이드',
    postSlug: 'react-optimization-guide',
    content: '정말 유용한 글이네요! 특히 useMemo와 useCallback 사용법이 잘 정리되어 있어서 도움이 많이 되었습니다.',
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-15T10:30:00Z',
    isReply: false,
    parentId: null,
    postExcerpt: 'React 애플리케이션의 성능을 향상시키는 다양한 최적화 기법들을 알아보겠습니다.',
    likes: 3,
    replies: 1
  },
  {
    id: 'uc_002',
    userId: 'user_001',
    postId: 'typescript-guide',
    postTitle: 'TypeScript 기초부터 고급까지',
    postSlug: 'typescript-guide',
    content: 'TypeScript를 처음 배우는데 이 글이 정말 도움이 되었어요. 감사합니다!',
    createdAt: '2024-01-14T15:20:00Z',
    updatedAt: '2024-01-14T15:20:00Z',
    isReply: false,
    parentId: null,
    postExcerpt: 'TypeScript의 기본 개념부터 고급 기능까지 단계별로 학습해보세요.',
    likes: 1,
    replies: 0
  },
  {
    id: 'uc_003',
    userId: 'user_001',
    postId: 'nextjs-15-features',
    postTitle: 'Next.js 15 새로운 기능들',
    postSlug: 'nextjs-15-features',
    content: 'App Router에 대한 설명이 정말 자세하네요. 실제 프로젝트에 적용해보고 싶습니다.',
    createdAt: '2024-01-13T09:15:00Z',
    updatedAt: '2024-01-13T09:15:00Z',
    isReply: false,
    parentId: null,
    postExcerpt: 'Next.js 15에서 추가된 새로운 기능들과 개선사항을 살펴보겠습니다.',
    likes: 5,
    replies: 2
  },
  {
    id: 'uc_004',
    userId: 'user_001',
    postId: 'vue-vs-react',
    postTitle: 'Vue.js vs React 비교',
    postSlug: 'vue-vs-react',
    content: 'Vue와 React 둘 다 사용해봤는데, 각각의 장단점이 잘 정리되어 있네요.',
    createdAt: '2024-01-12T16:30:00Z',
    updatedAt: '2024-01-12T16:30:00Z',
    isReply: false,
    parentId: null,
    postExcerpt: 'Vue.js와 React의 차이점과 각각의 장단점을 비교해보겠습니다.',
    likes: 2,
    replies: 0
  },
  {
    id: 'uc_005',
    userId: 'user_001',
    postId: 'react-optimization-guide',
    postTitle: 'React 컴포넌트 최적화 가이드',
    postSlug: 'react-optimization-guide',
    content: '좋은 정보 감사합니다! 혹시 더 자세한 예제가 있나요?',
    createdAt: '2024-01-11T14:45:00Z',
    updatedAt: '2024-01-11T14:45:00Z',
    isReply: true,
    parentId: 'uc_001',
    postExcerpt: 'React 애플리케이션의 성능을 향상시키는 다양한 최적화 기법들을 알아보겠습니다.',
    likes: 0,
    replies: 0
  },
  {
    id: 'uc_006',
    userId: 'user_001',
    postId: 'css-grid-guide',
    postTitle: 'CSS Grid 완벽 가이드',
    postSlug: 'css-grid-guide',
    content: 'CSS Grid를 이제야 제대로 이해하게 되었네요. 정말 감사합니다!',
    createdAt: '2024-01-10T11:20:00Z',
    updatedAt: '2024-01-10T11:20:00Z',
    isReply: false,
    parentId: null,
    postExcerpt: 'CSS Grid를 활용한 레이아웃 디자인 기법을 마스터해보세요.',
    likes: 4,
    replies: 1
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

    // 사용자의 댓글 목록 필터링
    const userComments = mockUserComments.filter(comment => comment.userId === userId);

    // 쿼리 파라미터로 필터링
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');

    let filteredComments = userComments;
    if (type === 'comments') {
      filteredComments = userComments.filter(comment => !comment.isReply);
    } else if (type === 'replies') {
      filteredComments = userComments.filter(comment => comment.isReply);
    }

    // 정렬 (최신순)
    filteredComments.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return NextResponse.json(filteredComments);

  } catch (error) {
    console.error('Get user comments error:', error);
    return NextResponse.json(
      { message: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
