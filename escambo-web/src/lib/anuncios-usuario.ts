import type { Anuncio } from "@/types/anuncio";

const STORAGE_KEY = "escambo_anuncios_usuario";

/** Um anúncio criado pelo formulário `/anunciar`, guardado com o id de quem publicou. */
interface AnuncioPersistido {
  autorId: string;
  anuncio: Anuncio;
}

/**
 * Persistência mock dos anúncios criados pelo próprio visitante — a pedido
 * do usuário, para que "Anunciar" deixe de ser 100% decorativo e o item
 * publicado realmente apareça em "Meus Anúncios" (`/perfil`) e tenha uma
 * página de detalhe (`/anuncios/[id]`) navegável.
 *
 * Guardado em `localStorage`, não num backend de verdade — é só um
 * protótipo: some se o usuário limpar os dados do navegador, e não é
 * compartilhado entre dispositivos/pessoas. Quando o backend real existir, a
 * troca fica isolada aqui e em `criarAnuncio` (`src/lib/api/anuncios.ts`).
 *
 * Todas as funções toleram rodar no servidor (`typeof window === "undefined"`)
 * devolvendo listas vazias — `getAnuncios`/`getAnuncioById` chamam isto tanto
 * do client quanto de Server Components, e no servidor não existe
 * `localStorage` (nem haveria como ler o do navegador de quem fez a
 * requisição).
 */
function lerTudo(): AnuncioPersistido[] {
  if (typeof window === "undefined") return [];
  try {
    const bruto = window.localStorage.getItem(STORAGE_KEY);
    if (!bruto) return [];
    const dados = JSON.parse(bruto);
    return Array.isArray(dados) ? (dados as AnuncioPersistido[]) : [];
  } catch {
    return [];
  }
}

function salvarTudo(lista: AnuncioPersistido[]) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(lista));
  } catch {
    // localStorage indisponível/cheio — o anúncio some ao recarregar, mas
    // não quebra o fluxo de publicação.
  }
}

/** Registra um novo anúncio publicado por `autorId` (o `usuario.id` de quem está logado). */
export function salvarAnuncioDoUsuario(autorId: string, anuncio: Anuncio) {
  const atual = lerTudo();
  salvarTudo([{ autorId, anuncio }, ...atual]);
}

/** Todos os anúncios persistidos, de qualquer autor — usado para completar a Vitrine/detalhe. */
export function listarTodosAnunciosPersistidos(): Anuncio[] {
  return lerTudo().map((item) => item.anuncio);
}

/** Só os anúncios publicados por este autor — usado em "Meus Anúncios" no Perfil. */
export function listarAnunciosDoUsuario(autorId: string): Anuncio[] {
  return lerTudo()
    .filter((item) => item.autorId === autorId)
    .map((item) => item.anuncio);
}

/** Busca um anúncio persistido pelo id — usado quando `getAnuncioById` não acha nos mocks fixos. */
export function buscarAnuncioPersistidoPorId(id: string): Anuncio | null {
  return lerTudo().find((item) => item.anuncio.id === id)?.anuncio ?? null;
}
