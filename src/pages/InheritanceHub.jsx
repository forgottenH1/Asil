import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { Calculator, FileText, Plus, Minus, Info, ChevronDown, ChevronUp } from 'lucide-react';
import { calculateInheritance } from '../engine/InheritanceEngine';

const InfoCard = ({ title, value, onAdd, onMinus, maxVal = 99 }) => (
  <div className="glass-panel p-4 flex items-center justify-between">
    <span className="font-bold text-gray-700">{title}</span>
    <div className="flex items-center gap-3 bg-gray-50 rounded-full px-2 py-1 border border-gray-200">
      <button 
        onClick={onMinus}
        disabled={value === 0}
        className={`p-1 rounded-full ${value === 0 ? 'text-gray-300' : 'text-gray-600 hover:bg-gray-200'} transition-colors w-8 h-8 flex items-center justify-center`}
      >
        <Minus className="w-5 h-5"/>
      </button>
      <span className="font-bold text-xl w-6 text-center text-primary-dark">{value}</span>
      <button 
        onClick={onAdd}
        disabled={value >= maxVal}
        className={`p-1 rounded-full ${value >= maxVal ? 'text-gray-300' : 'text-gray-600 hover:bg-gray-200'} transition-colors w-8 h-8 flex items-center justify-center`}
      >
        <Plus className="w-5 h-5"/>
      </button>
    </div>
  </div>
);

