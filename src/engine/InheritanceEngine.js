/**
 * InheritanceEngine.js
 * A fully comprehensive Islamic Inheritance (Fara'id) Engine supporting typical Sunni legal heirs.
 */

const FRACTION_NAMES = {
  '1/2': 'النصف',
  '1/3': 'الثلث',
  '1/4': 'الربع',
  '1/6': 'السدس',
  '1/8': 'الثمن',
  '2/3': 'الثلثان'
};

const formatHeirFraction = (f) => {
  if (FRACTION_NAMES[f]) return `${FRACTION_NAMES[f]} (${f})`;
  
  for (const [ratio, name] of Object.entries(FRACTION_NAMES)) {
    if (f.startsWith(ratio)) {
      return f.replace(ratio, `${name} (${ratio})`);
    }
  }
  return f;
};

export const calculateInheritance = (heirs, totalEstate = 0) => {
  // Deep copy the heirs state to mutably apply Hajb
  let h = { ...heirs };
  const results = [];
  let remainingFraction = 1.0;

  // 1. HAJB (Full Exclusion Phase)
  // ----------------------------------------------------
  
  // Descendants exclusion
  if (h.sons > 0) {
    h.grandsons = 0;
    h.granddaughters = 0;
  }
  if (h.daughters > 1 && h.grandsons === 0) {
    // Two daughters exclude granddaughters unless there is a grandson to make them Asabah
    h.granddaughters = 0;
  }

  // Ascendants exclusion
  if (h.father > 0) {
    h.paternalGrandfather = 0;
    h.paternalGrandmother = 0;
  }
  if (h.mother > 0) {
    h.paternalGrandmother = 0;
    h.maternalGrandmother = 0;
  }

  // Define broad categories
  const hasFarWarithM = h.sons > 0 || h.grandsons > 0;
  const hasFarWarithF = h.daughters > 0 || h.granddaughters > 0;
  const hasFarWarith = hasFarWarithM || hasFarWarithF;
  const hasAslWarithM = h.father > 0 || h.paternalGrandfather > 0;

  // Hawashi (Siblings) exclusion
  if (hasFarWarithM || hasAslWarithM) {
    // Son, Grandson, Father, Grandfather block ALL siblings
    h.fullBrothers = 0;
    h.fullSisters = 0;
    h.paternalBrothers = 0;
    h.paternalSisters = 0;
    h.maternalBrothers = 0;
    h.maternalSisters = 0;
  }
  if (hasFarWarithF || h.paternalGrandfather > 0) {
     // Maternal Siblings are blocked by ANY Far' Warith or ANY Asl Warith Male
     h.maternalBrothers = 0;
     h.maternalSisters = 0;
  }

  if (h.fullBrothers > 0 || (h.fullSisters > 0 && hasFarWarithF)) {
    // Full Brother (or Full Sister acting as Asabah Ma'a Al-Ghayr) blocks Paternal Siblings
    h.paternalBrothers = 0;
    h.paternalSisters = 0;
  }

  if (h.fullSisters > 1 && h.paternalBrothers === 0) {
     // Two full sisters block paternal sisters unless there is a paternal brother
     h.paternalSisters = 0;
  }

  // Extended Family Exclusion (Nephews, Uncles, Cousins)
  const isAnyBrotherSisterPresent = 
    h.fullBrothers > 0 || h.fullSisters > 0 || 
    h.paternalBrothers > 0 || h.paternalSisters > 0;

  if (hasFarWarithM || hasAslWarithM || isAnyBrotherSisterPresent || (h.fullSisters > 0 && hasFarWarithF)) {
    h.fullNephews = 0;
    h.paternalNephews = 0;
    h.fullUncles = 0;
    h.paternalUncles = 0;
    h.fullCousins = 0;
    h.paternalCousins = 0;
  } else {
    // Stepwise exclusion among extended males
    if (h.fullNephews > 0) { h.paternalNephews = h.fullUncles = h.paternalUncles = h.fullCousins = h.paternalCousins = 0; }
    else if (h.paternalNephews > 0) { h.fullUncles = h.paternalUncles = h.fullCousins = h.paternalCousins = 0; }
    else if (h.fullUncles > 0) { h.paternalUncles = h.fullCousins = h.paternalCousins = 0; }
    else if (h.paternalUncles > 0) { h.fullCousins = h.paternalCousins = 0; }
    else if (h.fullCousins > 0) { h.paternalCousins = 0; }
  }


  // Helper function to assign Furoodh
  const assignShare = (name, count, fraction, totalShare, proofText, type = 'fard') => {
    if (count <= 0 || totalShare <= 0) return;
    remainingFraction -= totalShare;
    const perShare = totalShare / count;
    for (let i = 1; i <= count; i++) {
        results.push({
            heir: count === 1 ? name : `${name} ${i}`,
            fraction: formatHeirFraction(fraction),
            share: perShare,
            proof: proofText,
            type: type
        });
    }
  };


  // 2. FUROODH (Fixed Shares Phase)
  // ----------------------------------------------------

  // Spouses
  if (h.husband > 0) {
    const share = hasFarWarith ? 1/4 : 1/2;
    assignShare('الزوج', 1, hasFarWarith ? '1/4' : '1/2', share, 'ولكم نصف ما ترك أزواجكم إن لم يكن لهن ولد فإن كان لهن ولد فلكم الربع...');
  }
  if (h.wife > 0) {
    const share = hasFarWarith ? 1/8 : 1/4;
    assignShare('الزوجة', h.wife, hasFarWarith ? '1/8' : '1/4', share, 'ولهن الربع مما تركتم إن لم يكن لكم ولد فإن كان لكم ولد فلهن الثمن...');
  }

  // Mother & Grandmothers
  let totalSiblings = h.fullBrothers + h.fullSisters + h.paternalBrothers + h.paternalSisters + h.maternalBrothers + h.maternalSisters;
  if (h.mother > 0) {
    const share = (hasFarWarith || totalSiblings > 1) ? 1/6 : 1/3; // Gharrawayn omitted for standardized simplicity
    assignShare('الأم', 1, share === 1/6 ? '1/6' : '1/3', share, share === 1/6 ? 'فإن كان له إخوة فلأمه السدس...' : 'فإن لم يكن له ولد وورثه أبواه فلأمه الثلث...');
  } else {
    // Grandmothers share 1/6
    const gCount = (h.paternalGrandmother > 0 ? 1 : 0) + (h.maternalGrandmother > 0 ? 1 : 0);
    if (gCount > 0) {
       assignShare('الجدة', gCount, '1/6', 1/6, 'السنة النبوية بإعطاء الجدة السدس');
    }
  }

  // Father & Grandfather
  if (h.father > 0) {
    if (hasFarWarithM) {
      assignShare('الأب', 1, '1/6', 1/6, 'ولأبويه لكل واحد منهما السدس مما ترك إن كان له ولد...');
    } else if (hasFarWarithF) {
      assignShare('الأب', 1, '1/6 + الباقي تعصيباً', 1/6, 'ولأبويه لكل واحد منهما السدس...', 'fard_and_asabah');
    } else {
      // Entirely Asabah, processed later
    }
  } else if (h.paternalGrandfather > 0) {
    if (hasFarWarithM) {
      assignShare('الجد', 1, '1/6', 1/6, 'ينزل منزل الأب عند فقده');
    } else if (hasFarWarithF) {
      assignShare('الجد', 1, '1/6 + الباقي تعصيباً', 1/6, 'ينزل منزل الأب عند فقده', 'fard_and_asabah');
    }
  }

  // Daughters
  if (h.daughters > 0 && h.sons === 0) {
    const share = h.daughters === 1 ? 1/2 : 2/3;
    assignShare('البنت', h.daughters, h.daughters === 1 ? '1/2' : '2/3', share, h.daughters === 1 ? 'وإن كانت واحدة فلها النصف...' : 'فإن كن نساء فوق اثنتين فلهن ثلثا ما ترك...');
  }
  
  // Granddaughters (Daughters of Son)
  if (h.granddaughters > 0 && h.grandsons === 0 && h.sons === 0) {
    if (h.daughters === 0) {
       const share = h.granddaughters === 1 ? 1/2 : 2/3;
       assignShare('بنت الابن', h.granddaughters, h.granddaughters === 1 ? '1/2' : '2/3', share, 'بنت الابن تنزل منزلة البنت');
    } else if (h.daughters === 1) {
       assignShare('بنت الابن', h.granddaughters, '1/6 تكملة الثلثين', 1/6, 'لبنت الابن السدس تكملة للثلثين مع البنت الصلبية');
    }
  }

  // Full Sisters
  if (h.fullSisters > 0 && h.fullBrothers === 0 && !hasFarWarithF) {
     const share = h.fullSisters === 1 ? 1/2 : 2/3;
     assignShare('الأخت الشقيقة', h.fullSisters, h.fullSisters === 1 ? '1/2' : '2/3', share, h.fullSisters === 1 ? 'يستفتونك قل الله يفتيكم في الكلالة... فلها نصف ما ترك' : 'فإن كانتا اثنتين فلهما الثلثان مما ترك');
  }

  // Paternal Sisters
  if (h.paternalSisters > 0 && h.paternalBrothers === 0 && h.fullBrothers === 0 && !hasFarWarithF) {
     if (h.fullSisters === 0) {
       const share = h.paternalSisters === 1 ? 1/2 : 2/3;
       assignShare('الأخت لأب', h.paternalSisters, h.paternalSisters === 1 ? '1/2' : '2/3', share, 'الأخت لأب منزلة الأخت الشقيقة عند عدمها');
     } else if (h.fullSisters === 1) {
       assignShare('الأخت لأب', h.paternalSisters, '1/6 تكملة الثلثين', 1/6, 'للأخت لأب السدس تكملة الثلثين مع الأخت الشقيقة');
     }
  }

  // Maternal Siblings (Brothers and Sisters are equal)
  const matCount = h.maternalBrothers + h.maternalSisters;
  if (matCount > 0) {
    const share = matCount === 1 ? 1/6 : 1/3;
    assignShare('الأخ/الأخت لأم', matCount, matCount === 1 ? '1/6' : '1/3', share, 'وإن كان رجل يورث كلالة أو امرأة وله أخ أو أخت فلكل واحد منهما السدس فإن كانوا أكثر من ذلك فهم شركاء في الثلث');
  }


  // 3. ASABAT (Residuary Phase)
  // ----------------------------------------------------
  // Evaluate precedence for the remaining fraction
  
  const collectAsabah = (males, female, femaleName, maleName, proof) => {
    if (males === 0 && female === 0) return false;
    if (males > 0) {
        const totalHeads = (males * 2) + female;
        const unit = remainingFraction / totalHeads;
        if (female > 0) assignShare(femaleName, female, 'تعصيباً (للذكر مثل حظ الأنثيين)', unit * female, proof, 'asabah');
        assignShare(maleName, males, 'تعصيباً', unit * 2 * males, proof, 'asabah');
        remainingFraction = 0;
        return true;
    } else if (female > 0) {
        // Technically, only males can be pure Asabah if not covered by Ta'seeb Bil-Ghayr.
        // Except for Sisters acting as Asabah Ma'a Al-Ghayr with Daughters
        if ((femaleName === 'الأخت الشقيقة' || femaleName === 'الأخت لأب') && hasFarWarithF) {
            assignShare(femaleName, female, 'عصبة مع الغير', remainingFraction, 'الأخوات مع البنات عصبات', 'asabah');
            remainingFraction = 0;
            return true;
        }
    }
    return false;
  };

  if (remainingFraction > 0.0001) {
     let asabahFound = false;

     // 1. Descendants
     if (!asabahFound) asabahFound = collectAsabah(h.sons, h.daughters, 'البنت', 'الابن', 'يوصيكم الله في أولادكم للذكر مثل حظ الأنثيين');
     if (!asabahFound) asabahFound = collectAsabah(h.grandsons, h.granddaughters, 'بنت الابن', 'ابن الابن', 'ينزلون منزلة الأبناء للذكر مثل حظ الأنثيين');

     // 2. Ascendants
     if (!asabahFound && h.father > 0) {
         const fardFather = results.find(r => r.heir === 'الأب' && r.type === 'fard_and_asabah');
         if (fardFather) fardFather.share += remainingFraction;
         else assignShare('الأب', 1, 'الباقي تعصيباً', remainingFraction, 'الأب عصبة بنفسه', 'asabah');
         remainingFraction = 0;
         asabahFound = true;
     }
     if (!asabahFound && h.paternalGrandfather > 0) {
         const fardGrandpa = results.find(r => r.heir === 'الجد' && r.type === 'fard_and_asabah');
         if (fardGrandpa) fardGrandpa.share += remainingFraction;
         else assignShare('الجد', 1, 'الباقي تعصيباً', remainingFraction, 'الجد عصبة بنفسه كالأب', 'asabah');
         remainingFraction = 0;
         asabahFound = true;
     }

     // 3. Siblings
     if (!asabahFound) asabahFound = collectAsabah(h.fullBrothers, h.fullSisters, 'الأخت الشقيقة', 'الأخ الشقيق', 'وإن كانوا إخوة رجالا ونساء فللذكر مثل حظ الأنثيين');
     if (!asabahFound) asabahFound = collectAsabah(h.paternalBrothers, h.paternalSisters, 'الأخت لأب', 'الأخ لأب', 'للذكر مثل حظ الأنثيين');
     
     // 4. Extended Males (Pure Asabah, no females here)
     if (!asabahFound && h.fullNephews > 0) { assignShare('ابن الأخ الشقيق', h.fullNephews, 'الباقي تعصيباً', remainingFraction, 'أولى رجل ذكر', 'asabah'); asabahFound = true; }
     if (!asabahFound && h.paternalNephews > 0) { assignShare('ابن الأخ لأب', h.paternalNephews, 'الباقي تعصيباً', remainingFraction, 'أولى رجل ذكر', 'asabah'); asabahFound = true; }
     if (!asabahFound && h.fullUncles > 0) { assignShare('العم الشقيق', h.fullUncles, 'الباقي تعصيباً', remainingFraction, 'أولى رجل ذكر', 'asabah'); asabahFound = true; }
     if (!asabahFound && h.paternalUncles > 0) { assignShare('العم لأب', h.paternalUncles, 'الباقي تعصيباً', remainingFraction, 'أولى رجل ذكر', 'asabah'); asabahFound = true; }
     if (!asabahFound && h.fullCousins > 0) { assignShare('ابن العم الشقيق', h.fullCousins, 'الباقي تعصيباً', remainingFraction, 'أولى رجل ذكر', 'asabah'); asabahFound = true; }
     if (!asabahFound && h.paternalCousins > 0) { assignShare('ابن العم لأب', h.paternalCousins, 'الباقي تعصيباً', remainingFraction, 'أولى رجل ذكر', 'asabah'); asabahFound = true; }
  }


  // 4. NORMALIZATION (Awl Handling & Finalization)
  // ----------------------------------------------------
  const totalAllocated = results.reduce((sum, r) => sum + r.share, 0);
  
  if (totalAllocated > 1.0001) {
    // AWL (العول): the denominator increases to sum of numerators, proportionally shrinking shares
    results.forEach(r => {
      r.share = r.share / totalAllocated;
      r.awlApplied = true;
    });
  }

  // Formatting numerical values based on totalEstate
  results.forEach(r => {
    r.percentage = (r.share * 100).toFixed(2) + '%';
    // Clean up small math fractions
    r.amount = totalEstate > 0 ? (r.share * totalEstate).toFixed(3).replace(/\.?0+$/, '') : 0;
  });

  return {
    results,
    isAwl: totalAllocated > 1.0001,
    leftover: remainingFraction > 0.0001 && totalAllocated <= 1.0001 && totalEstate > 0 ? remainingFraction : 0
  };
};
