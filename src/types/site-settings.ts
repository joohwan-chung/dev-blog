export interface SiteSetting {
  id: string;
  key: string;
  value: string;
  category: 'general' | 'blog' | 'security' | 'notifications' | 'seo' | 'images';
  type: 'string' | 'number' | 'boolean' | 'array';
  description: string;
  isActive: boolean;
  updatedAt: string;
}

export interface SiteSettingsResponse {
  success: boolean;
  settings?: SiteSetting[];
  message?: string;
}

export interface SiteSettingUpdateRequest {
  key: string;
  value: string;
  category: string;
  type: string;
  description: string;
  isActive: boolean;
}

export interface SiteSettingsUpdateRequest {
  settings: Partial<SiteSettingUpdateRequest>[];
}
