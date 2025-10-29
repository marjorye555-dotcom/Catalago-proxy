# Catálogo Proxy (Next.js 15)

API serverless para extrair informações de produtos (título, imagem, preço)
a partir de qualquer link público, como Hotmart, Shopee, Mercado Livre, etc.

## Exemplo de uso

```
GET /api/fetch-meta?url=https://go.hotmart.com/SEULINKAQUI
```

### Retorno:
```json
{
  "success": true,
  "title": "Nome do produto",
  "image": "https://imagem.com/produto.jpg",
  "price": "199.90"
}
```

## Deploy
O projeto é totalmente compatível com a **Vercel**.
