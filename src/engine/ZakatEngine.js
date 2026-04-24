/**
 * ZakatEngine.js
 * Comprehensive logic for Zakat calculation according to Sunni jurisprudence.
 */

export const NISAB_GOLD = 85; // grams
export const NISAB_SILVER = 595; // grams
export const NISAB_GRAIN = 653.9; // kg (Approx 5 Wasq)

/**
 * Calculate Zakat for Monetary Assets
 */
export const calculateMonetaryZakat = (data) => {
  const {
    cash = 0,
    goldGrams = 0,
    silverGrams = 0,
    tradeValue = 0,
    goldPrice = 0,
    silverPrice = 0,
    debts = 0,
    nisabChoice = 'gold' // 'gold' or 'silver'
  } = data;

  const totalWealth = (parseFloat(cash) || 0) + 
                      ((parseFloat(goldGrams) || 0) * (parseFloat(goldPrice) || 0)) +
                      ((parseFloat(silverGrams) || 0) * (parseFloat(silverPrice) || 0)) +
                      (parseFloat(tradeValue) || 0) -
                      (parseFloat(debts) || 0);

  const nisabValue = nisabChoice === 'gold' 
    ? (parseFloat(goldPrice) || 0) * NISAB_GOLD 
    : (parseFloat(silverPrice) || 0) * NISAB_SILVER;

  const isEligible = totalWealth >= nisabValue;
  const zakatAmount = isEligible ? totalWealth * 0.025 : 0;

  return {
    totalWealth,
    nisabValue,
    isEligible,
    zakatAmount,
    rate: '2.5%'
  };
};

/**
 * Calculate Zakat for Livestock
 */
export const calculateLivestockZakat = (type, count) => {
  const n = parseInt(count) || 0;
  let result = { amount: 0, text: 'لا زكاة تجب (أقل من النصاب)', details: '' };

  if (type === 'camels') {
    if (n < 5) return result;
    if (n <= 9) return { amount: 1, text: 'شاة واحدة', details: 'من الغنم' };
    if (n <= 14) return { amount: 2, text: 'شاتان', details: 'من الغنم' };
    if (n <= 19) return { amount: 3, text: 'ثلاث شياه', details: 'من الغنم' };
    if (n <= 24) return { amount: 4, text: 'أربع شياه', details: 'من الغنم' };
    if (n <= 35) return { amount: 1, text: 'بنت مخاض', details: 'ناقة لها سنة' };
    if (n <= 45) return { amount: 1, text: 'بنت لبون', details: 'ناقة لها سنتان' };
    if (n <= 60) return { amount: 1, text: 'حقة', details: 'ناقة لها ثلاث سنوات' };
    if (n <= 75) return { amount: 1, text: 'جذعة', details: 'ناقة لها أربع سنوات' };
    if (n <= 90) return { amount: 2, text: 'بنتا لبون', details: 'ناقتان لكل منهما سنتان' };
    if (n <= 120) return { amount: 2, text: 'حقتان', details: 'ناقتان لكل منهما ثلاث سنوات' };
    const bintas = Math.floor(n / 40);
    const hiqqas = Math.floor(n / 50);
    return { amount: 0, text: 'تحسب لكل 40 بنت لبون ولكل 50 حقة', details: `الإجمالي التقريبي: ${bintas} بنت لبون أو ${hiqqas} حقة` };
  }

  if (type === 'cattle') {
    if (n < 30) return result;
    if (n <= 39) return { amount: 1, text: 'تبيع أو تبيعة', details: 'ما له سنة' };
    if (n <= 59) return { amount: 1, text: 'مسنة', details: 'ما لها سنتان' };
    if (n <= 69) return { amount: 2, text: 'تبيعان', details: '' };
    const tabis = Math.floor(n / 30);
    const musunns = Math.floor(n / 40);
    return { amount: 0, text: 'في كل 30 تبيع وفي كل 40 مسنة', details: `يمكن إخراج ${tabis} تبيع أو ${musunns} مسنة حسب العدد` };
  }

  if (type === 'sheep') {
    if (n < 40) return result;
    if (n <= 120) return { amount: 1, text: 'شاة واحدة', details: '' };
    if (n <= 200) return { amount: 2, text: 'شاتان', details: '' };
    if (n <= 399) return { amount: 3, text: 'ثلاث شياه', details: '' };
    return { amount: Math.floor(n / 100), text: `${Math.floor(n / 100)} شياه`, details: 'في كل مائة شاة' };
  }

  return result;
};

/**
 * Calculate Zakat for Agriculture
 */
export const calculateAgriZakat = (weight, method) => {
  const w = parseFloat(weight) || 0;
  if (w < NISAB_GRAIN) return { amount: 0, isEligible: false, text: 'أقل من النصاب (653.9 كجم)' };

  let rate = 0.1; // 10% defaults to rain-fed
  let rateText = '10% (سقي بماء المطر)';
  
  if (method === 'artificial') {
    rate = 0.05;
    rateText = '5% (سقي بوسائل اصطناعية)';
  } else if (method === 'mixed') {
    rate = 0.075;
    rateText = '7.5% (سقي مشترك)';
  }

  const amount = w * rate;
  return {
    amount,
    isEligible: true,
    rateText,
    totalWeight: w
  };
};
