import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const Footer = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      // Navigate to home with search param
      navigate(`/?q=${encodeURIComponent(searchTerm.trim())}`);
      // Scroll to top to ensure the user sees the search results or the header search
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <div>
            <h3 className="text-xl font-bold text-primary-dark mb-4">أصيل</h3>
            <p className="text-gray-600 leading-relaxed">
              منصة إسلامية متكاملة تقدم أدوات عصرية لحساب المواريث، وتلاوة القرآن، ومعرفة التقويم الهجري ومواقيت الصلاة، بتجربة مستخدم فريدة.
            </p>
          </div>

          <div>
            <h4 className="text-lg font-bold text-gray-800 mb-4">روابط سريعة</h4>
            <ul className="space-y-2 text-gray-600">
              <li><Link to="/inheritance" className="hover:text-primary transition-colors">حاسبة المواريث</Link></li>
              <li><Link to="/quran" className="hover:text-primary transition-colors">القرآن الكريم</Link></li>
              <li><Link to="/calendar" className="hover:text-primary transition-colors">التقويم الهجري</Link></li>
              <li><Link to="/prayer-times" className="hover:text-primary transition-colors">مواقيت الصلاة</Link></li>
              <li><Link to="/contact" className="hover:text-primary transition-colors">تواصل معنا</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-bold text-gray-800 mb-4">بحث في الموقع</h4>
            <form onSubmit={handleSearch} className="relative">
              <input 
                type="text" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="ابحث هنا..." 
                className="input-field pr-12 w-full"
              />
              <button type="submit">
                <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 hover:text-primary transition-colors cursor-pointer" />
              </button>
            </form>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-gray-100 text-center text-gray-500">
          <p>© {new Date().getFullYear()} منصة أصيل. جميع الحقوق محفوظة.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
