import React, { useState, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { Play, Pause, SkipForward, SkipBack, Search, Volume2, BookOpen, AlertCircle, Loader } from 'lucide-react';

const QuranPlayer = () => {
  const [reciters, setReciters] = useState([]);
  const [filteredReciters, setFilteredReciters] = useState([]);
  const [selectedReciter, setSelectedReciter] = useState(null);
  const [surahs, setSurahs] = useState([]);
  const [selectedSurah, setSelectedSurah] = useState('');
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioUrl, setAudioUrl] = useState('');
  const [volume, setVolume] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const audioRef = useRef(null);

  // Predefined list of Surah names in Arabic
  const surahNames = [
    "الفاتحة","البقرة","آل عمران","النساء","المائدة","الأنعام","الأعراف","الأنفال","التوبة","يونس",
    "هود","يوسف","الرعد","إبراهيم","الحجر","النحل","الإسراء","الكهف","مريم","طه",
    "الأنبياء","الحج","المؤمنون","النور","الفرقان","الشعراء","النمل","القصص","العنكبوت","الروم",
    "لقمان","السجدة","الأحزاب","سبأ","فاطر","يس","الصافات","ص","الزمر","غافر",
    "فصلت","الشورى","الزخرف","الدخان","الجاثية","الأحقاف","محمد","الفتح","الحجرات","ق",
    "الذاريات","الطور","النجم","القمر","الرحمن","الواقعة","الحديد","المجادلة","الحشر","الممتحنة",
    "الصف","الجمعة","المنافقون","التغابن","الطلاق","التحريم","الملك","القلم","الحاقة","المعارج",
    "نوح","الجن","المزمل","المدثر","القيامة","الإنسان","المرسلات","النبأ","النازعات","عبس",
    "التكوير","الانفطار","المطففين","الانشقاق","البروج","الطارق","الأعلى","الغاشية","الفجر","البلد",
    "الشمس","الليل","الضحى","الشرح","التين","العلق","القدر","البينة","الزلزلة","العاديات",
    "القارعة","التكاثر","العصر","الهمزة","الفيل","قريش","الماعون","الكوثر","الكافرون","النصر",
    "المسد","الإخلاص","الفلق","الناس"
  ];

  useEffect(() => {
    // Fetch Reciters using native fetch to avoid native module bugs and improve performance
    fetch('https://www.mp3quran.net/api/v3/reciters?language=ar')
      .then(res => {
        if (!res.ok) throw new Error('Network response was not ok');
        return res.json();
      })
      .then(data => {
        const recitersList = data.reciters;
        setReciters(recitersList);
        setFilteredReciters(recitersList);
        // Default to Mishary (id: 13)
        const defaultMishary = recitersList.find(r => r.id === 13) || recitersList[0];
        handleReciterSelect(defaultMishary);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError('تعذر الاتصال بالخادم لجلب بيانات القراء، تأكد من اتصالك بالإنترنت.');
        setLoading(false);
      });
  }, []);

  const handleReciterSelect = (reciter) => {
    setSelectedReciter(reciter);
    // Usually reciters have specific moshaf, we pick the first one
    if (reciter.moshaf && reciter.moshaf.length > 0) {
      const moshaf = reciter.moshaf[0];
      const availableSurahs = moshaf.surah_list.split(',');
      
      const parsedSurahs = availableSurahs.map(id => ({
        id: id,
        name: surahNames[parseInt(id) - 1],
        url: `${moshaf.server}${id.padStart(3, '0')}.mp3`
      }));
      setSurahs(parsedSurahs);
      
      // Default to Al-Fatiha
      if (parsedSurahs.length > 0) {
        handleSurahSelect(parsedSurahs[0]);
      }
    }
  };

  const handleSurahSelect = (surah) => {
    setSelectedSurah(surah);
    setAudioUrl(surah.url);
    setIsPlaying(true);
    setTimeout(() => {
        if (audioRef.current) {
            audioRef.current.volume = volume;
            audioRef.current.play().catch(e => console.log('Autoplay prevented:', e));
        }
    }, 50);
  };

  const playNext = () => {
    if (!selectedSurah || surahs.length === 0) return;
    const currentIndex = surahs.findIndex(s => s.id === selectedSurah.id);
    if (currentIndex < surahs.length - 1) {
      handleSurahSelect(surahs[currentIndex + 1]);
    }
  };

  const playPrev = () => {
    if (!selectedSurah || surahs.length === 0) return;
    const currentIndex = surahs.findIndex(s => s.id === selectedSurah.id);
    if (currentIndex > 0) {
      handleSurahSelect(surahs[currentIndex - 1]);
    }
  };

  const togglePlay = () => {
    const audio = audioRef.current;
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="py-12 min-h-screen relative">
      <Helmet>
        <title>أصيل | القرآن الكريم</title>
      </Helmet>

      {/* Modern Player Fixed Bottom */}
      {audioUrl && (
        <div className="fixed bottom-0 left-0 right-0 glass-panel border-t rounded-none border-gray-200 p-4 z-40 bg-white/95">
          <div className="container mx-auto flex items-center justify-between gap-2 md:gap-0">
            <div className="flex items-center gap-2 md:gap-4 flex-1 md:w-1/3 overflow-hidden text-ellipsis whitespace-nowrap">
              <div className="bg-primary/10 p-3 rounded-full hidden md:block">
                <BookOpen className="text-primary w-6 h-6" />
              </div>
              <div className="text-right">
                <h4 className="font-bold text-gray-900 text-sm md:text-base">سورة {selectedSurah?.name}</h4>
                <p className="text-xs md:text-sm text-gray-500 overflow-hidden text-ellipsis whitespace-nowrap">{selectedReciter?.name}</p>
              </div>
            </div>

            <div className="flex items-center justify-center gap-2 md:gap-6 w-auto md:w-1/3">
              <button onClick={playNext} className="text-gray-400 hover:text-primary transition-colors p-1 md:p-0">
                <SkipForward className="w-6 h-6" />
              </button>
              <button 
                onClick={togglePlay}
                className="bg-primary hover:bg-primary-dark text-white p-4 rounded-full shadow-lg transform transition-transform hover:scale-105"
              >
                {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
              </button>
              <button onClick={playPrev} className="text-gray-400 hover:text-primary transition-colors">
                <SkipBack className="w-6 h-6" />
              </button>
            </div>

            <div className="flex justify-end items-center gap-1 md:gap-3 flex-1 md:w-1/3">
              <Volume2 className="text-gray-400 w-4 h-4 md:w-5 md:h-5" />
              <input 
                type="range" 
                min="0" max="1" step="0.01" value={volume}
                onChange={(e) => {
                    const newVol = parseFloat(e.target.value);
                    setVolume(newVol);
                    if(audioRef.current) audioRef.current.volume = newVol;
                }}
                className="w-16 md:w-24 accent-primary cursor-pointer" 
              />
            </div>

            <audio 
              ref={audioRef} 
              src={audioUrl} 
              onEnded={() => setIsPlaying(false)}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              className="hidden" 
            />
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 max-w-6xl pb-24">
        <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center border-b pb-6">القرآن الكريم</h1>
        
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-primary">
            <Loader className="w-12 h-12 animate-spin mb-4" />
            <p className="text-lg font-bold">جاري تحميل بيانات القراء...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 text-red-600 p-6 rounded-2xl flex flex-col items-center justify-center gap-4">
            <AlertCircle className="w-12 h-12" />
            <p className="text-lg font-bold">{error}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Reciter List */}
            <div className="md:col-span-1 glass-card overflow-hidden flex flex-col h-[600px]">
             <div className="p-4 border-b border-gray-100 bg-gray-50/50">
               <div className="relative">
                 <input 
                   type="text" 
                   placeholder="ابحث عن قارئ..." 
                   className="input-field py-2 pr-10 text-sm"
                   onChange={(e) => {
                     const q = e.target.value;
                     setFilteredReciters(reciters.filter(r => r.name.includes(q)));
                   }}
                 />
                 <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
               </div>
             </div>
             <div className="overflow-y-auto flex-grow p-2 space-y-1">
               {filteredReciters.map(reciter => (
                 <button
                   key={reciter.id}
                   onClick={() => handleReciterSelect(reciter)}
                   className={`w-full text-right px-4 py-3 rounded-xl transition-all ${selectedReciter?.id === reciter.id ? 'bg-primary text-white font-bold shadow-md' : 'hover:bg-gray-100 text-gray-700'}`}
                 >
                   {reciter.name}
                 </button>
               ))}
             </div>
          </div>

          {/* Surah List */}
          <div className="md:col-span-3 glass-card p-6 h-[600px] overflow-y-auto">
             <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
               {surahs.map(surah => (
                 <button
                   key={surah.id}
                   onClick={() => handleSurahSelect(surah)}
                   className={`p-4 border rounded-2xl flex flex-col items-center justify-center gap-3 transition-all ${
                     selectedSurah?.id === surah.id 
                     ? 'border-primary bg-primary/5 text-primary shadow-sm' 
                     : 'border-gray-100 hover:border-primary/30 hover:bg-gray-50'
                   }`}
                 >
                   <div className="w-10 h-10 rounded-full border-2 border-current flex items-center justify-center font-bold">
                     <span className="font-sans">{surah.id}</span>
                   </div>
                   <span className="text-xl font-bold font-arabic">{surah.name}</span>
                 </button>
               ))}
             </div>
          </div>
        </div>
        )}
      </div>
    </div>
  );
};

export default QuranPlayer;
