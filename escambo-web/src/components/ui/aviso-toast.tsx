import { cn } from "@/lib/utils";

interface AvisoToastProps {
  mensagem: string | null;
  /**
   * Sobrescreve a distância do fundo (via `tailwind-merge`, então qualquer
   * classe `bottom-*`/`md:bottom-*` passada aqui substitui a padrão). Use em
   * telas com um dock de ação fixo mais alto que a `BottomNav` global (ex.:
   * Detalhe do Anúncio).
   */
  className?: string;
}

/**
 * Aviso flutuante (toast/snackbar) padrão do app. Antes cada tela tinha sua
 * própria cópia fixada no TOPO (`top-20`) — funcionava enquanto havia sempre
 * um `AppHeader` de 64px empurrando o conteúdo pra baixo, mas quebrou de
 * duas formas assim que o header passou a ficar oculto no mobile (ver
 * `app-header.tsx`): no Detalhe do Anúncio, o aviso passou a cair em cima do
 * selo de categoria no carrossel; no Perfil, em cima do avatar/cabeçalho.
 * Corrigido de vez trocando a posição para o RODAPÉ (padrão "snackbar"),
 * onde não há conteúdo variável de tela pra colidir — só precisa limpar a
 * `BottomNav`/dock de ação fixo, que é previsível.
 */
export function AvisoToast({ mensagem, className }: AvisoToastProps) {
  if (!mensagem) return null;

  return (
    <div
      className={cn(
        "pointer-events-none fixed inset-x-0 z-50 flex justify-center px-4",
        "bottom-[calc(env(safe-area-inset-bottom)+5.5rem)] md:bottom-6",
        className,
      )}
    >
      <div className="max-w-[92vw] rounded-full bg-inverse-surface px-4 py-2.5 text-center shadow-lg">
        <span className="font-display text-sm font-bold text-inverse-on-surface">{mensagem}</span>
      </div>
    </div>
  );
}
