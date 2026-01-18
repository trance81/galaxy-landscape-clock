
// React와 필요한 훅들을 가져옵니다
// useState: WinForms의 필드 변수와 비슷하지만, 값이 변경되면 UI가 자동으로 업데이트됩니다
// useEffect: WinForms의 Load 이벤트나 Timer Tick 이벤트처럼, 특정 시점에 코드를 실행합니다
// useCallback: 함수를 메모리에 캐시하여 불필요한 재생성을 방지합니다 (성능 최적화)
// useRef: WinForms의 필드 변수와 비슷하지만, 값이 변경되어도 UI가 업데이트되지 않습니다 (상태 추적용)
import React, { useState, useEffect, useCallback, useRef } from 'react';
import CalendarWidget from './components/CalendarWidget';
import { INITIAL_WEATHER, TOMORROW_WEATHER, DAY_AFTER_WEATHER, WEATHER_ICONS, MINI_WEATHER_ICONS } from './constants';
import { RefreshCw, Battery, BatteryCharging, ExternalLink, Settings, X } from 'lucide-react';

// App 컴포넌트: WinForms의 Form 클래스와 비슷합니다
// React.FC는 React Function Component의 약자로, 이 컴포넌트가 함수형 컴포넌트임을 나타냅니다
const App: React.FC = () => {
  // ============================================================
  // 상태 변수 선언 (State Variables)
  // ============================================================
  // useState: WinForms의 private 필드 변수 + 속성(Property)의 조합과 비슷합니다
  // [변수명, setter함수] = useState(초기값)
  // setter 함수를 호출하면 값이 변경되고, UI가 자동으로 다시 렌더링됩니다
  
  // 현재 시간을 저장하는 상태 변수 (WinForms: private DateTime time = DateTime.Now;)
  const [time, setTime] = useState(new Date());
  
  // 현재 날씨 정보를 저장하는 상태 변수
  const [weather, setWeather] = useState(INITIAL_WEATHER);
  
  // 내일, 모레 날씨 예보를 저장하는 상태 변수
  const [forecast, setForecast] = useState({ tomorrow: TOMORROW_WEATHER, dayAfter: DAY_AFTER_WEATHER });
  
  // 날씨 데이터를 가져오는 중인지 여부를 저장하는 상태 변수 (WinForms: private bool isLoading;)
  const [loading, setLoading] = useState(false);
  
  // 배터리 상태를 저장하는 상태 변수 (레벨과 충전 중 여부)
  // <{ ... }>는 TypeScript의 타입 지정입니다 (WinForms의 타입 지정과 유사)
  const [battery, setBattery] = useState<{ level: number; charging: boolean | null }>({ level: 100, charging: false });

  // ============================================================
  // 레이아웃 설정 타입 정의
  // ============================================================
  // 각 디바이스 타입별 레이아웃 비율을 저장하는 인터페이스
  interface LayoutSettings {
    clock: number;        // 시계 영역의 flex 비율
    clockFontSize: number; // 시계 폰트 크기 (rem 단위)
    weather: number;      // 날씨 영역의 flex 비율
    calendar: number;     // 달력 영역의 너비 (%)
  }

  // 디바이스 타입별 기본 설정값
  const defaultLayoutSettings: { mobile: LayoutSettings; tablet: LayoutSettings; desktop: LayoutSettings } = {
    mobile: { clock: 3, clockFontSize: 5, weather: 5, calendar: 40 },     // 모바일 기본값
    tablet: { clock: 4, clockFontSize: 6, weather: 4, calendar: 35 },     // 태블릿 기본값
    desktop: { clock: 5, clockFontSize: 14, weather: 4, calendar: 32 }    // 데스크탑 기본값
  };

  // ============================================================
  // 레이아웃 설정 상태 관리 및 로컬 스토리지 연동
  // ============================================================
  // 로컬 스토리지에서 설정을 불러오는 함수 (WinForms의 Settings.Default와 비슷)
  const loadLayoutSettings = (): { mobile: LayoutSettings; tablet: LayoutSettings; desktop: LayoutSettings } => {
    try {
      const saved = localStorage.getItem('layoutSettings');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (error) {
      console.error('Failed to load layout settings:', error);
    }
    return defaultLayoutSettings; // 저장된 설정이 없으면 기본값 사용
  };

  // 레이아웃 설정을 로컬 스토리지에 저장하는 함수
  const saveLayoutSettings = (settings: { mobile: LayoutSettings; tablet: LayoutSettings; desktop: LayoutSettings }) => {
    try {
      localStorage.setItem('layoutSettings', JSON.stringify(settings));
    } catch (error) {
      console.error('Failed to save layout settings:', error);
    }
  };

  // 현재 레이아웃 설정 상태 변수
  const [layoutSettings, setLayoutSettings] = useState<{ mobile: LayoutSettings; tablet: LayoutSettings; desktop: LayoutSettings }>(loadLayoutSettings);

  // 설정 팝업 표시 여부를 저장하는 상태 변수
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  // 현재 디바이스 타입을 감지하는 함수 (WinForms의 Screen.PrimaryScreen.WorkingArea와 비슷)
  const getDeviceType = (): 'mobile' | 'tablet' | 'desktop' => {
    if (typeof window === 'undefined') return 'desktop';
    const width = window.innerWidth;
    if (width < 768) return 'mobile';      // 모바일: 768px 미만
    if (width < 1024) return 'tablet';     // 태블릿: 768px~1024px
    return 'desktop';                       // 데스크탑: 1024px 이상
  };

  // 현재 디바이스 타입에 맞는 레이아웃 설정을 가져옵니다
  const currentLayout = layoutSettings[getDeviceType()];

  // ============================================================
  // 헬퍼 함수 (Helper Functions)
  // ============================================================
  // WMO(World Meteorological Organization) 코드를 날씨 문자열로 변환하는 함수
  // WinForms의 private 메서드와 비슷합니다
  const mapWmoToCondition = (code: number): string => {
    if (code === 0) return 'clear sky';
    if (code <= 3) return 'partly cloudy';
    if (code >= 45 && code <= 48) return 'fog';
    if (code >= 51 && code <= 55) return 'drizzle';
    if (code >= 61 && code <= 65) return 'rain';
    if (code >= 71 && code <= 77) return 'snow';
    if (code >= 80 && code <= 82) return 'rain'; // Shower rain
    if (code >= 95) return 'thunderstorm';
    return 'clear sky';
  };

  // ============================================================
  // useEffect 훅: 컴포넌트의 생명주기 이벤트를 처리합니다
  // ============================================================
  // useEffect(() => { 실행할 코드 }, [의존성 배열])
  // - 의존성 배열이 비어있으면 [] 컴포넌트가 처음 로드될 때만 실행됩니다 (WinForms: Form_Load)
  // - 의존성 배열에 값이 있으면, 그 값이 변경될 때마다 실행됩니다
  // - return 함수는 컴포넌트가 언마운트되거나 재실행되기 전에 정리 작업을 수행합니다 (WinForms: Form_Closed)
  
  // 실시간 시계: 1초마다 현재 시간을 업데이트합니다
  // WinForms의 Timer 컨트롤의 Tick 이벤트와 비슷합니다
  useEffect(() => {
    // setInterval: WinForms의 Timer.Start()와 비슷합니다
    // 1000ms(1초)마다 setTime(new Date())를 호출하여 시간을 업데이트합니다
    const timer = setInterval(() => setTime(new Date()), 1000);
    
    // 정리 함수: 컴포넌트가 제거되거나 재렌더링될 때 타이머를 정리합니다
    // WinForms의 Timer.Stop()과 비슷합니다
    return () => clearInterval(timer);
  }, []); // 빈 배열: 컴포넌트가 처음 마운트될 때만 실행

  // 배터리 상태 API: 브라우저의 배터리 API를 사용하여 배터리 정보를 가져옵니다
  // WinForms의 SystemInformation.PowerStatus와 비슷합니다
  useEffect(() => {
    // navigator 객체에 getBattery 메서드가 있는지 확인합니다 (일부 브라우저만 지원)
    if ('getBattery' in navigator) {
      // getBattery()는 Promise를 반환합니다 (비동기 작업)
      // WinForms의 async/await 패턴과 비슷합니다
      (navigator as any).getBattery().then((m: any) => {
        // 배터리 정보를 업데이트하는 함수를 정의합니다
        const update = () => setBattery({ 
          level: Math.round(m.level * 100),  // 0~1 값을 0~100으로 변환
          charging: m.charging                // 충전 중 여부
        });
        
        // 즉시 한 번 실행하여 초기 배터리 상태를 가져옵니다
        update();
        
        // 배터리 레벨이 변경될 때마다 update 함수를 호출합니다
        // WinForms의 이벤트 핸들러 등록과 비슷합니다
        m.addEventListener('levelchange', update);
        m.addEventListener('chargingchange', update);
      });
    }
  }, []); // 컴포넌트가 처음 로드될 때만 실행

  // useRef: 상태 변경으로 UI 업데이트를 트리거하지 않는 변수를 만듭니다
  // WinForms의 private 필드 변수와 비슷합니다 (UI 업데이트 없이 값만 저장)
  // 로딩 중인지 추적하기 위해 사용합니다 (중복 API 호출 방지)
  const loadingRef = useRef(false);
  
  // ============================================================
  // 날씨 데이터를 가져오는 함수
  // ============================================================
  // useCallback: 함수를 메모리에 캐시하여 불필요한 재생성을 방지합니다
  // WinForms의 private 메서드와 비슷하지만, 의존성이 변경되지 않으면 같은 함수 인스턴스를 재사용합니다
  // async: 비동기 함수입니다 (WinForms의 async Task 메서드와 같습니다)
  // force: 강제로 새로고침할지 여부 (기본값: false)
  const fetchWeather = useCallback(async (force = false) => {
    // 이미 로딩 중이고 강제 모드가 아니면 중복 호출을 방지합니다
    // WinForms의 if (isLoading && !force) return; 와 비슷합니다
    if (loadingRef.current && !force) return;
    
    // 로딩 상태를 true로 설정합니다
    loadingRef.current = true;  // useRef: UI 업데이트 없음
    setLoading(true);            // useState: UI 업데이트 (로딩 스피너 표시 등)
    
    try {
      // 사용자의 현재 위치를 가져옵니다 (WinForms의 GeoCoordinateWatcher와 비슷)
      // Promise: 비동기 작업의 결과를 나타냅니다 (WinForms의 Task와 비슷)
      // await: Promise가 완료될 때까지 기다립니다 (WinForms의 await와 같습니다)
      const pos = await new Promise<GeolocationPosition>((resolve, reject) => {
        // navigator.geolocation: 브라우저의 위치 정보 API
        // getCurrentPosition: 현재 위치를 가져옵니다
        // resolve: 성공 시 호출, reject: 실패 시 호출
        // timeout: 5초 내에 위치를 가져오지 못하면 타임아웃
        navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 5000 });
      }).catch(() => null);  // 에러가 발생하면 null을 반환합니다
      
      // 위치 정보가 없으면 기본값으로 서울 좌표를 사용합니다 (위도, 경도)
      const lat = pos?.coords.latitude || 37.5665;   // ?. : null 체크 (WinForms의 ?. 와 같습니다)
      const lon = pos?.coords.longitude || 126.9780;
      
      // 현재 브라우저의 시간대를 가져옵니다 (예: "Asia/Seoul")
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

      // Promise.all: 여러 비동기 작업을 동시에 실행하고 모두 완료될 때까지 기다립니다
      // WinForms의 Task.WhenAll과 비슷합니다
      // fetch: HTTP 요청을 보냅니다 (WinForms의 HttpClient.GetAsync와 비슷)
      const [weatherRes, airRes] = await Promise.all([
        // 날씨 API 호출: 현재 날씨와 예보 정보를 가져옵니다
        fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=${encodeURIComponent(timezone)}`),
        // 대기질 API 호출: 미세먼지 정보를 가져옵니다
        fetch(`https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lon}&current=pm10,pm2_5`)
      ]);

      // JSON 응답을 파싱합니다 (WinForms의 JsonSerializer.Deserialize와 비슷)
      const wData = await weatherRes.json();  // 날씨 데이터
      const aData = await airRes.json();      // 대기질 데이터

      // API 응답 데이터가 유효한지 확인합니다
      if (wData.current && wData.daily) {
        // 현재 날씨 정보를 상태 변수에 저장합니다
        // setWeather 호출 시 UI가 자동으로 업데이트됩니다 (WinForms의 Property setter와 비슷)
        setWeather({
          temp: Math.round(wData.current.temperature_2m),        // 현재 온도
          low: Math.round(wData.daily.temperature_2m_min[0]),    // 오늘 최저 온도
          high: Math.round(wData.daily.temperature_2m_max[0]),   // 오늘 최고 온도
          condition: mapWmoToCondition(wData.current.weather_code), // 날씨 상태 (맑음, 흐림 등)
          humidity: wData.current.relative_humidity_2m,          // 습도
          location: timezone.split('/').pop()?.replace('_', ' ') || 'My Location', // 위치 이름
          pm10: Math.round(aData.current.pm10 || 0),             // 미세먼지 PM10
          pm25: Math.round(aData.current.pm2_5 || 0)             // 초미세먼지 PM2.5
        });

        // 예보 정보를 상태 변수에 저장합니다
        setForecast({
          tomorrow: {
            // [1]: 내일 데이터 (배열 인덱스 1)
            temp: Math.round(wData.daily.temperature_2m_max[1]),
            low: Math.round(wData.daily.temperature_2m_min[1]),
            high: Math.round(wData.daily.temperature_2m_max[1]),
            condition: mapWmoToCondition(wData.daily.weather_code[1])
          },
          dayAfter: {
            // [2]: 모레 데이터 (배열 인덱스 2)
            temp: Math.round(wData.daily.temperature_2m_max[2]),
            low: Math.round(wData.daily.temperature_2m_min[2]),
            high: Math.round(wData.daily.temperature_2m_max[2]),
            condition: mapWmoToCondition(wData.daily.weather_code[2])
          }
        });
      }
    } catch (error) {
      // 에러 발생 시 콘솔에 출력합니다 (WinForms의 Debug.WriteLine과 비슷)
      console.error("Weather fetch error:", error);
    } finally {
      // try-catch-finally: WinForms의 try-finally와 같습니다
      // 성공하든 실패하든 항상 실행됩니다
      loadingRef.current = false;  // 로딩 상태 해제 (useRef)
      setLoading(false);            // UI 업데이트 (useState)
    }
  }, []); // 빈 의존성 배열: 함수가 처음 생성될 때만 메모리에 저장됩니다

  // ============================================================
  // 날씨 데이터 자동 새로고침 설정
  // ============================================================
  // 컴포넌트가 로드될 때 날씨를 가져오고, 4시간마다 자동으로 새로고침합니다
  // WinForms의 Timer 컨트롤로 주기적으로 작업을 수행하는 것과 비슷합니다
  useEffect(() => {
    // 컴포넌트가 처음 로드될 때 즉시 날씨 데이터를 가져옵니다
    fetchWeather();
    
    // 4시간마다 날씨를 자동으로 새로고침합니다
    // setInterval: WinForms의 Timer.Start()와 비슷합니다
    // 4 * 60 * 60 * 1000 = 4시간을 밀리초로 변환 (14,400,000ms)
    const interval = setInterval(() => {
      fetchWeather(true); // true: 강제 모드 (로딩 중이어도 실행)
    }, 4 * 60 * 60 * 1000);
    
    // 정리 함수: 컴포넌트가 제거되거나 재렌더링될 때 인터벌을 정리합니다
    // WinForms의 Timer.Stop()과 비슷합니다
    return () => clearInterval(interval);
  }, [fetchWeather]); // fetchWeather 함수가 변경될 때마다 재실행 (거의 발생하지 않음)

  // ============================================================
  // 시간 포맷팅
  // ============================================================
  // Date 객체에서 시, 분, 초를 2자리 문자열로 변환합니다
  // (() => { ... })(): 즉시 실행 함수 (IIFE - Immediately Invoked Function Expression)
  // WinForms의 private 메서드를 호출하여 값을 계산하는 것과 비슷합니다
  const { h, m, s } = (() => {
    // getHours(): 0~23 값을 반환합니다
    // toString(): 숫자를 문자열로 변환합니다
    // padStart(2, '0'): 2자리로 만들고, 부족하면 앞에 '0'을 추가합니다 (예: "05", "23")
    const hh = time.getHours().toString().padStart(2, '0');     // 시
    const mm = time.getMinutes().toString().padStart(2, '0');   // 분
    const ss = time.getSeconds().toString().padStart(2, '0');   // 초
    return { h: hh, m: mm, s: ss };  // 객체로 반환 (구조 분해 할당으로 받음)
  })();

  // ============================================================
  // UI 렌더링 (JSX - JavaScript XML)
  // ============================================================
  // return 문이 UI를 반환합니다 (WinForms의 Form.Designer.cs의 InitializeComponent와 비슷)
  // JSX는 HTML과 비슷하지만, JavaScript 코드를 사용할 수 있습니다
  // className: HTML의 class 속성입니다 (CSS 클래스 지정)
  // {변수명}: JavaScript 변수를 출력합니다 (WinForms의 {변수} 문자열 보간과 비슷)
  return (
    // 최상위 컨테이너: 전체 화면을 차지하는 검은 배경의 레이아웃
    // className 설명:
    //   - relative: 상대 위치 지정 (absolute 요소의 기준점)
    //   - w-full: 너비 100%
    //   - h-screen: 높이 100vh (화면 전체 높이)
    //   - bg-black: 배경색 검은색
    //   - flex: Flexbox 레이아웃 사용 (WinForms의 TableLayoutPanel과 비슷)
    //   - p-3 md:p-4: 패딩 (모바일 12px, 데스크톱 16px)
    //   - gap-3 md:gap-4: 자식 요소 간 간격 (모바일 12px, 데스크톱 16px)
    //   - overflow-hidden: 넘치는 내용 숨김
    //   - select-none: 텍스트 선택 불가
    <div className="relative w-full h-screen bg-black flex p-3 md:p-4 gap-3 md:gap-4 overflow-hidden select-none">
      {/* 왼쪽 영역: 시계, 날씨 위젯들 */}
      {/* flex-1: 남은 공간을 모두 차지 */}
      {/* flex flex-col: 세로 방향으로 자식 요소들을 배치 (WinForms의 TableLayoutPanel의 세로 방향) */}
      <div className="flex-1 flex flex-col gap-3 md:gap-4 h-full">
        {/* 메인 시계 카드 */}
        {/* flex-[3] md:flex-[5]: 모바일에서는 3배 공간, 데스크톱에서는 5배 공간 차지 */}
        {/* {#0d0d0d}: HEX 색상 코드 (거의 검은색) */}
        {/* rounded-[2rem]: 둥근 모서리 32px */}
        {/* border border-white/5: 흰색 5% 투명도 테두리 */}
        {/* relative: 내부의 absolute 요소들의 기준점 */}
        {/* overflow-hidden: 넘치는 내용 숨김 */}
        <div 
          className="bg-[#0d0d0d] rounded-[2rem] md:rounded-[2.5rem] border border-white/5 flex items-center justify-center relative overflow-hidden group"
          style={{ flex: `${currentLayout.clock}` }}
        >
          
          {/* 좌측 상단: 배터리 상태 표시기 */}
          {/* absolute: 절대 위치 지정 (부모 요소의 relative를 기준으로 배치) */}
          {/* top-2 left-4: 위에서 8px, 왼쪽에서 16px 떨어진 위치 */}
          {/* z-20: z-index 20 (다른 요소 위에 표시) */}
          <div className="absolute top-2 left-4 z-20">
            <div className="p-1.5 bg-white/5 rounded-full border border-white/5 text-gray-400 hover:text-white transition-all active:scale-95 flex items-center gap-1.5">
              <span className="text-[10px] font-bold tabular-nums">{battery.level}%</span>
              <div className="relative">
                {battery.charging ? (
                  <BatteryCharging className="w-4 h-4 text-green-500" />
                ) : (
                  <div className="relative flex items-center">
                    <Battery className={`w-4 h-4 ${battery.level <= 15 ? 'text-red-500' : 'text-gray-400'}`} />
                    <div 
                      className="absolute left-[2px] top-[4.5px] h-[7px] bg-white rounded-[1px] transition-all"
                      style={{ width: `${Math.max(1, (battery.level / 100) * 10)}px` }}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 우측 상단: 새로고침 버튼 */}
          <div className="absolute top-2 right-4 z-20">
            {/* button: HTML 버튼 요소 */}
            {/* onClick: 클릭 이벤트 핸들러 (WinForms의 button.Click 이벤트와 비슷) */}
            {/* () => fetchWeather(): 화살표 함수 (익명 함수) */}
            <button 
              onClick={() => fetchWeather()}
              className="p-1.5 bg-white/5 rounded-full border border-white/5 text-gray-400 hover:text-white transition-all active:scale-95"
            >
              {/* RefreshCw: 새로고침 아이콘 (lucide-react 라이브러리) */}
              {/* className에 JavaScript 표현식을 사용: loading이 true면 스피너 애니메이션 적용 */}
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-blue-400' : ''}`} />
            </button>
          </div>

          {/* 시계 표시 영역 - 클릭하면 설정 팝업이 나타납니다 */}
          {/* items-center: 세로 중앙 정렬 */}
          {/* cursor-pointer: 마우스 커서를 포인터로 변경 (클릭 가능함을 표시) */}
          {/* onClick: 클릭 이벤트 핸들러 - 설정 팝업을 엽니다 */}
          <div className="flex flex-col items-center cursor-pointer" onClick={() => setShowSettingsModal(true)}>
            {/* items-baseline: 텍스트를 기준선으로 정렬 (숫자가 깔끔하게 정렬됨) */}
            {/* tracking-tighter: 글자 간격 좁히기 */}
            {/* style을 사용하여 동적으로 폰트 크기를 설정합니다 */}
            <div className="flex items-baseline font-bold tracking-tighter text-white" style={{ fontSize: `${currentLayout.clockFontSize}rem` }}>
              {/* 시 (Hours) */}
              {/* {h}: JavaScript 변수 출력 (위에서 계산한 시간) */}
              <span className="leading-none">{h}</span>
              
              {/* 시와 분 사이의 구분자 (:) - 부모의 폰트 크기에 비례 */}
              <span className="font-thin mx-1 opacity-20 leading-none" style={{ fontSize: '0.6em' }}>:</span>
              
              {/* 분 (Minutes) */}
              <span className="leading-none">{m}</span>
              
              {/* 초 (Seconds) - 부모의 폰트 크기에 비례하여 작게 */}
              {/* tabular-nums: 숫자가 같은 너비를 차지하도록 (시계처럼) */}
              <span className="font-light ml-2 sm:ml-4 text-gray-600 leading-none tabular-nums" style={{ fontSize: '0.3em' }}>{s}</span>
            </div>
          </div>
        </div>

        {/* 하단 영역: 날씨 위젯들 */}
        {/* style={{ flex: `${currentLayout.weather}` }}: 동적으로 flex 비율을 설정합니다 */}
        <div className="flex gap-3 md:gap-4" style={{ flex: `${currentLayout.weather}` }}>
          {/* 날씨 위젯 */}
          {/* ${loading ? 'opacity-50' : 'opacity-100'}: 로딩 중이면 50% 투명도, 아니면 100% */}
          {/* template literal (백틱 ` `): JavaScript 문자열 보간 (WinForms의 $"{변수}" 와 비슷) */}
          <div className={`flex-1 bg-[#0d0d0d] rounded-[2rem] md:rounded-[2.5rem] border border-white/5 p-4 md:p-5 flex flex-col justify-between transition-opacity duration-500 ${loading ? 'opacity-50' : 'opacity-100'}`}>
            <div className="flex justify-between items-start">
              <div className="flex flex-col">
                {WEATHER_ICONS[weather.condition] || WEATHER_ICONS['clear sky']}
                <span className="mt-1 text-xs text-gray-400 font-medium capitalize">{weather.condition}</span>
              </div>
              <div className="text-right">
                <span className="text-4xl md:text-5xl font-light tracking-tighter">{weather.temp}°</span>
                <div className="flex justify-end gap-2 text-[10px] text-gray-500 font-medium mt-1 uppercase tracking-tight">
                  <span className="text-blue-400">L:{weather.low}°</span>
                  <span className="text-orange-400">H:{weather.high}°</span>
                </div>
              </div>
            </div>

            <div className="mt-auto space-y-1.5 pt-3 border-t border-white/5">
              <div className="flex justify-between items-center text-[10px] md:text-xs">
                 <span className="text-gray-500 font-medium">Humidity</span>
                 <span className="text-gray-200 font-bold">{weather.humidity}%</span>
              </div>
              <div className="flex justify-between items-center text-[10px] md:text-xs">
                 <span className="text-gray-500 font-medium">Dust PM10 / PM2.5</span>
                 <span className="text-gray-200 font-bold">{weather.pm10} / {weather.pm25}</span>
              </div>
              <div className="flex justify-between items-end">
                <p className="text-[8px] text-gray-700 truncate opacity-60 uppercase tracking-widest max-w-[150px]">{weather.location}</p>
                <a href="https://open-meteo.com/" target="_blank" rel="noreferrer" className="text-[8px] text-gray-800 hover:text-blue-500 transition-colors">
                  <ExternalLink className="w-2 h-2" />
                </a>
              </div>
            </div>
          </div>

          {/* Forecast Widget */}
          <div className={`flex-1 bg-[#0d0d0d] rounded-[2rem] md:rounded-[2.5rem] border border-white/5 p-4 md:p-5 flex flex-col gap-3 transition-opacity duration-500 ${loading ? 'opacity-50' : 'opacity-100'}`}>
             <div className="flex-1 flex items-center justify-between border-b border-white/5 pb-2">
                <div className="flex flex-col">
                  <p className="text-[10px] text-blue-400 font-bold uppercase tracking-wider">Tomorrow</p>
                  <p className="text-xs text-gray-500 capitalize">{forecast.tomorrow.condition}</p>
                </div>
                <div className="flex items-center gap-3">
                  {MINI_WEATHER_ICONS[forecast.tomorrow.condition] || MINI_WEATHER_ICONS['partly cloudy']}
                  <div className="flex flex-col items-end">
                    <span className="text-xl font-bold text-gray-200">{forecast.tomorrow.high}°</span>
                    <span className="text-[10px] text-gray-500 font-medium">{forecast.tomorrow.low}°</span>
                  </div>
                </div>
             </div>

             <div className="flex-1 flex items-center justify-between pt-1">
                <div className="flex flex-col">
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Day After</p>
                  <p className="text-xs text-gray-500 capitalize">{forecast.dayAfter.condition}</p>
                </div>
                <div className="flex items-center gap-3">
                  {MINI_WEATHER_ICONS[forecast.dayAfter.condition] || MINI_WEATHER_ICONS['cloudy']}
                  <div className="flex flex-col items-end">
                    <span className="text-xl font-bold text-gray-200">{forecast.dayAfter.high}°</span>
                    <span className="text-[10px] text-gray-500 font-medium">{forecast.dayAfter.low}°</span>
                  </div>
                </div>
             </div>
          </div>
        </div>
      </div>

      {/* 오른쪽 영역: 달력 위젯 */}
      {/* style={{ width: `${currentLayout.calendar}%` }}: 동적으로 너비를 설정합니다 */}
      <div 
        className="bg-[#0d0d0d] rounded-[2rem] md:rounded-[2.5rem] border border-white/5 overflow-hidden flex flex-col h-full shadow-inner"
        style={{ width: `${currentLayout.calendar}%` }}
      >
        {/* CalendarWidget: 별도의 컴포넌트를 사용 */}
        {/* WinForms의 UserControl을 추가하는 것과 비슷합니다 */}
        <CalendarWidget />
      </div>

      {/* 하단 중앙: 인디케이터 바 (장식용) */}
      {/* absolute bottom-1: 하단에서 4px 떨어진 위치 */}
      {/* left-1/2 -translate-x-1/2: 수평 중앙 정렬 (50% 위치에서 자신의 너비의 50%만큼 왼쪽으로 이동) */}
      {/* pointer-events-none: 마우스 이벤트 무시 (클릭 불가) */}
      <div className="absolute bottom-1 md:bottom-2 left-1/2 -translate-x-1/2 w-24 md:w-32 h-1 bg-white/10 rounded-full pointer-events-none" />

      {/* ============================================================ */}
      {/* 설정 팝업 모달 (WinForms의 Form.ShowDialog()와 비슷) */}
      {/* ============================================================ */}
      {showSettingsModal && (
        <div 
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={(e) => {
            // 배경 클릭 시 팝업 닫기
            if (e.target === e.currentTarget) {
              setShowSettingsModal(false);
            }
          }}
        >
          {/* 모달 내용: 배경 클릭과 구분하기 위해 stopPropagation 사용 */}
          <div 
            className="bg-[#0d0d0d] rounded-[2rem] border border-white/10 p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* 모달 헤더 */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Settings className="w-5 h-5" />
                레이아웃 설정
              </h2>
              {/* 닫기 버튼 */}
              <button
                onClick={() => setShowSettingsModal(false)}
                className="p-2 hover:bg-white/5 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            {/* 현재 디바이스 타입만 표시 */}
            {(() => {
              const currentDeviceType = getDeviceType();
              const deviceName = { mobile: '모바일', tablet: '태블릿', desktop: '데스크탑' }[currentDeviceType];
              const settings = layoutSettings[currentDeviceType];

              return (
                <div className="mb-6">
                  {/* 현재 디바이스 타입 제목 */}
                  <h3 className="text-sm font-semibold text-gray-300 mb-4">{deviceName} 설정</h3>

                  {/* 시계 영역 크기 조절 */}
                  <div className="mb-4">
                    <label className="block text-xs text-gray-400 mb-2">시계 영역 크기: {settings.clock}</label>
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value={settings.clock}
                      onChange={(e) => {
                        const newValue = parseInt(e.target.value);
                        setLayoutSettings((prev) => {
                          const updated = {
                            ...prev,
                            [currentDeviceType]: { ...prev[currentDeviceType], clock: newValue }
                          };
                          saveLayoutSettings(updated); // 로컬 스토리지에 저장
                          return updated;
                        });
                      }}
                      className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-blue-500"
                    />
                  </div>

                  {/* 시계 폰트 크기 조절 */}
                  <div className="mb-4">
                    <label className="block text-xs text-gray-400 mb-2">시계 폰트 크기: {settings.clockFontSize}rem</label>
                    <input
                      type="range"
                      min="3"
                      max="20"
                      step="0.5"
                      value={settings.clockFontSize}
                      onChange={(e) => {
                        const newValue = parseFloat(e.target.value);
                        setLayoutSettings((prev) => {
                          const updated = {
                            ...prev,
                            [currentDeviceType]: { ...prev[currentDeviceType], clockFontSize: newValue }
                          };
                          saveLayoutSettings(updated);
                          return updated;
                        });
                      }}
                      className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-blue-500"
                    />
                  </div>

                  {/* 날씨 영역 크기 조절 */}
                  <div className="mb-4">
                    <label className="block text-xs text-gray-400 mb-2">날씨 영역 크기: {settings.weather}</label>
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value={settings.weather}
                      onChange={(e) => {
                        const newValue = parseInt(e.target.value);
                        setLayoutSettings((prev) => {
                          const updated = {
                            ...prev,
                            [currentDeviceType]: { ...prev[currentDeviceType], weather: newValue }
                          };
                          saveLayoutSettings(updated);
                          return updated;
                        });
                      }}
                      className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-blue-500"
                    />
                  </div>

                  {/* 달력 영역 너비 조절 */}
                  <div className="mb-4">
                    <label className="block text-xs text-gray-400 mb-2">달력 영역 너비: {settings.calendar}%</label>
                    <input
                      type="range"
                      min="20"
                      max="60"
                      value={settings.calendar}
                      onChange={(e) => {
                        const newValue = parseInt(e.target.value);
                        setLayoutSettings((prev) => {
                          const updated = {
                            ...prev,
                            [currentDeviceType]: { ...prev[currentDeviceType], calendar: newValue }
                          };
                          saveLayoutSettings(updated);
                          return updated;
                        });
                      }}
                      className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-blue-500"
                    />
                  </div>
                </div>
              );
            })()}

            {/* 기본값으로 복원 버튼 (현재 디바이스만) */}
            <div className="mt-6 pt-4 border-t border-white/5">
              <button
                onClick={() => {
                  const currentDeviceType = getDeviceType();
                  setLayoutSettings((prev) => {
                    const updated = {
                      ...prev,
                      [currentDeviceType]: defaultLayoutSettings[currentDeviceType]
                    };
                    saveLayoutSettings(updated);
                    return updated;
                  });
                }}
                className="w-full px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-sm text-gray-300 transition-colors"
              >
                기본값으로 복원
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// export default: 이 컴포넌트를 다른 파일에서 import할 수 있도록 내보냅니다
// WinForms의 public 클래스와 비슷합니다
export default App;
