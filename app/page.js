export default function Home() {
  return (
    <main style={{ padding: "40px", fontFamily: "sans-serif" }}>
      <h1>Catálogo Proxy</h1>
      <p>
        API pública para buscar metadados (título, imagem e preço) de links de produtos.
      </p>

      <pre style={{ background: "#f4f4f4", padding: "12px", borderRadius: "6px" }}>
        GET /api/fetch-meta?url=https://go.hotmart.com/SEULINKAQUI
      </pre>

      <p>Retorna um JSON com:</p>
      <code>{`{ success, title, image, price }`}</code>
    </main>
  );
}
