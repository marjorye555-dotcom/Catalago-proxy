import fetch from "node-fetch";
import * as cheerio from "cheerio";

export default async function handler(req, res) {
  const url = req.query.url;

  // Permitir requisições do catálogo
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (!url) {
    return res.status(400).json({ success: false, error: "URL ausente." });
  }

  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0 Safari/537.36",
      },
    });

    const html = await response.text();
    const $ = cheerio.load(html);

    const title =
      $('meta[property="og:title"]').attr("content") ||
      $("title").text() ||
      "Produto sem título";

    const image =
      $('meta[property="og:image"]').attr("content") ||
      $('meta[name="twitter:image"]').attr("content") ||
      "https://via.placeholder.com/300x200?text=Imagem+Indisponível";

    const price =
      $('meta[property="product:price:amount"]').attr("content") ||
      $('meta[itemprop="price"]').attr("content") ||
      $("meta[name=price]").attr("content") ||
      "";

    return res.status(200).json({
      success: true,
      title: title.trim(),
      image,
      price,
    });
  } catch (error) {
    console.error("Erro ao buscar:", error);
    return res.status(500).json({
      success: false,
      error: "Erro ao carregar metadados",
      details: error.message,
    });
  }
}
