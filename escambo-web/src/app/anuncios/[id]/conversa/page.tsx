import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getAnuncioById } from "@/lib/api/anuncios";
import { getMensagens } from "@/lib/api/mensagens";
import { ConversaAnuncio } from "./conversa";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const anuncio = await getAnuncioById(id);
  return { title: anuncio ? `Conversa com ${anuncio.vendedor.nome}` : "Anúncio não encontrado" };
}

/**
 * Conversa simulada de negociação (Etapa 4 — chat/propostas). Mesmo padrão de
 * componente servidor + cliente de `anuncios/[id]/page.tsx`: busca os dados
 * aqui (anúncio + histórico mock de mensagens) e passa prontos para o cliente
 * renderizar e simular o envio de novas mensagens.
 */
export default async function ConversaPage({ params }: PageProps) {
  const { id } = await params;
  const anuncio = await getAnuncioById(id);

  if (!anuncio) {
    notFound();
  }

  const mensagens = await getMensagens(id);

  return <ConversaAnuncio anuncio={anuncio} mensagensIniciais={mensagens} />;
}
