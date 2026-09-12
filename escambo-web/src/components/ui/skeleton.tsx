import { cn } from "@/lib/utils";

/**
 * Bloco de esqueleto (loading placeholder) — pedido explícito do usuário
 * para substituir os spinners soltos no meio da tela: mostrar a SILHUETA do
 * conteúdo final antes dele chegar melhora a percepção de carregamento (a
 * pessoa vê que "tem algo vindo" no formato certo, não uma tela em branco)
 * e evita a impressão de bug/travamento. Ver `src/components/skeletons/`
 * para as composições prontas de cada tela.
 */
export function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="skeleton" className={cn("animate-pulse rounded-lg bg-muted", className)} {...props} />;
}
