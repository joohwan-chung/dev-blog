# 팝업 관리 노션 데이터베이스 설정 가이드

## 데이터베이스 생성

노션에서 새로운 데이터베이스를 생성하고 다음 속성들을 추가하세요:

### 중요: 데이터베이스 생성 순서
1. 노션에서 새 페이지 생성
2. "데이터베이스" 선택
3. "빈 데이터베이스" 선택
4. 아래 속성들을 순서대로 추가
5. 환경변수에 데이터베이스 ID 설정

## 데이터베이스 속성

### 1. 기본 속성
- **Title** (제목) - `Title` 타입
  - 팝업의 제목을 입력합니다.

### 2. 콘텐츠 속성
- **Content** (내용) - `Rich text` 타입
  - 팝업에 표시될 내용을 입력합니다. 마크다운 형식 지원

- **ImageUrl** (이미지 URL) - `URL` 타입
  - 팝업에 표시될 이미지의 URL (선택사항)

### 3. 표시 설정
- **DisplayLocation** (표시 위치) - `Select` 타입
  - 옵션: `home` (메인 페이지), `blog` (블로그 페이지), `about` (소개 페이지), `profile` (프로필 페이지), `playground` (플레이그라운드), `all` (모든 페이지)

- **PageSpecific** (특정 페이지) - `Rich text` 타입
  - 특정 페이지 경로를 지정할 때 사용 (예: /blog/[id])

### 4. 활성화 설정
- **IsActive** (활성화 여부) - `Checkbox` 타입
  - 팝업 활성화/비활성화 상태

- **StartDate** (시작 날짜) - `Date` 타입
  - 팝업이 표시되기 시작하는 날짜

- **EndDate** (종료 날짜) - `Date` 타입
  - 팝업이 표시를 종료하는 날짜

### 5. 디자인 설정
- **PopupType** (팝업 타입) - `Select` 타입
  - 옵션: `modal` (모달), `banner` (배너), `toast` (토스트), `slide` (슬라이드)

- **Theme** (테마) - `Select` 타입
  - 옵션: `default` (기본), `dark` (다크), `light` (라이트), `gradient` (그라데이션)

- **Position** (위치) - `Select` 타입
  - 옵션: `center` (중앙), `top` (상단), `bottom` (하단), `top-right` (우상단), `top-left` (좌상단)

### 6. 동작 설정
- **AutoClose** (자동 닫기) - `Number` 타입
  - 자동으로 닫히는 시간 (초 단위, 0이면 수동으로만 닫기)

- **ShowCloseButton** (닫기 버튼 표시) - `Checkbox` 타입
  - 닫기 버튼 표시 여부

- **AllowOutsideClick** (외부 클릭 허용) - `Checkbox` 타입
  - 팝업 외부 클릭으로 닫기 허용 여부

### 7. 우선순위 및 순서
- **Priority** (우선순위) - `Number` 타입
  - 팝업 표시 우선순위 (높을수록 먼저 표시)

- **Order** (순서) - `Number` 타입
  - 같은 우선순위 내에서의 표시 순서

### 8. 타겟팅 설정
- **TargetUsers** (대상 사용자) - `Select` 타입
  - 옵션: `all` (모든 사용자), `logged-in` (로그인 사용자), `guest` (게스트), `admin` (관리자)

- **ShowOnce** (한 번만 표시) - `Checkbox` 타입
  - 사용자당 한 번만 표시할지 여부

### 9. 메타데이터
- **CreatedAt** (생성일) - `Created time` 타입
  - 자동 생성

- **UpdatedAt** (수정일) - `Last edited time` 타입
  - 자동 생성

- **CreatedBy** (생성자) - `Created by` 타입
  - 자동 생성

## 데이터베이스 뷰 설정

### 1. 기본 뷰 (모든 팝업)
- 모든 팝업을 표시하는 기본 뷰

### 2. 활성 팝업 뷰
- 필터: `Is Active` = `체크됨`
- 정렬: `Priority` 내림차순, `Order` 오름차순

### 3. 만료된 팝업 뷰
- 필터: `End Date` < `오늘`
- 정렬: `End Date` 내림차순

### 4. 위치별 팝업 뷰
- 그룹화: `Display Location`
- 정렬: `Priority` 내림차순

## 사용 예시

### 메인 페이지 배너 팝업
```
Title: "새로운 기능 출시!"
Content: "블로그에 새로운 기능이 추가되었습니다. 확인해보세요!"
Display Location: home
Popup Type: banner
Position: top
Theme: gradient
Is Active: 체크
Start Date: 2024-01-01
End Date: 2024-12-31
Auto Close: 0
Show Close Button: 체크
Allow Outside Click: 체크
Priority: 10
Target Users: all
Show Once: 체크
```

### 블로그 페이지 모달 팝업
```
Title: "뉴스레터 구독"
Content: "최신 블로그 포스트를 이메일로 받아보세요!"
Display Location: blog
Popup Type: modal
Position: center
Theme: default
Is Active: 체크
Start Date: 2024-01-01
End Date: 2024-06-30
Auto Close: 0
Show Close Button: 체크
Allow Outside Click: 체크
Priority: 5
Target Users: logged-in
Show Once: 체크
```

## API 연동을 위한 속성 매핑

```typescript
interface PopupData {
  id: string;                    // 노션 페이지 ID (자동 생성)
  title: string;                 // 팝업 제목
  content: string;               // 팝업 내용
  imageUrl?: string;            // 이미지 URL (선택사항)
  displayLocation: 'home' | 'blog' | 'about' | 'profile' | 'playground' | 'all';
  pageSpecific?: string;        // 특정 페이지 경로
  isActive: boolean;            // 활성화 여부
  startDate: string;            // 시작 날짜
  endDate: string;              // 종료 날짜
  popupType: 'modal' | 'banner' | 'toast' | 'slide';
  theme: 'default' | 'dark' | 'light' | 'gradient';
  position: 'center' | 'top' | 'bottom' | 'top-right' | 'top-left';
  autoClose: number;            // 자동 닫기 시간 (초)
  showCloseButton: boolean;     // 닫기 버튼 표시 여부
  allowOutsideClick: boolean;   // 외부 클릭 허용 여부
  priority: number;             // 우선순위
  order: number;                // 순서
  targetUsers: 'all' | 'logged-in' | 'guest' | 'admin';
  showOnce: boolean;            // 한 번만 표시 여부
  createdAt: string;            // 생성일 (자동 생성)
  updatedAt: string;            // 수정일 (자동 생성)
  createdBy: string;            // 생성자 (자동 생성)
}
```

이 설정을 통해 다양한 종류의 팝업을 효율적으로 관리할 수 있습니다.

## 문제 해결

### 팝업이 생성되지 않는 경우
1. **환경변수 확인**: `NOTION_POPUP_DATABASE_ID`가 올바르게 설정되었는지 확인
2. **데이터베이스 권한**: 노션 API 키가 해당 데이터베이스에 접근 권한이 있는지 확인
3. **속성 이름**: 모든 속성 이름이 정확히 일치하는지 확인 (대소문자 구분)
4. **Select 옵션**: Select 타입 속성의 옵션들이 정확히 설정되었는지 확인

### 데이터베이스 ID 찾는 방법
1. 노션에서 데이터베이스 페이지 열기
2. URL에서 `https://www.notion.so/` 다음의 긴 문자열이 데이터베이스 ID
3. 하이픈(-) 제거 후 사용

예시: `https://www.notion.so/12345678-1234-1234-1234-123456789abc`
→ 데이터베이스 ID: `12345678123412341234123456789abc`
