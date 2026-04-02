'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';

type Language = 'ko' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// 번역 데이터
const translations = {
  ko: {

    // 프로필 설정
    'profile.title': '설정',
    'profile.subtitle': '프로필과 계정 설정을 관리하세요',
    'profile.profile_info': '프로필 정보',
    'profile.name': '이름',
    'profile.name_placeholder': '이름을 입력하세요',
    'profile.email': '이메일',
    'profile.email_readonly': '이메일은 변경할 수 없습니다.',
    'profile.theme_settings': '테마 설정',
    'profile.theme': '테마',
    'profile.theme_light': '라이트',
    'profile.theme_dark': '다크',
    'profile.theme_system': '시스템 설정',
    'profile.language': '언어',
    'profile.language_ko': '한국어',
    'profile.language_en': 'English',
    'profile.notification_settings': '알림 설정',
    'profile.email_notification': '이메일 알림',
    'profile.email_notification_desc': '이메일로 알림을 받습니다',
    'profile.push_notification': '푸시 알림',
    'profile.push_notification_desc': '브라우저 푸시 알림을 받습니다',
    'profile.password_change': '비밀번호 변경',
    'profile.current_password': '현재 비밀번호',
    'profile.current_password_placeholder': '현재 비밀번호를 입력하세요',
    'profile.new_password': '새 비밀번호',
    'profile.new_password_placeholder': '새 비밀번호를 입력하세요 (6자 이상)',
    'profile.confirm_password': '새 비밀번호 확인',
    'profile.confirm_password_placeholder': '새 비밀번호를 다시 입력하세요',
    'profile.image_upload': '이미지 업로드',
    'profile.image_delete': '이미지 삭제',
    'profile.image_recommendation': '권장 크기: 128x128px 이하, 최대 10MB',
    'profile.uploading': '업로드 중...',
    'profile.deleting': '삭제 중...',
    'profile.saving': '저장 중...',
    'profile.changing': '변경 중...',

    // 메시지
    'message.profile_updated': '프로필이 업데이트되었습니다.',
    'message.password_changed': '비밀번호가 성공적으로 변경되었습니다.',
    'message.avatar_uploaded': '아바타가 성공적으로 업로드되었습니다.',
    'message.avatar_deleted': '아바타가 성공적으로 삭제되었습니다.',
    'message.all_fields_required': '모든 필드를 입력해주세요.',
    'message.password_mismatch': '새 비밀번호가 일치하지 않습니다.',
    'message.password_too_short': '새 비밀번호는 6자 이상이어야 합니다.',
    'message.login_required': '로그인이 필요합니다',
    'message.login_required_desc': '설정을 변경하려면 로그인해주세요.',
    'message.go_home': '홈으로 이동',
    'message.delete_confirm': '프로필 이미지를 삭제하시겠습니까?',
    'message.feature_coming_soon': '이 기능은 곧 추가될 예정입니다.',

    // 네비게이션
    'nav.home': '홈',
    'nav.blog': '블로그',
    'nav.about': '소개',
    'nav.login': '로그인',
    'nav.register': '회원가입',
    'nav.logout': '로그아웃',
    'nav.profile': '프로필',
    'nav.settings': '설정',
    'nav.playground': '플레이그라운드',
    'nav.home_desc': '메인 페이지로 이동',
    'nav.blog_desc': '기술 블로그 포스트',
    'nav.playground_desc': '코딩 실험실',
    'nav.about_desc': '개발자 소개',
    'nav.menu_open': '메뉴 열기',
    'nav.menu_close': '메뉴 닫기',

    // 홈페이지
    'home.title': '개발자 주환의 기술 블로그',
    'home.subtitle': '풀스택 개발자 주환의 기술 블로그입니다. React, TypeScript, Node.js 등 다양한 개발 경험과 지식을 공유합니다.',
    'home.recent_posts': '최근 포스트',
    'home.view_all': '모두 보기',
    'home.no_posts': '아직 작성된 포스트가 없습니다.',
    'home.blog_read': '블로그 읽기',
    'home.about_view': '소개 보기',
    'home.developer_blog': '개발자 블로그',
    'home.greeting': '안녕하세요,',
    'home.name': '주환',
    'home.suffix': '입니다',
    'home.description': '풀스택 개발자로서의 경험과 지식을 공유하며,\n함께 성장하는 개발자 커뮤니티를 만들어갑니다.',
    'home.skills': '기술 스택',
    'home.recent_posts_desc': '최근에 작성한 포스트들을 확인해보세요.',

    // 블로그
    'blog.title': '블로그',
    'blog.subtitle': '개발 관련 글들을 모아놓은 공간입니다.',
    'blog.read_more': '더 읽기',
    'blog.published_on': '게시일',
    'blog.author': '작성자',
    'blog.tags': '태그',
    'blog.category': '카테고리',
    'blog.search_placeholder': '포스트 검색...',
    'blog.no_results': '검색 결과가 없습니다.',

    // 블로그 포스트
    'post.reading_time': '분 소요',
    'post.share': '공유하기',
    'post.related_posts': '관련 포스트',
    'post.comments': '댓글',
    'post.write_comment': '댓글 작성',
    'post.reply': '답글',
    'post.edit': '수정',
    'post.delete': '삭제',
    'post.report': '신고',

    // 댓글
    'comment.placeholder': '댓글을 작성해주세요...',
    'comment.submit': '댓글 작성',
    'comment.reply_placeholder': '답글을 작성해주세요...',
    'comment.submit_reply': '답글 작성',
    'comment.login_required': '댓글을 작성하려면 로그인이 필요합니다.',
    'comment.name_required': '이름을 입력해주세요.',
    'comment.email_required': '이메일을 입력해주세요.',
    'comment.content_required': '댓글 내용을 입력해주세요.',
    'comment.posted_on': '작성일',
    'comment.reply_to': '답글',

    // 반응
    'reaction.like': '좋아요',
    'reaction.dislike': '싫어요',
    'reaction.recommend': '추천',
    'reaction.not_recommend': '비추천',
    'reaction.login_required': '반응을 남기려면 로그인이 필요합니다.',

    // 프로필 추가 정보
    'profile.activity': '활동 내역',
    'profile.comments': '내 댓글',
    'profile.reactions': '내 반응',
    'profile.edit_profile': '프로필 편집',
    'profile.member_since': '가입일',
    'profile.last_active': '마지막 활동',
    'profile.total_comments': '총 댓글 수',
    'profile.total_reactions': '총 반응 수',

    // 소개 페이지
    'about.title': '소개',
    'about.subtitle': '개발자 주환에 대해 알아보세요.',
    'about.introduction': '자기소개',
    'about.skills': '기술 스택',
    'about.experience': '경력',
    'about.education': '학력',
    'about.contact': '연락처',

    // 로그인/회원가입
    'auth.login_title': '로그인',
    'auth.register_title': '회원가입',
    'auth.email': '이메일',
    'auth.password': '비밀번호',
    'auth.name': '이름',
    'auth.confirm_password': '비밀번호 확인',
    'auth.login_button': '로그인',
    'auth.register_button': '회원가입',
    'auth.forgot_password': '비밀번호를 잊으셨나요?',
    'auth.no_account': '계정이 없으신가요?',
    'auth.have_account': '이미 계정이 있으신가요?',
    'auth.login_success': '로그인되었습니다.',
    'auth.register_success': '회원가입이 완료되었습니다.',
    'auth.login_failed': '로그인에 실패했습니다.',
    'auth.register_failed': '회원가입에 실패했습니다.',
    'auth.invalid_credentials': '이메일 또는 비밀번호가 올바르지 않습니다.',
    'auth.email_already_exists': '이미 사용 중인 이메일입니다.',
    'auth.password_mismatch': '비밀번호가 일치하지 않습니다.',
    'auth.password_too_short': '비밀번호는 6자 이상이어야 합니다.',

    // 태그
    'tags.title': '태그',
    'tags.subtitle': '관심 있는 주제의 포스트를 찾아보세요.',
    'tags.no_posts': '이 태그에 해당하는 포스트가 없습니다.',
    'tags.posts_count': '개의 포스트',

    // 검색
    'search.title': '검색',
    'search.placeholder': '검색어를 입력하세요...',
    'search.results': '검색 결과',
    'search.no_results': '검색 결과가 없습니다.',
    'search.try_different': '다른 검색어를 시도해보세요.',

    // 공통
    'common.loading': '로딩 중...',
    'common.error': '오류가 발생했습니다.',
    'common.retry': '다시 시도',
    'common.back': '뒤로',
    'common.next': '다음',
    'common.previous': '이전',
    'common.page': '페이지',
    'common.of': '중',
    'common.total': '총',
    'common.items': '개',
    'common.showing': '표시 중',
    'common.to': '~',
    'common.entries': '항목',
    'common.no_data': '데이터가 없습니다.',
    'common.refresh': '새로고침',
    'common.open': '열기',
    'common.expand': '펼치기',
    'common.collapse': '접기',
    'common.more': '더보기',
    'common.less': '간략히',
    'common.all': '전체',
    'common.none': '없음',
    'common.select_all': '전체 선택',
    'common.clear': '지우기',
    'common.reset': '초기화',
    'common.apply': '적용',
    'common.create': '생성',
    'common.update': '업데이트',
    'common.view': '보기',
    'common.download': '다운로드',
    'common.upload': '업로드',
    'common.copy': '복사',
    'common.paste': '붙여넣기',
    'common.cut': '잘라내기',
    'common.undo': '실행 취소',
    'common.redo': '다시 실행',
    'common.search': '검색',
    'common.filter': '필터',
    'common.sort': '정렬',
    'common.ascending': '오름차순',
    'common.descending': '내림차순',
    'common.date': '날짜',
    'common.time': '시간',
    'common.today': '오늘',
    'common.yesterday': '어제',
    'common.this_week': '이번 주',
    'common.this_month': '이번 달',
    'common.this_year': '올해',
  },
  en: {

    // Profile settings
    'profile.title': 'Settings',
    'profile.subtitle': 'Manage your profile and account settings',
    'profile.profile_info': 'Profile Information',
    'profile.name': 'Name',
    'profile.name_placeholder': 'Enter your name',
    'profile.email': 'Email',
    'profile.email_readonly': 'Email cannot be changed.',
    'profile.theme_settings': 'Theme Settings',
    'profile.theme': 'Theme',
    'profile.theme_light': 'Light',
    'profile.theme_dark': 'Dark',
    'profile.theme_system': 'System',
    'profile.language': 'Language',
    'profile.language_ko': '한국어',
    'profile.language_en': 'English',
    'profile.notification_settings': 'Notification Settings',
    'profile.email_notification': 'Email Notifications',
    'profile.email_notification_desc': 'Receive notifications via email',
    'profile.push_notification': 'Push Notifications',
    'profile.push_notification_desc': 'Receive browser push notifications',
    'profile.password_change': 'Change Password',
    'profile.current_password': 'Current Password',
    'profile.current_password_placeholder': 'Enter your current password',
    'profile.new_password': 'New Password',
    'profile.new_password_placeholder': 'Enter new password (6+ characters)',
    'profile.confirm_password': 'Confirm New Password',
    'profile.confirm_password_placeholder': 'Re-enter your new password',
    'profile.image_upload': 'Upload Image',
    'profile.image_delete': 'Delete Image',
    'profile.image_recommendation': 'Recommended: 128x128px or smaller, max 10MB',
    'profile.uploading': 'Uploading...',
    'profile.deleting': 'Deleting...',
    'profile.saving': 'Saving...',
    'profile.changing': 'Changing...',

    // Messages
    'message.profile_updated': 'Profile has been updated.',
    'message.password_changed': 'Password has been changed successfully.',
    'message.avatar_uploaded': 'Avatar has been uploaded successfully.',
    'message.avatar_deleted': 'Avatar has been deleted successfully.',
    'message.all_fields_required': 'Please fill in all fields.',
    'message.password_mismatch': 'New passwords do not match.',
    'message.password_too_short': 'New password must be at least 6 characters.',
    'message.login_required': 'Login Required',
    'message.login_required_desc': 'Please log in to change settings.',
    'message.go_home': 'Go to Home',
    'message.delete_confirm': 'Are you sure you want to delete the profile image?',
    'message.feature_coming_soon': 'This feature will be added soon.',

    // Navigation
    'nav.home': 'Home',
    'nav.blog': 'Blog',
    'nav.about': 'About',
    'nav.login': 'Login',
    'nav.register': 'Register',
    'nav.logout': 'Logout',
    'nav.profile': 'Profile',
    'nav.settings': 'Settings',
    'nav.playground': 'Playground',
    'nav.home_desc': 'Go to main page',
    'nav.blog_desc': 'Tech blog posts',
    'nav.playground_desc': 'Coding laboratory',
    'nav.about_desc': 'About developer',
    'nav.menu_open': 'Open menu',
    'nav.menu_close': 'Close menu',

    // Homepage
    'home.title': 'Developer Joohwan\'s Tech Blog',
    'home.subtitle': 'Full-stack developer Joohwan\'s tech blog. Sharing various development experiences and knowledge about React, TypeScript, Node.js, etc.',
    'home.recent_posts': 'Recent Posts',
    'home.view_all': 'View All',
    'home.no_posts': 'No posts have been written yet.',
    'home.blog_read': 'Read Blog',
    'home.about_view': 'View About',
    'home.developer_blog': 'Developer Blog',
    'home.greeting': 'Hello,',
    'home.name': 'Joohwan',
    'home.suffix': 'here',
    'home.description': 'As a full-stack developer, I share my experience and knowledge,\nbuilding a developer community that grows together.',
    'home.skills': 'Tech Stack',
    'home.recent_posts_desc': 'Check out the recently written posts.',

    // Blog
    'blog.title': 'Blog',
    'blog.subtitle': 'A space where development-related articles are collected.',
    'blog.read_more': 'Read More',
    'blog.published_on': 'Published on',
    'blog.author': 'Author',
    'blog.tags': 'Tags',
    'blog.category': 'Category',
    'blog.search_placeholder': 'Search posts...',
    'blog.no_results': 'No search results found.',

    // Blog Post
    'post.reading_time': 'min read',
    'post.share': 'Share',
    'post.related_posts': 'Related Posts',
    'post.comments': 'Comments',
    'post.write_comment': 'Write Comment',
    'post.reply': 'Reply',
    'post.edit': 'Edit',
    'post.delete': 'Delete',
    'post.report': 'Report',

    // Comments
    'comment.placeholder': 'Write a comment...',
    'comment.submit': 'Submit Comment',
    'comment.reply_placeholder': 'Write a reply...',
    'comment.submit_reply': 'Submit Reply',
    'comment.login_required': 'Login required to write comments.',
    'comment.name_required': 'Please enter your name.',
    'comment.email_required': 'Please enter your email.',
    'comment.content_required': 'Please enter comment content.',
    'comment.posted_on': 'Posted on',
    'comment.reply_to': 'Reply to',

    // Reactions
    'reaction.like': 'Like',
    'reaction.dislike': 'Dislike',
    'reaction.recommend': 'Recommend',
    'reaction.not_recommend': 'Not Recommend',
    'reaction.login_required': 'Login required to leave reactions.',

    // Profile additional info
    'profile.activity': 'Activity',
    'profile.comments': 'My Comments',
    'profile.reactions': 'My Reactions',
    'profile.edit_profile': 'Edit Profile',
    'profile.member_since': 'Member since',
    'profile.last_active': 'Last active',
    'profile.total_comments': 'Total Comments',
    'profile.total_reactions': 'Total Reactions',

    // About Page
    'about.title': 'About',
    'about.subtitle': 'Learn about developer Joohwan.',
    'about.introduction': 'Introduction',
    'about.skills': 'Skills',
    'about.experience': 'Experience',
    'about.education': 'Education',
    'about.contact': 'Contact',

    // Login/Register
    'auth.login_title': 'Login',
    'auth.register_title': 'Register',
    'auth.email': 'Email',
    'auth.password': 'Password',
    'auth.name': 'Name',
    'auth.confirm_password': 'Confirm Password',
    'auth.login_button': 'Login',
    'auth.register_button': 'Register',
    'auth.forgot_password': 'Forgot your password?',
    'auth.no_account': 'Don\'t have an account?',
    'auth.have_account': 'Already have an account?',
    'auth.login_success': 'Logged in successfully.',
    'auth.register_success': 'Registration completed successfully.',
    'auth.login_failed': 'Login failed.',
    'auth.register_failed': 'Registration failed.',
    'auth.invalid_credentials': 'Invalid email or password.',
    'auth.email_already_exists': 'Email already exists.',
    'auth.password_mismatch': 'Passwords do not match.',
    'auth.password_too_short': 'Password must be at least 6 characters.',

    // Tags
    'tags.title': 'Tags',
    'tags.subtitle': 'Find posts on topics you\'re interested in.',
    'tags.no_posts': 'No posts found for this tag.',
    'tags.posts_count': 'posts',

    // Search
    'search.title': 'Search',
    'search.placeholder': 'Enter search terms...',
    'search.results': 'Search Results',
    'search.no_results': 'No search results found.',
    'search.try_different': 'Try different search terms.',

    // Common (already exists, but ensuring consistency)
    'common.error': 'An error occurred.',
    'common.retry': 'Retry',
    'common.back': 'Back',
    'common.next': 'Next',
    'common.previous': 'Previous',
    'common.page': 'Page',
    'common.of': 'of',
    'common.total': 'Total',
    'common.items': 'items',
    'common.showing': 'Showing',
    'common.to': 'to',
    'common.entries': 'entries',
    'common.no_data': 'No data available.',
    'common.refresh': 'Refresh',
    'common.open': 'Open',
    'common.expand': 'Expand',
    'common.collapse': 'Collapse',
    'common.more': 'More',
    'common.less': 'Less',
    'common.all': 'All',
    'common.none': 'None',
    'common.select_all': 'Select All',
    'common.clear': 'Clear',
    'common.reset': 'Reset',
    'common.apply': 'Apply',
    'common.create': 'Create',
    'common.update': 'Update',
    'common.view': 'View',
    'common.download': 'Download',
    'common.upload': 'Upload',
    'common.copy': 'Copy',
    'common.paste': 'Paste',
    'common.cut': 'Cut',
    'common.undo': 'Undo',
    'common.redo': 'Redo',
    'common.search': 'Search',
    'common.filter': 'Filter',
    'common.sort': 'Sort',
    'common.ascending': 'Ascending',
    'common.descending': 'Descending',
    'common.date': 'Date',
    'common.time': 'Time',
    'common.today': 'Today',
    'common.yesterday': 'Yesterday',
    'common.this_week': 'This Week',
    'common.this_month': 'This Month',
    'common.this_year': 'This Year',
  }
};

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('ko');

  useEffect(() => {
    // 로컬 스토리지에서 언어 설정 불러오기
    const savedLanguage = localStorage.getItem('language') as Language;
    if (savedLanguage && (savedLanguage === 'ko' || savedLanguage === 'en')) {
      setLanguageState(savedLanguage);
    }
  }, []);

  useEffect(() => {
    // 언어 변경 시 로컬 스토리지 업데이트
    localStorage.setItem('language', language);
  }, [language]);

  const setLanguage = useCallback((newLanguage: Language) => {
    setLanguageState(newLanguage);
  }, []);

  const t = useCallback((key: string): string => {
    const translation = translations[language][key as keyof typeof translations[typeof language]];
    return translation || key;
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
