"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Flag, Loader2, Megaphone, ShieldCheck, UserX, Users } from "lucide-react";

import { getMetricasAdmin, type MetricasAdmin } from "@/lib/api/admin";

/**
 * Dashboard do Admin (Etapa 4). Números vêm de `getMetricasAdmin()` — um
 * retrato estático do mock no momento em que a tela carrega, não algo "ao
 * vivo": ações feitas em Anúncios/Usuários/Denúncias (que só alteram estado
 * local de cada tela, ver `src/lib/api/admin.ts`) não atualizam estes
 * números até a próxima navegação até aqui recarregar o mock original.
 */
export default function AdminDashboardPage() {
  const [metricas, setMetricas] = useState<MetricasAdmin | null>(null);

  useEffect(() => {
    getMetricasAdmin().then(setMetricas);
  }, []);

  if (!metricas) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <header>
        <h1 className="font-display text-xl font-bold text-foreground">Visão Geral</h1>
        <p className="mt-1 text-sm text-muted-foreground">Números da plataforma em tempo de demonstração.</p>
      </header>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <MetricaCard
          icon={Users}
          valor={metricas.totalUsuarios}
          label="Usuários cadastrados"
          tone="bg-primary-container text-primary-container-foreground"
        />
        <MetricaCard
          icon={Megaphone}
          valor={metricas.anunciosAtivos}
          label="Anúncios ativos"
          tone="bg-secondary-container text-secondary-container-foreground"
        />
        <MetricaCard
          icon={ShieldCheck}
          valor={metricas.trocasConcluidas}
          label="Trocas concluídas"
          tone="bg-tertiary-container text-tertiary-container-foreground"
        />
        <MetricaCard
          icon={UserX}
          valor={metricas.usuariosSuspensos}
          label="Usuários suspensos"
          tone="bg-muted text-foreground"
        />
        <MetricaCard
          icon={Flag}
          valor={metricas.denunciasPendentes}
          label="Denúncias pendentes"
          tone="bg-warning/20 text-foreground"
          destaque={metricas.denunciasPendentes > 0}
        />
      </div>

      <div className="flex flex-col gap-3">
        <h2 className="font-display text-base font-bold text-foreground">Atalhos</h2>
        <AtalhoCard
          href="/admin/anuncios"
          icon={Megaphone}
          titulo="Moderar Anúncios"
          descricao="Ver todos os anúncios, destacar ou remover algum da vitrine."
        />
        <AtalhoCard
          href="/admin/usuarios"
          icon={Users}
          titulo="Gerenciar Usuários"
          descricao="Verificar contas, suspender ou reativar acessos."
        />
        <AtalhoCard
          href="/admin/denuncias"
          icon={Flag}
          titulo="Central de Denúncias"
          descricao={
            metricas.denunciasPendentes > 0
              ? `${metricas.denunciasPendentes} denúncia(s) aguardando análise.`
              : "Nenhuma denúncia pendente no momento."
          }
        />
      </div>
    </div>
  );
}

function MetricaCard({
  icon: Icon,
  valor,
  label,
  tone,
  destaque,
}: {
  icon: typeof Users;
  valor: number;
  label: string;
  tone: string;
  destaque?: boolean;
}) {
  return (
    <div className={`flex flex-col gap-2 rounded-2xl bg-card p-4 shadow-card ${destaque ? "ring-2 ring-warning/60" : ""}`}>
      <div className={`flex size-9 items-center justify-center rounded-full ${tone}`}>
        <Icon className="size-4" />
      </div>
      <div>
        <p className="font-display text-2xl font-bold text-foreground">{valor}</p>
        <p className="text-xs text-muted-foreground">{label}</p>
      </div>
    </div>
  );
}

function AtalhoCard({
  href,
  icon: Icon,
  titulo,
  descricao,
}: {
  href: string;
  icon: typeof Users;
  titulo: string;
  descricao: string;
}) {
  return (
    <Link
      href={href}
      className="group flex items-center gap-4 rounded-2xl border border-border/70 bg-card p-4 transition-all hover:border-primary/40 hover:shadow-card active:scale-[0.99]"
    >
      <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-primary-container text-primary-container-foreground">
        <Icon className="size-5" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="font-display text-[15px] font-bold text-foreground">{titulo}</p>
        <p className="mt-0.5 text-sm leading-snug text-muted-foreground">{descricao}</p>
      </div>
      <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
        <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
      </div>
    </Link>
  );
}
