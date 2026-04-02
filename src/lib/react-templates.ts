export interface ReactTemplate {
  id: string;
  name: string;
  description: string;
  jsx: string;
  css: string;
}

export const reactTemplates: ReactTemplate[] = [
  {
    id: 'counter',
    name: '카운터',
    description: '클릭으로 숫자를 증가시키는 간단한 카운터',
    jsx: `function App() {
  const [count, setCount] = React.useState(0);

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h1>카운터</h1>
      <p style={{ fontSize: '24px', margin: '20px 0' }}>카운트: {count}</p>
      <button 
        onClick={() => setCount(count + 1)}
        style={{
          padding: '10px 20px',
          fontSize: '16px',
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          margin: '0 5px'
        }}
      >
        증가
      </button>
      <button 
        onClick={() => setCount(count - 1)}
        style={{
          padding: '10px 20px',
          fontSize: '16px',
          backgroundColor: '#dc3545',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          margin: '0 5px'
        }}
      >
        감소
      </button>
      <button 
        onClick={() => setCount(0)}
        style={{
          padding: '10px 20px',
          fontSize: '16px',
          backgroundColor: '#6c757d',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          margin: '0 5px'
        }}
      >
        리셋
      </button>
    </div>
  );
}`,
    css: `/* 카운터 스타일 */
body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
  margin: 0;
  padding: 0;
  background-color: #f5f5f5;
}

button:hover {
  opacity: 0.8;
  transform: translateY(-1px);
  transition: all 0.2s ease;
}`
  },
  {
    id: 'todo-list',
    name: '할 일 목록',
    description: '할 일을 추가하고 완료 처리할 수 있는 목록',
    jsx: `function App() {
  const [todos, setTodos] = React.useState([
    { id: 1, text: '리액트 공부하기', completed: false },
    { id: 2, text: '프로젝트 완성하기', completed: true }
  ]);
  const [newTodo, setNewTodo] = React.useState('');

  const addTodo = () => {
    if (newTodo.trim()) {
      setTodos([...todos, {
        id: Date.now(),
        text: newTodo,
        completed: false
      }]);
      setNewTodo('');
    }
  };

  const toggleTodo = (id) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  return (
    <div style={{ padding: '20px', maxWidth: '500px', margin: '0 auto' }}>
      <h1 style={{ textAlign: 'center', color: '#333' }}>할 일 목록</h1>
      
      <div style={{ display: 'flex', marginBottom: '20px' }}>
        <input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && addTodo()}
          placeholder="새로운 할 일을 입력하세요"
          style={{
            flex: 1,
            padding: '10px',
            fontSize: '16px',
            border: '2px solid #ddd',
            borderRadius: '5px 0 0 5px',
            outline: 'none'
          }}
        />
        <button
          onClick={addTodo}
          style={{
            padding: '10px 20px',
            fontSize: '16px',
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '0 5px 5px 0',
            cursor: 'pointer'
          }}
        >
          추가
        </button>
      </div>

      <div>
        {todos.map(todo => (
          <div
            key={todo.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '10px',
              margin: '5px 0',
              backgroundColor: todo.completed ? '#f8f9fa' : 'white',
              border: '1px solid #ddd',
              borderRadius: '5px',
              textDecoration: todo.completed ? 'line-through' : 'none',
              opacity: todo.completed ? 0.7 : 1
            }}
          >
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => toggleTodo(todo.id)}
              style={{ marginRight: '10px', transform: 'scale(1.2)' }}
            />
            <span style={{ flex: 1, fontSize: '16px' }}>{todo.text}</span>
            <button
              onClick={() => deleteTodo(todo.id)}
              style={{
                padding: '5px 10px',
                fontSize: '12px',
                backgroundColor: '#dc3545',
                color: 'white',
                border: 'none',
                borderRadius: '3px',
                cursor: 'pointer'
              }}
            >
              삭제
            </button>
          </div>
        ))}
      </div>

      <div style={{ textAlign: 'center', marginTop: '20px', color: '#666' }}>
        총 {todos.length}개 중 {todos.filter(t => t.completed).length}개 완료
      </div>
    </div>
  );
}`,
    css: `/* 할 일 목록 스타일 */
body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
  margin: 0;
  padding: 0;
  background-color: #f5f5f5;
}

input:focus {
  border-color: #007bff !important;
  box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
}

button:hover {
  opacity: 0.8;
  transform: translateY(-1px);
  transition: all 0.2s ease;
}

div[style*="backgroundColor: white"]:hover {
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
  transition: box-shadow 0.2s ease;
}`
  },
  {
    id: 'contact-form',
    name: '연락처 폼',
    description: '사용자 정보를 입력받는 유효성 검사가 포함된 폼',
    jsx: `function App() {
  const [formData, setFormData] = React.useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [errors, setErrors] = React.useState({});
  const [isSubmitted, setIsSubmitted] = React.useState(false);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = '이름을 입력해주세요';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = '이메일을 입력해주세요';
    } else if (!/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(formData.email)) {
      newErrors.email = '올바른 이메일 형식이 아닙니다';
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = '전화번호를 입력해주세요';
    } else if (!/^\\d{3}-\\d{4}-\\d{4}$/.test(formData.phone)) {
      newErrors.phone = '올바른 전화번호 형식이 아닙니다 (예: 010-1234-5678)';
    }
    
    if (!formData.message.trim()) {
      newErrors.message = '메시지를 입력해주세요';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      setIsSubmitted(true);
      console.log('폼 데이터:', formData);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // 실시간 유효성 검사
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const resetForm = () => {
    setFormData({ name: '', email: '', phone: '', message: '' });
    setErrors({});
    setIsSubmitted(false);
  };

  if (isSubmitted) {
    return (
      <div style={{ padding: '20px', maxWidth: '500px', margin: '0 auto', textAlign: 'center' }}>
        <div style={{
          backgroundColor: '#d4edda',
          color: '#155724',
          padding: '20px',
          borderRadius: '10px',
          border: '1px solid #c3e6cb'
        }}>
          <h2 style={{ margin: '0 0 10px 0' }}>✅ 제출 완료!</h2>
          <p style={{ margin: '0 0 20px 0' }}>연락처 정보가 성공적으로 전송되었습니다.</p>
          <button
            onClick={resetForm}
            style={{
              padding: '10px 20px',
              fontSize: '16px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            새로 작성하기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', maxWidth: '500px', margin: '0 auto' }}>
      <h1 style={{ textAlign: 'center', color: '#333', marginBottom: '30px' }}>연락처 폼</h1>
      
      <form onSubmit={handleSubmit} style={{
        backgroundColor: 'white',
        padding: '30px',
        borderRadius: '10px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
      }}>
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#333' }}>
            이름 *
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            style={{
              width: '100%',
              padding: '12px',
              fontSize: '16px',
              border: errors.name ? '2px solid #dc3545' : '2px solid #ddd',
              borderRadius: '5px',
              outline: 'none',
              boxSizing: 'border-box'
            }}
            placeholder="이름을 입력하세요"
          />
          {errors.name && (
            <span style={{ color: '#dc3545', fontSize: '14px', marginTop: '5px', display: 'block' }}>
              {errors.name}
            </span>
          )}
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#333' }}>
            이메일 *
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            style={{
              width: '100%',
              padding: '12px',
              fontSize: '16px',
              border: errors.email ? '2px solid #dc3545' : '2px solid #ddd',
              borderRadius: '5px',
              outline: 'none',
              boxSizing: 'border-box'
            }}
            placeholder="example@email.com"
          />
          {errors.email && (
            <span style={{ color: '#dc3545', fontSize: '14px', marginTop: '5px', display: 'block' }}>
              {errors.email}
            </span>
          )}
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#333' }}>
            전화번호 *
          </label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            style={{
              width: '100%',
              padding: '12px',
              fontSize: '16px',
              border: errors.phone ? '2px solid #dc3545' : '2px solid #ddd',
              borderRadius: '5px',
              outline: 'none',
              boxSizing: 'border-box'
            }}
            placeholder="010-1234-5678"
          />
          {errors.phone && (
            <span style={{ color: '#dc3545', fontSize: '14px', marginTop: '5px', display: 'block' }}>
              {errors.phone}
            </span>
          )}
        </div>

        <div style={{ marginBottom: '30px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#333' }}>
            메시지 *
          </label>
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            rows="4"
            style={{
              width: '100%',
              padding: '12px',
              fontSize: '16px',
              border: errors.message ? '2px solid #dc3545' : '2px solid #ddd',
              borderRadius: '5px',
              outline: 'none',
              resize: 'vertical',
              boxSizing: 'border-box',
              fontFamily: 'inherit'
            }}
            placeholder="메시지를 입력하세요"
          />
          {errors.message && (
            <span style={{ color: '#dc3545', fontSize: '14px', marginTop: '5px', display: 'block' }}>
              {errors.message}
            </span>
          )}
        </div>

        <button
          type="submit"
          style={{
            width: '100%',
            padding: '15px',
            fontSize: '18px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          제출하기
        </button>
      </form>
    </div>
  );
}`,
    css: `/* 연락처 폼 스타일 */
body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
  margin: 0;
  padding: 0;
  background-color: #f5f5f5;
}

input:focus, textarea:focus {
  border-color: #007bff !important;
  box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
}

button:hover {
  opacity: 0.9;
  transform: translateY(-1px);
  transition: all 0.2s ease;
}

form {
  transition: box-shadow 0.3s ease;
}

form:hover {
  box-shadow: 0 4px 20px rgba(0,0,0,0.15) !important;
}`
  },
  {
    id: 'timer-stopwatch',
    name: '타이머 & 스톱워치',
    description: '타이머와 스톱워치 기능을 제공하는 시간 관리 도구',
    jsx: `function App() {
  const [mode, setMode] = useState('stopwatch');
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [timerMinutes, setTimerMinutes] = useState(5);
  const [timerSeconds, setTimerSeconds] = useState(0);

  useEffect(() => {
    if (!isRunning) return;
    
    const interval = setInterval(() => {
      setTime(prev => {
        if (mode === 'stopwatch') {
          return prev + 1;
        } else {
          const newTime = prev - 1;
          if (newTime <= 0) {
            setIsRunning(false);
            return 0;
          }
          return newTime;
        }
      });
    }, 1000);
    
    return () => clearInterval(interval);
  }, [isRunning, mode]);

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return hours.toString().padStart(2, '0') + ':' + minutes.toString().padStart(2, '0') + ':' + secs.toString().padStart(2, '0');
    }
    return minutes.toString().padStart(2, '0') + ':' + secs.toString().padStart(2, '0');
  };

  const start = () => {
    if (mode === 'timer' && time === 0) {
      setTime(timerMinutes * 60 + timerSeconds);
    }
    setIsRunning(true);
  };

  const stop = () => {
    setIsRunning(false);
  };

  const reset = () => {
    setIsRunning(false);
    if (mode === 'stopwatch') {
      setTime(0);
    } else {
      setTime(0);
    }
  };

  const setTimer = () => {
    setTime(timerMinutes * 60 + timerSeconds);
  };

  return (
    <div style={{ padding: '20px', maxWidth: '500px', margin: '0 auto', textAlign: 'center' }}>
      <h1 style={{ color: '#333', marginBottom: '30px' }}>⏱️ 타이머 & 스톱워치</h1>
      
      {/* 모드 선택 */}
      <div style={{ marginBottom: '30px' }}>
        <button
          onClick={() => {
            setMode('stopwatch');
            reset();
          }}
          style={{
            padding: '10px 20px',
            fontSize: '16px',
            backgroundColor: mode === 'stopwatch' ? '#007bff' : '#6c757d',
            color: 'white',
            border: 'none',
            borderRadius: '5px 0 0 5px',
            cursor: 'pointer'
          }}
        >
          스톱워치
        </button>
        <button
          onClick={() => {
            setMode('timer');
            reset();
          }}
          style={{
            padding: '10px 20px',
            fontSize: '16px',
            backgroundColor: mode === 'timer' ? '#007bff' : '#6c757d',
            color: 'white',
            border: 'none',
            borderRadius: '0 5px 5px 0',
            cursor: 'pointer'
          }}
        >
          타이머
        </button>
      </div>

      {/* 시간 표시 */}
      <div style={{
        fontSize: '72px',
        fontWeight: 'bold',
        color: isRunning ? '#28a745' : '#333',
        margin: '30px 0',
        fontFamily: 'monospace',
        textShadow: '2px 2px 4px rgba(0,0,0,0.1)'
      }}>
        {formatTime(time)}
      </div>

      {/* 타이머 설정 */}
      {mode === 'timer' && !isRunning && (
        <div style={{
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '10px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
          marginBottom: '20px'
        }}>
          <h3 style={{ margin: '0 0 15px 0', color: '#333' }}>타이머 설정</h3>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '14px', color: '#666', marginBottom: '5px' }}>분</label>
              <input
                type="number"
                min="0"
                max="59"
                value={timerMinutes}
                onChange={(e) => setTimerMinutes(parseInt(e.target.value) || 0)}
                style={{
                  width: '60px',
                  padding: '8px',
                  fontSize: '16px',
                  textAlign: 'center',
                  border: '2px solid #ddd',
                  borderRadius: '5px',
                  outline: 'none'
                }}
              />
            </div>
            <span style={{ fontSize: '24px', color: '#666' }}>:</span>
            <div>
              <label style={{ display: 'block', fontSize: '14px', color: '#666', marginBottom: '5px' }}>초</label>
              <input
                type="number"
                min="0"
                max="59"
                value={timerSeconds}
                onChange={(e) => setTimerSeconds(parseInt(e.target.value) || 0)}
                style={{
                  width: '60px',
                  padding: '8px',
                  fontSize: '16px',
                  textAlign: 'center',
                  border: '2px solid #ddd',
                  borderRadius: '5px',
                  outline: 'none'
                }}
              />
            </div>
          </div>
          <button
            onClick={setTimer}
            style={{
              marginTop: '15px',
              padding: '8px 16px',
              fontSize: '14px',
              backgroundColor: '#17a2b8',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            설정 적용
          </button>
        </div>
      )}

      {/* 컨트롤 버튼 */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
        {!isRunning ? (
          <button
            onClick={start}
            style={{
              padding: '15px 30px',
              fontSize: '18px',
              backgroundColor: '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '10px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            ▶️ 시작
          </button>
        ) : (
          <button
            onClick={stop}
            style={{
              padding: '15px 30px',
              fontSize: '18px',
              backgroundColor: '#dc3545',
              color: 'white',
              border: 'none',
              borderRadius: '10px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            ⏸️ 일시정지
          </button>
        )}
        
        <button
          onClick={reset}
          style={{
            padding: '15px 30px',
            fontSize: '18px',
            backgroundColor: '#6c757d',
            color: 'white',
            border: 'none',
            borderRadius: '10px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          🔄 리셋
        </button>
      </div>

      {/* 상태 표시 */}
      <div style={{ marginTop: '20px', color: '#666' }}>
        {isRunning ? (
          <span style={{ color: '#28a745', fontWeight: 'bold' }}>실행 중...</span>
        ) : (
          <span>대기 중</span>
        )}
      </div>
    </div>
  );
}`,
    css: `/* 타이머 & 스톱워치 스타일 */
body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
  margin: 0;
  padding: 0;
  background-color: #f5f5f5;
}

input:focus {
  border-color: #007bff !important;
  box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
}

button:hover {
  opacity: 0.9;
  transform: translateY(-2px);
  transition: all 0.2s ease;
}

button:active {
  transform: translateY(0);
}

@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
}

div[style*="fontSize: 72px"] {
  animation: pulse 2s infinite;
}`
  },
  {
    id: 'weather-widget',
    name: '날씨 위젯',
    description: '여러 도시의 날씨 정보를 표시하는 위젯',
    jsx: `function App() {
  const [weatherData, setWeatherData] = React.useState([
    { city: '서울', temp: 22, condition: '맑음', humidity: 65, wind: 12 },
    { city: '부산', temp: 25, condition: '흐림', humidity: 78, wind: 8 },
    { city: '제주', temp: 28, condition: '비', humidity: 85, wind: 15 },
    { city: '대구', temp: 24, condition: '맑음', humidity: 60, wind: 10 }
  ]);
  const [selectedCity, setSelectedCity] = React.useState('서울');
  const [newCity, setNewCity] = React.useState('');

  const getWeatherIcon = (condition) => {
    if (condition === '맑음') return '☀️';
    if (condition === '흐림') return '☁️';
    if (condition === '비') return '🌧️';
    if (condition === '눈') return '❄️';
    if (condition === '구름많음') return '⛅';
    return '🌤️';
  };

  const addCity = () => {
    if (newCity.trim() && !weatherData.find(w => w.city === newCity)) {
      const conditions = ['맑음', '흐림', '비', '구름많음'];
      const newWeather = {
        city: newCity,
        temp: Math.floor(Math.random() * 15) + 15,
        condition: conditions[Math.floor(Math.random() * conditions.length)],
        humidity: Math.floor(Math.random() * 30) + 50,
        wind: Math.floor(Math.random() * 20) + 5
      };
      setWeatherData([...weatherData, newWeather]);
      setNewCity('');
    }
  };

  const removeCity = (city) => {
    const newWeatherData = weatherData.filter(w => w.city !== city);
    setWeatherData(newWeatherData);
    if (selectedCity === city && newWeatherData.length > 0) {
      setSelectedCity(newWeatherData[0].city);
    }
  };

  const selectedWeather = weatherData.find(w => w.city === selectedCity);

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ textAlign: 'center', color: '#333', marginBottom: '30px' }}>🌤️ 날씨 위젯</h1>
      
      {/* 도시 추가 */}
      <div style={{
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '10px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        marginBottom: '20px'
      }}>
        <h3 style={{ margin: '0 0 15px 0', color: '#333' }}>새 도시 추가</h3>
        <div style={{ display: 'flex', gap: '10px' }}>
          <input
            type="text"
            value={newCity}
            onChange={(e) => setNewCity(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addCity()}
            placeholder="도시 이름을 입력하세요"
            style={{
              flex: 1,
              padding: '10px',
              fontSize: '16px',
              border: '2px solid #ddd',
              borderRadius: '5px',
              outline: 'none'
            }}
          />
          <button
            onClick={addCity}
            style={{
              padding: '10px 20px',
              fontSize: '16px',
              backgroundColor: '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            추가
          </button>
        </div>
      </div>

      {/* 도시 목록 */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '20px' }}>
        {weatherData.map(weather => (
          <button
            key={weather.city}
            onClick={() => setSelectedCity(weather.city)}
            style={{
              padding: '10px 15px',
              fontSize: '14px',
              backgroundColor: selectedCity === weather.city ? '#007bff' : 'white',
              color: selectedCity === weather.city ? 'white' : '#333',
              border: '2px solid #ddd',
              borderRadius: '20px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '5px'
            }}
          >
            <span>{getWeatherIcon(weather.condition)}</span>
            <span>{weather.city}</span>
            <span style={{ fontSize: '12px' }}>{weather.temp}°C</span>
            <span
              onClick={(e) => {
                e.stopPropagation();
                removeCity(weather.city);
              }}
              style={{
                marginLeft: '5px',
                background: 'none',
                border: 'none',
                color: 'inherit',
                cursor: 'pointer',
                fontSize: '12px',
                padding: '2px 4px',
                borderRadius: '50%',
                backgroundColor: 'rgba(255,255,255,0.3)',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                minWidth: '16px',
                minHeight: '16px'
              }}
            >
              ✕
            </span>
          </button>
        ))}
      </div>

      {/* 선택된 도시의 상세 날씨 */}
      {selectedWeather && (
        <div style={{
          backgroundColor: 'white',
          padding: '30px',
          borderRadius: '15px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
          textAlign: 'center',
          background: '#f8f9fa'
        }}>
          <h2 style={{ margin: '0 0 10px 0', color: '#333' }}>{selectedWeather.city}</h2>
          <div style={{ fontSize: '80px', margin: '20px 0' }}>
            {getWeatherIcon(selectedWeather.condition)}
          </div>
          <div style={{ fontSize: '48px', fontWeight: 'bold', color: '#333', margin: '10px 0' }}>
            {selectedWeather.temp}°C
          </div>
          <div style={{ fontSize: '24px', color: '#666', marginBottom: '30px' }}>
            {selectedWeather.condition}
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '20px' }}>
            <div style={{
              backgroundColor: 'rgba(255,255,255,0.7)',
              padding: '15px',
              borderRadius: '10px'
            }}>
              <div style={{ fontSize: '14px', color: '#666', marginBottom: '5px' }}>습도</div>
              <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#333' }}>
                {selectedWeather.humidity}%
              </div>
            </div>
            <div style={{
              backgroundColor: 'rgba(255,255,255,0.7)',
              padding: '15px',
              borderRadius: '10px'
            }}>
              <div style={{ fontSize: '14px', color: '#666', marginBottom: '5px' }}>풍속</div>
              <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#333' }}>
                {selectedWeather.wind} km/h
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 전체 도시 요약 */}
      <div style={{
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '10px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        marginTop: '20px'
      }}>
        <h3 style={{ margin: '0 0 15px 0', color: '#333' }}>전체 도시 요약</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '15px' }}>
          {weatherData.map(weather => (
            <div
              key={weather.city}
              style={{
                padding: '15px',
                backgroundColor: '#f8f9fa',
                borderRadius: '8px',
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'transform 0.2s ease'
              }}
              onClick={() => setSelectedCity(weather.city)}
            >
              <div style={{ fontSize: '24px', marginBottom: '5px' }}>
                {getWeatherIcon(weather.condition)}
              </div>
              <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#333' }}>
                {weather.city}
              </div>
              <div style={{ fontSize: '18px', color: '#666' }}>
                {weather.temp}°C
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}`,
    css: `/* 날씨 위젯 스타일 */
body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
  margin: 0;
  padding: 0;
  background-color: #f5f5f5;
}

input:focus {
  border-color: #007bff !important;
  box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
}

button:hover {
  opacity: 0.9;
  transform: translateY(-1px);
  transition: all 0.2s ease;
}

div[style*="cursor: pointer"]:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(0,0,0,0.2) !important;
}

@keyframes weatherPulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.1); }
  100% { transform: scale(1); }
}

div[style*="fontSize: 80px"] {
  animation: weatherPulse 3s infinite;
}`
  },
  {
    id: 'image-gallery',
    name: '이미지 갤러리',
    description: '이미지를 업로드하고 관리할 수 있는 갤러리',
    jsx: `function App() {
  const [images, setImages] = useState([
    {
      id: 1,
      url: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPuaXoOazleWQjeWtlzwvdGV4dD48L3N2Zz4=',
      title: '자연 풍경 1',
      description: '아름다운 자연의 모습'
    },
    {
      id: 2,
      url: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjY2NjIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPuWQjeWtl+WQjeWtlzwvdGV4dD48L3N2Zz4=',
      title: '도시 스카이라인',
      description: '현대적인 도시의 모습'
    },
    {
      id: 3,
      url: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjYWFhIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPuWQjeWtl+WQjeWtlzwvdGV4dD48L3N2Zz4=',
      title: '바다 풍경',
      description: '평화로운 바다의 모습'
    }
  ]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [newImage, setNewImage] = useState({ title: '', description: '' });

  const addImage = () => {
    if (newImage.title.trim()) {
      const newId = Math.max(...images.map(img => img.id), 0) + 1;
      const newImg = {
        id: newId,
        url: 'https://picsum.photos/300/200?random=' + (newId + 10),
        title: newImage.title,
        description: newImage.description
      };
      setImages([...images, newImg]);
      setNewImage({ title: '', description: '' });
    }
  };

  const removeImage = (id) => {
    setImages(images.filter(img => img.id !== id));
    if (selectedImage && selectedImage.id === id) {
      setSelectedImage(null);
    }
  };

  const openModal = (image) => {
    setSelectedImage(image);
  };

  const closeModal = () => {
    setSelectedImage(null);
  };

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ textAlign: 'center', color: '#333', marginBottom: '30px' }}>🖼️ 이미지 갤러리</h1>
      
      {/* 새 이미지 추가 */}
      <div style={{
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '10px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        marginBottom: '20px'
      }}>
        <h3 style={{ margin: '0 0 15px 0', color: '#333' }}>새 이미지 추가</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <input
            type="text"
            value={newImage.title}
            onChange={(e) => setNewImage({...newImage, title: e.target.value})}
            placeholder="이미지 제목을 입력하세요"
            style={{
              padding: '10px',
              fontSize: '16px',
              border: '2px solid #ddd',
              borderRadius: '5px',
              outline: 'none'
            }}
          />
          <input
            type="text"
            value={newImage.description}
            onChange={(e) => setNewImage({...newImage, description: e.target.value})}
            placeholder="이미지 설명을 입력하세요"
            style={{
              padding: '10px',
              fontSize: '16px',
              border: '2px solid #ddd',
              borderRadius: '5px',
              outline: 'none'
            }}
          />
          <button
            onClick={addImage}
            style={{
              padding: '10px 20px',
              fontSize: '16px',
              backgroundColor: '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              alignSelf: 'flex-start'
            }}
          >
            이미지 추가
          </button>
        </div>
      </div>

      {/* 뷰 모드 선택 */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={() => setViewMode('grid')}
            style={{
              padding: '8px 16px',
              fontSize: '14px',
              backgroundColor: viewMode === 'grid' ? '#007bff' : '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            그리드 뷰
          </button>
          <button
            onClick={() => setViewMode('list')}
            style={{
              padding: '8px 16px',
              fontSize: '14px',
              backgroundColor: viewMode === 'list' ? '#007bff' : '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            리스트 뷰
          </button>
        </div>
        <div style={{ color: '#666' }}>
          총 {images.length}개의 이미지
        </div>
      </div>

      {/* 이미지 갤러리 */}
      <div style={{
        display: viewMode === 'grid' ? 'grid' : 'flex',
        gridTemplateColumns: viewMode === 'grid' ? 'repeat(auto-fill, minmax(300px, 1fr))' : 'none',
        flexDirection: viewMode === 'list' ? 'column' : 'row',
        gap: '20px'
      }}>
        {images.map(image => (
          <div
            key={image.id}
            style={{
              backgroundColor: 'white',
              borderRadius: '10px',
              boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
              overflow: 'hidden',
              cursor: 'pointer',
              transition: 'transform 0.2s ease'
            }}
            onClick={() => openModal(image)}
          >
            <div style={{ position: 'relative' }}>
              <img
                src={image.url}
                alt={image.title}
                style={{
                  width: '100%',
                  height: viewMode === 'grid' ? '200px' : '150px',
                  objectFit: 'cover'
                }}
              />
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeImage(image.id);
                }}
                style={{
                  position: 'absolute',
                  top: '10px',
                  right: '10px',
                  background: 'rgba(220, 53, 69, 0.8)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '50%',
                  width: '30px',
                  height: '30px',
                  cursor: 'pointer',
                  fontSize: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                ✕
              </button>
            </div>
            <div style={{ padding: '15px' }}>
              <h3 style={{ margin: '0 0 5px 0', color: '#333', fontSize: '18px' }}>
                {image.title}
              </h3>
              <p style={{ margin: '0', color: '#666', fontSize: '14px' }}>
                {image.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* 이미지 모달 */}
      {selectedImage && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
          }}
          onClick={closeModal}
        >
          <div
            style={{
              backgroundColor: 'white',
              borderRadius: '10px',
              maxWidth: '90vw',
              maxHeight: '90vh',
              overflow: 'hidden',
              position: 'relative'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closeModal}
              style={{
                position: 'absolute',
                top: '10px',
                right: '10px',
                background: 'rgba(0,0,0,0.5)',
                color: 'white',
                border: 'none',
                borderRadius: '50%',
                width: '40px',
                height: '40px',
                cursor: 'pointer',
                fontSize: '20px',
                zIndex: 1001
              }}
            >
              ✕
            </button>
            <img
              src={selectedImage.url}
              alt={selectedImage.title}
              style={{
                width: '100%',
                height: 'auto',
                maxHeight: '70vh',
                objectFit: 'contain'
              }}
            />
            <div style={{ padding: '20px' }}>
              <h2 style={{ margin: '0 0 10px 0', color: '#333' }}>
                {selectedImage.title}
              </h2>
              <p style={{ margin: '0', color: '#666' }}>
                {selectedImage.description}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}`,
    css: `/* 이미지 갤러리 스타일 */
body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
  margin: 0;
  padding: 0;
  background-color: #f5f5f5;
}

input:focus {
  border-color: #007bff !important;
  box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
}

button:hover {
  opacity: 0.9;
  transform: translateY(-1px);
  transition: all 0.2s ease;
}

div[style*="cursor: pointer"]:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 20px rgba(0,0,0,0.15) !important;
}

img {
  transition: transform 0.3s ease;
}

div[style*="cursor: pointer"]:hover img {
  transform: scale(1.05);
}

@keyframes fadeIn {
  from { opacity: 0; transform: scale(0.9); }
  to { opacity: 1; transform: scale(1); }
}

div[style*="position: fixed"] {
  animation: fadeIn 0.3s ease;
}`
  },
  {
    id: 'calculator',
    name: '계산기',
    description: '기본적인 사칙연산을 수행할 수 있는 계산기',
    jsx: `function App() {
  const [display, setDisplay] = React.useState('0');
  const [previousValue, setPreviousValue] = React.useState(null);
  const [operation, setOperation] = React.useState(null);
  const [waitingForOperand, setWaitingForOperand] = React.useState(false);

  const inputNumber = (num) => {
    if (waitingForOperand) {
      setDisplay(String(num));
      setWaitingForOperand(false);
    } else {
      setDisplay(display === '0' ? String(num) : display + num);
    }
  };

  const inputDecimal = () => {
    if (waitingForOperand) {
      setDisplay('0.');
      setWaitingForOperand(false);
    } else if (display.indexOf('.') === -1) {
      setDisplay(display + '.');
    }
  };

  const clear = () => {
    setDisplay('0');
    setPreviousValue(null);
    setOperation(null);
    setWaitingForOperand(false);
  };

  const performOperation = (nextOperation) => {
    const inputValue = parseFloat(display);

    if (previousValue === null) {
      setPreviousValue(inputValue);
    } else if (operation) {
      const currentValue = previousValue || 0;
      const newValue = calculate(currentValue, inputValue, operation);

      setDisplay(String(newValue));
      setPreviousValue(newValue);
    }

    setWaitingForOperand(true);
    setOperation(nextOperation);
  };

  const calculate = (firstValue, secondValue, operation) => {
    switch (operation) {
      case '+':
        return firstValue + secondValue;
      case '-':
        return firstValue - secondValue;
      case '×':
        return firstValue * secondValue;
      case '÷':
        return firstValue / secondValue;
      case '=':
        return secondValue;
      default:
        return secondValue;
    }
  };

  const handleEquals = () => {
    const inputValue = parseFloat(display);

    if (previousValue !== null && operation) {
      const newValue = calculate(previousValue, inputValue, operation);
      setDisplay(String(newValue));
      setPreviousValue(null);
      setOperation(null);
      setWaitingForOperand(true);
    }
  };

  const handleBackspace = () => {
    if (display.length > 1) {
      setDisplay(display.slice(0, -1));
    } else {
      setDisplay('0');
    }
  };

  const formatDisplay = (value) => {
    const num = parseFloat(value);
    if (isNaN(num)) return '0';
    
    // 소수점 이하 8자리까지만 표시
    if (num.toString().length > 12) {
      return num.toExponential(6);
    }
    return value;
  };

  return (
    <div style={{ padding: '20px', maxWidth: '400px', margin: '0 auto' }}>
      <h1 style={{ textAlign: 'center', color: '#333', marginBottom: '30px' }}>🧮 계산기</h1>
      
      <div style={{
        backgroundColor: '#1a1a1a',
        borderRadius: '20px',
        padding: '20px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.3)'
      }}>
        {/* 디스플레이 */}
        <div style={{
          backgroundColor: '#000',
          color: '#fff',
          padding: '20px',
          borderRadius: '10px',
          marginBottom: '20px',
          textAlign: 'right',
          fontSize: '32px',
          fontFamily: 'monospace',
          minHeight: '60px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          overflow: 'hidden'
        }}>
          {formatDisplay(display)}
        </div>

        {/* 버튼 그리드 */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '10px'
        }}>
          {/* 첫 번째 행 */}
          <button
            onClick={clear}
            style={{
              padding: '20px',
              fontSize: '18px',
              backgroundColor: '#ff6b6b',
              color: 'white',
              border: 'none',
              borderRadius: '10px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            C
          </button>
          <button
            onClick={handleBackspace}
            style={{
              padding: '20px',
              fontSize: '18px',
              backgroundColor: '#ffa726',
              color: 'white',
              border: 'none',
              borderRadius: '10px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            ⌫
          </button>
          <button
            onClick={() => performOperation('÷')}
            style={{
              padding: '20px',
              fontSize: '18px',
              backgroundColor: '#42a5f5',
              color: 'white',
              border: 'none',
              borderRadius: '10px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            ÷
          </button>
          <button
            onClick={() => performOperation('×')}
            style={{
              padding: '20px',
              fontSize: '18px',
              backgroundColor: '#42a5f5',
              color: 'white',
              border: 'none',
              borderRadius: '10px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            ×
          </button>

          {/* 두 번째 행 */}
          <button
            onClick={() => inputNumber(7)}
            style={{
              padding: '20px',
              fontSize: '18px',
              backgroundColor: '#66bb6a',
              color: 'white',
              border: 'none',
              borderRadius: '10px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            7
          </button>
          <button
            onClick={() => inputNumber(8)}
            style={{
              padding: '20px',
              fontSize: '18px',
              backgroundColor: '#66bb6a',
              color: 'white',
              border: 'none',
              borderRadius: '10px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            8
          </button>
          <button
            onClick={() => inputNumber(9)}
            style={{
              padding: '20px',
              fontSize: '18px',
              backgroundColor: '#66bb6a',
              color: 'white',
              border: 'none',
              borderRadius: '10px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            9
          </button>
          <button
            onClick={() => performOperation('-')}
            style={{
              padding: '20px',
              fontSize: '18px',
              backgroundColor: '#42a5f5',
              color: 'white',
              border: 'none',
              borderRadius: '10px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            -
          </button>

          {/* 세 번째 행 */}
          <button
            onClick={() => inputNumber(4)}
            style={{
              padding: '20px',
              fontSize: '18px',
              backgroundColor: '#66bb6a',
              color: 'white',
              border: 'none',
              borderRadius: '10px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            4
          </button>
          <button
            onClick={() => inputNumber(5)}
            style={{
              padding: '20px',
              fontSize: '18px',
              backgroundColor: '#66bb6a',
              color: 'white',
              border: 'none',
              borderRadius: '10px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            5
          </button>
          <button
            onClick={() => inputNumber(6)}
            style={{
              padding: '20px',
              fontSize: '18px',
              backgroundColor: '#66bb6a',
              color: 'white',
              border: 'none',
              borderRadius: '10px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            6
          </button>
          <button
            onClick={() => performOperation('+')}
            style={{
              padding: '20px',
              fontSize: '18px',
              backgroundColor: '#42a5f5',
              color: 'white',
              border: 'none',
              borderRadius: '10px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            +
          </button>

          {/* 네 번째 행 */}
          <button
            onClick={() => inputNumber(1)}
            style={{
              padding: '20px',
              fontSize: '18px',
              backgroundColor: '#66bb6a',
              color: 'white',
              border: 'none',
              borderRadius: '10px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            1
          </button>
          <button
            onClick={() => inputNumber(2)}
            style={{
              padding: '20px',
              fontSize: '18px',
              backgroundColor: '#66bb6a',
              color: 'white',
              border: 'none',
              borderRadius: '10px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            2
          </button>
          <button
            onClick={() => inputNumber(3)}
            style={{
              padding: '20px',
              fontSize: '18px',
              backgroundColor: '#66bb6a',
              color: 'white',
              border: 'none',
              borderRadius: '10px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            3
          </button>
          <button
            onClick={handleEquals}
            style={{
              padding: '20px',
              fontSize: '18px',
              backgroundColor: '#ab47bc',
              color: 'white',
              border: 'none',
              borderRadius: '10px',
              cursor: 'pointer',
              fontWeight: 'bold',
              gridRow: 'span 2'
            }}
          >
            =
          </button>

          {/* 다섯 번째 행 */}
          <button
            onClick={() => inputNumber(0)}
            style={{
              padding: '20px',
              fontSize: '18px',
              backgroundColor: '#66bb6a',
              color: 'white',
              border: 'none',
              borderRadius: '10px',
              cursor: 'pointer',
              fontWeight: 'bold',
              gridColumn: 'span 2'
            }}
          >
            0
          </button>
          <button
            onClick={inputDecimal}
            style={{
              padding: '20px',
              fontSize: '18px',
              backgroundColor: '#66bb6a',
              color: 'white',
              border: 'none',
              borderRadius: '10px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            .
          </button>
        </div>
      </div>
    </div>
  );
}`,
    css: `/* 계산기 스타일 */
body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
  margin: 0;
  padding: 0;
  background-color: #f5f5f5;
}

button:hover {
  opacity: 0.8;
  transform: translateY(-2px);
  transition: all 0.2s ease;
}

button:active {
  transform: translateY(0);
  opacity: 0.9;
}

@keyframes buttonPress {
  0% { transform: scale(1); }
  50% { transform: scale(0.95); }
  100% { transform: scale(1); }
}

button:active {
  animation: buttonPress 0.1s ease;
}`
  },
  {
    id: 'quiz-app',
    name: '퀴즈 앱',
    description: '다양한 주제의 퀴즈를 풀고 점수를 확인할 수 있는 앱',
    jsx: `function App() {
  const [currentQuestion, setCurrentQuestion] = React.useState(0);
  const [score, setScore] = React.useState(0);
  const [showResult, setShowResult] = React.useState(false);
  const [selectedAnswer, setSelectedAnswer] = React.useState(null);
  const [timeLeft, setTimeLeft] = React.useState(30);
  const [quizStarted, setQuizStarted] = React.useState(false);

  const questions = [
    {
      question: "리액트(React)는 어떤 회사에서 개발했나요?",
      options: ["Google", "Facebook", "Microsoft", "Apple"],
      correct: 1,
      explanation: "리액트는 Facebook(현재 Meta)에서 개발한 JavaScript 라이브러리입니다."
    },
    {
      question: "JavaScript에서 'const' 키워드의 특징은 무엇인가요?",
      options: ["값을 재할당할 수 있음", "값을 재할당할 수 없음", "함수에서만 사용 가능", "전역 변수만 선언 가능"],
      correct: 1,
      explanation: "const는 상수를 선언하는 키워드로, 한 번 할당된 값을 재할당할 수 없습니다."
    },
    {
      question: "CSS에서 'flexbox'의 주축을 설정하는 속성은?",
      options: ["flex-direction", "justify-content", "align-items", "flex-wrap"],
      correct: 0,
      explanation: "flex-direction은 flexbox의 주축(main axis) 방향을 설정하는 속성입니다."
    },
    {
      question: "HTML5에서 새로 추가된 시맨틱 태그가 아닌 것은?",
      options: ["<header>", "<nav>", "<div>", "<section>"],
      correct: 2,
      explanation: "<div>는 HTML5 이전부터 존재했던 태그이며, 시맨틱 태그가 아닙니다."
    },
    {
      question: "Node.js의 특징이 아닌 것은?",
      options: ["서버 사이드 JavaScript", "비동기 I/O", "브라우저에서만 실행", "이벤트 기반"],
      correct: 2,
      explanation: "Node.js는 서버 사이드에서 실행되며, 브라우저가 아닌 서버 환경에서 동작합니다."
    }
  ];

  React.useEffect(() => {
    if (quizStarted && !showResult && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !showResult) {
      handleNextQuestion();
    }
  }, [timeLeft, quizStarted, showResult]);

  const startQuiz = () => {
    setQuizStarted(true);
    setCurrentQuestion(0);
    setScore(0);
    setShowResult(false);
    setTimeLeft(30);
    setSelectedAnswer(null);
  };

  const handleAnswerSelect = (answerIndex) => {
    setSelectedAnswer(answerIndex);
  };

  const handleNextQuestion = () => {
    if (selectedAnswer === questions[currentQuestion].correct) {
      setScore(score + 1);
    }

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setTimeLeft(30);
    } else {
      setShowResult(true);
    }
  };

  const resetQuiz = () => {
    setQuizStarted(false);
    setCurrentQuestion(0);
    setScore(0);
    setShowResult(false);
    setTimeLeft(30);
    setSelectedAnswer(null);
  };

  const getScoreMessage = () => {
    const percentage = (score / questions.length) * 100;
    if (percentage >= 80) return "🎉 훌륭합니다!";
    if (percentage >= 60) return "👍 잘했습니다!";
    if (percentage >= 40) return "📚 더 공부해보세요!";
    return "💪 다시 도전해보세요!";
  };

  if (!quizStarted) {
    return (
      <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
        <h1 style={{ color: '#333', marginBottom: '30px' }}>🧠 웹 개발 퀴즈</h1>
        <div style={{
          backgroundColor: 'white',
          padding: '40px',
          borderRadius: '15px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{ color: '#333', marginBottom: '20px' }}>퀴즈에 오신 것을 환영합니다!</h2>
          <p style={{ color: '#666', marginBottom: '30px', fontSize: '16px' }}>
            총 {questions.length}개의 웹 개발 관련 문제가 있습니다.<br/>
            각 문제마다 30초의 시간이 주어집니다.
          </p>
          <button
            onClick={startQuiz}
            style={{
              padding: '15px 30px',
              fontSize: '18px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '10px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            퀴즈 시작하기
          </button>
        </div>
      </div>
    );
  }

  if (showResult) {
    return (
      <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
        <h1 style={{ color: '#333', marginBottom: '30px' }}>🏆 퀴즈 결과</h1>
        <div style={{
          backgroundColor: 'white',
          padding: '40px',
          borderRadius: '15px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
        }}>
          <div style={{ fontSize: '48px', marginBottom: '20px' }}>
            {getScoreMessage()}
          </div>
          <h2 style={{ color: '#333', marginBottom: '20px' }}>
            점수: {score} / {questions.length}
          </h2>
          <div style={{
            width: '100%',
            backgroundColor: '#e9ecef',
            borderRadius: '10px',
            height: '20px',
            marginBottom: '20px'
          }}>
            <div style={{
              width: (score / questions.length) * 100 + '%',
              backgroundColor: score >= questions.length * 0.6 ? '#28a745' : '#dc3545',
              height: '100%',
              borderRadius: '10px',
              transition: 'width 0.5s ease'
            }}></div>
          </div>
          <p style={{ color: '#666', marginBottom: '30px' }}>
            정답률: {Math.round((score / questions.length) * 100)}%
          </p>
          <button
            onClick={resetQuiz}
            style={{
              padding: '15px 30px',
              fontSize: '18px',
              backgroundColor: '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '10px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            다시 도전하기
          </button>
        </div>
      </div>
    );
  }

  const currentQ = questions[currentQuestion];

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h1 style={{ color: '#333', margin: 0 }}>🧠 웹 개발 퀴즈</h1>
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          <div style={{ color: '#666' }}>
            문제 {currentQuestion + 1} / {questions.length}
          </div>
          <div style={{
            padding: '8px 16px',
            backgroundColor: timeLeft <= 10 ? '#dc3545' : '#007bff',
            color: 'white',
            borderRadius: '20px',
            fontWeight: 'bold'
          }}>
            ⏰ {timeLeft}초
          </div>
        </div>
      </div>

      <div style={{
        backgroundColor: 'white',
        padding: '30px',
        borderRadius: '15px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
      }}>
        <h2 style={{ color: '#333', marginBottom: '30px', lineHeight: '1.5' }}>
          {currentQ.question}
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginBottom: '30px' }}>
          {currentQ.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswerSelect(index)}
              style={{
                padding: '15px 20px',
                fontSize: '16px',
                backgroundColor: selectedAnswer === index ? '#007bff' : '#f8f9fa',
                color: selectedAnswer === index ? 'white' : '#333',
                border: selectedAnswer === index ? 'none' : '2px solid #dee2e6',
                borderRadius: '10px',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.2s ease'
              }}
            >
              {String.fromCharCode(65 + index)}. {option}
            </button>
          ))}
        </div>

        {selectedAnswer !== null && (
          <div style={{
            backgroundColor: selectedAnswer === currentQ.correct ? '#d4edda' : '#f8d7da',
            color: selectedAnswer === currentQ.correct ? '#155724' : '#721c24',
            padding: '15px',
            borderRadius: '10px',
            marginBottom: '20px'
          }}>
            <strong>
              {selectedAnswer === currentQ.correct ? '✅ 정답입니다!' : '❌ 틀렸습니다!'}
            </strong>
            <p style={{ margin: '10px 0 0 0' }}>{currentQ.explanation}</p>
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ color: '#666' }}>
            현재 점수: {score} / {currentQuestion}
          </div>
          <button
            onClick={handleNextQuestion}
            disabled={selectedAnswer === null}
            style={{
              padding: '12px 24px',
              fontSize: '16px',
              backgroundColor: selectedAnswer !== null ? '#28a745' : '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: selectedAnswer !== null ? 'pointer' : 'not-allowed',
              fontWeight: 'bold'
            }}
          >
            {currentQuestion < questions.length - 1 ? '다음 문제' : '결과 보기'}
          </button>
        </div>
      </div>
    </div>
  );
}`,
    css: `/* 퀴즈 앱 스타일 */
body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
  margin: 0;
  padding: 0;
  background-color: #f5f5f5;
}

button:hover:not(:disabled) {
  opacity: 0.9;
  transform: translateY(-1px);
  transition: all 0.2s ease;
}

button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.02); }
  100% { transform: scale(1); }
}

div[style*="backgroundColor: #dc3545"] {
  animation: pulse 1s infinite;
}

@keyframes slideIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

div[style*="backgroundColor: white"] {
  animation: slideIn 0.5s ease;
}`
  },
  {
    id: 'chat-app',
    name: '채팅 앱',
    description: '실시간 메시지를 주고받을 수 있는 채팅 인터페이스',
    jsx: `function App() {
  const [messages, setMessages] = React.useState([
    {
      id: 1,
      text: "안녕하세요! 오늘 날씨가 정말 좋네요 ☀️",
      sender: "김철수",
      timestamp: "10:30",
      isOwn: false,
      avatar: "👨‍💼"
    },
    {
      id: 2,
      text: "네, 맞아요! 산책하기 딱 좋은 날씨예요",
      sender: "나",
      timestamp: "10:31",
      isOwn: true,
      avatar: "👤"
    },
    {
      id: 3,
      text: "혹시 오늘 오후에 만날 수 있을까요?",
      sender: "김철수",
      timestamp: "10:32",
      isOwn: false,
      avatar: "👨‍💼"
    },
    {
      id: 4,
      text: "네, 좋아요! 몇 시쯤에 만날까요?",
      sender: "나",
      timestamp: "10:33",
      isOwn: true,
      avatar: "👤"
    }
  ]);
  const [newMessage, setNewMessage] = React.useState('');
  const [isTyping, setIsTyping] = React.useState(false);
  const [onlineUsers, setOnlineUsers] = React.useState(['김철수', '이영희', '박민수']);

  const sendMessage = () => {
    if (newMessage.trim()) {
      const message = {
        id: messages.length + 1,
        text: newMessage,
        sender: "나",
        timestamp: new Date().toLocaleTimeString('ko-KR', { 
          hour: '2-digit', 
          minute: '2-digit',
          timeZone: 'Asia/Seoul'
        }),
        isOwn: true,
        avatar: "👤"
      };
      setMessages([...messages, message]);
      setNewMessage('');
      
      // 자동 응답 시뮬레이션
      setTimeout(() => {
        setIsTyping(true);
        setTimeout(() => {
          const responses = [
            "정말요? 흥미롭네요!",
            "그렇군요, 이해했습니다",
            "좋은 아이디어네요 👍",
            "네, 알겠습니다!",
            "정말 대단하시네요!",
            "그렇게 생각하시는군요 🤔"
          ];
          const randomResponse = responses[Math.floor(Math.random() * responses.length)];
          
          const autoMessage = {
            id: messages.length + 2,
            text: randomResponse,
            sender: "김철수",
            timestamp: new Date().toLocaleTimeString('ko-KR', { 
              hour: '2-digit', 
              minute: '2-digit',
              timeZone: 'Asia/Seoul'
            }),
            isOwn: false,
            avatar: "👨‍💼"
          };
          setMessages(prev => [...prev, autoMessage]);
          setIsTyping(false);
        }, 2000);
      }, 1000);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatTime = (timestamp) => {
    return timestamp;
  };

  return (
    <div style={{ 
      padding: '20px', 
      maxWidth: '800px', 
      margin: '0 auto',
      height: '100vh',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <h1 style={{ textAlign: 'center', color: '#333', marginBottom: '20px' }}>💬 채팅 앱</h1>
      
      <div style={{
        backgroundColor: 'white',
        borderRadius: '15px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
        height: '100%',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* 헤더 */}
        <div style={{
          padding: '20px',
          borderBottom: '1px solid #e9ecef',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <h2 style={{ margin: '0 0 5px 0', color: '#333' }}>김철수와의 대화</h2>
            <div style={{ color: '#28a745', fontSize: '14px' }}>
              ● 온라인
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '12px', color: '#666', marginBottom: '5px' }}>온라인 사용자</div>
            <div style={{ display: 'flex', gap: '5px' }}>
              {onlineUsers.map((user, index) => (
                <span key={index} style={{
                  fontSize: '12px',
                  backgroundColor: '#e9ecef',
                  padding: '2px 8px',
                  borderRadius: '10px',
                  color: '#666'
                }}>
                  {user}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* 메시지 영역 */}
        <div style={{
          flex: 1,
          padding: '20px',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '15px'
        }}>
          {messages.map((message) => (
            <div
              key={message.id}
              style={{
                display: 'flex',
                justifyContent: message.isOwn ? 'flex-end' : 'flex-start',
                alignItems: 'flex-end',
                gap: '10px'
              }}
            >
              {!message.isOwn && (
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  backgroundColor: '#e9ecef',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '20px',
                  flexShrink: 0
                }}>
                  {message.avatar}
                </div>
              )}
              
              <div style={{
                maxWidth: '70%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: message.isOwn ? 'flex-end' : 'flex-start'
              }}>
                {!message.isOwn && (
                  <div style={{
                    fontSize: '12px',
                    color: '#666',
                    marginBottom: '5px'
                  }}>
                    {message.sender}
                  </div>
                )}
                
                <div style={{
                  backgroundColor: message.isOwn ? '#007bff' : '#f8f9fa',
                  color: message.isOwn ? 'white' : '#333',
                  padding: '12px 16px',
                  borderRadius: message.isOwn ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                  wordWrap: 'break-word',
                  boxShadow: '0 1px 2px rgba(0,0,0,0.1)'
                }}>
                  {message.text}
                </div>
                
                <div style={{
                  fontSize: '11px',
                  color: '#999',
                  marginTop: '4px',
                  marginLeft: message.isOwn ? '0' : '16px',
                  marginRight: message.isOwn ? '16px' : '0'
                }}>
                  {formatTime(message.timestamp)}
                </div>
              </div>
              
              {message.isOwn && (
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  backgroundColor: '#007bff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '20px',
                  flexShrink: 0
                }}>
                  {message.avatar}
                </div>
              )}
            </div>
          ))}
          
          {/* 타이핑 인디케이터 */}
          {isTyping && (
            <div style={{
              display: 'flex',
              alignItems: 'flex-end',
              gap: '10px'
            }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                backgroundColor: '#e9ecef',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '20px',
                flexShrink: 0
              }}>
                👨‍💼
              </div>
              <div style={{
                backgroundColor: '#f8f9fa',
                padding: '12px 16px',
                borderRadius: '18px 18px 18px 4px',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}>
                <div style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: '#999',
                  animation: 'typing 1.4s infinite ease-in-out'
                }}></div>
                <div style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: '#999',
                  animation: 'typing 1.4s infinite ease-in-out 0.2s'
                }}></div>
                <div style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: '#999',
                  animation: 'typing 1.4s infinite ease-in-out 0.4s'
                }}></div>
              </div>
            </div>
          )}
        </div>

        {/* 메시지 입력 영역 */}
        <div style={{
          padding: '20px',
          borderTop: '1px solid #e9ecef',
          display: 'flex',
          gap: '10px',
          alignItems: 'flex-end'
        }}>
          <div style={{ flex: 1 }}>
            <textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="메시지를 입력하세요..."
              style={{
                width: '100%',
                minHeight: '40px',
                maxHeight: '120px',
                padding: '10px 15px',
                border: '2px solid #e9ecef',
                borderRadius: '20px',
                outline: 'none',
                resize: 'none',
                fontSize: '16px',
                fontFamily: 'inherit',
                boxSizing: 'border-box'
              }}
            />
          </div>
          <button
            onClick={sendMessage}
            disabled={!newMessage.trim()}
            style={{
              width: '50px',
              height: '50px',
              borderRadius: '50%',
              backgroundColor: newMessage.trim() ? '#007bff' : '#6c757d',
              color: 'white',
              border: 'none',
              cursor: newMessage.trim() ? 'pointer' : 'not-allowed',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '20px',
              transition: 'all 0.2s ease'
            }}
          >
            ➤
          </button>
        </div>
      </div>
    </div>
  );
}`,
    css: `/* 채팅 앱 스타일 */
body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
  margin: 0;
  padding: 0;
  background-color: #f5f5f5;
}

textarea:focus {
  border-color: #007bff !important;
  box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
}

button:hover:not(:disabled) {
  opacity: 0.9;
  transform: scale(1.05);
  transition: all 0.2s ease;
}

button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

@keyframes typing {
  0%, 60%, 100% {
    transform: translateY(0);
    opacity: 0.4;
  }
  30% {
    transform: translateY(-10px);
    opacity: 1;
  }
}

@keyframes messageSlide {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

div[style*="backgroundColor: #007bff"], div[style*="backgroundColor: #f8f9fa"] {
  animation: messageSlide 0.3s ease;
}`
  },
  {
    id: 'music-player',
    name: '음악 플레이어',
    description: '재생 목록과 재생 컨트롤을 제공하는 음악 플레이어',
    jsx: `function App() {
  const [currentTrack, setCurrentTrack] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(180); // 기본 3분
  const [volume, setVolume] = useState(70);
  const [isShuffled, setIsShuffled] = useState(false);
  const [repeatMode, setRepeatMode] = useState('none'); // 'none', 'one', 'all'

  const playlist = [
    {
      id: 1,
      title: "좋은 날",
      artist: "아이유",
      album: "Real",
      duration: "3:00",
      durationSeconds: 180,
      cover: "🎵"
    },
    {
      id: 2,
      title: "Dynamite",
      artist: "BTS",
      album: "BE",
      duration: "3:19",
      durationSeconds: 199,
      cover: "🎤"
    },
    {
      id: 3,
      title: "Blinding Lights",
      artist: "The Weeknd",
      album: "After Hours",
      duration: "3:20",
      durationSeconds: 200,
      cover: "💫"
    },
    {
      id: 4,
      title: "Levitating",
      artist: "Dua Lipa",
      album: "Future Nostalgia",
      duration: "3:23",
      durationSeconds: 203,
      cover: "🚀"
    },
    {
      id: 5,
      title: "Watermelon Sugar",
      artist: "Harry Styles",
      album: "Fine Line",
      duration: "2:54",
      durationSeconds: 174,
      cover: "🍉"
    }
  ];

  // 현재 곡이 바뀔 때마다 duration 업데이트
  useEffect(() => {
    setDuration(playlist[currentTrack].durationSeconds);
  }, [currentTrack]);

  useEffect(() => {
    if (!isPlaying) return;
    
    const interval = setInterval(() => {
      setCurrentTime(prev => {
        if (prev >= duration) {
          if (repeatMode === 'one') {
            return 0;
          } else if (repeatMode === 'all') {
            if (isShuffled) {
              const randomIndex = Math.floor(Math.random() * playlist.length);
              setCurrentTrack(randomIndex);
              setDuration(playlist[randomIndex].durationSeconds);
            } else if (currentTrack === playlist.length - 1) {
              setCurrentTrack(0);
              setDuration(playlist[0].durationSeconds);
            } else {
              const newIndex = currentTrack + 1;
              setCurrentTrack(newIndex);
              setDuration(playlist[newIndex].durationSeconds);
            }
            return 0;
          } else {
            setIsPlaying(false);
            return 0;
          }
        }
        return prev + 1;
      });
    }, 1000);
    
    return () => clearInterval(interval);
  }, [isPlaying, duration, repeatMode, currentTrack, playlist.length, isShuffled]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return mins + ':' + secs.toString().padStart(2, '0');
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handlePrevious = () => {
    if (currentTime > 3) {
      setCurrentTime(0);
    } else {
      if (isShuffled) {
        const randomIndex = Math.floor(Math.random() * playlist.length);
        setCurrentTrack(randomIndex);
        setDuration(playlist[randomIndex].durationSeconds);
      } else {
        const newIndex = currentTrack > 0 ? currentTrack - 1 : playlist.length - 1;
        setCurrentTrack(newIndex);
        setDuration(playlist[newIndex].durationSeconds);
      }
      setCurrentTime(0);
    }
  };

  const handleNext = () => {
    if (repeatMode === 'one') {
      setCurrentTime(0);
    } else if (isShuffled) {
      const randomIndex = Math.floor(Math.random() * playlist.length);
      setCurrentTrack(randomIndex);
      setDuration(playlist[randomIndex].durationSeconds);
      setCurrentTime(0);
    } else if (repeatMode === 'all' && currentTrack === playlist.length - 1) {
      setCurrentTrack(0);
      setDuration(playlist[0].durationSeconds);
      setCurrentTime(0);
    } else if (currentTrack < playlist.length - 1) {
      const newIndex = currentTrack + 1;
      setCurrentTrack(newIndex);
      setDuration(playlist[newIndex].durationSeconds);
      setCurrentTime(0);
    } else {
      setIsPlaying(false);
      setCurrentTime(0);
    }
  };

  const handleSeek = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    const newTime = Math.floor(percent * duration);
    setCurrentTime(Math.max(0, Math.min(duration, newTime)));
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseInt(e.target.value);
    setVolume(Math.max(0, Math.min(100, newVolume)));
  };

  const toggleShuffle = () => {
    setIsShuffled(!isShuffled);
  };

  const toggleRepeat = () => {
    const modes = ['none', 'one', 'all'];
    const currentIndex = modes.indexOf(repeatMode);
    setRepeatMode(modes[(currentIndex + 1) % modes.length]);
  };

  const getRepeatIcon = () => {
    switch (repeatMode) {
      case 'one': return '🔂';
      case 'all': return '🔁';
      default: return '🔀';
    }
  };

  const currentSong = playlist[currentTrack];

  return (
    <div style={{ padding: '20px', maxWidth: '500px', margin: '0 auto' }}>
      <h1 style={{ textAlign: 'center', color: '#333', marginBottom: '30px' }}>🎵 음악 플레이어</h1>
      
      <div style={{
        backgroundColor: 'white',
        borderRadius: '20px',
        padding: '30px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white'
      }}>
        {/* 앨범 커버 */}
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <div 
            className={isPlaying ? 'playing' : ''}
            style={{
              width: '200px',
              height: '200px',
              backgroundColor: 'rgba(255,255,255,0.1)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '80px',
              margin: '0 auto 20px',
              backdropFilter: 'blur(10px)',
              border: '2px solid rgba(255,255,255,0.2)'
            }}
          >
            {currentSong.cover}
          </div>
          <h2 style={{ margin: '0 0 5px 0', fontSize: '24px' }}>{currentSong.title}</h2>
          <p style={{ margin: '0', opacity: 0.8, fontSize: '16px' }}>{currentSong.artist}</p>
          <p style={{ margin: '5px 0 0 0', opacity: 0.6, fontSize: '14px' }}>{currentSong.album}</p>
        </div>

        {/* 진행 바 */}
        <div style={{ marginBottom: '20px' }}>
          <div
            style={{
              width: '100%',
              height: '6px',
              backgroundColor: 'rgba(255,255,255,0.3)',
              borderRadius: '3px',
              cursor: 'pointer',
              position: 'relative'
            }}
            onClick={handleSeek}
          >
            <div style={{
              width: (currentTime / duration) * 100 + '%',
              height: '100%',
              backgroundColor: 'white',
              borderRadius: '3px',
              transition: 'width 0.1s ease'
            }}></div>
            <div style={{
              position: 'absolute',
              left: (currentTime / duration) * 100 + '%',
              top: '50%',
              transform: 'translate(-50%, -50%)',
              width: '16px',
              height: '16px',
              backgroundColor: 'white',
              borderRadius: '50%',
              boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
              transition: 'transform 0.2s ease'
            }}></div>
          </div>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginTop: '10px',
            fontSize: '14px',
            opacity: 0.8
          }}>
            <span>{formatTime(currentTime)}</span>
            <span>{playlist[currentTrack].duration}</span>
          </div>
        </div>

        {/* 컨트롤 버튼 */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '20px',
          marginBottom: '30px'
        }}>
          <button
            onClick={toggleShuffle}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '20px',
              cursor: 'pointer',
              opacity: isShuffled ? 1 : 0.5,
              transition: 'opacity 0.2s ease'
            }}
          >
            🔀
          </button>
          
          <button
            onClick={handlePrevious}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '24px',
              cursor: 'pointer',
              padding: '10px',
              borderRadius: '50%',
              backgroundColor: 'rgba(255,255,255,0.1)',
              transition: 'background-color 0.2s ease'
            }}
          >
            ⏮️
          </button>
          
          <button
            onClick={handlePlayPause}
            style={{
              background: 'white',
              border: 'none',
              fontSize: '32px',
              cursor: 'pointer',
              padding: '15px',
              borderRadius: '50%',
              color: '#667eea',
              boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
              transition: 'transform 0.2s ease',
              transform: 'scale(1)'
            }}
            onMouseEnter={(e) => e.target.style.transform = 'scale(1.1)'}
            onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
          >
            {isPlaying ? '⏸️' : '▶️'}
          </button>
          
          <button
            onClick={handleNext}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '24px',
              cursor: 'pointer',
              padding: '10px',
              borderRadius: '50%',
              backgroundColor: 'rgba(255,255,255,0.1)',
              transition: 'background-color 0.2s ease'
            }}
          >
            ⏭️
          </button>
          
          <button
            onClick={toggleRepeat}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '20px',
              cursor: 'pointer',
              opacity: repeatMode !== 'none' ? 1 : 0.5,
              transition: 'opacity 0.2s ease'
            }}
          >
            {getRepeatIcon()}
          </button>
        </div>

        {/* 볼륨 컨트롤 */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          marginBottom: '20px'
        }}>
          <span style={{ fontSize: '16px' }}>🔊</span>
          <input
            type="range"
            min="0"
            max="100"
            value={volume}
            onChange={handleVolumeChange}
            style={{
              flex: 1,
              height: '6px',
              background: 'rgba(255,255,255,0.3)',
              outline: 'none',
              borderRadius: '3px',
              cursor: 'pointer'
            }}
          />
          <span style={{ fontSize: '14px', minWidth: '30px' }}>{volume}%</span>
        </div>

        {/* 재생 목록 */}
        <div style={{
          backgroundColor: 'rgba(255,255,255,0.1)',
          borderRadius: '15px',
          padding: '20px',
          backdropFilter: 'blur(10px)'
        }}>
          <h3 style={{ margin: '0 0 15px 0', fontSize: '18px' }}>재생 목록</h3>
          <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
            {playlist.map((song, index) => (
              <div
                key={song.id}
                onClick={() => {
                  setCurrentTrack(index);
                  setCurrentTime(0);
                  setDuration(playlist[index].durationSeconds);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '10px',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  backgroundColor: index === currentTrack ? 'rgba(255,255,255,0.2)' : 'transparent',
                  transition: 'background-color 0.2s ease',
                  marginBottom: '5px'
                }}
              >
                <div style={{ fontSize: '24px', marginRight: '15px' }}>
                  {song.cover}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{
                    fontWeight: index === currentTrack ? 'bold' : 'normal',
                    marginBottom: '2px'
                  }}>
                    {song.title}
                  </div>
                  <div style={{ fontSize: '14px', opacity: 0.8 }}>
                    {song.artist} • {song.album}
                  </div>
                </div>
                <div style={{ fontSize: '14px', opacity: 0.8 }}>
                  {song.duration}
                </div>
                {index === currentTrack && (
                  <div style={{ marginLeft: '10px', fontSize: '16px' }}>
                    {isPlaying ? '🎵' : '⏸️'}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}`,
    css: `/* 음악 플레이어 스타일 */
body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
  margin: 0;
  padding: 0;
  background-color: #f5f5f5;
}

button:hover {
  opacity: 0.8;
  transform: scale(1.05);
  transition: all 0.2s ease;
}

input[type="range"]::-webkit-slider-thumb {
  appearance: none;
  width: 18px;
  height: 18px;
  background: white;
  border-radius: 50%;
  cursor: pointer;
  box-shadow: 0 2px 6px rgba(0,0,0,0.3);
  transition: transform 0.2s ease;
}

input[type="range"]::-webkit-slider-thumb:hover {
  transform: scale(1.1);
}

input[type="range"]::-moz-range-thumb {
  width: 18px;
  height: 18px;
  background: white;
  border-radius: 50%;
  cursor: pointer;
  border: none;
  box-shadow: 0 2px 6px rgba(0,0,0,0.3);
  transition: transform 0.2s ease;
}

input[type="range"]::-moz-range-thumb:hover {
  transform: scale(1.1);
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

div[style*="fontSize: 80px"] {
  animation: spin 20s linear infinite;
  animation-play-state: paused;
}

div[style*="fontSize: 80px"].playing {
  animation-play-state: running;
}

@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
}

button[style*="fontSize: 32px"]:hover {
  animation: pulse 0.6s ease-in-out;
}

/* 진행률 바 호버 효과 */
div[style*="cursor: pointer"]:hover div[style*="position: absolute"] {
  transform: translate(-50%, -50%) scale(1.2);
}

/* 재생 목록 아이템 호버 효과 */
div[style*="cursor: pointer"]:hover {
  background-color: rgba(255,255,255,0.15) !important;
}`
  },
  {
    id: 'drawing-board',
    name: '그림판',
    description: '마우스로 그림을 그릴 수 있는 간단한 그림판',
    jsx: `function App() {
  const [isDrawing, setIsDrawing] = React.useState(false);
  const [currentColor, setCurrentColor] = React.useState('#000000');
  const [brushSize, setBrushSize] = React.useState(5);
  const canvasRef = React.useRef(null);
  const [history, setHistory] = React.useState([]);
  const [historyIndex, setHistoryIndex] = React.useState(-1);

  const colors = [
    '#000000', '#FF0000', '#00FF00', '#0000FF', '#FFFF00',
    '#FF00FF', '#00FFFF', '#FFA500', '#800080', '#FFC0CB',
    '#A52A2A', '#808080', '#FFFFFF'
  ];

  const brushSizes = [1, 3, 5, 8, 12, 16, 20];

  React.useEffect(() => {
    const canvas = document.getElementById('drawingCanvas');
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      canvasRef.current = ctx;
      saveToHistory();
    }
  }, []);

  const saveToHistory = () => {
    const canvas = document.getElementById('drawingCanvas');
    if (canvas) {
      const imageData = canvas.toDataURL();
      const newHistory = history.slice(0, historyIndex + 1);
      newHistory.push(imageData);
      setHistory(newHistory);
      setHistoryIndex(newHistory.length - 1);
    }
  };

  const startDrawing = (e) => {
    setIsDrawing(true);
    const rect = e.target.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    if (canvasRef.current) {
      canvasRef.current.beginPath();
      canvasRef.current.moveTo(x, y);
    }
  };

  const draw = (e) => {
    if (!isDrawing) return;
    
    const rect = e.target.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    if (canvasRef.current) {
      canvasRef.current.lineWidth = brushSize;
      canvasRef.current.strokeStyle = currentColor;
      canvasRef.current.lineTo(x, y);
      canvasRef.current.stroke();
    }
  };

  const stopDrawing = () => {
    if (isDrawing) {
      setIsDrawing(false);
      saveToHistory();
    }
  };

  const clearCanvas = () => {
    if (canvasRef.current) {
      canvasRef.current.clearRect(0, 0, 800, 600);
      saveToHistory();
    }
  };

  const undo = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      const img = new Image();
      img.onload = () => {
        if (canvasRef.current) {
          canvasRef.current.clearRect(0, 0, 800, 600);
          canvasRef.current.drawImage(img, 0, 0);
        }
      };
      img.src = history[newIndex];
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      const img = new Image();
      img.onload = () => {
        if (canvasRef.current) {
          canvasRef.current.clearRect(0, 0, 800, 600);
          canvasRef.current.drawImage(img, 0, 0);
        }
      };
      img.src = history[newIndex];
    }
  };

  const downloadImage = () => {
    const canvas = document.getElementById('drawingCanvas');
    const link = document.createElement('a');
    link.download = 'drawing.png';
    link.href = canvas.toDataURL();
    link.click();
  };

  return (
    <div style={{ padding: '20px', maxWidth: '900px', margin: '0 auto' }}>
      <h1 style={{ textAlign: 'center', color: '#333', marginBottom: '20px' }}>🎨 그림판</h1>
      
      {/* 도구 모음 */}
      <div style={{
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '10px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        marginBottom: '20px',
        display: 'flex',
        flexWrap: 'wrap',
        gap: '20px',
        alignItems: 'center'
      }}>
        {/* 색상 선택 */}
        <div>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#333' }}>
            색상
          </label>
          <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
            {colors.map((color) => (
              <button
                key={color}
                onClick={() => setCurrentColor(color)}
                style={{
                  width: '30px',
                  height: '30px',
                  backgroundColor: color,
                  border: currentColor === color ? '3px solid #007bff' : '2px solid #ddd',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  transition: 'transform 0.2s ease'
                }}
              />
            ))}
          </div>
        </div>

        {/* 브러시 크기 */}
        <div>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#333' }}>
            브러시 크기
          </label>
          <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
            {brushSizes.map((size) => (
              <button
                key={size}
                onClick={() => setBrushSize(size)}
                style={{
                  width: '30px',
                  height: '30px',
                  backgroundColor: currentColor,
                  border: brushSize === size ? '3px solid #007bff' : '2px solid #ddd',
                  borderRadius: '50%',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '12px',
                  fontWeight: 'bold'
                }}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        {/* 액션 버튼 */}
        <div style={{ display: 'flex', gap: '10px', marginLeft: 'auto' }}>
          <button
            onClick={undo}
            disabled={historyIndex <= 0}
            style={{
              padding: '8px 16px',
              fontSize: '14px',
              backgroundColor: historyIndex <= 0 ? '#6c757d' : '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: historyIndex <= 0 ? 'not-allowed' : 'pointer'
            }}
          >
            ↶ 실행취소
          </button>
          <button
            onClick={redo}
            disabled={historyIndex >= history.length - 1}
            style={{
              padding: '8px 16px',
              fontSize: '14px',
              backgroundColor: historyIndex >= history.length - 1 ? '#6c757d' : '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: historyIndex >= history.length - 1 ? 'not-allowed' : 'pointer'
            }}
          >
            ↷ 다시실행
          </button>
          <button
            onClick={clearCanvas}
            style={{
              padding: '8px 16px',
              fontSize: '14px',
              backgroundColor: '#dc3545',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            🗑️ 지우기
          </button>
          <button
            onClick={downloadImage}
            style={{
              padding: '8px 16px',
              fontSize: '14px',
              backgroundColor: '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            💾 저장
          </button>
        </div>
      </div>

      {/* 캔버스 */}
      <div style={{
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '10px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        textAlign: 'center'
      }}>
        <canvas
          id="drawingCanvas"
          width="800"
          height="600"
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          style={{
            border: '2px solid #ddd',
            borderRadius: '5px',
            cursor: 'crosshair',
            backgroundColor: 'white'
          }}
        />
        <div style={{ marginTop: '10px', color: '#666', fontSize: '14px' }}>
          마우스를 드래그하여 그림을 그려보세요!
        </div>
      </div>

      {/* 사용법 안내 */}
      <div style={{
        backgroundColor: '#f8f9fa',
        padding: '20px',
        borderRadius: '10px',
        marginTop: '20px'
      }}>
        <h3 style={{ margin: '0 0 15px 0', color: '#333' }}>사용법</h3>
        <ul style={{ margin: 0, paddingLeft: '20px', color: '#666' }}>
          <li>색상 버튼을 클릭하여 그리기 색상을 선택하세요</li>
          <li>브러시 크기 버튼을 클릭하여 선의 굵기를 조절하세요</li>
          <li>마우스를 드래그하여 그림을 그리세요</li>
          <li>실행취소/다시실행 버튼으로 작업을 되돌리거나 반복하세요</li>
          <li>지우기 버튼으로 캔버스를 완전히 지울 수 있습니다</li>
          <li>저장 버튼으로 그림을 PNG 파일로 다운로드하세요</li>
        </ul>
      </div>
    </div>
  );
}`,
    css: `/* 그림판 스타일 */
body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
  margin: 0;
  padding: 0;
  background-color: #f5f5f5;
}

button:hover:not(:disabled) {
  opacity: 0.8;
  transform: translateY(-1px);
  transition: all 0.2s ease;
}

button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

canvas {
  transition: box-shadow 0.2s ease;
}

canvas:hover {
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
}

@keyframes buttonPress {
  0% { transform: scale(1); }
  50% { transform: scale(0.95); }
  100% { transform: scale(1); }
}

button:active {
  animation: buttonPress 0.1s ease;
}

/* 색상 버튼 호버 효과 */
button[style*="backgroundColor: #000000"]:hover,
button[style*="backgroundColor: #FF0000"]:hover,
button[style*="backgroundColor: #00FF00"]:hover,
button[style*="backgroundColor: #0000FF"]:hover,
button[style*="backgroundColor: #FFFF00"]:hover,
button[style*="backgroundColor: #FF00FF"]:hover,
button[style*="backgroundColor: #00FFFF"]:hover,
button[style*="backgroundColor: #FFA500"]:hover,
button[style*="backgroundColor: #800080"]:hover,
button[style*="backgroundColor: #FFC0CB"]:hover,
button[style*="backgroundColor: #A52A2A"]:hover,
button[style*="backgroundColor: #808080"]:hover,
button[style*="backgroundColor: #FFFFFF"]:hover {
  transform: scale(1.1);
  box-shadow: 0 2px 8px rgba(0,0,0,0.2);
}`
  }
];
