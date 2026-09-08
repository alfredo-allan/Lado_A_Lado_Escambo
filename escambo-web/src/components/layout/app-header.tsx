import { Bell } from 'lucide-react'
import { Logo } from '@/components/layout/logo'
import { ThemeToggle } from '@/components/theme-toggle'
import { Button } from '@/components/ui/button'

/**
 * Cabeçalho fixo (sticky) do app, presente em todas as telas.
 * Mobile-first: em telas pequenas ocupa a largura total; em telas maiores
 * o conteúdo interno é centralizado via `.page-container`.
 */
export function AppHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="page-container flex h-16 items-center justify-between">
        <Logo />

        <div className="flex items-center gap-1">
          <ThemeToggle />
          <Button variant="ghost" size="icon" aria-label="Notificações">
            <Bell className="size-5" />
          </Button>
        </div>
      </div>
    </header>
  )
}
