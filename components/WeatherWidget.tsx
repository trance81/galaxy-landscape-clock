// 날씨 위젯 컴포넌트
// 현재 날씨와 예보 정보를 표시하는 위젯입니다.

import React from 'react';
import { ExternalLink } from 'lucide-react';
import { WEATHER_ICONS, MINI_WEATHER_ICONS } from '../constants';

/**
 * 날씨 데이터 타입
 */
interface WeatherData {
  temp: number;
  low: number;
  high: number;
  condition: string;
  humidity: number;
  location: string;
  pm10: number;
  pm25: number;
}

/**
 * 예보 데이터 타입
 */
interface ForecastData {
  temp: number;
  low: number;
  high: number;
  condition: string;
}

/**
 * WeatherWidget Props 타입 정의
 */
interface WeatherWidgetProps {
  /** 현재 날씨 데이터 */
  weather: WeatherData;
  /** 예보 데이터 (내일, 모레) */
  forecast: {
    tomorrow: ForecastData;
    dayAfter: ForecastData;
  };
  /** 로딩 중인지 여부 */
  loading: boolean;
  /** 날씨 영역의 flex 비율 */
  weatherFlex: number;
}

/**
 * 날씨 위젯 컴포넌트
 * 현재 날씨와 예보 정보를 표시합니다.
 */
export const WeatherWidget: React.FC<WeatherWidgetProps> = ({
  weather,
  forecast,
  loading,
  weatherFlex
}) => {
  return (
    <div className="flex gap-3 md:gap-4" style={{ flex: `${weatherFlex}` }}>
      {/* 현재 날씨 위젯 */}
      <div className={`flex-1 bg-[#0d0d0d] rounded-[2rem] md:rounded-[2.5rem] border border-white/5 p-2 md:p-3 flex flex-col justify-between transition-opacity duration-500 ${loading ? 'opacity-50' : 'opacity-100'}`}>
        <div className="flex justify-between items-start">
          <div className="flex flex-col">
            {/* 날씨 아이콘 표시 */}
            {WEATHER_ICONS[weather.condition] || WEATHER_ICONS['clear sky']}
            <span className="mt-0.5 text-xs text-gray-400 font-medium capitalize">{weather.condition}</span>
          </div>
          <div className="text-right">
            {/* 현재 온도 */}
            <span className="text-3xl md:text-4xl font-light tracking-tighter" style={{ color: '#cfcfcf' }}>{weather.temp}°</span>
            {/* 최저/최고 온도 */}
            <div className="flex justify-end gap-2 text-[10px] text-gray-500 font-medium mt-0.5 uppercase tracking-tight">
              <span className="text-blue-400">L:{weather.low}°</span>
              <span className="text-orange-400">H:{weather.high}°</span>
            </div>
          </div>
        </div>

        {/* 날씨 상세 정보 */}
        <div className="mt-auto space-y-1 pt-1.5 border-t border-white/5">
          {/* 습도 */}
          <div className="flex justify-between items-center text-[10px] md:text-xs">
            <span className="text-gray-500 font-medium">Humidity</span>
            <span className="font-bold" style={{ color: '#cfcfcf' }}>{weather.humidity}%</span>
          </div>
          {/* 미세먼지 */}
          <div className="flex justify-between items-center text-[10px] md:text-xs">
            <span className="text-gray-500 font-medium">Dust PM10 / PM2.5</span>
            <span className="font-bold" style={{ color: '#cfcfcf' }}>{weather.pm10} / {weather.pm25}</span>
          </div>
          {/* 위치 정보 */}
          <div className="flex justify-between items-end">
            <p className="text-[8px] text-gray-700 truncate opacity-60 uppercase tracking-widest max-w-[150px]">{weather.location}</p>
            <a href="https://open-meteo.com/" target="_blank" rel="noreferrer" className="text-[8px] text-gray-800 hover:text-blue-500 transition-colors">
              <ExternalLink className="w-2 h-2" />
            </a>
          </div>
        </div>
      </div>

      {/* 예보 위젯 (내일, 모레) */}
      <div className={`flex-1 bg-[#0d0d0d] rounded-[2rem] md:rounded-[2.5rem] border border-white/5 p-2 md:p-3 flex flex-col gap-1.5 transition-opacity duration-500 ${loading ? 'opacity-50' : 'opacity-100'}`}>
        {/* 내일 예보 */}
        <div className="flex-1 flex items-center justify-between border-b border-white/5 pb-1">
          <div className="flex flex-col">
            <p className="text-[10px] text-blue-400 font-bold uppercase tracking-wider">Tomorrow</p>
            <p className="text-xs text-gray-500 capitalize">{forecast.tomorrow.condition}</p>
          </div>
          <div className="flex items-center gap-3">
            {MINI_WEATHER_ICONS[forecast.tomorrow.condition] || MINI_WEATHER_ICONS['partly cloudy']}
            <div className="flex flex-col items-end">
              <span className="text-xl font-bold" style={{ color: '#cfcfcf' }}>{forecast.tomorrow.high}°</span>
              <span className="text-[10px] text-gray-500 font-medium">{forecast.tomorrow.low}°</span>
            </div>
          </div>
        </div>

        {/* 모레 예보 */}
        <div className="flex-1 flex items-center justify-between pt-0.5">
          <div className="flex flex-col">
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Day After</p>
            <p className="text-xs text-gray-500 capitalize">{forecast.dayAfter.condition}</p>
          </div>
          <div className="flex items-center gap-3">
            {MINI_WEATHER_ICONS[forecast.dayAfter.condition] || MINI_WEATHER_ICONS['cloudy']}
            <div className="flex flex-col items-end">
              <span className="text-xl font-bold" style={{ color: '#cfcfcf' }}>{forecast.dayAfter.high}°</span>
              <span className="text-[10px] text-gray-500 font-medium">{forecast.dayAfter.low}°</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
