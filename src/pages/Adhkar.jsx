import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Sun, Moon, Book, CheckCircle2, RotateCcw } from 'lucide-react';
import adhkarData from '../data/adhkar.json';

const Adhkar = () => {
  const [activeCategory, setActiveCategory] = useState(adhkarData[0].category);
  const [counts, setCounts] = useState({});

  const handleIncrement = (itemId, maxCount) => {
    setCounts(prev => {
      const current = prev[itemId] || 0;
      if (current < maxCount) {
        if (window.navigator.vibrate) window.navigator.vibrate(30);
        return { ...prev, [itemId]: current + 1 };
      }
      return prev;
    });
  };

  const handleReset = (itemId) => {
    setCounts(prev => ({ ...prev, [itemId]: 0 }));
  };

  const currentAdhkar = adhkarData.find(cat => cat.category === activeCategory);

  const getIcon = (category) => {
    if (category === 'adhkar_morning') return <Sun className="w-6 h-6 text-amber-500" />;
    if (category === 'adhkar_evening') return <Moon className="w-6 h-6 text-purple-500" />;
    return <Book className="w-6 h-6 text-emerald-500" />;
  };

  return (
    <div className="min-h-screen py-12 px-4">
      <Helmet>
        <title>أصيل | الأذكار اليومية</title>
        <meta name="description" content="أذكار الصباح والمساء وبعد الصلاة مع حصن المسلم وتتبع التسبيح." />
      </Helmet>

      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-12">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold text-gray-900 mb-8 font-arabic"
          >
            الأذكار اليومية
          </motion.h1>

          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {adhkarData.map((cat) => (
              <button
                key={cat.category}
                onClick={() => setActiveCategory(cat.category)}
                className={`flex items-center gap-3 px-6 py-4 rounded-2xl transition-all font-arabic ${
                  activeCategory === cat.category 
                  ? 'bg-primary text-white shadow-lg scale-105' 
                  : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-100'
                }`}
              >
                <span>{cat.title}</span>
                <div className={activeCategory === cat.category ? 'text-white' : ''}>
                  {getIcon(cat.category)}
                </div>
              </button>
            ))}
          </div>
        </div>

        <motion.div 
          key={activeCategory}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-6"
        >
          {currentAdhkar.items.map((item, idx) => {
            const itemId = `${activeCategory}-${idx}`;
            const currentCount = counts[itemId] || 0;
            const isCompleted = currentCount >= item.count;

            return (
              <motion.div
                key={itemId}
                layout
                className={`glass-card p-6 md:p-8 relative transition-all border ${
                  isCompleted ? 'border-primary/20 bg-primary/5' : 'border-transparent'
                }`}
              >
                <div className="flex flex-row-reverse justify-between items-start gap-6">
                  <div className="flex-grow text-right">
                    <p className="text-xl md:text-2xl text-gray-800 leading-relaxed font-arabic mb-4">
                      {item.content}
                    </p>
                    {item.description && (
                      <p className="text-sm text-gray-400 font-arabic italic">
                        {item.description}
                      </p>
                    )}
                  </div>
                  
                  <div className="flex flex-col items-center gap-4 min-w-[80px]">
                    <button
                      disabled={isCompleted}
                      onClick={() => handleIncrement(itemId, item.count)}
                      className={`w-16 h-16 rounded-2xl flex flex-col items-center justify-center transition-all ${
                        isCompleted 
                        ? 'bg-primary text-white' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {isCompleted ? (
                        <CheckCircle2 className="w-8 h-8" />
                      ) : (
                        <>
                          <span className="text-2xl font-bold font-sans">{item.count - currentCount}</span>
                          <span className="text-[10px] font-arabic">باقي</span>
                        </>
                      )}
                    </button>
                    {currentCount > 0 && (
                      <button 
                        onClick={() => handleReset(itemId)}
                        className="text-gray-300 hover:text-gray-500 transition-colors p-1"
                      >
                        <RotateCcw className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Progress bar at the bottom of each card */}
                {item.count > 1 && (
                  <div className="absolute bottom-0 right-0 h-1 bg-gray-100 overflow-hidden rounded-b-3xl w-full">
                    <motion.div 
                      className="h-full bg-primary"
                      initial={{ width: 0 }}
                      animate={{ width: `${(currentCount / item.count) * 100}%` }}
                    />
                  </div>
                )}
              </motion.div>
            );
          })}
        </motion.div>

        <div className="text-center mt-12 text-gray-400 font-arabic text-sm">
          مأخوذ من حصن المسلم - كتاب الأذكار
        </div>
      </div>
    </div>
  );
};

export default Adhkar;
