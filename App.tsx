
import React, { useState, useEffect, useCallback, useRef } from 'react';
import CalendarWidget from './components/CalendarWidget';
import { INITIAL_WEATHER, TOMORROW_WEATHER, DAY_AFTER_WEATHER, WEATHER_ICONS, MINI_WEATHER_ICONS } from './constants';
import { RefreshCw, Battery, BatteryCharging, ExternalLink } from 'lucide-react';

const App: React.FC = () => {
  const [time, setTime] = useState(new Date());
  const [weather, setWeather] = useState(INITIAL_WEATHER);
  const [forecast, setForecast] = useState({ tomorrow: TOMORROW_WEATHER, dayAfter: DAY_AFTER_WEATHER });
  const [loading, setLoading] = useState(false);
  const [battery, setBattery] = useState<{ level: number; charging: boolean | null }>({ level: 100, charging: false });

  // Map WMO Codes from Open-Meteo to our weather strings
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

  // Real-time Clock
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Battery Status API
  useEffect(() => {
    if ('getBattery' in navigator) {
      (navigator as any).getBattery().then((m: any) => {
        const update = () => setBattery({ level: Math.round(m.level * 100), charging: m.charging });
        update();
        m.addEventListener('levelchange', update);
        m.addEventListener('chargingchange', update);
      });
    }
  }, []);

  const loadingRef = useRef(false);
  
  const fetchWeather = useCallback(async (force = false) => {
    if (loadingRef.current && !force) return;
    loadingRef.current = true;
    setLoading(true);
    try {
      const pos = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 5000 });
      }).catch(() => null);

      const lat = pos?.coords.latitude || 37.5665;
      const lon = pos?.coords.longitude || 126.9780;
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

      const [weatherRes, airRes] = await Promise.all([
        fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=${encodeURIComponent(timezone)}`),
        fetch(`https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lon}&current=pm10,pm2_5`)
      ]);

      const wData = await weatherRes.json();
      const aData = await airRes.json();

      if (wData.current && wData.daily) {
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
      loadingRef.current = false;
      setLoading(false);
    }
  }, []);

  // Initial weather fetch and auto-refresh every 4 hours (6 times per day)
  useEffect(() => {
    fetchWeather();
    
    // Set up interval to refresh weather every 4 hours (14,400,000 ms)
    const interval = setInterval(() => {
      fetchWeather(true); // Force refresh even if loading
    }, 4 * 60 * 60 * 1000); // 4 hours in milliseconds
    
    return () => clearInterval(interval);
  }, [fetchWeather]);

  const { h, m, s } = (() => {
    const hh = time.getHours().toString().padStart(2, '0');
    const mm = time.getMinutes().toString().padStart(2, '0');
    const ss = time.getSeconds().toString().padStart(2, '0');
    return { h: hh, m: mm, s: ss };
  })();

  return (
    <div className="relative w-full h-screen bg-black flex p-3 md:p-4 gap-3 md:gap-4 overflow-hidden select-none">
      <div className="flex-1 flex flex-col gap-3 md:gap-4 h-full">
        {/* Main Clock Card */}
        <div className="flex-[3] md:flex-[5] bg-[#0d0d0d] rounded-[2rem] md:rounded-[2.5rem] border border-white/5 flex items-center justify-center relative overflow-hidden group">
          
          {/* Top-Left: Battery Status Indicator - Moved higher and further left per request */}
          <div className="absolute flex items-center gap-1.5 px-2.5 py-1 bg-white/5 rounded-full border border-white/5 z-20" style={{ left: '682px', top: '10px' }}>
            <span className="text-[10px] font-bold text-gray-400 tabular-nums">{battery.level}%</span>
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

          {/* Top-Right: Refresh Control - Kept consistent with top-2 */}
          <div className="absolute top-2 right-4 z-20">
            <button 
              onClick={() => fetchWeather()}
              className="p-1.5 bg-white/5 rounded-full border border-white/5 text-gray-400 hover:text-white transition-all active:scale-95"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-blue-400' : ''}`} />
            </button>
          </div>

          <div className="flex flex-col items-center">
            <div className="flex items-baseline font-bold tracking-tighter text-white">
              <span className="text-[5rem] sm:text-[6rem] md:text-[14rem] leading-none">{h}</span>
              <span className="text-4xl sm:text-5xl md:text-9xl font-thin mx-1 opacity-20 leading-none">:</span>
              <span className="text-[5rem] sm:text-[6rem] md:text-[14rem] leading-none">{m}</span>
              <span className="text-2xl sm:text-3xl md:text-5xl font-light ml-2 sm:ml-4 text-gray-600 leading-none tabular-nums">{s}</span>
            </div>
          </div>
        </div>

        <div className="flex-[5] md:flex-[4] flex gap-3 md:gap-4">
          {/* Weather Widget */}
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

      <div className="w-[40%] md:w-[32%] bg-[#0d0d0d] rounded-[2rem] md:rounded-[2.5rem] border border-white/5 overflow-hidden flex flex-col h-full shadow-inner">
        <CalendarWidget />
      </div>

      <div className="absolute bottom-1 md:bottom-2 left-1/2 -translate-x-1/2 w-24 md:w-32 h-1 bg-white/10 rounded-full pointer-events-none" />
    </div>
  );
};

export default App;
