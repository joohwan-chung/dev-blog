# Firebase 환경 변수 설정 가이드

## 개요
웹 알림 기능을 위한 Firebase 환경 변수 설정 방법을 안내합니다.

## 필요한 환경 변수

### 1. 클라이언트 사이드 설정 (브라우저용)
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_VAPID_KEY=your_vapid_key_here
```

### 2. 서버 사이드 설정 (알림 전송용)
```env
FIREBASE_SERVER_KEY=your_firebase_server_key_here
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your_project_id.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY_HERE\n-----END PRIVATE KEY-----\n"
```

## Firebase 콘솔에서 값 찾기

### 1. 프로젝트 설정 접근
1. [Firebase 콘솔](https://console.firebase.google.com/) 접속
2. 프로젝트 선택
3. 좌측 메뉴에서 **⚙️ 프로젝트 설정** 클릭

### 2. 일반 탭에서 찾을 수 있는 값들
**일반** 탭에서 다음 값들을 찾을 수 있습니다:

#### 웹 앱 설정
- **API 키**: `NEXT_PUBLIC_FIREBASE_API_KEY`
- **프로젝트 ID**: `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- **앱 ID**: `NEXT_PUBLIC_FIREBASE_APP_ID`
- **메시징 발신자 ID**: `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`

#### 도메인 설정
- **인증 도메인**: `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- **스토리지 버킷**: `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`

### 3. 클라우드 메시징 탭에서 찾을 수 있는 값들
**클라우드 메시징** 탭에서 다음 값들을 찾을 수 있습니다:

#### 웹 푸시 인증서
- **웹 푸시 인증서**: `NEXT_PUBLIC_FIREBASE_VAPID_KEY`

#### 서버 키 (Legacy)
- **서버 키**: `FIREBASE_SERVER_KEY`
  - ⚠️ **주의**: 이 키는 Legacy FCM API용입니다. Firebase Admin SDK 사용 시에는 필요하지 않습니다.

### 4. 서비스 계정 탭에서 찾을 수 있는 값들
**서비스 계정** 탭에서 Firebase Admin SDK용 설정을 찾을 수 있습니다:

#### 서비스 계정 키 생성
1. **새 비공개 키 생성** 버튼 클릭
2. JSON 파일 다운로드
3. JSON 파일에서 다음 값들을 추출:

```json
{
  "type": "service_account",
  "project_id": "your_project_id",
  "private_key_id": "...",
  "private_key": "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n",
  "client_email": "firebase-adminsdk-xxxxx@your_project_id.iam.gserviceaccount.com",
  "client_id": "...",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "..."
}
```

#### 환경 변수로 변환
- **클라이언트 이메일**: `FIREBASE_CLIENT_EMAIL`
- **개인 키**: `FIREBASE_PRIVATE_KEY`
- **프로젝트 ID**: `NEXT_PUBLIC_FIREBASE_PROJECT_ID` (이미 설정됨)

## 설정 방법

### 1. .env.local 파일 생성
```bash
cp env.example .env.local
```

### 2. 환경 변수 설정
`.env.local` 파일을 열어서 실제 값으로 변경:

```env
# Firebase 설정 (웹 알림용)
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyC...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789012
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789012:web:abcdef123456
NEXT_PUBLIC_FIREBASE_VAPID_KEY=BLx...

# Firebase Admin SDK 설정 (서버 사이드 알림 전송용)
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project-id.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC...\n-----END PRIVATE KEY-----\n"
```

### 3. 서버 재시작
```bash
npm run dev
```

## 주의사항

### 1. 보안
- `.env.local` 파일은 절대 Git에 커밋하지 마세요
- Firebase 서비스 계정 키는 민감한 정보입니다
- 프로덕션 환경에서는 환경 변수를 안전하게 관리하세요

### 2. 키 형식
- `FIREBASE_PRIVATE_KEY`는 반드시 따옴표로 감싸고 `\n`을 실제 줄바꿈으로 변환하세요
- VAPID 키는 `BLx` 또는 `BK`로 시작해야 합니다

### 3. 프로젝트 ID 확인
- 모든 설정에서 동일한 프로젝트 ID를 사용해야 합니다
- 프로젝트 ID는 Firebase 콘솔 URL에서도 확인할 수 있습니다

## 문제 해결

### 1. Firebase Admin SDK 초기화 실패
- `FIREBASE_CLIENT_EMAIL`과 `FIREBASE_PRIVATE_KEY`가 올바른지 확인
- 개인 키 형식이 올바른지 확인 (줄바꿈 포함)

### 2. FCM 토큰 등록 실패
- `NEXT_PUBLIC_FIREBASE_VAPID_KEY`가 올바른지 확인
- 브라우저에서 알림 권한이 허용되었는지 확인

### 3. 알림 전송 실패
- Firebase Admin SDK 설정이 올바른지 확인
- FCM 토큰이 유효한지 확인

## 추가 리소스

- [Firebase 콘솔](https://console.firebase.google.com/)
- [Firebase Admin SDK 문서](https://firebase.google.com/docs/admin/setup)
- [FCM 웹 푸시 가이드](https://firebase.google.com/docs/cloud-messaging/js/client)
