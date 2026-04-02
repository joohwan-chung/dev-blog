'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'admin' | 'user' | 'guest';
  status: 'active' | 'inactive' | 'banned';
  createdAt: string;
  lastActive: string;
  loginCount: number;
  preferences: {
    theme: string;
    language: string;
    notifications: {
      email: boolean;
      push: boolean;
    };
  };
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
  register: (id: string, name: string, email: string, password: string) => Promise<{ success: boolean; message: string }>;
  logout: () => Promise<void>;
  updateProfile: (updates: Partial<User>) => Promise<{ success: boolean; message: string }>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !!user;

  // 사용자 정보 새로고침
  const refreshUser = async () => {
    try {
      const response = await fetch('/api/auth/me', {
        credentials: 'include',
      });
      
      if (response.ok) {
        const userData = await response.json();
        // null이면 로그인하지 않은 상태
        setUser(userData);
      } else {
        // 서버 오류의 경우에만 콘솔에 로그
        console.error('Error refreshing user:', response.status, response.statusText);
        setUser(null);
      }
    } catch (error) {
      // 네트워크 오류 등 실제 오류만 콘솔에 로그
      console.error('Network error refreshing user:', error);
      setUser(null);
    }
  };

  // 로그인
  const login = async (email: string, password: string) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setUser(data.user);
        return { success: true, message: '로그인되었습니다.' };
      } else {
        return { success: false, message: data.message || '로그인에 실패했습니다.' };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, message: '네트워크 오류가 발생했습니다.' };
    }
  };

  // 회원가입
  const register = async (id: string, name: string, email: string, password: string) => {
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ id, name, email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setUser(data.user);
        return { success: true, message: '회원가입이 완료되었습니다.' };
      } else {
        return { success: false, message: data.message || '회원가입에 실패했습니다.' };
      }
    } catch (error) {
      console.error('Register error:', error);
      return { success: false, message: '네트워크 오류가 발생했습니다.' };
    }
  };

  // 로그아웃
  const logout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
    }
  };

  // 프로필 업데이트
  const updateProfile = async (updates: Partial<User>) => {
    try {
      const response = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(updates),
      });

      const data = await response.json();

      if (response.ok) {
        setUser(data.user);
        return { success: true, message: '프로필이 업데이트되었습니다.' };
      } else {
        return { success: false, message: data.message || '프로필 업데이트에 실패했습니다.' };
      }
    } catch (error) {
      console.error('Profile update error:', error);
      return { success: false, message: '네트워크 오류가 발생했습니다.' };
    }
  };

  // 초기 사용자 정보 로드
  useEffect(() => {
    const initAuth = async () => {
      setIsLoading(true);
      await refreshUser();
      setIsLoading(false);
    };

    initAuth();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated,
        login,
        register,
        logout,
        updateProfile,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
