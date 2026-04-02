'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Calendar,
  Settings,
  Palette,
  Target
} from 'lucide-react';
import { Popup, PopupType, PopupTheme, PopupPosition, PopupDisplayLocation, PopupTargetUsers } from '@/types/notion';
import Image from 'next/image';

export default function PopupsPage() {
  const [popups, setPopups] = useState<Popup[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPopup, setSelectedPopup] = useState<Popup | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isPreviewDialogOpen, setIsPreviewDialogOpen] = useState(false);

  // 새 팝업 폼 데이터
  const [newPopup, setNewPopup] = useState<Partial<Popup>>({
    title: '',
    content: '',
    imageUrl: '',
    displayLocation: 'home',
    pageSpecific: '',
    isActive: true,
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    popupType: 'modal',
    theme: 'default',
    position: 'center',
    autoClose: 0,
    showCloseButton: true,
    allowOutsideClick: true,
    priority: 1,
    order: 1,
    targetUsers: 'all',
    showOnce: false,
  });

  useEffect(() => {
    fetchPopups();
  }, []);

  const fetchPopups = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/popups');
      if (response.ok) {
        const data = await response.json();
        setPopups(data);
      }
    } catch (error) {
      console.error('팝업 목록을 가져오는데 실패했습니다:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePopup = async () => {
    try {
      const response = await fetch('/api/admin/popups', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newPopup),
      });

      if (response.ok) {
        await fetchPopups();
        setIsCreateDialogOpen(false);
        setNewPopup({
          title: '',
          content: '',
          imageUrl: '',
          displayLocation: 'home',
          pageSpecific: '',
          isActive: true,
          startDate: new Date().toISOString().split('T')[0],
          endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          popupType: 'modal',
          theme: 'default',
          position: 'center',
          autoClose: 0,
          showCloseButton: true,
          allowOutsideClick: true,
          priority: 1,
          order: 1,
          targetUsers: 'all',
          showOnce: false,
        });
      }
    } catch (error) {
      console.error('팝업 생성에 실패했습니다:', error);
    }
  };

  const handleUpdatePopup = async () => {
    if (!selectedPopup) return;

    try {
      // 제목으로 팝업을 찾아서 업데이트
      const response = await fetch('/api/admin/popups', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(selectedPopup),
      });

      if (response.ok) {
        await fetchPopups();
        setIsEditDialogOpen(false);
        setSelectedPopup(null);
      }
    } catch (error) {
      console.error('팝업 수정에 실패했습니다:', error);
    }
  };

  const handleDeletePopup = async (popup: Popup) => {
    if (!confirm('정말로 이 팝업을 삭제하시겠습니까?')) return;

    try {
      const response = await fetch('/api/admin/popups', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title: popup.title }),
      });

      if (response.ok) {
        await fetchPopups();
      }
    } catch (error) {
      console.error('팝업 삭제에 실패했습니다:', error);
    }
  };

  const togglePopupActive = async (popup: Popup) => {
    try {
      const response = await fetch('/api/admin/popups', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...popup, isActive: !popup.isActive }),
      });

      if (response.ok) {
        await fetchPopups();
      }
    } catch (error) {
      console.error('팝업 상태 변경에 실패했습니다:', error);
    }
  };

  const getLocationLabel = (location: PopupDisplayLocation) => {
    const labels = {
      home: '메인 페이지',
      blog: '블로그',
      about: '소개',
      profile: '프로필',
      playground: '플레이그라운드',
      all: '모든 페이지',
    };
    return labels[location];
  };

  const getTypeLabel = (type: PopupType) => {
    const labels = {
      modal: '모달',
      banner: '배너',
      toast: '토스트',
      slide: '슬라이드',
    };
    return labels[type];
  };

  const getThemeLabel = (theme: PopupTheme) => {
    const labels = {
      default: '기본',
      dark: '다크',
      light: '라이트',
      gradient: '그라데이션',
    };
    return labels[theme];
  };


  const getTargetUsersLabel = (target: PopupTargetUsers) => {
    const labels = {
      all: '모든 사용자',
      'logged-in': '로그인 사용자',
      guest: '게스트',
      admin: '관리자',
    };
    return labels[target];
  };

  const isExpired = (endDate: string) => {
    return new Date(endDate) < new Date();
  };

  const isActiveNow = (popup: Popup) => {
    const now = new Date();
    const startDate = new Date(popup.startDate);
    const endDate = new Date(popup.endDate);
    return popup.isActive && now >= startDate && now <= endDate;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">팝업 관리</h1>
          <p className="text-gray-600 mt-2">사용자 페이지에 표시될 팝업을 관리합니다.</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              새 팝업 생성
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>새 팝업 생성</DialogTitle>
            </DialogHeader>
            <CreatePopupForm 
              popup={newPopup} 
              setPopup={setNewPopup} 
              onSubmit={handleCreatePopup}
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6">
        {popups.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Settings className="h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">팝업이 없습니다</h3>
              <p className="text-gray-500 text-center mb-4">
                첫 번째 팝업을 생성하여 사용자에게 중요한 메시지를 전달해보세요.
              </p>
              <Button onClick={() => setIsCreateDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                팝업 생성하기
              </Button>
            </CardContent>
          </Card>
        ) : (
          popups.map((popup, index) => (
            <Card key={index} className={`transition-all duration-200 hover:shadow-lg ${
              !popup.isActive ? 'opacity-60' : ''
            }`}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="flex items-center gap-3">
                      {popup.title}
                      <div className="flex gap-2">
                        <Badge variant={isActiveNow(popup) ? 'default' : 'secondary'}>
                          {isActiveNow(popup) ? '활성' : '비활성'}
                        </Badge>
                        {isExpired(popup.endDate) && (
                          <Badge variant="destructive">만료됨</Badge>
                        )}
                        <Badge variant="outline">{getTypeLabel(popup.popupType)}</Badge>
                      </div>
                    </CardTitle>
                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <Target className="h-4 w-4" />
                        {getLocationLabel(popup.displayLocation)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Palette className="h-4 w-4" />
                        {getThemeLabel(popup.theme)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {popup.startDate} ~ {popup.endDate}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={popup.isActive}
                      onCheckedChange={() => togglePopupActive(popup)}
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedPopup(popup);
                        setIsPreviewDialogOpen(true);
                      }}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedPopup(popup);
                        setIsEditDialogOpen(true);
                      }}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeletePopup(popup)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-gray-700 mb-4">
                  {popup.content.length > 100 
                    ? `${popup.content.substring(0, 100)}...` 
                    : popup.content
                  }
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <Label className="text-gray-500">우선순위</Label>
                    <div className="font-medium">{popup.priority}</div>
                  </div>
                  <div>
                    <Label className="text-gray-500">순서</Label>
                    <div className="font-medium">{popup.order}</div>
                  </div>
                  <div>
                    <Label className="text-gray-500">대상 사용자</Label>
                    <div className="font-medium">{getTargetUsersLabel(popup.targetUsers)}</div>
                  </div>
                  <div>
                    <Label className="text-gray-500">자동 닫기</Label>
                    <div className="font-medium">
                      {popup.autoClose > 0 ? `${popup.autoClose}초` : '수동'}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* 편집 다이얼로그 */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>팝업 편집</DialogTitle>
          </DialogHeader>
          {selectedPopup && (
            <EditPopupForm 
              popup={selectedPopup} 
              setPopup={setSelectedPopup} 
              onSubmit={handleUpdatePopup}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* 미리보기 다이얼로그 */}
      <Dialog open={isPreviewDialogOpen} onOpenChange={setIsPreviewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>팝업 미리보기</DialogTitle>
          </DialogHeader>
          {selectedPopup && (
            <PopupPreview popup={selectedPopup} />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

// 팝업 생성 폼 컴포넌트
function CreatePopupForm({ 
  popup, 
  setPopup, 
  onSubmit 
}: { 
  popup: Partial<Popup>; 
  setPopup: (popup: Partial<Popup>) => void; 
  onSubmit: () => void;
}) {
  return (
    <Tabs defaultValue="basic" className="w-full">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="basic">기본 정보</TabsTrigger>
        <TabsTrigger value="display">표시 설정</TabsTrigger>
        <TabsTrigger value="design">디자인</TabsTrigger>
        <TabsTrigger value="behavior">동작 설정</TabsTrigger>
      </TabsList>
      
      <TabsContent value="basic" className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="title">제목 *</Label>
            <Input
              id="title"
              value={popup.title || ''}
              onChange={(e) => setPopup({ ...popup, title: e.target.value })}
              placeholder="팝업 제목을 입력하세요"
            />
          </div>
          <div>
            <Label htmlFor="imageUrl">이미지 URL</Label>
            <Input
              id="imageUrl"
              value={popup.imageUrl || ''}
              onChange={(e) => setPopup({ ...popup, imageUrl: e.target.value })}
              placeholder="이미지 URL (선택사항)"
            />
          </div>
        </div>
        <div>
          <Label htmlFor="content">내용 *</Label>
          <Textarea
            id="content"
            value={popup.content || ''}
            onChange={(e) => setPopup({ ...popup, content: e.target.value })}
            placeholder="팝업 내용을 입력하세요"
            rows={4}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="startDate">시작 날짜</Label>
            <Input
              id="startDate"
              type="date"
              value={popup.startDate || ''}
              onChange={(e) => setPopup({ ...popup, startDate: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="endDate">종료 날짜</Label>
            <Input
              id="endDate"
              type="date"
              value={popup.endDate || ''}
              onChange={(e) => setPopup({ ...popup, endDate: e.target.value })}
            />
          </div>
        </div>
      </TabsContent>

      <TabsContent value="display" className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="displayLocation">표시 위치</Label>
            <Select
              value={popup.displayLocation}
              onValueChange={(value: PopupDisplayLocation) => 
                setPopup({ ...popup, displayLocation: value })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="home">메인 페이지</SelectItem>
                <SelectItem value="blog">블로그</SelectItem>
                <SelectItem value="about">소개</SelectItem>
                <SelectItem value="profile">프로필</SelectItem>
                <SelectItem value="playground">플레이그라운드</SelectItem>
                <SelectItem value="all">모든 페이지</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="pageSpecific">특정 페이지</Label>
            <Input
              id="pageSpecific"
              value={popup.pageSpecific || ''}
              onChange={(e) => setPopup({ ...popup, pageSpecific: e.target.value })}
              placeholder="특정 페이지 경로 (예: /blog/[id])"
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="priority">우선순위</Label>
            <Input
              id="priority"
              type="number"
              value={popup.priority || 1}
              onChange={(e) => setPopup({ ...popup, priority: parseInt(e.target.value) || 1 })}
              min="1"
            />
          </div>
          <div>
            <Label htmlFor="order">순서</Label>
            <Input
              id="order"
              type="number"
              value={popup.order || 1}
              onChange={(e) => setPopup({ ...popup, order: parseInt(e.target.value) || 1 })}
              min="1"
            />
          </div>
        </div>
        <div>
          <Label htmlFor="targetUsers">대상 사용자</Label>
          <Select
            value={popup.targetUsers}
            onValueChange={(value: PopupTargetUsers) => 
              setPopup({ ...popup, targetUsers: value })
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">모든 사용자</SelectItem>
              <SelectItem value="logged-in">로그인 사용자</SelectItem>
              <SelectItem value="guest">게스트</SelectItem>
              <SelectItem value="admin">관리자</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </TabsContent>

      <TabsContent value="design" className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="popupType">팝업 타입</Label>
            <Select
              value={popup.popupType}
              onValueChange={(value: PopupType) => 
                setPopup({ ...popup, popupType: value })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="modal">모달</SelectItem>
                <SelectItem value="banner">배너</SelectItem>
                <SelectItem value="toast">토스트</SelectItem>
                <SelectItem value="slide">슬라이드</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="theme">테마</Label>
            <Select
              value={popup.theme}
              onValueChange={(value: PopupTheme) => 
                setPopup({ ...popup, theme: value })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="default">기본</SelectItem>
                <SelectItem value="dark">다크</SelectItem>
                <SelectItem value="light">라이트</SelectItem>
                <SelectItem value="gradient">그라데이션</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div>
          <Label htmlFor="position">위치</Label>
          <Select
            value={popup.position}
            onValueChange={(value: PopupPosition) => 
              setPopup({ ...popup, position: value })
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="center">중앙</SelectItem>
              <SelectItem value="top">상단</SelectItem>
              <SelectItem value="bottom">하단</SelectItem>
              <SelectItem value="top-right">우상단</SelectItem>
              <SelectItem value="top-left">좌상단</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </TabsContent>

      <TabsContent value="behavior" className="space-y-4">
        <div>
          <Label htmlFor="autoClose">자동 닫기 (초)</Label>
          <Input
            id="autoClose"
            type="number"
            value={popup.autoClose || 0}
            onChange={(e) => setPopup({ ...popup, autoClose: parseInt(e.target.value) || 0 })}
            min="0"
            placeholder="0이면 수동으로만 닫기"
          />
        </div>
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Switch
              id="showCloseButton"
              checked={popup.showCloseButton}
              onCheckedChange={(checked) => setPopup({ ...popup, showCloseButton: checked })}
            />
            <Label htmlFor="showCloseButton">닫기 버튼 표시</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="allowOutsideClick"
              checked={popup.allowOutsideClick}
              onCheckedChange={(checked) => setPopup({ ...popup, allowOutsideClick: checked })}
            />
            <Label htmlFor="allowOutsideClick">외부 클릭으로 닫기</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="showOnce"
              checked={popup.showOnce}
              onCheckedChange={(checked) => setPopup({ ...popup, showOnce: checked })}
            />
            <Label htmlFor="showOnce">한 번만 표시</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="isActive"
              checked={popup.isActive}
              onCheckedChange={(checked) => setPopup({ ...popup, isActive: checked })}
            />
            <Label htmlFor="isActive">활성화</Label>
          </div>
        </div>
        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline" onClick={() => {}}>
            취소
          </Button>
          <Button onClick={onSubmit}>
            생성하기
          </Button>
        </div>
      </TabsContent>
    </Tabs>
  );
}

// 팝업 편집 폼 컴포넌트
function EditPopupForm({ 
  popup, 
  setPopup, 
  onSubmit 
}: { 
  popup: Popup; 
  setPopup: (popup: Popup) => void; 
  onSubmit: () => void;
}) {
  return (
    <Tabs defaultValue="basic" className="w-full">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="basic">기본 정보</TabsTrigger>
        <TabsTrigger value="display">표시 설정</TabsTrigger>
        <TabsTrigger value="design">디자인</TabsTrigger>
        <TabsTrigger value="behavior">동작 설정</TabsTrigger>
      </TabsList>
      
      <TabsContent value="basic" className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="edit-title">제목 *</Label>
            <Input
              id="edit-title"
              value={popup.title}
              onChange={(e) => setPopup({ ...popup, title: e.target.value })}
              placeholder="팝업 제목을 입력하세요"
            />
          </div>
          <div>
            <Label htmlFor="edit-imageUrl">이미지 URL</Label>
            <Input
              id="edit-imageUrl"
              value={popup.imageUrl || ''}
              onChange={(e) => setPopup({ ...popup, imageUrl: e.target.value })}
              placeholder="이미지 URL (선택사항)"
            />
          </div>
        </div>
        <div>
          <Label htmlFor="edit-content">내용 *</Label>
          <Textarea
            id="edit-content"
            value={popup.content}
            onChange={(e) => setPopup({ ...popup, content: e.target.value })}
            placeholder="팝업 내용을 입력하세요"
            rows={4}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="edit-startDate">시작 날짜</Label>
            <Input
              id="edit-startDate"
              type="date"
              value={popup.startDate}
              onChange={(e) => setPopup({ ...popup, startDate: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="edit-endDate">종료 날짜</Label>
            <Input
              id="edit-endDate"
              type="date"
              value={popup.endDate}
              onChange={(e) => setPopup({ ...popup, endDate: e.target.value })}
            />
          </div>
        </div>
      </TabsContent>

      <TabsContent value="display" className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="edit-displayLocation">표시 위치</Label>
            <Select
              value={popup.displayLocation}
              onValueChange={(value: PopupDisplayLocation) => 
                setPopup({ ...popup, displayLocation: value })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="home">메인 페이지</SelectItem>
                <SelectItem value="blog">블로그</SelectItem>
                <SelectItem value="about">소개</SelectItem>
                <SelectItem value="profile">프로필</SelectItem>
                <SelectItem value="playground">플레이그라운드</SelectItem>
                <SelectItem value="all">모든 페이지</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="edit-pageSpecific">특정 페이지</Label>
            <Input
              id="edit-pageSpecific"
              value={popup.pageSpecific || ''}
              onChange={(e) => setPopup({ ...popup, pageSpecific: e.target.value })}
              placeholder="특정 페이지 경로 (예: /blog/[id])"
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="edit-priority">우선순위</Label>
            <Input
              id="edit-priority"
              type="number"
              value={popup.priority}
              onChange={(e) => setPopup({ ...popup, priority: parseInt(e.target.value) || 1 })}
              min="1"
            />
          </div>
          <div>
            <Label htmlFor="edit-order">순서</Label>
            <Input
              id="edit-order"
              type="number"
              value={popup.order}
              onChange={(e) => setPopup({ ...popup, order: parseInt(e.target.value) || 1 })}
              min="1"
            />
          </div>
        </div>
        <div>
          <Label htmlFor="edit-targetUsers">대상 사용자</Label>
          <Select
            value={popup.targetUsers}
            onValueChange={(value: PopupTargetUsers) => 
              setPopup({ ...popup, targetUsers: value })
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">모든 사용자</SelectItem>
              <SelectItem value="logged-in">로그인 사용자</SelectItem>
              <SelectItem value="guest">게스트</SelectItem>
              <SelectItem value="admin">관리자</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </TabsContent>

      <TabsContent value="design" className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="edit-popupType">팝업 타입</Label>
            <Select
              value={popup.popupType}
              onValueChange={(value: PopupType) => 
                setPopup({ ...popup, popupType: value })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="modal">모달</SelectItem>
                <SelectItem value="banner">배너</SelectItem>
                <SelectItem value="toast">토스트</SelectItem>
                <SelectItem value="slide">슬라이드</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="edit-theme">테마</Label>
            <Select
              value={popup.theme}
              onValueChange={(value: PopupTheme) => 
                setPopup({ ...popup, theme: value })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="default">기본</SelectItem>
                <SelectItem value="dark">다크</SelectItem>
                <SelectItem value="light">라이트</SelectItem>
                <SelectItem value="gradient">그라데이션</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div>
          <Label htmlFor="edit-position">위치</Label>
          <Select
            value={popup.position}
            onValueChange={(value: PopupPosition) => 
              setPopup({ ...popup, position: value })
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="center">중앙</SelectItem>
              <SelectItem value="top">상단</SelectItem>
              <SelectItem value="bottom">하단</SelectItem>
              <SelectItem value="top-right">우상단</SelectItem>
              <SelectItem value="top-left">좌상단</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </TabsContent>

      <TabsContent value="behavior" className="space-y-4">
        <div>
          <Label htmlFor="edit-autoClose">자동 닫기 (초)</Label>
          <Input
            id="edit-autoClose"
            type="number"
            value={popup.autoClose}
            onChange={(e) => setPopup({ ...popup, autoClose: parseInt(e.target.value) || 0 })}
            min="0"
            placeholder="0이면 수동으로만 닫기"
          />
        </div>
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Switch
              id="edit-showCloseButton"
              checked={popup.showCloseButton}
              onCheckedChange={(checked) => setPopup({ ...popup, showCloseButton: checked })}
            />
            <Label htmlFor="edit-showCloseButton">닫기 버튼 표시</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="edit-allowOutsideClick"
              checked={popup.allowOutsideClick}
              onCheckedChange={(checked) => setPopup({ ...popup, allowOutsideClick: checked })}
            />
            <Label htmlFor="edit-allowOutsideClick">외부 클릭으로 닫기</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="edit-showOnce"
              checked={popup.showOnce}
              onCheckedChange={(checked) => setPopup({ ...popup, showOnce: checked })}
            />
            <Label htmlFor="edit-showOnce">한 번만 표시</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="edit-isActive"
              checked={popup.isActive}
              onCheckedChange={(checked) => setPopup({ ...popup, isActive: checked })}
            />
            <Label htmlFor="edit-isActive">활성화</Label>
          </div>
        </div>
        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline" onClick={() => {}}>
            취소
          </Button>
          <Button onClick={onSubmit}>
            수정하기
          </Button>
        </div>
      </TabsContent>
    </Tabs>
  );
}

// 팝업 미리보기 컴포넌트
function PopupPreview({ popup }: { popup: Popup }) {
  const getThemeStyles = (theme: PopupTheme) => {
    switch (theme) {
      case 'dark':
        return 'bg-gray-900 text-white border-gray-700';
      case 'light':
        return 'bg-white text-gray-900 border-gray-200';
      case 'gradient':
        return 'bg-gradient-to-br from-blue-500 to-purple-600 text-white border-transparent';
      default:
        return 'bg-white text-gray-900 border-gray-300 shadow-lg';
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

  return (
    <div className="relative h-96 bg-gray-100 rounded-lg overflow-hidden">
      <div className={`absolute ${getPositionStyles(popup.position)} ${getThemeStyles(popup.theme)} rounded-lg border p-6 max-w-sm w-full`}>
        <div className="flex justify-between items-start mb-4">
          <h3 className="font-semibold text-lg">{popup.title}</h3>
          {popup.showCloseButton && (
            <button className="text-gray-500 hover:text-gray-700">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
        {popup.imageUrl && (
          <div className="mb-4">
            <Image 
              src={popup.imageUrl} 
              alt="팝업 이미지" 
              width={400}
              height={128}
              className="w-full h-32 object-cover rounded"
            />
          </div>
        )}
        <div className="text-sm mb-4">
          {popup.content}
        </div>
        <div className="flex gap-2">
          <Button size="sm" className="flex-1">
            확인
          </Button>
          <Button size="sm" variant="outline" className="flex-1">
            취소
          </Button>
        </div>
      </div>
    </div>
  );
}
