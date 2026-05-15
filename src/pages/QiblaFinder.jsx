import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Compass, MapPin, AlertTriangle, RefreshCcw, Navigation } from 'lucide-react';

const QiblaFinder = () => {
  const [coords, setCoords] = useState(null);
  const [qibla, setQibla] = useState(null);
  const [heading, setHeading] = useState(0);
  const [error, setError] = useState(null);
  const [isCompassActive, setIsCompassActive] = useState(false);

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
      }
    );
  };

  const startOrientationListener = () => {
    const handleOrientation = (event) => {
      let compassHeading = 0;
      
      if (event.webkitCompassHeading !== undefined) {
        // iOS
        compassHeading = event.webkitCompassHeading;
      } else if (event.alpha !== null) {
        // Android / Other
        // If the event is absolute, alpha is relative to North
        // If not, we still try to use it
        compassHeading = 360 - event.alpha;
      }

      setHeading(compassHeading);
      setIsCompassActive(true);
    };

    if (window.DeviceOrientationEvent) {
      if ('ondeviceorientationabsolute' in window) {
        window.addEventListener('deviceorientationabsolute', handleOrientation, true);
      } else {
        window.addEventListener('deviceorientation', handleOrientation, true);
      }
      return true;
    }
    return false;
  };

  const initCompass = async () => {
    if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
      // iOS 13+ requires permission
      try {
        const permissionState = await DeviceOrientationEvent.requestPermission();
        if (permissionState === 'granted') {
          startOrientationListener();
        } else {
          setError('يجب الموافقة على صلاحية الوصول للحساسات لتشغيل البوصلة.');
        }
      } catch (err) {
        setError('حدث خطأ أثناء طلب صلاحية البوصلة.');
      }
    } else {
      // Non-iOS or older iOS
      if (!startOrientationListener()) {
        setError('جهازك لا يدعم حساس البوصلة.');
      }
    }
  };

  useEffect(() => {
    getLocation();
  }, []);

  const relativeQibla = qibla !== null ? (qibla - heading + 360) % 360 : 0;

  return (
    <div className="min-h-screen py-12 px-4">
      <Helmet>
        <title>أصيل | بوصلة القبلة</title>
        <meta name="description" content="حدد اتجاه القبلة بدقة من أي مكان في العالم باستخدام بوصلة أصيل المتطورة." />
      </Helmet>

      <div className="container mx-auto max-w-lg">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card p-10 text-center"
        >
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
              {error && (
                <div className="mt-6 flex items-center justify-center gap-2 text-red-500 bg-red-50 p-4 rounded-xl font-arabic text-sm">
                  <AlertTriangle className="w-4 h-4" />
                  <span>{error}</span>
                </div>
              )}
            </div>
          ) : (
            <div className="py-8">
              <div className="relative w-64 h-64 mx-auto mb-12">
                {/* Compass Background */}
                <div className="absolute inset-0 rounded-full border-4 border-gray-100 shadow-inner"></div>
                <div className="absolute inset-4 rounded-full border border-gray-50 bg-gray-50/30"></div>
                
                {/* Degree Markers */}
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

                {/* Qibla Indicator */}
                <motion.div
                  animate={{ rotate: relativeQibla }}
                  transition={{ type: 'spring', stiffness: 50 }}
                  className="absolute inset-0 flex items-center justify-center z-10"
                >
                  <div className="relative w-full h-full">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-8 bg-gold rounded-full shadow-lg flex items-center justify-center pointer-events-none">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                    <div className="absolute top-4 left-1/2 -translate-x-1/2 w-1 h-28 bg-gradient-to-b from-gold to-transparent rounded-full"></div>
                  </div>
                </motion.div>

                {/* Compass Icon */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <Compass className={`w-16 h-16 transition-colors duration-500 ${isCompassActive ? 'text-primary/20' : 'text-gray-200'}`} />
                </div>

                {/* Overlay for inactive compass */}
                {!isCompassActive && (
                  <div className="absolute inset-0 z-20 flex items-center justify-center bg-white/10 backdrop-blur-[2px] rounded-full">
                    <button 
                      onClick={initCompass}
                      className="bg-white shadow-xl px-6 py-3 rounded-full flex items-center gap-2 text-primary font-bold hover:scale-105 transition-transform"
                    >
                      <Navigation className="w-5 h-5 fill-current" />
                      <span className="font-arabic">تشغيل البوصلة</span>
                    </button>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <div className="bg-gray-50 rounded-2xl p-6">
                  <div className="text-sm text-gray-400 mb-1 font-arabic">الانحراف عن الشمال الحقيقي</div>
                  <div className="text-3xl font-bold text-gray-800 font-sans">{Math.round(qibla)}°</div>
                </div>
                
                <p className="text-sm text-gray-500 font-arabic leading-relaxed px-4">
                  {isCompassActive 
                    ? "يرجى حمل الهاتف بشكل مسطح وبعيداً عن الأجهزة المعدنية لضمان دقة البوصلة."
                    : "اضغط على زر تشغيل البوصلة أعلاه لتفعيل حساسات الحركة في هاتفك."}
                </p>

                <div className="flex flex-col gap-2 pt-4">
                  {error && (
                    <div className="flex items-center justify-center gap-2 text-red-500 bg-red-50 p-3 rounded-xl font-arabic text-xs mb-2">
                      <AlertTriangle className="w-4 h-4" />
                      <span>{error}</span>
                    </div>
                  )}
                  
                  <button 
                    onClick={() => { setCoords(null); setIsCompassActive(false); getLocation(); }}
                    className="flex items-center justify-center gap-2 text-primary font-bold mx-auto hover:scale-105 transition-transform"
                  >
                    <RefreshCcw className="w-4 h-4" />
                    <span className="font-arabic">تحديث الموقع</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </motion.div>

        {/* Info Card */}
        <div className="mt-8 bg-blue-50 border border-blue-100 rounded-2xl p-6 flex gap-4 text-right">
          <div className="flex-grow">
            <h4 className="font-bold text-blue-900 mb-1 font-arabic">ملاحظة تقنية</h4>
            <p className="text-sm text-blue-800/80 font-arabic leading-relaxed">
              تعتمد دقة البوصلة على حساسات هاتفك. في حالة عدم وجود حساس بوصلة، يمكنك الاعتماد على الزاوية المذكورة أعلاه (حوالي {Math.round(qibla)} درجة من الشمال).
            </p>
          </div>
          <div className="p-2 h-fit bg-blue-100 rounded-lg text-blue-600">
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default QiblaFinder;
