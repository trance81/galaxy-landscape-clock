
import React from 'react';
import { 
  Cloud, 
  Sun, 
  CloudRain, 
  Wind, 
  CloudSun, 
  CloudMoon, 
  CloudSnow, 
  CloudLightning, 
  CloudDrizzle, 
  CloudFog,
  Zap
} from 'lucide-react';

export const INITIAL_WEATHER = {
  temp: 11,
  low: 6,
  high: 15,
  condition: 'clear sky',
  humidity: 43,
  location: 'Seoul, Korea',
  pm10: 15,
  pm25: 8
};

export const TOMORROW_WEATHER = {
  temp: 14,
  low: 9,
  high: 17,
  condition: 'partly cloudy',
};

export const DAY_AFTER_WEATHER = {
  temp: 12,
  low: 7,
  high: 14,
  condition: 'rain',
};

// Comprehensive mapping for all weather types
export const WEATHER_ICONS: Record<string, React.ReactNode> = {
  'clear sky': <Sun className="w-10 h-10 md:w-12 md:h-12 text-yellow-400" />,
  'sunny': <Sun className="w-10 h-10 md:w-12 md:h-12 text-yellow-400" />,
  'few clouds': <CloudSun className="w-10 h-10 md:w-12 md:h-12 text-blue-300" />,
  'partly cloudy': <CloudSun className="w-10 h-10 md:w-12 md:h-12 text-blue-300" />,
  'scattered clouds': <CloudSun className="w-10 h-10 md:w-12 md:h-12 text-blue-200" />,
  'broken clouds': <Cloud className="w-10 h-10 md:w-12 md:h-12 text-gray-300" />,
  'overcast clouds': <Cloud className="w-10 h-10 md:w-12 md:h-12 text-gray-500" />,
  'cloudy': <Cloud className="w-10 h-10 md:w-12 md:h-12 text-gray-400" />,
  'rain': <CloudRain className="w-10 h-10 md:w-12 md:h-12 text-blue-400" />,
  'moderate rain': <CloudRain className="w-10 h-10 md:w-12 md:h-12 text-blue-500" />,
  'heavy rain': <CloudRain className="w-10 h-10 md:w-12 md:h-12 text-blue-600" />,
  'light rain': <CloudDrizzle className="w-10 h-10 md:w-12 md:h-12 text-blue-300" />,
  'drizzle': <CloudDrizzle className="w-10 h-10 md:w-12 md:h-12 text-cyan-300" />,
  'thunderstorm': <CloudLightning className="w-10 h-10 md:w-12 md:h-12 text-yellow-500" />,
  'storm': <Zap className="w-10 h-10 md:w-12 md:h-12 text-yellow-400" />,
  'snow': <CloudSnow className="w-10 h-10 md:w-12 md:h-12 text-white" />,
  'heavy snow': <CloudSnow className="w-10 h-10 md:w-12 md:h-12 text-blue-100" />,
  'mist': <CloudFog className="w-10 h-10 md:w-12 md:h-12 text-gray-300" />,
  'fog': <CloudFog className="w-10 h-10 md:w-12 md:h-12 text-gray-400" />,
  'haze': <CloudFog className="w-10 h-10 md:w-12 md:h-12 text-orange-200" />,
  'windy': <Wind className="w-10 h-10 md:w-12 md:h-12 text-white" />,
};

export const MINI_WEATHER_ICONS: Record<string, React.ReactNode> = {
  'clear sky': <Sun className="w-6 h-6 text-yellow-400" />,
  'sunny': <Sun className="w-6 h-6 text-yellow-400" />,
  'few clouds': <CloudSun className="w-6 h-6 text-blue-300" />,
  'partly cloudy': <CloudSun className="w-6 h-6 text-blue-300" />,
  'cloudy': <Cloud className="w-6 h-6 text-gray-400" />,
  'rain': <CloudRain className="w-6 h-6 text-blue-400" />,
  'drizzle': <CloudDrizzle className="w-6 h-6 text-cyan-300" />,
  'thunderstorm': <CloudLightning className="w-6 h-6 text-yellow-500" />,
  'snow': <CloudSnow className="w-6 h-6 text-white" />,
  'mist': <CloudFog className="w-6 h-6 text-gray-300" />,
  'fog': <CloudFog className="w-6 h-6 text-gray-400" />,
};
