import React, { useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { Calendar as CalendarIcon, Info, MapPin, Crosshair, Search, ChevronRight, ChevronLeft, AlertCircle } from 'lucide-react';

const HijriCalendar = () => {
  const [currentDate] = useState(new Date());
  const [monthData, setMonthData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [city, setCity] = useState('مكة المكرمة');
  const [mode, setMode] = useState('auto'); // 'auto' or 'manual'
  const [searchInput, setSearchInput] = useState('');
  const [errorMsg, setErrorMsg] = useState(null);

  // Current active location for fetching
  const [activeLocation, setActiveLocation] = useState({ type: 'address', value: 'Makkah' });

  // Target Hijri month/year state
  const [targetHMonth, setTargetHMonth] = useState(1);
  const [targetHYear, setTargetHYear] = useState(1445);
  const [hijriMonthName, setHijriMonthName] = useState('');
  const [adjustment, setAdjustment] = useState(parseInt(localStorage.getItem('hijriAdjustment') || '0'));

  // Initial Hijri Date setup from Browser
  useEffect(() => {
    try {
      const today = new Date();
      const parts = new Intl.DateTimeFormat('en-TN-u-ca-islamic', { 
        day: 'numeric', 
        month: 'numeric', 
        year: 'numeric' 
      }).formatToParts(today);
      
      const mPart = parts.find(p => p.type === 'month');
      const yPart = parts.find(p => p.type === 'year');
      
      if (mPart && yPart) {
        setTargetHMonth(parseInt(mPart.value));
        const yearVal = parseInt(yPart.value.split(' ')[0]);
        setTargetHYear(yearVal);
      }
    } catch (e) {
      setTargetHMonth(10);
      setTargetHYear(1445);
    }
  }, []);

  const fetchWithTimeout = async (url, timeout = 8000) => {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);
    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(id);
    return response;
  };

  const fetchCalendar = useCallback(async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      let url = '';
      if (activeLocation.type === 'coords') {
        url = `https://api.aladhan.com/v1/hijriCalendar?latitude=${activeLocation.lat}&longitude=${activeLocation.lng}&method=4&month=${targetHMonth}&year=${targetHYear}&adjustment=${adjustment}`;
      } else {
        url = `https://api.aladhan.com/v1/hijriCalendarByAddress?address=${encodeURIComponent(activeLocation.value)}&method=4&month=${targetHMonth}&year=${targetHYear}&adjustment=${adjustment}`;
      }

      const response = await fetchWithTimeout(url);
      const res = await response.json();

      if (res.code === 200 && Array.isArray(res.data)) {
        setMonthData(res.data);
        if (res.data.length > 0) {
          setHijriMonthName(res.data[0].date.hijri.month.ar);
          if (activeLocation.type === 'coords') setCity("الموقع الحالي (تلقائي)");
          else setCity(activeLocation.value === 'Makkah' ? "مكة المكرمة" : activeLocation.value);
        }
      } else {
        throw new Error("Invalid API response");
      }
    } catch (err) {
      if (activeLocation.type === 'coords' || activeLocation.value !== 'Makkah') {
        // Fallback to Makkah if anything fails
        setActiveLocation({ type: 'address', value: 'Makkah' });
      } else {
        setErrorMsg("حدث خطأ في عرض التقويم. تأكد من اتصال هاتفك بالإنترنت.");
      }
    } finally {
      setLoading(false);
    }
  }, [activeLocation, targetHMonth, targetHYear, adjustment]);

  useEffect(() => {
    fetchCalendar();
  }, [fetchCalendar]);

  useEffect(() => {
    localStorage.setItem('hijriAdjustment', adjustment.toString());
  }, [adjustment]);

  const handleAutoLocation = () => {
    setMode('auto');
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setActiveLocation({ type: 'coords', lat: position.coords.latitude, lng: position.coords.longitude });
        },
        () => {
          setActiveLocation({ type: 'address', value: 'Makkah' });
        }
      );
    } else {
      setActiveLocation({ type: 'address', value: 'Makkah' });
    }
  };

  const handleManualSearch = (e) => {
    e.preventDefault();
    if (!searchInput.trim()) return;
    setMode('manual');
    setActiveLocation({ type: 'address', value: searchInput });
  };

  const nextMonth = () => {
    if (loading) return;
    if (targetHMonth === 12) {
      setTargetHMonth(1);
      setTargetHYear(prev => prev + 1);
    } else {
      setTargetHMonth(prev => prev + 1);
    }
  };

  const prevMonth = () => {
    if (loading) return;
    if (targetHMonth === 1) {
      setTargetHMonth(12);
      setTargetHYear(prev => prev - 1);
    } else {
      setTargetHMonth(prev => prev - 1);
    }
  };

  const weekdaysMap = {
    "Al Ahad": 0, "Sunday": 0,
    "Al Athnayn": 1, "Monday": 1,
    "Al Thalaata": 2, "Tuesday": 2,
    "Al Arba'a": 3, "Wednesday": 3,
    "Al Khamees": 4, "Thursday": 4,
    "Al Juma'a": 5, "Friday": 5,
    "Al Sabt": 6, "Saturday": 6
  };

  const arWeekdays = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];

  let emptyOffset = 0;
  if (Array.isArray(monthData) && monthData.length > 0) {
    const firstDayEn = monthData[0].date.hijri.weekday.en;
    emptyOffset = weekdaysMap[firstDayEn] || 0;
  }

  const todayStr = `${currentDate.getDate()}-${currentDate.getMonth() + 1}-${currentDate.getFullYear()}`;

  return (
    <div className="py-12 min-h-screen">
      <Helmet>
        <title>أصيل | التقويم الهجري الشهري</title>
      </Helmet>

      <div className="container mx-auto px-4 max-w-5xl text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-6 flex items-center justify-center gap-4">
          <CalendarIcon className="w-10 h-10 text-primary" />
          التقويم الهجري
        </h1>
        
        <div className="flex flex-col md:flex-row items-center justify-center gap-4 mb-8">
          <button 
            onClick={handleAutoLocation}
            className={`px-6 py-2 rounded-full font-bold transition-colors flex gap-2 items-center ${mode === 'auto' ? 'bg-primary text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
          >
            <Crosshair className="w-5 h-5"/> الموقع التلقائي
          </button>
          
          <button 
            onClick={() => setMode('manual')}
            className={`px-6 py-2 rounded-full font-bold transition-colors flex gap-2 items-center ${mode === 'manual' ? 'bg-primary text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
          >
            <MapPin className="w-5 h-5"/> بحث يدوي للدول
          </button>
        </div>

        {mode === 'manual' && (
          <form onSubmit={handleManualSearch} className="max-w-md mx-auto mb-8 relative">
             <input 
               type="text"
               value={searchInput}
               onChange={(e) => setSearchInput(e.target.value)}
               placeholder="أدخل اسم المدينة أو الدولة (مثال: الرباط، المغرب)"
               className="input-field text-lg py-3 pr-12 w-full shadow-sm"
             />
             <button type="submit" className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-400 hover:text-primary">
               <Search className="w-6 h-6" />
             </button>
          </form>
        )}

        <div className="inline-flex items-center justify-center gap-2 bg-emerald-50 text-emerald-700 px-6 py-2 rounded-full mb-4 border border-emerald-100 shadow-sm transition-all duration-500">
          <MapPin className="w-5 h-5" />
          <span>الموقع المعتمد للتقويم: {city}</span>
        </div>

        {/* Adjustment Control */}
        <div className="flex items-center justify-center gap-4 mb-8">
           <span className="text-sm font-bold text-gray-500">تعديل التقويم:</span>
           <div className="flex bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
              <button 
                onClick={() => setAdjustment(prev => prev - 1)}
                className="px-4 py-1 hover:bg-gray-50 text-primary font-bold border-l border-gray-100 active:scale-95 transition-transform"
              >
                -1
              </button>
              <div className="px-4 py-1 bg-primary/5 text-primary font-bold min-w-[50px]">
                {adjustment > 0 ? `+${adjustment}` : adjustment}
              </div>
              <button 
                onClick={() => setAdjustment(prev => prev + 1)}
                className="px-4 py-1 hover:bg-gray-50 text-primary font-bold border-r border-gray-100 active:scale-95 transition-transform"
              >
                +1
              </button>
           </div>
           <button 
             onClick={() => setAdjustment(0)} 
             className="text-xs text-gray-400 hover:text-red-500 underline"
           >
             إعادة ضبط
           </button>
        </div>

        <div className="glass-card shadow-2xl relative overflow-hidden bg-white min-h-[400px]">
          
          <div className="bg-primary/5 p-6 flex justify-between items-center border-b border-primary/10">
             <button onClick={prevMonth} className="p-2 rounded-full hover:bg-primary/10 text-primary transition-colors">
                 <ChevronRight className="w-6 h-6" />
             </button>
             
             <div className={`text-3xl font-bold font-arabic text-primary-dark transition-opacity duration-300 ${loading ? 'opacity-50' : 'opacity-100'}`}>
                {(() => {
                  // If we have data and adjustment, and we can find "Today" or middle of month
                  // to determine the 'main' month name after adjustment.
                  if (!loading && monthData.length > 15) {
                    const midDay = monthData[15].date.hijri;
                    const adjMid = parseInt(midDay.day) + adjustment;
                    if (adjMid <= 0) return "..."; // Should use prev month name but complex
                    return midDay.month.ar;
                  }
                  return hijriMonthName || '...';
                })()} <span className="text-2xl text-gray-600 ml-2">{targetHYear} هـ</span>
             </div>

             <button onClick={nextMonth} className="p-2 rounded-full hover:bg-primary/10 text-primary transition-colors">
                 <ChevronLeft className="w-6 h-6" />
             </button>
          </div>

          <div className="p-6">
            {errorMsg ? (
              <div className="flex flex-col items-center justify-center py-20 text-red-500 gap-4">
                <AlertCircle className="w-16 h-16 opacity-30" />
                <p className="text-xl font-bold">{errorMsg}</p>
                <button onClick={() => fetchCalendar()} className="btn-primary px-8">إعادة المحاولة</button>
              </div>
            ) : loading ? (
              <div className="text-primary font-bold text-xl py-32 flex flex-col items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
                جاري تحديث التقويم...
              </div>
            ) : (
              <>
                <div className="grid grid-cols-7 gap-1 md:gap-2 mb-4">
                  {arWeekdays.map((day, idx) => (
                    <div key={idx} className="font-bold text-gray-500 py-2 text-center text-[10px] sm:text-xs md:text-base bg-gray-50 rounded-lg overflow-hidden text-ellipsis whitespace-nowrap px-0.5">
                      {day}
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-7 gap-2">
                  {Array.from({ length: emptyOffset }).map((_, idx) => (
                    <div key={`empty-${idx}`} className="p-2 md:p-4 rounded-xl"></div>
                   ))}

                  {Array.isArray(monthData) && monthData.map((dayData, idx) => {
                    const hijriObj = dayData.date.hijri;
                    const gregObj = dayData.date.gregorian;
                    
                    // Apply Manual Adjustment
                    let displayDay = parseInt(hijriObj.day) + adjustment;
                    let isCurrentMonth = true;
                    
                    if (displayDay <= 0) {
                      // Show as previous month (simple proxy: just show 29 or 30)
                      displayDay = 30 + displayDay; // Close enough for display
                      isCurrentMonth = false;
                    } else if (displayDay > hijriObj.month.days) {
                      displayDay = displayDay - hijriObj.month.days;
                      isCurrentMonth = false;
                    }

                    const dStr = `${parseInt(gregObj.day)}-${gregObj.month.number}-${gregObj.year}`;
                    const isToday = dStr === todayStr;

                    return (
                      <div 
                        key={idx} 
                        className={`relative border p-2 md:p-4 rounded-xl flex flex-col items-center justify-center min-h-[80px] md:min-h-[100px] transition-all hover:border-primary/50 group ${isToday ? 'bg-primary text-white shadow-lg border-primary border-2 transform scale-105 z-10' : 'bg-white border-gray-100 hover:shadow-md'} ${!isCurrentMonth ? 'opacity-40 grayscale' : ''}`}
                      >
                        <span className={`text-2xl md:text-3xl font-bold font-arabic ${isToday ? 'text-white' : isCurrentMonth ? 'text-gray-800 group-hover:text-primary' : 'text-gray-400'} mb-1`}>
                          {displayDay}
                        </span>
                        <div className="flex flex-col items-center">
                          <span className={`${isToday ? 'text-white/80' : 'text-gray-400'} text-xs font-sans`}>
                             {gregObj.day} {gregObj.month.en.substring(0, 3)}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>

          {!loading && !errorMsg && (
             <div className="bg-amber-50 border-t border-amber-100 text-amber-800 p-4 flex items-start gap-3 text-right">
                <Info className="w-6 h-6 flex-shrink-0 text-amber-600"/>
                <div className="text-sm md:text-base leading-relaxed">
                  <span className="font-bold">ملاحظة:</span> هذا التقويم يعتمد على موقعك الجغرافي. قد تختلف الرؤية الشرعية للهلال عن الحساب الفلكي.
                </div>
             </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HijriCalendar;
