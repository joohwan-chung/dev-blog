# 사용자 관리 시스템 Notion 데이터베이스 설정 가이드

이 문서는 블로그 시스템의 사용자 관리 기능을 위한 Notion 데이터베이스 설정 방법을 설명합니다.

## 📋 개요

사용자 관리 시스템은 다음과 같은 핵심 기능을 제공합니다:
- 사용자 등록 및 인증
- 사용자 프로필 관리
- 사용자 활동 추적
- 권한 관리
- 세션 관리

## 🗄️ 필요한 데이터베이스들

### 1. Users (사용자) 데이터베이스
**데이터베이스 이름**: "Users" 또는 "사용자"

#### 필수 속성들:

| 속성명 | 속성 타입 | 설명 | 설정값 |
|--------|-----------|------|--------|
| **ID** | Title | 사용자 고유 식별자 | user_001, admin_001 |
| **Name** | Rich Text | 사용자 이름 | - |
| **Email** | Rich Text | 이메일 주소 | - |
| **Password** | Rich Text | 해시화된 비밀번호 | - |
| **Role** | Select | 사용자 역할 | admin, user, guest |
| **Status** | Select | 계정 상태 | active, inactive, banned |
| **Avatar** | URL | 프로필 이미지 URL | - |
| **CreatedAt** | Date | 가입일 | - |
| **LastActive** | Date | 마지막 활동일 | - |
| **LoginCount** | Number | 로그인 횟수 | 0 |
| **Preferences** | Rich Text | 사용자 설정 (JSON) | - |

#### Select 속성 설정:

**Role (역할)**:
- `admin` (관리자)
- `user` (일반 사용자)
- `guest` (게스트)

**Status (상태)**:
- `active` (활성)
- `inactive` (비활성)
- `banned` (차단됨)

### 2. User Activity Logs (사용자 활동 로그) 데이터베이스
**데이터베이스 이름**: "User Activity Logs" 또는 "사용자 활동 로그"

#### 필수 속성들:

| 속성명 | 속성 타입 | 설명 | 설정값 |
|--------|-----------|------|--------|
| **ID** | Title | 활동 로그 고유 식별자 | log_001, log_002 |
| **UserId** | Relation | 사용자 ID (Users 데이터베이스와 연결) | - |
| **Action** | Select | 활동 유형 | login, logout, comment, reaction, view_post, update_profile |
| **Description** | Rich Text | 활동 설명 | - |
| **Details** | Rich Text | 추가 세부사항 (JSON) | - |
| **IpAddress** | Rich Text | IP 주소 | - |
| **UserAgent** | Rich Text | 사용자 에이전트 | - |
| **Timestamp** | Date | 활동 시간 | - |

#### Select 속성 설정:

**Action (활동 유형)**:
- `login` (로그인)
- `logout` (로그아웃)
- `comment` (댓글 작성)
- `reaction` (반응 남기기)
- `view_post` (포스트 조회)
- `update_profile` (프로필 수정)
- `register` (회원가입)
- `password_change` (비밀번호 변경)

### 3. User Sessions (사용자 세션) 데이터베이스
**데이터베이스 이름**: "User Sessions" 또는 "사용자 세션"

#### 필수 속성들:

| 속성명 | 속성 타입 | 설명 | 설정값 |
|--------|-----------|------|--------|
| **ID** | Title | 세션 고유 식별자 | session_001, session_002 |
| **UserId** | Relation | 사용자 ID (Users 데이터베이스와 연결) | - |
| **SessionToken** | Rich Text | 세션 토큰 | - |
| **IpAddress** | Rich Text | IP 주소 | - |
| **UserAgent** | Rich Text | 사용자 에이전트 | - |
| **CreatedAt** | Date | 세션 생성일 | - |
| **ExpiresAt** | Date | 세션 만료일 | - |
| **IsActive** | Checkbox | 활성 상태 | - |

### 4. User Permissions (사용자 권한) 데이터베이스
**데이터베이스 이름**: "User Permissions" 또는 "사용자 권한"

#### 필수 속성들:

| 속성명 | 속성 타입 | 설명 | 설정값 |
|--------|-----------|------|--------|
| **ID** | Title | 권한 고유 식별자 | perm_001, perm_002 |
| **UserId** | Relation | 사용자 ID (Users 데이터베이스와 연결) | - |
| **Permission** | Multi-select | 권한 유형 | read_posts, write_comments, manage_users, admin_access, comment, reaction |
| **GrantedAt** | Date | 권한 부여일 | - |
| **GrantedBy** | Relation | 권한 부여자 (Users 데이터베이스와 연결) | - |
| **IsActive** | Checkbox | 활성 상태 | - |

