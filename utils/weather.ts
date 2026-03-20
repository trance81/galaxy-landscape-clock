// 날씨 관련 유틸리티 함수들

/**
 * WMO(World Meteorological Organization) 코드를 날씨 문자열로 변환하는 함수
 * Open-Meteo API에서 사용하는 날씨 코드를 사람이 읽기 쉬운 문자열로 변환합니다.
 * 
 * @param code WMO 날씨 코드 (숫자)
 * @returns 날씨 상태 문자열 (예: 'clear sky', 'rain', 'snow' 등)
 */
export const mapWmoToCondition = (code: number): string => {
  if (code === 0) return 'clear sky';
  if (code <= 3) return 'partly cloudy';
  if (code >= 45 && code <= 48) return 'fog';
  if (code >= 51 && code <= 55) return 'drizzle';
  if (code >= 61 && code <= 65) return 'rain';
  if (code >= 71 && code <= 77) return 'snow';
  if (code >= 80 && code <= 82) return 'rain'; // Shower rain
  if (code >= 95) return 'thunderstorm';
  return 'clear sky'; // 기본값
};
