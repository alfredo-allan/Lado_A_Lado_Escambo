import type { Metadata, Viewport } from 'next'
import { fontJakarta, fontInter } from '@/lib/fonts'
import { ThemeProvider } from '@/components/theme-provider'
import { AppHeader } from '@/components/layout/app-header'
import { BottomNav } from '@/components/layout/bottom-nav'
import { AppBackground } from '@/components/layout/app-background'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default: 'Escambo — Troque. Economize. Reutilize.',
    template: '%s | Escambo'
  },
  description: 'Plataforma de anúncios para trocas (permuta física) de bens e animais rústicos/agrícolas no Nordeste do Brasil.',
  icons: {
    icon: '/logo-escambo.png',
    apple: '/logo-escambo.png'
  }
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  // Cor da barra de status/navegador conforme o tema ativo.
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#FBF9F5' },
    { media: '(prefers-color-scheme: dark)', color: '#121212' }
  ]
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR" className={`${fontJakarta.variable} ${fontInter.variable}`} suppressHydrationWarning>
      <body className="min-h-dvh">
        <ThemeProvider>
          {/* Fundo decorativo fixo, atrás de tudo (z-0). O conteúdo real fica
              em `relative z-10` logo abaixo para garantir empilhamento
              correto independente da ordem no DOM. */}
          <AppBackground />

          <div className="relative z-10">
            <AppHeader />

            {/* Área rolável principal; `pb-bottom-nav` reserva espaço para a
                navegação inferior fixa em telas mobile (< md). */}
            <main className="min-h-[calc(100dvh-4rem)] pb-bottom-nav md:pb-0">{children}</main>

            <BottomNav />
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
