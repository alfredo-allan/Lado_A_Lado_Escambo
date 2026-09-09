"use client";

import { useEffect, useState } from "react";
import { notFound } from "next/navigation";
import { Loader2 } from "lucide-react";

import { buscarAnuncioPersistidoPorId } from "@/lib/anuncios-usuario";
import type { Anuncio } from "@/types/anuncio";
import { AnuncioDetalhe } from "./anuncio-detalhe";

type Estado = "carregando" | "naoEncontrado" | Anuncio;

/**
 * Fallback para quando `/anuncios/[id]/page.tsx` (Server Component) não
 * encontra o id em `MOCK_ANUNCIOS` — pode ser um anúncio publicado pelo
 * próprio visitante via `/anunciar`, que só existe no `localStorage` do
 * navegador (ver `src/lib/anuncios-usuario.ts`). O servidor não tem acesso a
 * esse `localStorage`, então a checagem só pode acontecer aqui, no client,
 * depois de montar.
 *
 * Começa sempre em `"carregando"` (idêntico no server e no client, evita
 * mismatch de hidratação) e só decide entre mostrar o anúncio ou chamar
 * `notFound()` depois que o efeito roda — chamar `notFound()` direto no
 * primeiro render (inclusive o SSR) daria 404 sempre, mesmo quando o
 * anúncio existe no navegador de quem está vendo.
 */
export function AnuncioLocalOuNaoEncontrado({ id }: { id: string }) {
  const [estado, setEstado] = useState<Estado>("carregando");

  useEffect(() => {
    const anuncio = buscarAnuncioPersistidoPorId(id);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setEstado(anuncio ?? "naoEncontrado");
  }, [id]);

  if (estado === "carregando") {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (estado === "naoEncontrado") {
    notFound();
  }

  return <AnuncioDetalhe anuncio={estado} />;
}
