"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { CheckCircle2, Loader2, MessageCircle, Megaphone, RotateCcw, XCircle } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getAnunciosAdmin, getDenuncias } from "@/lib/api/admin";
import type { Anuncio } from "@/types/anuncio";
import type { Denuncia, StatusDenuncia } from "@/types/denuncia";

const STATUS_LABEL: Record<StatusDenuncia, string> = {
  pendente: "Pendente",
  resolvida: "Resolvida",
  dispensada: "Dispensada",
};

const STATUS_VARIANT: Record<StatusDenuncia, "warning" | "success" | "neutral"> = {
  pendente: "warning",
  resolvida: "success",
  dispensada: "neutral",
};

const FILTROS: { valor: StatusDenuncia | "todas"; label: string }[] = [
  { valor: "pendente", label: "Pendentes" },
  { valor: "resolvida", label: "Resolvidas" },
  { valor: "dispensada", label: "Dispensadas" },
  { valor: "todas", label: "Todas" },
];

function formatarData(iso: string) {
  return new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" }).format(
    new Date(iso),
  );
}

/**
 * Central de Denúncias (Admin — Etapa 4). Fila mock (`getDenuncias`), com
 * ações Resolver/Dispensar/Reabrir alterando só o estado local desta tela
 * (mesmo padrão de Moderar Anúncios / Gerenciar Usuários — ver
 * `src/lib/api/admin.ts`).
 */
export default function AdminDenunciasPage() {
  const [denuncias, setDenuncias] = useState<Denuncia[] | null>(null);
  const [anuncios, setAnuncios] = useState<Anuncio[]>([]);
  const [filtro, setFiltro] = useState<StatusDenuncia | "todas">("pendente");
  const [aviso, setAviso] = useState<string | null>(null);

  useEffect(() => {
    getDenuncias().then(setDenuncias);
    getAnunciosAdmin().then(setAnuncios);
  }, []);

  const anuncioPorId = useMemo(() => new Map(anuncios.map((a) => [a.id, a])), [anuncios]);

  function mostrarAviso(mensagem: string) {
    setAviso(mensagem);
    setTimeout(() => setAviso(null), 2200);
  }

  function atualizarStatus(id: string, status: StatusDenuncia) {
    setDenuncias((atual) => (atual ?? []).map((d) => (d.id === id ? { ...d, status } : d)));
    mostrarAviso(
      status === "resolvida" ? "Denúncia marcada como resolvida." : status === "dispensada" ? "Denúncia dispensada." : "Denúncia reaberta.",
    );
  }

  if (!denuncias) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const listaFiltrada = filtro === "todas" ? denuncias : denuncias.filter((d) => d.status === filtro);

  return (
    <div className="flex flex-col gap-4">
      <header>
        <h1 className="font-display text-xl font-bold text-foreground">Central de Denúncias</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {denuncias.filter((d) => d.status === "pendente").length} denúncia(s) aguardando análise.
        </p>
      </header>

      <div className="flex gap-1.5 overflow-x-auto pb-1">
        {FILTROS.map((item) => (
          <button
            key={item.valor}
            type="button"
            onClick={() => setFiltro(item.valor)}
            className={`shrink-0 rounded-full px-3.5 py-2 font-display text-xs font-bold transition-colors ${
              filtro === item.valor ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-accent"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {listaFiltrada.length === 0 ? (
        <div className="flex flex-col items-center gap-2 rounded-2xl border border-dashed border-border py-10 text-center">
          <CheckCircle2 className="size-8 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">Nenhuma denúncia nesse filtro.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {listaFiltrada.map((denuncia) => {
            const anuncio = anuncioPorId.get(denuncia.anuncioId);
            const Icon = denuncia.tipo === "anuncio" ? Megaphone : MessageCircle;
            return (
              <div key={denuncia.id} className="flex flex-col gap-3 rounded-2xl bg-card p-4 shadow-card">
                <div className="flex items-start gap-3">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-warning/20 text-foreground">
                    <Icon className="size-4.5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <Badge variant={STATUS_VARIANT[denuncia.status]}>{STATUS_LABEL[denuncia.status]}</Badge>
                      <span className="text-xs text-muted-foreground">
                        {denuncia.tipo === "anuncio" ? "Anúncio" : "Conversa"} • {formatarData(denuncia.criadoEm)}
                      </span>
                    </div>
                    <p className="mt-1.5 text-sm text-foreground/90">{denuncia.motivo}</p>
                    {anuncio && (
                      <Link
                        href={`/anuncios/${anuncio.id}`}
                        className="mt-1 inline-block truncate text-xs font-bold text-primary hover:underline"
                      >
                        {anuncio.titulo}
                      </Link>
                    )}
                    <p className="mt-0.5 text-xs text-muted-foreground">Denunciado por {denuncia.denunciadoPor}</p>
                  </div>
                </div>

                {denuncia.status === "pendente" ? (
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => atualizarStatus(denuncia.id, "dispensada")}
                    >
                      <XCircle className="size-4" />
                      Dispensar
                    </Button>
                    <Button size="sm" className="flex-1" onClick={() => atualizarStatus(denuncia.id, "resolvida")}>
                      <CheckCircle2 className="size-4" />
                      Resolver
                    </Button>
                  </div>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => atualizarStatus(denuncia.id, "pendente")}
                  >
                    <RotateCcw className="size-4" />
                    Reabrir
                  </Button>
                )}
              </div>
            );
          })}
        </div>
      )}

      {aviso && (
        <div className="fixed left-1/2 top-20 z-50 -translate-x-1/2 rounded-full bg-inverse-surface px-4 py-2.5 text-inverse-on-surface shadow-lg">
          <span className="font-display text-sm font-bold">{aviso}</span>
        </div>
      )}
    </div>
  );
}
