import express from "express";
import puppeteer from "puppeteer";

const app = express();
const PORT = process.env.PORT || 3000;

app.get("/posts", async (req, res) => {
  try {
    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"]
    });

    const page = await browser.newPage();

    // Открываем топ-ленту Threads
    await page.goto("https://www.threads.com/", { waitUntil: "networkidle2", timeout: 60000 });

    await page.waitForTimeout(5000); // ждём прогрузку постов

    const posts = await page.evaluate(() => {
      // Берём тексты постов, фильтруем пустые, берём первые 30
      const nodes = document.querySelectorAll("span");
      return Array.from(nodes)
        .map(n => n.innerText)
        .filter(Boolean)
        .slice(0, 30);
    });

    await browser.close();

    res.json({ posts });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Scraping failed" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
