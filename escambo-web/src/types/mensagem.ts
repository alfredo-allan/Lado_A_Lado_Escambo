/**
 * Modelo de mensagem de uma conversa de negociação (Etapa 4 — chat/propostas).
 * Mantido simples de propósito: uma conversa hoje é sempre 1:1, ligada a um
 * único `anuncioId`. Quando o backend real existir, isso vira
 * `GET /anuncios/{id}/mensagens` + WebSocket/polling para tempo real.
 */
export interface Mensagem {
  id: string;
  /** "eu" = usuário atual; "vendedor" = dono do anúncio. */
  autor: "eu" | "vendedor";
  texto: string;
  /** Hora pré-formatada (ex.: "14:32") — formatação é responsabilidade do backend/serializer. */
  enviadoEm: string;
  /** Presente quando a mensagem inclui uma oferta formal de item + possível volta em dinheiro. */
  proposta?: {
    itemOferecido: string;
    voltaEmDinheiro?: string;
  };
}
