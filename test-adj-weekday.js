(async () => {
    try {
        console.log("Testing adjustment=0...");
        const r0 = await (await fetch("https://api.aladhan.com/v1/hijriCalendarByAddress?address=Makkah&method=4&month=10&year=1445&adjustment=0")).json();
        const firstDay0 = r0.data[0].date.hijri.day;
        const firstWeekDay0 = r0.data[0].date.hijri.weekday.en;
        const firstGreg0 = r0.data[0].date.gregorian.date;
        console.log(`Adj 0: Hijri 1 = ${firstWeekDay0} (Greg: ${firstGreg0})`);

        console.log("Testing adjustment=1...");
        const r1 = await (await fetch("https://api.aladhan.com/v1/hijriCalendarByAddress?address=Makkah&method=4&month=10&year=1445&adjustment=1")).json();
        const firstDay1 = r1.data[0].date.hijri.day;
        const firstWeekDay1 = r1.data[0].date.hijri.weekday.en;
        const firstGreg1 = r1.data[0].date.gregorian.date;
        console.log(`Adj 1: Hijri 1 = ${firstWeekDay1} (Greg: ${firstGreg1})`);

    } catch(e) {
        console.error(e);
    }
})();
