
export interface WeatherData {
  temp: number;
  condition: string;
  humidity: number;
  location: string;
}

export interface AQIData {
  pm10: number;
  pm25: number;
}

export interface DDayInfo {
  label: string;
  targetDate: string;
}

export enum Tab {
  Clock = 'clock',
  Settings = 'settings',
  Timer = 'timer'
}

// 레이아웃 설정 타입 정의
// 각 디바이스 타입별 레이아웃 비율을 저장하는 인터페이스
export interface LayoutSettings {
  clock: number;        // 시계 영역의 flex 비율
  clockFontSize: number; // 시계 폰트 크기 (rem 단위)
  weather: number;      // 날씨 영역의 flex 비율
  calendar: number;     // 달력 영역의 너비 (%)
}

// 디바이스 타입별 레이아웃 설정 객체 타입
export type DeviceLayoutSettings = {
  mobile: LayoutSettings;
  tablet: LayoutSettings;
  desktop: LayoutSettings;
}

// 디바이스 타입
export type DeviceType = 'mobile' | 'tablet' | 'desktop';

// 배터리 상태 타입
export interface BatteryStatus {
  level: number;
  charging: boolean | null;
}