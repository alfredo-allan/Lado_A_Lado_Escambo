import type { Denuncia } from "@/types/denuncia";

/** Fila mock da Central de Denúncias do Admin (Etapa 4). */
export const MOCK_DENUNCIAS: Denuncia[] = [
  {
    id: "den_1",
    tipo: "anuncio",
    motivo: "Fotos do anúncio não correspondem ao produto recebido em negociações anteriores.",
    anuncioId: "sofa-rack-feira-de-santana",
    denunciadoPor: "Camila Fernandes",
    criadoEm: "2026-09-06T14:20:00.000Z",
    status: "pendente",
  },
  {
    id: "den_2",
    tipo: "conversa",
    motivo: "Comportamento agressivo e ofensas durante a negociação pelo chat.",
    anuncioId: "bicicleta-aro29-sao-paulo",
    denunciadoPor: "João Pedro Alves",
    criadoEm: "2026-09-07T09:05:00.000Z",
    status: "pendente",
  },
  {
    id: "den_3",
    tipo: "anuncio",
    motivo: "Suspeita de golpe — vendedor pediu pagamento antecipado fora da plataforma.",
    anuncioId: "furadeira-profissional-porto-alegre",
    denunciadoPor: "Ana Beatriz Souza",
    criadoEm: "2026-08-28T18:40:00.000Z",
    status: "resolvida",
  },
  {
    id: "den_4",
    tipo: "conversa",
    motivo: "Linguagem ofensiva trocada durante a conversa sobre a proposta.",
    anuncioId: "sofa-rack-feira-de-santana",
    denunciadoPor: "Márcia Oliveira",
    criadoEm: "2026-08-22T11:15:00.000Z",
    status: "dispensada",
  },
];
