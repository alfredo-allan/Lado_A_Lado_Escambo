"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { BarChart3, Flag, Loader2, LogOut, Megaphone, ShieldAlert, Users } from "lucide-react";

import { useAuth } from "@/lib/auth-context";
import { PaginaEmBranco } from "@/components/layout/pagina-em-branco";
import { cn } from "@/lib/utils";

const ABAS = [
  { href: "/admin", label: "Dashboard", icon: BarChart3 },
  { href: "/admin/anuncios", label: "Anúncios", icon: Megaphone },
  { href: "/admin/usuarios", label: "Usuários", icon: Users },
  { href: "/admin/denuncias", label: "Denúncias", icon: Flag },
];

/**
 * Layout do Painel Admin (Etapa 4). Gate de acesso: só renderiza o conteúdo
 * (`children`) para `papel === "admin"` — visitante deslogado ou Usuário
 * comum vê uma tela de "Acesso restrito" em vez das páginas administrativas,
 * sem sequer tentar montá-las (evita qualquer flash de dado sensível). O
 * gate hoje é só de UI/client — quando existir backend real, o servidor
 * também precisa recusar essas rotas/endpoints para quem não é admin, não
 * só o client.
 *
 * Chrome próprio (cabeçalho + abas), diferente do resto do app: `AppHeader`
 * e `BottomNav` globais já se escondem em qualquer rota `/admin/*` (ver
 * `deveOcultar` em `app-header.tsx`/`bottom-nav.tsx`).
 */
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { usuario, papel, carregando, logout } = useAuth();

  if (carregando) {
    return (
      <div className="flex min-h-dvh items-center justify-center">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (papel !== "admin") {
    return (
      <PaginaEmBranco>
        <div className="mx-auto flex w-full max-w-md flex-col items-center text-center">
          <div className="mb-5 flex size-16 items-center justify-center rounded-full bg-destructive-container text-destructive-container-foreground">
            <ShieldAlert className="size-8" />
          </div>
          <h1 className="mb-2 font-display text-xl font-bold text-foreground">Acesso restrito</h1>
          <p className="mb-6 text-muted-foreground">
            {usuario
              ? "Sua conta não tem permissão de Administrador."
              : "Esta área é só para a equipe do Escambo. Entre com uma conta de Administrador para continuar."}
          </p>
          <div className="flex w-full flex-col gap-2">
            {!usuario && (
              <Link
                href="/login?next=/admin"
                className="flex h-14 w-full items-center justify-center rounded-lg bg-primary font-display text-sm font-bold text-primary-foreground shadow-card transition-colors hover:bg-primary/90"
              >
                Entrar como Administrador
              </Link>
            )}
            <Link
              href="/"
              className="flex h-14 w-full items-center justify-center rounded-lg border-[1.5px] border-border font-display text-sm font-bold text-foreground transition-colors hover:bg-accent"
            >
              Voltar ao Início
            </Link>
          </div>
        </div>
      </PaginaEmBranco>
    );
  }

  function sair() {
    logout();
    router.push("/");
  }

  return (
    <div className="min-h-dvh bg-muted/40">
      <header className="sticky top-0 z-40 border-b border-border bg-card">
        <div className="page-container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            {/* <span className="font-display text-lg font-extrabold tracking-tight text-foreground">escambo</span> */}
            <span className="rounded-full bg-tertiary-container px-2.5 py-1 font-display text-[11px] font-bold uppercase tracking-wide text-tertiary-container-foreground">
              Admin
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden text-sm font-medium text-muted-foreground sm:inline">{usuario?.nome}</span>
            <button
              type="button"
              onClick={sair}
              aria-label="Sair"
              className="flex size-10 items-center justify-center rounded-full bg-muted text-foreground transition-transform active:scale-90"
            >
              <LogOut className="size-4" />
            </button>
          </div>
        </div>

        <nav className="page-container flex gap-1 overflow-x-auto pb-2" aria-label="Navegação do Admin">
          {ABAS.map((aba) => {
            const ativo = aba.href === "/admin" ? pathname === "/admin" : pathname.startsWith(aba.href);
            const Icon = aba.icon;
            return (
              <Link
                key={aba.href}
                href={aba.href}
                className={cn(
                  "flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-2 font-display text-xs font-bold transition-colors",
                  ativo ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-accent",
                )}
              >
                <Icon className="size-3.5" />
                {aba.label}
              </Link>
            );
          })}
        </nav>
      </header>

      <main className="page-container py-5 pb-14">{children}</main>
    </div>
  );
}
