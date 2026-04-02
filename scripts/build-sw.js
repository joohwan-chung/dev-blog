const fs = require('fs');
const path = require('path');

// 환경변수 읽기
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || 'YOUR_FIREBASE_API_KEY',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || 'YOUR_PROJECT_ID.firebaseapp.com',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'YOUR_PROJECT_ID',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || 'YOUR_PROJECT_ID.appspot.com',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || 'YOUR_SENDER_ID',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || 'YOUR_APP_ID',
};

// 서비스 워커 템플릿 읽기
const swTemplate = fs.readFileSync(path.join(__dirname, '../public/firebase-messaging-sw.js'), 'utf8');

// 환경변수로 교체
const swContent = swTemplate.replace(
  /const firebaseConfig = \{[\s\S]*?\};/,
  `const firebaseConfig = ${JSON.stringify(firebaseConfig, null, 2)};`
);

// 서비스 워커 파일에 쓰기
fs.writeFileSync(path.join(__dirname, '../public/firebase-messaging-sw.js'), swContent);
