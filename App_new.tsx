// App.tsx - 메인 애플리케이션 컴포넌트
// 시계, 날씨, 달력을 표시하는 대시보드 애플리케이션입니다.

import React, { useState, useEffect, useCallback, useRef } from 'react';
import CalendarWidget from './components/CalendarWidget';
import { ClockWidget } from './components/ClockWidget';
import { WeatherWidget } from './components/WeatherWidget';
import { SettingsModal } from './components/SettingsModal';
import { INITIAL_WEATHER, TOMORROW_WEATHER, DAY_AFTER_WEATHER } from './constants';
import { DeviceLayoutSettings, BatteryStatus } from './types';
import { getDeviceType } from './utils/device';
import { loadLayoutSettings, saveLayoutSettings } from './utils/layoutSettings';
import { mapWmoToCondition } from './utils/weather';

/**
 * App 컴포넌트
 * 애플리케이션의 메인 컴포넌트로, 시계, 날씨, 달력 위젯을 조합합니다.
 */
const App: React.FC = () => {
  // ============================================================
  // 상태 변수 선언
  // ============================================================
  
  // 현재 시간 상태 (1초마다 업데이트)
  const [time, setTime] = useState(new Date());
  
  // 현재 날씨 정보 상태
  const [weather, setWeather] = useState(INITIAL_WEATHER);
  
  // 예보 정보 상태 (내일, 모레)
  const [forecast, setForecast] = useState({ 
    tomorrow: TOMORROW_WEATHER, 
    dayAfter: DAY_AFTER_WEATHER 
  });
  
  // 날씨 데이터 로딩 상태
  const [loading, setLoading] = useState(false);
  
  // 배터리 상태
  const [battery, setBattery] = useState<BatteryStatus>({ 
    level: 100, 
    charging: false 
  });
  
  // 레이아웃 설정 상태
  const [layoutSettings, setLayoutSettings] = useState<DeviceLayoutSettings>(loadLayoutSettings);
  
  // 설정 모달 표시 여부
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  
  // 현재 디바이스 타입에 맞는 레이아웃 설정
  const currentLayout = layoutSettings[getDeviceType()];
  
  // 로딩 중복 호출 방지를 위한 ref
  const loadingRef = useRef(false);
  
  // ============================================================
  // 실시간 시계 업데이트 (1초마다)
  // ============================================================
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);
  
  // ============================================================
  // 배터리 상태 API
  // ============================================================
  useEffect(() => {
    if ('getBattery' in navigator) {
      (navigator as any).getBattery().then((batteryManager: any) => {
        const updateBattery = () => setBattery({ 
          level: Math.round(batteryManager.level * 100),
          charging: batteryManager.charging
        });
        
        // 초기 배터리 상태 가져오기
        updateBattery();
        
        // 배터리 상태 변경 이벤트 리스너 등록
        batteryManager.addEventListener('levelchange', updateBattery);
        batteryManager.addEventListener('chargingchange', updateBattery);
      });
    }
  }, []);
  
  // ============================================================
  // 날씨 데이터 가져오기 함수
  // ============================================================
  const fetchWeather = useCallback(async (force = false) => {
    // 이미 로딩 중이고 강제 모드가 아니면 중복 호출 방지
    if (loadingRef.current && !force) return;
    
    // 로딩 상태 설정
    loadingRef.current = true;
    setLoading(true);
    
    try {
      // 사용자 위치 가져오기 (실패 시 서울 좌표 사용)
      const pos = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 5000 });
      }).catch(() => null);
      
      // 위치 정보 (기본값: 서울)
      const lat = pos?.coords.latitude || 37.5665;
      const lon = pos?.coords.longitude || 126.9780;
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      
      // 날씨 API와 대기질 API 병렬 호출
      const [weatherRes, airRes] = await Promise.all([
        fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=${encodeURIComponent(timezone)}`),
        fetch(`https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lon}&current=pm10,pm2_5`)
      ]);
      
      // JSON 응답 파싱
      const wData = await weatherRes.json();
      const aData = await airRes.json();
      
      // 날씨 데이터가 유효한지 확인
      if (wData.current && wData.daily) {
        // 현재 날씨 정보 업데이트
        setWeather({
          temp: Math.round(wData.current.temperature_2m),
          low: Math.round(wData.daily.temperature_2m_min[0]),
          high: Math.round(wData.daily.temperature_2m_max[0]),
          condition: mapWmoToCondition(wData.current.weather_code),
          humidity: wData.current.relative_humidity_2m,
          location: timezone.split('/').pop()?.replace('_', ' ') || 'My Location',
          pm10: Math.round(aData.current.pm10 || 0),
          pm25: Math.round(aData.current.pm2_5 || 0)
        });
        
        // 예보 정보 업데이트
        setForecast({
          tomorrow: {
            temp: Math.round(wData.daily.temperature_2m_max[1]),
            low: Math.round(wData.daily.temperature_2m_min[1]),
            high: Math.round(wData.daily.temperature_2m_max[1]),
            condition: mapWmoToCondition(wData.daily.weather_code[1])
          },
          dayAfter: {
            temp: Math.round(wData.daily.temperature_2m_max[2]),
            low: Math.round(wData.daily.temperature_2m_min[2]),
            high: Math.round(wData.daily.temperature_2m_max[2]),
            condition: mapWmoToCondition(wData.daily.weather_code[2])
          }
        });
      }
    } catch (error) {
      console.error("Weather fetch error:", error);
    } finally {
      // 로딩 상태 해제
      loadingRef.current = false;
      setLoading(false);
    }
  }, []);
  
  // ============================================================
  // 날씨 데이터 자동 새로고침 (4시간마다)
  // ============================================================
  useEffect(() => {
    // 초기 로드 시 날씨 데이터 가져오기
    fetchWeather();
    
    // 4시간마다 자동 새로고침
    const interval = setInterval(() => {
      fetchWeather(true); // 강제 모드
    }, 4 * 60 * 60 * 1000); // 4시간 = 14,400,000ms
    
    return () => clearInterval(interval);
  }, [fetchWeather]);
  
  // ============================================================
  // 레이아웃 설정 변경 핸들러
  // ============================================================
  const handleLayoutSettingsChange = (newSettings: DeviceLayoutSettings) => {
    saveLayoutSettings(newSettings); // localStorage에 저장
    setLayoutSettings(newSettings);  // 상태 업데이트
  };
  
  // ============================================================
  // UI 렌더링
  // ============================================================
  return (
    <div className="relative w-full h-screen bg-black flex p-3 md:p-4 gap-3 md:gap-4 overflow-hidden select-none">
      {/* 왼쪽 영역: 시계, 날씨 위젯들 */}
      <div className="flex-1 flex flex-col gap-3 md:gap-4 h-full">
        {/* 시계 위젯 */}
        <ClockWidget
          time={time}
          battery={battery}
          loading={loading}
          clockFlex={currentLayout.clock}
          clockFontSize={currentLayout.clockFontSize}
          onSettingsClick={() => setShowSettingsModal(true)}
          onRefreshClick={() => fetchWeather()}
        />
        
        {/* 날씨 위젯 */}
        <WeatherWidget
          weather={weather}
          forecast={forecast}
          loading={loading}
          weatherFlex={currentLayout.weather}
        />
      </div>
      
      {/* 오른쪽 영역: 달력 위젯 */}
      <div 
        className="bg-[#0d0d0d] rounded-[2rem] md:rounded-[2.5rem] border border-white/5 overflow-hidden flex flex-col h-full shadow-inner"
        style={{ width: `${currentLayout.calendar}%` }}
      >
        <CalendarWidget />
      </div>
      
      {/* 하단 중앙: 인디케이터 바 (장식용) */}
      <div 
        className="absolute bottom-1 md:bottom-2 left-1/2 -translate-x-1/2 w-24 md:w-32 h-1 bg-white/10 rounded-full pointer-events-none burn-in-prevention-buttons"
        style={{ willChange: 'transform' }}
      />
      
      {/* 설정 모달 */}
      <SettingsModal
        isOpen={showSettingsModal}
        onClose={() => setShowSettingsModal(false)}
        layoutSettings={layoutSettings}
        onSettingsChange={handleLayoutSettingsChange}
      />
    </div>
  );
};

export default App;
