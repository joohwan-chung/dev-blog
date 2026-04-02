'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAdminAuth } from '@/components/admin/admin-auth-provider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Lock, AlertCircle } from 'lucide-react';

export default function AdminLoginPage() {
  const [authCode, setAuthCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { login, isAuthenticated } = useAdminAuth();
  const router = useRouter();

  // 이미 인증된 경우 대시보드로 리다이렉트
  useEffect(() => {
    if (isAuthenticated) {
      router.push('/admin');
    }
  }, [isAuthenticated, router]);

  // 인증된 경우 로딩 화면 표시
  if (isAuthenticated) {
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const success = await login(authCode);
    
    if (success) {
      router.push('/admin');
    } else {
      setError('잘못된 인증코드입니다.');
    }
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <Lock className="mx-auto h-12 w-12 text-gray-400" />
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900 dark:text-white">
            관리자 로그인
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            관리자 인증코드를 입력해주세요
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>인증</CardTitle>
            <CardDescription>
              관리자 페이지에 접근하려면 인증코드가 필요합니다.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="authCode" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  인증코드
                </label>
                <Input
                  id="authCode"
                  type="password"
                  value={authCode}
                  onChange={(e) => setAuthCode(e.target.value)}
                  placeholder="인증코드를 입력하세요"
                  required
                  className="mt-1"
                />
              </div>

              {error && (
                <div className="flex items-center space-x-2 text-red-600 dark:text-red-400">
                  <AlertCircle className="h-4 w-4" />
                  <span className="text-sm">{error}</span>
                </div>
              )}

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full"
              >
                {isLoading ? '인증 중...' : '로그인'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
