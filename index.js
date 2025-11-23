import express from "express";
import puppeteer from "puppeteer";

const app = express();
const PORT = process.env.PORT || 3000;

app.get("/posts", async (req, res) => {
  const keyword = req.query.q || "тест";

  try {
    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"]
    });

    const page = await browser.newPage();
    await page.goto(
      `https://www.threads.net/search?q=${encodeURIComponent(keyword)}`,
      { waitUntil: "networkidle2", timeout: 60000 }
    );

    // Ждем прогрузки постов
    await page.waitForTimeout(5000);

    const posts = await page.evaluate(() => {
      const nodes = document.querySelectorAll("span");
      return Array.from(nodes)
        .map(n => n.innerText)
        .filter(Boolean)
        .slice(0, 30); // максимум 30 постов
    });

    await browser.close();

    res.json({ keyword, posts });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Scraping failed" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
