"use client";

import { useEffect, useState } from "react";
import { Ban, CheckCircle2, ShieldCheck, ShieldOff, Star, UserCog } from "lucide-react";

import { AvisoToast } from "@/components/ui/aviso-toast";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AdminListSkeleton } from "@/components/skeletons/admin-skeletons";
import { getUsuariosAdmin } from "@/lib/api/admin";
import type { Usuario } from "@/types/usuario";

/**
 * Gerenciar Usuários (Admin — Etapa 4). Como em Moderar Anúncios, as ações
 * (verificar, suspender) só alteram o estado local desta tela — não
 * persistem (ver comentário em `src/lib/api/admin.ts`). Contas de
 * Administrador não têm ações de moderação aqui (não faz sentido suspender
 * a própria equipe por esta tela).
 */
export default function AdminUsuariosPage() {
  const [usuarios, setUsuarios] = useState<Usuario[] | null>(null);
  const [aviso, setAviso] = useState<string | null>(null);

  useEffect(() => {
    getUsuariosAdmin().then(setUsuarios);
  }, []);

  function mostrarAviso(mensagem: string) {
    setAviso(mensagem);
    setTimeout(() => setAviso(null), 2200);
  }

  function alternarVerificacao(id: string) {
    setUsuarios((atual) => (atual ?? []).map((u) => (u.id === id ? { ...u, verificado: !u.verificado } : u)));
    const alvo = usuarios?.find((u) => u.id === id);
    mostrarAviso(alvo?.verificado ? "Verificação removida." : "Usuário verificado.");
  }

  function alternarSuspensao(id: string) {
    setUsuarios((atual) =>
      (atual ?? []).map((u) => (u.id === id ? { ...u, status: u.status === "ativo" ? "suspenso" : "ativo" } : u)),
    );
    const alvo = usuarios?.find((u) => u.id === id);
    mostrarAviso(alvo?.status === "ativo" ? "Conta suspensa." : "Conta reativada.");
  }

  if (!usuarios) {
    return <AdminListSkeleton linhas={4} />;
  }

  return (
    <div className="flex flex-col gap-4">
      <header>
        <h1 className="font-display text-xl font-bold text-foreground">Gerenciar Usuários</h1>
        <p className="mt-1 text-sm text-muted-foreground">{usuarios.length} conta(s) cadastrada(s).</p>
      </header>

      <div className="flex flex-col gap-3">
        {usuarios.map((usuario) => (
          <div
            key={usuario.id}
            className={`flex flex-col gap-3 rounded-2xl bg-card p-4 shadow-card ${usuario.status === "suspenso" ? "opacity-70" : ""}`}
          >
            <div className="flex items-center gap-3">
              <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-primary-container font-display text-sm font-bold text-primary-container-foreground">
                {usuario.nome
                  .split(" ")
                  .slice(0, 2)
                  .map((parte) => parte[0])
                  .join("")}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate font-display text-sm font-bold text-foreground">{usuario.nome}</p>
                <p className="truncate text-xs text-muted-foreground">{usuario.email}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {usuario.municipio}, {usuario.estado} • desde{" "}
                  {new Intl.DateTimeFormat("pt-BR", { month: "short", year: "numeric" }).format(
                    new Date(usuario.criadoEm),
                  )}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-1 text-xs font-bold text-secondary">
                <Star className="size-3.5 fill-secondary" />
                {usuario.reputacao.nota.toFixed(1)}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-1.5">
              {usuario.papel === "admin" ? (
                <Badge variant="tertiary">
                  <UserCog className="size-3" />
                  Administrador
                </Badge>
              ) : (
                <Badge variant="outline">Usuário</Badge>
              )}
              {usuario.verificado && (
                <Badge variant="primary">
                  <ShieldCheck className="size-3" />
                  Verificado
                </Badge>
              )}
              <Badge variant={usuario.status === "ativo" ? "success" : "neutral"}>
                {usuario.status === "ativo" ? "Ativo" : "Suspenso"}
              </Badge>
              <span className="text-xs text-muted-foreground">{usuario.reputacao.trocasConcluidas} trocas</span>
            </div>

            {usuario.papel !== "admin" && (
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="flex-1" onClick={() => alternarVerificacao(usuario.id)}>
                  {usuario.verificado ? (
                    <>
                      <ShieldOff className="size-4" />
                      Remover verificação
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="size-4" />
                      Verificar
                    </>
                  )}
                </Button>
                <Button
                  variant={usuario.status === "ativo" ? "destructive" : "outline"}
                  size="sm"
                  className="flex-1"
                  onClick={() => alternarSuspensao(usuario.id)}
                >
                  {usuario.status === "ativo" ? (
                    <>
                      <Ban className="size-4" />
                      Suspender
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="size-4" />
                      Reativar
                    </>
                  )}
                </Button>
              </div>
            )}
          </div>
        ))}
      </div>

      <AvisoToast mensagem={aviso} />
    </div>
  );
}
