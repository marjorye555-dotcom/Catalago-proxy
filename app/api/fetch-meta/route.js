import * as cheerio from "cheerio";
import fetch from "node-fetch";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get("url");

  if (!url) {
    return Response.json({ error: "URL não informada." }, { status: 400 });
  }

  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121 Safari/537.36"
      }
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

    return Response.json({
      success: true,
      title: title.trim(),
      image: image.trim(),
      price: price.trim()
    });
  } catch (err) {
    console.error("Erro ao buscar metadados:", err.message);
    return Response.json({ error: "Falha ao buscar metadados." }, { status: 500 });
  }
}
