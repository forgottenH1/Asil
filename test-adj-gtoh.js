(async () => {
    try {
        const date = "21-04-2024";
        console.log(`Testing gToH for ${date} with adjustment=0...`);
        const r0 = await (await fetch(`https://api.aladhan.com/v1/gregorianToHijri/${date}?adjustment=0`)).json();
        console.log(`Adj 0: ${r0.data.hijri.day} ${r0.data.hijri.month.en}`);

        console.log(`Testing gToH for ${date} with adjustment=1...`);
        const r1 = await (await fetch(`https://api.aladhan.com/v1/gregorianToHijri/${date}?adjustment=1`)).json();
        console.log(`Adj 1: ${r1.data.hijri.day} ${r1.data.hijri.month.en}`);

    } catch(e) {
        console.error(e);
    }
})();
