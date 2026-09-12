'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Bell, LogIn, UserCog } from 'lucide-react'
import { Logo } from '@/components/layout/logo'
import { ThemeToggle } from '@/components/theme-toggle'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/lib/auth-context'

/**
 * Rotas onde o cabeçalho global fica oculto: a Home porque já tem um logo
 * grande no topo (ver `page.tsx`), e qualquer rota do Admin porque tem sua
 * própria navegação (ver `src/app/admin/layout.tsx`) — evita empilhar dois
 * cabeçalhos. Mesma ideia de `OCULTAR_EM` usada em `bottom-nav.tsx`.
 */
const OCULTAR_EM = ['/']

function deveOcultar(pathname: string) {
  return OCULTAR_EM.includes(pathname) || pathname.startsWith('/admin')
}

/**
 * Cabeçalho fixo (sticky) do app — só aparece em telas >= md (`hidden
 * md:block`). Em telas menores ele foi removido de propósito: o produto é
 * pensado com comportamento de app (não de página web), e ter uma barra
 * fixa no topo *e* outra no rodapé ao mesmo tempo no mobile é justamente o
 * padrão "web" que o usuário pediu para tirar — a `BottomNav` (com o botão
 * de conta pelo item "Perfil" e agora também o de Notificações) já cobre
 * essa navegação no mobile. Em telas >= md, onde a `BottomNav` fica oculta,
 * este cabeçalho — e o botão de conta à direita — volta a ser o único jeito
 * de chegar em Login/Perfil/Notificações.
 */
export function AppHeader() {
  const pathname = usePathname()
  const { usuario } = useAuth()

  if (deveOcultar(pathname)) {
    return null
  }

  return (
    <header className="sticky top-0 z-40 hidden border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 md:block">
      <div className="page-container flex h-16 items-center justify-between">
        <Logo />

        <div className="flex items-center gap-1">
          <ThemeToggle />
          <Button asChild variant="ghost" size="icon" aria-label="Notificações">
            <Link href="/notificacoes">
              <Bell className="size-5" />
            </Link>
          </Button>

          {usuario ? (
            <Link
              href="/perfil"
              aria-label="Meu Perfil"
              className="ml-1 flex size-9 items-center justify-center rounded-full bg-primary-container font-display text-xs font-bold text-primary-container-foreground transition-transform active:scale-90"
            >
              {usuario.papel === 'admin' ? (
                <UserCog className="size-4" />
              ) : (
                usuario.nome
                  .split(' ')
                  .slice(0, 2)
                  .map((parte) => parte[0])
                  .join('')
              )}
            </Link>
          ) : (
            <Link
              href="/login"
              aria-label="Entrar"
              className="ml-1 flex size-9 items-center justify-center rounded-full bg-muted text-foreground transition-transform active:scale-90"
            >
              <LogIn className="size-4" />
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}
