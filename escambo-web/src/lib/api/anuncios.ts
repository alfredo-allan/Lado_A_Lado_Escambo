import { MOCK_ANUNCIOS } from "@/lib/mock/anuncios";
import type { Anuncio, CategoriaAnuncio } from "@/types/anuncio";
import { simulateLatency } from "./config";

export interface GetAnunciosParams {
  categoria?: CategoriaAnuncio;
  busca?: string;
}

/**
 * Lista anúncios da Vitrine de Trocas (Etapa 3).
 * Assinatura já pensada para virar `GET /anuncios?categoria=&busca=` no
 * backend Python sem mudar quem chama esta função.
 */
export async function getAnuncios(params: GetAnunciosParams = {}): Promise<Anuncio[]> {
  await simulateLatency();

  let resultado = MOCK_ANUNCIOS;
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
 * Busca o detalhe de um único anúncio pelo id.
 * Vira `GET /anuncios/{id}` no backend — devolve `null` quando não encontrado,
 * igual a um 404 tratado.
 */
export async function getAnuncioById(id: string): Promise<Anuncio | null> {
  await simulateLatency();
  return MOCK_ANUNCIOS.find((anuncio) => anuncio.id === id) ?? null;
}
