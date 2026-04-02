export interface WebTemplate {
  id: string;
  name: string;
  css: string;
  html: string;
  js: string;
}

export const webTemplates: WebTemplate[] = [
  {
    id: 'basic',
    name: '기본 템플릿',
    css: `/* CSS 코드를 여기에 작성하세요 */
.container {
  width: 100%;
  max-width: 400px;
  margin: 0 auto;
  padding: 2rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 1rem;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}

.title {
  color: white;
  font-size: 2rem;
  font-weight: bold;
  text-align: center;
  margin-bottom: 1rem;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.button {
  background: rgba(255, 255, 255, 0.2);
  border: 2px solid rgba(255, 255, 255, 0.3);
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 500;
}

.button:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
}`,
    html: `<!-- HTML 구조 -->
<div class="container">
  <h1 class="title">CSS 플레이그라운드</h1>
  <button class="button">버튼 클릭</button>
  <div class="card">
    <h3>카드 제목</h3>
    <p>이것은 CSS로 스타일링된 카드입니다.</p>
  </div>
</div>`,
    js: `// JavaScript 코드를 여기에 작성하세요
console.log("Hello, Web Playground!");

// 변수와 함수 예제
const name = "웹 플레이그라운드";
const version = "1.0.0";

function greet() {
  console.log(\`환영합니다! \${name} v\${version}\`);
}

greet();

// 배열과 객체 예제
const colors = ["빨강", "파랑", "초록"];
const user = {
  name: "사용자",
  age: 25,
  hobbies: ["코딩", "독서", "게임"]
};

console.log("색상 목록:", colors);
console.log("사용자 정보:", user);`,
  },
  {
    id: 'animation',
    name: '애니메이션',
    css: `/* 애니메이션 예제 */
@keyframes bounce {
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-30px);
  }
  60% {
    transform: translateY(-15px);
  }
}

.animated-box {
  width: 100px;
  height: 100px;
  background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
  border-radius: 50%;
  animation: bounce 2s infinite;
  margin: 2rem auto;
  cursor: pointer;
  transition: transform 0.3s ease;
}

.animated-box:hover {
  transform: scale(1.1);
}

.container {
  text-align: center;
  padding: 2rem;
  background: #f8f9fa;
  min-height: 300px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}`,
    html: `<div class="container">
  <div class="animated-box" id="bounceBox"></div>
  <h2>애니메이션 예제</h2>
  <p>박스를 클릭해보세요!</p>
</div>`,
    js: `// 박스 클릭 이벤트
document.getElementById('bounceBox').addEventListener('click', function() {
  this.style.animation = 'none';
  setTimeout(() => {
    this.style.animation = 'bounce 2s infinite';
  }, 10);
  console.log('박스가 클릭되었습니다!');
});`,
  },
  {
    id: 'grid',
    name: '그리드 레이아웃',
    css: `/* 그리드 레이아웃 */
.grid-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  padding: 2rem;
  background: #f0f2f5;
}

.grid-item {
  background: white;
  padding: 1.5rem;
  border-radius: 0.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease;
  cursor: pointer;
}

.grid-item:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}

.grid-item h3 {
  color: #333;
  margin-bottom: 0.5rem;
}

.grid-item p {
  color: #666;
  font-size: 0.9rem;
}

.grid-item.clicked {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.grid-item.clicked h3,
.grid-item.clicked p {
  color: white;
}`,
    html: `<div class="grid-container">
  <div class="grid-item" data-card="1">
    <h3>카드 1</h3>
    <p>첫 번째 그리드 아이템입니다.</p>
  </div>
  <div class="grid-item" data-card="2">
    <h3>카드 2</h3>
    <p>두 번째 그리드 아이템입니다.</p>
  </div>
  <div class="grid-item" data-card="3">
    <h3>카드 3</h3>
    <p>세 번째 그리드 아이템입니다.</p>
  </div>
  <div class="grid-item" data-card="4">
    <h3>카드 4</h3>
    <p>네 번째 그리드 아이템입니다.</p>
  </div>
</div>`,
    js: `// 그리드 아이템 클릭 이벤트
document.querySelectorAll('.grid-item').forEach(item => {
  item.addEventListener('click', function() {
    // 다른 아이템들의 clicked 클래스 제거
    document.querySelectorAll('.grid-item').forEach(otherItem => {
      if (otherItem !== this) {
        otherItem.classList.remove('clicked');
      }
    });
    
    // 현재 아이템에 clicked 클래스 토글
    this.classList.toggle('clicked');
    
    const cardNumber = this.getAttribute('data-card');
    console.log(\`카드 \${cardNumber}가 클릭되었습니다!\`);
  });
});`,
  },
  {
    id: 'javascript',
    name: 'JavaScript 연습',
    css: `/* JavaScript 연습용 스타일 */
body {
  font-family: Arial, sans-serif;
  padding: 20px;
  background: #f5f5f5;
}

.container {
  max-width: 600px;
  margin: 0 auto;
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

button {
  background: #007bff;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  margin: 5px;
}

button:hover {
  background: #0056b3;
}

.result {
  background: #f8f9fa;
  border: 1px solid #dee2e6;
  padding: 10px;
  margin: 10px 0;
  border-radius: 4px;
  font-family: monospace;
}`,
    html: `<div class="container">
  <h1>JavaScript 연습</h1>
  
  <div>
    <button onclick="calculateSum()">합계 계산</button>
    <button onclick="showDate()">현재 날짜</button>
    <button onclick="arrayExample()">배열 예제</button>
    <button onclick="promiseExample()">Promise 예제</button>
  </div>
  
  <div id="result" class="result">
    결과가 여기에 표시됩니다...
  </div>
</div>`,
    js: `// JavaScript 연습 예제들

function calculateSum() {
  const numbers = [1, 2, 3, 4, 5];
  const sum = numbers.reduce((acc, num) => acc + num, 0);
  console.log("합계:", sum);
  updateResult(\`합계: \${sum}\`);
}

function showDate() {
  const now = new Date();
  const dateString = now.toLocaleString('ko-KR');
  console.log("현재 날짜:", dateString);
  updateResult(\`현재 날짜: \${dateString}\`);
}

function arrayExample() {
  const fruits = ["사과", "바나나", "오렌지"];
  const upperFruits = fruits.map(fruit => fruit.toUpperCase());
  console.log("원본:", fruits);
  console.log("대문자 변환:", upperFruits);
  updateResult(\`대문자 변환: \${upperFruits.join(", ")}\`);
}

function promiseExample() {
  console.log("Promise 예제 시작...");
  
  new Promise((resolve) => {
    setTimeout(() => {
      resolve("비동기 작업 완료!");
    }, 1000);
  }).then(result => {
    console.log("Promise 결과:", result);
    updateResult(\`Promise 결과: \${result}\`);
  });
}

function updateResult(text) {
  document.getElementById('result').textContent = text;
}

// 초기 메시지
console.log("JavaScript 연습 템플릿이 로드되었습니다!");
updateResult("버튼을 클릭해서 JavaScript를 테스트해보세요!");`,
  },
  {
    id: 'responsive-cards',
    name: '반응형 카드 레이아웃',
    css: `/* 반응형 카드 레이아웃 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
  padding: 2rem 1rem;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
}

.header {
  text-align: center;
  margin-bottom: 3rem;
}

.header h1 {
  color: white;
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.header p {
  color: rgba(255, 255, 255, 0.8);
  font-size: 1.1rem;
}

.cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
}

.card {
  background: white;
  border-radius: 1rem;
  padding: 2rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #ff6b6b, #4ecdc4, #45b7d1, #96ceb4);
  transform: scaleX(0);
  transition: transform 0.3s ease;
}

.card:hover::before {
  transform: scaleX(1);
}

.card:hover {
  transform: translateY(-10px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
}

.card-icon {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: white;
}

.card-icon.blue { background: linear-gradient(135deg, #667eea, #764ba2); }
.card-icon.green { background: linear-gradient(135deg, #4ecdc4, #44a08d); }
.card-icon.orange { background: linear-gradient(135deg, #ff6b6b, #ee5a24); }
.card-icon.purple { background: linear-gradient(135deg, #a8edea, #fed6e3); color: #333; }

.card h3 {
  color: #333;
  font-size: 1.3rem;
  margin-bottom: 0.5rem;
}

.card p {
  color: #666;
  line-height: 1.6;
  margin-bottom: 1rem;
}

.card-button {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;
}

.card-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
}

@media (max-width: 768px) {
  .header h1 {
    font-size: 2rem;
  }
  
  .cards-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
  
  .card {
    padding: 1.5rem;
  }
}`,
    html: `<div class="container">
  <div class="header">
    <h1>반응형 카드 레이아웃</h1>
    <p>다양한 카드들을 클릭해보세요!</p>
  </div>
  
  <div class="cards-grid">
    <div class="card" data-card="1">
      <div class="card-icon blue">💡</div>
      <h3>아이디어</h3>
      <p>창의적인 아이디어와 혁신적인 솔루션을 제공합니다. 새로운 관점에서 문제를 바라보고 해결책을 찾아보세요.</p>
      <button class="card-button">더 알아보기</button>
    </div>
    
    <div class="card" data-card="2">
      <div class="card-icon green">🚀</div>
      <h3>성장</h3>
      <p>지속적인 성장과 발전을 위한 전략을 수립합니다. 목표를 달성하기 위한 체계적인 접근 방식을 제시합니다.</p>
      <button class="card-button">더 알아보기</button>
    </div>
    
    <div class="card" data-card="3">
      <div class="card-icon orange">⚡</div>
      <h3>속도</h3>
      <p>빠르고 효율적인 작업을 위한 최적화된 솔루션을 제공합니다. 시간을 절약하고 생산성을 높여보세요.</p>
      <button class="card-button">더 알아보기</button>
    </div>
    
    <div class="card" data-card="4">
      <div class="card-icon purple">🎯</div>
      <h3>목표</h3>
      <p>명확한 목표 설정과 달성을 위한 로드맵을 제공합니다. 성공으로 이어지는 구체적인 계획을 세워보세요.</p>
      <button class="card-button">더 알아보기</button>
    </div>
  </div>
</div>`,
    js: `// 카드 클릭 이벤트 처리
document.querySelectorAll('.card').forEach(card => {
  card.addEventListener('click', function() {
    const cardId = this.getAttribute('data-card');
    const cardTitle = this.querySelector('h3').textContent;
    
    // 카드 클릭 애니메이션
    this.style.transform = 'scale(0.95)';
    setTimeout(() => {
      this.style.transform = '';
    }, 150);
    
    console.log(\`카드 \${cardId}: \${cardTitle}가 클릭되었습니다!\`);
    
    // 클릭된 카드 하이라이트
    document.querySelectorAll('.card').forEach(otherCard => {
      otherCard.style.border = 'none';
    });
    this.style.border = '2px solid #667eea';
    
    // 3초 후 하이라이트 제거
    setTimeout(() => {
      this.style.border = 'none';
    }, 3000);
  });
});

// 버튼 클릭 이벤트
document.querySelectorAll('.card-button').forEach(button => {
  button.addEventListener('click', function(e) {
    e.stopPropagation(); // 카드 클릭 이벤트 방지
    
    const card = this.closest('.card');
    const cardTitle = card.querySelector('h3').textContent;
    
    // 버튼 클릭 효과
    this.style.transform = 'scale(0.9)';
    setTimeout(() => {
      this.style.transform = '';
    }, 100);
    
    console.log(\`\${cardTitle} 버튼이 클릭되었습니다!\`);
    
    // 임시 알림 표시
    const originalText = this.textContent;
    this.textContent = '클릭됨!';
    this.style.background = 'linear-gradient(135deg, #4ecdc4, #44a08d)';
    
    setTimeout(() => {
      this.textContent = originalText;
      this.style.background = 'linear-gradient(135deg, #667eea, #764ba2)';
    }, 1000);
  });
});

// 반응형 처리
function handleResize() {
  const cards = document.querySelectorAll('.card');
  const isMobile = window.innerWidth <= 768;
  
  cards.forEach(card => {
    if (isMobile) {
      card.style.marginBottom = '1rem';
    } else {
      card.style.marginBottom = '';
    }
  });
}

window.addEventListener('resize', handleResize);
handleResize(); // 초기 실행

console.log('반응형 카드 레이아웃이 로드되었습니다!');`,
  },
  {
    id: 'dark-mode',
    name: '다크모드 토글',
    css: `/* 다크모드 토글 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

:root {
  --bg-color: #ffffff;
  --text-color: #333333;
  --card-bg: #f8f9fa;
  --border-color: #e9ecef;
  --shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  --accent-color: #007bff;
  --accent-hover: #0056b3;
}

[data-theme="dark"] {
  --bg-color: #1a1a1a;
  --text-color: #ffffff;
  --card-bg: #2d2d2d;
  --border-color: #404040;
  --shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
  --accent-color: #0d6efd;
  --accent-hover: #0b5ed7;
}

body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background-color: var(--bg-color);
  color: var(--text-color);
  transition: all 0.3s ease;
  min-height: 100vh;
  padding: 2rem;
}

.container {
  max-width: 800px;
  margin: 0 auto;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 3rem;
  padding: 1rem 0;
  border-bottom: 2px solid var(--border-color);
}

.title {
  font-size: 2.5rem;
  font-weight: bold;
  background: linear-gradient(135deg, var(--accent-color), #6f42c1);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.theme-toggle {
  position: relative;
  width: 60px;
  height: 30px;
  background: var(--border-color);
  border-radius: 15px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: none;
  outline: none;
}

.theme-toggle::before {
  content: '';
  position: absolute;
  top: 3px;
  left: 3px;
  width: 24px;
  height: 24px;
  background: white;
  border-radius: 50%;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

[data-theme="dark"] .theme-toggle {
  background: var(--accent-color);
}

[data-theme="dark"] .theme-toggle::before {
  transform: translateX(30px);
  background: #1a1a1a;
}

.theme-icon {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  font-size: 14px;
  transition: all 0.3s ease;
}

.sun-icon {
  left: 8px;
  color: #ffc107;
}

.moon-icon {
  right: 8px;
  color: #6c757d;
}

[data-theme="dark"] .sun-icon {
  opacity: 0;
  transform: translateY(-50%) rotate(180deg);
}

[data-theme="dark"] .moon-icon {
  opacity: 1;
  color: white;
}

.content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
}

.card {
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: 1rem;
  padding: 2rem;
  box-shadow: var(--shadow);
  transition: all 0.3s ease;
}

.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.card h3 {
  color: var(--text-color);
  margin-bottom: 1rem;
  font-size: 1.3rem;
}

.card p {
  color: var(--text-color);
  opacity: 0.8;
  line-height: 1.6;
  margin-bottom: 1.5rem;
}

.button {
  background: var(--accent-color);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;
  margin-right: 0.5rem;
  margin-bottom: 0.5rem;
}

.button:hover {
  background: var(--accent-hover);
  transform: translateY(-2px);
}

.button.secondary {
  background: transparent;
  color: var(--accent-color);
  border: 2px solid var(--accent-color);
}

.button.secondary:hover {
  background: var(--accent-color);
  color: white;
}

.stats {
  display: flex;
  justify-content: space-around;
  margin-top: 2rem;
  padding: 1.5rem;
  background: var(--card-bg);
  border-radius: 1rem;
  border: 1px solid var(--border-color);
}

.stat-item {
  text-align: center;
}

.stat-number {
  font-size: 2rem;
  font-weight: bold;
  color: var(--accent-color);
  display: block;
}

.stat-label {
  color: var(--text-color);
  opacity: 0.7;
  font-size: 0.9rem;
  margin-top: 0.5rem;
}

@media (max-width: 768px) {
  .header {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }
  
  .title {
    font-size: 2rem;
  }
  
  .content {
    grid-template-columns: 1fr;
  }
  
  .stats {
    flex-direction: column;
    gap: 1rem;
  }
}`,
    html: `<div class="container">
  <div class="header">
    <h1 class="title">다크모드 토글</h1>
    <button class="theme-toggle" id="themeToggle" onclick="toggleTheme()">
      <span class="theme-icon sun-icon">☀️</span>
      <span class="theme-icon moon-icon">🌙</span>
    </button>
  </div>
  
  <div class="content">
    <div class="card">
      <h3>기능 소개</h3>
      <p>이 템플릿은 다크모드와 라이트모드를 쉽게 전환할 수 있는 기능을 제공합니다. CSS 변수를 사용하여 테마를 관리합니다.</p>
      <button class="button" onclick="buttonClick(this)">자세히 보기</button>
      <button class="button secondary" onclick="buttonClick(this)">더 알아보기</button>
    </div>
    
    <div class="card">
      <h3>사용법</h3>
      <p>우측 상단의 토글 버튼을 클릭하여 다크모드와 라이트모드를 전환할 수 있습니다. 모든 색상이 부드럽게 전환됩니다.</p>
      <button class="button" onclick="buttonClick(this)">시작하기</button>
      <button class="button secondary" onclick="buttonClick(this)">문서 보기</button>
    </div>
    
    <div class="card">
      <h3>특징</h3>
      <p>CSS 변수와 data 속성을 활용한 효율적인 테마 관리, 부드러운 전환 애니메이션, 접근성을 고려한 디자인을 제공합니다.</p>
      <button class="button" onclick="buttonClick(this)">특징 보기</button>
      <button class="button secondary" onclick="buttonClick(this)">예제 보기</button>
    </div>
  </div>
  
  <div class="stats">
    <div class="stat-item">
      <span class="stat-number" id="themeCount">0</span>
      <div class="stat-label">테마 전환 횟수</div>
    </div>
    <div class="stat-item">
      <span class="stat-number" id="currentTheme">라이트</span>
      <div class="stat-label">현재 테마</div>
    </div>
    <div class="stat-item">
      <span class="stat-number" id="lastSwitch">-</span>
      <div class="stat-label">마지막 전환</div>
    </div>
  </div>
</div>`,
    js: `// 다크모드 토글 기능
let switchCount = 0;
let currentTheme = 'light';

// 전역 함수 정의
window.toggleTheme = function() {
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  setTheme(newTheme);
};

window.buttonClick = function(button) {
  button.style.transform = 'scale(0.95)';
  setTimeout(() => {
    button.style.transform = '';
  }, 150);
  
  const originalText = button.textContent;
  button.textContent = '클릭됨!';
  
  setTimeout(() => {
    button.textContent = originalText;
  }, 1000);
};

function setTheme(theme) {
  const html = document.documentElement;
  const body = document.body;
  
  // 테마 전환 횟수 증가 (초기화가 아닌 경우에만)
  if (currentTheme !== theme) {
    switchCount++;
  }
  
  if (theme === 'dark') {
    html.setAttribute('data-theme', 'dark');
    body.style.backgroundColor = '#1a1a1a';
    body.style.color = '#ffffff';
    
    // 모든 카드 배경색 변경
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
      card.style.backgroundColor = '#2d2d2d';
      card.style.color = '#ffffff';
    });
    
    // 모든 텍스트 색상 변경
    const texts = document.querySelectorAll('h1, h3, p, .stat-label');
    texts.forEach(text => {
      text.style.color = '#ffffff';
    });
    
    // 통계 숫자 색상 변경
    const statNumbers = document.querySelectorAll('.stat-number');
    statNumbers.forEach(stat => {
      stat.style.color = '#0d6efd';
    });
  } else {
    html.setAttribute('data-theme', 'light');
    body.style.backgroundColor = '#ffffff';
    body.style.color = '#333333';
    
    // 모든 카드 배경색 변경
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
      card.style.backgroundColor = '#f8f9fa';
      card.style.color = '#333333';
    });
    
    // 모든 텍스트 색상 변경
    const texts = document.querySelectorAll('h1, h3, p, .stat-label');
    texts.forEach(text => {
      text.style.color = '#333333';
    });
    
    // 통계 숫자 색상 변경
    const statNumbers = document.querySelectorAll('.stat-number');
    statNumbers.forEach(stat => {
      stat.style.color = '#007bff';
    });
  }
  
  currentTheme = theme;
  
  // 통계 업데이트
  updateStats();
}

function updateStats() {
  const themeCount = document.getElementById('themeCount');
  const currentThemeDisplay = document.getElementById('currentTheme');
  const lastSwitchDisplay = document.getElementById('lastSwitch');
  
  if (themeCount) {
    themeCount.textContent = switchCount;
  }
  
  if (currentThemeDisplay) {
    currentThemeDisplay.textContent = currentTheme === 'dark' ? '다크' : '라이트';
  }
  
  if (lastSwitchDisplay) {
    const now = new Date();
    const timeString = now.toLocaleTimeString('ko-KR', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZone: 'Asia/Seoul'
    });
    lastSwitchDisplay.textContent = timeString;
  }
}

// 초기화
setTimeout(function() {
  setTheme('light');
}, 100);`,
  },
  {
    id: 'form-validation',
    name: '폼 검증',
    css: `/* 폼 검증 스타일 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
  padding: 2rem 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.container {
  background: white;
  border-radius: 1rem;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  padding: 3rem;
  width: 100%;
  max-width: 500px;
  position: relative;
  overflow: hidden;
}

.container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #667eea, #764ba2, #f093fb, #f5576c);
}

.header {
  text-align: center;
  margin-bottom: 2rem;
}

.header h1 {
  color: #333;
  font-size: 2rem;
  margin-bottom: 0.5rem;
}

.header p {
  color: #666;
  font-size: 0.9rem;
}

.form-group {
  margin-bottom: 1.5rem;
  position: relative;
}

.form-group label {
  display: block;
  color: #333;
  font-weight: 500;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 2px solid #e1e5e9;
  border-radius: 0.5rem;
  font-size: 1rem;
  transition: all 0.3s ease;
  background: #f8f9fa;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #667eea;
  background: white;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.form-group input.valid {
  border-color: #28a745;
  background: #f8fff9;
}

.form-group input.invalid {
  border-color: #dc3545;
  background: #fff8f8;
}

.error-message {
  color: #dc3545;
  font-size: 0.8rem;
  margin-top: 0.25rem;
  display: none;
  animation: slideDown 0.3s ease;
}

.error-message.show {
  display: block;
}

.success-message {
  color: #28a745;
  font-size: 0.8rem;
  margin-top: 0.25rem;
  display: none;
  animation: slideDown 0.3s ease;
}

.success-message.show {
  display: block;
}

.password-strength {
  margin-top: 0.5rem;
  height: 4px;
  background: #e1e5e9;
  border-radius: 2px;
  overflow: hidden;
}

.strength-bar {
  height: 100%;
  width: 0%;
  transition: all 0.3s ease;
  border-radius: 2px;
}

.strength-weak { background: #dc3545; }
.strength-medium { background: #ffc107; }
.strength-strong { background: #28a745; }

.strength-text {
  font-size: 0.8rem;
  margin-top: 0.25rem;
  color: #666;
}

.submit-btn {
  width: 100%;
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  border: none;
  padding: 1rem;
  border-radius: 0.5rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.submit-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(102, 126, 234, 0.3);
}

.submit-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.submit-btn.loading {
  color: transparent;
}

.submit-btn.loading::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 20px;
  height: 20px;
  border: 2px solid transparent;
  border-top: 2px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.form-summary {
  margin-top: 1.5rem;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 0.5rem;
  border-left: 4px solid #667eea;
  display: none;
}

.form-summary.show {
  display: block;
  animation: slideDown 0.3s ease;
}

.form-summary h3 {
  color: #333;
  font-size: 1rem;
  margin-bottom: 0.5rem;
}

.form-summary p {
  color: #666;
  font-size: 0.9rem;
  margin-bottom: 0.25rem;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes spin {
  0% { transform: translate(-50%, -50%) rotate(0deg); }
  100% { transform: translate(-50%, -50%) rotate(360deg); }
}

@media (max-width: 600px) {
  .container {
    padding: 2rem 1.5rem;
    margin: 1rem;
  }
  
  .header h1 {
    font-size: 1.5rem;
  }
}`,
    html: `<div class="container">
  <div class="header">
    <h1>회원가입</h1>
    <p>정보를 입력하고 가입을 완료하세요</p>
  </div>
  
  <form id="signupForm" novalidate>
    <div class="form-group">
      <label for="name">이름 *</label>
      <input type="text" id="name" name="name" required>
      <div class="error-message" id="nameError">이름을 입력해주세요.</div>
      <div class="success-message" id="nameSuccess">✓ 올바른 이름입니다.</div>
    </div>
    
    <div class="form-group">
      <label for="email">이메일 *</label>
      <input type="email" id="email" name="email" required>
      <div class="error-message" id="emailError">올바른 이메일 형식을 입력해주세요.</div>
      <div class="success-message" id="emailSuccess">✓ 올바른 이메일입니다.</div>
    </div>
    
    <div class="form-group">
      <label for="phone">전화번호</label>
      <input type="tel" id="phone" name="phone" placeholder="010-1234-5678">
      <div class="error-message" id="phoneError">올바른 전화번호 형식을 입력해주세요.</div>
      <div class="success-message" id="phoneSuccess">✓ 올바른 전화번호입니다.</div>
    </div>
    
    <div class="form-group">
      <label for="password">비밀번호 *</label>
      <input type="password" id="password" name="password" required>
      <div class="password-strength">
        <div class="strength-bar" id="strengthBar"></div>
      </div>
      <div class="strength-text" id="strengthText">비밀번호를 입력하세요</div>
      <div class="error-message" id="passwordError">비밀번호는 8자 이상이어야 합니다.</div>
      <div class="success-message" id="passwordSuccess">✓ 안전한 비밀번호입니다.</div>
    </div>
    
    <div class="form-group">
      <label for="confirmPassword">비밀번호 확인 *</label>
      <input type="password" id="confirmPassword" name="confirmPassword" required>
      <div class="error-message" id="confirmPasswordError">비밀번호가 일치하지 않습니다.</div>
      <div class="success-message" id="confirmPasswordSuccess">✓ 비밀번호가 일치합니다.</div>
    </div>
    
    <div class="form-group">
      <label for="age">나이</label>
      <select id="age" name="age">
        <option value="">나이를 선택하세요</option>
        <option value="10-19">10-19세</option>
        <option value="20-29">20-29세</option>
        <option value="30-39">30-39세</option>
        <option value="40-49">40-49세</option>
        <option value="50+">50세 이상</option>
      </select>
    </div>
    
    <div class="form-group">
      <label for="bio">자기소개</label>
      <textarea id="bio" name="bio" rows="3" placeholder="간단한 자기소개를 작성해주세요..."></textarea>
    </div>
    
    <button type="submit" class="submit-btn" id="submitBtn">
      회원가입
    </button>
  </form>
  
  <div class="form-summary" id="formSummary">
    <h3>입력된 정보</h3>
    <div id="summaryContent"></div>
  </div>
</div>`,
    js: `// 폼 검증 클래스
class FormValidator {
  constructor() {
    this.form = document.getElementById('signupForm');
    this.submitBtn = document.getElementById('submitBtn');
    this.formSummary = document.getElementById('formSummary');
    this.summaryContent = document.getElementById('summaryContent');
    
    this.validationRules = {
      name: {
        required: true,
        minLength: 2,
        pattern: /^[가-힣a-zA-Z\\s]+$/,
        message: '이름은 2자 이상의 한글 또는 영문이어야 합니다.'
      },
      email: {
        required: true,
        pattern: /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/,
        message: '올바른 이메일 형식을 입력해주세요.'
      },
      phone: {
        required: false,
        pattern: /^010-\\d{4}-\\d{4}$/,
        message: '010-1234-5678 형식으로 입력해주세요.'
      },
      password: {
        required: true,
        minLength: 8,
        message: '비밀번호는 8자 이상이어야 합니다.'
      },
      confirmPassword: {
        required: true,
        match: 'password',
        message: '비밀번호가 일치하지 않습니다.'
      }
    };
    
    this.init();
  }
  
  init() {
    // 실시간 검증 이벤트 리스너
    Object.keys(this.validationRules).forEach(fieldName => {
      const field = document.getElementById(fieldName);
      if (field) {
        field.addEventListener('input', () => this.validateField(fieldName));
        field.addEventListener('blur', () => this.validateField(fieldName));
      }
    });
    
    // 비밀번호 확인 필드
    const confirmPassword = document.getElementById('confirmPassword');
    if (confirmPassword) {
      confirmPassword.addEventListener('input', () => this.validateField('confirmPassword'));
    }
    
    // 폼 제출 이벤트
    this.form.addEventListener('submit', (e) => this.handleSubmit(e));
    
    console.log('폼 검증이 초기화되었습니다!');
  }
  
  validateField(fieldName) {
    const field = document.getElementById(fieldName);
    const rules = this.validationRules[fieldName];
    const value = field.value.trim();
    
    if (!rules) return true;
    
    // 필수 필드 검증
    if (rules.required && !value) {
      this.showError(fieldName, rules.message);
      return false;
    }
    
    // 선택 필드가 비어있으면 통과
    if (!rules.required && !value) {
      this.showSuccess(fieldName);
      return true;
    }
    
    // 최소 길이 검증
    if (rules.minLength && value.length < rules.minLength) {
      this.showError(fieldName, rules.message);
      return false;
    }
    
    // 패턴 검증
    if (rules.pattern && !rules.pattern.test(value)) {
      this.showError(fieldName, rules.message);
      return false;
    }
    
    // 비밀번호 확인 검증
    if (rules.match) {
      const matchField = document.getElementById(rules.match);
      if (matchField && value !== matchField.value) {
        this.showError(fieldName, rules.message);
        return false;
      }
    }
    
    this.showSuccess(fieldName);
    return true;
  }
  
  showError(fieldName, message) {
    const field = document.getElementById(fieldName);
    const errorElement = document.getElementById(fieldName + 'Error');
    const successElement = document.getElementById(fieldName + 'Success');
    
    field.classList.remove('valid');
    field.classList.add('invalid');
    
    if (errorElement) {
      errorElement.textContent = message;
      errorElement.classList.add('show');
    }
    
    if (successElement) {
      successElement.classList.remove('show');
    }
  }
  
  showSuccess(fieldName) {
    const field = document.getElementById(fieldName);
    const errorElement = document.getElementById(fieldName + 'Error');
    const successElement = document.getElementById(fieldName + 'Success');
    
    field.classList.remove('invalid');
    field.classList.add('valid');
    
    if (errorElement) {
      errorElement.classList.remove('show');
    }
    
    if (successElement) {
      successElement.classList.add('show');
    }
  }
  
  validatePasswordStrength(password) {
    let strength = 0;
    let strengthText = '';
    
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    
    const strengthBar = document.getElementById('strengthBar');
    const strengthTextElement = document.getElementById('strengthText');
    
    if (strength <= 2) {
      strengthBar.className = 'strength-bar strength-weak';
      strengthText = '약함';
    } else if (strength <= 3) {
      strengthBar.className = 'strength-bar strength-medium';
      strengthText = '보통';
    } else {
      strengthBar.className = 'strength-bar strength-strong';
      strengthText = '강함';
    }
    
    strengthBar.style.width = (strength * 20) + '%';
    strengthTextElement.textContent = \`비밀번호 강도: \${strengthText}\`;
  }
  
  validateAllFields() {
    let isValid = true;
    
    Object.keys(this.validationRules).forEach(fieldName => {
      if (!this.validateField(fieldName)) {
        isValid = false;
      }
    });
    
    return isValid;
  }
  
  handleSubmit(e) {
    e.preventDefault();
    
    if (!this.validateAllFields()) {
      console.log('폼 검증 실패');
      return;
    }
    
    // 제출 버튼 로딩 상태
    this.submitBtn.classList.add('loading');
    this.submitBtn.disabled = true;
    
    // 실제 제출 시뮬레이션
    setTimeout(() => {
      this.submitBtn.classList.remove('loading');
      this.submitBtn.disabled = false;
      this.showFormSummary();
      console.log('폼이 성공적으로 제출되었습니다!');
    }, 2000);
  }
  
  showFormSummary() {
    const formData = new FormData(this.form);
    let summaryHTML = '';
    
    for (let [key, value] of formData.entries()) {
      if (value.trim()) {
        const label = document.querySelector(\`label[for="\${key}"]\`).textContent;
        summaryHTML += \`<p><strong>\${label}:</strong> \${value}</p>\`;
      }
    }
    
    this.summaryContent.innerHTML = summaryHTML;
    this.formSummary.classList.add('show');
    
    // 폼 초기화
    this.form.reset();
    document.querySelectorAll('.error-message, .success-message').forEach(msg => {
      msg.classList.remove('show');
    });
    document.querySelectorAll('input, select, textarea').forEach(field => {
      field.classList.remove('valid', 'invalid');
    });
  }
}

// 비밀번호 강도 검사
document.getElementById('password').addEventListener('input', function() {
  const validator = window.formValidator;
  if (validator) {
    validator.validatePasswordStrength(this.value);
  }
});

// 페이지 로드 시 폼 검증기 초기화
document.addEventListener('DOMContentLoaded', () => {
  window.formValidator = new FormValidator();
});`,
  },
  {
    id: 'typing-animation',
    name: '타이핑 애니메이션',
    css: `/* 타이핑 애니메이션 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Courier New', monospace;
  background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  overflow: hidden;
}

.container {
  text-align: center;
  max-width: 800px;
  padding: 2rem;
}

.terminal {
  background: rgba(0, 0, 0, 0.8);
  border-radius: 1rem;
  padding: 2rem;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  border: 1px solid #333;
  position: relative;
  overflow: hidden;
}

.terminal::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 30px;
  background: #333;
  border-radius: 1rem 1rem 0 0;
}

.terminal::after {
  content: '● ● ●';
  position: absolute;
  top: 8px;
  left: 15px;
  color: #ff5f56;
  font-size: 12px;
  letter-spacing: 5px;
}

.typing-text {
  font-size: 1.5rem;
  line-height: 1.6;
  margin-bottom: 2rem;
  min-height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.cursor {
  display: inline-block;
  width: 2px;
  height: 1.5rem;
  background: #00ff00;
  margin-left: 2px;
  animation: blink 1s infinite;
}

.cursor.typing {
  animation: none;
}

@keyframes blink {
  0%, 50% { opacity: 1; }
  51%, 100% { opacity: 0; }
}

.controls {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
}

.control-btn {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  font-family: inherit;
  font-size: 0.9rem;
}

.control-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-2px);
}

.control-btn.active {
  background: #00ff00;
  color: #000;
  border-color: #00ff00;
}

.speed-control {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.speed-control label {
  font-size: 0.9rem;
  opacity: 0.8;
}

.speed-slider {
  width: 150px;
  height: 4px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 2px;
  outline: none;
  cursor: pointer;
}

.speed-slider::-webkit-slider-thumb {
  appearance: none;
  width: 16px;
  height: 16px;
  background: #00ff00;
  border-radius: 50%;
  cursor: pointer;
}

.speed-slider::-moz-range-thumb {
  width: 16px;
  height: 16px;
  background: #00ff00;
  border-radius: 50%;
  cursor: pointer;
  border: none;
}

.stats {
  display: flex;
  justify-content: space-around;
  margin-top: 2rem;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 0.5rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.stat-item {
  text-align: center;
}

.stat-number {
  font-size: 1.5rem;
  font-weight: bold;
  color: #00ff00;
  display: block;
}

.stat-label {
  font-size: 0.8rem;
  opacity: 0.7;
  margin-top: 0.25rem;
}

.code-snippet {
  background: rgba(0, 0, 0, 0.5);
  border: 1px solid #333;
  border-radius: 0.5rem;
  padding: 1rem;
  margin: 1rem 0;
  font-family: 'Courier New', monospace;
  font-size: 0.9rem;
  text-align: left;
  overflow-x: auto;
}

.code-snippet .line {
  margin-bottom: 0.5rem;
}

.code-snippet .keyword { color: #ff6b6b; }
.code-snippet .string { color: #4ecdc4; }
.code-snippet .comment { color: #666; }
.code-snippet .number { color: #feca57; }

@media (max-width: 768px) {
  .container {
    padding: 1rem;
  }
  
  .terminal {
    padding: 1.5rem;
  }
  
  .typing-text {
    font-size: 1.2rem;
    min-height: 100px;
  }
  
  .controls {
    flex-direction: column;
    align-items: center;
  }
  
  .stats {
    flex-direction: column;
    gap: 1rem;
  }
}`,
    html: `<div class="container">
  <div class="terminal">
    <div class="typing-text" id="typingText">
      <span id="textContent"></span>
      <span class="cursor" id="cursor"></span>
    </div>
    
    <div class="speed-control">
      <label for="speedSlider">속도:</label>
      <input type="range" id="speedSlider" class="speed-slider" min="50" max="500" value="150">
      <span id="speedValue">150ms</span>
    </div>
    
    <div class="controls">
      <button class="control-btn" id="startBtn">시작</button>
      <button class="control-btn" id="pauseBtn">일시정지</button>
      <button class="control-btn" id="resetBtn">리셋</button>
      <button class="control-btn" id="changeTextBtn">텍스트 변경</button>
    </div>
    
    <div class="code-snippet" id="codeSnippet" style="display: none;">
      <div class="line"><span class="keyword">function</span> <span class="string">typingAnimation</span>() {</div>
      <div class="line">  <span class="keyword">const</span> text = <span class="string">"Hello, World!"</span>;</div>
      <div class="line">  <span class="keyword">let</span> index = <span class="number">0</span>;</div>
      <div class="line">  </div>
      <div class="line">  <span class="keyword">const</span> timer = <span class="keyword">setInterval</span>(() => {</div>
      <div class="line">    <span class="keyword">if</span> (index < text.length) {</div>
      <div class="line">      element.textContent += text[index];</div>
      <div class="line">      index++;</div>
      <div class="line">    } <span class="keyword">else</span> {</div>
      <div class="line">      <span class="keyword">clearInterval</span>(timer);</div>
      <div class="line">    }</div>
      <div class="line">  }, <span class="number">100</span>);</div>
      <div class="line">}</div>
    </div>
    
    <div class="stats">
      <div class="stat-item">
        <span class="stat-number" id="charCount">0</span>
        <div class="stat-label">글자 수</div>
      </div>
      <div class="stat-item">
        <span class="stat-number" id="wordCount">0</span>
        <div class="stat-label">단어 수</div>
      </div>
      <div class="stat-item">
        <span class="stat-number" id="timeElapsed">0s</span>
        <div class="stat-label">경과 시간</div>
      </div>
    </div>
  </div>
</div>`,
    js: `// 타이핑 애니메이션 클래스
class TypingAnimation {
  constructor() {
    this.texts = [
      "안녕하세요! 타이핑 애니메이션입니다.",
      "JavaScript로 만든 인터랙티브한 타이핑 효과를 경험해보세요.",
      "속도를 조절하고, 일시정지하고, 리셋할 수 있습니다.",
      "실시간으로 글자 수와 단어 수를 확인할 수 있어요!",
      "코딩은 창의적인 표현의 한 방법입니다. 🚀",
      "const message = 'Hello, World!';",
      "function createMagic() { return '✨'; }",
      "프로그래밍은 문제를 해결하는 예술입니다."
    ];
    
    this.currentTextIndex = 0;
    this.currentText = this.texts[0];
    this.currentCharIndex = 0;
    this.isTyping = false;
    this.isPaused = false;
    this.speed = 150;
    this.startTime = null;
    this.intervalId = null;
    
    this.textContent = document.getElementById('textContent');
    this.cursor = document.getElementById('cursor');
    this.speedSlider = document.getElementById('speedSlider');
    this.speedValue = document.getElementById('speedValue');
    this.startBtn = document.getElementById('startBtn');
    this.pauseBtn = document.getElementById('pauseBtn');
    this.resetBtn = document.getElementById('resetBtn');
    this.changeTextBtn = document.getElementById('changeTextBtn');
    this.codeSnippet = document.getElementById('codeSnippet');
    this.charCount = document.getElementById('charCount');
    this.wordCount = document.getElementById('wordCount');
    this.timeElapsed = document.getElementById('timeElapsed');
    
    this.init();
  }
  
  init() {
    // 이벤트 리스너 설정
    this.startBtn.addEventListener('click', () => this.start());
    this.pauseBtn.addEventListener('click', () => this.pause());
    this.resetBtn.addEventListener('click', () => this.reset());
    this.changeTextBtn.addEventListener('click', () => this.changeText());
    this.speedSlider.addEventListener('input', (e) => this.setSpeed(e.target.value));
    
    // 키보드 단축키
    document.addEventListener('keydown', (e) => {
      if (e.code === 'Space') {
        e.preventDefault();
        if (this.isTyping) {
          this.pause();
        } else {
          this.start();
        }
      } else if (e.code === 'KeyR') {
        this.reset();
      } else if (e.code === 'KeyC') {
        this.changeText();
      }
    });
    
    // 초기 상태 설정
    this.updateStats();
    this.updateSpeedDisplay();
    
    console.log('타이핑 애니메이션이 초기화되었습니다!');
    console.log('단축키: Space(시작/일시정지), R(리셋), C(텍스트 변경)');
  }
  
  start() {
    if (this.isTyping && !this.isPaused) return;
    
    if (this.isPaused) {
      this.isPaused = false;
      this.continueTyping();
    } else {
      this.isTyping = true;
      this.startTime = Date.now();
      this.currentCharIndex = 0;
      this.textContent.textContent = '';
      this.cursor.classList.add('typing');
      this.continueTyping();
    }
    
    this.updateButtonStates();
    console.log('타이핑 시작!');
  }
  
  continueTyping() {
    this.intervalId = setInterval(() => {
      if (this.currentCharIndex < this.currentText.length) {
        this.textContent.textContent += this.currentText[this.currentCharIndex];
        this.currentCharIndex++;
        this.updateStats();
      } else {
        this.finishTyping();
      }
    }, this.speed);
  }
  
  pause() {
    if (!this.isTyping) return;
    
    this.isPaused = true;
    clearInterval(this.intervalId);
    this.cursor.classList.remove('typing');
    this.updateButtonStates();
    console.log('타이핑 일시정지');
  }
  
  reset() {
    this.isTyping = false;
    this.isPaused = false;
    clearInterval(this.intervalId);
    this.currentCharIndex = 0;
    this.textContent.textContent = '';
    this.cursor.classList.remove('typing');
    this.startTime = null;
    this.updateStats();
    this.updateButtonStates();
    console.log('타이핑 리셋');
  }
  
  changeText() {
    this.currentTextIndex = (this.currentTextIndex + 1) % this.texts.length;
    this.currentText = this.texts[this.currentTextIndex];
    this.reset();
    console.log(\`텍스트 변경: \${this.currentText}\`);
  }
  
  finishTyping() {
    this.isTyping = false;
    this.isPaused = false;
    clearInterval(this.intervalId);
    this.cursor.classList.remove('typing');
    this.updateButtonStates();
    console.log('타이핑 완료!');
  }
  
  setSpeed(value) {
    this.speed = parseInt(value);
    this.updateSpeedDisplay();
    
    // 타이핑 중이면 속도 업데이트
    if (this.isTyping && !this.isPaused) {
      clearInterval(this.intervalId);
      this.continueTyping();
    }
  }
  
  updateSpeedDisplay() {
    this.speedValue.textContent = \`\${this.speed}ms\`;
  }
  
  updateButtonStates() {
    this.startBtn.textContent = this.isPaused ? '계속' : '시작';
    this.startBtn.classList.toggle('active', this.isTyping && !this.isPaused);
    this.pauseBtn.classList.toggle('active', this.isPaused);
    this.resetBtn.disabled = !this.isTyping && !this.isPaused;
  }
  
  updateStats() {
    const currentText = this.textContent.textContent;
    const charCount = currentText.length;
    const wordCount = currentText.trim().split(/\\s+/).filter(word => word.length > 0).length;
    
    this.charCount.textContent = charCount;
    this.wordCount.textContent = wordCount;
    
    if (this.startTime) {
      const elapsed = Math.floor((Date.now() - this.startTime) / 1000);
      this.timeElapsed.textContent = \`\${elapsed}s\`;
    }
  }
  
  showCodeSnippet() {
    this.codeSnippet.style.display = 'block';
    setTimeout(() => {
      this.codeSnippet.style.display = 'none';
    }, 5000);
  }
}

// 페이지 로드 시 타이핑 애니메이션 초기화
document.addEventListener('DOMContentLoaded', () => {
  window.typingAnimation = new TypingAnimation();
  
  // 자동으로 코드 스니펫 표시
  setTimeout(() => {
    window.typingAnimation.showCodeSnippet();
  }, 3000);
});`,
  },
  {
    id: 'modal-popup',
    name: '모달 팝업',
    css: `/* 모달 팝업 스타일 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
  padding: 2rem;
  position: relative;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  text-align: center;
}

.header {
  margin-bottom: 3rem;
}

.header h1 {
  color: white;
  font-size: 2.5rem;
  margin-bottom: 1rem;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.header p {
  color: rgba(255, 255, 255, 0.8);
  font-size: 1.1rem;
}

.buttons-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
}

.modal-btn {
  background: rgba(255, 255, 255, 0.1);
  border: 2px solid rgba(255, 255, 255, 0.3);
  color: white;
  padding: 1.5rem 2rem;
  border-radius: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 1.1rem;
  font-weight: 500;
  backdrop-filter: blur(10px);
  position: relative;
  overflow: hidden;
}

.modal-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s ease;
}

.modal-btn:hover::before {
  left: 100%;
}

.modal-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-5px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
}

.modal-btn.primary {
  background: linear-gradient(135deg, #ff6b6b, #ee5a24);
  border-color: #ff6b6b;
}

.modal-btn.success {
  background: linear-gradient(135deg, #4ecdc4, #44a08d);
  border-color: #4ecdc4;
}

.modal-btn.warning {
  background: linear-gradient(135deg, #feca57, #ff9ff3);
  border-color: #feca57;
  color: #333;
}

.modal-btn.info {
  background: linear-gradient(135deg, #48cae4, #0077b6);
  border-color: #48cae4;
}

/* 모달 오버레이 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s ease;
  backdrop-filter: blur(5px);
}

.modal-overlay.show {
  opacity: 1;
  visibility: visible;
}

/* 모달 컨테이너 */
.modal {
  background: white;
  border-radius: 1rem;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  max-width: 500px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
  transform: scale(0.7) translateY(50px);
  transition: all 0.3s ease;
  position: relative;
}

.modal-overlay.show .modal {
  transform: scale(1) translateY(0);
}

.modal-header {
  padding: 2rem 2rem 1rem;
  border-bottom: 1px solid #e9ecef;
  position: relative;
}

.modal-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.modal-close {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #666;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.modal-close:hover {
  background: #f8f9fa;
  color: #333;
}

.modal-body {
  padding: 1rem 2rem;
}

.modal-body p {
  color: #666;
  line-height: 1.6;
  margin-bottom: 1rem;
}

.modal-footer {
  padding: 1rem 2rem 2rem;
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
}

.modal-btn-footer {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;
}

.modal-btn-footer.primary {
  background: #007bff;
  color: white;
}

.modal-btn-footer.primary:hover {
  background: #0056b3;
}

.modal-btn-footer.secondary {
  background: #6c757d;
  color: white;
}

.modal-btn-footer.secondary:hover {
  background: #545b62;
}

.modal-btn-footer.danger {
  background: #dc3545;
  color: white;
}

.modal-btn-footer.danger:hover {
  background: #c82333;
}

/* 특별한 모달 스타일 */
.modal.confirmation .modal-header {
  background: linear-gradient(135deg, #ff6b6b, #ee5a24);
  color: white;
  border-radius: 1rem 1rem 0 0;
  border-bottom: none;
}

.modal.confirmation .modal-title {
  color: white;
}

.modal.confirmation .modal-close {
  color: white;
}

.modal.confirmation .modal-close:hover {
  background: rgba(255, 255, 255, 0.2);
  color: white;
}

.modal.success .modal-header {
  background: linear-gradient(135deg, #4ecdc4, #44a08d);
  color: white;
  border-radius: 1rem 1rem 0 0;
  border-bottom: none;
}

.modal.success .modal-title {
  color: white;
}

.modal.success .modal-close {
  color: white;
}

.modal.success .modal-close:hover {
  background: rgba(255, 255, 255, 0.2);
  color: white;
}

/* 폼 모달 */
.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: #333;
  font-weight: 500;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #e9ecef;
  border-radius: 0.5rem;
  font-size: 1rem;
  transition: border-color 0.3s ease;
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #007bff;
}

/* 애니메이션 */
@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-50px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.modal.show {
  animation: slideIn 0.3s ease;
}

@media (max-width: 768px) {
  .container {
    padding: 1rem;
  }
  
  .header h1 {
    font-size: 2rem;
  }
  
  .buttons-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  .modal {
    width: 95%;
    margin: 1rem;
  }
  
  .modal-header,
  .modal-body,
  .modal-footer {
    padding-left: 1.5rem;
    padding-right: 1.5rem;
  }
  
  .modal-footer {
    flex-direction: column;
  }
}`,
    html: `<div class="container">
  <div class="header">
    <h1>모달 팝업 데모</h1>
    <p>다양한 모달 팝업을 경험해보세요</p>
  </div>
  
  <div class="buttons-grid">
    <button class="modal-btn primary" data-modal="basic">
      기본 모달
    </button>
    <button class="modal-btn success" data-modal="confirmation">
      확인 모달
    </button>
    <button class="modal-btn warning" data-modal="form">
      폼 모달
    </button>
    <button class="modal-btn info" data-modal="success">
      성공 모달
    </button>
  </div>
</div>

<!-- 기본 모달 -->
<div class="modal-overlay" id="basicModal">
  <div class="modal">
    <div class="modal-header">
      <h3 class="modal-title">기본 모달</h3>
      <button class="modal-close">&times;</button>
    </div>
    <div class="modal-body">
      <p>이것은 기본 모달 팝업입니다. 모달은 사용자의 주의를 끌고 중요한 정보를 표시하는 데 사용됩니다.</p>
      <p>모달을 닫으려면 X 버튼을 클릭하거나 배경을 클릭하세요.</p>
    </div>
    <div class="modal-footer">
      <button class="modal-btn-footer secondary modal-close">취소</button>
      <button class="modal-btn-footer primary">확인</button>
    </div>
  </div>
</div>

<!-- 확인 모달 -->
<div class="modal-overlay" id="confirmationModal">
  <div class="modal confirmation">
    <div class="modal-header">
      <h3 class="modal-title">⚠️ 확인이 필요합니다</h3>
      <button class="modal-close">&times;</button>
    </div>
    <div class="modal-body">
      <p>정말로 이 작업을 수행하시겠습니까?</p>
      <p>이 작업은 되돌릴 수 없습니다.</p>
    </div>
    <div class="modal-footer">
      <button class="modal-btn-footer secondary modal-close">취소</button>
      <button class="modal-btn-footer danger">삭제</button>
    </div>
  </div>
</div>

<!-- 폼 모달 -->
<div class="modal-overlay" id="formModal">
  <div class="modal">
    <div class="modal-header">
      <h3 class="modal-title">정보 입력</h3>
      <button class="modal-close">&times;</button>
    </div>
    <div class="modal-body">
      <form id="modalForm">
        <div class="form-group">
          <label for="name">이름</label>
          <input type="text" id="name" name="name" required>
        </div>
        <div class="form-group">
          <label for="email">이메일</label>
          <input type="email" id="email" name="email" required>
        </div>
        <div class="form-group">
          <label for="message">메시지</label>
          <textarea id="message" name="message" rows="3"></textarea>
        </div>
      </form>
    </div>
    <div class="modal-footer">
      <button class="modal-btn-footer secondary modal-close">취소</button>
      <button class="modal-btn-footer primary" id="submitForm">제출</button>
    </div>
  </div>
</div>

<!-- 성공 모달 -->
<div class="modal-overlay" id="successModal">
  <div class="modal success">
    <div class="modal-header">
      <h3 class="modal-title">✅ 성공!</h3>
      <button class="modal-close">&times;</button>
    </div>
    <div class="modal-body">
      <p>작업이 성공적으로 완료되었습니다!</p>
      <p>모든 데이터가 정상적으로 저장되었습니다.</p>
    </div>
    <div class="modal-footer">
      <button class="modal-btn-footer primary modal-close">확인</button>
    </div>
  </div>
</div>`,
    js: `// 모달 관리 클래스
class ModalManager {
  constructor() {
    this.modals = {};
    this.init();
  }
  
  init() {
    // 모든 모달 요소 수집
    const modalElements = document.querySelectorAll('.modal-overlay');
    modalElements.forEach(modal => {
      const modalId = modal.id;
      this.modals[modalId] = modal;
    });
    
    // 모달 열기 버튼 이벤트
    document.querySelectorAll('[data-modal]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const modalType = e.target.getAttribute('data-modal');
        this.openModal(modalType);
      });
    });
    
    // 모달 닫기 이벤트
    document.querySelectorAll('.modal-close').forEach(closeBtn => {
      closeBtn.addEventListener('click', (e) => {
        this.closeModal(e.target.closest('.modal-overlay'));
      });
    });
    
    // 배경 클릭으로 모달 닫기
    document.querySelectorAll('.modal-overlay').forEach(overlay => {
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
          this.closeModal(overlay);
        }
      });
    });
    
    // ESC 키로 모달 닫기
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.closeAllModals();
      }
    });
    
    // 폼 제출 이벤트
    const formModal = document.getElementById('formModal');
    const submitBtn = document.getElementById('submitForm');
    const modalForm = document.getElementById('modalForm');
    
    if (submitBtn && modalForm) {
      submitBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.handleFormSubmit(modalForm);
      });
    }
    
    console.log('모달 매니저가 초기화되었습니다!');
  }
  
  openModal(modalType) {
    const modalId = modalType + 'Modal';
    const modal = this.modals[modalId];
    
    if (modal) {
      modal.classList.add('show');
      document.body.style.overflow = 'hidden'; // 배경 스크롤 방지
      
      // 모달 열기 애니메이션
      setTimeout(() => {
        modal.querySelector('.modal').classList.add('show');
      }, 10);
      
      console.log(\`\${modalType} 모달이 열렸습니다.\`);
    }
  }
  
  closeModal(modal) {
    if (modal) {
      modal.classList.remove('show');
      modal.querySelector('.modal').classList.remove('show');
      document.body.style.overflow = ''; // 배경 스크롤 복원
      
      console.log('모달이 닫혔습니다.');
    }
  }
  
  closeAllModals() {
    Object.values(this.modals).forEach(modal => {
      this.closeModal(modal);
    });
  }
  
  handleFormSubmit(form) {
    const formData = new FormData(form);
    const data = {};
    
    for (let [key, value] of formData.entries()) {
      data[key] = value;
    }
    
    // 폼 검증
    if (!data.name || !data.email) {
      alert('이름과 이메일을 입력해주세요.');
      return;
    }
    
    // 성공 모달 표시
    this.closeModal(document.getElementById('formModal'));
    setTimeout(() => {
      this.openModal('success');
    }, 300);
    
    // 폼 초기화
    form.reset();
    
    console.log('폼 데이터:', data);
  }
  
  // 프로그래밍 방식으로 모달 열기
  showAlert(message, type = 'info') {
    const alertModal = this.createAlertModal(message, type);
    document.body.appendChild(alertModal);
    
    setTimeout(() => {
      alertModal.classList.add('show');
    }, 10);
    
    // 3초 후 자동 닫기
    setTimeout(() => {
      this.closeModal(alertModal);
      setTimeout(() => {
        document.body.removeChild(alertModal);
      }, 300);
    }, 3000);
  }
  
  createAlertModal(message, type) {
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    
    const modal = document.createElement('div');
    modal.className = \`modal \${type}\`;
    
    const header = document.createElement('div');
    header.className = 'modal-header';
    header.innerHTML = \`
      <h3 class="modal-title">\${this.getAlertTitle(type)}</h3>
      <button class="modal-close">&times;</button>
    \`;
    
    const body = document.createElement('div');
    body.className = 'modal-body';
    body.innerHTML = \`<p>\${message}</p>\`;
    
    const footer = document.createElement('div');
    footer.className = 'modal-footer';
    footer.innerHTML = \`
      <button class="modal-btn-footer primary modal-close">확인</button>
    \`;
    
    modal.appendChild(header);
    modal.appendChild(body);
    modal.appendChild(footer);
    overlay.appendChild(modal);
    
    // 이벤트 리스너 추가
    overlay.querySelector('.modal-close').addEventListener('click', () => {
      this.closeModal(overlay);
      setTimeout(() => {
        document.body.removeChild(overlay);
      }, 300);
    });
    
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        this.closeModal(overlay);
        setTimeout(() => {
          document.body.removeChild(overlay);
        }, 300);
      }
    });
    
    return overlay;
  }
  
  getAlertTitle(type) {
    const titles = {
      'info': 'ℹ️ 정보',
      'success': '✅ 성공',
      'warning': '⚠️ 경고',
      'error': '❌ 오류'
    };
    return titles[type] || titles['info'];
  }
}

// 페이지 로드 시 모달 매니저 초기화
document.addEventListener('DOMContentLoaded', () => {
  window.modalManager = new ModalManager();
  
  // 데모용 자동 알림
  setTimeout(() => {
    window.modalManager.showAlert('모달 팝업 데모에 오신 것을 환영합니다!', 'success');
  }, 1000);
});`,
  },
  {
    id: 'slider-carousel',
    name: '슬라이더 캐러셀',
    css: `/* 슬라이더 캐러셀 스타일 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
  padding: 2rem 0;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

.header {
  text-align: center;
  margin-bottom: 3rem;
}

.header h1 {
  color: white;
  font-size: 2.5rem;
  margin-bottom: 1rem;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.header p {
  color: rgba(255, 255, 255, 0.8);
  font-size: 1.1rem;
}

.carousel-container {
  position: relative;
  max-width: 800px;
  margin: 0 auto;
  background: white;
  border-radius: 1rem;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
  overflow: hidden;
}

.carousel {
  position: relative;
  width: 100%;
  height: 400px;
  overflow: hidden;
}

.slide {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  transition: all 0.5s ease-in-out;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding: 2rem;
  text-align: center;
}

.slide.active {
  opacity: 1;
}

.slide-content {
  max-width: 600px;
}

.slide h2 {
  font-size: 2rem;
  margin-bottom: 1rem;
  color: #333;
}

.slide p {
  font-size: 1.1rem;
  color: #666;
  line-height: 1.6;
  margin-bottom: 1.5rem;
}

.slide-btn {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  border: none;
  padding: 0.75rem 2rem;
  border-radius: 0.5rem;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.slide-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
}

.slide-image {
  width: 100%;
  height: 200px;
  background: linear-gradient(135deg, #ff6b6b, #4ecdc4);
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
  color: white;
  margin-bottom: 1rem;
}

/* 네비게이션 버튼 */
.carousel-nav {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(255, 255, 255, 0.9);
  border: none;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  color: #333;
  transition: all 0.3s ease;
  z-index: 10;
}

.carousel-nav:hover {
  background: white;
  transform: translateY(-50%) scale(1.1);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
}

.carousel-nav.prev {
  left: 20px;
}

.carousel-nav.next {
  right: 20px;
}

/* 인디케이터 */
.carousel-indicators {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 0.5rem;
  z-index: 10;
}

.indicator {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.5);
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
}

.indicator.active {
  background: white;
  transform: scale(1.2);
}

/* 컨트롤 패널 */
.controls {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 2rem;
  flex-wrap: wrap;
}

.control-btn {
  background: rgba(255, 255, 255, 0.1);
  border: 2px solid rgba(255, 255, 255, 0.3);
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.9rem;
  font-weight: 500;
  backdrop-filter: blur(10px);
}

.control-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-2px);
}

.control-btn.active {
  background: rgba(255, 255, 255, 0.3);
  border-color: white;
}

/* 자동 재생 토글 */
.auto-play-toggle {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: white;
  font-size: 0.9rem;
}

.toggle-switch {
  position: relative;
  width: 50px;
  height: 25px;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 25px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.toggle-switch.active {
  background: #4ecdc4;
}

.toggle-switch::before {
  content: '';
  position: absolute;
  top: 2px;
  left: 2px;
  width: 21px;
  height: 21px;
  background: white;
  border-radius: 50%;
  transition: all 0.3s ease;
}

.toggle-switch.active::before {
  transform: translateX(25px);
}

/* 슬라이드 정보 */
.slide-info {
  text-align: center;
  margin-top: 1rem;
  color: white;
  font-size: 0.9rem;
  opacity: 0.8;
}

/* 애니메이션 효과 */
.slide.slide-left {
  transform: translateX(-100%);
}

.slide.slide-right {
  transform: translateX(100%);
}

.slide.fade-in {
  animation: fadeIn 0.5s ease-in-out;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* 반응형 디자인 */
@media (max-width: 768px) {
  .container {
    padding: 0 1rem;
  }
  
  .header h1 {
    font-size: 2rem;
  }
  
  .carousel {
    height: 350px;
  }
  
  .slide {
    padding: 1.5rem;
  }
  
  .slide h2 {
    font-size: 1.5rem;
  }
  
  .slide p {
    font-size: 1rem;
  }
  
  .carousel-nav {
    width: 40px;
    height: 40px;
    font-size: 1.2rem;
  }
  
  .carousel-nav.prev {
    left: 10px;
  }
  
  .carousel-nav.next {
    right: 10px;
  }
  
  .controls {
    flex-direction: column;
    align-items: center;
  }
  
  .slide-image {
    height: 150px;
    font-size: 2rem;
  }
}`,
    html: `<div class="container">
  <div class="header">
    <h1>슬라이더 캐러셀</h1>
    <p>인터랙티브한 이미지 슬라이더를 경험해보세요</p>
  </div>
  
  <div class="carousel-container">
    <div class="carousel" id="carousel">
      <div class="slide active" data-slide="0">
        <div class="slide-image">🚀</div>
        <div class="slide-content">
          <h2>혁신적인 기술</h2>
          <p>최신 기술과 혁신적인 아이디어로 미래를 만들어갑니다. 우리의 비전은 더 나은 세상을 위한 솔루션을 제공하는 것입니다.</p>
          <button class="slide-btn">더 알아보기</button>
        </div>
      </div>
      
      <div class="slide" data-slide="1">
        <div class="slide-image">💡</div>
        <div class="slide-content">
          <h2>창의적인 솔루션</h2>
          <p>창의적인 사고와 혁신적인 접근 방식으로 복잡한 문제를 해결합니다. 우리는 항상 새로운 관점에서 문제를 바라봅니다.</p>
          <button class="slide-btn">시작하기</button>
        </div>
      </div>
      
      <div class="slide" data-slide="2">
        <div class="slide-image">⚡</div>
        <div class="slide-content">
          <h2>빠른 성과</h2>
          <p>효율적인 프로세스와 최적화된 워크플로우로 빠른 결과를 제공합니다. 시간을 절약하고 생산성을 극대화합니다.</p>
          <button class="slide-btn">지금 시작</button>
        </div>
      </div>
      
      <div class="slide" data-slide="3">
        <div class="slide-image">🎯</div>
        <div class="slide-content">
          <h2>정확한 목표</h2>
          <p>명확한 목표 설정과 체계적인 계획으로 성공을 달성합니다. 우리는 항상 목표 지향적인 접근을 합니다.</p>
          <button class="slide-btn">목표 설정</button>
        </div>
      </div>
      
      <div class="slide" data-slide="4">
        <div class="slide-image">🌟</div>
        <div class="slide-content">
          <h2>탁월한 품질</h2>
          <p>최고 수준의 품질과 서비스를 제공합니다. 우리는 고객 만족을 최우선으로 생각하며 지속적으로 개선합니다.</p>
          <button class="slide-btn">품질 확인</button>
        </div>
      </div>
    </div>
    
    <!-- 네비게이션 버튼 -->
    <button class="carousel-nav prev" id="prevBtn">‹</button>
    <button class="carousel-nav next" id="nextBtn">›</button>
    
    <!-- 인디케이터 -->
    <div class="carousel-indicators" id="indicators">
      <button class="indicator active" data-slide="0"></button>
      <button class="indicator" data-slide="1"></button>
      <button class="indicator" data-slide="2"></button>
      <button class="indicator" data-slide="3"></button>
      <button class="indicator" data-slide="4"></button>
    </div>
  </div>
  
  <div class="controls">
    <button class="control-btn" id="playBtn">재생</button>
    <button class="control-btn" id="pauseBtn">일시정지</button>
    <button class="control-btn" id="randomBtn">랜덤</button>
    <div class="auto-play-toggle">
      <span>자동 재생:</span>
      <div class="toggle-switch" id="autoPlayToggle"></div>
    </div>
  </div>
  
  <div class="slide-info" id="slideInfo">
    슬라이드 1 / 5
  </div>
</div>`,
    js: `// 슬라이더 캐러셀 클래스
class SliderCarousel {
  constructor() {
    this.carousel = document.getElementById('carousel');
    this.slides = document.querySelectorAll('.slide');
    this.indicators = document.querySelectorAll('.indicator');
    this.prevBtn = document.getElementById('prevBtn');
    this.nextBtn = document.getElementById('nextBtn');
    this.playBtn = document.getElementById('playBtn');
    this.pauseBtn = document.getElementById('pauseBtn');
    this.randomBtn = document.getElementById('randomBtn');
    this.autoPlayToggle = document.getElementById('autoPlayToggle');
    this.slideInfo = document.getElementById('slideInfo');
    
    this.currentSlide = 0;
    this.totalSlides = this.slides.length;
    this.isAutoPlaying = false;
    this.autoPlayInterval = null;
    this.autoPlayDelay = 3000; // 3초
    
    this.init();
  }
  
  init() {
    // 이벤트 리스너 설정
    this.prevBtn.addEventListener('click', () => this.prevSlide());
    this.nextBtn.addEventListener('click', () => this.nextSlide());
    this.playBtn.addEventListener('click', () => this.startAutoPlay());
    this.pauseBtn.addEventListener('click', () => this.stopAutoPlay());
    this.randomBtn.addEventListener('click', () => this.randomSlide());
    this.autoPlayToggle.addEventListener('click', () => this.toggleAutoPlay());
    
    // 인디케이터 클릭 이벤트
    this.indicators.forEach((indicator, index) => {
      indicator.addEventListener('click', () => this.goToSlide(index));
    });
    
    // 슬라이드 버튼 클릭 이벤트
    this.slides.forEach((slide, index) => {
      const btn = slide.querySelector('.slide-btn');
      if (btn) {
        btn.addEventListener('click', () => {
          console.log(\`슬라이드 \${index + 1} 버튼 클릭됨\`);
          this.showSlideInfo(\`슬라이드 \${index + 1} 버튼이 클릭되었습니다!\`);
        });
      }
    });
    
    // 키보드 네비게이션
    document.addEventListener('keydown', (e) => {
      switch(e.key) {
        case 'ArrowLeft':
          this.prevSlide();
          break;
        case 'ArrowRight':
          this.nextSlide();
          break;
        case ' ':
          e.preventDefault();
          this.toggleAutoPlay();
          break;
        case 'r':
        case 'R':
          this.randomSlide();
          break;
      }
    });
    
    // 터치/스와이프 지원
    this.addTouchSupport();
    
    // 초기 설정
    this.updateSlideInfo();
    this.startAutoPlay(); // 자동 재생 시작
    
    console.log('슬라이더 캐러셀이 초기화되었습니다!');
    console.log('키보드 단축키: ← → (이동), Space (자동재생 토글), R (랜덤)');
  }
  
  goToSlide(index) {
    if (index < 0 || index >= this.totalSlides) return;
    
    // 현재 슬라이드 숨기기
    this.slides[this.currentSlide].classList.remove('active');
    this.indicators[this.currentSlide].classList.remove('active');
    
    // 새 슬라이드 표시
    this.currentSlide = index;
    this.slides[this.currentSlide].classList.add('active');
    this.indicators[this.currentSlide].classList.add('active');
    
    this.updateSlideInfo();
    console.log(\`슬라이드 \${this.currentSlide + 1}로 이동\`);
  }
  
  nextSlide() {
    const nextIndex = (this.currentSlide + 1) % this.totalSlides;
    this.goToSlide(nextIndex);
  }
  
  prevSlide() {
    const prevIndex = (this.currentSlide - 1 + this.totalSlides) % this.totalSlides;
    this.goToSlide(prevIndex);
  }
  
  randomSlide() {
    let randomIndex;
    do {
      randomIndex = Math.floor(Math.random() * this.totalSlides);
    } while (randomIndex === this.currentSlide && this.totalSlides > 1);
    
    this.goToSlide(randomIndex);
    this.showSlideInfo('랜덤 슬라이드로 이동했습니다!');
  }
  
  startAutoPlay() {
    if (this.isAutoPlaying) return;
    
    this.isAutoPlaying = true;
    this.autoPlayInterval = setInterval(() => {
      this.nextSlide();
    }, this.autoPlayDelay);
    
    this.updateControlButtons();
    this.autoPlayToggle.classList.add('active');
    console.log('자동 재생 시작');
  }
  
  stopAutoPlay() {
    if (!this.isAutoPlaying) return;
    
    this.isAutoPlaying = false;
    clearInterval(this.autoPlayInterval);
    this.autoPlayInterval = null;
    
    this.updateControlButtons();
    this.autoPlayToggle.classList.remove('active');
    console.log('자동 재생 중지');
  }
  
  toggleAutoPlay() {
    if (this.isAutoPlaying) {
      this.stopAutoPlay();
    } else {
      this.startAutoPlay();
    }
  }
  
  updateControlButtons() {
    this.playBtn.classList.toggle('active', !this.isAutoPlaying);
    this.pauseBtn.classList.toggle('active', this.isAutoPlaying);
  }
  
  updateSlideInfo() {
    this.slideInfo.textContent = \`슬라이드 \${this.currentSlide + 1} / \${this.totalSlides}\`;
  }
  
  showSlideInfo(message) {
    const originalText = this.slideInfo.textContent;
    this.slideInfo.textContent = message;
    this.slideInfo.style.color = '#4ecdc4';
    
    setTimeout(() => {
      this.slideInfo.textContent = originalText;
      this.slideInfo.style.color = '';
    }, 2000);
  }
  
  addTouchSupport() {
    let startX = 0;
    let endX = 0;
    
    this.carousel.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
    });
    
    this.carousel.addEventListener('touchend', (e) => {
      endX = e.changedTouches[0].clientX;
      this.handleSwipe(startX, endX);
    });
  }
  
  handleSwipe(startX, endX) {
    const threshold = 50;
    const diff = startX - endX;
    
    if (Math.abs(diff) > threshold) {
      if (diff > 0) {
        this.nextSlide();
      } else {
        this.prevSlide();
      }
    }
  }
  
  // 프로그래밍 방식으로 슬라이드 변경
  setSlide(index) {
    this.goToSlide(index);
  }
  
  // 자동 재생 속도 변경
  setAutoPlayDelay(delay) {
    this.autoPlayDelay = delay;
    if (this.isAutoPlaying) {
      this.stopAutoPlay();
      this.startAutoPlay();
    }
  }
  
  // 현재 슬라이드 정보 반환
  getCurrentSlide() {
    return {
      index: this.currentSlide,
      total: this.totalSlides,
      isAutoPlaying: this.isAutoPlaying
    };
  }
}

// 페이지 로드 시 슬라이더 캐러셀 초기화
document.addEventListener('DOMContentLoaded', () => {
  window.sliderCarousel = new SliderCarousel();
});`,
  },
  {
    id: 'tooltip-component',
    name: '툴팁 컴포넌트',
    css: `/* 툴팁 컴포넌트 스타일 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
  padding: 2rem;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
}

.header {
  text-align: center;
  margin-bottom: 3rem;
}

.header h1 {
  color: white;
  font-size: 2.5rem;
  margin-bottom: 1rem;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.header p {
  color: rgba(255, 255, 255, 0.8);
  font-size: 1.1rem;
}

.demo-section {
  background: white;
  border-radius: 1rem;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.demo-section h2 {
  color: #333;
  margin-bottom: 1.5rem;
  font-size: 1.5rem;
}

.demo-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
}

.tooltip-trigger {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 0.5rem;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 500;
  transition: all 0.3s ease;
  position: relative;
}

.tooltip-trigger:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
}

.tooltip-trigger.success {
  background: linear-gradient(135deg, #4ecdc4, #44a08d);
}

.tooltip-trigger.warning {
  background: linear-gradient(135deg, #feca57, #ff9ff3);
  color: #333;
}

.tooltip-trigger.danger {
  background: linear-gradient(135deg, #ff6b6b, #ee5a24);
}

.tooltip-trigger.info {
  background: linear-gradient(135deg, #48cae4, #0077b6);
}

/* 툴팁 스타일 */
.tooltip {
  position: absolute;
  background: #333;
  color: white;
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  font-size: 0.9rem;
  line-height: 1.4;
  max-width: 250px;
  z-index: 1000;
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s ease;
  pointer-events: none;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.tooltip.show {
  opacity: 1;
  visibility: visible;
}

/* 툴팁 화살표 */
.tooltip::before {
  content: '';
  position: absolute;
  width: 0;
  height: 0;
  border: 6px solid transparent;
}

/* 툴팁 위치별 화살표 */
.tooltip.top::before {
  bottom: -12px;
  left: 50%;
  transform: translateX(-50%);
  border-top-color: #333;
}

.tooltip.bottom::before {
  top: -12px;
  left: 50%;
  transform: translateX(-50%);
  border-bottom-color: #333;
}

.tooltip.left::before {
  right: -12px;
  top: 50%;
  transform: translateY(-50%);
  border-left-color: #333;
}

.tooltip.right::before {
  left: -12px;
  top: 50%;
  transform: translateY(-50%);
  border-right-color: #333;
}

/* 툴팁 테마 */
.tooltip.success {
  background: #4ecdc4;
}

.tooltip.success::before {
  border-top-color: #4ecdc4;
}

.tooltip.warning {
  background: #feca57;
  color: #333;
}

.tooltip.warning::before {
  border-top-color: #feca57;
}

.tooltip.danger {
  background: #ff6b6b;
}

.tooltip.danger::before {
  border-top-color: #ff6b6b;
}

.tooltip.info {
  background: #48cae4;
}

.tooltip.info::before {
  border-top-color: #48cae4;
}

/* 특별한 툴팁 스타일 */
.tooltip.large {
  max-width: 350px;
  padding: 1rem 1.5rem;
  font-size: 1rem;
}

.tooltip.small {
  max-width: 150px;
  padding: 0.5rem 0.75rem;
  font-size: 0.8rem;
}

.tooltip.rounded {
  border-radius: 1rem;
}

.tooltip.shadow {
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
}

/* 인터랙티브 요소들 */
.interactive-demo {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 2rem;
}

.interactive-item {
  background: #f8f9fa;
  border: 2px solid #e9ecef;
  border-radius: 0.5rem;
  padding: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
}

.interactive-item:hover {
  border-color: #667eea;
  background: #f0f2ff;
}

.interactive-item h3 {
  color: #333;
  margin-bottom: 0.5rem;
  font-size: 1rem;
}

.interactive-item p {
  color: #666;
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
}

.interactive-item .icon {
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
}

/* 폼 요소 툴팁 */
.form-demo {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

.form-group {
  position: relative;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: #333;
  font-weight: 500;
}

.form-group input,
.form-group select {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #e9ecef;
  border-radius: 0.5rem;
  font-size: 1rem;
  transition: border-color 0.3s ease;
}

.form-group input:focus,
.form-group select:focus {
  outline: none;
  border-color: #667eea;
}

.help-icon {
  position: absolute;
  top: 0;
  right: 0;
  width: 20px;
  height: 20px;
  background: #667eea;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.help-icon:hover {
  background: #5a6fd8;
  transform: scale(1.1);
}

/* 툴팁 설정 패널 */
.settings-panel {
  background: #f8f9fa;
  border-radius: 0.5rem;
  padding: 1.5rem;
  margin-bottom: 2rem;
}

.settings-panel h3 {
  color: #333;
  margin-bottom: 1rem;
}

.settings-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.setting-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.setting-group label {
  color: #666;
  font-size: 0.9rem;
  font-weight: 500;
}

.setting-group select,
.setting-group input {
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 0.25rem;
  font-size: 0.9rem;
}

/* 애니메이션 */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.tooltip.animate {
  animation: fadeInUp 0.3s ease;
}

/* 반응형 디자인 */
@media (max-width: 768px) {
  .container {
    padding: 1rem;
  }
  
  .header h1 {
    font-size: 2rem;
  }
  
  .demo-section {
    padding: 1.5rem;
  }
  
  .demo-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  .interactive-demo {
    flex-direction: column;
  }
  
  .form-demo {
    grid-template-columns: 1fr;
  }
  
  .settings-grid {
    grid-template-columns: 1fr;
  }
  
  .tooltip {
    max-width: 200px;
    font-size: 0.8rem;
  }
}`,
    html: `<div class="container">
  <div class="header">
    <h1>툴팁 컴포넌트</h1>
    <p>다양한 툴팁 스타일과 기능을 경험해보세요</p>
  </div>
  
  <div class="demo-section">
    <h2>기본 툴팁</h2>
    <div class="demo-grid">
      <button class="tooltip-trigger" data-tooltip="이것은 기본 툴팁입니다!" data-position="top">
        위쪽 툴팁
      </button>
      <button class="tooltip-trigger" data-tooltip="이것은 아래쪽 툴팁입니다!" data-position="bottom">
        아래쪽 툴팁
      </button>
      <button class="tooltip-trigger" data-tooltip="이것은 왼쪽 툴팁입니다!" data-position="left">
        왼쪽 툴팁
      </button>
      <button class="tooltip-trigger" data-tooltip="이것은 오른쪽 툴팁입니다!" data-position="right">
        오른쪽 툴팁
      </button>
    </div>
  </div>
  
  <div class="demo-section">
    <h2>테마별 툴팁</h2>
    <div class="demo-grid">
      <button class="tooltip-trigger success" data-tooltip="성공 메시지입니다! ✅" data-position="top" data-theme="success">
        성공 툴팁
      </button>
      <button class="tooltip-trigger warning" data-tooltip="경고 메시지입니다! ⚠️" data-position="top" data-theme="warning">
        경고 툴팁
      </button>
      <button class="tooltip-trigger danger" data-tooltip="위험 메시지입니다! ❌" data-position="top" data-theme="danger">
        위험 툴팁
      </button>
      <button class="tooltip-trigger info" data-tooltip="정보 메시지입니다! ℹ️" data-position="top" data-theme="info">
        정보 툴팁
      </button>
    </div>
  </div>
  
  <div class="demo-section">
    <h2>크기별 툴팁</h2>
    <div class="demo-grid">
      <button class="tooltip-trigger" data-tooltip="작은 툴팁" data-position="top" data-size="small">
        작은 툴팁
      </button>
      <button class="tooltip-trigger" data-tooltip="기본 크기의 툴팁입니다. 적당한 길이의 텍스트를 포함합니다." data-position="top">
        기본 툴팁
      </button>
      <button class="tooltip-trigger" data-tooltip="이것은 큰 툴팁입니다. 더 많은 정보를 담을 수 있으며, 사용자에게 상세한 설명을 제공합니다. 긴 텍스트도 잘 표시됩니다." data-position="top" data-size="large">
        큰 툴팁
      </button>
    </div>
  </div>
  
  <div class="demo-section">
    <h2>인터랙티브 요소</h2>
    <div class="interactive-demo">
      <div class="interactive-item" data-tooltip="이 카드는 클릭할 수 있습니다!" data-position="top">
        <div class="icon">📱</div>
        <h3>모바일 앱</h3>
        <p>스마트폰에서 사용할 수 있는 앱입니다.</p>
      </div>
      
      <div class="interactive-item" data-tooltip="웹 브라우저에서 실행되는 애플리케이션입니다." data-position="top">
        <div class="icon">🌐</div>
        <h3>웹 애플리케이션</h3>
        <p>브라우저에서 바로 사용할 수 있습니다.</p>
      </div>
      
      <div class="interactive-item" data-tooltip="데스크톱 컴퓨터용 프로그램입니다." data-position="top">
        <div class="icon">💻</div>
        <h3>데스크톱 앱</h3>
        <p>컴퓨터에 설치해서 사용합니다.</p>
      </div>
      
      <div class="interactive-item" data-tooltip="클라우드 서버에서 실행되는 서비스입니다." data-position="top">
        <div class="icon">☁️</div>
        <h3>클라우드 서비스</h3>
        <p>인터넷을 통해 접근할 수 있습니다.</p>
      </div>
    </div>
  </div>
  
  <div class="demo-section">
    <h2>폼 요소 툴팁</h2>
    <div class="form-demo">
      <div class="form-group">
        <label for="username">사용자명</label>
        <input type="text" id="username" placeholder="사용자명을 입력하세요">
        <div class="help-icon" data-tooltip="3-20자의 영문, 숫자, 언더스코어만 사용 가능합니다." data-position="left">?</div>
      </div>
      
      <div class="form-group">
        <label for="email">이메일</label>
        <input type="email" id="email" placeholder="이메일을 입력하세요">
        <div class="help-icon" data-tooltip="유효한 이메일 주소 형식으로 입력해주세요. 예: user@example.com" data-position="left">?</div>
      </div>
      
      <div class="form-group">
        <label for="password">비밀번호</label>
        <input type="password" id="password" placeholder="비밀번호를 입력하세요">
        <div class="help-icon" data-tooltip="8자 이상, 대소문자, 숫자, 특수문자를 포함해야 합니다." data-position="left">?</div>
      </div>
      
      <div class="form-group">
        <label for="country">국가</label>
        <select id="country">
          <option value="">국가를 선택하세요</option>
          <option value="kr">대한민국</option>
          <option value="us">미국</option>
          <option value="jp">일본</option>
          <option value="cn">중국</option>
        </select>
        <div class="help-icon" data-tooltip="거주하고 있는 국가를 선택해주세요." data-position="left">?</div>
      </div>
    </div>
  </div>
  
  <div class="demo-section">
    <h2>툴팁 설정</h2>
    <div class="settings-panel">
      <h3>새 툴팁 생성</h3>
      <div class="settings-grid">
        <div class="setting-group">
          <label for="tooltipText">툴팁 텍스트</label>
          <input type="text" id="tooltipText" placeholder="툴팁에 표시할 텍스트">
        </div>
        <div class="setting-group">
          <label for="tooltipPosition">위치</label>
          <select id="tooltipPosition">
            <option value="top">위쪽</option>
            <option value="bottom">아래쪽</option>
            <option value="left">왼쪽</option>
            <option value="right">오른쪽</option>
          </select>
        </div>
        <div class="setting-group">
          <label for="tooltipTheme">테마</label>
          <select id="tooltipTheme">
            <option value="default">기본</option>
            <option value="success">성공</option>
            <option value="warning">경고</option>
            <option value="danger">위험</option>
            <option value="info">정보</option>
          </select>
        </div>
        <div class="setting-group">
          <label for="tooltipSize">크기</label>
          <select id="tooltipSize">
            <option value="small">작음</option>
            <option value="default">기본</option>
            <option value="large">큼</option>
          </select>
        </div>
      </div>
      <button class="tooltip-trigger" id="customTooltipBtn" style="margin-top: 1rem;">
        커스텀 툴팁 테스트
      </button>
    </div>
  </div>
</div>`,
    js: `// 툴팁 관리 클래스
class TooltipManager {
  constructor() {
    this.tooltips = new Map();
    this.activeTooltip = null;
    this.init();
  }
  
  init() {
    // 기존 툴팁 요소들 초기화
    this.initializeTooltips();
    
    // 커스텀 툴팁 생성 기능
    this.setupCustomTooltip();
    
    // 전역 이벤트 리스너
    document.addEventListener('mouseover', (e) => this.handleMouseOver(e));
    document.addEventListener('mouseout', (e) => this.handleMouseOut(e));
    document.addEventListener('mousemove', (e) => this.handleMouseMove(e));
    
    console.log('툴팁 매니저가 초기화되었습니다!');
  }
  
  initializeTooltips() {
    // data-tooltip 속성이 있는 모든 요소에 툴팁 설정
    document.querySelectorAll('[data-tooltip]').forEach(element => {
      this.createTooltip(element);
    });
  }
  
  createTooltip(element) {
    const tooltipText = element.getAttribute('data-tooltip');
    const position = element.getAttribute('data-position') || 'top';
    const theme = element.getAttribute('data-theme') || 'default';
    const size = element.getAttribute('data-size') || 'default';
    const delay = parseInt(element.getAttribute('data-delay')) || 500;
    
    const tooltip = document.createElement('div');
    tooltip.className = \`tooltip \${position} \${theme} \${size}\`;
    tooltip.textContent = tooltipText;
    tooltip.style.display = 'none';
    
    document.body.appendChild(tooltip);
    
    this.tooltips.set(element, {
      element: tooltip,
      position,
      theme,
      size,
      delay,
      timeout: null
    });
  }
  
  handleMouseOver(e) {
    const element = e.target.closest('[data-tooltip]');
    if (!element) return;
    
    const tooltipData = this.tooltips.get(element);
    if (!tooltipData) return;
    
    // 기존 툴팁 숨기기
    this.hideTooltip();
    
    // 새 툴팁 표시 (지연 시간 적용)
    tooltipData.timeout = setTimeout(() => {
      this.showTooltip(element, tooltipData);
    }, tooltipData.delay);
  }
  
  handleMouseOut(e) {
    const element = e.target.closest('[data-tooltip]');
    if (!element) return;
    
    const tooltipData = this.tooltips.get(element);
    if (!tooltipData) return;
    
    // 지연 시간 취소
    if (tooltipData.timeout) {
      clearTimeout(tooltipData.timeout);
      tooltipData.timeout = null;
    }
    
    this.hideTooltip();
  }
  
  handleMouseMove(e) {
    if (this.activeTooltip) {
      this.updateTooltipPosition(this.activeTooltip, e);
    }
  }
  
  showTooltip(element, tooltipData) {
    const tooltip = tooltipData.element;
    this.activeTooltip = { element, tooltip, tooltipData };
    
    tooltip.style.display = 'block';
    this.updateTooltipPosition(this.activeTooltip);
    
    // 애니메이션 효과
    setTimeout(() => {
      tooltip.classList.add('show');
    }, 10);
    
    console.log(\`툴팁 표시: \${tooltip.textContent}\`);
  }
  
  hideTooltip() {
    if (!this.activeTooltip) return;
    
    const { tooltip } = this.activeTooltip;
    tooltip.classList.remove('show');
    
    setTimeout(() => {
      tooltip.style.display = 'none';
      this.activeTooltip = null;
    }, 300);
  }
  
  updateTooltipPosition(tooltipInfo, mouseEvent = null) {
    const { element, tooltip, tooltipData } = tooltipInfo;
    const rect = element.getBoundingClientRect();
    const tooltipRect = tooltip.getBoundingClientRect();
    const position = tooltipData.position;
    
    let top, left;
    
    switch (position) {
      case 'top':
        top = rect.top - tooltipRect.height - 10;
        left = rect.left + (rect.width - tooltipRect.width) / 2;
        break;
      case 'bottom':
        top = rect.bottom + 10;
        left = rect.left + (rect.width - tooltipRect.width) / 2;
        break;
      case 'left':
        top = rect.top + (rect.height - tooltipRect.height) / 2;
        left = rect.left - tooltipRect.width - 10;
        break;
      case 'right':
        top = rect.top + (rect.height - tooltipRect.height) / 2;
        left = rect.right + 10;
        break;
    }
    
    // 화면 경계 확인 및 조정
    const viewport = {
      width: window.innerWidth,
      height: window.innerHeight
    };
    
    // 수평 경계 확인
    if (left < 10) left = 10;
    if (left + tooltipRect.width > viewport.width - 10) {
      left = viewport.width - tooltipRect.width - 10;
    }
    
    // 수직 경계 확인
    if (top < 10) top = 10;
    if (top + tooltipRect.height > viewport.height - 10) {
      top = viewport.height - tooltipRect.height - 10;
    }
    
    tooltip.style.top = \`\${top}px\`;
    tooltip.style.left = \`\${left}px\`;
  }
  
  setupCustomTooltip() {
    const textInput = document.getElementById('tooltipText');
    const positionSelect = document.getElementById('tooltipPosition');
    const themeSelect = document.getElementById('tooltipTheme');
    const sizeSelect = document.getElementById('tooltipSize');
    const customBtn = document.getElementById('customTooltipBtn');
    
    if (!customBtn) return;
    
    customBtn.addEventListener('click', () => {
      const text = textInput.value || '커스텀 툴팁입니다!';
      const position = positionSelect.value;
      const theme = themeSelect.value;
      const size = sizeSelect.value;
      
      // 기존 커스텀 툴팁 제거
      const existingTooltip = this.tooltips.get(customBtn);
      if (existingTooltip) {
        existingTooltip.element.remove();
        this.tooltips.delete(customBtn);
      }
      
      // 새 툴팁 설정
      customBtn.setAttribute('data-tooltip', text);
      customBtn.setAttribute('data-position', position);
      customBtn.setAttribute('data-theme', theme);
      customBtn.setAttribute('data-size', size);
      
      this.createTooltip(customBtn);
      
      console.log(\`커스텀 툴팁 생성: \${text}\`);
    });
  }
  
  // 프로그래밍 방식으로 툴팁 표시
  showTooltipFor(element, text, options = {}) {
    const {
      position = 'top',
      theme = 'default',
      size = 'default',
      delay = 0
    } = options;
    
    // 임시 툴팁 생성
    const tooltip = document.createElement('div');
    tooltip.className = \`tooltip \${position} \${theme} \${size}\`;
    tooltip.textContent = text;
    tooltip.style.display = 'block';
    
    document.body.appendChild(tooltip);
    
    // 위치 설정
    const rect = element.getBoundingClientRect();
    const tooltipRect = tooltip.getBoundingClientRect();
    
    let top, left;
    switch (position) {
      case 'top':
        top = rect.top - tooltipRect.height - 10;
        left = rect.left + (rect.width - tooltipRect.width) / 2;
        break;
      case 'bottom':
        top = rect.bottom + 10;
        left = rect.left + (rect.width - tooltipRect.width) / 2;
        break;
      case 'left':
        top = rect.top + (rect.height - tooltipRect.height) / 2;
        left = rect.left - tooltipRect.width - 10;
        break;
      case 'right':
        top = rect.top + (rect.height - tooltipRect.height) / 2;
        left = rect.right + 10;
        break;
    }
    
    tooltip.style.top = \`\${top}px\`;
    tooltip.style.left = \`\${left}px\`;
    
    // 애니메이션
    setTimeout(() => {
      tooltip.classList.add('show');
    }, 10);
    
    // 자동 숨김
    setTimeout(() => {
      tooltip.classList.remove('show');
      setTimeout(() => {
        document.body.removeChild(tooltip);
      }, 300);
    }, 3000);
  }
  
  // 모든 툴팁 제거
  destroy() {
    this.tooltips.forEach(({ element }) => {
      if (element.parentNode) {
        element.parentNode.removeChild(element);
      }
    });
    this.tooltips.clear();
    this.activeTooltip = null;
  }
}

// 페이지 로드 시 툴팁 매니저 초기화
document.addEventListener('DOMContentLoaded', () => {
  window.tooltipManager = new TooltipManager();
  
  // 데모용 프로그래밍 방식 툴팁
  setTimeout(() => {
    const header = document.querySelector('.header h1');
    if (header) {
      window.tooltipManager.showTooltipFor(header, '이 제목에 마우스를 올려보세요!', {
        position: 'bottom',
        theme: 'info'
      });
    }
  }, 2000);
});`,
  },
  {
    id: 'progress-bar',
    name: '프로그레스 바',
    css: `/* 프로그레스 바 스타일 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
  padding: 2rem;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
}

.header {
  text-align: center;
  margin-bottom: 3rem;
}

.header h1 {
  color: white;
  font-size: 2.5rem;
  margin-bottom: 1rem;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.header p {
  color: rgba(255, 255, 255, 0.8);
  font-size: 1.1rem;
}

.demo-section {
  background: white;
  border-radius: 1rem;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.demo-section h2 {
  color: #333;
  margin-bottom: 1.5rem;
  font-size: 1.5rem;
}

.progress-item {
  margin-bottom: 2rem;
}

.progress-label {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
  color: #333;
  font-weight: 500;
}

.progress-value {
  color: #666;
  font-size: 0.9rem;
}

/* 기본 프로그레스 바 */
.progress-bar {
  width: 100%;
  height: 20px;
  background: #e9ecef;
  border-radius: 10px;
  overflow: hidden;
  position: relative;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #667eea, #764ba2);
  border-radius: 10px;
  transition: width 0.5s ease;
  position: relative;
  overflow: hidden;
}

.progress-fill::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  animation: shimmer 2s infinite;
}

@keyframes shimmer {
  0% { left: -100%; }
  100% { left: 100%; }
}

/* 테마별 프로그레스 바 */
.progress-bar.success .progress-fill {
  background: linear-gradient(90deg, #4ecdc4, #44a08d);
}

.progress-bar.warning .progress-fill {
  background: linear-gradient(90deg, #feca57, #ff9ff3);
}

.progress-bar.danger .progress-fill {
  background: linear-gradient(90deg, #ff6b6b, #ee5a24);
}

.progress-bar.info .progress-fill {
  background: linear-gradient(90deg, #48cae4, #0077b6);
}

/* 크기별 프로그레스 바 */
.progress-bar.small {
  height: 8px;
}

.progress-bar.medium {
  height: 16px;
}

.progress-bar.large {
  height: 32px;
}

/* 스타일별 프로그레스 바 */
.progress-bar.striped .progress-fill {
  background-image: linear-gradient(
    45deg,
    rgba(255, 255, 255, 0.15) 25%,
    transparent 25%,
    transparent 50%,
    rgba(255, 255, 255, 0.15) 50%,
    rgba(255, 255, 255, 0.15) 75%,
    transparent 75%,
    transparent
  );
  background-size: 20px 20px;
  animation: progress-stripes 1s linear infinite;
}

@keyframes progress-stripes {
  0% { background-position: 0 0; }
  100% { background-position: 20px 0; }
}

.progress-bar.rounded .progress-fill {
  border-radius: 20px;
}

.progress-bar.flat .progress-fill {
  border-radius: 0;
}

/* 원형 프로그레스 바 */
.circular-progress {
  position: relative;
  width: 120px;
  height: 120px;
  margin: 0 auto;
}

.circular-progress svg {
  width: 100%;
  height: 100%;
  transform: rotate(-90deg);
}

.circular-progress .bg-circle {
  fill: none;
  stroke: #e9ecef;
  stroke-width: 8;
}

.circular-progress .progress-circle {
  fill: none;
  stroke: #667eea;
  stroke-width: 8;
  stroke-linecap: round;
  stroke-dasharray: 283;
  stroke-dashoffset: 283;
  transition: stroke-dashoffset 0.5s ease;
}

.circular-progress .progress-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 1.2rem;
  font-weight: bold;
  color: #333;
}

/* 단계별 프로그레스 바 */
.step-progress {
  display: flex;
  align-items: center;
  margin-bottom: 2rem;
}

.step {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
}

.step:not(:last-child)::after {
  content: '';
  position: absolute;
  top: 15px;
  left: 50%;
  width: 100%;
  height: 2px;
  background: #e9ecef;
  z-index: 1;
}

.step.completed:not(:last-child)::after {
  background: #4ecdc4;
}

.step-circle {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: #e9ecef;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  font-weight: bold;
  color: #666;
  position: relative;
  z-index: 2;
  transition: all 0.3s ease;
}

.step.completed .step-circle {
  background: #4ecdc4;
  color: white;
}

.step.active .step-circle {
  background: #667eea;
  color: white;
  transform: scale(1.1);
}

.step-label {
  margin-top: 0.5rem;
  font-size: 0.8rem;
  color: #666;
  text-align: center;
}

.step.completed .step-label {
  color: #4ecdc4;
  font-weight: 500;
}

.step.active .step-label {
  color: #667eea;
  font-weight: 500;
}

/* 컨트롤 패널 */
.controls {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
}

.control-btn {
  background: rgba(255, 255, 255, 0.1);
  border: 2px solid rgba(255, 255, 255, 0.3);
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.9rem;
  font-weight: 500;
  backdrop-filter: blur(10px);
}

.control-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-2px);
}

.control-btn.active {
  background: rgba(255, 255, 255, 0.3);
  border-color: white;
}

/* 프로그레스 바 그룹 */
.progress-group {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
}

/* 애니메이션 효과 */
.progress-bar.animate .progress-fill {
  animation: progress-glow 2s ease-in-out infinite alternate;
}

@keyframes progress-glow {
  from { box-shadow: 0 0 5px rgba(102, 126, 234, 0.5); }
  to { box-shadow: 0 0 20px rgba(102, 126, 234, 0.8); }
}

/* 반응형 디자인 */
@media (max-width: 768px) {
  .container {
    padding: 1rem;
  }
  
  .header h1 {
    font-size: 2rem;
  }
  
  .demo-section {
    padding: 1.5rem;
  }
  
  .controls {
    flex-direction: column;
    align-items: center;
  }
  
  .progress-group {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  .step-progress {
    flex-direction: column;
    gap: 1rem;
  }
  
  .step:not(:last-child)::after {
    display: none;
  }
  
  .circular-progress {
    width: 100px;
    height: 100px;
  }
}`,
    html: `<div class="container">
  <div class="header">
    <h1>프로그레스 바</h1>
    <p>다양한 프로그레스 바 스타일과 기능을 경험해보세요</p>
  </div>
  
  <div class="demo-section">
    <h2>기본 프로그레스 바</h2>
    <div class="progress-item">
      <div class="progress-label">
        <span>기본 프로그레스</span>
        <span class="progress-value" id="basicValue">0%</span>
      </div>
      <div class="progress-bar" id="basicProgress">
        <div class="progress-fill" id="basicFill"></div>
      </div>
    </div>
    
    <div class="progress-item">
      <div class="progress-label">
        <span>애니메이션 효과</span>
        <span class="progress-value" id="animateValue">0%</span>
      </div>
      <div class="progress-bar animate" id="animateProgress">
        <div class="progress-fill" id="animateFill"></div>
      </div>
    </div>
  </div>
  
  <div class="demo-section">
    <h2>테마별 프로그레스 바</h2>
    <div class="progress-group">
      <div class="progress-item">
        <div class="progress-label">
          <span>성공</span>
          <span class="progress-value" id="successValue">0%</span>
        </div>
        <div class="progress-bar success" id="successProgress">
          <div class="progress-fill" id="successFill"></div>
        </div>
      </div>
      
      <div class="progress-item">
        <div class="progress-label">
          <span>경고</span>
          <span class="progress-value" id="warningValue">0%</span>
        </div>
        <div class="progress-bar warning" id="warningProgress">
          <div class="progress-fill" id="warningFill"></div>
        </div>
      </div>
      
      <div class="progress-item">
        <div class="progress-label">
          <span>위험</span>
          <span class="progress-value" id="dangerValue">0%</span>
        </div>
        <div class="progress-bar danger" id="dangerProgress">
          <div class="progress-fill" id="dangerFill"></div>
        </div>
      </div>
      
      <div class="progress-item">
        <div class="progress-label">
          <span>정보</span>
          <span class="progress-value" id="infoValue">0%</span>
        </div>
        <div class="progress-bar info" id="infoProgress">
          <div class="progress-fill" id="infoFill"></div>
        </div>
      </div>
    </div>
  </div>
  
  <div class="demo-section">
    <h2>크기별 프로그레스 바</h2>
    <div class="progress-item">
      <div class="progress-label">
        <span>작은 크기</span>
        <span class="progress-value" id="smallValue">0%</span>
      </div>
      <div class="progress-bar small" id="smallProgress">
        <div class="progress-fill" id="smallFill"></div>
      </div>
    </div>
    
    <div class="progress-item">
      <div class="progress-label">
        <span>중간 크기</span>
        <span class="progress-value" id="mediumValue">0%</span>
      </div>
      <div class="progress-bar medium" id="mediumProgress">
        <div class="progress-fill" id="mediumFill"></div>
      </div>
    </div>
    
    <div class="progress-item">
      <div class="progress-label">
        <span>큰 크기</span>
        <span class="progress-value" id="largeValue">0%</span>
      </div>
      <div class="progress-bar large" id="largeProgress">
        <div class="progress-fill" id="largeFill"></div>
      </div>
    </div>
  </div>
  
  <div class="demo-section">
    <h2>스타일별 프로그레스 바</h2>
    <div class="progress-item">
      <div class="progress-label">
        <span>줄무늬 스타일</span>
        <span class="progress-value" id="stripedValue">0%</span>
      </div>
      <div class="progress-bar striped" id="stripedProgress">
        <div class="progress-fill" id="stripedFill"></div>
      </div>
    </div>
    
    <div class="progress-item">
      <div class="progress-label">
        <span>둥근 모서리</span>
        <span class="progress-value" id="roundedValue">0%</span>
      </div>
      <div class="progress-bar rounded" id="roundedProgress">
        <div class="progress-fill" id="roundedFill"></div>
      </div>
    </div>
    
    <div class="progress-item">
      <div class="progress-label">
        <span>평면 스타일</span>
        <span class="progress-value" id="flatValue">0%</span>
      </div>
      <div class="progress-bar flat" id="flatProgress">
        <div class="progress-fill" id="flatFill"></div>
      </div>
    </div>
  </div>
  
  <div class="demo-section">
    <h2>원형 프로그레스 바</h2>
    <div style="display: flex; justify-content: center; gap: 2rem; flex-wrap: wrap;">
      <div class="circular-progress">
        <svg>
          <circle class="bg-circle" cx="60" cy="60" r="45"></circle>
          <circle class="progress-circle" cx="60" cy="60" r="45" id="circularProgress"></circle>
        </svg>
        <div class="progress-text" id="circularText">0%</div>
      </div>
      
      <div class="circular-progress">
        <svg>
          <circle class="bg-circle" cx="60" cy="60" r="45"></circle>
          <circle class="progress-circle success" cx="60" cy="60" r="45" id="circularSuccess"></circle>
        </svg>
        <div class="progress-text" id="circularSuccessText">0%</div>
      </div>
    </div>
  </div>
  
  <div class="demo-section">
    <h2>단계별 프로그레스</h2>
    <div class="step-progress">
      <div class="step" id="step1">
        <div class="step-circle">1</div>
        <div class="step-label">시작</div>
      </div>
      <div class="step" id="step2">
        <div class="step-circle">2</div>
        <div class="step-label">진행</div>
      </div>
      <div class="step" id="step3">
        <div class="step-circle">3</div>
        <div class="step-label">검토</div>
      </div>
      <div class="step" id="step4">
        <div class="step-circle">4</div>
        <div class="step-label">완료</div>
      </div>
    </div>
  </div>
  
  <div class="demo-section">
    <h2>컨트롤</h2>
    <div class="controls">
      <button class="control-btn" id="startBtn">시작</button>
      <button class="control-btn" id="pauseBtn">일시정지</button>
      <button class="control-btn" id="resetBtn">리셋</button>
      <button class="control-btn" id="randomBtn">랜덤</button>
    </div>
    
    <div style="text-align: center; margin-top: 1rem;">
      <label for="speedSlider" style="color: #333; margin-right: 1rem;">속도:</label>
      <input type="range" id="speedSlider" min="1" max="10" value="5" style="width: 200px;">
      <span id="speedValue" style="color: #666; margin-left: 0.5rem;">5x</span>
    </div>
  </div>
</div>`,
    js: `// 프로그레스 바 관리 클래스
class ProgressBarManager {
  constructor() {
    this.progressBars = new Map();
    this.isRunning = false;
    this.speed = 5;
    this.animationId = null;
    this.currentStep = 0;
    this.totalSteps = 4;
    
    this.init();
  }
  
  init() {
    // 모든 프로그레스 바 요소 수집
    this.collectProgressBars();
    
    // 컨트롤 이벤트 설정
    this.setupControls();
    
    // 원형 프로그레스 바 설정
    this.setupCircularProgress();
    
    // 단계별 프로그레스 설정
    this.setupStepProgress();
    
    console.log('프로그레스 바 매니저가 초기화되었습니다!');
  }
  
  collectProgressBars() {
    const progressElements = [
      'basic', 'animate', 'success', 'warning', 'danger', 'info',
      'small', 'medium', 'large', 'striped', 'rounded', 'flat'
    ];
    
    progressElements.forEach(id => {
      const fillElement = document.getElementById(id + 'Fill');
      const valueElement = document.getElementById(id + 'Value');
      
      if (fillElement && valueElement) {
        this.progressBars.set(id, {
          fill: fillElement,
          value: valueElement,
          current: 0
        });
      }
    });
  }
  
  setupControls() {
    const startBtn = document.getElementById('startBtn');
    const pauseBtn = document.getElementById('pauseBtn');
    const resetBtn = document.getElementById('resetBtn');
    const randomBtn = document.getElementById('randomBtn');
    const speedSlider = document.getElementById('speedSlider');
    const speedValue = document.getElementById('speedValue');
    
    if (startBtn) startBtn.addEventListener('click', () => this.start());
    if (pauseBtn) pauseBtn.addEventListener('click', () => this.pause());
    if (resetBtn) resetBtn.addEventListener('click', () => this.reset());
    if (randomBtn) randomBtn.addEventListener('click', () => this.randomize());
    
    if (speedSlider && speedValue) {
      speedSlider.addEventListener('input', (e) => {
        this.speed = parseInt(e.target.value);
        speedValue.textContent = \`\${this.speed}x\`;
      });
    }
  }
  
  setupCircularProgress() {
    const circularProgress = document.getElementById('circularProgress');
    const circularText = document.getElementById('circularText');
    const circularSuccess = document.getElementById('circularSuccess');
    const circularSuccessText = document.getElementById('circularSuccessText');
    
    if (circularProgress && circularText) {
      this.progressBars.set('circular', {
        fill: circularProgress,
        value: circularText,
        current: 0,
        isCircular: true
      });
    }
    
    if (circularSuccess && circularSuccessText) {
      this.progressBars.set('circularSuccess', {
        fill: circularSuccess,
        value: circularSuccessText,
        current: 0,
        isCircular: true
      });
    }
  }
  
  setupStepProgress() {
    // 단계별 프로그레스 초기화
    this.updateStepProgress(0);
  }
  
  start() {
    if (this.isRunning) return;
    
    this.isRunning = true;
    this.updateControlButtons();
    this.animate();
    
    console.log('프로그레스 바 애니메이션 시작');
  }
  
  pause() {
    if (!this.isRunning) return;
    
    this.isRunning = false;
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
    this.updateControlButtons();
    
    console.log('프로그레스 바 애니메이션 일시정지');
  }
  
  reset() {
    this.isRunning = false;
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
    
    this.progressBars.forEach((bar, id) => {
      bar.current = 0;
      this.updateProgressBar(bar, 0);
    });
    
    this.currentStep = 0;
    this.updateStepProgress(0);
    this.updateControlButtons();
    
    console.log('프로그레스 바 리셋');
  }
  
  randomize() {
    this.progressBars.forEach((bar, id) => {
      const randomValue = Math.random() * 100;
      bar.current = randomValue;
      this.updateProgressBar(bar, randomValue);
    });
    
    const randomStep = Math.floor(Math.random() * (this.totalSteps + 1));
    this.updateStepProgress(randomStep);
    
    console.log('프로그레스 바 랜덤화');
  }
  
  animate() {
    if (!this.isRunning) return;
    
    this.progressBars.forEach((bar, id) => {
      if (bar.current < 100) {
        bar.current += this.speed * 0.5;
        if (bar.current > 100) bar.current = 100;
        
        this.updateProgressBar(bar, bar.current);
        
        // 단계별 프로그레스 업데이트
        if (id === 'basic') {
          const step = Math.floor((bar.current / 100) * this.totalSteps);
          this.updateStepProgress(step);
        }
      }
    });
    
    // 모든 프로그레스가 완료되었는지 확인
    const allComplete = Array.from(this.progressBars.values()).every(bar => bar.current >= 100);
    if (allComplete) {
      this.isRunning = false;
      this.updateControlButtons();
      console.log('모든 프로그레스 바 완료!');
    } else {
      this.animationId = requestAnimationFrame(() => this.animate());
    }
  }
  
  updateProgressBar(bar, value) {
    if (bar.isCircular) {
      // 원형 프로그레스 바
      const circumference = 2 * Math.PI * 45; // 반지름 45
      const offset = circumference - (value / 100) * circumference;
      bar.fill.style.strokeDashoffset = offset;
      bar.value.textContent = \`\${Math.round(value)}%\`;
    } else {
      // 일반 프로그레스 바
      bar.fill.style.width = \`\${value}%\`;
      bar.value.textContent = \`\${Math.round(value)}%\`;
    }
  }
  
  updateStepProgress(step) {
    for (let i = 1; i <= this.totalSteps; i++) {
      const stepElement = document.getElementById(\`step\${i}\`);
      if (stepElement) {
        stepElement.classList.remove('active', 'completed');
        
        if (i < step) {
          stepElement.classList.add('completed');
        } else if (i === step) {
          stepElement.classList.add('active');
        }
      }
    }
    this.currentStep = step;
  }
  
  updateControlButtons() {
    const startBtn = document.getElementById('startBtn');
    const pauseBtn = document.getElementById('pauseBtn');
    
    if (startBtn) {
      startBtn.classList.toggle('active', !this.isRunning);
      startBtn.disabled = this.isRunning;
    }
    
    if (pauseBtn) {
      pauseBtn.classList.toggle('active', this.isRunning);
      pauseBtn.disabled = !this.isRunning;
    }
  }
  
  // 프로그래밍 방식으로 프로그레스 설정
  setProgress(id, value) {
    const bar = this.progressBars.get(id);
    if (bar) {
      bar.current = Math.max(0, Math.min(100, value));
      this.updateProgressBar(bar, bar.current);
    }
  }
  
  // 프로그레스 바 추가
  addProgressBar(id, fillElement, valueElement) {
    this.progressBars.set(id, {
      fill: fillElement,
      value: valueElement,
      current: 0
    });
  }
  
  // 프로그레스 바 제거
  removeProgressBar(id) {
    this.progressBars.delete(id);
  }
  
  // 모든 프로그레스 바 정보 반환
  getProgressInfo() {
    const info = {};
    this.progressBars.forEach((bar, id) => {
      info[id] = {
        current: bar.current,
        percentage: Math.round(bar.current)
      };
    });
    return info;
  }
}

// 페이지 로드 시 프로그레스 바 매니저 초기화
document.addEventListener('DOMContentLoaded', () => {
  window.progressBarManager = new ProgressBarManager();
  
  // 자동 시작 (3초 후)
  setTimeout(() => {
    window.progressBarManager.start();
  }, 3000);
});`,
  },
];
