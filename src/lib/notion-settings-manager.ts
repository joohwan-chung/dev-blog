import { SiteSettings } from '@/types/settings';
import { getSiteSettings, parseSettingValue, stringifySettingValue } from './notion-settings';

// Notion에서 설정을 불러와서 SiteSettings 형태로 변환
export async function getNotionSettings(): Promise<SiteSettings> {
  try {
    const settings = await getSiteSettings();
    
    // Notion에서 가져온 설정으로만 구성
    const notionSettings: Partial<SiteSettings> = {};
    
    settings.forEach(setting => {
      const value = parseSettingValue(setting.value, setting.type);
      
      switch (setting.key) {
        // 기본 설정
        case 'siteTitle':
          notionSettings.siteTitle = value as string;
          break;
        case 'siteDescription':
          notionSettings.siteDescription = value as string;
          break;
        case 'siteKeywords':
          notionSettings.siteKeywords = value as string;
          break;
        case 'adminEmail':
          notionSettings.adminEmail = value as string;
          break;
        
        // 블로그 설정
        case 'postsPerPage':
          notionSettings.postsPerPage = value as number;
          break;
        case 'allowComments':
          notionSettings.allowComments = value as boolean;
          break;
        case 'requireCommentApproval':
          notionSettings.requireCommentApproval = value as boolean;
          break;
        case 'showTagCloud':
          notionSettings.showTagCloud = value as boolean;
          break;
        
        // 보안 설정
        case 'passwordMinLength':
          notionSettings.passwordMinLength = value as number;
          break;
        case 'maxLoginAttempts':
          notionSettings.maxLoginAttempts = value as number;
          break;
        case 'lockoutDuration':
          notionSettings.lockoutDuration = value as number;
          break;
        
        // 알림 설정
        case 'notifyNewComments':
          notionSettings.notifyNewComments = value as boolean;
          break;
        case 'notifyNewUsers':
          notionSettings.notifyNewUsers = value as boolean;
          break;
        case 'emailNotifications':
          notionSettings.emailNotifications = value as boolean;
          break;
        
        // SEO 설정
        case 'metaTitle':
          notionSettings.metaTitle = value as string;
          break;
        case 'metaDescription':
          notionSettings.metaDescription = value as string;
          break;
        case 'generateSitemap':
          notionSettings.generateSitemap = value as boolean;
          break;
        case 'allowIndexing':
          notionSettings.allowIndexing = value as boolean;
          break;
        
        // 이미지 설정
        case 'logoUrl':
          notionSettings.logoUrl = value as string;
          break;
        case 'faviconUrl':
          notionSettings.faviconUrl = value as string;
          break;
      }
    });

    // Notion에서 가져온 설정이 있으면 사용, 없으면 기본값 사용
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

    return { ...defaultSettings, ...notionSettings };
  } catch (error) {
    console.error('Error loading settings from Notion:', error);
    throw error; // 오류를 다시 던져서 상위에서 처리하도록 함
  }
}

// SiteSettings를 Notion에 저장할 형태로 변환
export function convertToNotionSettings(settings: SiteSettings) {
  return [
    // 기본 설정
    {
      key: 'siteTitle',
      value: stringifySettingValue(settings.siteTitle, 'string'),
      category: 'general',
      type: 'string',
      description: '사이트 제목',
      isActive: true,
    },
    {
      key: 'siteDescription',
      value: stringifySettingValue(settings.siteDescription, 'string'),
      category: 'general',
      type: 'string',
      description: '사이트 설명',
      isActive: true,
    },
    {
      key: 'siteKeywords',
      value: stringifySettingValue(settings.siteKeywords, 'string'),
      category: 'general',
      type: 'string',
      description: '사이트 키워드',
      isActive: true,
    },
    {
      key: 'adminEmail',
      value: stringifySettingValue(settings.adminEmail, 'string'),
      category: 'general',
      type: 'string',
      description: '관리자 이메일',
      isActive: true,
    },
    
    // 블로그 설정
    {
      key: 'postsPerPage',
      value: stringifySettingValue(settings.postsPerPage, 'number'),
      category: 'blog',
      type: 'number',
      description: '페이지당 포스트 수',
      isActive: true,
    },
    {
      key: 'allowComments',
      value: stringifySettingValue(settings.allowComments, 'boolean'),
      category: 'blog',
      type: 'boolean',
      description: '댓글 허용 여부',
      isActive: true,
    },
    {
      key: 'requireCommentApproval',
      value: stringifySettingValue(settings.requireCommentApproval, 'boolean'),
      category: 'blog',
      type: 'boolean',
      description: '댓글 승인 필요 여부',
      isActive: true,
    },
    {
      key: 'showTagCloud',
      value: stringifySettingValue(settings.showTagCloud, 'boolean'),
      category: 'blog',
      type: 'boolean',
      description: '태그 클라우드 표시 여부',
      isActive: true,
    },
    
    // 보안 설정
    {
      key: 'passwordMinLength',
      value: stringifySettingValue(settings.passwordMinLength, 'number'),
      category: 'security',
      type: 'number',
      description: '최소 비밀번호 길이',
      isActive: true,
    },
    {
      key: 'maxLoginAttempts',
      value: stringifySettingValue(settings.maxLoginAttempts, 'number'),
      category: 'security',
      type: 'number',
      description: '최대 로그인 시도 횟수',
      isActive: true,
    },
    {
      key: 'lockoutDuration',
      value: stringifySettingValue(settings.lockoutDuration, 'number'),
      category: 'security',
      type: 'number',
      description: '계정 잠금 시간 (분)',
      isActive: true,
    },
    
    // 알림 설정
    {
      key: 'notifyNewComments',
      value: stringifySettingValue(settings.notifyNewComments, 'boolean'),
      category: 'notifications',
      type: 'boolean',
      description: '새 댓글 알림',
      isActive: true,
    },
    {
      key: 'notifyNewUsers',
      value: stringifySettingValue(settings.notifyNewUsers, 'boolean'),
      category: 'notifications',
      type: 'boolean',
      description: '새 사용자 가입 알림',
      isActive: true,
    },
    {
      key: 'emailNotifications',
      value: stringifySettingValue(settings.emailNotifications, 'boolean'),
      category: 'notifications',
      type: 'boolean',
      description: '이메일 알림',
      isActive: true,
    },
    
    // SEO 설정
    {
      key: 'metaTitle',
      value: stringifySettingValue(settings.metaTitle, 'string'),
      category: 'seo',
      type: 'string',
      description: '메타 제목',
      isActive: true,
    },
    {
      key: 'metaDescription',
      value: stringifySettingValue(settings.metaDescription, 'string'),
      category: 'seo',
      type: 'string',
      description: '메타 설명',
      isActive: true,
    },
    {
      key: 'generateSitemap',
      value: stringifySettingValue(settings.generateSitemap, 'boolean'),
      category: 'seo',
      type: 'boolean',
      description: '사이트맵 자동 생성',
      isActive: true,
    },
    {
      key: 'allowIndexing',
      value: stringifySettingValue(settings.allowIndexing, 'boolean'),
      category: 'seo',
      type: 'boolean',
      description: '검색엔진 인덱싱 허용',
      isActive: true,
    },
    
    // 이미지 설정
    {
      key: 'logoUrl',
      value: stringifySettingValue(settings.logoUrl, 'string'),
      category: 'images',
      type: 'string',
      description: '로고 URL',
      isActive: true,
    },
    {
      key: 'faviconUrl',
      value: stringifySettingValue(settings.faviconUrl, 'string'),
      category: 'images',
      type: 'string',
      description: '파비콘 URL',
      isActive: true,
    },
  ];
}
