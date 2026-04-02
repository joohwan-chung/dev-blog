import { updateMultipleSiteSettings } from './notion-settings';
import { SiteSettings } from '@/types/settings';

// Notion 데이터베이스에 기본 설정을 초기화하는 함수
export async function initializeNotionSettings(): Promise<boolean> {
  try {
    const defaultSettings: SiteSettings = {
      siteTitle: '주환의 개발 블로그',
      siteDescription: '개발과 기술에 대한 이야기를 나누는 공간입니다.',
      siteKeywords: '개발, 프로그래밍, 기술, 블로그',
      logoUrl: '',
      faviconUrl: '',
      postsPerPage: 10,
      allowComments: true,
      requireCommentApproval: true,
      showTagCloud: true,
      adminEmail: '',
      passwordMinLength: 8,
      maxLoginAttempts: 5,
      lockoutDuration: 30,
      notifyNewComments: true,
      notifyNewUsers: true,
      emailNotifications: true,
      metaTitle: '주환의 개발 블로그',
      metaDescription: '개발과 기술에 대한 이야기를 나누는 공간입니다.',
      generateSitemap: true,
      allowIndexing: true,
    };

    // SiteSettings를 Notion 형태로 변환
    const notionSettings = [
      // 기본 설정
      {
        key: 'siteTitle',
        value: defaultSettings.siteTitle,
        category: 'general',
        type: 'string',
        description: '사이트 제목',
        isActive: true,
      },
      {
        key: 'siteDescription',
        value: defaultSettings.siteDescription,
        category: 'general',
        type: 'string',
        description: '사이트 설명',
        isActive: true,
      },
      {
        key: 'siteKeywords',
        value: defaultSettings.siteKeywords,
        category: 'general',
        type: 'string',
        description: '사이트 키워드',
        isActive: true,
      },
      {
        key: 'adminEmail',
        value: defaultSettings.adminEmail,
        category: 'general',
        type: 'string',
        description: '관리자 이메일',
        isActive: true,
      },
      
      // 블로그 설정
      {
        key: 'postsPerPage',
        value: defaultSettings.postsPerPage.toString(),
        category: 'blog',
        type: 'number',
        description: '페이지당 포스트 수',
        isActive: true,
      },
      {
        key: 'allowComments',
        value: defaultSettings.allowComments.toString(),
        category: 'blog',
        type: 'boolean',
        description: '댓글 허용 여부',
        isActive: true,
      },
      {
        key: 'requireCommentApproval',
        value: defaultSettings.requireCommentApproval.toString(),
        category: 'blog',
        type: 'boolean',
        description: '댓글 승인 필요 여부',
        isActive: true,
      },
      {
        key: 'showTagCloud',
        value: defaultSettings.showTagCloud.toString(),
        category: 'blog',
        type: 'boolean',
        description: '태그 클라우드 표시 여부',
        isActive: true,
      },
      
      // 보안 설정
      {
        key: 'passwordMinLength',
        value: defaultSettings.passwordMinLength.toString(),
        category: 'security',
        type: 'number',
        description: '최소 비밀번호 길이',
        isActive: true,
      },
      {
        key: 'maxLoginAttempts',
        value: defaultSettings.maxLoginAttempts.toString(),
        category: 'security',
        type: 'number',
        description: '최대 로그인 시도 횟수',
        isActive: true,
      },
      {
        key: 'lockoutDuration',
        value: defaultSettings.lockoutDuration.toString(),
        category: 'security',
        type: 'number',
        description: '계정 잠금 시간 (분)',
        isActive: true,
      },
      
      // 알림 설정
      {
        key: 'notifyNewComments',
        value: defaultSettings.notifyNewComments.toString(),
        category: 'notifications',
        type: 'boolean',
        description: '새 댓글 알림',
        isActive: true,
      },
      {
        key: 'notifyNewUsers',
        value: defaultSettings.notifyNewUsers.toString(),
        category: 'notifications',
        type: 'boolean',
        description: '새 사용자 가입 알림',
        isActive: true,
      },
      {
        key: 'emailNotifications',
        value: defaultSettings.emailNotifications.toString(),
        category: 'notifications',
        type: 'boolean',
        description: '이메일 알림',
        isActive: true,
      },
      
      // SEO 설정
      {
        key: 'metaTitle',
        value: defaultSettings.metaTitle,
        category: 'seo',
        type: 'string',
        description: '메타 제목',
        isActive: true,
      },
      {
        key: 'metaDescription',
        value: defaultSettings.metaDescription,
        category: 'seo',
        type: 'string',
        description: '메타 설명',
        isActive: true,
      },
      {
        key: 'generateSitemap',
        value: defaultSettings.generateSitemap.toString(),
        category: 'seo',
        type: 'boolean',
        description: '사이트맵 자동 생성',
        isActive: true,
      },
      {
        key: 'allowIndexing',
        value: defaultSettings.allowIndexing.toString(),
        category: 'seo',
        type: 'boolean',
        description: '검색엔진 인덱싱 허용',
        isActive: true,
      },
      
      // 이미지 설정
      {
        key: 'logoUrl',
        value: defaultSettings.logoUrl,
        category: 'images',
        type: 'string',
        description: '로고 URL',
        isActive: true,
      },
      {
        key: 'faviconUrl',
        value: defaultSettings.faviconUrl,
        category: 'images',
        type: 'string',
        description: '파비콘 URL',
        isActive: true,
      },
    ];

    // Notion에 저장 (순차적으로 처리)
    await updateMultipleSiteSettings(notionSettings);
    return true;
  } catch (error) {
    console.error('Error initializing Notion settings:', error);
    return false;
  }
}
