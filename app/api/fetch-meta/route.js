import * as cheerio from "cheerio";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const url = searchParams.get("url");

  // ✅ CORS
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };

  if (!url) {
    return new Response(JSON.stringify({ success: false, error: "URL ausente." }), {
      status: 400,
      headers,
    });
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
      $("meta[name='price']").attr("content") ||
      "";

    return new Response(
      JSON.stringify({
        success: true,
        title: title.trim(),
        image,
        price,
      }),
      { status: 200, headers }
    );
  } catch (error) {
    console.error("Erro ao buscar:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: "Erro ao carregar metadados",
        details: error.message,
      }),
      { status: 500, headers }
    );
  }
}

// ✅ Para o método OPTIONS (pré-flight CORS)
export function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET,OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}
