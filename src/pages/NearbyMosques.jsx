import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { MapPin, Search, ExternalLink, Navigation } from 'lucide-react';

const NearbyMosques = () => {
  const [loading, setLoading] = useState(false);

  const openInGoogleMaps = () => {
    setLoading(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          const url = `https://www.google.com/maps/search/mosque/@${latitude},${longitude},15z`;
          window.open(url, '_blank');
          setLoading(false);
        },
        () => {
          // Fallback if permission denied or error
          const url = `https://www.google.com/maps/search/mosques+near+me`;
          window.open(url, '_blank');
          setLoading(false);
        }
      );
    } else {
      const url = `https://www.google.com/maps/search/mosques+near+me`;
      window.open(url, '_blank');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-12 px-4 flex flex-col items-center justify-center">
      <Helmet>
        <title>أصيل | مساجد قريبة</title>
        <meta name="description" content="البحث عن أقرب المساجد لموقعك الحالي بسهولة وبضغطة زر واحدة." />
      </Helmet>

      <div className="container mx-auto max-w-2xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-12 relative overflow-hidden"
        >
          {/* Decorative Map Background effect */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
          </div>

          <div className="relative z-10">
            <div className="w-24 h-24 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto mb-8 rotate-12">
              <MapPin className="w-12 h-12 text-primary -rotate-12" />
            </div>

            <h1 className="text-4xl font-bold text-gray-900 mb-6 font-arabic">المساجد القريبة</h1>
            <p className="text-xl text-gray-600 mb-12 font-arabic leading-relaxed">
              بضغطة زر واحدة، سنقوم بالبحث عن أقرب المساجد والمصليات المحيطة بموقعك الحالي عبر خرائط جوجل.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                onClick={openInGoogleMaps}
                disabled={loading}
                className="btn-primary py-6 rounded-2xl flex flex-col items-center gap-3 transition-transform hover:scale-[1.02]"
              >
                <div className="bg-white/20 p-2 rounded-lg">
                  <Navigation className="w-6 h-6" />
                </div>
                <span className="text-lg font-bold font-arabic">البحث عبر الخرائط</span>
              </button>

              <div className="bg-gray-50 border border-gray-100 p-6 rounded-2xl text-right flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-gray-800 mb-2 font-arabic">لماذا نطلب الموقع؟</h3>
                  <p className="text-sm text-gray-500 font-arabic">نطلب صلاحية الوصول للموقع لضمان دقة النتائج وإظهار المساجد الأقرب إليك فعلياً.</p>
                </div>
                <div className="flex items-center gap-2 text-primary font-bold text-sm mt-4 justify-end">
                  <span className="font-arabic">خصوصيتك مضمونة</span>
                  <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Alternate Search */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-12 flex flex-col items-center gap-4"
        >
          <p className="text-gray-400 font-arabic">أو يمكنك البحث يدوياً</p>
          <a 
            href="https://www.google.com/maps/search/mosque" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-gray-600 hover:text-primary transition-colors font-arabic border-b border-dashed border-gray-300 pb-1"
          >
            <span>فتح خرائط جوجل مباشرة</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </motion.div>
      </div>
    </div>
  );
};

export default NearbyMosques;
