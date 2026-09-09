import type { ReactNode } from "react";

/**
 * Cobre o `AppBackground` (a composição de marca colorida, ver
 * `app-background.tsx`) com um fundo branco liso — usado em telas de
 * estado excepcional (404, acesso negado, erro inesperado) onde a marca
 * viva de fundo atrapalha a leitura em vez de ajudar (pedido explícito do
 * usuário depois de ver a tela de 404 com o fundo colorido por trás).
 *
 * `fixed inset-0` cobre todo o viewport; `z-30` fica acima do
 * `AppBackground` (z-0) mas abaixo do `AppHeader`/`BottomNav` (z-40), que
 * continuam por cima quando estiverem visíveis nessa rota.
 */
export function PaginaEmBranco({ children }: { children: ReactNode }) {
  return (
    <div className="fixed inset-0 z-30 overflow-y-auto bg-white">
      <div className="flex min-h-full flex-col items-center justify-center px-6 py-16 text-center">{children}</div>
    </div>
  );
}
