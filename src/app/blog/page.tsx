'use client';

import { useState, useMemo, useEffect } from 'react';
import { BlogCard } from '@/components/blog/blog-card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Search, Filter, BookOpen, ChevronDown, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { NotionPage } from '@/types/notion';
import type { SearchResultItem } from '@/lib/notion-search';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { collectEvent } from '@/lib/analytics';
import { getSettingsClient } from '@/lib/settings';

export default function BlogPage() {
  const [posts, setPosts] = useState<NotionPage[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchResults, setSearchResults] = useState<SearchResultItem[] | null>(null);
  const [searchLoading, setSearchLoading] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const settings = getSettingsClient();

  useEffect(() => {
    if (typeof window === 'undefined') return;
    collectEvent({
      type: 'user_visit',
      description: '블로그 목록 페이지 방문',
      page: '/blog',
      userAgent: window.navigator.userAgent,
      referrer: document.referrer,
    });

    const fetchPosts = async () => {
      try {
        // 캐시 방지를 위한 옵션 추가
        const response = await fetch('/api/blog', {
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache'
          }
        });
        if (!response.ok) {
          throw new Error('API 요청에 실패했습니다');
        }
        const fetchedPosts = await response.json();
        setPosts(fetchedPosts);
      } catch (error) {
        console.error('포스트를 불러오는데 실패했습니다:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  // 본문 검색 (디바운스 후 API 호출)
  useEffect(() => {
    const q = searchTerm.trim();
    if (!q) {
      setSearchResults(null);
      return;
    }
    const timer = setTimeout(async () => {
      setSearchLoading(true);
      try {
        const res = await fetch(`/api/blog/search?q=${encodeURIComponent(q)}`);
        if (res.ok) {
          const data = await res.json();
          setSearchResults(data.results ?? []);
        } else {
          setSearchResults([]);
        }
      } catch {
        setSearchResults([]);
      } finally {
        setSearchLoading(false);
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // 모든 태그 수집
  const allTags = useMemo(() => {
    return Array.from(new Set(posts.flatMap(post => post.tags))).sort();
  }, [posts]);

  // 검색과 태그 필터링된 포스트 (최신순 정렬)
  const filteredPosts = useMemo(() => {
    return posts
      .filter(post => {
        // 검색어 필터링
        const matchesSearch = searchTerm === '' ||
          post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          post.description?.toLowerCase().includes(searchTerm.toLowerCase());

        // 태그 필터링
        const matchesTags = selectedTags.length === 0 ||
          selectedTags.some(tag => post.tags.includes(tag));

        return matchesSearch && matchesTags;
      })
      .sort((a, b) => {
        // Published 날짜 기준으로 최신순 정렬
        const dateA = new Date(a.publishedDate || a.lastUpdated).getTime();
        const dateB = new Date(b.publishedDate || b.lastUpdated).getTime();
        return dateB - dateA;
      });
  }, [posts, searchTerm, selectedTags]);

  // 페이지네이션된 포스트
  const paginatedPosts = useMemo(() => {
    const startIndex = (currentPage - 1) * settings.postsPerPage;
    const endIndex = startIndex + settings.postsPerPage;
    return filteredPosts.slice(startIndex, endIndex);
  }, [filteredPosts, currentPage, settings.postsPerPage]);

  // 총 페이지 수
  const totalPages = Math.ceil(filteredPosts.length / settings.postsPerPage);

  // 태그 선택/해제 토글
  const toggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  // 모든 태그 선택 해제
  const clearAllTags = () => {
    setSelectedTags([]);
  };

  // 개별 태그 제거
  const removeTag = (tagToRemove: string) => {
    setSelectedTags(prev => prev.filter(tag => tag !== tagToRemove));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-slate-900 transition-colors duration-200 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-600 dark:border-slate-400 mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-400">포스트를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 transition-colors duration-200">
      {/* Header */}
      <section className="pt-24 pb-16 px-4 bg-slate-50 dark:bg-slate-800 transition-colors duration-200">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-6">
            <BookOpen className="h-12 w-12 text-slate-600 dark:text-slate-400 mx-auto mb-4" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-slate-100 mb-6">
            개발 블로그
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
            개발에 대한 다양한 인사이트와 경험을 공유합니다.
            <br className="hidden sm:block" />
            함께 성장하는 개발자 커뮤니티가 되었으면 합니다.
          </p>
        </div>
      </section>

      {/* Search and Filter */}
      <section className="py-12 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Search and Filter - 모바일 최적화 */}
          <div className="flex flex-col gap-6 mb-8">
            {/* 검색 부분 */}
            <div className="relative w-full max-w-md mx-auto lg:mx-0">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 dark:text-slate-500 h-4 w-4" />
              <Input
                placeholder="포스트 검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-slate-200 dark:border-slate-600 focus:border-slate-400 dark:focus:border-slate-400 focus:ring-slate-400 dark:focus:ring-slate-400 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 w-full"
              />
            </div>

            {/* 태그 필터 부분 - 모바일 최적화 */}
            <div className="flex flex-col gap-4 w-full">
              <div className="flex items-center gap-3 justify-center lg:justify-start">
                <Filter className="h-4 w-4 text-slate-400 dark:text-slate-500" />
                <span className="text-sm text-slate-600 dark:text-slate-400 font-medium">태그 필터</span>
              </div>

              {/* 드롭다운 메뉴 */}
              <div className="flex justify-center lg:justify-start">
                <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className="border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 w-full max-w-xs lg:w-auto"
                    >
                      <span className="flex items-center gap-2">
                        <span>태그 선택</span>
                        {selectedTags.length > 0 && (
                          <Badge variant="secondary" className="bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs px-2 py-0.5">
                            {selectedTags.length}
                          </Badge>
                        )}
                      </span>
                      <ChevronDown className="ml-2 h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    className="w-80 max-h-96 overflow-y-auto bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-600"
                    align="center"
                    side="bottom"
                  >
                    <div className="p-2">
                      <div className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3 px-2">
                        태그 선택 ({selectedTags.length}/{allTags.length})
                      </div>
                      {allTags.map((tag) => (
                        <DropdownMenuItem
                          key={tag}
                          onClick={() => toggleTag(tag)}
                          className="text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 px-3 py-2 rounded-md flex items-center justify-between cursor-pointer"
                        >
                          <span className="flex-1 text-left">{tag}</span>
                          {selectedTags.includes(tag) && (
                            <span className="ml-2 text-slate-600 dark:text-slate-400">✓</span>
                          )}
                        </DropdownMenuItem>
                      ))}
                    </div>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* 선택된 태그들 표시 - 모바일 최적화 */}
              {selectedTags.length > 0 && (
                <div className="flex flex-col gap-3">
                  <div className="text-center lg:text-left">
                    <span className="text-sm text-slate-600 dark:text-slate-400">
                      선택된 태그: {selectedTags.length}개
                    </span>
                  </div>

                  {/* 선택된 태그 그리드 */}
                  <div className="flex flex-wrap gap-2 justify-center lg:justify-start">
                    {selectedTags.map((tag) => (
                      <Badge
                        key={tag}
                        variant="default"
                        className="bg-slate-600 dark:bg-slate-400 text-white dark:text-slate-900 text-sm px-3 py-2 flex items-center gap-2 cursor-pointer hover:bg-slate-500 dark:hover:bg-slate-300 transition-colors duration-200"
                        onClick={() => removeTag(tag)}
                      >
                        <span>{tag}</span>
                        <X className="h-4 w-4" />
                      </Badge>
                    ))}
                  </div>

                  {/* 초기화 버튼 */}
                  <div className="flex justify-center lg:justify-start">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={clearAllTags}
                      className="text-sm text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800 px-4 py-2"
                    >
                      모든 태그 초기화
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Posts Count */}
          <div className="mb-8 text-center lg:text-left">
            <p className="text-slate-600 dark:text-slate-400">
              {searchTerm.trim() && searchResults !== null ? (
                <>총 <span className="font-semibold text-slate-900 dark:text-slate-100">{searchResults.length}</span>개 검색 결과 (검색어: &quot;{searchTerm}&quot;)</>
              ) : (
                <>총 <span className="font-semibold text-slate-900 dark:text-slate-100">{filteredPosts.length}</span>개의 포스트
                  {searchTerm && <span className="ml-2">(검색어: &quot;{searchTerm}&quot;)</span>}
                  {selectedTags.length > 0 && <span className="ml-2">(태그: {selectedTags.join(', ')})</span>}
                </>
              )}
            </p>
          </div>

          {/* Posts Grid */}
          {searchTerm.trim() && searchResults !== null ? (
            searchLoading ? (
              <div className="py-20 text-center">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-slate-600 dark:border-slate-400 mx-auto mb-4" />
                <p className="text-slate-600 dark:text-slate-400">검색 중...</p>
              </div>
            ) : searchResults.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {searchResults.map((r) => (
                  <BlogCard
                    key={r.id}
                    post={{
                      id: r.id,
                      title: r.title,
                      description: r.description,
                      published: true,
                      publishedDate: '',
                      lastUpdated: '',
                      tags: r.tags ?? [],
                      created: '',
                      content: [],
                      allowComments: true,
                    }}
                    snippet={r.snippet}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <div className="text-6xl mb-6">🔍</div>
                <h3 className="text-2xl font-semibold text-slate-700 dark:text-slate-300 mb-3">검색 결과가 없습니다</h3>
                <p className="text-slate-500 dark:text-slate-400 mb-6">다른 검색어를 시도해 보세요.</p>
              </div>
            )
          ) : paginatedPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginatedPosts.map((post) => (
                <BlogCard key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="text-6xl mb-6">🔍</div>
              <h3 className="text-2xl font-semibold text-slate-700 dark:text-slate-300 mb-3">
                검색 결과가 없습니다
              </h3>
              <p className="text-slate-500 dark:text-slate-400 text-lg mb-6">
                {searchTerm || selectedTags.length > 0
                  ? '다른 검색어나 태그를 시도해보세요.'
                  : '아직 포스트가 없습니다. 곧 새로운 개발 내용으로 찾아뵙겠습니다!'
                }
              </p>
              {(searchTerm || selectedTags.length > 0) && (
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedTags([]);
                  }}
                  className="border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800"
                >
                  필터 초기화
                </Button>
              )}
            </div>
          )}

          {/* 페이지네이션 (검색 모드가 아닐 때만) */}
          {totalPages > 1 && !(searchTerm.trim() && searchResults !== null) && (
            <div className="mt-12 flex justify-center">
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="border-slate-200 dark:border-slate-600"
                >
                  이전
                </Button>

                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }

                    return (
                      <Button
                        key={pageNum}
                        variant={currentPage === pageNum ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCurrentPage(pageNum)}
                        className={
                          currentPage === pageNum
                            ? "bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900"
                            : "border-slate-200 dark:border-slate-600"
                        }
                      >
                        {pageNum}
                      </Button>
                    );
                  })}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="border-slate-200 dark:border-slate-600"
                >
                  다음
                </Button>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
