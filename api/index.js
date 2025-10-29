import express from "express";
import cors from "cors";
import fetch from "node-fetch";
import * as cheerio from "cheerio";

const app = express();
app.use(cors());

// 🔹 Rota padrão para testar se o servidor está ativo
app.get("/", (req, res) => {
  res.json({ ok: true, message: "Servidor proxy ativo" });
});

// 🔹 Rota para buscar metadados
app.get("/api/fetch-meta", async (req, res) => {
  const { url } = req.query;
  if (!url) return res.status(400).json({ error: "URL não informada." });

  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121 Safari/537.36",
      },
    });

    const html = await response.text();
    const $ = cheerio.load(html);

    const title =
      $('meta[property="og:title"]').attr("content") ||
      $("title").text() ||
      "";
    const image =
      $('meta[property="og:image"]').attr("content") ||
      $('meta[name="twitter:image"]').attr("content") ||
      "";
    const price =
      $('meta[property="product:price:amount"]').attr("content") ||
      $('meta[property="og:price:amount"]').attr("content") ||
      $('meta[name="twitter:data1"]').attr("content") ||
      "";

    res.status(200).json({
      success: true,
      title: title.trim(),
      image: image.trim(),
      price: price.trim(),
    });
  } catch (err) {
    res.status(500).json({ error: "Falha ao buscar metadados." });
  }
});

export default app;

