import { MOCK_ANUNCIOS } from "@/lib/mock/anuncios";
import { buscarAnuncioPersistidoPorId, listarTodosAnunciosPersistidos, salvarAnuncioDoUsuario } from "@/lib/anuncios-usuario";
import type { Anuncio, CategoriaAnuncio } from "@/types/anuncio";
import type { UF, Usuario } from "@/types/usuario";
import { simulateLatency } from "./config";

export interface GetAnunciosParams {
  categoria?: CategoriaAnuncio;
  busca?: string;
}

/**
 * Lista anúncios da Vitrine de Trocas (Etapa 3): os fixos em `MOCK_ANUNCIOS`
 * mais os que o próprio visitante publicou nesta sessão/navegador via
 * `criarAnuncio` (ver `src/lib/anuncios-usuario.ts`). Assinatura já pensada
 * para virar `GET /anuncios?categoria=&busca=` no backend Python sem mudar
 * quem chama esta função.
 */
export async function getAnuncios(params: GetAnunciosParams = {}): Promise<Anuncio[]> {
  await simulateLatency();

  let resultado = [...MOCK_ANUNCIOS, ...listarTodosAnunciosPersistidos()];
  if (params.categoria) {
    resultado = resultado.filter((anuncio) => anuncio.categoria === params.categoria);
  }
  if (params.busca) {
    const termo = params.busca.toLowerCase();
    resultado = resultado.filter((anuncio) => anuncio.titulo.toLowerCase().includes(termo));
  }
  return resultado;
}

/**
 * Busca o detalhe de um único anúncio pelo id, primeiro em `MOCK_ANUNCIOS`
 * e depois nos anúncios publicados localmente pelo visitante.
 * Vira `GET /anuncios/{id}` no backend — devolve `null` quando não encontrado,
 * igual a um 404 tratado.
 *
 * Chamada tanto de Server Components (ex.: `/anuncios/[id]/page.tsx`, no
 * carregamento inicial da página) quanto do client — no servidor não existe
 * `localStorage`, então um anúncio publicado só localmente por um visitante
 * nunca é achado aqui durante o render no servidor; ver
 * `src/app/anuncios/[id]/anuncio-local.tsx` para o fallback que resolve isso
 * no client depois da hidratação.
 */
export async function getAnuncioById(id: string): Promise<Anuncio | null> {
  await simulateLatency();
  return MOCK_ANUNCIOS.find((anuncio) => anuncio.id === id) ?? buscarAnuncioPersistidoPorId(id);
}

/** Payload do formulário "Anunciar" (Etapa 4 — postagem de item para troca). */
export interface CriarAnuncioInput {
  titulo: string;
  categoriaLabel: string;
  condicao: string;
  descricao: string;
  aceitaTroca: string;
  aceitaVoltaDinheiro: boolean;
  valorVoltaSugerido?: string;
  estado: UF;
  municipio: string;
  /** Fotos já convertidas para data URL pelo client (ver `src/app/anunciar/page.tsx`) — a primeira é a capa. */
  imagens: string[];
  /** Quem está publicando — vira o `vendedor` do anúncio e o dono em "Meus Anúncios". */
  autor: Usuario;
}

export interface CriarAnuncioResultado {
  ok: true;
  anuncioId: string;
}

/**
 * Publica um novo anúncio. Vira `POST /anuncios` no backend Python — incluindo
 * o upload real das fotos para um storage de verdade (hoje as fotos viram
 * data URLs e vão para o `localStorage`, ver `src/lib/anuncios-usuario.ts` —
 * funciona para o protótipo, mas não é como upload de imagem deve funcionar
 * em produção). Mock: não escreve em `MOCK_ANUNCIOS` (array estático em
 * memória), mas persiste de verdade no `localStorage` do navegador — por
 * isso o anúncio publicado realmente aparece depois em "Meus Anúncios" e no
 * detalhe, ao contrário da versão anterior desta função (que só fingia
 * sucesso sem guardar nada).
 */
export async function criarAnuncio(input: CriarAnuncioInput): Promise<CriarAnuncioResultado> {
  await simulateLatency(700);

  const slug = input.titulo
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
  const anuncioId = `${slug || "anuncio"}-${Date.now()}`;

  const opcoesTroca = [{ titulo: "O que o vendedor aceita em troca", descricao: input.aceitaTroca }];
  if (input.aceitaVoltaDinheiro) {
    opcoesTroca.push({
      titulo: "Aceita volta em dinheiro",
      descricao: input.valorVoltaSugerido?.trim() ? `Sugestão: ${input.valorVoltaSugerido}` : "Valor a combinar",
    });
  }

  const anuncio: Anuncio = {
    id: anuncioId,
    titulo: input.titulo,
    categoria: "variados",
    categoriaLabel: input.categoriaLabel,
    status: "disponivel",
    imagens: input.imagens.length > 0 ? input.imagens : ["https://picsum.photos/seed/" + anuncioId + "/1200/900"],
    localidade: `${input.municipio}, ${input.estado}`,
    publicadoHa: "poucos minutos",
    descricaoCurta: input.aceitaTroca,
    descricaoLonga: input.descricao,
    opcoesTroca,
    balanca: input.aceitaVoltaDinheiro ? "aceita_volta" : "flexivel",
    atributos: [input.condicao],
    vendedor: {
      id: input.autor.id,
      nome: input.autor.nome,
      iniciais: input.autor.nome
        .split(" ")
        .slice(0, 2)
        .map((parte) => parte[0])
        .join(""),
      verificado: input.autor.verificado,
      nota: input.autor.reputacao.nota,
      trocasConcluidas: input.autor.reputacao.trocasConcluidas,
      naComunidadeDesde: new Intl.DateTimeFormat("pt-BR", { month: "long", year: "numeric" }).format(
        new Date(input.autor.criadoEm),
      ),
      percentualEntregas: 100,
    },
  };

  salvarAnuncioDoUsuario(input.autor.id, anuncio);

  return { ok: true, anuncioId };
}
