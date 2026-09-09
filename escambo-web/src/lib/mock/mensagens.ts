import type { Mensagem } from "@/types/mensagem";

/**
 * Conversas mockadas, uma por `anuncioId`. Simula uma negociação já em
 * andamento para dar contexto real à tela de chat (`/anuncios/[id]/conversa`)
 * — ver `src/lib/api/mensagens.ts` para o ponto de troca por dados reais.
 */
export const MOCK_MENSAGENS: Record<string, Mensagem[]> = {
  "bicicleta-aro29-sao-paulo": [
    { id: "m1", autor: "eu", texto: "Oi! A bicicleta ainda está disponível?", enviadoEm: "09:12" },
    { id: "m2", autor: "vendedor", texto: "Oi! Está sim, ainda não fechei com ninguém 🙂", enviadoEm: "09:20" },
    {
      id: "m3",
      autor: "eu",
      texto: "Show! Tenho um smartphone em bom estado, topa avaliar?",
      enviadoEm: "09:22",
      proposta: { itemOferecido: "Smartphone em bom estado (tela sem trincos, com carregador)" },
    },
    { id: "m4", autor: "vendedor", texto: "Pode mandar fotos do celular? Se estiver como você descreveu, topo sim.", enviadoEm: "09:31" },
  ],
  "furadeira-profissional-porto-alegre": [
    { id: "m1", autor: "eu", texto: "Bom dia! A furadeira acompanha a maleta mesmo?", enviadoEm: "14:02" },
    { id: "m2", autor: "vendedor", texto: "Acompanha sim, com o kit de brocas completo.", enviadoEm: "14:10" },
  ],
  "sofa-rack-feira-de-santana": [
    { id: "m1", autor: "vendedor", texto: "Oi! Vi que você se interessou pelo sofá + rack, ainda quer negociar?", enviadoEm: "18:45" },
    {
      id: "m2",
      autor: "eu",
      texto: "Quero! Posso oferecer meu guarda-roupa de 6 portas, mais uma volta em dinheiro se precisar.",
      enviadoEm: "19:03",
      proposta: { itemOferecido: "Guarda-roupa 6 portas com espelho", voltaEmDinheiro: "R$ 150" },
    },
  ],
};

export function getMensagensMock(anuncioId: string): Mensagem[] {
  return MOCK_MENSAGENS[anuncioId] ?? [];
}
