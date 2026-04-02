'use client';

import { useState, useEffect, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { X, Clock } from 'lucide-react';
import { Popup, PopupType, PopupTheme, PopupPosition } from '@/types/notion';
import Image from 'next/image';

interface PopupDisplayProps {
  location?: string;
  userType?: 'guest' | 'logged-in' | 'admin';
  showPopup?: boolean;
}

export function PopupDisplay({ 
  location = 'home', 
  userType = 'guest',
  showPopup = true
}: PopupDisplayProps) {
  const [popups, setPopups] = useState<Popup[]>([]);
  const [currentPopupIndex, setCurrentPopupIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [dismissedPopups, setDismissedPopups] = useState<Set<number>>(new Set());
  const pathname = usePathname();

  const fetchPopups = useCallback(async () => {
    try {
      const response = await fetch(`/api/popups?location=${location}&userType=${userType}`);
      if (response.ok) {
        const data = await response.json();
        setPopups(data);
      }
    } catch (error) {
      console.error('팝업을 가져오는데 실패했습니다:', error);
    }
  }, [location, userType]);

  useEffect(() => {
    fetchPopups();
  }, [fetchPopups]);

  const handleClose = useCallback(() => {
    const currentPopup = popups[currentPopupIndex];
    if (currentPopup) {
      setDismissedPopups(prev => new Set([...prev, currentPopupIndex]));
      
      if (currentPopup.showOnce) {
        // 한 번만 표시하는 팝업은 로컬 스토리지에 저장
        const dismissed = JSON.parse(localStorage.getItem('dismissedPopups') || '[]');
        localStorage.setItem('dismissedPopups', JSON.stringify([...dismissed, currentPopupIndex]));
      }
    }
    
    setCurrentPopupIndex(prev => prev + 1);
  }, [popups, currentPopupIndex]);

  const handleOutsideClick = () => {
    const currentPopup = popups[currentPopupIndex];
    if (currentPopup?.allowOutsideClick) {
      handleClose();
    }
  };

  useEffect(() => {
    // 팝업 표시가 허용되지 않은 경우 숨김
    if (!showPopup) {
      setIsVisible(false);
      return;
    }

    // 페이지별 팝업 필터링
    const filteredPopups = popups.filter((popup, index) => {
      // 이미 닫힌 팝업은 제외
      if (dismissedPopups.has(index)) return false;
      
      // 특정 페이지 설정이 있는 경우 해당 페이지에서만 표시
      if (popup.pageSpecific && !pathname.includes(popup.pageSpecific)) {
        return false;
      }
      
      return true;
    });

    if (filteredPopups.length > 0 && currentPopupIndex < filteredPopups.length) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  }, [popups, currentPopupIndex, dismissedPopups, pathname, showPopup]);

  // 자동 닫기 타이머 시작
  useEffect(() => {
    if (!isVisible || popups.length === 0) return;
    
    const currentPopup = popups[currentPopupIndex];
    if (!currentPopup || currentPopup.autoClose <= 0) return;

    const timer = setTimeout(() => {
      handleClose();
    }, currentPopup.autoClose * 1000);
    
    return () => clearTimeout(timer);
  }, [isVisible, popups, currentPopupIndex, handleClose]);

  if (!isVisible || popups.length === 0) {
    return null;
  }

  const currentPopup = popups[currentPopupIndex];
  if (!currentPopup) return null;

  return (
    <PopupComponent
      popup={currentPopup}
      onClose={handleClose}
      onOutsideClick={handleOutsideClick}
    />
  );
}

// 개별 팝업 컴포넌트
function PopupComponent({ 
  popup, 
  onClose, 
  onOutsideClick 
}: { 
  popup: Popup; 
  onClose: () => void; 
  onOutsideClick: () => void;
}) {
  const getThemeStyles = (theme: PopupTheme) => {
    switch (theme) {
      case 'dark':
        return 'bg-gray-900 text-white border-gray-700 shadow-2xl dark:bg-gray-800 dark:border-gray-600';
      case 'light':
        return 'bg-white text-gray-900 border-gray-200 shadow-xl dark:bg-gray-100 dark:text-gray-900 dark:border-gray-300';
      case 'gradient':
        return 'bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 text-white border-transparent shadow-2xl dark:from-blue-600 dark:via-purple-600 dark:to-pink-600';
      default:
        return 'bg-white/95 backdrop-blur-md text-gray-900 border-gray-300 shadow-2xl dark:bg-gray-800/95 dark:text-gray-100 dark:border-gray-600';
    }
  };

  const getPositionStyles = (position: PopupPosition) => {
    switch (position) {
      case 'top':
        return 'top-4 left-1/2 transform -translate-x-1/2';
      case 'bottom':
        return 'bottom-4 left-1/2 transform -translate-x-1/2';
      case 'top-right':
        return 'top-4 right-4';
      case 'top-left':
        return 'top-4 left-4';
      default:
        return 'top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2';
    }
  };

  const getPopupStyles = (type: PopupType) => {
    switch (type) {
      case 'banner':
        return 'w-full max-w-none rounded-none';
      case 'toast':
        return 'w-80 rounded-xl shadow-lg';
      case 'slide':
        return 'w-full max-w-md rounded-xl shadow-lg animate-slide-in';
      default:
        return 'w-full max-w-md rounded-2xl shadow-2xl';
    }
  };

  if (popup.popupType === 'modal') {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        {/* 배경 오버레이 */}
        <div 
          className="absolute inset-0 bg-black/50 backdrop-blur-sm dark:bg-black/70"
          onClick={onOutsideClick}
        />
        
        {/* 모달 컨텐츠 */}
        <div className={`relative ${getThemeStyles(popup.theme)} ${getPopupStyles(popup.popupType)} border p-8 mx-4 animate-modal-in`}>
          <div className="flex justify-between items-start mb-6">
            <h3 className="font-bold text-2xl">{popup.title}</h3>
            {popup.showCloseButton && (
              <button 
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700 transition-colors p-1 rounded-full hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            )}
          </div>
          
          {popup.imageUrl && (
            <div className="mb-6">
              <Image 
                src={popup.imageUrl} 
                alt="팝업 이미지" 
                width={400}
                height={224}
                className="w-full h-56 object-cover rounded-xl shadow-lg"
              />
            </div>
          )}
          
          <div className="text-base mb-8 leading-relaxed text-gray-700 dark:text-gray-300">
            {popup.content}
          </div>
          
          <div className="flex gap-4">
            <Button 
              onClick={onClose}
              className="flex-1 h-12 text-base font-semibold"
              variant={popup.theme === 'gradient' ? 'secondary' : 'default'}
            >
              확인
            </Button>
            <Button 
              onClick={onClose}
              variant="outline"
              className="flex-1 h-12 text-base font-semibold"
            >
              닫기
            </Button>
          </div>
          
          {popup.autoClose > 0 && (
            <div className="mt-4 text-xs text-gray-500 text-center dark:text-gray-400">
              <Clock className="w-3 h-3 inline mr-1" />
              {popup.autoClose}초 후 자동으로 닫힙니다
            </div>
          )}
        </div>
      </div>
    );
  }

  if (popup.popupType === 'banner') {
    return (
      <div className={`fixed top-0 left-0 right-0 z-50 ${getThemeStyles(popup.theme)} border-b p-6 animate-banner-in`}>
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <h3 className="font-bold text-lg">{popup.title}</h3>
              <p className="text-sm opacity-90 mt-1">{popup.content}</p>
            </div>
          </div>
          
          {popup.showCloseButton && (
            <button 
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 transition-colors ml-6 p-2 rounded-full hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-700"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    );
  }

  if (popup.popupType === 'toast') {
    return (
      <div className={`fixed ${getPositionStyles(popup.position)} z-50 ${getThemeStyles(popup.theme)} ${getPopupStyles(popup.popupType)} border p-5 animate-toast-in`}>
        <div className="flex items-start gap-4">
          <div className="flex-1">
            <h4 className="font-bold text-base">{popup.title}</h4>
            <p className="text-sm opacity-90 mt-2 leading-relaxed">{popup.content}</p>
          </div>
          
          {popup.showCloseButton && (
            <button 
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 transition-colors p-1 rounded-full hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-700"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    );
  }

  if (popup.popupType === 'slide') {
    return (
      <div className={`fixed ${getPositionStyles(popup.position)} z-50 ${getThemeStyles(popup.theme)} ${getPopupStyles(popup.popupType)} border p-6`}>
        <div className="flex justify-between items-start mb-5">
          <h3 className="font-bold text-xl">{popup.title}</h3>
          {popup.showCloseButton && (
            <button 
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 transition-colors p-1 rounded-full hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-700"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
        
        {popup.imageUrl && (
          <div className="mb-5">
            <Image 
              src={popup.imageUrl} 
              alt="팝업 이미지" 
              width={400}
              height={160}
              className="w-full h-40 object-cover rounded-lg shadow-md"
            />
          </div>
        )}
        
        <div className="text-base mb-6 leading-relaxed text-gray-700 dark:text-gray-300">
          {popup.content}
        </div>
        
        <div className="flex gap-3">
          <Button 
            onClick={onClose}
            className="flex-1 h-10 font-semibold"
            size="sm"
          >
            확인
          </Button>
        </div>
      </div>
    );
  }

  return null;
}

// CSS 애니메이션을 위한 스타일
const styles = `
  @keyframes modal-in {
    from {
      opacity: 0;
      transform: scale(0.9);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }
  
  @keyframes banner-in {
    from {
      opacity: 0;
      transform: translateY(-100%);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  @keyframes toast-in {
    from {
      opacity: 0;
      transform: translateX(100%);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }
  
  @keyframes slide-in {
    from {
      opacity: 0;
      transform: translateX(-100%);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }
  
  .animate-modal-in {
    animation: modal-in 0.3s ease-out;
  }
  
  .animate-banner-in {
    animation: banner-in 0.4s ease-out;
  }
  
  .animate-toast-in {
    animation: toast-in 0.3s ease-out;
  }
  
  .animate-slide-in {
    animation: slide-in 0.4s ease-out;
  }
`;

// 스타일을 head에 주입
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);
}
