# 웹 알림 설정 가이드

이 가이드는 Firebase Cloud Messaging(FCM)을 사용한 웹 알림 기능을 설정하는 방법을 설명합니다.

## 1. Firebase 프로젝트 설정

### 1.1 Firebase 콘솔에서 프로젝트 생성
1. [Firebase 콘솔](https://console.firebase.google.com/)에 접속
2. "프로젝트 추가" 클릭
3. 프로젝트 이름 입력 (예: "joohwan-dev-blog")
4. Google Analytics 활성화 (선택사항)
5. 프로젝트 생성 완료

### 1.2 Firebase Cloud Messaging 설정
1. Firebase 콘솔에서 프로젝트 선택
2. 왼쪽 메뉴에서 "Cloud Messaging" 클릭
3. "웹 앱에 Firebase 추가" 클릭
4. 앱 닉네임 입력 (예: "joohwan-blog-web")
5. "Firebase SDK 설정" 선택
6. 설정 정보 복사 (나중에 사용)

### 1.3 서버 키 및 VAPID 키 생성
1. Firebase 콘솔 → 프로젝트 설정 (⚙️) → "서비스 계정" 탭
2. "새 비공개 키 생성" 클릭
3. JSON 파일 다운로드 (이 파일의 내용을 환경 변수로 사용)

### 1.4 VAPID 키 생성
1. Firebase 콘솔 → 프로젝트 설정 (⚙️) → "Cloud Messaging" 탭
2. "웹 푸시 인증서" 섹션에서 "키 쌍 생성" 클릭
3. 생성된 키를 복사하여 환경 변수에 추가

## 2. 환경 변수 설정

`.env.local` 파일에 다음 환경 변수를 추가하세요:

```env
# Firebase 설정 (웹 알림용)
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
FIREBASE_SERVER_KEY=your_firebase_server_key_here
```

### 환경 변수 값 찾기
- `NEXT_PUBLIC_FIREBASE_API_KEY`: Firebase 설정에서 `apiKey` 값
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`: Firebase 설정에서 `authDomain` 값
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`: Firebase 설정에서 `projectId` 값
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`: Firebase 설정에서 `storageBucket` 값
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`: Firebase 설정에서 `messagingSenderId` 값
- `NEXT_PUBLIC_FIREBASE_APP_ID`: Firebase 설정에서 `appId` 값
- `NEXT_PUBLIC_FIREBASE_VAPID_KEY`: VAPID 키 (웹 푸시 인증서에서 생성)
- `FIREBASE_SERVER_KEY`: 서버 키 JSON 파일에서 `private_key` 값

## 3. Notion Database Setup

### 3.1 Update Users Database
Add the following property to your existing Site Settings database:

**Property Name**: `WebNotifications`
- **Type**: Checkbox
- **Description**: Enable web notifications

### 3.2 Add Web Notifications Setting to Site Settings
Add a new row to your Site Settings database with the following values:

| Key | Value | Category | Type | Description | IsActive |
|-----|-------|----------|------|-------------|----------|
| WebNotifications | false | notifications | boolean | Web push notifications | ✓ |

### 3.3 Create User Notification Settings Database (Optional)
To manage user-specific notification settings, create a new database:

**Database Name**: `User Notification Settings`

**Properties**:
- `UserID` (Title)
- `FCMToken` (Text)
- `NewCommentNotifications` (Checkbox)
- `NewUserRegistrationNotifications` (Checkbox)
- `WebNotificationsEnabled` (Checkbox)
- `CreatedAt` (Created time)
- `UpdatedAt` (Last edited time)

## 4. 기능 테스트

### 4.1 개발 서버 실행
```bash
npm run dev
```

### 4.2 관리자 페이지에서 테스트
1. `http://localhost:3000/admin/settings` 접속
2. "알림" 탭 클릭
3. "웹 알림 활성화" 스위치 켜기
4. 브라우저에서 알림 권한 허용
5. "테스트 알림" 버튼 클릭하여 정상 작동 확인

### 4.3 알림 수신 확인
- 브라우저에서 알림이 정상적으로 표시되는지 확인
- 알림 클릭 시 해당 페이지로 이동하는지 확인

## 5. 알림 전송 방법

### 5.1 API를 통한 알림 전송
```javascript
// 새 댓글 알림 전송 예시
const response = await fetch('/api/notifications/send', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    title: '새 댓글이 작성되었습니다',
    body: '블로그 포스트에 새로운 댓글이 달렸습니다.',
    type: 'comment',
    data: {
      url: '/blog/post-id',
      postId: 'post-id',
    },
  }),
});
```

### 5.2 알림 타입
- `comment`: 새 댓글 알림
- `user`: 새 사용자 가입 알림
- `general`: 일반 알림

## 6. 문제 해결

### 6.1 알림이 표시되지 않는 경우
1. 브라우저에서 알림 권한이 허용되었는지 확인
2. Firebase 설정이 올바른지 확인
3. 서비스 워커가 정상적으로 로드되었는지 확인

### 6.2 FCM 토큰이 생성되지 않는 경우
1. Firebase 프로젝트 설정 확인
2. 환경 변수 값 확인
3. 브라우저 콘솔에서 오류 메시지 확인

### 6.3 서비스 워커 오류
1. `public/firebase-messaging-sw.js` 파일이 존재하는지 확인
2. Next.js 설정에서 리라이트 규칙이 올바른지 확인
3. 빌드 후 서비스 워커가 정상적으로 로드되는지 확인

## 7. 보안 고려사항

1. **서버 키 보안**: `FIREBASE_SERVER_KEY`는 서버에서만 사용하고 클라이언트에 노출하지 마세요.
2. **토큰 관리**: FCM 토큰은 민감한 정보이므로 안전하게 저장하고 관리하세요.
3. **권한 확인**: 알림 전송 전에 사용자 권한을 확인하세요.
4. **스팸 방지**: 알림 전송 빈도를 제한하여 스팸을 방지하세요.

## 8. 추가 기능

### 8.1 알림 히스토리
사용자가 받은 알림의 히스토리를 관리할 수 있습니다.

### 8.2 알림 설정 세분화
사용자별로 알림 유형을 세분화하여 설정할 수 있습니다.

### 8.3 알림 템플릿
다양한 알림 템플릿을 미리 정의하여 사용할 수 있습니다.
