
import React, { useState, useEffect } from 'react';

interface MonthData {
  month: number;
  year: number;
  isCurrent: boolean;
}

interface Holiday {
  date: string; // YYYY-MM-DD
  name: string;
}

const CalendarWidget: React.FC = () => {
  const now = new Date();
  const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  
  const currentMonthIdx = now.getMonth();
  const currentYear = now.getFullYear();
  const today = now.getDate();

  const months: MonthData[] = [
    { month: currentMonthIdx, year: currentYear, isCurrent: true },
    { 
      month: (currentMonthIdx + 1) % 12, 
      year: currentMonthIdx === 11 ? currentYear + 1 : currentYear, 
      isCurrent: false 
    }
  ];

  const [holidays, setHolidays] = useState<Holiday[]>([]);

  // Tallyfy API에서 공휴일 가져오기 (API 키 불필요) - 4시간마다 자동 갱신 (날씨와 동일)
  useEffect(() => {
    const fetchHolidays = async () => {
      try {
        // 현재 연도와 다음 연도의 공휴일을 동시에 가져오기
        const [currentYearRes, nextYearRes] = await Promise.all([
          fetch(`https://tallyfy.com/national-holidays/api/KR/${currentYear}.json`),
          fetch(`https://tallyfy.com/national-holidays/api/KR/${currentYear + 1}.json`)
        ]);

        const currentYearData = currentYearRes.ok ? await currentYearRes.json() : null;
        const nextYearData = nextYearRes.ok ? await nextYearRes.json() : null;

        const fetchedHolidays: Holiday[] = [];

        // Tallyfy API 응답 형식: { holidays: [...], year: ..., country: {...} }
        if (currentYearData?.holidays && Array.isArray(currentYearData.holidays)) {
          fetchedHolidays.push(...currentYearData.holidays.map((h: any) => ({
            date: h.date,
            name: h.local_name || h.name || ''
          })));
        }

        if (nextYearData?.holidays && Array.isArray(nextYearData.holidays)) {
          fetchedHolidays.push(...nextYearData.holidays.map((h: any) => ({
            date: h.date,
            name: h.local_name || h.name || ''
          })));
        }

        if (fetchedHolidays.length > 0) {
          setHolidays(fetchedHolidays);
        }
      } catch (error) {
        console.error('Failed to fetch holidays from API:', error);
      }
    };

    // 초기 로드 시 즉시 실행
    fetchHolidays();

    // 12시간마다 자동 갱신 (14,400,000 ms)
    const interval = setInterval(() => {
      fetchHolidays();
    }, 12 * 60 * 60 * 1000); // 12 hours in milliseconds

    return () => clearInterval(interval);
  }, [currentYear]);

  const getDaysInMonth = (month: number, year: number) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (month: number, year: number) => new Date(year, month, 1).getDay();

  const renderMonth = ({ month, year, isCurrent }: MonthData) => {
    const daysInMonth = getDaysInMonth(month, year);
    const firstDayIdx = getFirstDayOfMonth(month, year);
    const daysInPrevMonth = getDaysInMonth(month - 1, year);
    
    const prevMonthFiller = Array.from({ length: firstDayIdx }, (_, i) => ({
      day: daysInPrevMonth - firstDayIdx + i + 1,
      type: 'prev',
      fullDate: `${month === 0 ? year - 1 : year}-${(month === 0 ? 12 : month).toString().padStart(2, '0')}-${(daysInPrevMonth - firstDayIdx + i + 1).toString().padStart(2, '0')}`
    }));

    const currentDays = Array.from({ length: daysInMonth }, (_, i) => ({
      day: i + 1,
      type: 'current',
      fullDate: `${year}-${(month + 1).toString().padStart(2, '0')}-${(i + 1).toString().padStart(2, '0')}`
    }));

    const allDays = [...prevMonthFiller, ...currentDays];

    return (
      <div key={`${year}-${month}`} className={`mb-1 transition-opacity duration-500 ${isCurrent ? 'opacity-100' : 'opacity-20'}`}>
        <div className="flex justify-between items-center mb-1 px-1">
          <h2 className="text-sm md:text-base font-semibold text-gray-100">{monthNames[month]} {year}</h2>
          {isCurrent && <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></div>}
        </div>

        <div className="grid grid-cols-7 gap-y-0.5 text-center">
          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
            <span key={d + i} className={`text-[9px] font-bold mb-0.5 ${i === 0 ? 'text-red-500/80' : i === 6 ? 'text-blue-400/80' : 'text-gray-600'}`}>
              {d}
            </span>
          ))}
          
          {allDays.map((dateObj, index) => {
            const isToday = isCurrent && dateObj.type === 'current' && dateObj.day === today;
            const dayOfWeek = index % 7;
            const isHoliday = holidays.some(h => h.date === dateObj.fullDate);
            
            // Color logic: Sunday (0) or Holiday = Red, Saturday (6) = Blue
            let textColorClass = 'text-gray-200';
            if (dateObj.type !== 'current') {
              textColorClass = 'text-gray-800';
            } else if (dayOfWeek === 0 || isHoliday) {
              textColorClass = 'text-red-500';
            } else if (dayOfWeek === 6) {
              textColorClass = 'text-blue-400';
            }

            return (
              <div key={index} className="flex items-center justify-center py-0.5">
                <span className={`
                  text-[12px] md:text-[13px] w-6 h-6 md:w-7 md:h-7 flex items-center justify-center rounded-full transition-all
                  ${isToday ? 'bg-white text-gray-800 font-bold shadow-lg shadow-white/10' : textColorClass}
                `}>
                  {dateObj.day}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col bg-[#0d0d0d] overflow-hidden">
      <div className="flex-1 px-4 md:px-5 pt-5 md:pt-6 pb-2 overflow-hidden">
        {months.map(renderMonth)}
      </div>
    </div>
  );
};

export default CalendarWidget;
