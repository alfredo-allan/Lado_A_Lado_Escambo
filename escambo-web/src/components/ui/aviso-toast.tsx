import { CheckCircle2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface AvisoToastProps {
  mensagem: string | null
  /**
   * Permite sobrescrever o posicionamento (ex: `top-16`, `top-20`, ou classes de bottom)
   * via `tailwind-merge` quando uma tela específica precisar de offset customizado.
   */
  className?: string
}

export function AvisoToast({ mensagem, className }: AvisoToastProps) {
  if (!mensagem) return null

  return (
    <div
      className={cn(
        'pointer-events-none fixed inset-x-0 top-16 z-50 flex justify-center px-4 animate-in fade-in slide-in-from-top-2 duration-200',
        className
      )}>
      <div className="flex items-center gap-2 max-w-[92vw] rounded-full bg-[#143e21] px-4 py-2 text-center shadow-lg border border-white/20 backdrop-blur-md">
        <CheckCircle2 className="size-4 shrink-0 text-emerald-400" />
        <span className="font-display text-xs font-bold text-white tracking-wide">{mensagem}</span>
      </div>
    </div>
  )
}
