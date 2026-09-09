/**
 * Modelos de anúncio (Vitrine de Trocas — Etapa 3), já usados pela tela de
 * Detalhe do Anúncio. Mantidos deliberadamente "achatados" (strings
 * pré-formatadas como `publicadoHa`, `naComunidadeDesde`) porque essa
 * formatação deve ser responsabilidade do backend/serializer, não da UI.
 */

export type CategoriaAnuncio = "animais" | "carrocas_selas" | "maquinas_motores" | "variados";

export type StatusAnuncio = "disponivel" | "em_negociacao" | "trocado";

/** Indicador visual da "Balança de Troca" (DESIGN.md > Componente 5). */
export type BalancaTroca = "equivalente" | "flexivel" | "aceita_volta";

export interface OpcaoTroca {
  titulo: string;
  descricao: string;
}

export interface Vendedor {
  id: string;
  nome: string;
  iniciais: string;
  fotoUrl?: string;
  verificado: boolean;
  nota: number;
  trocasConcluidas: number;
  naComunidadeDesde: string;
  percentualEntregas: number;
}

export interface FichaAnimal {
  idade: string;
  temperamento: string;
  raca: string;
  documento: string;
}

export interface Anuncio {
  id: string;
  titulo: string;
  categoria: CategoriaAnuncio;
  categoriaLabel: string;
  status: StatusAnuncio;
  /** URLs das fotos. Na mock são placeholders; no backend virão do upload do anunciante. */
  imagens: string[];
  localidade: string;
  distanciaKm?: number;
  publicadoHa: string;
  descricaoCurta: string;
  descricaoLonga: string;
  motivoTroca?: string;
  opcoesTroca: OpcaoTroca[];
  balanca: BalancaTroca;
  atributos: string[];
  vendedor: Vendedor;
  /** Presente apenas para anúncios de animais. */
  fichaAnimal?: FichaAnimal;
  /** Destaque manual dado pelo Admin (Moderação de Anúncios) — não vem do anunciante. */
  destaque?: boolean;
}
