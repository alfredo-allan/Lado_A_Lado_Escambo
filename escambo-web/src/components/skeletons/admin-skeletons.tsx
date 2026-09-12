import { Skeleton } from "@/components/ui/skeleton";

/** Silhueta do Dashboard (`/admin`) enquanto `getMetricasAdmin()` carrega. */
export function AdminDashboardSkeleton() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <Skeleton className="h-6 w-40" />
        <Skeleton className="h-4 w-64" />
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex flex-col gap-2 rounded-2xl bg-card p-4 shadow-card">
            <Skeleton className="size-9 rounded-full" />
            <Skeleton className="h-6 w-12" />
            <Skeleton className="h-3 w-20" />
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-3">
        <Skeleton className="h-5 w-24" />
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 rounded-2xl border border-border/70 bg-card p-4">
            <Skeleton className="size-11 shrink-0 rounded-full" />
            <div className="flex flex-1 flex-col gap-2">
              <Skeleton className="h-4 w-1/3" />
              <Skeleton className="h-3 w-2/3" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Silhueta genérica de lista para as 3 telas de listagem do Admin (Moderar
 * Anúncios / Gerenciar Usuários / Central de Denúncias) — o formato real de
 * cada card varia um pouco entre elas, mas todas seguem o mesmo esqueleto
 * "ícone/avatar + linhas de texto + duas ações" de sobra pra passar a
 * sensação certa de "uma lista de cards está chegando".
 */
export function AdminListSkeleton({ linhas = 4 }: { linhas?: number }) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-4 w-56" />
      </div>

      <div className="flex flex-col gap-3">
        {Array.from({ length: linhas }).map((_, i) => (
          <div key={i} className="flex flex-col gap-3 rounded-2xl bg-card p-4 shadow-card">
            <div className="flex items-start gap-3">
              <Skeleton className="size-10 shrink-0 rounded-full" />
              <div className="flex flex-1 flex-col gap-2">
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Skeleton className="h-9 flex-1 rounded-xl" />
              <Skeleton className="h-9 flex-1 rounded-xl" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
