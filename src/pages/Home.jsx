import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Calculator, BookOpen, Calendar, Clock, ArrowLeft, BadgeDollarSign } from 'lucide-react';

const features = [
  {
    title: 'حاسبة المواريث',
    description: 'أداة دقيقة لحساب الأنصبة الشرعية مع سرد الأدلة من القرآن والسنة.',
    icon: Calculator,
    link: '/inheritance',
    color: 'bg-emerald-100 text-emerald-600',
  },
  {
    title: 'القرآن الكريم',
    description: 'تلاوات خاشعة وتجربة استماع روحانية لأشهر القراء.',
    icon: BookOpen,
    link: '/quran',
    color: 'bg-blue-100 text-blue-600',
  },
  {
    title: 'مواقيت الصلاة',
    description: 'مواقيت الصلاة بدقة حسب موقعك الجغرافي.',
    icon: Clock,
    link: '/prayer-times',
    color: 'bg-amber-100 text-amber-600',
  },
  {
    title: 'التقويم الهجري',
    description: 'محول التاريخ ومعرفة المناسبات الإسلامية الهامة.',
    icon: Calendar,
    link: '/calendar',
    color: 'bg-purple-100 text-purple-600',
  },
  {
    title: 'حاسبة الزكاة',
    description: 'احسب زكاتك بمختلف أنواعها (المال، الذهب، الأنعام، المحاصيل) بدقة شرعية.',
    icon: BadgeDollarSign,
    link: '/zakat',
    color: 'bg-gold-100 text-gold-600',
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: 'spring', stiffness: 100 },
  },
};

const Home = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const query = params.get('q');
    if (query) {
      setSearchTerm(query);
    }
  }, [location.search]);

  const filterText = searchTerm.trim().toLowerCase();
  
  const filteredFeatures = features.filter(f => 
    f.title.toLowerCase().includes(filterText) || f.description.toLowerCase().includes(filterText)
  );

  const handleSearch = (e) => {
    if (e) e.preventDefault();
    if (filterText && filteredFeatures.length === 1) {
      navigate(filteredFeatures[0].link);
    } else if (filteredFeatures.length > 0) {
      document.getElementById('features-section')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch(e);
    }
  };

  return (
    <div className="min-h-screen">
      <Helmet>
        <title>أصيل | الصفحة الرئيسية</title>
        <meta name="description" content="منصة أصيل، بيئتك الإسلامية المتكاملة لحساب المواريث والقرآن ومواقيت الصلاة." />
        <meta property="og:image" content="https://myasil.pages.dev/og-image.png" />
      </Helmet>

      {/* Hero Section */}
      <section className="relative pt-24 pb-32 overflow-hidden">
        {/* Background Decorative Blurs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-light/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-gold-light/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
        
        <div className="container mx-auto px-4 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl mx-auto"
          >
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight font-arabic drop-shadow-sm">
              منصة <span className="text-primary tracking-tight">أصيل</span> الإسلامية
            </h1>
            <p className="text-xl text-gray-600 mb-10 leading-relaxed">
              مرجعك الشامل والموثوق لأدوات العبادة والبحث الشرعي. حاسبة مواريث متطورة، قرآن كريم، أوقات صلاة وتقويم هجري بتصميم عصري يريح العين.
            </p>
            
            <div className="relative max-w-xl mx-auto mb-16">
              <div className="flex bg-white rounded-full p-2 shadow-lg border border-gray-100">
                <input 
                  type="text" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="ابحث في المنصة..." 
                  className="w-full px-6 bg-transparent border-none focus:outline-none focus:ring-0 text-gray-700 font-sans"
                />
                <button 
                  onClick={handleSearch}
                  className="btn-primary flex items-center justify-center rounded-full px-8 whitespace-nowrap"
                >
                  بحث
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features-section" className="pb-24">
        <div className="container mx-auto px-4">
          {filteredFeatures.length === 0 ? (
            <div className="text-center text-gray-600 text-lg py-12">
               عذراً، لم يتم العثور على نتائج مطابقة للبحث.
            </div>
          ) : (
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              {filteredFeatures.map((feature, idx) => {
                const Icon = feature.icon;
                return (
                  <motion.div key={idx} variants={itemVariants}>
                    <Link to={feature.link} className="block group h-full">
                      <div className="glass-card p-8 h-full transition-transform transform group-hover:-translate-y-2 group-hover:shadow-2xl">
                        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 ${feature.color}`}>
                          <Icon className="w-8 h-8" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-800 mb-3 group-hover:text-primary transition-colors">
                          {feature.title}
                        </h3>
                        <p className="text-gray-600 mb-6">
                          {feature.description}
                        </p>
                        
                        <div className="flex items-center text-primary font-bold gap-2">
                          <span>تصفح الآن</span>
                          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-2" />
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;
