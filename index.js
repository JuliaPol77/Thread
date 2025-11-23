const express = require('express');
const puppeteer = require('puppeteer');

const app = express();
const port = process.env.PORT || 3000;

app.get('/test', async (req, res) => {
    try {
        const browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        const page = await browser.newPage();
        await page.goto('https://threads.net/');
        const title = await page.title();
        await browser.close();
        res.json({ status: 'ok', title });
    } catch (err) {
        res.json({ status: 'error', message: err.message });
    }
});

app.listen(port, () => console.log(`Server running on port ${port}`));
