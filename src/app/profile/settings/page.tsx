'use client';

import { useState, useEffect, useMemo, memo, useTransition } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useTheme } from '@/lib/theme-context';
import { useLanguage } from '@/lib/language-context';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { NotificationSettings } from '@/components/notifications/notification-settings';
import { 
  User, 
  Settings, 
  Save, 
  AlertCircle, 
  CheckCircle,
  Upload,
  Trash2
} from 'lucide-react';
import { useRouter } from 'next/navigation';

const ProfileSettingsPage = memo(function ProfileSettingsPage() {
  // 모든 Hook들을 컴포넌트 최상단에 순서대로 배치
  const { user, updateProfile, isAuthenticated, isLoading } = useAuth();
  const { theme, setTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();
  const router = useRouter();
  const [, startTransition] = useTransition();
  
  // useState Hook들
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    avatar: '',
    preferences: {
      theme: 'system' as 'light' | 'dark' | 'system',
      language: 'ko' as 'ko' | 'en',
      notifications: {
        email: true,
        push: false
      }
    }
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isDeletingImage, setIsDeletingImage] = useState(false);

  // useMemo Hook을 useState 다음에 배치
  const translatedTexts = useMemo(() => ({
    title: t('profile.title'),
    subtitle: t('profile.subtitle'),
    profileInfo: t('profile.profile_info'),
    name: t('profile.name'),
    namePlaceholder: t('profile.name_placeholder'),
    email: t('profile.email'),
    emailReadonly: t('profile.email_readonly'),
    themeSettings: t('profile.theme_settings'),
    theme: t('profile.theme'),
    themeLight: t('profile.theme_light'),
    themeDark: t('profile.theme_dark'),
    themeSystem: t('profile.theme_system'),
    language: t('profile.language'),
    languageKo: t('profile.language_ko'),
    languageEn: t('profile.language_en'),
    notificationSettings: t('profile.notification_settings'),
    emailNotification: t('profile.email_notification'),
    emailNotificationDesc: t('profile.email_notification_desc'),
    pushNotification: t('profile.push_notification'),
    pushNotificationDesc: t('profile.push_notification_desc'),
    passwordChange: t('profile.password_change'),
    currentPassword: t('profile.current_password'),
    currentPasswordPlaceholder: t('profile.current_password_placeholder'),
    newPassword: t('profile.new_password'),
    newPasswordPlaceholder: t('profile.new_password_placeholder'),
    confirmPassword: t('profile.confirm_password'),
    confirmPasswordPlaceholder: t('profile.confirm_password_placeholder'),
    imageUpload: t('profile.image_upload'),
    imageDelete: t('profile.image_delete'),
    imageRecommendation: t('profile.image_recommendation'),
    uploading: t('profile.uploading'),
    deleting: t('profile.deleting'),
    saving: t('profile.saving'),
    changing: t('profile.changing'),
    featureComingSoon: t('message.feature_coming_soon'),
  }), [t]);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, isLoading, router]);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        avatar: user.avatar || '',
        preferences: {
          theme: (user.preferences?.theme as 'light' | 'dark' | 'system') || 'system',
          language: (user.preferences?.language as 'ko' | 'en') || 'ko',
          notifications: user.preferences?.notifications || { email: true, push: false }
        }
      });
      // 사용자 프로필의 테마와 언어 설정을 컨텍스트에 동기화
      if (user.preferences?.theme && ['light', 'dark', 'system'].includes(user.preferences.theme)) {
        setTheme(user.preferences.theme as 'light' | 'dark' | 'system');
      }
      if (user.preferences?.language && ['ko', 'en'].includes(user.preferences.language)) {
        setLanguage(user.preferences.language as 'ko' | 'en');
      }
    }
  }, [user, setTheme, setLanguage]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">로딩 중...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            로그인이 필요합니다
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            설정을 변경하려면 로그인해주세요.
          </p>
          <Button onClick={() => router.push('/')}>
            홈으로 이동
          </Button>
        </div>
      </div>
    );
  }

  const handleInputChange = (field: string, value: unknown) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...(prev[parent as keyof typeof prev] as Record<string, unknown>),
          [child]: value
        }
      }));
    } else if (field.includes('notifications.')) {
      const [, notificationType] = field.split('.');
      setFormData(prev => ({
        ...prev,
        preferences: {
          ...prev.preferences,
          notifications: {
            ...prev.preferences.notifications,
            [notificationType]: value
          }
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
    
    // 메시지 초기화
    if (message) setMessage(null);
  };

  const handleThemeChange = (newTheme: 'light' | 'dark' | 'system') => {
    setTheme(newTheme);
    setFormData(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        theme: newTheme
      }
    }));
  };

  const handleLanguageChange = (newLanguage: 'ko' | 'en') => {
    startTransition(() => {
      setLanguage(newLanguage);
      setFormData(prev => ({
        ...prev,
        preferences: {
          ...prev.preferences,
          language: newLanguage
        }
      }));
    });
  };


  const handleSave = async () => {
    setIsSaving(true);
    setMessage(null);

    try {
      const result = await updateProfile(formData);
      if (result.success) {
        setMessage({ type: 'success', text: result.message });
      } else {
        setMessage({ type: 'error', text: result.message });
      }
      } catch {
      setMessage({ type: 'error', text: '설정 저장 중 오류가 발생했습니다.' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      setMessage({ type: 'error', text: '모든 필드를 입력해주세요.' });
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage({ type: 'error', text: '새 비밀번호가 일치하지 않습니다.' });
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setMessage({ type: 'error', text: '새 비밀번호는 6자 이상이어야 합니다.' });
      return;
    }

    setIsChangingPassword(true);
    setMessage(null);

    try {
      const response = await fetch('/api/auth/change-password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ type: 'success', text: '비밀번호가 성공적으로 변경되었습니다.' });
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
      } else {
        setMessage({ type: 'error', text: data.message || '비밀번호 변경에 실패했습니다.' });
      }
    } catch (error) {
      console.error('Password change error:', error);
      setMessage({ type: 'error', text: '비밀번호 변경에 실패했습니다.' });
    } finally {
      setIsChangingPassword(false);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // 파일 크기 확인 (10MB 제한)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      setMessage({ type: 'error', text: '파일 크기는 10MB를 초과할 수 없습니다.' });
      return;
    }

    // 파일 타입 확인
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      setMessage({ type: 'error', text: '지원하지 않는 파일 형식입니다. (JPEG, PNG, GIF, WebP만 허용)' });
      return;
    }

    setIsUploadingImage(true);
    setMessage(null);

    try {
      const formData = new FormData();
      formData.append('image', file);

      const response = await fetch('/api/auth/upload-avatar', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ type: 'success', text: data.message });
        setFormData(prev => ({
          ...prev,
          avatar: data.avatar || ''
        }));
        // auth context 업데이트
        if (updateProfile) {
          await updateProfile({ avatar: data.avatar });
        }
      } else {
        setMessage({ type: 'error', text: data.message });
      }
    } catch (error) {
      console.error('Image upload error:', error);
      setMessage({ type: 'error', text: '이미지 업로드에 실패했습니다.' });
    } finally {
      setIsUploadingImage(false);
      // input 값 초기화
      event.target.value = '';
    }
  };

  const handleImageDelete = async () => {
    if (!confirm('프로필 이미지를 삭제하시겠습니까?')) {
      return;
    }

    setIsDeletingImage(true);
    setMessage(null);

    try {
      const response = await fetch('/api/auth/delete-avatar', {
        method: 'DELETE',
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ type: 'success', text: data.message });
        setFormData(prev => ({
          ...prev,
          avatar: ''
        }));
        // auth context 업데이트
        if (updateProfile) {
          await updateProfile({ avatar: '' });
        }
      } else {
        setMessage({ type: 'error', text: data.message });
      }
    } catch (error) {
      console.error('Image delete error:', error);
      setMessage({ type: 'error', text: '이미지 삭제에 실패했습니다.' });
    } finally {
      setIsDeletingImage(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="space-y-6">
          {/* 페이지 헤더 */}
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">{translatedTexts.title}</h1>
            <p className="text-slate-600 dark:text-slate-400 mt-2">
              {translatedTexts.subtitle}
            </p>
          </div>

          {/* 프로필 정보 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="h-5 w-5 mr-2" />
                {translatedTexts.profileInfo}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* 아바타 */}
              <div className="flex items-center space-x-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={formData.avatar} alt={formData.name} />
                  <AvatarFallback className="bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-xl font-bold">
                    {getInitials(formData.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-4">
                    <div className="relative">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        disabled={isUploadingImage}
                      />
                      <Button 
                        variant="outline" 
                        size="sm" 
                        disabled={isUploadingImage}
                        className="cursor-pointer"
                      >
                        {isUploadingImage ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600 mr-2"></div>
                            {translatedTexts.uploading}
                          </>
                        ) : (
                          <>
                            <Upload className="h-4 w-4 mr-2" />
                            {translatedTexts.imageUpload}
                          </>
                        )}
                      </Button>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-red-600 hover:text-red-700"
                      onClick={handleImageDelete}
                      disabled={isDeletingImage || !formData.avatar}
                    >
                      {isDeletingImage ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600 mr-2"></div>
                          {translatedTexts.deleting}
                        </>
                      ) : (
                        <>
                          <Trash2 className="h-4 w-4 mr-2" />
                          {translatedTexts.imageDelete}
                        </>
                      )}
                    </Button>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {translatedTexts.imageRecommendation}
                  </p>
                </div>
              </div>

              {/* 이름 */}
              <div className="space-y-2">
                <Label htmlFor="name">{translatedTexts.name}</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder={translatedTexts.namePlaceholder}
                />
              </div>

              {/* 이메일 */}
              <div className="space-y-2">
                <Label htmlFor="email">{translatedTexts.email}</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  readOnly
                  disabled
                  className="bg-gray-100 dark:bg-gray-800 cursor-not-allowed"
                  placeholder={translatedTexts.namePlaceholder}
                />
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {translatedTexts.emailReadonly}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* 테마 설정 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Settings className="h-5 w-5 mr-2" />
                {translatedTexts.themeSettings}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>{translatedTexts.theme}</Label>
                <Select
                  value={theme}
                  onValueChange={(value) => handleThemeChange(value as 'light' | 'dark' | 'system')}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">{translatedTexts.themeLight}</SelectItem>
                    <SelectItem value="dark">{translatedTexts.themeDark}</SelectItem>
                    <SelectItem value="system">{translatedTexts.themeSystem}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>{translatedTexts.language}</Label>
                <Select
                  value={language}
                  onValueChange={(value) => handleLanguageChange(value as 'ko' | 'en')}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ko">{translatedTexts.languageKo}</SelectItem>
                    <SelectItem value="en">{translatedTexts.languageEn}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* 웹 알림 설정 */}
          <NotificationSettings />

          {/* 비밀번호 변경 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Settings className="h-5 w-5 mr-2" />
                비밀번호 변경
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">현재 비밀번호</Label>
                <Input
                  id="currentPassword"
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                  placeholder="현재 비밀번호를 입력하세요"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="newPassword">새 비밀번호</Label>
                <Input
                  id="newPassword"
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                  placeholder="새 비밀번호를 입력하세요 (6자 이상)"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">새 비밀번호 확인</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                  placeholder="새 비밀번호를 다시 입력하세요"
                />
              </div>

              <div className="flex justify-end">
                <Button
                  onClick={handleChangePassword}
                  disabled={isChangingPassword}
                  variant="outline"
                  className="min-w-[120px]"
                >
                  {isChangingPassword ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600 mr-2"></div>
                      변경 중...
                    </>
                  ) : (
                    '비밀번호 변경'
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* 메시지 */}
          {message && (
            <div className={`flex items-center space-x-2 p-4 rounded-lg ${message.type === 'success'
                ? 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400'
                : 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400'
              }`}>
              {message.type === 'success' ? (
                <CheckCircle className="h-5 w-5" />
              ) : (
                <AlertCircle className="h-5 w-5" />
              )}
              <span>{message.text}</span>
            </div>
          )}

          {/* 저장 버튼 */}
          <div className="flex justify-end">
            <Button onClick={handleSave} disabled={isSaving} className="min-w-[120px]">
              {isSaving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  저장 중...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  저장
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
});

export default ProfileSettingsPage;
