import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Search, Info, X } from 'lucide-react';
import namesData from '../data/names-of-allah.json';

const NamesOfAllah = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedName, setSelectedName] = useState(null);

  const filteredNames = namesData.filter(name => 
    name.arabic.includes(searchTerm) || 
    name.transliteration.toLowerCase().includes(searchTerm.toLowerCase()) ||
    name.english.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen py-12 px-4">
      <Helmet>
        <title>أصيل | أسماء الله الحسنى</title>
        <meta name="description" content="تصفح أسماء الله الحسنى التسعة وتسعين مع معانيها وتفسيراتها بتصميم عصري." />
      </Helmet>

      <div className="container mx-auto">
        <div className="text-center mb-16">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 font-arabic"
          >
            أسماء الله الحسنى
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-gray-600 max-w-2xl mx-auto mb-10"
          >
            "ولله الأسماء الحسنى فادعوه بها" - سورة الأعراف (180). تصفح الأسماء التسعة وتسعين ومعانيها الجليلة.
          </motion.p>

          <div className="relative max-w-md mx-auto">
            <div className="flex bg-white rounded-full p-2 shadow-sm border border-gray-100">
              <input 
                type="text" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="ابحث عن اسم..." 
                className="w-full px-6 bg-transparent border-none focus:outline-none text-gray-700 text-right font-arabic"
              />
              <div className="p-2 text-gray-400">
                <Search className="w-6 h-6" />
              </div>
            </div>
          </div>
        </div>

        <motion.div 
          layout
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 md:gap-6"
        >
          <AnimatePresence>
            {filteredNames.map((name) => (
              <motion.div
                key={name.number}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                whileHover={{ y: -5 }}
                onClick={() => setSelectedName(name)}
                className="glass-card p-6 text-center cursor-pointer group hover:border-primary/30 transition-all border-transparent border"
              >
                <div className="text-sm text-gray-400 mb-2 font-sans">#{name.number}</div>
                <div className="text-3xl font-bold text-primary mb-3 font-arabic group-hover:scale-110 transition-transform">
                  {name.arabic}
                </div>
                <div className="text-sm font-semibold text-gray-800 mb-1">{name.transliteration}</div>
                <div className="text-xs text-gray-500 line-clamp-1">{name.english}</div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Modal for Details */}
        <AnimatePresence>
          {selectedName && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden relative"
              >
                <button 
                  onClick={() => setSelectedName(null)}
                  className="absolute top-4 left-4 p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-400"
                >
                  <X className="w-6 h-6" />
                </button>

                <div className="bg-gradient-to-br from-primary to-primary-dark p-12 text-center text-white">
                  <div className="text-sm opacity-80 mb-4 tracking-widest font-sans">NAME #{selectedName.number}</div>
                  <div className="text-6xl font-bold font-arabic mb-4 drop-shadow-md">
                    {selectedName.arabic}
                  </div>
                </div>

                <div className="p-8 text-center">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{selectedName.transliteration}</h3>
                  <p className="text-lg text-primary font-medium mb-6">{selectedName.english}</p>
                  
                  <div className="bg-gray-50 rounded-2xl p-6 text-right">
                    <div className="flex items-center justify-end gap-2 text-gray-400 mb-4">
                      <span className="text-sm font-arabic italic">نبذة عن الاسم</span>
                      <Info className="w-4 h-4" />
                    </div>
                    <p className="text-gray-600 leading-relaxed font-arabic">
                      هذا الاسم الجليل هو أحد أسماء الله الحسنى، وفيه دلالة على عظمة الخالق سبحانه وتعالى في {selectedName.english.toLowerCase()}.
                    </p>
                  </div>
                  
                  <button 
                    onClick={() => setSelectedName(null)}
                    className="btn-primary w-full mt-8 py-4 rounded-xl"
                  >
                    تنزيل المعلومات
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default NamesOfAllah;