const AccordionSection = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="mb-4 glass-panel border border-gray-100 rounded-xl overflow-hidden">
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className="w-full p-4 flex justify-between items-center bg-gray-50/50 hover:bg-primary/5 transition-colors"
      >
        <h3 className="text-lg font-bold text-gray-800">{title}</h3>
        {isOpen ? <ChevronUp className="w-5 h-5 text-primary" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="px-4 pb-4 pt-2 space-y-3"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const InheritanceHub = () => {
  const [deceased, setDeceased] = useState('male');
  const [estateMode, setEstateMode] = useState('percent'); // 'percent', 'currency', 'area'
  const [currency, setCurrency] = useState('MAD');
  const [totalEstate, setTotalEstate] = useState('');

  const initialState = {
    husband: 0, wife: 0,
    sons: 0, daughters: 0, grandsons: 0, granddaughters: 0,
    father: 0, mother: 0, paternalGrandfather: 0, paternalGrandmother: 0, maternalGrandmother: 0,
    fullBrothers: 0, fullSisters: 0, paternalBrothers: 0, paternalSisters: 0, maternalBrothers: 0, maternalSisters: 0,
    fullNephews: 0, paternalNephews: 0,
    fullUncles: 0, paternalUncles: 0, fullCousins: 0, paternalCousins: 0
  };

  const [heirs, setHeirs] = useState(initialState);
  const [results, setResults] = useState(null);

  const handleUpdate = (key, val, maxVal = 99) => {
    if (val < 0 || val > maxVal) return;
    setHeirs(prev => ({ ...prev, [key]: val }));
  };

  const compute = () => {
    const estateValue = estateMode === 'percent' ? 0 : (parseFloat(totalEstate) || 0);
    const calcOut = calculateInheritance(heirs, estateValue);
    setResults(calcOut);
  };

  const reset = () => {
    setHeirs(initialState);
    setTotalEstate('');
    setResults(null);
  };

  const getEstateSuffix = () => {
    if (estateMode === 'currency') return currency;
    if (estateMode === 'area') return 'متر مربع';
    return '';
  };

  return (
    <div className="py-12 min-h-screen">
      <Helmet>
        <title>أصيل | حاسبة المواريث المتقدمة</title>
      </Helmet>

      <div className="container mx-auto px-4 max-w-6xl">
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           className="text-center mb-12"
        >
          <div className="inline-flex items-center justify-center p-4 bg-emerald-100 rounded-full mb-4 text-emerald-600">
            <Calculator className="w-8 h-8" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">حاسبة المواريث المتقدمة (الفروض والعصبات)</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            أداة دقيقة تحسب المواريث وفقاً لأحكام الشريعة الإسلامية ومذاهب أهل السنة، تراعي قواعد الحجب (حرمان ونقصان) وأصحاب الفروض والعصبات بالبرمجة الدقيقة.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Inputs Section */}
          <div className="lg:col-span-6 space-y-6 flex flex-col">
            <div className="glass-card p-6 flex-grow">
              
              <h2 className="text-xl font-bold mb-4 text-gray-800 border-b pb-2">1. بيانات التركة والمورث</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-bold text-gray-600 mb-2">من هو المتوفى؟</label>
                  <select 
                    value={deceased}
                    onChange={(e) => {
                        const val = e.target.value;
                        setDeceased(val);
                        // Reset spouses if switching
                        if (val === 'male') setHeirs(p => ({...p, husband: 0}));
                        else if (val === 'female') setHeirs(p => ({...p, wife: 0}));
                        else setHeirs(p => ({...p, husband: 0, wife: 0}));
                    }}
                    className="input-field font-bold text-gray-700 cursor-pointer"
                  >
                    <option value="male">ذكر</option>
                    <option value="female">أنثى</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-600 mb-2">أسلوب حساب التركة</label>
                  <select 
                    value={estateMode}
                    onChange={(e) => setEstateMode(e.target.value)}
                    className="input-field font-bold text-gray-700 cursor-pointer"
                  >
                    <option value="percent">نسب وحصص فقط</option>
                    <option value="currency">مبلغ مالي (عملات)</option>
                    <option value="area">مساحة عقار (م²)</option>
                  </select>
                </div>
                
                {estateMode === 'currency' && (
                  <div className="md:col-span-2">
                    <label className="block text-sm font-bold text-gray-600 mb-2">نوع العملة</label>
                    <select 
                      value={currency}
                      onChange={(e) => setCurrency(e.target.value)}
                      className="input-field font-bold text-gray-700 cursor-pointer"
                    >
                      <option value="درهم مغربي">درهم مغربي (MAD)</option>
                      <option value="ريال سعودي">ريال سعودي (SAR)</option>
                      <option value="درهم إماراتي">درهم إماراتي (AED)</option>
                      <option value="دينار كويتي">دينار كويتي (KWD)</option>
                      <option value="جنيه مصري">جنيه مصري (EGP)</option>
                      <option value="ريال قطري">ريال قطري (QAR)</option>
                      <option value="ريال عماني">ريال عماني (OMR)</option>
                      <option value="دينار بحريني">دينار بحريني (BHD)</option>
                      <option value="دولار أمريكي">دولار أمريكي (USD)</option>
                      <option value="يورو">يورو (EUR)</option>
                    </select>
                  </div>
                )}
              </div>

              {estateMode !== 'percent' && (
                <div className="mb-8">
                  <input 
                    type="number"
                    value={totalEstate}
                    onChange={(e) => setTotalEstate(e.target.value)}
                    placeholder={`أدخل المقدار (${getEstateSuffix()})`}
                    className="input-field text-xl"
                    min="0"
                  />
                </div>
              )}

              <h2 className="text-xl font-bold mb-4 mt-8 text-gray-800 border-b pb-2">2. الورثة الشريعيون</h2>
              
              {/* Spouses */}
              {(deceased === 'male' || deceased === 'female') && (
                <AccordionSection title="الزوجية">
                   {deceased === 'female' && (
                     <InfoCard title="الزوج" value={heirs.husband} maxVal={1} onAdd={() => handleUpdate('husband', heirs.husband + 1, 1)} onMinus={() => handleUpdate('husband', heirs.husband - 1)} />
                   )}
                   {deceased === 'male' && (
                     <InfoCard title="الزوجات" value={heirs.wife} maxVal={4} onAdd={() => handleUpdate('wife', heirs.wife + 1, 4)} onMinus={() => handleUpdate('wife', heirs.wife - 1)} />
                   )}
                </AccordionSection>
              )}

               {/* Descendants */}
              <AccordionSection title="الفروع (الأبناء والحفدة)">
                 <InfoCard title="الابن" value={heirs.sons} onAdd={() => handleUpdate('sons', heirs.sons + 1)} onMinus={() => handleUpdate('sons', heirs.sons - 1)} />
                 <InfoCard title="البنت" value={heirs.daughters} onAdd={() => handleUpdate('daughters', heirs.daughters + 1)} onMinus={() => handleUpdate('daughters', heirs.daughters - 1)} />
                 <InfoCard title="ابن الابن" value={heirs.grandsons} onAdd={() => handleUpdate('grandsons', heirs.grandsons + 1)} onMinus={() => handleUpdate('grandsons', heirs.grandsons - 1)} />
                 <InfoCard title="بنت الابن" value={heirs.granddaughters} onAdd={() => handleUpdate('granddaughters', heirs.granddaughters + 1)} onMinus={() => handleUpdate('granddaughters', heirs.granddaughters - 1)} />
              </AccordionSection>

              {/* Ascendants */}
              <AccordionSection title="الأصول (الآباء والأجداد)">
                 <InfoCard title="الأب" value={heirs.father} maxVal={1} onAdd={() => handleUpdate('father', heirs.father + 1, 1)} onMinus={() => handleUpdate('father', heirs.father - 1)} />
                 <InfoCard title="الأم" value={heirs.mother} maxVal={1} onAdd={() => handleUpdate('mother', heirs.mother + 1, 1)} onMinus={() => handleUpdate('mother', heirs.mother - 1)} />
                 <InfoCard title="أب الأب (الجد)" value={heirs.paternalGrandfather} maxVal={1} onAdd={() => handleUpdate('paternalGrandfather', heirs.paternalGrandfather + 1, 1)} onMinus={() => handleUpdate('paternalGrandfather', heirs.paternalGrandfather - 1)} />
                 <InfoCard title="أم الأب (جدة لأب)" value={heirs.paternalGrandmother} maxVal={1} onAdd={() => handleUpdate('paternalGrandmother', heirs.paternalGrandmother + 1, 1)} onMinus={() => handleUpdate('paternalGrandmother', heirs.paternalGrandmother - 1)} />
                 <InfoCard title="أم الأم (جدة لأم)" value={heirs.maternalGrandmother} maxVal={1} onAdd={() => handleUpdate('maternalGrandmother', heirs.maternalGrandmother + 1, 1)} onMinus={() => handleUpdate('maternalGrandmother', heirs.maternalGrandmother - 1)} />
              </AccordionSection>

              {/* Siblings */}
              <AccordionSection title="الحواشي (الإخوة والأخوات)">
                 <InfoCard title="الأخ الشقيق" value={heirs.fullBrothers} onAdd={() => handleUpdate('fullBrothers', heirs.fullBrothers + 1)} onMinus={() => handleUpdate('fullBrothers', heirs.fullBrothers - 1)} />
                 <InfoCard title="الأخت الشقيقة" value={heirs.fullSisters} onAdd={() => handleUpdate('fullSisters', heirs.fullSisters + 1)} onMinus={() => handleUpdate('fullSisters', heirs.fullSisters - 1)} />
                 <InfoCard title="الأخ لأب" value={heirs.paternalBrothers} onAdd={() => handleUpdate('paternalBrothers', heirs.paternalBrothers + 1)} onMinus={() => handleUpdate('paternalBrothers', heirs.paternalBrothers - 1)} />
                 <InfoCard title="الأخت لأب" value={heirs.paternalSisters} onAdd={() => handleUpdate('paternalSisters', heirs.paternalSisters + 1)} onMinus={() => handleUpdate('paternalSisters', heirs.paternalSisters - 1)} />
                 <InfoCard title="الأخ لأم" value={heirs.maternalBrothers} onAdd={() => handleUpdate('maternalBrothers', heirs.maternalBrothers + 1)} onMinus={() => handleUpdate('maternalBrothers', heirs.maternalBrothers - 1)} />
                 <InfoCard title="الأخت لأم" value={heirs.maternalSisters} onAdd={() => handleUpdate('maternalSisters', heirs.maternalSisters + 1)} onMinus={() => handleUpdate('maternalSisters', heirs.maternalSisters - 1)} />
              </AccordionSection>

              {/* Extended Family */}
              <AccordionSection title="الأعمام وبنو الإخوة">
                 <InfoCard title="ابن الأخ الشقيق" value={heirs.fullNephews} onAdd={() => handleUpdate('fullNephews', heirs.fullNephews + 1)} onMinus={() => handleUpdate('fullNephews', heirs.fullNephews - 1)} />
                 <InfoCard title="ابن الأخ لأب" value={heirs.paternalNephews} onAdd={() => handleUpdate('paternalNephews', heirs.paternalNephews + 1)} onMinus={() => handleUpdate('paternalNephews', heirs.paternalNephews - 1)} />
                 <InfoCard title="العم الشقيق" value={heirs.fullUncles} onAdd={() => handleUpdate('fullUncles', heirs.fullUncles + 1)} onMinus={() => handleUpdate('fullUncles', heirs.fullUncles - 1)} />
                 <InfoCard title="العم لأب" value={heirs.paternalUncles} onAdd={() => handleUpdate('paternalUncles', heirs.paternalUncles + 1)} onMinus={() => handleUpdate('paternalUncles', heirs.paternalUncles - 1)} />
                 <InfoCard title="ابن العم الشقيق" value={heirs.fullCousins} onAdd={() => handleUpdate('fullCousins', heirs.fullCousins + 1)} onMinus={() => handleUpdate('fullCousins', heirs.fullCousins - 1)} />
                 <InfoCard title="ابن العم لأب" value={heirs.paternalCousins} onAdd={() => handleUpdate('paternalCousins', heirs.paternalCousins + 1)} onMinus={() => handleUpdate('paternalCousins', heirs.paternalCousins - 1)} />
              </AccordionSection>

              <div className="mt-8 flex gap-4 sticky bottom-4 z-10 glass-panel p-4 shadow-xl border-t border-primary/20">
                <button onClick={compute} className="btn-primary flex-1 flex justify-center items-center gap-2 text-lg">
                  <Calculator className="w-6 h-6"/> إحسب القسمة الشرعية
                </button>
                <button onClick={reset} className="btn-secondary w-full max-w-[120px]">
                  تصفير
                </button>
              </div>
            </div>
          </div>

          {/* Results Section */}
          <div className="lg:col-span-6 relative">
             <div className="glass-card p-6 min-h-full sticky top-24 border-t-8 border-t-primary">
                <h2 className="text-2xl font-bold mb-6 text-primary flex items-center gap-2">
                  <FileText className="w-6 h-6" /> نتيجة القسمة والاستحقاق
                </h2>
                
                {!results ? (
                  <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                    <Calculator className="w-16 h-16 mb-4 opacity-30" />
                    <p className="text-lg">حدد الورثة ثم اضغط على إحسب القسمة لعرض النتائج هنا</p>
                  </div>
                ) : (
                  <AnimatePresence mode="wait">
                    <motion.div 
                      key={Date.now()}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="space-y-6"
                    >
                      {results.isAwl && (
                        <div className="bg-amber-50 border border-amber-200 text-amber-800 p-4 rounded-xl flex gap-3">
                          <Info className="w-6 h-6 flex-shrink-0 text-amber-600"/>
                          <div>
                            <span className="font-bold block text-lg mb-1">ملاحظة تأصيلية (العول):</span>
                            السهام الموزعة تجاوزت التركة (الأساس القطعي 1)، فتم تطبيق قاعدة "العول" مما أدى لتقليل نسب جميع الورثة بالتساوي للحفاظ على العدل.
                          </div>
                        </div>
                      )}

                      {results.results.length === 0 ? (
                        <div className="bg-red-50 text-red-600 p-6 rounded-xl text-center border border-red-100">
                          <p className="text-lg font-bold">لم يتم العثور على ورثة أو تم حجبهم بالكامل.</p>
                        </div>
                      ) : (
                        <div className="space-y-4 max-h-[800px] overflow-y-auto pr-2 custom-scrollbar">
                          {results.results.map((res, idx) => (
                            <div key={idx} className="bg-white border text-right border-gray-200 shadow-sm rounded-xl p-5 hover:border-primary/50 transition-colors">
                              <div className="flex justify-between items-center mb-3">
                                <span className="text-xl font-bold text-gray-900 border-r-4 border-primary pr-3">{res.heir}</span>
                                <div className="text-left bg-gray-50 px-4 py-2 rounded-lg border border-gray-100">
                                   <span className="text-xl font-bold text-primary block">{res.percentage}</span>
                                   <span className="text-sm text-gray-500 font-sans mt-1">المستحق: {res.fraction}</span>
                                </div>
                              </div>
                              
                              {estateMode !== 'percent' && res.amount > 0 && (
                                <div className="bg-emerald-50 rounded-lg p-3 my-4 flex items-center justify-between border border-emerald-100">
                                  <span className="text-sm text-emerald-800 font-bold">نصيب الوارث:</span>
                                  <div className="font-sans text-xl font-bold text-emerald-700">
                                    {res.amount} <span className="text-sm font-arabic font-normal">{getEstateSuffix()}</span>
                                  </div>
                                </div>
                              )}

                              <div className="mt-4 pt-3 border-t border-gray-100">
                                <span className="inline-flex items-center gap-1 bg-gray-100 text-gray-600 text-xs font-bold px-2 py-1 rounded mb-2">الدليل والاستنباط الشرعي</span>
                                <div className="text-md text-gray-700 bg-gray-50 rounded-lg p-4 font-arabic leading-relaxed border border-gray-200 shadow-inner">
                                  {res.proof.includes('(') ? res.proof : `«${res.proof}»`}
                                </div>
                              </div>
                            </div>
                          ))}

                          {results.leftover > 0 && (
                            <div className="bg-blue-50 border border-blue-200 text-blue-800 p-4 rounded-xl mt-4">
                              <span className="font-bold block">ملاحظة هامة (رد أو إيقاف):</span>
                              تبقى جزء من التركة ({ (results.leftover * 100).toFixed(2) }%) ولم يستغرقها أصحاب الفروض ولم يوجد من العصبات من يستوعبها. يلزم تطبيق مسألة "الرد" على أصحاب الفروض (غير الزوجين) أو توريث "ذوي الأرحام".
                            </div>
                          )}
                        </div>
                      )}
                    </motion.div>
                  </AnimatePresence>
                )}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InheritanceHub;
