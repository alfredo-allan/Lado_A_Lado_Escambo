"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Flag, Loader2, RotateCcw, Sparkles, Star, Trash2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getAnunciosAdmin, getDenuncias } from "@/lib/api/admin";
import type { Anuncio } from "@/types/anuncio";
import type { Denuncia } from "@/types/denuncia";

const STATUS_LABEL: Record<Anuncio["status"], string> = {
  disponivel: "Disponível",
  em_negociacao: "Em Negociação",
  trocado: "Trocado",
};

const STATUS_VARIANT: Record<Anuncio["status"], "success" | "tertiary" | "neutral"> = {
  disponivel: "success",
  em_negociacao: "tertiary",
  trocado: "neutral",
};

/** Extensão só desta tela: marca de "removido pelo Admin", que não existe no tipo `Anuncio` real. */
type AnuncioModeracao = Anuncio & { removidoPeloAdmin: boolean };

/**
 * Moderar Anúncios (Admin — Etapa 4). Ações são só locais a esta tela — não
 * persistem em `MOCK_ANUNCIOS` de verdade nem em nenhum backend (mesmo
 * espírito de `criarAnuncio`/`criarUsuario`: mock, documentado, sem fingir
 * persistência que não existe). Sair da tela e voltar restaura o estado
 * original do mock.
 */
export default function AdminAnunciosPage() {
  const [anuncios, setAnuncios] = useState<AnuncioModeracao[] | null>(null);
  const [denuncias, setDenuncias] = useState<Denuncia[]>([]);
  const [aviso, setAviso] = useState<string | null>(null);

  useEffect(() => {
    getAnunciosAdmin().then((lista) => setAnuncios(lista.map((a) => ({ ...a, removidoPeloAdmin: false }))));
    getDenuncias().then(setDenuncias);
  }, []);

  const denunciasPorAnuncio = useMemo(() => {
    const contagem = new Map<string, number>();
    for (const denuncia of denuncias) {
      contagem.set(denuncia.anuncioId, (contagem.get(denuncia.anuncioId) ?? 0) + 1);
    }
    return contagem;
  }, [denuncias]);

  function mostrarAviso(mensagem: string) {
    setAviso(mensagem);
    setTimeout(() => setAviso(null), 2200);
  }

  function alternarDestaque(id: string) {
    setAnuncios((atual) =>
      (atual ?? []).map((a) => (a.id === id ? { ...a, destaque: !a.destaque } : a)),
    );
    const alvo = anuncios?.find((a) => a.id === id);
    mostrarAviso(alvo?.destaque ? "Destaque removido." : "Anúncio destacado na Vitrine.");
  }

  function alternarRemocao(id: string) {
    setAnuncios((atual) =>
      (atual ?? []).map((a) => (a.id === id ? { ...a, removidoPeloAdmin: !a.removidoPeloAdmin } : a)),
    );
    const alvo = anuncios?.find((a) => a.id === id);
    mostrarAviso(alvo?.removidoPeloAdmin ? "Anúncio restaurado." : "Anúncio removido da Vitrine.");
  }

  if (!anuncios) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <header>
        <h1 className="font-display text-xl font-bold text-foreground">Moderar Anúncios</h1>
        <p className="mt-1 text-sm text-muted-foreground">{anuncios.length} anúncio(s) na plataforma.</p>
      </header>

      <div className="flex flex-col gap-3">
        {anuncios.map((anuncio) => {
          const totalDenuncias = denunciasPorAnuncio.get(anuncio.id) ?? 0;
          return (
            <div
              key={anuncio.id}
              className={`flex flex-col gap-3 rounded-2xl bg-card p-4 shadow-card ${anuncio.removidoPeloAdmin ? "opacity-60" : ""}`}
            >
              <div className="flex items-center gap-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={anuncio.imagens[0]}
                  alt={anuncio.titulo}
                  className="size-14 shrink-0 rounded-xl object-cover"
                />
                <div className="min-w-0 flex-1">
                  <Link
                    href={`/anuncios/${anuncio.id}`}
                    className="truncate font-display text-sm font-bold text-foreground hover:underline"
                  >
                    {anuncio.titulo}
                  </Link>
                  <p className="mt-0.5 truncate text-xs text-muted-foreground">
                    {anuncio.localidade} • {anuncio.vendedor.nome}
                  </p>
                  <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                    <Badge variant={STATUS_VARIANT[anuncio.status]}>{STATUS_LABEL[anuncio.status]}</Badge>
                    {anuncio.destaque && (
                      <Badge variant="secondary">
                        <Sparkles className="size-3" />
                        Destaque
                      </Badge>
                    )}
                    {anuncio.removidoPeloAdmin && <Badge variant="outline">Removido</Badge>}
                    {totalDenuncias > 0 && (
                      <Link href="/admin/denuncias">
                        <Badge variant="warning">
                          <Flag className="size-3" />
                          {totalDenuncias} denúncia(s)
                        </Badge>
                      </Link>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => alternarDestaque(anuncio.id)}
                  disabled={anuncio.removidoPeloAdmin}
                >
                  <Star className={`size-4 ${anuncio.destaque ? "fill-secondary text-secondary" : ""}`} />
                  {anuncio.destaque ? "Remover destaque" : "Destacar"}
                </Button>
                <Button
                  variant={anuncio.removidoPeloAdmin ? "outline" : "destructive"}
                  size="sm"
                  className="flex-1"
                  onClick={() => alternarRemocao(anuncio.id)}
                >
                  {anuncio.removidoPeloAdmin ? (
                    <>
                      <RotateCcw className="size-4" />
                      Restaurar
                    </>
                  ) : (
                    <>
                      <Trash2 className="size-4" />
                      Remover
                    </>
                  )}
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      {aviso && (
        <div className="fixed left-1/2 top-20 z-50 -translate-x-1/2 rounded-full bg-inverse-surface px-4 py-2.5 text-inverse-on-surface shadow-lg">
          <span className="font-display text-sm font-bold">{aviso}</span>
        </div>
      )}
    </div>
  );
}
