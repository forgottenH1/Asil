(async () => {
    try {
        console.log("Testing Gregorian calendar adjustment=0...");
        const r0 = await (await fetch("https://api.aladhan.com/v1/calendarByAddress/2024/04?address=Makkah&method=4&adjustment=0")).json();
        // April 10, 2024
        const day10_0 = r0.data.find(d => d.date.gregorian.day === "10");
        console.log(`Adj 0: April 10 = Hijri ${day10_0.date.hijri.day} ${day10_0.date.hijri.month.en}`);

        console.log("Testing Gregorian calendar adjustment=-1...");
        const r1 = await (await fetch("https://api.aladhan.com/v1/calendarByAddress/2024/04?address=Makkah&method=4&adjustment=-1")).json();
        const day10_1 = r1.data.find(d => d.date.gregorian.day === "10");
        console.log(`Adj -1: April 10 = Hijri ${day10_1.date.hijri.day} ${day10_1.date.hijri.month.en}`);

    } catch(e) {
        console.error(e);
    }
})();
