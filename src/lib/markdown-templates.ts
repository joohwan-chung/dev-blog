export interface MarkdownTemplate {
  id: string;
  name: string;
  description: string;
  markdown: string;
}

export const markdownTemplates: MarkdownTemplate[] = [
  {
    id: 'blog-post',
    name: '블로그 포스트',
    description: '블로그 포스트 작성에 적합한 마크다운 템플릿',
    markdown: `# 제목

## 소개

안녕하세요! 이번 포스트에서는 **마크다운**을 사용하여 블로그 포스트를 작성하는 방법에 대해 알아보겠습니다.

## 주요 기능

### 텍스트 스타일링

- **굵은 글씨**: \`**굵은 글씨**\`
- *기울임체*: \`*기울임체*\`
- ~~취소선~~: \`~~취소선~~\`
- \`인라인 코드\`: \`\`인라인 코드\`\`

### 목록

#### 순서 있는 목록
1. 첫 번째 항목
2. 두 번째 항목
3. 세 번째 항목

#### 순서 없는 목록
- 항목 1
- 항목 2
  - 하위 항목 2-1
  - 하위 항목 2-2

### 링크와 이미지

[링크 텍스트](https://example.com)

![이미지 설명](https://via.placeholder.com/400x200?text=Sample+Image)

### 코드 블록

\`\`\`javascript
function greet(name) {
  return \`Hello, \${name}!\`;
}

console.log(greet('World'));
\`\`\`

### 인용문

> 이것은 인용문입니다.
> 
> 여러 줄에 걸쳐 작성할 수 있습니다.

### 표

| 기능 | 설명 | 상태 |
|------|------|------|
| 마크다운 | 텍스트 포맷팅 | ✅ 완료 |
| 코드 하이라이팅 | 구문 강조 | ✅ 완료 |
| 표 | 데이터 정리 | ✅ 완료 |

### 구분선

---

## 결론

마크다운은 간단하고 직관적인 문법으로 문서를 작성할 수 있게 해주는 훌륭한 도구입니다. 

**주요 장점:**
- 읽기 쉬운 문법
- 다양한 플랫폼 지원
- 버전 관리 친화적

더 많은 마크다운 문법을 배우고 싶다면 [마크다운 가이드](https://www.markdownguide.org/)를 참고하세요.

---

*작성일: 2024년 1월 1일*  
*태그: #마크다운 #블로그 #문서작성*`
  },
  {
    id: 'technical-documentation',
    name: '기술 문서',
    description: 'API 문서나 기술 가이드 작성에 적합한 마크다운 템플릿',
    markdown: `# API 문서

## 개요

이 문서는 RESTful API의 사용법과 엔드포인트에 대한 상세한 가이드를 제공합니다.

## 인증

모든 API 요청에는 유효한 API 키가 필요합니다.

\`\`\`bash
curl -H "Authorization: Bearer YOUR_API_KEY" \\
     https://api.example.com/v1/users
\`\`\`

## 엔드포인트

### 사용자 관리

#### 사용자 목록 조회

사용자 목록을 조회합니다.

**요청**

\`\`\`http
GET /api/v1/users
Authorization: Bearer {token}
\`\`\`

**응답**

\`\`\`json
{
  "data": [
    {
      "id": 1,
      "name": "홍길동",
      "email": "hong@example.com",
      "created_at": "2024-01-01T00:00:00Z"
    }
  ],
  "meta": {
    "total": 1,
    "page": 1,
    "per_page": 10
  }
}
\`\`\`

**상태 코드**

| 코드 | 설명 |
|------|------|
| 200 | 성공 |
| 401 | 인증 실패 |
| 403 | 권한 없음 |
| 500 | 서버 오류 |

#### 사용자 생성

새로운 사용자를 생성합니다.

**요청**

\`\`\`http
POST /api/v1/users
Content-Type: application/json
Authorization: Bearer {token}

{
  "name": "홍길동",
  "email": "hong@example.com",
  "password": "securepassword"
}
\`\`\`

**응답**

\`\`\`json
{
  "data": {
    "id": 1,
    "name": "홍길동",
    "email": "hong@example.com",
    "created_at": "2024-01-01T00:00:00Z"
  }
}
\`\`\`

## 오류 처리

API는 표준 HTTP 상태 코드를 사용하여 응답합니다.

### 일반적인 오류 응답

\`\`\`json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "입력 데이터가 유효하지 않습니다.",
    "details": [
      {
        "field": "email",
        "message": "올바른 이메일 형식이 아닙니다."
      }
    ]
  }
}
\`\`\`

### 오류 코드

| 코드 | 설명 |
|------|------|
| VALIDATION_ERROR | 입력 데이터 검증 실패 |
| AUTHENTICATION_ERROR | 인증 실패 |
| AUTHORIZATION_ERROR | 권한 없음 |
| NOT_FOUND | 리소스를 찾을 수 없음 |
| INTERNAL_ERROR | 내부 서버 오류 |

## 예제

### JavaScript

\`\`\`javascript
const apiKey = 'your-api-key';
const baseUrl = 'https://api.example.com/v1';

// 사용자 목록 조회
async function getUsers() {
  try {
    const response = await fetch(\`\${baseUrl}/users\`, {
      headers: {
        'Authorization': \`Bearer \${apiKey}\`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(\`HTTP error! status: \${response.status}\`);
    }
    
    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.error('Error:', error);
  }
}

getUsers();
\`\`\`

### Python

\`\`\`python
import requests

api_key = 'your-api-key'
base_url = 'https://api.example.com/v1'

def get_users():
    headers = {
        'Authorization': f'Bearer {api_key}',
        'Content-Type': 'application/json'
    }
    
    try:
        response = requests.get(f'{base_url}/users', headers=headers)
        response.raise_for_status()
        data = response.json()
        print(data)
    except requests.exceptions.RequestException as e:
        print(f'Error: {e}')

get_users()
\`\`\`

## FAQ

### Q: API 키는 어떻게 발급받나요?

A: 관리자에게 문의하거나 개발자 포털에서 직접 발급받을 수 있습니다.

### Q: 요청 제한이 있나요?

A: 네, 분당 1000회의 요청 제한이 있습니다. 자세한 내용은 [Rate Limiting 가이드](./rate-limiting.md)를 참고하세요.

### Q: 데이터는 어떤 형식으로 전송하나요?

A: 모든 요청과 응답은 JSON 형식을 사용합니다.

## 변경 이력

| 버전 | 날짜 | 변경 내용 |
|------|------|-----------|
| 1.0.0 | 2024-01-01 | 초기 버전 |
| 1.1.0 | 2024-01-15 | 사용자 생성 API 추가 |
| 1.2.0 | 2024-02-01 | 페이징 기능 추가 |

---

**문서 버전**: 1.2.0  
**최종 업데이트**: 2024년 2월 1일  
**작성자**: 개발팀`
  },
  {
    id: 'meeting-notes',
    name: '회의록',
    description: '회의 내용을 체계적으로 정리하는 마크다운 템플릿',
    markdown: `# 회의록

## 회의 정보

- **회의명**: 프로젝트 기획 회의
- **일시**: 2024년 1월 15일 (월) 14:00 - 15:30
- **장소**: 회의실 A / 온라인 (Zoom)
- **주최자**: 김팀장
- **작성자**: 이사원

## 참석자

### 내부 참석자
- 김팀장 (PM)
- 박개발 (개발팀)
- 최디자인 (디자인팀)
- 이사원 (기획팀)

### 외부 참석자
- 정클라이언트 (클라이언트사)

## 회의 안건

1. 프로젝트 범위 확정
2. 일정 및 마일스톤 검토
3. 리소스 배정 방안
4. 다음 단계 계획

## 회의 내용

### 1. 프로젝트 범위 확정

**논의 사항:**
- 초기 요구사항 분석 결과 공유
- 클라이언트 추가 요구사항 검토

**결정 사항:**
- [x] MVP 기능 범위 확정
- [x] Phase 1, 2, 3 단계별 개발 계획 수립
- [x] 예산 범위 내에서 우선순위 재조정

**액션 아이템:**
- [ ] 김팀장: 최종 요구사항 문서 작성 (1/17까지)
- [ ] 박개발: 기술 스택 검토 및 제안 (1/18까지)

### 2. 일정 및 마일스톤 검토

**현재 일정:**
- 프로젝트 시작: 2024년 1월 20일
- Phase 1 완료: 2024년 3월 15일
- Phase 2 완료: 2024년 5월 15일
- Phase 3 완료: 2024년 7월 15일

**리스크 요소:**
- 클라이언트 피드백 지연 가능성
- 개발팀 리소스 부족

**대응 방안:**
- 주간 진행 상황 보고 체계 구축
- 외주 개발자 추가 투입 검토

### 3. 리소스 배정 방안

**개발팀 구성:**
- 프론트엔드: 박개발 (풀타임)
- 백엔드: 신개발 (풀타임)
- DevOps: 김인프라 (50% 투입)

**디자인팀 구성:**
- UI/UX 디자인: 최디자인 (풀타임)
- 그래픽 디자인: 한디자인 (50% 투입)

### 4. 다음 단계 계획

**이번 주 목표:**
- [ ] 프로젝트 킥오프 미팅 (1/20)
- [ ] 개발 환경 구축 완료 (1/22)
- [ ] 디자인 시스템 가이드라인 수립 (1/25)

**다음 주 목표:**
- [ ] Phase 1 상세 설계 완료
- [ ] 클라이언트 중간 리뷰 미팅

## 결정 사항 요약

| 항목 | 결정 내용 | 담당자 | 마감일 |
|------|-----------|--------|--------|
| 요구사항 문서 | 최종 요구사항 문서 작성 | 김팀장 | 1/17 |
| 기술 스택 | 기술 스택 검토 및 제안 | 박개발 | 1/18 |
| 킥오프 미팅 | 프로젝트 킥오프 미팅 진행 | 김팀장 | 1/20 |
| 개발환경 | 개발 환경 구축 | 박개발, 신개발 | 1/22 |

## 논의 사항 (미결정)

1. **외주 개발자 투입 시점**
   - Phase 2부터 투입 vs Phase 3부터 투입
   - 다음 회의에서 재논의 예정

2. **클라이언트 피드백 주기**
   - 주간 피드백 vs 2주간 피드백
   - 클라이언트사와 추가 협의 필요

## 다음 회의

- **일시**: 2024년 1월 22일 (월) 14:00
- **안건**: 
  - 킥오프 미팅 준비사항 점검
  - 개발 환경 구축 현황 보고
  - Phase 1 상세 계획 수립

## 첨부 자료

- [프로젝트 요구사항서 v1.2](./requirements-v1.2.pdf)
- [기술 스택 비교 분석](./tech-stack-analysis.xlsx)
- [예산 계획서](./budget-plan.pdf)

---

**회의록 작성일**: 2024년 1월 15일  
**승인자**: 김팀장  
**배포 대상**: 프로젝트팀 전체`
  },
  {
    id: 'study-notes',
    name: '학습 노트',
    description: '개인 학습 내용을 체계적으로 정리하는 마크다운 템플릿',
    markdown: `# React Hooks 심화 학습

## 학습 정보

- **주제**: React Hooks 심화
- **학습일**: 2024년 1월 20일
- **학습 시간**: 3시간
- **참고 자료**: 
  - [React 공식 문서](https://react.dev/reference/react)
  - [React Hooks 완벽 가이드](https://example.com/hooks-guide)

## 학습 목표

- [ ] useState와 useEffect의 고급 사용법 이해
- [ ] 커스텀 훅 작성 방법 습득
- [ ] 성능 최적화 기법 학습
- [ ] 실제 프로젝트에 적용할 수 있는 패턴 파악

## 핵심 개념

### 1. useState 고급 패턴

**함수형 업데이트**
\`\`\`javascript
// 일반적인 방법
setCount(count + 1);

// 함수형 업데이트 (권장)
setCount(prevCount => prevCount + 1);
\`\`\`

**여러 상태를 하나의 객체로 관리**
\`\`\`javascript
const [state, setState] = useState({
  name: '',
  email: '',
  age: 0
});

// 부분 업데이트
setState(prevState => ({
  ...prevState,
  name: '홍길동'
}));
\`\`\`

### 2. useEffect 의존성 배열 최적화

**문제가 있는 코드:**
\`\`\`javascript
useEffect(() => {
  fetchData(user.id);
}, [user]); // user 객체가 매번 새로 생성됨
\`\`\`

**개선된 코드:**
\`\`\`javascript
useEffect(() => {
  fetchData(user.id);
}, [user.id]); // 필요한 값만 의존성에 포함
\`\`\`

### 3. 커스텀 훅 작성

**useLocalStorage 훅 예제:**
\`\`\`javascript
function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  const setValue = (value) => {
    try {
      setStoredValue(value);
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(error);
    }
  };

  return [storedValue, setValue];
}
\`\`\`

## 실습 예제

### 카운터 애플리케이션

**요구사항:**
- 증가/감소 버튼
- 리셋 기능
- 로컬 스토리지에 값 저장
- 애니메이션 효과

**구현 코드:**
\`\`\`javascript
import React, { useState, useEffect } from 'react';
import { useLocalStorage } from './hooks/useLocalStorage';

function Counter() {
  const [count, setCount] = useLocalStorage('counter', 0);
  const [isAnimating, setIsAnimating] = useState(false);

  const increment = () => {
    setCount(prev => prev + 1);
    triggerAnimation();
  };

  const decrement = () => {
    setCount(prev => prev - 1);
    triggerAnimation();
  };

  const reset = () => {
    setCount(0);
    triggerAnimation();
  };

  const triggerAnimation = () => {
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 300);
  };

  return (
    <div className="counter">
      <h2 className={isAnimating ? 'animate' : ''}>{count}</h2>
      <div className="buttons">
        <button onClick={decrement}>-</button>
        <button onClick={reset}>Reset</button>
        <button onClick={increment}>+</button>
      </div>
    </div>
  );
}
\`\`\`

## 학습 정리

### 새로 알게 된 점

1. **함수형 업데이트의 중요성**
   - 비동기 상태 업데이트에서 안전함
   - 성능 최적화에 도움

2. **의존성 배열 최적화**
   - 불필요한 리렌더링 방지
   - 메모이제이션과 함께 사용하면 효과적

3. **커스텀 훅의 활용**
   - 로직 재사용성 향상
   - 컴포넌트 코드 간소화

### 어려웠던 부분

1. **useEffect 클린업 함수**
   - 언제 클린업이 필요한지 판단이 어려움
   - 메모리 누수 방지를 위한 정확한 이해 필요

2. **의존성 배열 최적화**
   - ESLint 경고와 성능 사이의 균형점 찾기
   - useCallback, useMemo와의 관계 이해

### 추가 학습 필요 사항

- [ ] useReducer와 useState 비교 분석
- [ ] Context API와 함께 사용하는 패턴
- [ ] 테스팅 방법론 학습
- [ ] 성능 프로파일링 도구 사용법

## 실전 적용 계획

### 다음 프로젝트에서 적용할 것

1. **커스텀 훅 라이브러리 구축**
   - useLocalStorage
   - useDebounce
   - useFetch

2. **성능 최적화 패턴 적용**
   - React.memo 활용
   - useCallback, useMemo 적절한 사용

3. **에러 처리 개선**
   - Error Boundary 구현
   - 커스텀 에러 훅 작성

## 참고 자료

- [React Hooks 공식 문서](https://react.dev/reference/react)
- [useHooks.com](https://usehooks.com/) - 유용한 커스텀 훅 모음
- [React Hook Form](https://react-hook-form.com/) - 폼 관리 라이브러리
- [SWR](https://swr.vercel.app/) - 데이터 페칭 라이브러리

---

**학습 완료일**: 2024년 1월 20일  
**다음 학습 주제**: React Context API  
**예상 학습 시간**: 2시간`
  },
  {
    id: 'project-proposal',
    name: '프로젝트 계획서',
    description: '프로젝트 기획 및 제안서 작성에 적합한 마크다운 템플릿',
    markdown: `# 프로젝트 제안서

## 프로젝트 개요

### 프로젝트명
**온라인 학습 플랫폼 개발**

### 프로젝트 목표
- 직장인을 위한 온라인 학습 플랫폼 구축
- 개인화된 학습 경험 제공
- 학습 진도 추적 및 인증 시스템 구현

### 프로젝트 기간
- **시작일**: 2024년 3월 1일
- **종료일**: 2024년 8월 31일
- **총 기간**: 6개월

## 배경 및 필요성

### 시장 현황
- 온라인 교육 시장 규모: 연평균 15% 성장
- 코로나19 이후 온라인 학습 수요 급증
- 기업의 디지털 전환 교육 필요성 증가

### 문제점
1. **기존 플랫폼의 한계**
   - 개인화된 학습 경험 부족
   - 학습 진도 추적 기능 미흡
   - 모바일 최적화 부족

2. **사용자 니즈**
   - 언제 어디서나 학습 가능
   - 개인별 학습 속도에 맞는 커리큘럼
   - 학습 성과 측정 및 인증

## 프로젝트 범위

### 핵심 기능

#### 1. 사용자 관리
- 회원가입/로그인 (소셜 로그인 지원)
- 프로필 관리
- 학습 이력 관리

#### 2. 학습 콘텐츠
- 동영상 강의
- 퀴즈 및 과제
- 학습 자료 다운로드
- 라이브 세션

#### 3. 학습 관리
- 개인별 학습 진도 추적
- 학습 계획 수립
- 알림 및 리마인더
- 성과 분석 리포트

#### 4. 인증 시스템
- 과정 완료 인증서
- 스킬 배지 시스템
- 학습 포트폴리오

### 기술 스택

#### Frontend
- **Framework**: React 18
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Redux Toolkit
- **Build Tool**: Vite

#### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: JWT + Passport.js

#### Infrastructure
- **Cloud**: AWS
- **Container**: Docker
- **CI/CD**: GitHub Actions
- **Monitoring**: Sentry, DataDog

## 프로젝트 일정

### Phase 1: 기반 구축 (3월 1일 - 4월 15일)
- [ ] 프로젝트 환경 설정
- [ ] 데이터베이스 설계
- [ ] 기본 인증 시스템 구현
- [ ] UI/UX 디자인 시스템 구축

### Phase 2: 핵심 기능 개발 (4월 16일 - 6월 15일)
- [ ] 사용자 관리 시스템
- [ ] 학습 콘텐츠 관리
- [ ] 학습 진도 추적
- [ ] 기본 알림 시스템

### Phase 3: 고도화 및 최적화 (6월 16일 - 8월 15일)
- [ ] 성능 최적화
- [ ] 모바일 앱 개발
- [ ] 고급 분석 기능
- [ ] 보안 강화

### Phase 4: 배포 및 운영 (8월 16일 - 8월 31일)
- [ ] 프로덕션 배포
- [ ] 사용자 테스트
- [ ] 버그 수정
- [ ] 운영 가이드 작성

## 팀 구성

### 개발팀
| 역할 | 인원 | 담당 업무 |
|------|------|-----------|
| 프로젝트 매니저 | 1명 | 프로젝트 전체 관리, 일정 조율 |
| 프론트엔드 개발자 | 2명 | React 기반 웹/모바일 앱 개발 |
| 백엔드 개발자 | 2명 | API 서버, 데이터베이스 설계 |
| DevOps 엔지니어 | 1명 | 인프라 구축, CI/CD 파이프라인 |
| UI/UX 디자이너 | 1명 | 사용자 인터페이스 설계 |

### 총 인원: 7명

## 예산 계획

### 개발 비용
| 항목 | 비용 (만원) | 비고 |
|------|-------------|------|
| 인력비 | 4,200 | 6개월 × 7명 × 월 100만원 |
| 인프라 비용 | 300 | AWS 서버, 데이터베이스 |
| 도구 및 라이선스 | 200 | 개발 도구, 디자인 소프트웨어 |
| 기타 비용 | 100 | 교육, 컨설팅 |

### 총 예산: 4,800만원

## 리스크 분석

### 기술적 리스크
| 리스크 | 영향도 | 대응 방안 |
|--------|--------|-----------|
| 새로운 기술 스택 학습 지연 | 중 | 사전 교육 및 멘토링 |
| 성능 최적화 어려움 | 중 | 프로토타입 단계에서 검증 |
| 보안 취약점 | 높 | 보안 전문가 자문, 정기 감사 |

### 일정 리스크
| 리스크 | 영향도 | 대응 방안 |
|--------|--------|-----------|
| 요구사항 변경 | 높 | 변경 관리 프로세스 수립 |
| 팀원 이탈 | 중 | 백업 인력 확보 |
| 외부 의존성 지연 | 중 | 대안 계획 수립 |

## 성공 지표

### 정량적 지표
- **사용자 수**: 런칭 후 3개월 내 1,000명
- **완주율**: 평균 70% 이상
- **사용자 만족도**: 4.5/5.0 이상
- **시스템 가용성**: 99.9% 이상

### 정성적 지표
- 사용자 피드백 긍정적 반응
- 학습 효과 개선 확인
- 플랫폼 안정성 확보

## 향후 계획

### 단기 계획 (6개월 후)
- 사용자 피드백 기반 기능 개선
- 추가 학습 콘텐츠 확보
- 모바일 앱 스토어 출시

### 중장기 계획 (1년 후)
- AI 기반 개인화 학습 추천
- 기업 교육 솔루션 확장
- 해외 시장 진출 검토

## 결론

본 프로젝트는 시장의 니즈를 충족하고 기술적 혁신을 통해 차별화된 온라인 학습 플랫폼을 구축하는 것을 목표로 합니다. 체계적인 계획과 전문적인 팀 구성으로 성공적인 프로젝트 완료를 기대합니다.

---

**제안서 작성일**: 2024년 1월 25일  
**작성자**: 프로젝트 기획팀  
**승인자**: 기술이사  
**문서 버전**: 1.0`
  },
  {
    id: 'readme-template',
    name: 'README 템플릿',
    description: '프로젝트 README 파일 작성에 적합한 마크다운 템플릿',
    markdown: `# 프로젝트명

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Build Status](https://img.shields.io/badge/build-passing-brightgreen.svg)](https://github.com/username/project)
[![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)](https://github.com/username/project/releases)

> 프로젝트에 대한 간단한 설명을 한 줄로 작성하세요.

## 📋 목차

- [개요](#개요)
- [주요 기능](#주요-기능)
- [스크린샷](#스크린샷)
- [설치 방법](#설치-방법)
- [사용법](#사용법)
- [API 문서](#api-문서)
- [기여하기](#기여하기)
- [라이선스](#라이선스)
- [연락처](#연락처)

## 🚀 개요

프로젝트에 대한 자세한 설명을 작성하세요. 프로젝트의 목적, 해결하려는 문제, 주요 특징 등을 포함하세요.

### 왜 이 프로젝트를 만들었나요?

- 기존 솔루션의 한계점
- 새로운 접근 방식의 필요성
- 사용자 피드백 기반 개선

## ✨ 주요 기능

- **기능 1**: 기능에 대한 설명
- **기능 2**: 기능에 대한 설명
- **기능 3**: 기능에 대한 설명
- **기능 4**: 기능에 대한 설명

### 추가 기능

- [ ] 향후 추가 예정인 기능
- [ ] 개발 중인 기능
- [x] 완료된 기능

## 📸 스크린샷

### 메인 화면
![메인 화면](./screenshots/main.png)

### 설정 화면
![설정 화면](./screenshots/settings.png)

## 🛠️ 설치 방법

### 요구사항

- Node.js 18.0.0 이상
- npm 8.0.0 이상
- Git

### 설치 단계

1. **저장소 클론**
   \`\`\`bash
   git clone https://github.com/username/project.git
   cd project
   \`\`\`

2. **의존성 설치**
   \`\`\`bash
   npm install
   \`\`\`

3. **환경 변수 설정**
   \`\`\`bash
   cp .env.example .env
   # .env 파일을 편집하여 필요한 환경 변수를 설정하세요
   \`\`\`

4. **데이터베이스 설정**
   \`\`\`bash
   npm run db:migrate
   npm run db:seed
   \`\`\`

5. **개발 서버 실행**
   \`\`\`bash
   npm run dev
   \`\`\`

## 📖 사용법

### 기본 사용법

\`\`\`javascript
import { ProjectName } from 'project-name';

const instance = new ProjectName({
  apiKey: 'your-api-key',
  environment: 'development'
});

// 기본 기능 사용
const result = await instance.doSomething();
console.log(result);
\`\`\`

### 고급 사용법

\`\`\`javascript
// 설정 옵션
const options = {
  timeout: 5000,
  retries: 3,
  debug: true
};

const instance = new ProjectName(options);

// 비동기 작업
try {
  const data = await instance.fetchData();
  console.log('성공:', data);
} catch (error) {
  console.error('오류:', error.message);
}
\`\`\`

### CLI 사용법

\`\`\`bash
# 기본 명령어
project-name --help

# 특정 작업 실행
project-name run --config config.json

# 디버그 모드
project-name run --debug --verbose
\`\`\`

## 📚 API 문서

### 인증

모든 API 요청에는 API 키가 필요합니다.

\`\`\`bash
curl -H "Authorization: Bearer YOUR_API_KEY" \\
     https://api.example.com/v1/endpoint
\`\`\`

### 주요 엔드포인트

#### GET /api/v1/users

사용자 목록을 조회합니다.

**요청 예시:**
\`\`\`bash
curl -H "Authorization: Bearer YOUR_API_KEY" \\
     "https://api.example.com/v1/users?page=1&limit=10"
\`\`\`

**응답 예시:**
\`\`\`json
{
  "data": [
    {
      "id": 1,
      "name": "홍길동",
      "email": "hong@example.com",
      "created_at": "2024-01-01T00:00:00Z"
    }
  ],
  "meta": {
    "total": 100,
    "page": 1,
    "limit": 10
  }
}
\`\`\`

#### POST /api/v1/users

새로운 사용자를 생성합니다.

**요청 예시:**
\`\`\`bash
curl -X POST \\
     -H "Authorization: Bearer YOUR_API_KEY" \\
     -H "Content-Type: application/json" \\
     -d '{"name": "홍길동", "email": "hong@example.com"}' \\
     https://api.example.com/v1/users
\`\`\`

## 🧪 테스트

### 테스트 실행

\`\`\`bash
# 전체 테스트 실행
npm test

# 특정 테스트 파일 실행
npm test -- --grep "UserService"

# 커버리지 리포트 생성
npm run test:coverage
\`\`\`

### 테스트 구조

\`\`\`
tests/
├── unit/           # 단위 테스트
├── integration/    # 통합 테스트
├── e2e/           # E2E 테스트
└── fixtures/      # 테스트 데이터
\`\`\`

## 🚀 배포

### 프로덕션 빌드

\`\`\`bash
npm run build
\`\`\`

### Docker 배포

\`\`\`bash
# Docker 이미지 빌드
docker build -t project-name .

# 컨테이너 실행
docker run -p 3000:3000 project-name
\`\`\`

### 환경별 설정

| 환경 | URL | 설명 |
|------|-----|------|
| Development | http://localhost:3000 | 로컬 개발 환경 |
| Staging | https://staging.example.com | 스테이징 환경 |
| Production | https://api.example.com | 프로덕션 환경 |

## 🤝 기여하기

프로젝트에 기여해주셔서 감사합니다! 기여하기 전에 다음 사항을 확인해주세요.

### 기여 방법

1. **Fork** 이 저장소를 포크하세요
2. **브랜치 생성** (\`git checkout -b feature/amazing-feature\`)
3. **커밋** (\`git commit -m 'Add some amazing feature'\`)
4. **푸시** (\`git push origin feature/amazing-feature\`)
5. **Pull Request** 생성

### 코딩 스타일

- ESLint 설정을 따릅니다
- Prettier를 사용하여 코드를 포맷팅합니다
- 의미있는 커밋 메시지를 작성합니다

### 이슈 리포트

버그를 발견하셨나요? [이슈를 생성](https://github.com/username/project/issues)해주세요.

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다. 자세한 내용은 [LICENSE](LICENSE) 파일을 참고하세요.

## 👥 팀

- **개발자**: [@username](https://github.com/username)
- **디자이너**: [@designer](https://github.com/designer)
- **기획자**: [@planner](https://github.com/planner)

## 🙏 감사의 말

- [React](https://reactjs.org/) - UI 라이브러리
- [Node.js](https://nodejs.org/) - 런타임 환경
- [Express](https://expressjs.com/) - 웹 프레임워크
- [MongoDB](https://www.mongodb.com/) - 데이터베이스

## 📞 연락처

- **이메일**: contact@example.com
- **웹사이트**: https://example.com
- **트위터**: [@projectname](https://twitter.com/projectname)

---

**⭐ 이 프로젝트가 도움이 되었다면 별표를 눌러주세요!**`
  },
  {
    id: 'mathematical-notes',
    name: '수학 노트',
    description: '수학 공식과 방정식을 포함한 마크다운 템플릿',
    markdown: `# 수학 노트

## 미적분학 기초

### 극한 (Limits)

함수 $f(x)$의 $x$가 $a$에 접근할 때의 극한은 다음과 같이 정의됩니다:

$$\\lim_{x \\to a} f(x) = L$$

#### 극한의 기본 성질

1. **상수함수의 극한**: $\\lim_{x \\to a} c = c$
2. **항등함수의 극한**: $\\lim_{x \\to a} x = a$
3. **합의 극한**: $\\lim_{x \\to a} [f(x) + g(x)] = \\lim_{x \\to a} f(x) + \\lim_{x \\to a} g(x)$
4. **곱의 극한**: $\\lim_{x \\to a} [f(x) \\cdot g(x)] = \\lim_{x \\to a} f(x) \\cdot \\lim_{x \\to a} g(x)$

### 미분 (Derivatives)

함수 $f(x)$의 도함수는 다음과 같이 정의됩니다:

$$f'(x) = \\lim_{h \\to 0} \\frac{f(x+h) - f(x)}{h}$$

#### 주요 미분 공식

| 함수 | 도함수 |
|------|--------|
| $x^n$ | $nx^{n-1}$ |
| $\\sin(x)$ | $\\cos(x)$ |
| $\\cos(x)$ | $-\\sin(x)$ |
| $e^x$ | $e^x$ |
| $\\ln(x)$ | $\\frac{1}{x}$ |

#### 연쇄법칙 (Chain Rule)

합성함수 $f(g(x))$의 도함수는:

$$\\frac{d}{dx}[f(g(x))] = f'(g(x)) \\cdot g'(x)$$

### 적분 (Integrals)

함수 $f(x)$의 부정적분은:

$$\\int f(x) \\, dx = F(x) + C$$

여기서 $F'(x) = f(x)$이고 $C$는 적분상수입니다.

#### 기본 적분 공식

- $\\int x^n \\, dx = \\frac{x^{n+1}}{n+1} + C$ (단, $n \\neq -1$)
- $\\int \\sin(x) \\, dx = -\\cos(x) + C$
- $\\int \\cos(x) \\, dx = \\sin(x) + C$
- $\\int e^x \\, dx = e^x + C$
- $\\int \\frac{1}{x} \\, dx = \\ln|x| + C$

#### 정적분

정적분은 다음과 같이 정의됩니다:

$$\\int_a^b f(x) \\, dx = \\lim_{n \\to \\infty} \\sum_{i=1}^n f(x_i) \\Delta x$$

여기서 $\\Delta x = \\frac{b-a}{n}$이고 $x_i = a + i\\Delta x$입니다.

## 선형대수학

### 벡터 (Vectors)

$n$차원 벡터는 다음과 같이 표현됩니다:

$$\\vec{v} = \\begin{pmatrix} v_1 \\\\ v_2 \\\\ \\vdots \\\\ v_n \\end{pmatrix}$$

#### 벡터의 내적 (Dot Product)

두 벡터 $\\vec{u}$와 $\\vec{v}$의 내적은:

$$\\vec{u} \\cdot \\vec{v} = u_1v_1 + u_2v_2 + \\cdots + u_nv_n = \\sum_{i=1}^n u_i v_i$$

#### 벡터의 크기 (Magnitude)

벡터 $\\vec{v}$의 크기는:

$$|\\vec{v}| = \\sqrt{v_1^2 + v_2^2 + \\cdots + v_n^2} = \\sqrt{\\vec{v} \\cdot \\vec{v}}$$

### 행렬 (Matrices)

$m \\times n$ 행렬은 다음과 같이 표현됩니다:

$$A = \\begin{pmatrix} a_{11} & a_{12} & \\cdots & a_{1n} \\\\ a_{21} & a_{22} & \\cdots & a_{2n} \\\\ \\vdots & \\vdots & \\ddots & \\vdots \\\\ a_{m1} & a_{m2} & \\cdots & a_{mn} \\end{pmatrix}$$

#### 간단한 행렬 예제

$2 \\times 2$ 행렬:

$$A = \\begin{pmatrix} 1 & 2 \\\\ 3 & 4 \\end{pmatrix}$$

$3 \\times 3$ 행렬:

$$B = \\begin{pmatrix} 1 & 2 & 3 \\\\ 4 & 5 & 6 \\\\ 7 & 8 & 9 \\end{pmatrix}$$

#### 행렬의 기본 연산

행렬의 덧셈:

$$A + B = \\begin{pmatrix} a_{11}+b_{11} & a_{12}+b_{12} \\\\ a_{21}+b_{21} & a_{22}+b_{22} \\end{pmatrix}$$

스칼라 곱셈:

$$kA = \\begin{pmatrix} ka_{11} & ka_{12} \\\\ ka_{21} & ka_{22} \\end{pmatrix}$$

#### 행렬의 곱셈

두 행렬 $A$ (크기: $m \\times p$)와 $B$ (크기: $p \\times n$)의 곱은:

$$(AB)_{ij} = \\sum_{k=1}^p a_{ik} b_{kj}$$

#### 행렬식 (Determinant)

$2 \\times 2$ 행렬의 행렬식:

$$\\det\\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix} = ad - bc$$

$3 \\times 3$ 행렬의 행렬식:

$$\\det\\begin{pmatrix} a & b & c \\\\ d & e & f \\\\ g & h & i \\end{pmatrix} = a(ei - fh) - b(di - fg) + c(dh - eg)$$

## 확률론

### 확률의 기본 개념

사건 $A$의 확률은:

$$P(A) = \\frac{\\text{사건 A가 일어나는 경우의 수}}{\\text{전체 경우의 수}}$$

#### 조건부 확률

사건 $B$가 일어났을 때 사건 $A$가 일어날 확률:

$$P(A|B) = \\frac{P(A \\cap B)}{P(B)}$$

#### 베이즈 정리 (Bayes' Theorem)

$$P(A|B) = \\frac{P(B|A) \\cdot P(A)}{P(B)}$$

### 확률분포

#### 이항분포 (Binomial Distribution)

$n$번의 독립적인 시행에서 성공 확률이 $p$인 이항분포:

$$P(X = k) = \\binom{n}{k} p^k (1-p)^{n-k}$$

여기서 $\\binom{n}{k} = \\frac{n!}{k!(n-k)!}$는 이항계수입니다.

#### 정규분포 (Normal Distribution)

평균 $\\mu$, 분산 $\\sigma^2$인 정규분포의 확률밀도함수:

$$f(x) = \\frac{1}{\\sqrt{2\\pi\\sigma^2}} e^{-\\frac{(x-\\mu)^2}{2\\sigma^2}}$$

## 통계학

### 기술통계

#### 평균 (Mean)

$$\\bar{x} = \\frac{1}{n} \\sum_{i=1}^n x_i$$

#### 분산 (Variance)

$$s^2 = \\frac{1}{n-1} \\sum_{i=1}^n (x_i - \\bar{x})^2$$

#### 표준편차 (Standard Deviation)

$$s = \\sqrt{s^2} = \\sqrt{\\frac{1}{n-1} \\sum_{i=1}^n (x_i - \\bar{x})^2}$$

### 추론통계

#### 신뢰구간 (Confidence Interval)

모평균 $\\mu$의 $100(1-\\alpha)\\%$ 신뢰구간:

$$\\bar{x} \\pm t_{\\alpha/2, n-1} \\frac{s}{\\sqrt{n}}$$

여기서 $t_{\\alpha/2, n-1}$는 자유도 $n-1$인 t분포의 $\\alpha/2$ 분위수입니다.

## 복소수

### 복소수의 정의

복소수는 다음과 같이 표현됩니다:

$$z = a + bi$$

여기서 $a, b \\in \\mathbb{R}$이고 $i^2 = -1$입니다.

#### 복소수의 극형식

$$z = r(\\cos\\theta + i\\sin\\theta) = re^{i\\theta}$$

여기서 $r = |z| = \\sqrt{a^2 + b^2}$이고 $\\theta = \\arg(z) = \\arctan\\left(\\frac{b}{a}\\right)$입니다.

#### 오일러 공식 (Euler's Formula)

$$e^{i\\theta} = \\cos\\theta + i\\sin\\theta$$

특히 $\\theta = \\pi$일 때:

$$e^{i\\pi} + 1 = 0$$

이는 수학에서 가장 아름다운 공식 중 하나로 여겨집니다.

---

**작성일**: 2024년 1월 25일  
**주제**: 수학 기초 이론  
**난이도**: 중급`
  }
];
