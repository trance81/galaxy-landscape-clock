// 레이아웃 설정 관련 유틸리티 함수들

import { DeviceLayoutSettings, LayoutSettings } from '../types';

/**
 * 디바이스 타입별 기본 레이아웃 설정값
 * 모바일, 태블릿, 데스크탑 각각의 기본 레이아웃 비율을 정의합니다.
 */
export const defaultLayoutSettings: DeviceLayoutSettings = {
  mobile: { clock: 3, clockFontSize: 5, weather: 5, calendar: 40 },     // 모바일 기본값
  tablet: { clock: 4, clockFontSize: 6, weather: 4, calendar: 35 },     // 태블릿 기본값
  desktop: { clock: 5, clockFontSize: 14, weather: 4, calendar: 32 }    // 데스크탑 기본값
};

/**
 * localStorage에서 레이아웃 설정을 불러오는 함수
 * 저장된 설정이 없으면 기본값을 반환합니다.
 * 
 * @returns DeviceLayoutSettings - 로드된 설정 또는 기본값
 */
export const loadLayoutSettings = (): DeviceLayoutSettings => {
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

/**
 * 레이아웃 설정을 localStorage에 저장하는 함수
 * 설정 변경 시 자동으로 저장되어 다음 접속 시에도 유지됩니다.
 * 
 * @param settings 저장할 레이아웃 설정 객체
 */
export const saveLayoutSettings = (settings: DeviceLayoutSettings): void => {
  try {
    localStorage.setItem('layoutSettings', JSON.stringify(settings));
  } catch (error) {
    console.error('Failed to save layout settings:', error);
  }
};
