(async () => {
    try {
        console.log("Testing adjustment=0...");
        const r0 = await (await fetch("https://api.aladhan.com/v1/hijriCalendarByAddress?address=Makkah&method=4&month=10&year=1445&adjustment=0")).json();
        const firstDay0 = r0.data[0].date.hijri.day;
        const lastDay0 = r0.data[r0.data.length - 1].date.hijri.day;
        console.log(`Adj 0: First day=${firstDay0}, Last day=${lastDay0}, Length=${r0.data.length}`);

        console.log("Testing adjustment=1...");
        const r1 = await (await fetch("https://api.aladhan.com/v1/hijriCalendarByAddress?address=Makkah&method=4&month=10&year=1445&adjustment=1")).json();
        const firstDay1 = r1.data[0].date.hijri.day;
        const lastDay1 = r1.data[r1.data.length - 1].date.hijri.day;
        console.log(`Adj 1: First day=${firstDay1}, Last day=${lastDay1}, Length=${r1.data.length}`);

        console.log("Testing adjustment=-1...");
        const rM1 = await (await fetch("https://api.aladhan.com/v1/hijriCalendarByAddress?address=Makkah&method=4&month=10&year=1445&adjustment=-1")).json();
        const firstDayM1 = rM1.data[0].date.hijri.day;
        const lastDayM1 = rM1.data[rM1.data.length - 1].date.hijri.day;
        console.log(`Adj -1: First day=${firstDayM1}, Last day=${lastDayM1}, Length=${rM1.data.length}`);

    } catch(e) {
        console.error(e);
    }
})();
