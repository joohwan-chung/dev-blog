'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/lib/auth-context';
import { Eye, EyeOff, Mail, Lock, User, AlertCircle, CheckCircle, ArrowLeft } from 'lucide-react';

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [validationErrors, setValidationErrors] = useState({
    id: '',
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [touched, setTouched] = useState({
    id: false,
    name: false,
    email: false,
    password: false,
    confirmPassword: false
  });

  const { register, isAuthenticated, isLoading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, authLoading, router]);

  // 유효성 검증 함수들
  const validateId = (id: string) => {
    if (!id.trim()) return '사용자 ID를 입력해주세요.';
    if (!/^[a-zA-Z0-9_]+$/.test(id)) return '영문, 숫자, 언더스코어(_)만 사용할 수 있습니다.';
    if (id.length < 3 || id.length > 20) return '3-20자 사이여야 합니다.';
    return '';
  };

  const validateName = (name: string) => {
    if (!name.trim()) return '이름을 입력해주세요.';
    if (name.length < 2) return '이름은 2자 이상이어야 합니다.';
    return '';
  };

  const validateEmail = (email: string) => {
    if (!email.trim()) return '이메일을 입력해주세요.';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return '올바른 이메일 형식을 입력해주세요.';
    return '';
  };

  const validatePassword = (password: string) => {
    if (!password) return '비밀번호를 입력해주세요.';
    if (password.length < 6) return '비밀번호는 6자 이상이어야 합니다.';
    return '';
  };

  const validateConfirmPassword = (password: string, confirmPassword: string) => {
    if (!confirmPassword) return '비밀번호 확인을 입력해주세요.';
    if (password !== confirmPassword) return '비밀번호가 일치하지 않습니다.';
    return '';
  };

  const validateField = (name: string, value: string) => {
    switch (name) {
      case 'id':
        return validateId(value);
      case 'name':
        return validateName(value);
      case 'email':
        return validateEmail(value);
      case 'password':
        return validatePassword(value);
      case 'confirmPassword':
        return validateConfirmPassword(formData.password, value);
      default:
        return '';
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // 실시간 유효성 검증
    const error = validateField(name, value);
    setValidationErrors(prev => ({
      ...prev,
      [name]: error
    }));
    
    // 메시지 초기화
    if (message) setMessage(null);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name } = e.target;
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    // 모든 필드 터치 상태로 설정
    setTouched({
      id: true,
      name: true,
      email: true,
      password: true,
      confirmPassword: true
    });

    // 전체 유효성 검증
    const errors = {
      id: validateId(formData.id),
      name: validateName(formData.name),
      email: validateEmail(formData.email),
      password: validatePassword(formData.password),
      confirmPassword: validateConfirmPassword(formData.password, formData.confirmPassword)
    };

    setValidationErrors(errors);

    // 오류가 있으면 중단
    const hasErrors = Object.values(errors).some(error => error !== '');
    if (hasErrors) {
      setIsLoading(false);
      return;
    }

    try {
      const result = await register(formData.id, formData.name, formData.email, formData.password);
      if (result.success) {
        setMessage({ type: 'success', text: result.message });
        setTimeout(() => {
          router.push('/');
        }, 1500);
      } else {
        setMessage({ type: 'error', text: result.message });
      }
      } catch {
      setMessage({ type: 'error', text: '회원가입 중 오류가 발생했습니다.' });
    } finally {
      setIsLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (isAuthenticated) {
    return null; // 리다이렉트 중
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* 뒤로가기 버튼 */}
        <div className="flex justify-start">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            뒤로가기
          </Button>
        </div>

        {/* 회원가입 카드 */}
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
              회원가입
            </CardTitle>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
              새 계정을 만들어 더 많은 기능을 이용하세요
            </p>
          </CardHeader>
          <CardContent>
            {/* 회원가입 혜택 */}
            <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg">
              <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                🎉 회원가입 혜택
              </h3>
              <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                <li>• 개인화된 활동 내역 확인</li>
                <li>• 댓글 수정/삭제 권한</li>
                <li>• 알림 설정 및 프로필 커스터마이징</li>
                <li>• 내 반응과 댓글 관리</li>
              </ul>
            </div>

            <form onSubmit={handleRegister} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="id">사용자 ID</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    id="id"
                    name="id"
                    type="text"
                    placeholder="사용자 ID를 입력하세요 (3-20자, 영문/숫자/_)"
                    value={formData.id}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    className={`pl-10 pr-10 ${touched.id && validationErrors.id ? 'border-red-500 focus:border-red-500' : touched.id && !validationErrors.id ? 'border-green-500 focus:border-green-500' : ''}`}
                    required
                  />
                  {touched.id && validationErrors.id && (
                    <AlertCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 text-red-500 h-4 w-4" />
                  )}
                  {touched.id && !validationErrors.id && formData.id && (
                    <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500 h-4 w-4" />
                  )}
                </div>
                {touched.id && validationErrors.id ? (
                  <p className="text-xs text-red-500 flex items-center">
                    <AlertCircle className="h-3 w-3 mr-1" />
                    {validationErrors.id}
                  </p>
                ) : (
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    영문, 숫자, 언더스코어(_)만 사용 가능합니다.
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="name">이름</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="이름을 입력하세요"
                    value={formData.name}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    className={`pl-10 pr-10 ${touched.name && validationErrors.name ? 'border-red-500 focus:border-red-500' : touched.name && !validationErrors.name ? 'border-green-500 focus:border-green-500' : ''}`}
                    required
                  />
                  {touched.name && validationErrors.name && (
                    <AlertCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 text-red-500 h-4 w-4" />
                  )}
                  {touched.name && !validationErrors.name && formData.name && (
                    <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500 h-4 w-4" />
                  )}
                </div>
                {touched.name && validationErrors.name && (
                  <p className="text-xs text-red-500 flex items-center">
                    <AlertCircle className="h-3 w-3 mr-1" />
                    {validationErrors.name}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">이메일</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="이메일을 입력하세요"
                    value={formData.email}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    className={`pl-10 pr-10 ${touched.email && validationErrors.email ? 'border-red-500 focus:border-red-500' : touched.email && !validationErrors.email ? 'border-green-500 focus:border-green-500' : ''}`}
                    required
                  />
                  {touched.email && validationErrors.email && (
                    <AlertCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 text-red-500 h-4 w-4" />
                  )}
                  {touched.email && !validationErrors.email && formData.email && (
                    <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500 h-4 w-4" />
                  )}
                </div>
                {touched.email && validationErrors.email && (
                  <p className="text-xs text-red-500 flex items-center">
                    <AlertCircle className="h-3 w-3 mr-1" />
                    {validationErrors.email}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">비밀번호</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="비밀번호를 입력하세요 (6자 이상)"
                    value={formData.password}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    className={`pl-10 pr-20 ${touched.password && validationErrors.password ? 'border-red-500 focus:border-red-500' : touched.password && !validationErrors.password ? 'border-green-500 focus:border-green-500' : ''}`}
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-12 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                  {touched.password && validationErrors.password && (
                    <AlertCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 text-red-500 h-4 w-4" />
                  )}
                  {touched.password && !validationErrors.password && formData.password && (
                    <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500 h-4 w-4" />
                  )}
                </div>
                {touched.password && validationErrors.password && (
                  <p className="text-xs text-red-500 flex items-center">
                    <AlertCircle className="h-3 w-3 mr-1" />
                    {validationErrors.password}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">비밀번호 확인</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="비밀번호를 다시 입력하세요"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    className={`pl-10 pr-10 ${touched.confirmPassword && validationErrors.confirmPassword ? 'border-red-500 focus:border-red-500' : touched.confirmPassword && !validationErrors.confirmPassword ? 'border-green-500 focus:border-green-500' : ''}`}
                    required
                  />
                  {touched.confirmPassword && validationErrors.confirmPassword && (
                    <AlertCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 text-red-500 h-4 w-4" />
                  )}
                  {touched.confirmPassword && !validationErrors.confirmPassword && formData.confirmPassword && (
                    <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500 h-4 w-4" />
                  )}
                </div>
                {touched.confirmPassword && validationErrors.confirmPassword && (
                  <p className="text-xs text-red-500 flex items-center">
                    <AlertCircle className="h-3 w-3 mr-1" />
                    {validationErrors.confirmPassword}
                  </p>
                )}
              </div>

              {message && (
                <div className={`flex items-center space-x-2 p-3 rounded-lg ${
                  message.type === 'success' 
                    ? 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400' 
                    : 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400'
                }`}>
                  {message.type === 'success' ? (
                    <CheckCircle className="h-4 w-4" />
                  ) : (
                    <AlertCircle className="h-4 w-4" />
                  )}
                  <span className="text-sm">{message.text}</span>
                </div>
              )}

              <Button 
                type="submit" 
                className="w-full" 
                disabled={isLoading || Object.values(validationErrors).some(error => error !== '') || !formData.id || !formData.name || !formData.email || !formData.password || !formData.confirmPassword}
              >
                {isLoading ? '회원가입 중...' : '회원가입'}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                이미 계정이 있으신가요?{' '}
                <Link 
                  href="/auth/login" 
                  className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  로그인하기
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
