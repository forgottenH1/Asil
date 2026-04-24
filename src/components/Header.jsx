import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Moon, BookOpen, Calendar, Clock, Calculator, Menu, BadgeDollarSign, Mail } from 'lucide-react';
import { motion } from 'framer-motion';

const Header = () => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const isActive = (path) => location.pathname === path;

  // Close mobile menu on route change
  React.useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const links = [
    { name: 'الرئيسية', path: '/', icon: Moon },
    { name: 'المواريث', path: '/inheritance', icon: Calculator },
    { name: 'القرآن الكريم', path: '/quran', icon: BookOpen },
    { name: 'الزكاة', path: '/zakat', icon: BadgeDollarSign },
    { name: 'التقويم الهجري', path: '/calendar', icon: Calendar },
    { name: 'مواقيت الصلاة', path: '/prayer-times', icon: Clock },
    { name: 'تواصل معنا', path: '/contact', icon: Mail },
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
        <nav className="hidden md:flex gap-6">
          {links.map((link) => {
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
                <span className="relative z-10">{link.name}</span>
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
      {isMobileMenuOpen && (
        <motion.nav 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden bg-white border-b border-gray-200 shadow-lg absolute w-full left-0 z-40 px-4 py-4 space-y-2"
        >
          {links.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  isActive(link.path)
                    ? 'bg-primary/10 text-primary font-bold'
                    : 'text-gray-600 hover:text-primary hover:bg-gray-50'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{link.name}</span>
              </Link>
            );
          })}
        </motion.nav>
      )}
    </header>
  );
};

export default Header;