#### Multi-select 속성 설정:

**Permission (권한 유형)**:
- `read_posts` (포스트 읽기)
- `write_comments` (댓글 작성)
- `manage_users` (사용자 관리)
- `admin_access` (관리자 접근)
- `edit_posts` (포스트 편집)
- `comment` (댓글 작성)
- `reaction` (반응)
- `delete_comments` (댓글 삭제)

### 5. User Reactions (사용자 반응) 데이터베이스
**데이터베이스 이름**: "User Reactions" 또는 "사용자 반응"

#### 필수 속성들:

| 속성명 | 속성 타입 | 설명 | 설정값 |
|--------|-----------|------|--------|
| **ID** | Title | 반응 고유 식별자 | react_001, react_002 |
| **UserId** | Relation | 사용자 ID (Users 데이터베이스와 연결) | - |
| **ReactionId** | Rich Text | 반응 ID (Reactions 데이터베이스와 연결) | - |
| **PostId** | Rich Text | 포스트 ID | - |
| **ReactionType** | Select | 반응 타입 | like, dislike, recommend, not_recommend |
| **CreatedAt** | Date | 반응 생성일 | - |
| **UpdatedAt** | Date | 반응 수정일 | - |
| **IsActive** | Checkbox | 활성 상태 | - |

#### Select 속성 설정:

**ReactionType (반응 타입)**:
- `like` (좋아요)
- `dislike` (싫어요)
- `recommend` (추천)
- `not_recommend` (비추천)

### 6. User Comments (사용자 댓글) 데이터베이스
**데이터베이스 이름**: "User Comments" 또는 "사용자 댓글"

#### 필수 속성들:

| 속성명 | 속성 타입 | 설명 | 설정값 |
|--------|-----------|------|--------|
| **ID** | Title | 사용자 댓글 고유 식별자 | ucomment_001, ucomment_002 |
| **UserId** | Relation | 사용자 ID (Users 데이터베이스와 연결) | - |
| **CommentId** | Rich Text | 댓글 ID (Comments 데이터베이스와 연결) | - |
| **PostId** | Rich Text | 포스트 ID | - |
| **Content** | Rich Text | 댓글 내용 | - |
| **AuthorName** | Rich Text | 작성자 이름 | - |
| **ParentId** | Rich Text | 부모 댓글 ID (대댓글용) | - |
| **CreatedAt** | Date | 댓글 작성일 | - |
| **UpdatedAt** | Date | 댓글 수정일 | - |
| **IsEdited** | Checkbox | 수정 여부 | - |

## 🔧 환경 변수 설정

`.env.local` 파일에 다음 환경 변수들을 추가하세요:

```env
# 기존 환경 변수들...
NOTION_USERS_DATABASE_ID=your_users_database_id_here
NOTION_USER_ACTIVITY_LOGS_DATABASE_ID=your_activity_logs_database_id_here
NOTION_USER_SESSIONS_DATABASE_ID=your_sessions_database_id_here
NOTION_USER_PERMISSIONS_DATABASE_ID=your_permissions_database_id_here
NOTION_USER_REACTIONS_DATABASE_ID=your_user_reactions_database_id_here
NOTION_USER_COMMENTS_DATABASE_ID=your_user_comments_database_id_here

# 기존 댓글 및 반응 데이터베이스 (익명 사용자용)
NOTION_COMMENTS_DATABASE_ID=your_comments_database_id_here
NOTION_REACTIONS_DATABASE_ID=your_reactions_database_id_here
```

## 📝 데이터베이스 관계 설정

### 1. Users ↔ User Activity Logs
- Users의 ID 속성과 User Activity Logs의 UserId 속성을 연결
- 관계 유형: "One to many" (한 사용자당 여러 활동 로그)

### 2. Users ↔ User Sessions
- Users의 ID 속성과 User Sessions의 UserId 속성을 연결
- 관계 유형: "One to many" (한 사용자당 여러 세션)

### 3. Users ↔ User Permissions
- Users의 ID 속성과 User Permissions의 UserId 속성을 연결
- 관계 유형: "One to many" (한 사용자당 여러 권한)

