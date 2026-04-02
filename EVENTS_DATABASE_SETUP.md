# 노션 이벤트 데이터베이스 설정 가이드

이 문서는 블로그의 이벤트 추적 시스템을 위한 노션 데이터베이스 설정 방법을 설명합니다.

## 📋 개요

이벤트 데이터베이스는 사용자의 웹사이트 활동을 추적하고 관리자 대시보드에서 실시간으로 모니터링할 수 있도록 설계되었습니다.

## 🗄️ 데이터베이스 생성

### 1. 새 데이터베이스 생성
1. 노션에서 새 페이지를 생성합니다
2. `/`를 입력하고 "Database"를 선택합니다
3. "Table - Inline" 또는 "Table - Full page"를 선택합니다
4. 데이터베이스 이름을 "Events" 또는 "이벤트"로 설정합니다

### 2. 데이터베이스 ID 복사
1. 데이터베이스 URL에서 데이터베이스 ID를 복사합니다
2. URL 형식: `https://www.notion.so/your-workspace/DATABASE_ID?v=...`
3. `DATABASE_ID` 부분을 복사하여 환경변수에 설정합니다

## 🏗️ 속성(Properties) 설정

다음 속성들을 순서대로 생성하고 설정해주세요:

### 1. Type (이벤트 타입)
- **속성명**: `Type`
- **속성 타입**: `Select` (선택)
- **옵션들**:
  - `page_view` (페이지 조회)
  - `comment` (댓글)
  - `reaction` (반응)
  - `click` (클릭)
  - `user_visit` (사용자 방문)

### 2. Description (설명)
- **속성명**: `Description`
- **속성 타입**: `Rich Text` (서식 있는 텍스트)
- **설명**: 이벤트에 대한 자세한 설명

### 3. Timestamp (타임스탬프)
- **속성명**: `Timestamp`
- **속성 타입**: `Date` (날짜)
- **설정**: "Include time" 체크

### 4. UserIp (사용자 IP)
- **속성명**: `UserIp`
- **속성 타입**: `Rich Text` (서식 있는 텍스트)
- **설명**: 이벤트를 발생시킨 사용자의 IP 주소

### 5. Page (페이지)
- **속성명**: `Page`
- **속성 타입**: `Rich Text` (서식 있는 텍스트)
- **설명**: 이벤트가 발생한 페이지 URL

### 6. UserAgent (사용자 에이전트)
- **속성명**: `UserAgent`
- **속성 타입**: `Rich Text` (서식 있는 텍스트)
- **설명**: 사용자의 브라우저 및 운영체제 정보

### 7. Referrer (리퍼러)
- **속성명**: `Referrer`
- **속성 타입**: `Rich Text` (서식 있는 텍스트)
- **설명**: 사용자가 이전에 방문한 페이지 URL

## 🔧 환경변수 설정

`.env.local` 파일에 다음 환경변수를 추가합니다:

```env
# 노션 이벤트 데이터베이스 ID
NOTION_EVENTS_DATABASE_ID=your_notion_events_database_id_here
```

## 📊 데이터베이스 구조 예시

완성된 데이터베이스는 다음과 같은 구조를 가집니다:

| Type | Description | Timestamp | UserIp | Page | UserAgent | Referrer |
|------|-------------|-----------|--------|------|-----------|----------|
| page_view | 홈페이지 조회 | 2024-01-15 10:30:00 | 192.168.1.1 | / | Mozilla/5.0... | https://google.com |
| comment | 새 댓글 작성 | 2024-01-15 10:35:00 | 192.168.1.1 | /blog/react-guide | Mozilla/5.0... | /blog/react-guide |
| reaction | 포스트 추천 | 2024-01-15 10:40:00 | 192.168.1.1 | /blog/react-guide | Mozilla/5.0... | /blog/react-guide |

## 🔐 권한 설정

### 1. 노션 API 통합 생성
1. [Notion Developers](https://www.notion.so/my-integrations) 페이지로 이동
2. "New integration" 클릭
3. 통합 이름을 "Blog Events Tracker"로 설정
4. "Submit" 클릭하여 통합 생성
5. "Internal Integration Token" 복사

### 2. 데이터베이스 권한 부여
1. 이벤트 데이터베이스 페이지로 이동
2. 우측 상단의 "Share" 버튼 클릭
3. "Add people, emails, groups, or integrations" 클릭
4. 생성한 통합 이름을 검색하여 추가
5. "Can edit" 권한 부여

### 3. 환경변수에 토큰 추가
```env
# 노션 API 키
NOTION_API_KEY=your_notion_api_key_here
```

## 📈 이벤트 타입별 설명

### page_view
- **설명**: 사용자가 페이지를 조회했을 때 발생
- **예시**: "홈페이지 조회", "블로그 포스트 조회"

### comment
- **설명**: 사용자가 댓글을 작성했을 때 발생
- **예시**: "새 댓글 작성", "대댓글 작성"

### reaction
- **설명**: 사용자가 포스트에 반응(좋아요, 추천 등)했을 때 발생
- **예시**: "포스트 추천", "포스트 비추천"

### click
- **설명**: 사용자가 특정 요소를 클릭했을 때 발생
- **예시**: "버튼 클릭", "링크 클릭"

### user_visit
- **설명**: 사용자가 사이트에 처음 방문했을 때 발생
- **예시**: "신규 사용자 방문", "재방문"

## 🚀 테스트 방법

### 1. 데이터베이스 연결 테스트
```bash
# 개발 서버 시작
npm run dev

# 관리자 페이지 접속
http://localhost:3000/admin
```

### 2. 이벤트 수집 테스트
1. 메인 사이트에서 페이지를 방문합니다
2. 관리자 페이지에서 실시간 이벤트를 확인합니다
3. 노션 데이터베이스에서 직접 데이터를 확인합니다

## ⚠️ 주의사항

### 1. 데이터 보안
- 사용자 IP 주소는 개인정보이므로 적절히 관리해야 합니다
- GDPR 및 개인정보보호법을 준수해야 합니다

### 2. 성능 고려사항
- 이벤트 데이터가 많아질 경우 성능에 영향을 줄 수 있습니다
- 주기적으로 오래된 데이터를 정리하는 것을 권장합니다

### 3. API 제한
- 노션 API는 분당 요청 수에 제한이 있습니다
- 대량의 이벤트가 발생하는 경우 배치 처리를 고려하세요

## 🔧 문제 해결

### 1. 데이터베이스 연결 오류
- 환경변수가 올바르게 설정되었는지 확인
- 노션 API 키가 유효한지 확인
- 데이터베이스 권한이 올바르게 설정되었는지 확인

### 2. 이벤트가 저장되지 않는 경우
- 브라우저 개발자 도구에서 네트워크 오류 확인
- 서버 로그에서 API 오류 확인
- 노션 데이터베이스 속성명이 정확한지 확인

### 3. 실시간 이벤트가 표시되지 않는 경우
- SSE 연결 상태 확인
- 브라우저가 Server-Sent Events를 지원하는지 확인
- 네트워크 방화벽 설정 확인

## 📚 추가 리소스

- [노션 API 문서](https://developers.notion.com/)
- [Server-Sent Events 가이드](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events)
- [Next.js API Routes 문서](https://nextjs.org/docs/api-routes/introduction)

---

이 가이드를 따라 설정하면 블로그의 이벤트 추적 시스템이 정상적으로 작동할 것입니다. 추가 질문이 있으시면 언제든 문의해주세요!
