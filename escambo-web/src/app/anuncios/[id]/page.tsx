import type { Metadata } from "next";

import { getAnuncioById } from "@/lib/api/anuncios";
import { AnuncioDetalhe } from "./anuncio-detalhe";
import { AnuncioLocalOuNaoEncontrado } from "./anuncio-local";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const anuncio = await getAnuncioById(id);
  // Sem título específico quando não acha no servidor: pode ainda ser um
  // anúncio publicado localmente (ver `anuncio-local.tsx`), que o servidor
  // não enxerga.
  return { title: anuncio ? anuncio.titulo : "Anúncio" };
}

/**
 * Detalhe do Anúncio (Etapa 3). Busca via `getAnuncioById` — hoje mock,
 * amanhã `GET /anuncios/{id}` — ver `src/lib/api/anuncios.ts`. Quando não
 * encontra (não está em `MOCK_ANUNCIOS`), não assume 404 direto: pode ser um
 * anúncio publicado pelo próprio visitante, guardado só no `localStorage` do
 * navegador dele — `AnuncioLocalOuNaoEncontrado` confere isso no client e só
 * aí decide entre mostrar o anúncio ou o 404 de verdade.
 */
export default async function AnuncioPage({ params }: PageProps) {
  const { id } = await params;
  const anuncio = await getAnuncioById(id);

  if (!anuncio) {
    return <AnuncioLocalOuNaoEncontrado id={id} />;
  }

  return <AnuncioDetalhe anuncio={anuncio} />;
}
