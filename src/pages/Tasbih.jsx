import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { RefreshCw, Plus, Minus, Settings2 } from 'lucide-react';

const Tasbih = () => {
  const [count, setCount] = useState(0);
  const [target, setTarget] = useState(33);
  const [label, setLabel] = useState('سبحان الله');
  const [showSettings, setShowSettings] = useState(false);

  const increment = () => {
    setCount(prev => prev + 1);
    if (window.navigator.vibrate) {
      window.navigator.vibrate(50);
    }
  };

  const reset = () => {
    setCount(0);
  };

  const handleLabelChange = (newLabel, newTarget) => {
    setLabel(newLabel);
    setTarget(newTarget);
    setCount(0);
    setShowSettings(false);
  };

  const options = [
    { name: 'سبحان الله', target: 33 },
    { name: 'الحمد لله', target: 33 },
    { name: 'الله أكبر', target: 33 },
    { name: 'لا إله إلا الله', target: 100 },
    { name: 'أستغفر الله', target: 100 },
  ];

  const progress = Math.min((count / target) * 100, 100);

  return (
    <div className="min-h-screen py-12 px-4">
      <Helmet>
        <title>أصيل | المسبحة الإلكترونية</title>
        <meta name="description" content="مسبحة إلكترونية متطورة تساعدك على التسبيح والذكر مع خاصية الاهتزاز وتغيير الأذكار." />
      </Helmet>

      <div className="container mx-auto max-w-lg mt-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-10 text-center relative overflow-hidden"
        >
          {/* Progress Bar */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gray-100">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              className="h-full bg-primary"
            />
          </div>

          <div className="flex justify-between items-center mb-8">
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-500"
            >
              <Settings2 className="w-6 h-6" />
            </button>
            <h2 className="text-2xl font-bold text-gray-800 font-arabic">{label}</h2>
            <button
              onClick={reset}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-500"
            >
              <RefreshCw className="w-6 h-6" />
            </button>
          </div>

          {/* Counter Display */}
          <div className="relative py-12">
            <motion.div
              key={count}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-8xl font-bold text-primary font-sans tabular-nums"
            >
              {count}
            </motion.div>
            <div className="text-gray-400 mt-4 font-sans uppercase tracking-widest">
              Goal: {target}
            </div>
          </div>

          {/* Main Tap Button */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={increment}
            className="w-48 h-48 rounded-full bg-gradient-to-br from-primary to-primary-dark shadow-xl hover:shadow-2xl transition-shadow flex items-center justify-center mx-auto mb-8 border-8 border-white/20"
          >
            <Plus className="w-16 h-16 text-white" />
          </motion.button>

          {/* Settings Modal/Overlay */}
          <AnimatePresence>
            {showSettings && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="absolute inset-0 bg-white/95 backdrop-blur-sm z-20 p-8 flex flex-col justify-center"
              >
                <h3 className="text-xl font-bold mb-6 font-arabic text-gray-800">اختر الذكر</h3>
                <div className="space-y-3">
                  {options.map((opt, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleLabelChange(opt.name, opt.target)}
                      className="w-full p-4 rounded-xl border border-gray-100 hover:border-primary hover:bg-primary/5 transition-all text-right font-arabic flex justify-between items-center"
                    >
                      <span className="text-gray-400 text-sm">{opt.target} مرّة</span>
                      <span className="font-bold">{opt.name}</span>
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => setShowSettings(false)}
                  className="mt-8 text-primary font-bold"
                >
                  إغلاق
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Tip */}
        <p className="text-center text-gray-500 mt-8 text-sm">
          انقر في أي مكان داخل الدائرة الكبيرة للعد. يتم دعم الاهتزاز في المتصفحات المتوافقة.
        </p>
      </div>
    </div>
  );
};

export default Tasbih;
