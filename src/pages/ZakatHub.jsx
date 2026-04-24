import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Coins, 
  Sprout, 
  Variable, 
  Info, 
  Calculator, 
  BadgeDollarSign, 
  Wheat, 
  Beef, 
  ChevronLeft, 
  ChevronRight,
  TrendingDown
} from 'lucide-react';
import { calculateMonetaryZakat, calculateLivestockZakat, calculateAgriZakat } from '../engine/ZakatEngine';

const ZakatHub = () => {
  const [activeTab, setActiveTab] = useState('monetary'); // monetary, livestock, agri
  const [currency, setCurrency] = useState('درهم مغربي');
  
  // Monetary State
  const [monetaryData, setMonetaryData] = useState({
    cash: '',
    goldGrams: '',
    silverGrams: '',
    tradeValue: '',
    goldPrice: '750', // Default approx price
    silverPrice: '10', // Default approx price
    debts: '',
    nisabChoice: 'gold'
  });

  // Livestock State
  const [livestockType, setLivestockType] = useState('sheep');
  const [livestockCount, setLivestockCount] = useState('');

  // Agri State
  const [agriWeight, setAgriWeight] = useState('');
  const [agriMethod, setAgriMethod] = useState('rain'); // rain, artificial, mixed

  const [results, setResults] = useState(null);

  const handleMonetaryChange = (e) => {
    const { name, value } = e.target;
    setMonetaryData(prev => ({ ...prev, [name]: value }));
  };

  const computeMonetary = () => {
    const res = calculateMonetaryZakat(monetaryData);
    setResults({ type: 'monetary', ...res });
  };

  const computeLivestock = () => {
    const res = calculateLivestockZakat(livestockType, livestockCount);
    setResults({ type: 'livestock', ...res, count: livestockCount, animalType: livestockType });
  };

  const computeAgri = () => {
    const res = calculateAgriZakat(agriWeight, agriMethod);
    setResults({ type: 'agri', ...res });
  };

  const resetAll = () => {
    setResults(null);
    setMonetaryData({
      cash: '', goldGrams: '', silverGrams: '', tradeValue: '',
      goldPrice: '750', silverPrice: '10', debts: '', nisabChoice: 'gold'
    });
    setLivestockCount('');
    setAgriWeight('');
  };

  return (
    <div className="py-12 min-h-screen bg-gray-50/50">
      <Helmet>
        <title>أصيل | حاسبة الزكاة الشاملة</title>
      </Helmet>

      <div className="container mx-auto px-4 max-w-5xl">
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           className="text-center mb-12"
        >
          <div className="inline-flex items-center justify-center p-4 bg-gold-100 rounded-full mb-4 text-gold-600">
            <BadgeDollarSign className="w-8 h-8" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">حاسبة الزكاة الشاملة</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
             أداة دقيقة لحساب الزكاة لمختلف أوعية المال وفق أحكام الشريعة الإسلامية بمقاديرها الشرعية المعتبرة.
          </p>
        </motion.div>

        {/* Tabs Navigation */}
        <div className="flex flex-wrap justify-center gap-4 mb-10 overflow-x-auto pb-4 custom-scrollbar">
           {[
             { id: 'monetary', label: 'النقود والذهب والتجارة', icon: Coins },
             { id: 'agri', label: 'الزروع والثمار', icon: Sprout },
             { id: 'livestock', label: 'الأنعام (بهيمة الأنعام)', icon: Beef },
           ].map(tab => (
             <button
               key={tab.id}
               onClick={() => { setActiveTab(tab.id); setResults(null); }}
               className={`flex items-center gap-3 px-6 py-3 rounded-full font-bold transition-all whitespace-nowrap shadow-sm ${
                 activeTab === tab.id 
                 ? 'bg-primary text-white scale-105 shadow-primary/30' 
                 : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
               }`}
             >
               <tab.icon className="w-5 h-5" />
               {tab.label}
             </button>
           ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Inputs Area */}
          <div className="lg:col-span-7">
             <div className="glass-card p-6 min-h-[400px]">
                <AnimatePresence mode="wait">
                  {activeTab === 'monetary' && (
                    <motion.div
                      key="monetary"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="space-y-6"
                    >
                      <h2 className="text-xl font-bold text-gray-800 border-b pb-2 flex items-center gap-2">
                        <TrendingDown className="w-5 h-5 text-gold-600" /> زكاة المال وعروض التجارة
                      </h2>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                         <div className="md:col-span-2">
                            <label className="block text-sm font-bold text-gray-600 mb-2">نوع العملة المستخدمة في الحساب</label>
                            <select 
                              value={currency}
                              onChange={(e) => setCurrency(e.target.value)}
                              className="input-field font-bold text-gray-700 cursor-pointer"
                            >
                              <option value="درهم مغربي">درهم مغربي (MAD)</option>
                              <option value="ريال سعودي">ريال سعودي (SAR)</option>
                              <option value="درهم إماراتي">درهم إماراتي (AED)</option>
                              <option value="دينار كويتي">دينار كويتي (KWD)</option>
                              <option value="دينار أردني">دينار أردني (JOD)</option>
                              <option value="دينار جزائري">دينار جزائري (DZD)</option>
                              <option value="دينار تونسي">دينار تونسي (TND)</option>
                              <option value="جينيه مصري">جنيه مصري (EGP)</option>
                              <option value="ريال قطري">ريال قطري (QAR)</option>
                              <option value="ريال عماني">ريال عماني (OMR)</option>
                              <option value="دينار بحريني">دينار بحريني (BHD)</option>
                              <option value="ريال يمني">ريال يمني (YER)</option>
                              <option value="دولار أمريكي">دولار أمريكي (USD)</option>
                              <option value="يورو">يورو (EUR)</option>
                            </select>
                         </div>
                         <div>
                            <label className="block text-sm font-bold text-gray-600 mb-1">السيولة النقدية / البنك</label>
                            <input 
                              type="number" name="cash" value={monetaryData.cash} onChange={handleMonetaryChange}
                              placeholder="0.00" className="input-field"
                            />
                         </div>
                         <div>
                            <label className="block text-sm font-bold text-gray-600 mb-1">قيمة بضاعة التجارة</label>
                            <input 
                              type="number" name="tradeValue" value={monetaryData.tradeValue} onChange={handleMonetaryChange}
                              placeholder="0.00" className="input-field"
                            />
                         </div>
                         <div>
                            <label className="block text-sm font-bold text-gray-600 mb-1">وزن الذهب (جرام)</label>
                            <input 
                              type="number" name="goldGrams" value={monetaryData.goldGrams} onChange={handleMonetaryChange}
                              placeholder="0" className="input-field"
                            />
                         </div>
                         <div>
                            <label className="block text-sm font-bold text-gray-600 mb-1">وزن الفضة (جرام)</label>
                            <input 
                              type="number" name="silverGrams" value={monetaryData.silverGrams} onChange={handleMonetaryChange}
                              placeholder="0" className="input-field"
                            />
                         </div>
                         <div className="md:col-span-2 bg-gray-50 p-4 rounded-xl border border-gray-200">
                            <h3 className="text-sm font-bold text-gray-700 mb-3">أسعار السوق الحالية (لتحديد النصاب)</h3>
                            <div className="grid grid-cols-2 gap-4">
                               <div>
                                  <label className="block text-xs font-bold text-gray-500 mb-1">سعر جرام الذهب ({currency})</label>
                                  <input 
                                    type="number" name="goldPrice" value={monetaryData.goldPrice} onChange={handleMonetaryChange}
                                    className="input-field py-1"
                                  />
                               </div>
                               <div>
                                  <label className="block text-xs font-bold text-gray-500 mb-1">سعر جرام الفضة ({currency})</label>
                                  <input 
                                    type="number" name="silverPrice" value={monetaryData.silverPrice} onChange={handleMonetaryChange}
                                    className="input-field py-1"
                                  />
                               </div>
                            </div>
                         </div>
                         <div className="md:col-span-2">
                             <label className="block text-sm font-bold text-gray-600 mb-1">الديون التي عليك (تُخصم)</label>
                             <input 
                               type="number" name="debts" value={monetaryData.debts} onChange={handleMonetaryChange}
                               placeholder="0.00" className="input-field border-red-100 focus:border-red-300"
                             />
                         </div>
                      </div>
                      
                      <button onClick={computeMonetary} className="btn-primary w-full flex justify-center items-center gap-2 py-4 text-lg">
                        <Calculator className="w-6 h-6" /> احسب الزكاة المستحقة
                      </button>
                    </motion.div>
                  )}

                  {activeTab === 'agri' && (
                    <motion.div
                      key="agri"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="space-y-6"
                    >
                      <h2 className="text-xl font-bold text-gray-800 border-b pb-2 flex items-center gap-2">
                        <Wheat className="w-5 h-5 text-emerald-600" /> زكاة الحبوب والثمار
                      </h2>
                      <div className="space-y-4">
                        <div>
                           <label className="block text-sm font-bold text-gray-600 mb-1">وزن المحصول الإجمالي (كيلوجرام)</label>
                           <input 
                             type="number" value={agriWeight} onChange={(e) => setAgriWeight(e.target.value)}
                             placeholder="مثلاً: 1000" className="input-field"
                           />
                        </div>
                        <div>
                           <label className="block text-sm font-bold text-gray-600 mb-1">طريقة السقي والري</label>
                           <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                              {[
                                { id: 'rain', label: 'سقي طبيعي (مطر/أنهار)', icon: trendingUp => '10%' },
                                { id: 'artificial', label: 'سقي صناعي (تكلفة)', icon: trendingUp => '5%' },
                                { id: 'mixed', label: 'سقي مختلط', icon: trendingUp => '7.5%' },
                              ].map(m => (
                                <button
                                  key={m.id}
                                  onClick={() => setAgriMethod(m.id)}
                                  className={`p-3 border rounded-xl font-bold text-sm transition-all ${
                                    agriMethod === m.id ? 'bg-emerald-50 border-emerald-500 text-emerald-800' : 'bg-white border-gray-200 text-gray-600'
                                  }`}
                                >
                                  {m.label}
                                </button>
                              ))}
                           </div>
                        </div>
                      </div>
                      <button onClick={computeAgri} className="btn-primary w-full py-4 text-lg bg-emerald-600 hover:bg-emerald-700">
                        احسب زكاة المحصول
                      </button>
                    </motion.div>
                  )}

                  {activeTab === 'livestock' && (
                    <motion.div
                      key="livestock"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="space-y-6"
                    >
                      <h2 className="text-xl font-bold text-gray-800 border-b pb-2 flex items-center gap-2">
                        <Beef className="w-5 h-5 text-amber-600" /> زكاة بهيمة الأنعام
                      </h2>
                      <div className="space-y-4">
                         <div>
                            <label className="block text-sm font-bold text-gray-600 mb-2">نوع الأنعام</label>
                            <div className="flex gap-4">
                               {[
                                 { id: 'sheep', label: 'غنم ومعز' },
                                 { id: 'cattle', label: 'بقر وجاموس' },
                                 { id: 'camels', label: 'إبل (جمال)' },
                               ].map(t => (
                                 <button
                                   key={t.id} onClick={() => setLivestockType(t.id)}
                                   className={`flex-1 p-4 border rounded-xl font-bold transition-all shadow-sm ${
                                     livestockType === t.id ? 'bg-amber-50 border-amber-500 text-amber-800 ring-2 ring-amber-100' : 'bg-white border-gray-200 text-gray-600'
                                   }`}
                                 >
                                   {t.label}
                                 </button>
                               ))}
                            </div>
                         </div>
                         <div>
                            <label className="block text-sm font-bold text-gray-600 mb-1">العدد الإجمالي (السائمة)</label>
                            <input 
                              type="number" value={livestockCount} onChange={(e) => setLivestockCount(e.target.value)}
                              placeholder="0" className="input-field text-2xl"
                            />
                            <p className="mt-2 text-sm text-gray-500 flex items-center gap-1">
                               <Info className="w-4 h-4" /> يشترط في الأنعام أن تكون "سائمة" (ترعى بنفسها أغلب العام).
                            </p>
                         </div>
                      </div>
                      <button onClick={computeLivestock} className="btn-primary w-full py-4 text-lg bg-amber-600 hover:bg-amber-700">
                        احسب الواجب في الأنعام
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
             </div>
          </div>

          {/* Results Sidebar */}
          <div className="lg:col-span-5 h-full">
             <div className="glass-card p-6 h-full border-t-8 border-t-gold-500 min-h-[400px]">
                <h3 className="text-2xl font-bold mb-6 text-gray-900 border-b pb-3">تفاصيل الحساب</h3>
                
                {!results ? (
                  <div className="flex flex-col items-center justify-center h-full opacity-30 py-20">
                     <Variable className="w-20 h-20 mb-4" />
                     <p className="text-lg font-bold">أدخل البيانات واضغط "احسب"</p>
                  </div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="space-y-6"
                   >
                     {results.type === 'monetary' && (
                       <div className="space-y-6">
                         <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                           <span className="text-gray-500 block text-sm font-bold">إجمالي المال الخاضع للزكاة:</span>
                           <span className="text-2xl font-bold text-gray-800">{results.totalWealth.toLocaleString()} {currency}</span>
                         </div>
                         
                         <div className={`p-4 rounded-xl border ${results.isEligible ? 'bg-emerald-50 border-emerald-200' : 'bg-red-50 border-red-200'}`}>
                            <div className="flex justify-between items-center mb-2">
                               <span className={`font-bold ${results.isEligible ? 'text-emerald-800' : 'text-red-800'}`}>
                                 {results.isEligible ? 'وصل للنصاب الشرعي' : 'لم يصل للنصاب'}
                               </span>
                               <span className="text-xs bg-white/50 px-2 py-1 rounded">نصاب الذهب: {results.nisabValue.toLocaleString()} {currency}</span>
                            </div>
                            {results.isEligible ? (
                              <div className="mt-4 pt-4 border-t border-emerald-200">
                                <span className="text-sm block text-emerald-600 font-bold mb-1">الزكاة الواجبة (2.5%):</span>
                                <span className="text-4xl font-bold text-emerald-700">{results.zakatAmount.toLocaleString()} {currency}</span>
                              </div>
                            ) : (
                              <p className="text-sm text-red-600 mt-2 italic">لا تجب الزكاة في هذا المبلغ لأنه أقل من قيمة نصاب 85 جرام ذهب.</p>
                            )}
                         </div>
                       </div>
                     )}

                     {results.type === 'livestock' && (
                       <div className="space-y-4">
                          <div className="bg-amber-50 p-6 rounded-2xl border border-amber-200 text-center">
                             <span className="text-amber-800 text-sm font-bold block mb-2">المقادير الواجب إخراجها:</span>
                             <div className="text-4xl font-bold text-amber-900 mb-2">{results.text}</div>
                             <p className="text-amber-700 font-bold">{results.details}</p>
                          </div>
                          <div className="p-4 bg-gray-50 rounded-xl text-sm leading-loose">
                             <p><strong>الشرط الشرعي:</strong> بلوغ النصاب (40 للغنم، 30 للبقر، 5 للإبل) وحولان الحول (مرور عام هجري) وأن تكون حيوانات سائمة.</p>
                          </div>
                       </div>
                     )}

                     {results.type === 'agri' && (
                       <div className="space-y-6">
                         <div className="bg-emerald-50 p-6 rounded-2xl border border-emerald-200 text-center">
                             {results.isEligible ? (
                               <>
                                 <span className="text-emerald-800 text-sm font-bold block mb-2">زكاة المحصول المستحقة ({results.rateText.split(' ')[0]}):</span>
                                 <div className="text-5xl font-bold text-emerald-900 mb-2">{results.amount.toLocaleString()}</div>
                                 <span className="text-xl font-bold text-emerald-700">كيلوجرام</span>
                               </>
                             ) : (
                               <div className="text-red-700 font-bold">المحصول لم يبلغ النصاب (5 أوسق / 653.9 كجم)</div>
                             )}
                         </div>
                         <div className="p-4 bg-gray-50 rounded-xl text-xs space-y-2">
                             <p>• {results.rateText}</p>
                             <p>• تجب الزكاة يوم الحصاد لقوله تعالى: "وآتوا حقه يوم حصاده".</p>
                         </div>
                       </div>
                     )}
                     
                     <button onClick={resetAll} className="w-full text-gray-500 hover:text-red-500 transition-colors text-sm font-bold flex items-center justify-center gap-2 mt-8">
                       إعادة الضبط وتصفير الخانات
                     </button>
                   </motion.div>
                )}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ZakatHub;