### 4. Users ↔ User Permissions (GrantedBy)
- Users의 ID 속성과 User Permissions의 GrantedBy 속성을 연결
- 관계 유형: "One to many" (한 사용자가 여러 권한을 부여할 수 있음)

### 5. Users ↔ User Reactions
- Users의 ID 속성과 User Reactions의 UserId 속성을 연결
- 관계 유형: "One to many" (한 사용자당 여러 반응)

### 6. Users ↔ User Comments
- Users의 ID 속성과 User Comments의 UserId 속성을 연결
- 관계 유형: "One to many" (한 사용자당 여러 댓글)

## 🚀 API 매핑

### 사용자 관리 API
- `GET /api/admin/users` - 사용자 목록 조회
- `POST /api/admin/users` - 새 사용자 생성
- `GET /api/admin/users/[id]` - 특정 사용자 조회
- `PUT /api/admin/users/[id]` - 사용자 정보 수정
- `DELETE /api/admin/users/[id]` - 사용자 삭제

### 인증 API
- `POST /api/auth/login` - 로그인
- `POST /api/auth/register` - 회원가입
- `POST /api/auth/logout` - 로그아웃
- `GET /api/auth/me` - 현재 사용자 정보
- `PUT /api/auth/profile` - 프로필 수정

### 활동 추적 API
- `GET /api/user/activity` - 사용자 활동 로그 조회
- `POST /api/user/activity` - 활동 로그 생성
- `GET /api/user/reactions` - 사용자 반응 목록 조회
- `GET /api/user/comments` - 사용자 댓글 목록 조회

### 댓글 및 반응 API (익명 사용자 지원)
- `GET /api/comments` - 댓글 목록 조회 (익명 + 로그인 사용자)
- `POST /api/comments` - 댓글 작성 (익명 + 로그인 사용자)
- `GET /api/reactions` - 반응 목록 조회 (익명 + 로그인 사용자)
- `POST /api/reactions` - 반응 작성 (익명 + 로그인 사용자)

## 🔍 관리자 기능

### 사용자 관리
- 사용자 목록 조회 및 검색
- 사용자 상태 변경 (활성/비활성/차단)
- 사용자 역할 변경
- 사용자 프로필 수정
- 사용자 삭제

### 활동 모니터링
- 사용자별 활동 로그 조회
- 로그인/로그아웃 추적
- 댓글/반응 활동 추적
- 의심스러운 활동 감지

### 권한 관리
- 사용자별 권한 부여/제거
- 권한 그룹 관리
- 접근 제어 설정

## ⚠️ 보안 고려사항

### 데이터 보호
- 비밀번호는 반드시 해시화하여 저장
- 개인정보는 암호화하여 저장
- 세션 토큰은 안전하게 생성 및 관리

### 접근 제어
- 관리자 권한은 신중하게 부여
- 세션 만료 시간 적절히 설정
- 비정상적인 로그인 시도 모니터링

### 개인정보 보호
- IP 주소는 개인정보이므로 적절히 보호
- 사용자 동의 없이 개인정보 수집 금지
- GDPR 등 개인정보 보호 규정 준수

## 🧪 테스트

### 기본 기능 테스트
1. 사용자 등록 및 로그인
2. 프로필 수정
3. 활동 로그 생성 및 조회
4. 권한 확인

### 보안 테스트
1. 인증되지 않은 접근 차단
2. 권한 없는 작업 차단
3. 세션 만료 처리
4. SQL 인젝션 방지

## 📊 모니터링

### 주요 지표
- 활성 사용자 수
- 일일/월간 가입자 수
- 사용자 활동 패턴
- 시스템 오류율

### 알림 설정
- 비정상적인 로그인 시도
- 시스템 오류 발생
- 사용자 신고 접수

## 🔄 확장 가능성

### 향후 추가 가능한 기능
- 소셜 로그인 (Google, GitHub 등)
- 2단계 인증
- 이메일 인증
- 비밀번호 재설정
- 사용자 신고 시스템
- 관리자 알림 시스템

## 💡 사용자 경험 개선

### 익명 사용자 지원
- 댓글과 반응은 로그인 없이도 사용 가능
- 회원가입 시 추가 혜택 안내
- 점진적 사용자 유도 전략

### 회원가입 혜택
- 개인화된 활동 내역
- 댓글 수정/삭제 권한
- 알림 설정
- 프로필 커스터마이징

이제 완전한 사용자 관리 시스템이 준비되었습니다! 🎉