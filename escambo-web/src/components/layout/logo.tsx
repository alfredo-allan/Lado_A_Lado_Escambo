import Image from 'next/image'
import { cn } from '@/lib/utils'

// Proporção real do arquivo (1600×1112) — usada para calcular a largura a
// partir da altura, em vez de forçar uma caixa quadrada (que sobrava vazio
// nas laterais e deixava a logo menor do que o tamanho pedido).
const ASPECT = 1600 / 1112

const HEIGHTS = {
  sm: 32,
  md: 48,
  lg: 64
} as const

interface LogoProps {
  /** Altura do logo em pixels. @default "md" */
  size?: keyof typeof HEIGHTS
  /** Mostra "escambo" por extenso ao lado do ícone. @default true */
  withWordmark?: boolean
  className?: string
}

/**
 * Identidade visual do Escambo, presente no cabeçalho de todas as telas.
 * Usa `/public/logo-escambo.png` — a marca original completa, sem recortes.
 */
export function Logo({ size = 'md', withWordmark = true, className }: LogoProps) {
  const height = HEIGHTS[size]
  const width = Math.round(height * ASPECT)

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <Image
        src="/logo-escambo.png"
        alt="Escambo"
        width={width}
        height={height}
        priority
        quality={100}
        unoptimized
        className="shrink-0"
      />
      {withWordmark && <span className="font-display text-lg font-extrabold tracking-tight text-foreground hidden">escambo</span>}
    </div>
  )
}
