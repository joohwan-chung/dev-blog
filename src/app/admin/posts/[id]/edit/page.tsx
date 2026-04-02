'use client';

import { useAdminAuth } from '@/components/admin/admin-auth-provider';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  ArrowLeft,
  Save,
  RefreshCw
} from 'lucide-react';
import { useRouter, useParams } from 'next/navigation';
import { useEffect, useState, useCallback } from 'react';
import { NotionPage } from '@/types/notion';

interface NotionBlock {
  type: string;
  heading_1?: { rich_text: NotionRichText[] };
  heading_2?: { rich_text: NotionRichText[] };
  heading_3?: { rich_text: NotionRichText[] };
  paragraph?: { rich_text: NotionRichText[] };
  bulleted_list_item?: { rich_text: NotionRichText[] };
  numbered_list_item?: { rich_text: NotionRichText[] };
  code?: { rich_text: NotionRichText[]; language?: string };
  to_do?: { rich_text: NotionRichText[]; checked: boolean };
  quote?: { rich_text: NotionRichText[] };
  divider?: Record<string, never>;
}

interface NotionRichText {
  type: string;
  text?: { content: string };
  plain_text?: string;
  annotations?: {
    bold?: boolean;
    italic?: boolean;
    code?: boolean;
  };
}

export default function EditPostPage() {
  const { isAuthenticated, isLoading } = useAdminAuth();
  const router = useRouter();
  const params = useParams();
  const postId = params.id as string;
  
  const [post, setPost] = useState<NotionPage | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({
    title: '',
    description: '',
    tags: [] as string[],
    published: false,
    hidden: false,
    content: ''
  });

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/admin/login');
    }
  }, [isAuthenticated, isLoading, router]);

  const fetchPost = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`/api/admin/posts/${postId}`);
      
      if (response.ok) {
        const data = await response.json();
        if (data.post) {
          setPost(data.post);
          setEditForm({
            title: data.post.title || '',
            description: data.post.description || '',
            tags: [...(data.post.tags || [])],
            published: data.post.published || false,
            hidden: data.post.hidden || false,
            content: blocksToMarkdown(data.post.content || [])
          });
        } else {
          setError('포스트를 찾을 수 없습니다.');
        }
      } else if (response.status === 404) {
        setError('포스트를 찾을 수 없습니다.');
      } else {
        setError('포스트를 불러오는 중 오류가 발생했습니다.');
      }
    } catch (error) {
      console.error('Error fetching post:', error);
      setError('포스트를 불러오는 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  }, [postId]);

  useEffect(() => {
    if (isAuthenticated && postId) {
      fetchPost();
    }
  }, [isAuthenticated, postId, fetchPost]);

  // Notion 블록을 마크다운으로 변환하는 함수
  const blocksToMarkdown = (blocks: NotionBlock[]): string => {
    if (!blocks || !Array.isArray(blocks)) return '';
    
    return blocks.map(block => {
      if (!block || !block.type) return '';
      
      // rich_text를 안전하게 추출하는 헬퍼 함수
      const getRichText = (richTextArray: NotionRichText[]): string => {
        if (!richTextArray || !Array.isArray(richTextArray)) return '';
        return richTextArray.map((text: NotionRichText) => {
          if (!text) return '';
          // rich_text의 plain_text 또는 text.content 사용
          return text.plain_text || text.text?.content || '';
        }).join('');
      };
      
      // rich_text를 마크다운으로 변환하는 함수
      const richTextToMarkdown = (richTextArray: NotionRichText[]): string => {
        if (!richTextArray || !Array.isArray(richTextArray)) return '';
        return richTextArray.map((text: NotionRichText) => {
          if (!text) return '';
          let content = text.plain_text || text.text?.content || '';
          const annotations = text.annotations || {};
          
          // 굵은 글씨
          if (annotations.bold) {
            content = `**${content}**`;
          }
          // 기울임
          if (annotations.italic) {
            content = `*${content}*`;
          }
          // 인라인 코드
          if (annotations.code) {
            content = `\`${content}\``;
          }
          
          return content;
        }).join('');
      };
      
      try {
        switch (block.type) {
          case 'heading_1':
            return `# ${richTextToMarkdown(block.heading_1?.rich_text || [])}`;
          case 'heading_2':
            return `## ${richTextToMarkdown(block.heading_2?.rich_text || [])}`;
          case 'heading_3':
            return `### ${richTextToMarkdown(block.heading_3?.rich_text || [])}`;
          case 'paragraph':
            return richTextToMarkdown(block.paragraph?.rich_text || []);
          case 'bulleted_list_item':
            return `- ${richTextToMarkdown(block.bulleted_list_item?.rich_text || [])}`;
          case 'numbered_list_item':
            return `1. ${richTextToMarkdown(block.numbered_list_item?.rich_text || [])}`;
          case 'code':
            const codeText = getRichText(block.code?.rich_text || []);
            const language = block.code?.language || '';
            return `\`\`\`${language}\n${codeText}\n\`\`\``;
          case 'to_do':
            const checked = block.to_do?.checked ? '[x]' : '[ ]';
            return `${checked} ${richTextToMarkdown(block.to_do?.rich_text || [])}`;
          case 'quote':
            return `> ${richTextToMarkdown(block.quote?.rich_text || [])}`;
          case 'divider':
            return '---';
          default:
            // 알 수 없는 블록 타입의 경우 paragraph로 처리
            return richTextToMarkdown(block.paragraph?.rich_text || []);
        }
      } catch (error) {
        console.warn('Error processing block:', block, error);
        return '';
      }
    }).filter(line => line.trim() !== '').join('\n');
  };

  const handleSavePost = async () => {
    if (!post) return;

    setSaving(true);
    try {
      const response = await fetch(`/api/admin/posts/${post.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editForm),
      });

      if (response.ok) {
        router.push('/admin/posts');
      }
    } catch (error) {
      console.error('Error updating post:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleTagInput = (value: string) => {
    const tags = value.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
    setEditForm(prev => ({ ...prev, tags }));
  };

  // 로딩 중이거나 인증 확인 중
  if (isLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">
            {isLoading ? '인증 확인 중...' : '포스트를 불러오는 중...'}
          </p>
        </div>
      </div>
    );
  }

  // 인증되지 않은 경우
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            접근 권한이 없습니다
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            관리자 페이지에 접근하려면 로그인이 필요합니다.
          </p>
          <button
            onClick={() => router.push('/admin/login')}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            로그인 페이지로 이동
          </button>
        </div>
      </div>
    );
  }

  // 에러가 있거나 포스트가 없는 경우
  if (error || !post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            {error || '포스트를 찾을 수 없습니다'}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {error ? '다시 시도해주세요.' : '요청하신 포스트가 존재하지 않거나 삭제되었습니다.'}
          </p>
          <div className="flex justify-center space-x-3">
            <button
              onClick={() => router.push('/admin/posts')}
              className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              포스트 목록으로 돌아가기
            </button>
            {error && (
              <button
                onClick={fetchPost}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                다시 시도
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="border-b border-gray-200 dark:border-gray-700 pb-6">
        {/* 상단 버튼 영역 */}
        <div className="flex items-center justify-between mb-4">
          <Button
            onClick={() => router.push('/admin/posts')}
            variant="outline"
            size="sm"
            className="flex items-center"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            목록으로
          </Button>
          <div className="flex items-center space-x-3">
            <Button
              onClick={() => router.push('/admin/posts')}
              variant="outline"
              disabled={saving}
            >
              취소
            </Button>
            <Button
              onClick={handleSavePost}
              disabled={saving || !editForm.title.trim()}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {saving ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
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
        
        {/* 제목 영역 */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            포스트 수정
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            {post.title}
          </p>
        </div>
      </div>

      {/* 수정 폼 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 메인 편집 영역 */}
        <div className="lg:col-span-2 space-y-6">
          {/* 제목 */}
          <Card>
            <CardHeader>
              <CardTitle>제목</CardTitle>
            </CardHeader>
            <CardContent>
              <input
                type="text"
                value={editForm.title}
                onChange={(e) => setEditForm(prev => ({ ...prev, title: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                placeholder="포스트 제목을 입력하세요"
              />
            </CardContent>
          </Card>

          {/* 설명 */}
          <Card>
            <CardHeader>
              <CardTitle>설명</CardTitle>
            </CardHeader>
            <CardContent>
              <textarea
                value={editForm.description}
                onChange={(e) => setEditForm(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                placeholder="포스트 설명을 입력하세요"
              />
            </CardContent>
          </Card>

          {/* 내용 */}
          <Card>
            <CardHeader>
              <CardTitle>내용 (마크다운 형식)</CardTitle>
              <CardDescription>
                마크다운 문법을 사용할 수 있습니다: # 헤딩, **굵게**, *기울임*, - 리스트, ```코드블록```
              </CardDescription>
            </CardHeader>
            <CardContent>
              <textarea
                value={editForm.content}
                onChange={(e) => setEditForm(prev => ({ ...prev, content: e.target.value }))}
                rows={20}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white font-mono text-sm"
                placeholder="마크다운 형식으로 포스트 내용을 작성하세요..."
              />
            </CardContent>
          </Card>
        </div>

        {/* 사이드바 */}
        <div className="space-y-6">
          {/* 태그 */}
          <Card>
            <CardHeader>
              <CardTitle>태그</CardTitle>
              <CardDescription>쉼표로 구분하여 입력하세요</CardDescription>
            </CardHeader>
            <CardContent>
              <input
                type="text"
                value={editForm.tags.join(', ')}
                onChange={(e) => handleTagInput(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                placeholder="태그1, 태그2, 태그3"
              />
              <div className="flex flex-wrap gap-2 mt-3">
                {editForm.tags.map((tag, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* 상태 설정 */}
          <Card>
            <CardHeader>
              <CardTitle>상태 설정</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={editForm.published}
                  onChange={(e) => setEditForm(prev => ({ ...prev, published: e.target.checked }))}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                  발행됨
                </span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={editForm.hidden}
                  onChange={(e) => setEditForm(prev => ({ ...prev, hidden: e.target.checked }))}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                  숨김
                </span>
              </label>
            </CardContent>
          </Card>

          {/* 미리보기 */}
          <Card>
            <CardHeader>
              <CardTitle>미리보기</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                <div className="mb-2">
                  <strong>제목:</strong> {editForm.title || '제목 없음'}
                </div>
                <div className="mb-2">
                  <strong>설명:</strong> {editForm.description || '설명 없음'}
                </div>
                <div className="mb-2">
                  <strong>태그:</strong> {editForm.tags.length > 0 ? editForm.tags.join(', ') : '태그 없음'}
                </div>
                <div className="mb-2">
                  <strong>상태:</strong> 
                  {editForm.hidden ? ' 숨김' : editForm.published ? ' 발행됨' : ' 초안'}
                </div>
                <div>
                  <strong>내용 길이:</strong> {editForm.content.length}자
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
