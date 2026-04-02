# Dev Blog

Next.js와 노션 API를 활용한 개발자 블로그입니다. shadcn/ui의 stone 테마를 적용하여 깔끔하고 세련된 디자인을 제공하며, 실시간 코드 플레이그라운드 기능을 포함합니다.
버그들 혹은 추가 기능 있으면 언제든지 PR 부탁드립니다~!

## 🚀 주요 기능

- **노션 연동**: 노션 데이터베이스를 CMS로 활용하여 콘텐츠 관리
- **웹 플레이그라운드**: 12가지 다양한 웹 템플릿으로 HTML/CSS/JS 실시간 학습
- **리액트 플레이그라운드**: 11가지 다양한 리액트 템플릿으로 실습 가능
- **마크다운 플레이그라운드**: 6가지 마크다운 템플릿으로 문서 작성 및 수식 렌더링
- **반응형 디자인**: 모바일과 데스크톱에서 최적화된 사용자 경험
- **태그 시스템**: 포스트를 카테고리별로 분류하고 검색 가능
- **댓글 시스템**: 3단계 계층적 댓글 시스템 (댓글 → 대댓글 → 대대댓글)
- **익명 댓글**: 기본적으로 익명으로 표시되며 선택적으로 이름 표시 가능
- **실시간 댓글**: 댓글 작성 시 즉시 업데이트되는 실시간 시스템
- **댓글 접기/펼치기**: 답글이 많은 댓글을 접고 펼칠 수 있는 기능
- **댓글 허용 설정**: 사이트 전체 및 포스트별 댓글 허용/비활성화 설정
- **반응 시스템**: 좋아요, 싫어요, 추천, 비추천 4가지 반응 타입
- **중복 방지**: IP 기반으로 중복 반응 방지
- **관리자 페이지**: 블로그 통계 및 포스트 관리 대시보드
- **사이트 설정 관리**: 노션을 통한 사이트 설정 중앙 관리
- **실시간 이벤트 추적**: 사용자 활동을 노션 데이터베이스에 실시간 저장
- **포스트 관리**: 발행/초안/숨김 상태 관리 및 포스트 편집
- **이미지 지원**: 노션의 이미지 블록을 자동으로 파싱하여 표시
- **SEO 최적화**: 메타데이터와 구조화된 데이터 지원
- **다크 모드**: shadcn/ui의 테마 시스템을 활용한 완전한 다크 모드 지원
- **웹 알림 시스템**: Firebase Cloud Messaging을 통한 실시간 푸시 알림
- **PC 알림 시스템**: 브라우저 네이티브 알림 API를 활용한 PC 알림
- **사용자 알림 설정**: 개인별 알림 설정 및 관리
- **팝업 관리 시스템**: 사용자 페이지에 표시될 팝업을 관리하는 시스템
- **블로그 검색 챗봇**: 우측 하단 플로팅 버튼으로 노션 AI 스타일 채팅 패널에서 블로그 글 검색
- **인터넷 검색 연동**: 키워드 검색 시 블로그 결과와 함께 Serper API 기반 인터넷 검색 결과 표시
- **구조화된 컴포넌트**: 확장 가능한 컴포넌트 아키텍처

## 🛠️ 기술 스택

- **프레임워크**: Next.js 16.1.4 (App Router)
- **언어**: TypeScript
- **스타일링**: Tailwind CSS
- **UI 컴포넌트**: shadcn/ui (stone 테마)
- **CMS**: Notion API
- **아이콘**: Lucide React
- **날짜 처리**: date-fns
- **마크다운**: react-markdown, remark-gfm, rehype-highlight
- **수식 렌더링**: remark-math, rehype-katex, katex
- **웹 검색**: Serper API (Google 검색 결과)
- **알림 시스템**: Firebase Cloud Messaging, Browser Notifications API
- **상태 관리**: React Context API
- **폼 관리**: React Hook Form
- **토스트 알림**: Sonner

## 📁 프로젝트 구조

