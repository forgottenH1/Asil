import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Compass, MapPin, AlertTriangle, RefreshCcw, Navigation, Info } from 'lucide-react';

const QiblaFinder = () => {
  const [coords, setCoords] = useState(null);
  const [qibla, setQibla] = useState(null);
  const [heading, setHeading] = useState(0);
  const [error, setError] = useState(null);
  const [isCompassActive, setIsCompassActive] = useState(false);
  const [debugInfo, setDebugInfo] = useState('');
  
  const isHttps = window.location.protocol === 'https:';
  const kaaba = { lat: 21.4225, lng: 39.8262 };

  const calculateQibla = (lat, lng) => {
    const φ1 = lat * (Math.PI / 180);
    const λ1 = lng * (Math.PI / 180);
    const φ2 = kaaba.lat * (Math.PI / 180);
    const λ2 = kaaba.lng * (Math.PI / 180);

    const Δλ = λ2 - λ1;
    const y = Math.sin(Δλ);
    const x = Math.cos(φ1) * Math.tan(φ2) - Math.sin(φ1) * Math.cos(Δλ);
    let q = Math.atan2(y, x) * (180 / Math.PI);
    return (q + 360) % 360;
  };

  const getLocation = () => {
    if (!navigator.geolocation) {
      setError('المتصفح لا يدعم تحديد الموقع الجغرافي.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setCoords({ latitude, longitude });
        setQibla(calculateQibla(latitude, longitude));
      },
      (err) => {
        setError('تعذر الحصول على الموقع. يرجى تفعيل تحديد الموقع في المتصفح.');
      },
      { enableHighAccuracy: true }
    );
  };

  const handleOrientation = (event) => {
    let compassHeading = null;
    
    // 1. iOS Check (webkitCompassHeading)
    if (event.webkitCompassHeading !== undefined) {
      compassHeading = event.webkitCompassHeading;
      setDebugInfo('iOS: ' + Math.round(compassHeading));
    } 
    // 2. Android/Chrome Absolute Check
    else if (event.absolute === true && event.alpha !== null) {
      compassHeading = event.alpha;
      setDebugInfo('Abs: ' + Math.round(compassHeading));
    }
    // 3. Fallback to Alpha (Relative North)
    else if (event.alpha !== null) {
      compassHeading = 360 - event.alpha;
      setDebugInfo('Rel: ' + Math.round(compassHeading));
    }

    if (compassHeading !== null) {
      setHeading(compassHeading);
      setIsCompassActive(true);
    }
  };

  const initCompass = async () => {
    if (!isHttps && window.location.hostname !== 'localhost') {
      setError('البوصلة تتطلب اتصالاً آمناً (HTTPS) للعمل على الهواتف.');
      return;
    }

    // iOS 13+ Permission
    if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
      try {
        const permissionState = await DeviceOrientationEvent.requestPermission();
        if (permissionState === 'granted') {
          window.addEventListener('deviceorientation', handleOrientation, true);
        } else {
          setError('يجب الموافقة على صلاحية الوصول للحساسات.');
        }
      } catch (err) {
        setError('خطأ في طلب الصلاحية: ' + err.message);
      }
    } else {
      // Android / Other
      if (window.DeviceOrientationEvent) {
        window.addEventListener('deviceorientationabsolute', handleOrientation, true);
        window.addEventListener('deviceorientation', handleOrientation, true);
        // We set active to true to hide the button, but we'll see if data actually comes in
        setIsCompassActive(true);
        setTimeout(() => {
          if (heading === 0 && !debugInfo) {
            setError('لم يتم استقبال بيانات من الحساسات. تأكد من دعم جهازك للبوصلة.');
            setIsCompassActive(false);
          }
        }, 3000);
      } else {
        setError('جهازك لا يدعم حساس البوصلة.');
      }
    }
  };

  useEffect(() => {
    getLocation();
    return () => {
      window.removeEventListener('deviceorientation', handleOrientation);
      window.removeEventListener('deviceorientationabsolute', handleOrientation);
    };
  }, []);

  const relativeQibla = qibla !== null ? (qibla - heading + 360) % 360 : 0;

  return (
    <div className="min-h-screen py-12 px-4">
      <Helmet>
        <title>أصيل | بوصلة القبلة</title>
      </Helmet>

      <div className="container mx-auto max-w-lg">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card p-10 text-center relative overflow-hidden"
        >
          {/* HTTPS Warning */}
          {!isHttps && window.location.hostname !== 'localhost' && (
            <div className="absolute top-0 left-0 right-0 bg-amber-500 text-white text-[10px] py-1 font-arabic">
              يجب استخدام HTTPS لتفعيل البوصلة
            </div>
          )}

          <h1 className="text-3xl font-bold text-gray-900 mb-8 font-arabic">اتجاه القبلة</h1>

          {!coords ? (
            <div className="py-12">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <MapPin className="w-10 h-10 text-primary animate-bounce" />
              </div>
              <p className="text-gray-600 mb-8 font-arabic">نحتاج للوصول إلى موقعك لتحديد اتجاه القبلة بدقة.</p>
              <button onClick={getLocation} className="btn-primary px-8 py-3 rounded-xl font-arabic">
                تفعيل الموقع
              </button>
            </div>
          ) : (
            <div className="py-8">
              <div className="relative w-64 h-64 mx-auto mb-12">
                <div className="absolute inset-0 rounded-full border-4 border-gray-100 shadow-inner"></div>
                <div className="absolute inset-4 rounded-full border border-gray-50 bg-gray-50/30"></div>
                
                {[0, 90, 180, 270].map((deg) => (
                  <div 
                    key={deg} 
                    className="absolute font-sans text-[10px] font-bold text-gray-300"
                    style={{
                      top: deg === 0 ? '5%' : deg === 180 ? '90%' : '48%',
                      left: deg === 270 ? '5%' : deg === 90 ? '90%' : '46%',
                    }}
                  >
                    {deg === 0 ? 'N' : deg === 90 ? 'E' : deg === 180 ? 'S' : 'W'}
                  </div>
                ))}

                <motion.div
                  animate={{ rotate: relativeQibla }}
                  transition={{ type: 'spring', stiffness: 50, damping: 15 }}
                  className="absolute inset-0 flex items-center justify-center z-10"
                >
                  <div className="relative w-full h-full">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-8 bg-gold rounded-full shadow-lg flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                    <div className="absolute top-4 left-1/2 -translate-x-1/2 w-1.5 h-28 bg-gradient-to-b from-gold to-transparent rounded-full shadow-sm"></div>
                  </div>
                </motion.div>

                <div className="absolute inset-0 flex items-center justify-center">
                  <Compass className={`w-16 h-16 transition-colors duration-500 ${isCompassActive ? 'text-primary/10' : 'text-gray-200'}`} />
                </div>

                {!isCompassActive && (
                  <div className="absolute inset-0 z-20 flex items-center justify-center bg-white/5 backdrop-blur-[2px] rounded-full">
                    <button 
                      onClick={initCompass}
                      className="bg-white shadow-2xl px-6 py-3 rounded-full flex items-center gap-2 text-primary font-bold hover:scale-105 transition-transform border border-primary/10"
                    >
                      <Navigation className="w-5 h-5 fill-current" />
                      <span className="font-arabic">تشغيل البوصلة</span>
                    </button>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded-2xl p-4">
                    <div className="text-[10px] text-gray-400 mb-1 font-arabic">زاوية القبلة</div>
                    <div className="text-xl font-bold text-gray-800 font-sans">{Math.round(qibla)}°</div>
                  </div>
                  <div className="bg-gray-50 rounded-2xl p-4 border border-primary/5">
                    <div className="text-[10px] text-gray-400 mb-1 font-arabic">اتجاه الهاتف</div>
                    <div className="text-xl font-bold text-primary font-sans">{Math.round(heading)}°</div>
                  </div>
                </div>
                
                {debugInfo && (
                  <div className="text-[10px] text-gray-300 font-sans uppercase tracking-widest">
                    Sensor: {debugInfo}
                  </div>
                )}

                <p className="text-xs text-gray-500 font-arabic leading-relaxed px-4">
                  {isCompassActive 
                    ? "الآن قم بتدوير الهاتف حتى يشير السهم الذهبي للأعلى مباشرة."
                    : "اضغط على الزر لتفعيل الحساسات."}
                </p>

                <div className="flex flex-col gap-2 pt-2">
                  {error && (
                    <div className="flex items-center justify-center gap-2 text-red-500 bg-red-50 p-3 rounded-xl font-arabic text-xs">
                      <AlertTriangle className="w-4 h-4 shrink-0" />
                      <span>{error}</span>
                    </div>
                  )}
                  
                  <button 
                    onClick={() => { setCoords(null); setIsCompassActive(false); getLocation(); }}
                    className="flex items-center justify-center gap-2 text-gray-400 font-medium mx-auto text-sm hover:text-primary transition-colors"
                  >
                    <RefreshCcw className="w-3 h-3" />
                    <span className="font-arabic">تحديث الموقع</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </motion.div>

        <div className="mt-6 bg-blue-50/50 border border-blue-100/50 rounded-2xl p-5 flex gap-4 text-right">
          <div className="flex-grow text-xs leading-relaxed">
            <h4 className="font-bold text-blue-900 mb-1 font-arabic flex items-center justify-end gap-1">
              كيفية الاستخدام
              <Info className="w-3 h-3" />
            </h4>
            <p className="text-blue-800/70 font-arabic">
              1. ضع الهاتف بشكل أفقي تماماً.<br/>
              2. ابتعد عن المعادن والمغناطيس.<br/>
              3. اتبع السهم الذهبي للوصول لاتجاه الكعبة.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QiblaFinder;
