'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { SocialLinks } from '@/components/common/social-links';
import { ArrowRight, Code, Terminal, BookOpen } from 'lucide-react';
import { format } from 'date-fns';
import { ko, enUS } from 'date-fns/locale';
import { NotionPage } from '@/types/notion';
import { useLanguage } from '@/lib/language-context';
import { useMemo } from 'react';
import { PopupDisplay } from '@/components/common/popup-display';

interface HomeContentProps {
  posts: NotionPage[];
  skills: { [key: string]: string[] };
  showPopup?: boolean;
}

export function HomeContent({ posts, skills, showPopup = true }: HomeContentProps) {
  const { language, t } = useLanguage();

  // 번역된 텍스트들을 메모이제이션
  const translatedTexts = useMemo(() => ({
    title: t('home.title'),
    subtitle: t('home.subtitle'),
    recentPosts: t('home.recent_posts'),
    viewAll: t('home.view_all'),
    noPosts: t('home.no_posts'),
    blogRead: t('home.blog_read'),
    aboutView: t('home.about_view'),
    developerBlog: t('home.developer_blog'),
    greeting: t('home.greeting'),
    name: t('home.name'),
    suffix: t('home.suffix'),
    description: t('home.description'),
    skills: t('home.skills'),
    recentPostsDesc: t('home.recent_posts_desc'),
  }), [t]);

  // Published 날짜 기준으로 최근 포스트 정렬 (최신 3개)
  const recentPosts = posts
    .filter(post => post.published && post.publishedDate)
    .sort((a, b) => new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime())
    .slice(0, 3);

  const formatDate = (dateString: string) => {
    try {
      const locale = language === 'ko' ? ko : enUS;
      return format(new Date(dateString), 'yyyy.MM.dd', { locale });
    } catch {
      return dateString;
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 transition-colors duration-200">
      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-8">
            <Badge variant="secondary" className="mb-4 px-3 py-1 text-sm font-mono">
              {translatedTexts.developerBlog}
            </Badge>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold text-slate-900 dark:text-slate-100 mb-6 leading-tight">
            {translatedTexts.greeting}<br />
            <span className="text-slate-600 dark:text-slate-400">{translatedTexts.name}</span>{translatedTexts.suffix}
          </h1>
          
          <p className="text-xl text-slate-600 dark:text-slate-400 mb-8 max-w-2xl mx-auto leading-relaxed">
            {translatedTexts.description.split('\n').map((line, index) => (
              <span key={index}>
                {line}
                {index === 0 && <br className="hidden sm:block" />}
              </span>
            ))}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link href="/blog">
              <Button 
                size="lg" 
                className="bg-slate-900 dark:bg-slate-100 hover:bg-slate-800 dark:hover:bg-slate-200 text-white dark:text-slate-900 px-8 py-3 transition-colors duration-200 cursor-pointer"
              >
                <BookOpen className="mr-2 h-5 w-5" />
                {translatedTexts.blogRead}
              </Button>
            </Link>
            <Link href="/about">
              <Button 
                variant="outline" 
                size="lg" 
                className="px-8 py-3 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors duration-200 cursor-pointer"
              >
                <Terminal className="mr-2 h-5 w-5" />
                {translatedTexts.aboutView}
              </Button>
            </Link>
          </div>

          {/* Social Links */}
          <SocialLinks iconSize={6} />
        </div>
      </section>

      {/* Skills Section */}
      {Object.keys(skills).length > 0 && (
        <section className="py-16 px-4 bg-slate-50 dark:bg-slate-800 transition-colors duration-200">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center text-slate-900 dark:text-slate-100 mb-12 flex items-center justify-center gap-3">
              <Code className="h-8 w-8 text-blue-600" />
{translatedTexts.skills}
              <Code className="h-8 w-8 text-blue-600" />
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {Object.entries(skills).map(([category, skillList]) => (
                <Card key={category} className="border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:shadow-md dark:hover:shadow-slate-800/50 transition-shadow">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg text-slate-900 dark:text-slate-100">{category}</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex flex-wrap gap-2">
                      {skillList.map((skill) => (
                        <Badge key={skill} variant="outline" className="text-xs border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Recent Posts Preview */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100">{translatedTexts.recentPosts}</h2>
            <Link 
              href="/blog" 
              className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-colors flex items-center"
            >
{translatedTexts.viewAll}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
          
          {recentPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recentPosts.map((post) => (
                <Card key={post.id} className="border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:shadow-md dark:hover:shadow-slate-800/50 transition-shadow cursor-pointer group">
                  <Link 
                    href={`/blog/${post.id}`} 
                    className="block h-full"
                  >
                    <CardHeader className="pb-4">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm text-slate-500 dark:text-slate-400 font-mono">
                          {formatDate(post.publishedDate)}
                        </span>
                        <ArrowRight className="h-4 w-4 text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors" />
                      </div>
                      
                      <CardTitle className="text-lg font-semibold text-slate-900 dark:text-slate-100 group-hover:text-slate-700 dark:group-hover:text-slate-300 transition-colors line-clamp-2 leading-tight">
                        {post.title}
                      </CardTitle>
                      
                      <CardDescription className="text-slate-600 dark:text-slate-400 line-clamp-3 leading-relaxed text-sm">
                        {post.description}
                      </CardDescription>
                    </CardHeader>
                    
                    <CardContent className="pt-0">
                      {post.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {post.tags.slice(0, 3).map((tag: string) => (
                            <Badge 
                              key={tag} 
                              variant="outline" 
                              className="text-xs border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
                            >
                              {tag}
                            </Badge>
                          ))}
                          {post.tags.length > 3 && (
                            <Badge variant="outline" className="text-xs border-slate-200 dark:border-slate-600 text-slate-500 dark:text-slate-500">
                              +{post.tags.length - 3}
                            </Badge>
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Link>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="text-6xl mb-6">📝</div>
              <h3 className="text-2xl font-semibold text-slate-700 dark:text-slate-300 mb-3">{translatedTexts.noPosts}</h3>
              <p className="text-slate-500 dark:text-slate-400 text-lg">{translatedTexts.recentPostsDesc}</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-slate-900 dark:bg-slate-950 transition-colors duration-200">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            {translatedTexts.title}
          </h2>
          <p className="text-lg text-slate-300 mb-8">
            {translatedTexts.subtitle}
          </p>
          <Link href="/blog">
            <Button 
              size="lg" 
              className="bg-white dark:bg-slate-100 text-slate-900 dark:text-slate-900 hover:bg-slate-100 dark:hover:bg-slate-200 px-8 py-3 transition-colors duration-200"
            >
{translatedTexts.blogRead}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>
      
      {/* 팝업 표시 */}
      <PopupDisplay 
        location="home"
        userType="guest"
        showPopup={showPopup}
      />
    </div>
  );
}
