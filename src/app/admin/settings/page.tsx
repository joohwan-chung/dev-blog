'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Save, Upload } from 'lucide-react';
import { toast } from 'sonner';
import { SiteSettings } from '@/types/settings';
import { validateSettings } from '@/lib/settings';

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<SiteSettings>({
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
  });
  const [isLoading, setIsLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/admin/settings');
      const data = await response.json();

      if (data.success && data.settings) {
        setSettings(data.settings);
        if (data.message) {
          toast.success('설정 불러오기 완료', {
            description: data.message,
            duration: 3000,
          });
        } else {
          toast.success('설정 불러오기 완료', {
            description: 'Notion에서 설정을 성공적으로 불러왔습니다.',
            duration: 3000,
          });
        }
      } else {
        if (response.status === 400) {
          toast.error('Notion 설정 오류', {
            description: 'Notion 설정이 필요합니다. 환경 변수를 확인해주세요.',
            duration: 5000,
          });
        } else {
          toast.error('설정 불러오기 실패', {
            description: data.message || '설정을 불러오는데 실패했습니다.',
            duration: 5000,
          });
        }
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
      toast.error('연결 실패', {
        description: 'Notion 연결에 실패했습니다. 기본값을 사용합니다.',
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    // 유효성 검사
    const errors = validateSettings(settings);
    if (errors.length > 0) {
      setValidationErrors(errors);
      toast.error('설정 검증 실패', {
        description: '설정 값에 오류가 있습니다. 아래 오류 목록을 확인해주세요.',
        duration: 5000,
      });
      return;
    }

    setIsLoading(true);
    setValidationErrors([]);

    try {
      const response = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ settings }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success('설정 저장 완료', {
          description: '설정이 Notion에 성공적으로 저장되었습니다.',
          duration: 3000,
        });
      } else {
        throw new Error(data.message || '설정 저장 실패');
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('설정 저장 실패', {
        description: '설정 저장에 실패했습니다. 다시 시도해주세요.',
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  };


  const handleInputChange = (key: keyof SiteSettings, value: string | number | boolean) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleToggleChange = async (key: keyof SiteSettings, value: boolean) => {
    // 즉시 로컬 상태 업데이트
    setSettings(prev => ({ ...prev, [key]: value }));

    try {
      // 즉시 서버에 저장
      const updatedSettings = { ...settings, [key]: value };
      const response = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ settings: updatedSettings }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success('설정 적용 완료', {
          description: `${key === 'allowComments' ? '댓글 허용' : '설정'}이 즉시 적용되었습니다.`,
          duration: 2000,
        });
      } else {
        // 실패 시 원래 상태로 되돌리기
        setSettings(prev => ({ ...prev, [key]: !value }));
        throw new Error(data.message || '설정 저장 실패');
      }
    } catch (error) {
      console.error('Error updating setting:', error);
      toast.error('설정 적용 실패', {
        description: '설정 적용에 실패했습니다. 다시 시도해주세요.',
        duration: 3000,
      });
    }
  };



  return (
    <div className="container mx-auto p-4 sm:p-6 space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">사이트 설정</h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-1">블로그의 다양한 설정을 관리할 수 있습니다.</p>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={handleSave} 
            disabled={isLoading} 
            className="flex items-center gap-2 w-full sm:w-auto"
          >
            <Save className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="text-sm sm:text-base">
              {isLoading ? '저장 중...' : '설정 저장'}
            </span>
          </Button>
        </div>
      </div>

      {validationErrors.length > 0 && (
        <div className="bg-destructive/15 border border-destructive/20 rounded-lg p-4">
          <h3 className="font-semibold text-destructive mb-2">설정 오류</h3>
          <ul className="list-disc list-inside space-y-1 text-sm text-destructive">
            {validationErrors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </div>
      )}

      <Tabs defaultValue="general" className="space-y-4 sm:space-y-6">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 h-auto">
          <TabsTrigger value="general" className="text-xs sm:text-sm py-2 px-2 sm:px-3">
            <span className="hidden sm:inline">기본 설정</span>
            <span className="sm:hidden">기본</span>
          </TabsTrigger>
          <TabsTrigger value="blog" className="text-xs sm:text-sm py-2 px-2 sm:px-3">
            <span className="hidden sm:inline">블로그</span>
            <span className="sm:hidden">블로그</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="text-xs sm:text-sm py-2 px-2 sm:px-3">
            <span className="hidden sm:inline">보안</span>
            <span className="sm:hidden">보안</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="text-xs sm:text-sm py-2 px-2 sm:px-3">
            <span className="hidden sm:inline">알림</span>
            <span className="sm:hidden">알림</span>
          </TabsTrigger>
          <TabsTrigger value="seo" className="text-xs sm:text-sm py-2 px-2 sm:px-3">
            <span className="hidden sm:inline">SEO</span>
            <span className="sm:hidden">SEO</span>
          </TabsTrigger>
        </TabsList>

        {/* 기본 설정 */}
        <TabsContent value="general" className="space-y-4 sm:space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base sm:text-lg">사이트 기본 정보</CardTitle>
              <CardDescription className="text-sm">사이트의 기본 정보를 설정합니다.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="siteTitle" className="text-sm font-medium">사이트 제목</Label>
                  <Input
                    id="siteTitle"
                    value={settings.siteTitle}
                    onChange={(e) => handleInputChange('siteTitle', e.target.value)}
                    placeholder="사이트 제목을 입력하세요"
                    className="text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="adminEmail" className="text-sm font-medium">관리자 이메일</Label>
                  <Input
                    id="adminEmail"
                    type="email"
                    value={settings.adminEmail}
                    onChange={(e) => handleInputChange('adminEmail', e.target.value)}
                    placeholder="admin@example.com"
                    className="text-sm"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="siteDescription" className="text-sm font-medium">사이트 설명</Label>
                <Textarea
                  id="siteDescription"
                  value={settings.siteDescription}
                  onChange={(e) => handleInputChange('siteDescription', e.target.value)}
                  placeholder="사이트에 대한 간단한 설명을 입력하세요"
                  rows={3}
                  className="text-sm"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="siteKeywords" className="text-sm font-medium">키워드</Label>
                <Input
                  id="siteKeywords"
                  value={settings.siteKeywords}
                  onChange={(e) => handleInputChange('siteKeywords', e.target.value)}
                  placeholder="키워드를 쉼표로 구분하여 입력하세요"
                  className="text-sm"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex flex-col sm:flex-row sm:items-center gap-2">
                <span className="text-base sm:text-lg">이미지 설정</span>
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full self-start sm:self-auto">
                  URL 입력만 가능
                </span>
              </CardTitle>
              <CardDescription className="text-sm">로고와 파비콘을 설정합니다. (URL 직접 입력만 가능)</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="logoUrl" className="text-sm font-medium">로고 URL</Label>
                  <div className="flex gap-2">
                    <Input
                      id="logoUrl"
                      value={settings.logoUrl}
                      onChange={(e) => handleInputChange('logoUrl', e.target.value)}
                      placeholder="로고 이미지 URL을 입력하세요"
                      className="text-sm"
                    />
                    <Button variant="outline" size="icon" disabled title="파일 업로드 기능은 구현 예정입니다" className="h-9 w-9 flex-shrink-0">
                      <Upload className="h-3 w-3 sm:h-4 sm:w-4" />
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="faviconUrl" className="text-sm font-medium">파비콘 URL</Label>
                  <div className="flex gap-2">
                    <Input
                      id="faviconUrl"
                      value={settings.faviconUrl}
                      onChange={(e) => handleInputChange('faviconUrl', e.target.value)}
                      placeholder="파비콘 이미지 URL을 입력하세요"
                      className="text-sm"
                    />
                    <Button variant="outline" size="icon" disabled title="파일 업로드 기능은 구현 예정입니다" className="h-9 w-9 flex-shrink-0">
                      <Upload className="h-3 w-3 sm:h-4 sm:w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 블로그 설정 */}
        <TabsContent value="blog" className="space-y-4 sm:space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base sm:text-lg">블로그 설정</CardTitle>
              <CardDescription className="text-sm">블로그의 표시 및 기능 설정을 관리합니다.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 sm:space-y-6">
              <div className="space-y-2">
                <Label htmlFor="postsPerPage" className="text-sm font-medium">페이지당 포스트 수</Label>
                <Input
                  id="postsPerPage"
                  type="number"
                  min="1"
                  max="50"
                  value={settings.postsPerPage}
                  onChange={(e) => handleInputChange('postsPerPage', parseInt(e.target.value))}
                  className="text-sm"
                />
              </div>

              <Separator />

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5 flex-1 min-w-0">
                    <Label className="text-sm font-medium">댓글 허용</Label>
                    <p className="text-xs sm:text-sm text-muted-foreground">방문자가 댓글을 작성할 수 있습니다.</p>
                  </div>
                  <Switch
                    checked={settings.allowComments}
                    onCheckedChange={(checked) => handleToggleChange('allowComments', checked)}
                    className="ml-4 flex-shrink-0"
                  />
                </div>

                <div className="flex items-center justify-between opacity-50">
                  <div className="space-y-0.5 flex-1 min-w-0">
                    <Label className="text-sm font-medium">댓글 승인 필요</Label>
                    <p className="text-xs sm:text-sm text-muted-foreground">댓글이 관리자 승인 후에 표시됩니다. (구현 예정)</p>
                  </div>
                  <Switch
                    checked={settings.requireCommentApproval}
                    onCheckedChange={(checked) => handleInputChange('requireCommentApproval', checked)}
                    disabled={true}
                    className="ml-4 flex-shrink-0"
                  />
                </div>

                <div className="flex items-center justify-between opacity-50">
                  <div className="space-y-0.5 flex-1 min-w-0">
                    <Label className="text-sm font-medium">태그 클라우드 표시</Label>
                    <p className="text-xs sm:text-sm text-muted-foreground">사이드바에 태그 클라우드를 표시합니다. (구현 예정)</p>
                  </div>
                  <Switch
                    checked={settings.showTagCloud}
                    onCheckedChange={(checked) => handleInputChange('showTagCloud', checked)}
                    disabled={true}
                    className="ml-4 flex-shrink-0"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 보안 설정 */}
        <TabsContent value="security" className="space-y-4 sm:space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex flex-col sm:flex-row sm:items-center gap-2">
                <span className="text-base sm:text-lg">보안 설정</span>
                <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded-full self-start sm:self-auto">
                  구현 예정
                </span>
              </CardTitle>
              <CardDescription className="text-sm">사이트 보안 관련 설정을 관리합니다. (현재 개발 중입니다)</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 sm:space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2 opacity-50">
                  <Label htmlFor="passwordMinLength" className="text-sm font-medium">최소 비밀번호 길이</Label>
                  <Input
                    id="passwordMinLength"
                    type="number"
                    min="6"
                    max="20"
                    value={settings.passwordMinLength}
                    onChange={(e) => handleInputChange('passwordMinLength', parseInt(e.target.value))}
                    disabled={true}
                    className="text-sm"
                  />
                </div>
                <div className="space-y-2 opacity-50">
                  <Label htmlFor="maxLoginAttempts" className="text-sm font-medium">최대 로그인 시도 횟수</Label>
                  <Input
                    id="maxLoginAttempts"
                    type="number"
                    min="3"
                    max="10"
                    value={settings.maxLoginAttempts}
                    onChange={(e) => handleInputChange('maxLoginAttempts', parseInt(e.target.value))}
                    disabled={true}
                    className="text-sm"
                  />
                </div>
              </div>

              <div className="space-y-2 opacity-50">
                <Label htmlFor="lockoutDuration" className="text-sm font-medium">계정 잠금 시간 (분)</Label>
                <Input
                  id="lockoutDuration"
                  type="number"
                  min="5"
                  max="60"
                  value={settings.lockoutDuration}
                  onChange={(e) => handleInputChange('lockoutDuration', parseInt(e.target.value))}
                  disabled={true}
                  className="text-sm"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 알림 설정 */}
        <TabsContent value="notifications" className="space-y-4 sm:space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex flex-col sm:flex-row sm:items-center gap-2">
                <span className="text-base sm:text-lg">알림 설정</span>
                <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded-full self-start sm:self-auto">
                  구현 예정
                </span>
              </CardTitle>
              <CardDescription className="text-sm">다양한 이벤트에 대한 알림을 설정합니다. (현재 개발 중입니다)</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between opacity-50">
                <div className="space-y-0.5 flex-1 min-w-0">
                  <Label className="text-sm font-medium">새 댓글 알림</Label>
                  <p className="text-xs sm:text-sm text-muted-foreground">새로운 댓글이 작성되면 알림을 받습니다.</p>
                </div>
                <Switch
                  checked={settings.notifyNewComments}
                  onCheckedChange={(checked) => handleInputChange('notifyNewComments', checked)}
                  disabled={true}
                  className="ml-4 flex-shrink-0"
                />
              </div>

              <div className="flex items-center justify-between opacity-50">
                <div className="space-y-0.5 flex-1 min-w-0">
                  <Label className="text-sm font-medium">새 사용자 가입 알림</Label>
                  <p className="text-xs sm:text-sm text-muted-foreground">새로운 사용자가 가입하면 알림을 받습니다.</p>
                </div>
                <Switch
                  checked={settings.notifyNewUsers}
                  onCheckedChange={(checked) => handleInputChange('notifyNewUsers', checked)}
                  disabled={true}
                  className="ml-4 flex-shrink-0"
                />
              </div>

              <div className="flex items-center justify-between opacity-50">
                <div className="space-y-0.5 flex-1 min-w-0">
                  <Label className="text-sm font-medium">이메일 알림</Label>
                  <p className="text-xs sm:text-sm text-muted-foreground">이메일로 알림을 받습니다.</p>
                </div>
                <Switch
                  checked={settings.emailNotifications}
                  onCheckedChange={(checked) => handleInputChange('emailNotifications', checked)}
                  disabled={true}
                  className="ml-4 flex-shrink-0"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* SEO 설정 */}
        <TabsContent value="seo" className="space-y-4 sm:space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base sm:text-lg">SEO 설정</CardTitle>
              <CardDescription className="text-sm">검색엔진 최적화를 위한 설정을 관리합니다.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="metaTitle" className="text-sm font-medium">메타 제목</Label>
                <Input
                  id="metaTitle"
                  value={settings.metaTitle}
                  onChange={(e) => handleInputChange('metaTitle', e.target.value)}
                  placeholder="검색엔진에 표시될 제목"
                  className="text-sm"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="metaDescription" className="text-sm font-medium">메타 설명</Label>
                <Textarea
                  id="metaDescription"
                  value={settings.metaDescription}
                  onChange={(e) => handleInputChange('metaDescription', e.target.value)}
                  placeholder="검색엔진에 표시될 설명"
                  rows={3}
                  className="text-sm"
                />
              </div>

              <Separator />

                <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5 flex-1 min-w-0">
                    <Label className="text-sm font-medium">사이트맵 자동 생성</Label>
                    <p className="text-xs sm:text-sm text-muted-foreground">활성화 시 /sitemap.xml 이 자동 생성됩니다.</p>
                  </div>
                  <Switch
                    checked={settings.generateSitemap}
                    onCheckedChange={(checked) => handleInputChange('generateSitemap', checked)}
                    className="ml-4 flex-shrink-0"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5 flex-1 min-w-0">
                    <Label className="text-sm font-medium">검색엔진 인덱싱 허용</Label>
                    <p className="text-xs sm:text-sm text-muted-foreground">검색엔진이 사이트를 크롤링할 수 있습니다.</p>
                  </div>
                  <Switch
                    checked={settings.allowIndexing}
                    onCheckedChange={(checked) => handleInputChange('allowIndexing', checked)}
                    className="ml-4 flex-shrink-0"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
