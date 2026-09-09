import type { Metadata, Viewport } from 'next'
import { fontJakarta, fontInter } from '@/lib/fonts'
import { ThemeProvider } from '@/components/theme-provider'
import { AuthProvider } from '@/lib/auth-context'
import { AppHeader } from '@/components/layout/app-header'
import { BottomNav } from '@/components/layout/bottom-nav'
import { AppBackground } from '@/components/layout/app-background'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default: 'Escambo — Troque. Economize. Reutilize.',
    template: '%s | Escambo'
  },
  description: 'Plataforma de anúncios para trocas (permuta física) de produtos variados e reutilização de mercadorias em todo o Brasil.',
  icons: {
    icon: '/logo-escambo.png',
    apple: '/logo-escambo.png'
  }
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  // Cor da barra de status/navegador — igual nos dois temas, já que o fundo
  // do app (AppBackground) é sempre a mesma composição clara/viva de marca,
  // independente do tema selecionado (ver ajuste de tokens `.dark` em
  // `globals.css`).
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#FBF9F5' },
    { media: '(prefers-color-scheme: dark)', color: '#FBF9F5' }
  ]
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR" className={`${fontJakarta.variable} ${fontInter.variable}`} suppressHydrationWarning>
      <body className="min-h-dvh">
        <ThemeProvider>
          {/* Sessão do usuário (Usuário comum / Administrador) — envolve tudo
              porque tanto o AppHeader (affordance de conta) quanto as
              páginas (gates de login) precisam ler `useAuth()`/`useUsuarioAtual()`. */}
          <AuthProvider>
            {/* Fundo decorativo fixo, atrás de tudo (z-0). O conteúdo real fica
                em `relative z-10` logo abaixo para garantir empilhamento
                correto independente da ordem no DOM. */}
            <AppBackground />

            <div className="relative z-10">
              <AppHeader />

              {/* Área rolável principal. No mobile (< md) o `AppHeader` fica
                  oculto (ver `app-header.tsx`), então a altura não desconta
                  os 4rem dele; `pb-bottom-nav` reserva espaço para a
                  navegação inferior fixa nessas telas. Em >= md é o
                  contrário: cabeçalho visível, `BottomNav` oculta. */}
              <main className="min-h-dvh pb-bottom-nav md:min-h-[calc(100dvh-4rem)] md:pb-0">{children}</main>

              <BottomNav />
            </div>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
