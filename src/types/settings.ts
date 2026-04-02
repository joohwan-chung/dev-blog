export interface SiteSettings {
  // 사이트 기본 설정
  siteTitle: string;
  siteDescription: string;
  siteKeywords: string;
  logoUrl: string;
  faviconUrl: string;
  
  // 블로그 설정
  postsPerPage: number;
  allowComments: boolean;
  requireCommentApproval: boolean;
  showTagCloud: boolean;
  
  // 보안 설정
  adminEmail: string;
  passwordMinLength: number;
  maxLoginAttempts: number;
  lockoutDuration: number;
  
  // 알림 설정
  notifyNewComments: boolean;
  notifyNewUsers: boolean;
  emailNotifications: boolean;
  
  // SEO 설정
  metaTitle: string;
  metaDescription: string;
  generateSitemap: boolean;
  allowIndexing: boolean;
}

export interface SettingsUpdateRequest {
  settings: Partial<SiteSettings>;
}

export interface SettingsResponse {
  success: boolean;
  settings?: SiteSettings;
  message?: string;
}
