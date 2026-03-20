// 시간 관련 유틸리티 함수들

/**
 * Date 객체를 시, 분, 초 문자열로 포맷팅하는 함수
 * 시, 분, 초를 2자리 문자열로 변환합니다 (예: "05", "23")
 * 
 * @param date 포맷팅할 Date 객체
 * @returns { h: string, m: string, s: string } - 시, 분, 초 문자열 객체
 * 
 * @example
 * const time = new Date();
 * const { h, m, s } = formatTime(time);
 * console.log(`${h}:${m}:${s}`); // "14:30:25"
 */
export const formatTime = (date: Date): { h: string; m: string; s: string } => {
  // getHours(): 0~23 값을 반환합니다
  // toString(): 숫자를 문자열로 변환합니다
  // padStart(2, '0'): 2자리로 만들고, 부족하면 앞에 '0'을 추가합니다 (예: "05", "23")
  const h = date.getHours().toString().padStart(2, '0');     // 시
  const m = date.getMinutes().toString().padStart(2, '0');   // 분
  const s = date.getSeconds().toString().padStart(2, '0');   // 초
  
  return { h, m, s };
};
