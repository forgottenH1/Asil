import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';

const ScrollUpButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  if (!isVisible) return null;

  // Render slightly above the bottom if Quran Player is active, to avoid overlap,
  // but for simplicity we just place it fixed bottom-6 right-6 with high z-index.
  return (
    <button
      onClick={scrollToTop}
      className="fixed bottom-24 md:bottom-8 right-6 p-3 bg-primary text-white rounded-full shadow-xl hover:bg-primary-dark transition-all z-50 transform hover:scale-110"
      aria-label="الصعود للأعلى"
    >
      <ArrowUp className="w-6 h-6" />
    </button>
  );
};

export default ScrollUpButton;
