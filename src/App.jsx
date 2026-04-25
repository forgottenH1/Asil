import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';

import Header from './components/Header';
import Footer from './components/Footer';

import Home from './pages/Home';
import InheritanceHub from './pages/InheritanceHub';
import QuranPlayer from './pages/QuranPlayer';
import HijriCalendar from './pages/HijriCalendar';
import PrayerTimes from './pages/PrayerTimes';
import ZakatHub from './pages/ZakatHub';
import Contact from './pages/Contact';
import Tasbih from './pages/Tasbih';
import NamesOfAllah from './pages/NamesOfAllah';
import Adhkar from './pages/Adhkar';
import QiblaFinder from './pages/QiblaFinder';
import NearbyMosques from './pages/NearbyMosques';
import ScrollToTop from './components/ScrollToTop';
import ScrollUpButton from './components/ScrollUpButton';

function App() {
  return (
    <HelmetProvider>
      <Router>
        <ScrollToTop />
        <div className="flex flex-col min-h-screen bg-background font-sans text-gray-800" dir="rtl">
          <Header />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/inheritance" element={<InheritanceHub />} />
              <Route path="/quran" element={<QuranPlayer />} />
              <Route path="/calendar" element={<HijriCalendar />} />
              <Route path="/prayer-times" element={<PrayerTimes />} />
              <Route path="/zakat" element={<ZakatHub />} />
              <Route path="/tasbih" element={<Tasbih />} />
              <Route path="/names-of-allah" element={<NamesOfAllah />} />
              <Route path="/adhkar" element={<Adhkar />} />
              <Route path="/qibla" element={<QiblaFinder />} />
              <Route path="/mosques" element={<NearbyMosques />} />
              <Route path="/contact" element={<Contact />} />
            </Routes>
          </main>
          <Footer />
          <ScrollUpButton />
        </div>
      </Router>
    </HelmetProvider>
  );
}

export default App;
