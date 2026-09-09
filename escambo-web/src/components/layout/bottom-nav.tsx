"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, ArrowLeftRight, Bell, Plus, User } from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItem {
  href: string;
  label: string;
  icon: typeof Home;
}

/**
 * 4 itens (2 antes do FAB "Anunciar", 2 depois) — "Notificações" entrou
 * aqui a pedido do usuário: como o `AppHeader` (onde ficava o sino) some no
 * mobile agora (ver `app-header.tsx`), a `BottomNav` — onde já ficam as
 * outras interações do usuário — passou a ser o lugar do sino também.
 */
const NAV_ITEMS: NavItem[] = [
  { href: "/", label: "Início", icon: Home },
  { href: "/propostas", label: "Propostas", icon: ArrowLeftRight },
  { href: "/notificacoes", label: "Avisos", icon: Bell },
  { href: "/perfil", label: "Perfil", icon: User },
];

/**
 * Rotas que já têm sua própria barra de ação fixa no rodapé (ex.: o
 * "trade dock" do Detalhe do Anúncio, com "Fazer Proposta de Escambo") —
 * nelas a BottomNav global sai para não empilhar duas barras fixas na
 * mesma área de toque.
 */
const OCULTAR_EM = ["/cadastro", "/login"];

function deveOcultar(pathname: string) {
  return (
    OCULTAR_EM.includes(pathname) ||
    pathname.startsWith("/anuncios/") ||
    // O Admin tem sua própria navegação (ver `src/app/admin/layout.tsx`) —
    // a barra de navegação do consumidor não faz sentido lá.
    pathname.startsWith("/admin")
  );
}

/**
 * Navegação inferior fixa (mobile-first), com o botão "Anunciar" central
 * em destaque (FAB), replicando o padrão dos wireframes de referência
 * (Início / Propostas / Anunciar / Perfil). Oculta em telas >= md, onde a
 * navegação principal deve migrar para um cabeçalho/sidebar (Etapa 3+), e
 * também nas rotas listadas em `OCULTAR_EM` (ver acima).
 */
export function BottomNav() {
  const pathname = usePathname();

  if (deveOcultar(pathname)) {
    return null;
  }

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 h-bottom-nav border-t border-border bg-card md:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      aria-label="Navegação principal"
    >
      <div className="mx-auto flex h-full max-w-md items-center justify-between px-2">
        {NAV_ITEMS.slice(0, 2).map((item) => (
          <NavLink key={item.href} item={item} active={pathname === item.href} />
        ))}

        <Link
          href="/anunciar"
          aria-label="Anunciar"
          className="-mt-8 flex size-touch-min items-center justify-center rounded-full bg-primary text-primary-foreground shadow-card-elevated transition-transform active:scale-95"
        >
          <Plus className="size-6" strokeWidth={2.5} />
        </Link>

        {NAV_ITEMS.slice(2).map((item) => (
          <NavLink key={item.href} item={item} active={pathname === item.href} />
        ))}
      </div>
    </nav>
  );
}

function NavLink({ item, active }: { item: NavItem; active: boolean }) {
  const Icon = item.icon;

  return (
    <Link
      href={item.href}
      className={cn(
        "flex min-w-touch-min flex-1 flex-col items-center justify-center gap-0.5 py-2 text-xs font-medium transition-colors",
        active ? "text-primary" : "text-muted-foreground",
      )}
      aria-current={active ? "page" : undefined}
    >
      <Icon className="size-6" strokeWidth={active ? 2.5 : 2} />
      {item.label}
    </Link>
  );
}
