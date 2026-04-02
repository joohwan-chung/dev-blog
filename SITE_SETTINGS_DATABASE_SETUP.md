# 사이트 설정 Notion 데이터베이스 설정 가이드

## 1. 데이터베이스 생성

1. Notion에서 새로운 데이터베이스를 생성합니다.
2. 데이터베이스 이름을 "Site Settings" 또는 "사이트 설정"으로 설정합니다.

## 2. 데이터베이스 속성 설정

다음 속성들을 순서대로 추가해주세요:

### 필수 속성들:

| 속성명 | 속성 타입 | 설명 | 설정값 |
|--------|-----------|------|--------|
| **Key** | Title | 설정 키 (고유 식별자) | - |
| **Value** | Rich Text | 설정 값 | - |
| **Category** | Select | 설정 카테고리 | - |
| **Type** | Select | 데이터 타입 | - |
| **Description** | Rich Text | 설정 설명 | - |
| **IsActive** | Checkbox | 활성화 여부 | - |
| **UpdatedAt** | Date | 마지막 업데이트 | - |

### 속성별 상세 설정:

#### Key (Title)
- 속성명: "Key"
- 타입: Title
- 설명: 설정의 고유 식별자 (예: siteTitle, allowComments)

#### Value (Rich Text)
- 속성명: "Value"
- 타입: Rich Text
- 설명: 설정의 실제 값

#### Category (Select)
- 속성명: "Category"
- 타입: Select
- 옵션들:
  - `general` (기본 설정)
  - `blog` (블로그 설정)
  - `security` (보안 설정)
  - `notifications` (알림 설정)
  - `seo` (SEO 설정)
  - `images` (이미지 설정)

#### Type (Select)
- 속성명: "Type"
- 타입: Select
- 옵션들:
  - `string` (문자열)
  - `number` (숫자)
  - `boolean` (불린)
  - `array` (배열)

#### Description (Rich Text)
- 속성명: "Description"
- 타입: Rich Text
- 설명: 설정에 대한 상세 설명

#### IsActive (Checkbox)
- 속성명: "IsActive"
- 타입: Checkbox
- 설명: 설정이 활성화되어 있는지 여부

#### UpdatedAt (Date)
- 속성명: "UpdatedAt"
- 타입: Date
- 설명: 설정이 마지막으로 업데이트된 날짜

## 3. 기본 설정 데이터 추가

다음과 같은 기본 설정들을 데이터베이스에 추가하세요:

### 기본 설정 (general)
| Key | Value | Category | Type | Description | IsActive |
|-----|-------|----------|------|-------------|----------|
| siteTitle | 주환의 개발 블로그 | general | string | 사이트 제목 | ✓ |
| siteDescription | 개발과 기술에 대한 이야기를 나누는 공간입니다. | general | string | 사이트 설명 | ✓ |
| siteKeywords | 개발, 프로그래밍, 기술, 블로그 | general | string | 사이트 키워드 | ✓ |
| adminEmail | | general | string | 관리자 이메일 | ✓ |

### 블로그 설정 (blog)
| Key | Value | Category | Type | Description | IsActive |
|-----|-------|----------|------|-------------|----------|
| postsPerPage | 10 | blog | number | 페이지당 포스트 수 | ✓ |
| allowComments | true | blog | boolean | 댓글 허용 여부 | ✓ |
| requireCommentApproval | true | blog | boolean | 댓글 승인 필요 여부 | ✓ |
| showTagCloud | true | blog | boolean | 태그 클라우드 표시 여부 | ✓ |

### 보안 설정 (security)
| Key | Value | Category | Type | Description | IsActive |
|-----|-------|----------|------|-------------|----------|
| passwordMinLength | 8 | security | number | 최소 비밀번호 길이 | ✓ |
| maxLoginAttempts | 5 | security | number | 최대 로그인 시도 횟수 | ✓ |
| lockoutDuration | 30 | security | number | 계정 잠금 시간 (분) | ✓ |

### 알림 설정 (notifications)
| Key | Value | Category | Type | Description | IsActive |
|-----|-------|----------|------|-------------|----------|
| notifyNewComments | true | notifications | boolean | 새 댓글 알림 | ✓ |
| notifyNewUsers | true | notifications | boolean | 새 사용자 가입 알림 | ✓ |
| emailNotifications | true | notifications | boolean | 이메일 알림 | ✓ |

### SEO 설정 (seo)
| Key | Value | Category | Type | Description | IsActive |
|-----|-------|----------|------|-------------|----------|
| metaTitle | 주환의 개발 블로그 | seo | string | 메타 제목 | ✓ |
| metaDescription | 개발과 기술에 대한 이야기를 나누는 공간입니다. | seo | string | 메타 설명 | ✓ |
| generateSitemap | true | seo | boolean | 사이트맵 자동 생성 | ✓ |
| allowIndexing | true | seo | boolean | 검색엔진 인덱싱 허용 | ✓ |

### 이미지 설정 (images)
| Key | Value | Category | Type | Description | IsActive |
|-----|-------|----------|------|-------------|----------|
| logoUrl | | images | string | 로고 URL | ✓ |
| faviconUrl | | images | string | 파비콘 URL | ✓ |

## 4. 환경 변수 설정

`.env.local` 파일에 다음 환경 변수를 추가하세요:

```env
NOTION_SITE_SETTINGS_DATABASE_ID=your_site_settings_database_id_here
```

## 5. 데이터베이스 ID 확인 방법

1. Notion에서 사이트 설정 데이터베이스 페이지를 엽니다.
2. URL에서 데이터베이스 ID를 복사합니다.
   - URL 형식: `https://www.notion.so/your-workspace/DATABASE_ID?v=...`
   - DATABASE_ID 부분이 데이터베이스 ID입니다.

## 6. 권한 설정

1. 데이터베이스 설정에서 "Share" 버튼을 클릭합니다.
2. "Add people, emails, groups, or integrations"를 선택합니다.
3. "Add an integration"을 선택하고 Notion API 키와 연결된 통합을 추가합니다.

## 7. 테스트

설정이 완료되면 다음을 테스트해보세요:

1. 사이트 설정 불러오기
2. 설정 값 변경
3. 설정 값 저장
4. 사이트에 설정 반영

## 8. 주의사항

- **Key 값은 고유해야 합니다**: 같은 Key가 중복되면 마지막 값이 사용됩니다.
- **Type에 맞는 Value 입력**: boolean은 "true"/"false", number는 숫자만 입력
- **IsActive 체크**: 비활성화된 설정은 사이트에 반영되지 않습니다.
- **UpdatedAt 자동 업데이트**: 설정 변경 시 자동으로 현재 시간으로 업데이트됩니다.

## 9. 문제 해결

### 설정이 반영되지 않는 경우:
1. 환경 변수 `NOTION_SITE_SETTINGS_DATABASE_ID`가 올바르게 설정되었는지 확인
2. Notion API 키가 유효한지 확인
3. 데이터베이스 권한이 올바르게 설정되었는지 확인
4. IsActive가 체크되어 있는지 확인

### 설정 값이 잘못된 경우:
1. Type과 Value가 일치하는지 확인
2. boolean 값은 "true" 또는 "false"로 입력
3. number 값은 숫자만 입력

이제 Notion을 통한 사이트 설정 관리가 준비되었습니다! 🎉
