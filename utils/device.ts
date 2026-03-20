// 디바이스 타입 감지 유틸리티 함수들

import { DeviceType } from '../types';

/**
 * 현재 디바이스 타입을 감지하는 함수
 * 화면 너비를 기준으로 모바일/태블릿/데스크탑을 구분합니다.
 * 
 * @returns 'mobile' | 'tablet' | 'desktop'
 * - mobile: 768px 미만
 * - tablet: 768px 이상 1024px 미만
 * - desktop: 1024px 이상
 */
export const getDeviceType = (): DeviceType => {
  // 서버 사이드 렌더링(SSR) 환경에서는 window 객체가 없으므로 기본값으로 'desktop' 반환
  if (typeof window === 'undefined') return 'desktop';
  
  const width = window.innerWidth;
  
  if (width < 768) return 'mobile';      // 모바일: 768px 미만
  if (width < 1024) return 'tablet';     // 태블릿: 768px~1024px
  return 'desktop';                       // 데스크탑: 1024px 이상
};
