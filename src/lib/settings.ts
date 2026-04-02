import { SiteSettings } from '@/types/settings';
import { getNotionSettings } from './notion-settings-manager';

const SETTINGS_STORAGE_KEY = 'admin-settings';

export const defaultSettings: SiteSettings = {
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

// Notion에서 설정을 불러오는 함수 (서버 사이드)
export const getSettings = async (): Promise<SiteSettings> => {
  try {
    return await getNotionSettings();
  } catch (error) {
    console.error('Notion에서 설정을 불러올 수 없습니다:', error);
    return defaultSettings;
  }
};

// 클라이언트 사이드에서 사용하는 함수 (로컬 스토리지 fallback)
export const getSettingsClient = (): SiteSettings => {
  if (typeof window === 'undefined') {
    return defaultSettings;
  }
  
  try {
    const savedSettings = localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (savedSettings) {
      return { ...defaultSettings, ...JSON.parse(savedSettings) };
    }
  } catch (error) {
    console.error('설정 불러오기 실패:', error);
  }
  
  return defaultSettings;
};

export const saveSettings = (settings: SiteSettings): boolean => {
  if (typeof window === 'undefined') {
    return false;
  }
  
  try {
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
    return true;
  } catch (error) {
    console.error('설정 저장 실패:', error);
    return false;
  }
};

export const resetSettings = (): SiteSettings => {
  if (typeof window === 'undefined') {
    return defaultSettings;
  }
  
  try {
    localStorage.removeItem(SETTINGS_STORAGE_KEY);
    return defaultSettings;
  } catch (error) {
    console.error('설정 초기화 실패:', error);
    return defaultSettings;
  }
};

// 설정 유효성 검사
export const validateSettings = (settings: Partial<SiteSettings>): string[] => {
  const errors: string[] = [];
  
  if (settings.siteTitle && settings.siteTitle.length < 1) {
    errors.push('사이트 제목은 1자 이상이어야 합니다.');
  }
  
  if (settings.siteDescription && settings.siteDescription.length < 10) {
    errors.push('사이트 설명은 10자 이상이어야 합니다.');
  }
  
  if (settings.postsPerPage && (settings.postsPerPage < 1 || settings.postsPerPage > 50)) {
    errors.push('페이지당 포스트 수는 1-50 사이여야 합니다.');
  }
  
  if (settings.passwordMinLength && (settings.passwordMinLength < 6 || settings.passwordMinLength > 20)) {
    errors.push('최소 비밀번호 길이는 6-20자 사이여야 합니다.');
  }
  
  if (settings.maxLoginAttempts && (settings.maxLoginAttempts < 3 || settings.maxLoginAttempts > 10)) {
    errors.push('최대 로그인 시도 횟수는 3-10 사이여야 합니다.');
  }
  
  if (settings.lockoutDuration && (settings.lockoutDuration < 5 || settings.lockoutDuration > 60)) {
    errors.push('계정 잠금 시간은 5-60분 사이여야 합니다.');
  }
  
  if (settings.adminEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(settings.adminEmail)) {
    errors.push('올바른 이메일 형식이 아닙니다.');
  }
  
  return errors;
};
