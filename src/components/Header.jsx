import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Moon, BookOpen, Calendar, Clock, Calculator, Menu, BadgeDollarSign, Mail, ChevronDown, Compass, MapPin, Sparkles, Book, CircleDot } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Header = () => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isToolsOpen, setIsToolsOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  // Close menus on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsToolsOpen(false);
  }, [location.pathname]);

  const mainLinks = [
    { name: 'الرئيسية', path: '/', icon: Moon },
    { name: 'المواريث', path: '/inheritance', icon: Calculator },
    { name: 'القرآن', path: '/quran', icon: BookOpen },
    { name: 'الزكاة', path: '/zakat', icon: BadgeDollarSign },
  ];

  const toolLinks = [
    { name: 'التقويم الهجري', path: '/calendar', icon: Calendar },
    { name: 'مواقيت الصلاة', path: '/prayer-times', icon: Clock },
    { name: 'المسبحة', path: '/tasbih', icon: CircleDot },
    { name: 'أسماء الله', path: '/names-of-allah', icon: Sparkles },
    { name: 'الأذكار', path: '/adhkar', icon: Book },
    { name: 'القبلة', path: '/qibla', icon: Compass },
    { name: 'المساجد', path: '/mosques', icon: MapPin },
  ];

  return (
    <header className="sticky top-0 z-50 glass-panel border-b-0 rounded-none border-b border-gray-200">
      <div className="container mx-auto px-4 py-4 flex flex-row-reverse justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <Moon className="w-8 h-8 text-primary" />
          <span className="text-2xl font-bold text-primary-dark">أصيل</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex gap-4 items-center">
          <Link to="/contact" className="text-gray-600 hover:text-primary px-3 py-2 font-arabic transition-colors">تواصل معنا</Link>
          
          <div className="h-6 w-[1px] bg-gray-200 mx-2"></div>

          {/* Tools Dropdown */}
          <div className="relative group">
            <button 
              onMouseEnter={() => setIsToolsOpen(true)}
              onClick={() => setIsToolsOpen(!isToolsOpen)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                toolLinks.some(l => isActive(l.path)) ? 'text-primary font-bold bg-primary/5' : 'text-gray-600'
              }`}
            >
              <ChevronDown className={`w-4 h-4 transition-transform ${isToolsOpen ? 'rotate-180' : ''}`} />
              <span className="font-arabic">أدوات إسلامية</span>
            </button>
            
            <AnimatePresence>
              {isToolsOpen && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  onMouseLeave={() => setIsToolsOpen(false)}
                  className="absolute left-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 p-2 overflow-hidden"
                >
                  {toolLinks.map((link) => {
                    const Icon = link.icon;
                    return (
                      <Link
                        key={link.path}
                        to={link.path}
                        className={`flex items-center justify-end gap-3 px-4 py-3 rounded-xl transition-all ${
                          isActive(link.path)
                            ? 'bg-primary/10 text-primary font-bold'
                            : 'text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        <span className="font-arabic">{link.name}</span>
                        <Icon className="w-5 h-5" />
                      </Link>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {mainLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`relative flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                  isActive(link.path)
                    ? 'text-primary font-bold'
                    : 'text-gray-600 hover:text-primary hover:bg-gray-50'
                }`}
              >
                {isActive(link.path) && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-primary/10 rounded-lg"
                    initial={false}
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                <Icon className="w-5 h-5 relative z-10" />
                <span className="relative z-10 font-arabic">{link.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Mobile Menu Toggle */}
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden text-gray-600 hover:text-primary z-50 p-2"
        >
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {/* Mobile Navigation Dropdown */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.nav 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-b border-gray-200 shadow-lg absolute w-full left-0 z-40 overflow-hidden"
          >
            <div className="px-4 py-4 space-y-1">
              {[...mainLinks, ...toolLinks, { name: 'تواصل معنا', path: '/contact', icon: Mail }].map((link) => {
                const Icon = link.icon;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`flex items-center justify-end gap-3 px-4 py-3 rounded-xl transition-all ${
                      isActive(link.path)
                        ? 'bg-primary/10 text-primary font-bold'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <span className="font-arabic">{link.name}</span>
                    <Icon className="w-5 h-5" />
                  </Link>
                );
              })}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;

