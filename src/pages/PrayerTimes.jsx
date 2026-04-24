import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Clock, MapPin, Search, Crosshair } from 'lucide-react';

const PrayerTimes = () => {
  const [timings, setTimings] = useState(null);
  const [city, setCity] = useState('');
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState('auto'); // 'auto' or 'manual'
  const [searchInput, setSearchInput] = useState('');

  useEffect(() => {
    if (mode === 'auto') {
      executeAutoLocation();
    }
  }, [mode]);

  const executeAutoLocation = () => {
    setLoading(true);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          fetchTimings(position.coords.latitude, position.coords.longitude);
        },
        (error) => {
          // Fallback to Mecca
          fetchTimingsFallback();
        }
      );
    } else {
      fetchTimingsFallback();
    }
  };

  const fetchTimingsFallback = () => {
    setCity("مكة المكرمة (تلقائي)");
    fetch('https://api.aladhan.com/v1/timingsByCity?city=Mecca&country=SA&method=4')
      .then(r => r.json())
      .then(res => {
        setTimings(res.data.timings);
        setLoading(false);
      });
  };

  const fetchTimings = (lat, lng) => {
    setCity("الموقع الحالي (بناء على متصفحك)");
    fetch(`https://api.aladhan.com/v1/timings?latitude=${lat}&longitude=${lng}&method=4`)
      .then(r => r.json())
      .then(res => {
        setTimings(res.data.timings);
        setLoading(false);
      })
      .catch(() => fetchTimingsFallback());
  };

  const handleManualSearch = (e) => {
    e.preventDefault();
    if (!searchInput.trim()) return;
    setLoading(true);
    setCity(searchInput);
    fetch(`https://api.aladhan.com/v1/timingsByAddress?address=${encodeURIComponent(searchInput)}&method=4`)
      .then(r => r.json())
      .then(res => {
        if (res.code === 200) {
          setTimings(res.data.timings);
        }
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  const prayersList = [
    { id: 'Fajr', name: 'الفجر', icon: Clock },
    { id: 'Sunrise', name: 'الشروق', icon: Clock },
    { id: 'Dhuhr', name: 'الظهر', icon: Clock },
    { id: 'Asr', name: 'العصر', icon: Clock },
    { id: 'Maghrib', name: 'المغرب', icon: Clock },
    { id: 'Isha', name: 'العشاء', icon: Clock },
  ];

  return (
    <div className="py-12 min-h-screen">
      <Helmet>
        <title>أصيل | مواقيت الصلاة</title>
      </Helmet>

      <div className="container mx-auto px-4 max-w-4xl text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">مواقيت الصلاة</h1>
        
        <div className="flex flex-col md:flex-row items-center justify-center gap-4 mb-12">
          <button 
            onClick={() => setMode('auto')}
            className={`px-6 py-2 rounded-full font-bold transition-colors flex gap-2 items-center ${mode === 'auto' ? 'bg-primary text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
          >
            <Crosshair className="w-5 h-5"/> تلقائي
          </button>
          
          <button 
            onClick={() => setMode('manual')}
            className={`px-6 py-2 rounded-full font-bold transition-colors flex gap-2 items-center ${mode === 'manual' ? 'bg-primary text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
          >
            <MapPin className="w-5 h-5"/> يدوي
          </button>
        </div>

        {mode === 'manual' && (
          <form onSubmit={handleManualSearch} className="max-w-md mx-auto mb-8 relative">
             <input 
               type="text"
               value={searchInput}
               onChange={(e) => setSearchInput(e.target.value)}
               placeholder="أدخل اسم المدينة (مثال: القاهرة، الرياض..)"
               className="input-field text-lg py-3 pr-12 w-full shadow-sm"
             />
             <button type="submit" className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-400 hover:text-primary">
               <Search className="w-6 h-6" />
             </button>
          </form>
        )}

        <div className="inline-flex items-center justify-center gap-2 bg-emerald-50 text-emerald-700 px-6 py-2 rounded-full mb-12 border border-emerald-100 shadow-sm">
          <MapPin className="w-5 h-5" />
          <span>الموقع الحالي: {city || "لم يتم التحديد"}</span>
        </div>

        {loading ? (
          <div className="text-gray-500 font-bold text-xl py-20 flex flex-col items-center justify-center">
             <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
             جاري تحديد الموقع وجلب المواقيت...
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {prayersList.map((prayer) => {
              const TheIcon = prayer.icon;
              // Simple logic to find next prayer (not fully absolute without Date parsing, just design-wise it's enough)
              return (
                <div key={prayer.id} className="glass-card p-6 flex flex-col items-center justify-center gap-4 hover:shadow-2xl transition-shadow border-t-4 border-t-primary">
                  <TheIcon className="w-10 h-10 text-gold" />
                  <h3 className="text-3xl font-bold text-gray-800">{prayer.name}</h3>
                  <div className="text-4xl text-primary font-sans font-bold tracking-widest mt-2 bg-gray-50 w-full py-4 rounded-xl border border-gray-100">
                    {timings[prayer.id]}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default PrayerTimes;
