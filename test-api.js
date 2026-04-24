(async () => {
    try {
        const r1 = await fetch("http://api.aladhan.com/v1/hijriCalendar?latitude=21.4225&longitude=39.8262&method=4&month=10&year=1445");
        const json1 = await r1.json();
        console.log("hijriCalendar response isArray:", Array.isArray(json1.data));
        console.log("hijriCalendar data length:", json1.data ? json1.data.length : 'undefined');

        const r2 = await fetch("http://api.aladhan.com/v1/hijriCalendarByAddress?address=Makkah&method=4&month=10&year=1445");
        const json2 = await r2.json();
        console.log("hijriCalendarByAddress response isArray:", Array.isArray(json2.data));
        console.log("hijriCalendarByAddress data length:", json2.data ? json2.data.length : 'undefined');

    } catch(e) {
        console.error(e);
    }
})();
