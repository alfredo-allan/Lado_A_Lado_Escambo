/**
 * Denúncia registrada por um usuário (Central de Denúncias do Admin).
 * Pode mirar um anúncio (`"anuncio"`) ou um comportamento dentro de uma
 * conversa (`"conversa"`) — os dois únicos lugares onde outro usuário pode
 * hoje ser reportado na plataforma.
 */
export type TipoDenuncia = "anuncio" | "conversa";

export type StatusDenuncia = "pendente" | "resolvida" | "dispensada";

export interface Denuncia {
  id: string;
  tipo: TipoDenuncia;
  motivo: string;
  /** Id do anúncio relacionado — presente nos dois tipos (a conversa também é ligada a um anúncio). */
  anuncioId: string;
  /** Nome de quem denunciou, só para exibição (mock — no backend real seria um id de usuário). */
  denunciadoPor: string;
  /** ISO 8601 */
  criadoEm: string;
  status: StatusDenuncia;
}
