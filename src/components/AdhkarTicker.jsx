import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

const AdhkarTicker = () => {
  // الترتيب الصحيح للأذكار كما طلب المستخدم:
  // 1: سبحان الله، 2: الحمد لله، 3: لا إله إلا الله، 4: الله أكبر، 5: لا حول ولا قوة إلا بالله
  const adhkar = [
    "سبحان الله",
    "الحمد لله",
    "لا إله إلا الله",
    "الله أكبر",
    "لا حول ولا قوة إلا بالله"
  ];

  const AdhkarSet = () => (
    <div className="flex items-center h-full flex-row-reverse" dir="ltr">
      {adhkar.map((dhikr, index) => (
        <div key={index} className="flex items-center gap-10 md:gap-24 px-10 md:px-24 h-full">
          <span className="text-emerald-800 font-arabic text-xl md:text-2xl font-bold whitespace-nowrap">
            {dhikr}
          </span>
          <Sparkles className="w-5 h-5 md:w-6 md:h-6 text-emerald-500 shrink-0" />
        </div>
      ))}
    </div>
  );

  return (
    <div className="relative w-full bg-emerald-50 border-y border-emerald-100 overflow-hidden h-14 md:h-20 select-none z-40 shadow-sm flex items-center">
      {/* Ticker Content Container */}
      <div className="flex w-full h-full" dir="ltr">
        <motion.div
          className="flex whitespace-nowrap items-center h-full pr-[140px] md:pr-[250px]"
          style={{ willChange: 'transform' }}
          initial={{ x: "-50%" }}
          animate={{ x: ["-50%", "0%"] }} // الحركة من اليسار إلى اليمين
          transition={{
            repeat: Infinity,
            ease: "linear",
            duration: 40, // تسريع الشريط قليلاً كما طلب المستخدم
          }}
        >
          <AdhkarSet />
          <AdhkarSet />
        </motion.div>
      </div>

      {/* Decorative Title - Ultra Stabilized with Hardware Acceleration */}
      <div 
        className="absolute right-0 top-0 h-full px-6 md:px-12 bg-emerald-600 flex items-center z-50 border-l-2 border-emerald-700 pointer-events-none"
        style={{ 
          transform: 'translate3d(0, 0, 0)',
          WebkitTransform: 'translate3d(0, 0, 0)',
          backfaceVisibility: 'hidden',
          WebkitBackfaceVisibility: 'hidden',
          perspective: 1000,
          WebkitPerspective: 1000
        }} 
      >
        <span className="text-white font-arabic font-bold text-base md:text-xl whitespace-nowrap">
          الباقيات الصالحات
        </span>
      </div>
      
      {/* Fading gradient */}
      <div className="absolute left-0 top-0 bottom-0 w-24 md:w-64 bg-gradient-to-r from-emerald-50 via-emerald-50/80 to-transparent z-10 pointer-events-none"></div>
    </div>
  );
};

export default AdhkarTicker;