```
dev-blog/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── about/             # 소개 페이지
│   │   │   ├── loading.tsx    # 로딩 페이지
│   │   │   └── page.tsx       # 소개 페이지
│   │   ├── admin/             # 관리자 페이지
│   │   │   ├── admin-layout-client.tsx # 관리자 레이아웃 클라이언트
│   │   │   ├── comments/      # 댓글 관리 페이지
│   │   │   │   ├── loading.tsx # 로딩 페이지
│   │   │   │   └── page.tsx   # 댓글 관리
│   │   │   ├── login/         # 관리자 로그인 페이지
│   │   │   │   └── page.tsx   # 로그인 폼
│   │   │   ├── posts/         # 포스트 관리 페이지
│   │   │   │   ├── [id]/      # 개별 포스트 관리
│   │   │   │   │   └── edit/  # 포스트 편집
│   │   │   │   │       └── page.tsx
│   │   │   │   ├── loading.tsx # 로딩 페이지
│   │   │   │   └── page.tsx   # 포스트 목록 및 관리
│   │   │   ├── reactions/     # 반응 관리 페이지
│   │   │   │   ├── loading.tsx # 로딩 페이지
│   │   │   │   └── page.tsx   # 반응 관리
│   │   │   ├── popups/        # 팝업 관리 페이지
│   │   │   │   └── page.tsx   # 팝업 생성, 편집, 관리
│   │   │   ├── settings/      # 사이트 설정 페이지
│   │   │   │   ├── loading.tsx # 로딩 페이지
│   │   │   │   └── page.tsx   # 사이트 설정 관리
│   │   │   ├── statistics/    # 통계 분석 페이지
│   │   │   │   ├── loading.tsx # 로딩 페이지
│   │   │   │   └── page.tsx   # 상세 통계 및 차트
│   │   │   ├── users/         # 사용자 관리 페이지
│   │   │   │   ├── loading.tsx # 로딩 페이지
│   │   │   │   └── page.tsx   # 사용자 목록 및 관리
│   │   │   ├── layout.tsx     # 관리자 레이아웃
│   │   │   └── page.tsx       # 관리자 대시보드
│   │   ├── api/               # API 라우트
│   │   │   ├── admin/         # 관리자 API
│   │   │   │   ├── activity/  # 활동 로그 API
│   │   │   │   │   └── route.ts
│   │   │   │   ├── auth/      # 관리자 인증 API
│   │   │   │   │   └── route.ts
│   │   │   │   ├── comments/  # 댓글 관리 API
│   │   │   │   │   ├── [id]/  # 개별 댓글 API
│   │   │   │   │   │   └── route.ts
│   │   │   │   │   └── route.ts
│   │   │   │   ├── logout/    # 로그아웃 API
│   │   │   │   │   └── route.ts
│   │   │   │   ├── posts/     # 포스트 관리 API
│   │   │   │   │   ├── [id]/  # 개별 포스트 API
│   │   │   │   │   │   └── route.ts
│   │   │   │   │   └── route.ts
│   │   │   │   ├── popups/     # 팝업 관리 API
│   │   │   │   │   ├── [id]/  # 개별 팝업 API
│   │   │   │   │   │   └── route.ts
│   │   │   │   │   └── route.ts
│   │   │   │   ├── reactions/ # 반응 관리 API
│   │   │   │   │   └── route.ts
│   │   │   │   ├── sessions/  # 세션 관리 API
│   │   │   │   │   └── cleanup/ # 세션 정리 API
│   │   │   │   │       └── route.ts
│   │   │   │   ├── settings/  # 사이트 설정 API
│   │   │   │   │   ├── initialize/ # 설정 초기화 API
│   │   │   │   │   │   └── route.ts
│   │   │   │   │   └── route.ts
│   │   │   │   ├── statistics/ # 상세 통계 API
│   │   │   │   │   ├── daily/ # 일별 통계
│   │   │   │   │   │   └── route.ts
│   │   │   │   │   ├── event-types/ # 이벤트 타입별 통계
│   │   │   │   │   │   └── route.ts
│   │   │   │   │   └── hourly/ # 시간대별 통계
│   │   │   │   │       └── route.ts
│   │   │   │   ├── stats/     # 통계 API
│   │   │   │   │   └── route.ts
│   │   │   │   ├── users/     # 사용자 관리 API
│   │   │   │   │   ├── [id]/  # 개별 사용자 API
│   │   │   │   │   │   ├── password/ # 비밀번호 변경 API
│   │   │   │   │   │   │   └── route.ts
│   │   │   │   │   │   └── route.ts
│   │   │   │   │   └── route.ts
│   │   │   │   └── verify/    # 인증 확인 API
│   │   │   │       └── route.ts
│   │   │   ├── auth/          # 사용자 인증 API
│   │   │   │   ├── change-password/ # 비밀번호 변경 API
│   │   │   │   │   └── route.ts
│   │   │   │   ├── delete-avatar/ # 아바타 삭제 API
│   │   │   │   │   └── route.ts
│   │   │   │   ├── login/     # 로그인 API
│   │   │   │   │   └── route.ts
│   │   │   │   ├── logout/    # 로그아웃 API
│   │   │   │   │   └── route.ts
│   │   │   │   ├── me/        # 현재 사용자 정보 API
│   │   │   │   │   └── route.ts
│   │   │   │   ├── profile/   # 프로필 수정 API
│   │   │   │   │   └── route.ts
│   │   │   │   ├── register/  # 회원가입 API
│   │   │   │   │   └── route.ts
│   │   │   │   └── upload-avatar/ # 아바타 업로드 API
│   │   │   │       └── route.ts
│   │   │   ├── blog/          # 블로그 API
│   │   │   │   ├── route.ts
│   │   │   │   └── search/    # 블로그 검색 API (챗봇용)
│   │   │   │       └── route.ts
│   │   │   ├── comments/      # 댓글 API
│   │   │   │   ├── [id]/      # 개별 댓글 API
│   │   │   │   │   └── report/ # 댓글 신고 API
│   │   │   │   │       └── route.ts
│   │   │   │   └── route.ts
│   │   │   ├── debug/         # 디버그 API
│   │   │   │   ├── env/       # 환경변수 디버그
│   │   │   │   │   └── route.ts
│   │   │   │   ├── env-check/ # 환경변수 체크
│   │   │   │   ├── notion/    # 노션 디버그
│   │   │   │   ├── notion-test/ # 노션 테스트
│   │   │   │   ├── permissions/ # 권한 디버그
│   │   │   │   ├── test-event-creation/ # 이벤트 생성 테스트
│   │   │   │   └── users/     # 사용자 디버그
│   │   │   ├── events/        # 이벤트 추적 API
│   │   │   │   ├── collect/   # 이벤트 수집 API
│   │   │   │   │   └── route.ts
│   │   │   │   ├── recent/    # 최근 이벤트 API
│   │   │   │   │   └── route.ts
│   │   │   │   └── stream/    # 실시간 이벤트 스트림 API
│   │   │   │       └── route.ts
│   │   │   ├── reactions/     # 반응 API
│   │   │   │   └── route.ts
│   │   │   ├── notifications/ # 웹 알림 API
│   │   │   │   ├── send/      # 알림 전송 API
│   │   │   │   │   └── route.ts
│   │   │   │   ├── register/  # FCM 토큰 등록 API
│   │   │   │   │   └── route.ts
│   │   │   │   └── users/     # 사용자 알림 설정 API
│   │   │   │       └── route.ts
│   │   │   ├── pc-notifications/ # PC 알림 API
│   │   │   │   └── send/      # PC 알림 전송 API
│   │   │   │       └── route.ts
│   │   │   ├── popups/        # 팝업 API (사용자 페이지용)
│   │   │   │   └── route.ts
│   │   │   ├── search/        # 검색 API (챗봇용)
│   │   │   │   └── web/       # 인터넷 검색 API (Serper)
│   │   │   │       └── route.ts
│   │   │   ├── test-event/    # 테스트 이벤트 API
│   │   │   └── user/          # 사용자 활동 API
│   │   │       ├── activity/  # 사용자 활동 로그 API
│   │   │       │   └── route.ts
│   │   │       ├── comments/  # 사용자 댓글 API
│   │   │       │   └── route.ts
│   │   │       └── reactions/ # 사용자 반응 API
│   │   │           └── route.ts
│   │   ├── auth/              # 인증 페이지
│   │   │   ├── login/         # 로그인 페이지
│   │   │   │   └── page.tsx   # 로그인 폼
│   │   │   └── register/      # 회원가입 페이지
│   │   │       └── page.tsx   # 회원가입 폼
│   │   ├── blog/              # 블로그 관련 페이지
│   │   │   ├── [id]/          # 개별 포스트 페이지
│   │   │   │   ├── loading.tsx # 로딩 페이지
│   │   │   │   └── page.tsx   # 포스트 상세 페이지
│   │   │   ├── loading.tsx    # 로딩 페이지
│   │   │   └── page.tsx       # 블로그 목록 페이지
│   │   ├── favicon.ico        # 파비콘
│   │   ├── globals.css        # 전역 스타일
│   │   ├── layout.tsx         # 루트 레이아웃
│   │   ├── loading.tsx        # 로딩 페이지
│   │   ├── not-found.tsx      # 404 페이지
│   │   ├── page.tsx           # 홈페이지
│   │   ├── playground/        # 플레이그라운드 페이지
│   │   │   ├── layout.tsx     # 플레이그라운드 레이아웃
│   │   │   ├── loading.tsx    # 로딩 페이지
│   │   │   ├── markdown/      # 마크다운 플레이그라운드
│   │   │   │   ├── loading.tsx # 로딩 페이지
│   │   │   │   ├── page.tsx   # 마크다운 플레이그라운드
│   │   │   │   └── templates/ # 마크다운 템플릿 페이지
│   │   │   │       ├── loading.tsx # 로딩 페이지
│   │   │   │       └── page.tsx   # 마크다운 템플릿
│   │   │   ├── page.tsx       # 플레이그라운드 메인
│   │   │   ├── react/         # 리액트 플레이그라운드
│   │   │   │   ├── loading.tsx # 로딩 페이지
│   │   │   │   ├── page.tsx   # 리액트 플레이그라운드
│   │   │   │   └── templates/ # 리액트 템플릿 페이지
│   │   │   │       ├── loading.tsx # 로딩 페이지
│   │   │   │       └── page.tsx   # 리액트 템플릿
│   │   │   └── web/           # 웹 플레이그라운드
│   │   │       ├── loading.tsx # 로딩 페이지
│   │   │       ├── page.tsx   # 웹 플레이그라운드
│   │   │       └── templates/ # 웹 템플릿 페이지
│   │   │           ├── loading.tsx # 로딩 페이지
│   │   │           └── page.tsx   # 웹 템플릿
│   │   ├── profile/           # 사용자 프로필 페이지
│   │   │   ├── activity/      # 활동 내역
│   │   │   │   └── page.tsx   # 활동 로그
│   │   │   ├── comments/      # 내 댓글
│   │   │   │   └── page.tsx   # 댓글 목록
│   │   │   ├── page.tsx       # 프로필 메인
│   │   │   ├── reactions/     # 내 반응
│   │   │   │   └── page.tsx   # 반응 목록
│   │   │   └── settings/      # 설정
│   │   │       └── page.tsx   # 계정 설정
│   │   ├── tags/              # 태그 관련 페이지
│   │   │   ├── [tag]/         # 특정 태그 포스트 페이지
│   │   │   │   ├── loading.tsx # 로딩 페이지
│   │   │   │   └── page.tsx   # 태그별 포스트 목록
│   │   │   ├── loading.tsx    # 로딩 페이지
│   │   │   └── page.tsx       # 태그 목록 페이지
│   │   ├── test-events/       # 테스트 이벤트 페이지
│   │   └── test-notifications/ # 알림 테스트 페이지
│   │       └── page.tsx       # 웹/PC 알림 테스트
│   ├── components/            # 구조화된 컴포넌트
│   │   ├── admin/             # 관리자 관련 컴포넌트
│   │   │   ├── admin-auth-provider.tsx    # 관리자 인증 컨텍스트
│   │   │   ├── admin-header.tsx           # 관리자 헤더
│   │   │   ├── admin-realtime-events.tsx  # 실시간 이벤트 컴포넌트
│   │   │   ├── admin-recent-activity.tsx  # 최근 활동 컴포넌트
│   │   │   ├── admin-sidebar.tsx          # 관리자 사이드바
│   │   │   ├── admin-stats.tsx            # 블로그 통계 컴포넌트
│   │   │   ├── sidebar-context.tsx        # 사이드바 컨텍스트
│   │   │   └── user-detail-modal.tsx      # 사용자 상세 정보 모달
│   │   ├── auth/              # 인증 관련 컴포넌트
│   │   │   ├── auth-modal.tsx         # 인증 모달
│   │   │   └── user-dropdown.tsx      # 사용자 드롭다운
│   │   ├── blog/              # 블로그 관련 컴포넌트
│   │   │   ├── blog-card.tsx
│   │   │   ├── blog-post-wrapper.tsx
│   │   │   ├── comment-item.tsx
│   │   │   ├── comment-section.tsx
│   │   │   ├── home-content.tsx
│   │   │   ├── notion-blocks.tsx
│   │   │   └── reaction-buttons.tsx   # 반응 버튼 컴포넌트
│   │   ├── chat/              # 블로그 검색 챗봇 컴포넌트
│   │   │   ├── ChatbotButton.tsx  # 우측 하단 플로팅 버튼
│   │   │   ├── ChatPanel.tsx      # 채팅 패널 (헤더, 메시지, 입력, 제안)
│   │   │   └── ChatMessage.tsx    # 메시지/검색 결과 카드
│   │   ├── common/            # 공통 유틸리티 컴포넌트
│   │   │   ├── about-wrapper.tsx
│   │   │   ├── home-wrapper.tsx
│   │   │   ├── loading-intro.tsx
│   │   │   ├── loading-spinner.tsx
│   │   │   ├── popup-display.tsx    # 팝업 표시 컴포넌트
│   │   │   ├── social-links.tsx
│   │   │   └── suspense-wrapper.tsx
│   │   ├── layout/            # 레이아웃 컴포넌트
│   │   │   ├── conditional-layout.tsx
│   │   │   ├── footer.tsx
│   │   │   ├── header.tsx
│   │   │   └── theme-toggle.tsx
│   │   ├── playground/        # 플레이그라운드 컴포넌트
│   │   │   ├── markdown-playground.tsx
│   │   │   ├── markdown-templates.tsx
│   │   │   ├── react-playground.tsx
│   │   │   ├── react-templates.tsx
│   │   │   ├── web-playground.tsx
│   │   │   └── web-templates.tsx
│   │   ├── notifications/     # 알림 관련 컴포넌트
│   │   │   ├── notification-provider.tsx    # 알림 컨텍스트 프로바이더
│   │   │   ├── notification-settings.tsx    # 알림 설정 컴포넌트
│   │   │   └── service-worker-registrar.tsx # 서비스 워커 등록 컴포넌트
│   │   └── ui/                # shadcn/ui 기본 컴포넌트
│   │       ├── avatar.tsx
│   │       ├── badge.tsx
│   │       ├── button.tsx
│   │       ├── card.tsx
│   │       ├── dialog.tsx
│   │       ├── dropdown-menu.tsx
│   │       ├── input.tsx
│   │       ├── label.tsx
│   │       ├── navigation-menu.tsx
│   │       ├── select.tsx
│   │       ├── separator.tsx
│   │       ├── switch.tsx
│   │       ├── tabs.tsx
│   │       ├── textarea.tsx
│   │       └── tooltip.tsx
│   ├── lib/                   # 유틸리티 함수
│   │   ├── analytics.ts       # 이벤트 수집 (노션 API)
│   │   ├── auth-context.tsx   # 사용자 인증 컨텍스트
│   │   ├── hooks/             # 커스텀 훅
│   │   │   ├── useNotifications.ts # 웹 알림 훅
│   │   │   └── usePCNotifications.ts # PC 알림 훅
│   │   ├── initialize-notion-settings.ts # 노션 설정 초기화
│   │   ├── language-context.tsx # 언어 컨텍스트
│   │   ├── markdown-templates.ts # 마크다운 플레이그라운드 템플릿
│   │   ├── metadata.ts        # 메타데이터 유틸리티
│   │   ├── notion-search.ts   # 블로그 검색 유틸 (챗봇용: 블록→텍스트, 스니펫, 키워드 검색)
│   │   ├── notion-settings-manager.ts # 노션 설정 관리자
│   │   ├── notion-settings.ts # 노션 설정 API
│   │   ├── notion.ts          # 노션 API 클라이언트 (이벤트, 반응, 댓글, 사용자 관리 포함)
│   │   ├── password.ts        # 비밀번호 해시 유틸리티
│   │   ├── firebase.ts        # Firebase 클라이언트 설정
│   │   ├── firebase-admin.ts  # Firebase Admin SDK 설정
│   │   ├── pc-notifications.ts # PC 알림 관리자
│   │   ├── react-templates.ts # 리액트 플레이그라운드 템플릿
│   │   ├── settings.ts        # 설정 관리 유틸리티
│   │   ├── theme-context.tsx  # 테마 컨텍스트
│   │   ├── theme-script.tsx   # 테마 스크립트
│   │   ├── utils.ts           # shadcn/ui 유틸리티
│   │   └── web-templates.ts   # 웹 플레이그라운드 템플릿
│   └── types/                 # TypeScript 타입 정의
│       ├── notion.ts          # 노션 관련 타입 (댓글, 반응, 이벤트, 사용자 관리 포함)
│       ├── settings.ts        # 설정 관련 타입
│       └── site-settings.ts   # 사이트 설정 타입
├── public/                     # 정적 파일
│   ├── file.svg               # 파일 아이콘
│   ├── firebase-messaging-sw.js # Firebase 서비스 워커
│   ├── globe.svg              # 글로브 아이콘
│   ├── next.svg               # Next.js 로고
│   ├── robots.txt             # 검색엔진 크롤러 설정
│   ├── vercel.svg             # Vercel 로고
│   └── window.svg             # 윈도우 아이콘
├── .env.local                 # 환경 변수 (생성 필요)
├── components.json             # shadcn/ui 설정
├── eslint.config.mjs          # ESLint 설정
├── next-env.d.ts              # Next.js 타입 정의
├── next.config.ts             # Next.js 설정
├── postcss.config.mjs         # PostCSS 설정
├── tailwind.config.ts         # Tailwind CSS 설정
├── tsconfig.json              # TypeScript 설정
├── BLOG_DATABASE_SETUP.md     # 블로그 데이터베이스 설정 가이드
├── EVENTS_DATABASE_SETUP.md   # 이벤트 데이터베이스 설정 가이드
├── FIREBASE_SETUP_GUIDE.md    # Firebase 설정 가이드
├── NOTION_COMMENTS_SETUP.md  # 댓글 시스템 설정 가이드
├── PLAYGROUND_RECOMMENDATIONS.md # 플레이그라운드 추천사항
├── REACTIONS_SETUP.md        # 반응 시스템 설정 가이드
├── SITE_SETTINGS_DATABASE_SETUP.md # 사이트 설정 데이터베이스 가이드
├── USERS_DATABASE_SETUP.md   # 사용자 관리 시스템 설정 가이드
├── WEB_NOTIFICATIONS_SETUP.md # 웹 알림 설정 가이드
├── env.example                # 환경변수 예시 파일
├── package.json               # 프로젝트 의존성
└── package-lock.json          # 의존성 잠금 파일
```

