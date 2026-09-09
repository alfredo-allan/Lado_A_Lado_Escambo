import { getMensagensMock } from "@/lib/mock/mensagens";
import type { Mensagem } from "@/types/mensagem";
import { simulateLatency } from "./config";

/**
 * Busca as mensagens da conversa de negociação ligada a um anúncio
 * (Etapa 4 — chat/propostas). Vira `GET /anuncios/{id}/mensagens` no
 * backend Python (com WebSocket/polling por cima para tempo real) — ver
 * `src/lib/mock/mensagens.ts` para os dados mock e `src/types/mensagem.ts`
 * para o formato.
 */
export async function getMensagens(anuncioId: string): Promise<Mensagem[]> {
  await simulateLatency();
  return getMensagensMock(anuncioId);
}

/**
 * Envia uma nova mensagem (texto livre ou proposta formal) na conversa.
 * Vira `POST /anuncios/{id}/mensagens` no backend. Mock: não persiste nada,
 * só devolve a mensagem já "enviada" para a UI atualizar otimisticamente.
 */
export async function enviarMensagem(
  anuncioId: string,
  texto: string,
  proposta?: Mensagem["proposta"],
): Promise<Mensagem> {
  await simulateLatency(300);
  return {
    id: `${anuncioId}_local_${Date.now()}`,
    autor: "eu",
    texto,
    enviadoEm: new Intl.DateTimeFormat("pt-BR", { hour: "2-digit", minute: "2-digit" }).format(new Date()),
    proposta,
  };
}
