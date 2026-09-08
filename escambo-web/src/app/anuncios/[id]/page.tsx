import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getAnuncioById } from "@/lib/api/anuncios";
import { AnuncioDetalhe } from "./anuncio-detalhe";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const anuncio = await getAnuncioById(id);
  return { title: anuncio ? anuncio.titulo : "Anúncio não encontrado" };
}

/**
 * Detalhe do Anúncio (Etapa 3). Busca via `getAnuncioById` — hoje mock,
 * amanhã `GET /anuncios/{id}` — ver `src/lib/api/anuncios.ts`.
 */
export default async function AnuncioPage({ params }: PageProps) {
  const { id } = await params;
  const anuncio = await getAnuncioById(id);

  if (!anuncio) {
    notFound();
  }

  return <AnuncioDetalhe anuncio={anuncio} />;
}