## 🚀 시작하기

### 1. 저장소 클론

```bash
git clone https://github.com/joohwan-chung/dev-blog.git
cd dev-blog
```

### 2. 의존성 설치

```bash
npm install
```

### 3. 환경 변수 설정

`.env.local` 파일을 생성하고 다음 내용을 추가하세요:

```env
# Notion API 설정 (필수)
NOTION_API_KEY=your_notion_api_key_here
NOTION_DATABASE_ID=your_notion_database_id_here
NOTION_COMMENTS_DATABASE_ID=your_comments_database_id_here
NOTION_REACTIONS_DATABASE_ID=your_reactions_database_id_here
NOTION_EVENTS_DATABASE_ID=your_events_database_id_here
NOTION_USERS_DATABASE_ID=your_users_database_id_here
NOTION_USER_ACTIVITY_LOGS_DATABASE_ID=your_user_activity_logs_database_id_here
NOTION_USER_SESSIONS_DATABASE_ID=your_user_sessions_database_id_here
NOTION_USER_PERMISSIONS_DATABASE_ID=your_user_permissions_database_id_here
NOTION_USER_REACTIONS_DATABASE_ID=your_user_reactions_database_id_here
NOTION_USER_COMMENTS_DATABASE_ID=your_user_comments_database_id_here
NOTION_SITE_SETTINGS_DATABASE_ID=your_site_settings_database_id_here
NOTION_POPUP_DATABASE_ID=your_popup_database_id_here

# 관리자 페이지 설정 (필수)
ADMIN_AUTH_CODE=your_admin_auth_code_here

# Firebase 설정 (웹 알림용)
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_VAPID_KEY=your_vapid_key_here
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your_project_id.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY_HERE\n-----END PRIVATE KEY-----\n"

# 사용자 알림 설정 데이터베이스 (선택사항)
NOTION_USER_NOTIFICATIONS_DATABASE_ID=your_user_notifications_database_id_here

# Serper API - 챗봇 인터넷 검색 (선택사항)
# https://serper.dev 에서 발급. 없으면 블로그 검색만 동작
SERPER_API_KEY=your_serper_api_key_here

# 사이트 설정 (선택사항)
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SITE_NAME="Dev Blog"
NEXT_PUBLIC_SITE_DESCRIPTION="개발자의 기술 블로그입니다."
```

