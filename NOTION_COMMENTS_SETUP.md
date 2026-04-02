# Notion 댓글 데이터베이스 설정 가이드

## 1. 댓글 데이터베이스 생성

1. Notion에서 새로운 데이터베이스를 생성합니다.
2. 데이터베이스 이름을 "Comments" 또는 "댓글"로 설정합니다.

## 2. 데이터베이스 속성 설정

다음 속성들을 순서대로 추가해주세요:

### 필수 속성들:

| 속성명 | 속성 타입 | 설명 | 설정값 |
|--------|-----------|------|--------|
| **Content** | Rich Text | 댓글 내용 | - |
| **PostId** | Title | 연결된 블로그 포스트 ID | - |
| **CreatedAt** | Date | 댓글 작성일 | - |
| **IsAnonymous** | Checkbox | 익명 여부 | - |
| **AuthorName** | Rich Text | 작성자 이름 (선택사항) | - |
| **ParentId** | Rich Text | 부모 댓글 ID (대댓글용) | - |
| **Depth** | Number | 댓글 깊이 (0: 댓글, 1: 대댓글, 2: 대대댓글) | - |

### 속성별 상세 설정:

#### Content (Rich Text)
- 속성명: "Content"
- 타입: Rich Text
- 설명: 댓글의 실제 내용

#### PostId (Title)
- 속성명: "PostId"
- 타입: Title
- 설명: 이 댓글이 속한 블로그 포스트의 ID

#### CreatedAt (Date)
- 속성명: "CreatedAt"
- 타입: Date
- 설명: 댓글이 작성된 날짜와 시간

#### IsAnonymous (Checkbox)
- 속성명: "IsAnonymous"
- 타입: Checkbox
- 설명: 댓글이 익명으로 작성되었는지 여부

#### AuthorName (Rich Text)
- 속성명: "AuthorName"
- 타입: Rich Text
- 설명: 댓글 작성자의 이름 (선택사항)

#### ParentId (Rich Text)
- 속성명: "ParentId"
- 타입: Rich Text
- 설명: 대댓글의 경우 부모 댓글의 ID

#### Depth (Number)
- 속성명: "Depth"
- 타입: Number
- 설명: 댓글의 계층 깊이 (0: 댓글, 1: 대댓글, 2: 대대댓글)

## 3. 환경 변수 설정

`.env.local` 파일에 다음 환경 변수를 추가하세요:

```env
NOTION_COMMENTS_DATABASE_ID=your_comments_database_id_here
```

## 4. 데이터베이스 ID 확인 방법

1. Notion에서 댓글 데이터베이스 페이지를 엽니다.
2. URL에서 데이터베이스 ID를 복사합니다.
   - URL 형식: `https://www.notion.so/your-workspace/DATABASE_ID?v=...`
   - DATABASE_ID 부분이 데이터베이스 ID입니다.

## 5. 권한 설정

1. 데이터베이스 설정에서 "Share" 버튼을 클릭합니다.
2. "Add people, emails, groups, or integrations"를 선택합니다.
3. "Add an integration"을 선택하고 Notion API 키와 연결된 통합을 추가합니다.

## 6. 테스트

설정이 완료되면 블로그 포스트에서 댓글 기능을 테스트해보세요:

1. 댓글 작성
2. 대댓글 작성 (답글 버튼 클릭)
3. 대대댓글 작성 (3차 댓글까지 가능)
4. 익명/이름 표시 기능
5. 댓글 계층 구조 표시

## 7. 주의사항

- **3차 댓글 제한**: 대대댓글(3차)까지만 작성 가능합니다.
- **익명 기본값**: 모든 댓글은 기본적으로 익명으로 표시됩니다.
- **계층 구조**: 댓글은 자동으로 계층 구조로 정렬됩니다.
- **실시간 업데이트**: 새 댓글 작성 시 자동으로 목록이 업데이트됩니다.

## 8. 문제 해결

### 댓글이 표시되지 않는 경우:
1. 환경 변수 `NOTION_COMMENTS_DATABASE_ID`가 올바르게 설정되었는지 확인
2. Notion API 키가 유효한지 확인
3. 데이터베이스 권한이 올바르게 설정되었는지 확인

### 대댓글이 작동하지 않는 경우:
1. `ParentId`와 `Depth` 속성이 올바르게 설정되었는지 확인
2. 데이터베이스에서 속성 타입이 정확한지 확인

이제 완전한 대댓글 시스템이 준비되었습니다! 🎉