#### 노션 API 키 얻는 방법:
1. [Notion Developers](https://developers.notion.com/) 페이지 방문
2. "View my integrations" 클릭
3. "New integration" 생성
4. Integration Token 복사

#### 노션 데이터베이스 ID 얻는 방법:
1. 노션에서 해당 데이터베이스 페이지 열기
2. URL에서 데이터베이스 ID 복사:
   ```
   https://www.notion.so/workspace/DATABASE_ID?v=...
   ```

### 4. 노션 데이터베이스 설정

#### 블로그 포스트 데이터베이스
노션 데이터베이스에 다음 속성들이 필요합니다:

- **Name** (Title): 포스트 제목
- **Description** (Text): 포스트 설명
- **Published** (Date): 발행일 (발행 여부를 나타냄)
- **Tags** (Multi-select): 태그 목록
- **Created** (Date): 생성일
- **Hidden** (Checkbox): 숨김 처리 여부
- **AllowComments** (Checkbox): 댓글 허용 여부

#### 댓글 데이터베이스
댓글 시스템을 위해 별도의 노션 데이터베이스를 생성해야 합니다:

- **Content** (Rich Text): 댓글 내용
- **PostId** (Title): 연결된 블로그 포스트 ID
- **CreatedAt** (Date): 댓글 작성일
- **IsAnonymous** (Checkbox): 익명 여부
- **AuthorName** (Rich Text): 작성자 이름 (선택사항)
- **ParentId** (Rich Text): 부모 댓글 ID (대댓글용)
- **Depth** (Number): 댓글 깊이 (0: 댓글, 1: 대댓글, 2: 대대댓글)

#### 반응 데이터베이스
반응 시스템을 위해 별도의 노션 데이터베이스를 생성해야 합니다:

- **PostId** (Title): 연결된 블로그 포스트 ID
- **Type** (Select): 반응 타입 (like, dislike, recommend, not_recommend)
- **UserIp** (Rich Text): 사용자 IP 주소
- **CreatedAt** (Date): 반응 생성일

#### 이벤트 데이터베이스
사용자 활동 추적을 위해 별도의 노션 데이터베이스를 생성해야 합니다:

- **Type** (Select): 이벤트 타입 (page_view, click, comment, reaction)
- **Page** (Title): 페이지 경로 또는 제목
- **UserIp** (Rich Text): 사용자 IP 주소
- **UserAgent** (Rich Text): 사용자 에이전트
- **Referrer** (Rich Text): 리퍼러 URL
- **CreatedAt** (Date): 이벤트 발생일

#### 사이트 설정 데이터베이스
사이트 설정을 중앙 관리하기 위한 노션 데이터베이스:

- **Key** (Title): 설정 키 (고유 식별자)
- **Value** (Rich Text): 설정 값
- **Category** (Select): 설정 카테고리 (general, blog, security, notifications, seo, images)
- **Type** (Select): 데이터 타입 (string, number, boolean, array)
- **Description** (Rich Text): 설정 설명
- **IsActive** (Checkbox): 활성화 여부
- **UpdatedAt** (Date): 마지막 업데이트

#### 팝업 데이터베이스
사용자 페이지에 표시될 팝업을 관리하기 위한 노션 데이터베이스:

- **Title** (Title): 팝업 제목
- **Content** (Rich Text): 팝업 내용
- **ImageUrl** (URL): 팝업 이미지 URL (선택사항)
- **DisplayLocation** (Select): 표시 위치 (home, blog, about, profile, playground, all)
- **PageSpecific** (Rich Text): 특정 페이지 경로 (선택사항)
- **IsActive** (Checkbox): 활성화 여부
- **StartDate** (Date): 시작 날짜
- **EndDate** (Date): 종료 날짜
- **PopupType** (Select): 팝업 타입 (modal, banner, toast, slide)
- **Theme** (Select): 테마 (default, dark, light, gradient)
- **Position** (Select): 위치 (center, top, bottom, top-right, top-left)
- **AutoClose** (Number): 자동 닫기 시간 (초, 0이면 수동)
- **ShowCloseButton** (Checkbox): 닫기 버튼 표시 여부
- **AllowOutsideClick** (Checkbox): 외부 클릭으로 닫기 허용
- **Priority** (Number): 우선순위
- **Order** (Number): 표시 순서
- **TargetUsers** (Select): 대상 사용자 (all, logged-in, guest, admin)
- **ShowOnce** (Checkbox): 한 번만 표시 여부
- **CreatedAt** (Created Time): 생성일
- **UpdatedAt** (Last Edited Time): 마지막 수정일
- **CreatedBy** (Created By): 생성자

자세한 설정 방법은 다음 문서들을 참조하세요:
- **[FIREBASE_SETUP_GUIDE.md](./FIREBASE_SETUP_GUIDE.md)**: Firebase 환경 변수 설정 가이드
- **[WEB_NOTIFICATIONS_SETUP.md](./WEB_NOTIFICATIONS_SETUP.md)**: 웹 알림 시스템 설정 가이드
- **[NOTION_COMMENTS_SETUP.md](./NOTION_COMMENTS_SETUP.md)**: 댓글 시스템 Notion 데이터베이스 설정 가이드
- **[REACTIONS_SETUP.md](./REACTIONS_SETUP.md)**: 반응 시스템 Notion 데이터베이스 설정 가이드
- **[EVENTS_DATABASE_SETUP.md](./EVENTS_DATABASE_SETUP.md)**: 이벤트 추적 Notion 데이터베이스 설정 가이드
- **[BLOG_DATABASE_SETUP.md](./BLOG_DATABASE_SETUP.md)**: 블로그 Notion 데이터베이스 설정 가이드
- **[SITE_SETTINGS_DATABASE_SETUP.md](./SITE_SETTINGS_DATABASE_SETUP.md)**: 사이트 설정 Notion 데이터베이스 설정 가이드
- **[USERS_DATABASE_SETUP.md](./USERS_DATABASE_SETUP.md)**: 사용자 관리 시스템 Notion 데이터베이스 설정 가이드
- **[POPUP_DATABASE_SETUP.md](./POPUP_DATABASE_SETUP.md)**: 팝업 관리 시스템 Notion 데이터베이스 설정 가이드
- **[env.example](./env.example)**: 환경변수 설정 예시

### 5. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 확인하세요.

## 📝 사용법

### 블로그 포스트 작성

1. 노션에서 데이터베이스에 새 페이지 생성
2. 제목, 설명, 태그 등 메타데이터 입력
3. Published 체크박스 활성화
4. 본문에 다양한 블록 타입 추가 (텍스트, 이미지, 코드 등)

### 지원되는 노션 블록

- **텍스트 블록**: 제목, 단락, 인용구
- **이미지**: 외부 URL 또는 노션 파일
- **코드 블록**: 구문 강조 지원
- **목록**: 순서 있는/없는 목록
- **구분선**: 콘텐츠 구분

### 태그 관리

- 포스트에 여러 태그 추가 가능
- 태그별로 포스트 필터링
- 관련 태그 추천 기능

### 댓글 시스템

블로그 포스트에 3단계 계층적 댓글 시스템을 제공합니다.

#### 주요 기능:
- **3단계 댓글**: 댓글 → 대댓글 → 대대댓글까지 지원
- **익명 댓글**: 기본적으로 익명으로 표시되며 선택적으로 이름 표시 가능
- **실시간 업데이트**: 댓글 작성 시 즉시 화면에 반영
- **접기/펼치기**: 답글이 많은 댓글을 접고 펼칠 수 있음
- **계층적 표시**: 들여쓰기와 시각적 구분으로 댓글 관계 명확히 표시
- **댓글 허용 설정**: 사이트 전체 및 포스트별 댓글 허용/비활성화 제어

#### 댓글 작성:
1. 블로그 포스트 하단의 댓글 작성 영역에서 댓글 입력
2. "이름을 표시하고 싶어요" 체크박스로 익명/이름 표시 선택
3. "댓글 작성" 버튼으로 댓글 등록

#### 답글 작성:
1. 각 댓글의 "답글 달기" 버튼 클릭
2. 답글 작성 폼에서 내용 입력
3. 필요시 이름 표시 옵션 선택
4. "답글 작성" 버튼으로 답글 등록

#### 댓글 관리:
- **답글 접기/펼치기**: "3개 답글" 버튼으로 답글 표시/숨김 토글
- **계층 표시**: 대댓글은 들여쓰기와 "대댓글" 태그로 구분
- **실시간 반영**: 새 댓글 작성 시 자동으로 목록 업데이트
- **댓글 허용 제어**: 관리자 페이지에서 포스트별 댓글 허용/비활성화 설정

### 블로그 검색 챗봇

우측 하단에 노션 AI 스타일의 검색 챗봇이 있습니다. 블로그 글을 키워드로 검색하고, 선택 시 인터넷 검색 결과까지 함께 볼 수 있습니다.

#### 주요 기능:
- **플로팅 버튼**: 화면 우측 하단 원형 버튼으로 챗봇 패널 열기/닫기
- **블로그 검색**: 노션 블로그 포스트 제목·설명·본문 기준 키워드 검색
- **인터넷 검색**: Serper API를 이용한 웹 검색 결과 (선택 사항, API 키 설정 시)
- **제안 버튼**: "최근 포스트 보기", "React 관련 글 찾기", "성능 최적화 글 검색" 등 빠른 검색
- **새 채팅**: 헤더의 새 채팅 버튼으로 대화 초기화 후 처음 화면으로 복귀

#### 사용법:
1. 블로그·메인 등 일반 페이지에서 우측 하단 챗봇 버튼 클릭
2. "무엇을 도와드릴까요?" 아래 제안 버튼을 누르거나, 하단 입력창에 키워드 입력 후 전송
3. 같은 답변에 **블로그** 결과와 **인터넷 검색 결과**가 섹션별로 표시됨
4. 블로그 결과는 사이트 내 링크, 인터넷 결과는 새 탭으로 열림
5. 헤더의 새 채팅(➕) 버튼을 누르면 인사말과 제안만 있는 초기 화면으로 돌아감

#### 인터넷 검색 설정 (선택):
- [Serper](https://serper.dev)에서 API 키 발급 후 `.env.local`에 추가:
  ```env
  SERPER_API_KEY=your_serper_api_key_here
  ```
- 키가 없으면 블로그 검색만 동작하며, 인터넷 검색은 비활성화됨
- Serper 무료 할당량: 2,500회/월

### 반응 시스템

블로그 포스트에 대한 사용자 반응을 수집하는 시스템입니다.

#### 주요 기능:
- **4가지 반응 타입**: 좋아요, 싫어요, 추천, 비추천
- **중복 방지**: IP 기반으로 중복 반응 방지
- **실시간 업데이트**: 반응 클릭 시 즉시 카운트 업데이트
- **반응 변경**: 기존 반응을 다른 반응으로 변경 가능
- **반응 취소**: 같은 반응을 다시 클릭하면 취소

#### 반응 타입:
1. **좋아요** 👍: 글이 마음에 들 때
2. **싫어요** 👎: 글이 마음에 들지 않을 때
3. **추천** ❤️: 다른 사람에게 추천하고 싶을 때
4. **비추천** ❌: 추천하지 않을 때

#### 사용법:
1. 블로그 포스트 하단의 반응 섹션에서 원하는 반응 클릭
2. 반응이 즉시 카운트에 반영됨
3. 같은 반응을 다시 클릭하면 취소됨
4. 다른 반응을 클릭하면 기존 반응이 변경됨

#### 기술적 특징:
- **IP 기반 추적**: 사용자 식별을 위해 IP 주소 사용
- **노션 데이터베이스**: 모든 반응 데이터를 노션에 저장
- **실시간 UI**: 반응 상태에 따른 버튼 스타일 변경
- **로딩 상태**: 반응 처리 중 로딩 표시

### 관리자 페이지

블로그의 모든 활동과 통계를 관리할 수 있는 관리자 전용 대시보드입니다.

#### 주요 기능:
- **인증 시스템**: 환경변수 기반 인증코드로 보안 접근
- **블로그 통계**: 포스트, 댓글, 반응 등 블로그 성과 지표
- **실시간 활동**: 최근 사용자 활동 모니터링
- **반응형 대시보드**: 모바일과 데스크톱에서 최적화된 관리 인터페이스

#### 관리자 페이지 구성:
1. **대시보드**: 전체적인 블로그 현황과 핵심 지표
2. **통계 분석**: 블로그 통계 상세 분석
3. **포스트**: 블로그 포스트 관리 및 성과 확인
4. **댓글**: 댓글 시스템 관리 및 모니터링
5. **반응**: 사용자 반응 데이터 분석
6. **팝업**: 팝업 생성, 편집, 관리 및 활성화 제어
7. **사용자**: 사용자 활동 및 행동 패턴 분석
8. **설정**: 사이트 설정 및 관리자 페이지 구성

#### 블로그 통계 기능:
- **전체 현황**: 총 포스트, 댓글, 반응 수
- **최근 포스트**: 최근 발행 포스트들의 성과 분석
- **인기 포스트**: 조회수 기준 인기 포스트 순위
- **활동 피드**: 실시간 사용자 활동 모니터링

#### 포스트 관리 기능:
- **포스트 목록**: 모든 포스트를 한 곳에서 관리
- **상태 관리**: 발행/초안/숨김 상태 변경
- **댓글 허용 관리**: 포스트별 댓글 허용/비활성화 설정
- **검색 및 필터링**: 제목, 태그, 상태별 검색
- **포스트 삭제**: 불필요한 포스트 영구 삭제
- **실시간 통계**: 각 포스트별 조회수, 댓글수, 반응수 표시

#### 팝업 관리 기능:
- **팝업 생성**: 다양한 타입과 테마의 팝업 생성
- **팝업 편집**: 기존 팝업의 내용과 설정 수정
- **팝업 삭제**: 불필요한 팝업 영구 삭제
- **활성화 제어**: 팝업 활성화/비활성화 토글
- **미리보기**: 팝업이 사용자에게 어떻게 보일지 미리보기
- **표시 위치 설정**: 특정 페이지 또는 전체 사이트에 표시
- **대상 사용자 설정**: 모든 사용자, 로그인 사용자, 게스트, 관리자별 표시
- **일정 관리**: 시작일과 종료일을 통한 팝업 표시 기간 설정
- **우선순위 관리**: 여러 팝업이 있을 때 표시 순서 제어
- **자동 닫기**: 설정된 시간 후 자동으로 닫히는 기능
- **한 번만 표시**: 사용자당 한 번만 표시되는 기능

#### 사이트 설정 관리 기능:
- **중앙 설정 관리**: 노션을 통한 사이트 설정 중앙 관리
- **실시간 설정 적용**: 설정 변경 시 즉시 사이트에 반영
- **카테고리별 설정**: 일반, 블로그, 보안, 알림, SEO, 이미지 설정 분류
- **설정 검증**: 환경 변수 및 설정 상태 실시간 확인
- **설정 초기화**: 기본 설정값으로 초기화 기능

#### 보안 기능:
- **인증코드 기반 로그인**: 환경변수에 설정된 인증코드로 접근
- **세션 관리**: 쿠키 기반 세션 관리 (24시간 유효)
- **자동 리다이렉트**: 인증된 사용자만 관리자 페이지 접근 가능
- **로그아웃 기능**: 안전한 세션 종료

#### 사용법:
1. `/admin/login` 페이지에서 관리자 인증코드 입력
2. 인증 성공 시 자동으로 대시보드로 이동
3. 사이드바 메뉴를 통해 각 기능 섹션 탐색
4. 실시간 통계 및 활동 데이터 확인
5. 필요시 로그아웃으로 세션 종료

#### 기술적 특징:
- **타입 안전성**: TypeScript로 모든 컴포넌트 타입 정의
- **모듈화 구조**: 재사용 가능한 컴포넌트 설계
- **API 기반**: RESTful API를 통한 데이터 관리
- **다크모드 지원**: 기존 테마 시스템과 일관성 유지
- **에러 처리**: 사용자 친화적인 에러 메시지 및 재시도 기능

### 웹 플레이그라운드

웹 플레이그라운드는 HTML, CSS, JavaScript를 실시간으로 작성하고 미리보기할 수 있는 기능입니다.

#### 제공되는 템플릿:
1. **기본 템플릿**: 그라데이션 배경과 버튼이 있는 기본 레이아웃
2. **애니메이션**: CSS 애니메이션과 트랜지션 효과
3. **그리드 레이아웃**: CSS Grid를 활용한 반응형 레이아웃
4. **JavaScript 연습**: DOM 조작과 이벤트 처리 예제
5. **반응형 카드 레이아웃**: Flexbox를 활용한 카드 컴포넌트
6. **다크모드 토글**: 테마 전환 기능이 있는 인터페이스
7. **폼 검증**: JavaScript를 활용한 폼 유효성 검사
8. **타이핑 애니메이션**: 텍스트 타이핑 효과
9. **모달 팝업**: 오버레이와 모달 창 구현
10. **슬라이더 캐러셀**: 이미지 슬라이더와 네비게이션
11. **툴팁 컴포넌트**: 호버 시 나타나는 툴팁
12. **프로그레스 바**: 로딩과 진행 상태 표시

#### 주요 기능:
- **실시간 미리보기**: 코드 변경사항을 즉시 확인
- **VS Code 스타일 레이아웃**: 상단 코드 에디터, 하단 미리보기/콘솔
- **조절 가능한 패널**: 드래그로 패널 크기 조절
- **JavaScript 콘솔**: 실행 결과와 오류 메시지 표시
- **템플릿 시스템**: 다양한 시작 템플릿 제공
- **반응형 디자인**: 모바일과 데스크톱 최적화
- **파일 다운로드**: HTML, CSS, JS 파일로 내보내기
- **클립보드 복사**: 코드를 클립보드로 복사

#### 사용법:
1. `/playground/web` 페이지 접속
2. 원하는 템플릿 선택하거나 빈 템플릿으로 시작
3. HTML, CSS, JavaScript 탭에서 코드 작성
4. 실시간으로 미리보기 확인
5. 콘솔에서 JavaScript 실행 결과 확인
6. 필요시 코드 다운로드 또는 복사

### 리액트 플레이그라운드

리액트 플레이그라운드는 11가지 다양한 리액트 템플릿을 통해 실습할 수 있는 기능입니다.

#### 제공되는 템플릿:
1. **카운터**: 클릭으로 숫자를 증가시키는 간단한 카운터
2. **할 일 목록**: 할 일을 추가하고 완료 처리할 수 있는 목록
3. **연락처 폼**: 사용자 정보를 입력받는 유효성 검사가 포함된 폼
4. **타이머 & 스톱워치**: 타이머와 스톱워치 기능을 제공하는 시간 관리 도구
5. **날씨 위젯**: 여러 도시의 날씨 정보를 표시하는 위젯
6. **이미지 갤러리**: 이미지를 업로드하고 관리할 수 있는 갤러리
7. **계산기**: 기본적인 사칙연산을 수행할 수 있는 계산기
8. **퀴즈 앱**: 다양한 주제의 퀴즈를 풀고 점수를 확인할 수 있는 앱
9. **채팅 앱**: 실시간 메시지를 주고받을 수 있는 채팅 인터페이스
10. **음악 플레이어**: 재생 목록과 재생 컨트롤을 제공하는 음악 플레이어
11. **그림판**: 마우스로 그림을 그릴 수 있는 간단한 그림판

#### 주요 기능:
- **실시간 리액트 실행**: JSX 코드를 즉시 컴파일하고 실행
- **템플릿 기반 학습**: 다양한 실용적인 예제로 리액트 학습
- **코드 편집**: 템플릿 코드를 자유롭게 수정하고 실험
- **CSS 스타일링**: 각 템플릿에 맞춤형 스타일 제공
- **반응형 디자인**: 모든 템플릿이 모바일과 데스크톱에서 최적화

#### 사용법:
1. `/playground/react` 페이지 접속
2. 원하는 템플릿 선택
3. JSX와 CSS 코드를 수정하여 실험
4. 실시간으로 변경사항 확인
5. 새로운 기능 추가 및 커스터마이징

### 마크다운 플레이그라운드

마크다운 플레이그라운드는 6가지 다양한 마크다운 템플릿을 통해 문서 작성과 수식 렌더링을 실습할 수 있는 기능입니다.

#### 제공되는 템플릿:
1. **블로그 포스트**: 개인 블로그 작성에 적합한 마크다운 템플릿
2. **기술 문서**: API 문서나 기술 가이드 작성에 적합한 템플릿
3. **회의록**: 회의 내용을 체계적으로 정리하는 템플릿
4. **학습 노트**: 공부 내용을 정리하는 학습 노트 템플릿
5. **프로젝트 제안서**: 프로젝트 계획과 제안을 작성하는 템플릿
6. **README 템플릿**: 프로젝트 README 파일 작성에 적합한 템플릿
7. **수학 노트**: 수학 공식과 방정식을 포함한 마크다운 템플릿

#### 주요 기능:
- **실시간 마크다운 렌더링**: 작성한 마크다운을 즉시 미리보기로 확인
- **GitHub Flavored Markdown**: 테이블, 체크리스트, 코드 블록 등 GFM 지원
- **수식 렌더링**: LaTeX 수식을 KaTeX로 렌더링 (인라인: `$...$`, 블록: `$$...$$`)
- **코드 구문 강조**: 다양한 프로그래밍 언어의 코드 블록 지원
- **반응형 디자인**: 모바일과 데스크톱에서 최적화된 편집 환경
- **템플릿 시스템**: 다양한 용도의 시작 템플릿 제공
- **파일 다운로드**: 마크다운 파일로 내보내기
- **클립보드 복사**: 작성한 마크다운을 클립보드로 복사
- **VS Code 스타일 레이아웃**: 상단 에디터, 하단 미리보기 패널

#### 지원되는 마크다운 기능:
- **기본 문법**: 제목, 단락, 강조, 목록, 링크, 이미지
- **확장 문법**: 테이블, 체크리스트, 인용구, 구분선
- **코드 블록**: 구문 강조가 적용된 코드 블록
- **수학 공식**: LaTeX 문법을 사용한 수식 렌더링
- **행렬**: 복잡한 행렬 표현과 수학 기호

#### 사용법:
1. `/playground/markdown` 페이지 접속
2. 원하는 템플릿 선택하거나 빈 템플릿으로 시작
3. 마크다운 문법으로 문서 작성
4. 실시간으로 미리보기 확인
5. 수식이나 코드 블록 추가하여 다양한 콘텐츠 작성
6. 필요시 마크다운 파일 다운로드 또는 복사

#### 수식 작성 예시:
```markdown
# 인라인 수식
$E = mc^2$ 또는 $x = \frac{-b \pm \sqrt{b^2-4ac}}{2a}$

# 블록 수식
$$
\int_{-\infty}^{\infty} e^{-x^2} dx = \sqrt{\pi}
$$

# 행렬
$$
\begin{pmatrix} a & b \\ c & d \end{pmatrix}
$$
```

### 팝업 관리 시스템

사용자 페이지에 표시될 팝업을 관리하는 시스템입니다.

#### 주요 기능:
- **다양한 팝업 타입**: 모달, 배너, 토스트, 슬라이드 4가지 타입
- **테마 지원**: 기본, 다크, 라이트, 그라데이션 4가지 테마
- **위치 설정**: 중앙, 상단, 하단, 우상단, 좌상단 5가지 위치
- **표시 위치 제어**: 특정 페이지 또는 전체 사이트에 표시
- **대상 사용자 설정**: 모든 사용자, 로그인 사용자, 게스트, 관리자별 표시
- **일정 관리**: 시작일과 종료일을 통한 팝업 표시 기간 설정
- **우선순위 관리**: 여러 팝업이 있을 때 표시 순서 제어
- **자동 닫기**: 설정된 시간 후 자동으로 닫히는 기능
- **한 번만 표시**: 사용자당 한 번만 표시되는 기능
- **외부 클릭 닫기**: 팝업 외부 클릭으로 닫기 허용/비활성화
- **닫기 버튼**: 팝업에 닫기 버튼 표시 여부 설정

#### 팝업 타입:
1. **모달**: 화면 중앙에 오버레이와 함께 표시되는 팝업
2. **배너**: 화면 상단에 전체 너비로 표시되는 배너
3. **토스트**: 우상단에 작은 크기로 표시되는 알림
4. **슬라이드**: 좌측에서 슬라이드되어 나타나는 팝업

#### 테마:
1. **기본**: 깔끔한 흰색 배경의 기본 테마
2. **다크**: 어두운 배경의 다크 테마
3. **라이트**: 밝은 배경의 라이트 테마
4. **그라데이션**: 아름다운 그라데이션 배경 테마

#### 사용법:
1. **팝업 생성**: 관리자 페이지에서 "새 팝업 생성" 버튼 클릭
2. **기본 정보**: 제목, 내용, 이미지 URL, 시작/종료 날짜 설정
3. **표시 설정**: 표시 위치, 우선순위, 순서, 대상 사용자 설정
4. **디자인**: 팝업 타입, 테마, 위치 설정
5. **동작 설정**: 자동 닫기, 닫기 버튼, 외부 클릭 닫기, 한 번만 표시 설정
6. **활성화**: 팝업 활성화/비활성화 토글
7. **미리보기**: 팝업이 사용자에게 어떻게 보일지 미리보기

#### 기술적 특징:
- **노션 데이터베이스**: 모든 팝업 데이터를 노션에 저장
- **실시간 업데이트**: 팝업 설정 변경 시 즉시 사이트에 반영
- **반응형 디자인**: 모든 팝업이 모바일과 데스크톱에서 최적화
- **애니메이션**: 각 팝업 타입별 맞춤 애니메이션 효과
- **로컬 스토리지**: "한 번만 표시" 팝업의 사용자별 표시 상태 저장
- **조건부 렌더링**: 페이지 위치와 사용자 타입에 따른 팝업 필터링

### 웹 알림 시스템

Firebase Cloud Messaging(FCM)을 활용한 실시간 푸시 알림 시스템입니다.

#### 주요 기능:
- **실시간 푸시 알림**: 새 댓글, 사용자 가입 등 실시간 알림
- **개인별 알림 설정**: 사용자별 알림 유형 설정 가능
- **브라우저 호환성**: 모든 모던 브라우저에서 지원
- **백그라운드 알림**: 브라우저가 닫혀있어도 알림 수신
- **알림 액션**: 알림 클릭 시 해당 페이지로 이동

#### 알림 타입:
1. **댓글 알림**: 새 댓글이 작성되었을 때
2. **사용자 가입 알림**: 새 사용자가 가입했을 때
3. **일반 알림**: 관리자가 전송하는 공지사항

#### 사용법:
1. **알림 활성화**: 사용자 프로필 설정에서 알림 허용
2. **브라우저 권한**: 알림 권한 허용 대화상자에서 "허용" 선택
3. **알림 수신**: 설정된 이벤트 발생 시 자동으로 알림 수신
4. **알림 클릭**: 알림 클릭 시 해당 페이지로 자동 이동

#### 관리자 기능:
- **알림 전송**: 관리자 페이지에서 특정 사용자 또는 전체 사용자에게 알림 전송
- **알림 설정 관리**: 사이트 전체 알림 설정 제어
- **사용자 알림 상태**: 각 사용자의 알림 설정 및 토큰 상태 확인

### PC 알림 시스템

브라우저 네이티브 알림 API를 활용한 PC 전용 알림 시스템입니다.

#### 주요 기능:
- **네이티브 알림**: 운영체제의 기본 알림 시스템 활용
- **상호작용 알림**: 사용자가 직접 닫을 때까지 알림 유지
- **알림 액션**: 열기/닫기 버튼 제공
- **서비스 워커**: 백그라운드에서 알림 처리
- **브라우저 독립**: 브라우저가 닫혀있어도 알림 표시

#### PC 알림 특징:
- **requireInteraction**: 사용자가 직접 닫을 때까지 알림 유지
- **알림 액션**: "열기", "닫기" 버튼 제공
- **태그 시스템**: 동일한 타입의 알림은 하나로 통합
- **아이콘 지원**: 커스텀 아이콘 및 배지 설정

#### 사용법:
1. **PC 알림 활성화**: 알림 설정에서 PC 알림 허용
2. **서비스 워커 등록**: 자동으로 서비스 워커 등록
3. **알림 수신**: 설정된 이벤트 발생 시 PC 알림 표시
4. **알림 상호작용**: 알림의 "열기" 버튼으로 해당 페이지 이동

#### API 사용 예시:
```javascript
// 웹 알림 전송
const response = await fetch('/api/notifications/send', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    title: '새 댓글 알림',
    body: '블로그 포스트에 새로운 댓글이 달렸습니다.',
    type: 'comment',
    data: { url: '/blog/post-id' }
  })
});

// PC 알림 전송
const pcResponse = await fetch('/api/pc-notifications/send', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    title: 'PC 알림',
    body: '이것은 PC 전용 알림입니다.',
    type: 'general',
    data: { url: '/' }
  })
});
```

## 🎨 커스터마이징

### 테마 변경

`components.json`에서 색상 테마를 변경할 수 있습니다:

```json
{
  "style": "default",
  "rsc": true,
  "tsx": true,
  "tailwind": {
    "config": "tailwind.config.ts",
    "css": "src/app/globals.css",
    "baseColor": "stone"
  }
}
```

### 컴포넌트 수정

프로젝트는 구조화된 컴포넌트 아키텍처를 사용합니다:

#### 컴포넌트 폴더 구조:
- **`ui/`**: shadcn/ui 기본 컴포넌트 (Button, Card, Badge 등)
- **`layout/`**: 레이아웃 관련 컴포넌트 (Header, Footer, ThemeToggle)
- **`blog/`**: 블로그 관련 컴포넌트 (BlogCard, NotionBlocks 등)
- **`playground/`**: 플레이그라운드 컴포넌트 (WebPlayground, ReactPlayground, 템플릿 컴포넌트)
- **`common/`**: 공통 유틸리티 컴포넌트 (Loading, SocialLinks 등)

#### 새로운 컴포넌트 추가:
1. 적절한 폴더에 컴포넌트 파일 생성
2. TypeScript 인터페이스 정의
3. 필요한 경우 `src/types/`에 타입 추가
4. 다른 컴포넌트에서 import하여 사용

### 이벤트 수집 커스터마이징

노션 이벤트 수집을 확장하려면 `src/lib/analytics.ts`의 `collectEvent` 및 래퍼 함수(`collectCommentEvent`, `collectReactionEvent`, `collectClickEvent`)를 사용하세요. 이벤트는 `/api/events/collect`를 통해 노션 이벤트 데이터베이스에 저장됩니다.

## 📱 반응형 디자인

- **모바일**: 터치 친화적인 네비게이션
- **태블릿**: 중간 크기 화면에 최적화
- **데스크톱**: 넓은 화면에서 최적의 레이아웃

## 🔧 빌드 및 배포

### 프로덕션 빌드

```bash
npm run build
```

### 정적 내보내기 (선택사항)

```bash
npm run export
```

### 배포

Vercel, Netlify, 또는 다른 호스팅 서비스에 배포할 수 있습니다.

## 🐛 문제 해결

### 일반적인 문제

1. **노션 API 오류**: API 키와 데이터베이스 ID 확인
2. **이미지 표시 안됨**: 노션 통합 설정에서 이미지 접근 권한 확인
3. **댓글 표시 안됨**: 댓글 데이터베이스 ID와 권한 설정 확인
4. **댓글 작성 실패**: 댓글 데이터베이스 속성 설정 확인
5. **빌드 오류**: TypeScript 타입 오류 확인
6. **관리자 페이지 접근 불가**: `ADMIN_AUTH_CODE` 환경변수 설정 확인
7. **관리자 인증 실패**: 인증코드가 정확한지 확인
8. **관리자 통계 데이터 없음**: 노션 데이터베이스 권한 확인
9. **웹 플레이그라운드 오류**: JavaScript 실행 오류는 콘솔 패널에서 확인
10. **리액트 플레이그라운드 오류**: JSX 문법 오류나 React import 문제 확인
11. **마크다운 플레이그라운드 오류**: 수식 렌더링 오류나 마크다운 문법 오류 확인
12. **컴포넌트 import 오류**: 새로운 폴더 구조에 맞게 import 경로 확인
13. **웹 알림이 작동하지 않음**: Firebase 설정 및 브라우저 알림 권한 확인
14. **PC 알림이 표시되지 않음**: 서비스 워커 등록 및 브라우저 알림 권한 확인
15. **FCM 토큰 생성 실패**: Firebase 프로젝트 설정 및 VAPID 키 확인
16. **알림 전송 실패**: Firebase Admin SDK 설정 및 사용자 토큰 상태 확인

### 디버깅

```bash
# 타입 체크
npm run type-check

# 린트 검사
npm run lint
```

## 🤝 기여하기

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다.

## 📞 연락처

- **이메일**: joohwan0607@gmail.com
- **GitHub**: [@joohwan-chung](https://github.com/joohwan-chung)
- **LinkedIn**: [주환 정](http://www.linkedin.com/in/joohwan-chung-5145b5138)

## 🙏 감사의 말

- [Next.js](https://nextjs.org/) - React 프레임워크
- [React](https://reactjs.org/) - 사용자 인터페이스 라이브러리
- [shadcn/ui](https://ui.shadcn.com/) - 아름다운 UI 컴포넌트
- [Notion](https://notion.so/) - 강력한 CMS
- [Tailwind CSS](https://tailwindcss.com/) - 유틸리티 우선 CSS 프레임워크
- [Lucide React](https://lucide.dev/) - 아름다운 아이콘 라이브러리
- [CodePen](https://codepen.io/) - 웹 플레이그라운드 UI 영감
- [VS Code](https://code.visualstudio.com/) - 에디터 레이아웃 영감
- [Babel](https://babeljs.io/) - JavaScript 컴파일러 (JSX 변환)
- [react-markdown](https://github.com/remarkjs/react-markdown) - React용 마크다운 렌더러
- [remark-gfm](https://github.com/remarkjs/remark-gfm) - GitHub Flavored Markdown 지원
- [rehype-highlight](https://github.com/rehypejs/rehype-highlight) - 코드 구문 강조
- [remark-math](https://github.com/remarkjs/remark-math) - 수학 표현식 파싱
- [rehype-katex](https://github.com/remarkjs/rehype-katex) - KaTeX 수식 렌더링
- [KaTeX](https://katex.org/) - 빠른 수학 수식 렌더링 라이브러리

## 📚 추가 문서

- **[FIREBASE_SETUP_GUIDE.md](./FIREBASE_SETUP_GUIDE.md)**: Firebase 환경 변수 설정 가이드
- **[WEB_NOTIFICATIONS_SETUP.md](./WEB_NOTIFICATIONS_SETUP.md)**: 웹 알림 시스템 설정 가이드
- **[NOTION_COMMENTS_SETUP.md](./NOTION_COMMENTS_SETUP.md)**: 댓글 시스템 Notion 데이터베이스 설정 가이드
- **[REACTIONS_SETUP.md](./REACTIONS_SETUP.md)**: 반응 시스템 Notion 데이터베이스 설정 가이드
- **[EVENTS_DATABASE_SETUP.md](./EVENTS_DATABASE_SETUP.md)**: 이벤트 추적 Notion 데이터베이스 설정 가이드
- **[BLOG_DATABASE_SETUP.md](./BLOG_DATABASE_SETUP.md)**: 블로그 Notion 데이터베이스 설정 가이드
- **[SITE_SETTINGS_DATABASE_SETUP.md](./SITE_SETTINGS_DATABASE_SETUP.md)**: 사이트 설정 Notion 데이터베이스 설정 가이드
- **[USERS_DATABASE_SETUP.md](./USERS_DATABASE_SETUP.md)**: 사용자 관리 시스템 Notion 데이터베이스 설정 가이드
- **[POPUP_DATABASE_SETUP.md](./POPUP_DATABASE_SETUP.md)**: 팝업 관리 시스템 Notion 데이터베이스 설정 가이드
- **[env.example](./env.example)**: 환경변수 설정 예시

## 🔧 환경변수 설정

### 필수 환경변수

```env
# Notion API 설정
NOTION_API_KEY=your_notion_api_key_here
NOTION_DATABASE_ID=your_notion_database_id_here
NOTION_COMMENTS_DATABASE_ID=your_notion_comments_database_id_here
NOTION_REACTIONS_DATABASE_ID=your_notion_reactions_database_id_here
NOTION_EVENTS_DATABASE_ID=your_notion_events_database_id_here
NOTION_USERS_DATABASE_ID=your_notion_users_database_id_here
NOTION_USER_ACTIVITY_LOGS_DATABASE_ID=your_notion_user_activity_logs_database_id_here
NOTION_USER_SESSIONS_DATABASE_ID=your_notion_user_sessions_database_id_here
NOTION_USER_PERMISSIONS_DATABASE_ID=your_notion_user_permissions_database_id_here
NOTION_USER_REACTIONS_DATABASE_ID=your_notion_user_reactions_database_id_here
NOTION_USER_COMMENTS_DATABASE_ID=your_notion_user_comments_database_id_here
NOTION_SITE_SETTINGS_DATABASE_ID=your_notion_site_settings_database_id_here

# 관리자 페이지 설정
ADMIN_AUTH_CODE=your_admin_auth_code_here

# 사이트 설정
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SITE_NAME="Dev Blog"
NEXT_PUBLIC_SITE_DESCRIPTION="개발자의 기술 블로그입니다."
```

### 환경변수 설명

| 변수명 | 설명 | 필수 |
|--------|------|------|
| `NOTION_API_KEY` | Notion API 키 | ✅ |
| `NOTION_DATABASE_ID` | 블로그 포스트 데이터베이스 ID | ✅ |
| `NOTION_COMMENTS_DATABASE_ID` | 댓글 데이터베이스 ID | ✅ |
| `NOTION_REACTIONS_DATABASE_ID` | 반응 데이터베이스 ID | ✅ |
| `NOTION_EVENTS_DATABASE_ID` | 이벤트 데이터베이스 ID | ✅ |
| `NOTION_USERS_DATABASE_ID` | 사용자 데이터베이스 ID | ✅ |
| `NOTION_USER_ACTIVITY_LOGS_DATABASE_ID` | 사용자 활동 로그 데이터베이스 ID | ✅ |
| `NOTION_USER_SESSIONS_DATABASE_ID` | 사용자 세션 데이터베이스 ID | ✅ |
| `NOTION_USER_PERMISSIONS_DATABASE_ID` | 사용자 권한 데이터베이스 ID | ✅ |
| `NOTION_USER_REACTIONS_DATABASE_ID` | 사용자 반응 데이터베이스 ID | ✅ |
| `NOTION_USER_COMMENTS_DATABASE_ID` | 사용자 댓글 데이터베이스 ID | ✅ |
| `NOTION_SITE_SETTINGS_DATABASE_ID` | 사이트 설정 데이터베이스 ID | ✅ |
| `NOTION_POPUP_DATABASE_ID` | 팝업 데이터베이스 ID | ✅ |
| `ADMIN_AUTH_CODE` | 관리자 페이지 인증코드 | ✅ |
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Firebase API 키 | ❌ |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | Firebase 인증 도메인 | ❌ |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | Firebase 프로젝트 ID | ❌ |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | Firebase 스토리지 버킷 | ❌ |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | Firebase 메시징 발신자 ID | ❌ |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | Firebase 앱 ID | ❌ |
| `NEXT_PUBLIC_FIREBASE_VAPID_KEY` | Firebase VAPID 키 | ❌ |
| `FIREBASE_CLIENT_EMAIL` | Firebase 서비스 계정 이메일 | ❌ |
| `FIREBASE_PRIVATE_KEY` | Firebase 서비스 계정 개인 키 | ❌ |
| `NOTION_USER_NOTIFICATIONS_DATABASE_ID` | 사용자 알림 설정 데이터베이스 ID | ❌ |
| `SERPER_API_KEY` | Serper API 키 (챗봇 인터넷 검색용, 없으면 블로그 검색만) | ❌ |
| `NEXT_PUBLIC_SITE_URL` | 사이트 URL | ❌ |
| `NEXT_PUBLIC_SITE_NAME` | 사이트 이름 | ❌ |
| `NEXT_PUBLIC_SITE_DESCRIPTION` | 사이트 설명 | ❌ |

### 설정 방법

1. `.env.example` 파일을 `.env.local`로 복사
2. 각 환경변수에 실제 값 입력
3. Notion 데이터베이스 ID는 각각의 설정 가이드 참조
4. `ADMIN_AUTH_CODE`는 보안을 위해 강력한 랜덤 문자열 사용 권장

---

**Happy Coding! 🚀**
