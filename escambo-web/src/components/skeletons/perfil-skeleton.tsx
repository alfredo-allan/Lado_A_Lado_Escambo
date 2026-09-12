import { Skeleton } from "@/components/ui/skeleton";

/** Silhueta do `/perfil` enquanto a sessão (`useAuth().carregando`) reidrata. */
export function PerfilSkeleton() {
  return (
    <div className="page-container max-w-xl py-6 pb-14">
      <div className="flex flex-col items-center gap-3 rounded-2xl bg-card p-6 shadow-card">
        <Skeleton className="size-24 rounded-full" />
        <div className="flex flex-col items-center gap-2">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-4 w-28" />
        </div>
        <div className="mt-2 grid w-full grid-cols-3 gap-2">
          <Skeleton className="h-16 rounded-xl" />
          <Skeleton className="h-16 rounded-xl" />
          <Skeleton className="h-16 rounded-xl" />
        </div>
      </div>

      <div className="mt-4 flex items-center gap-2">
        <Skeleton className="h-12 flex-1 rounded-xl" />
        <Skeleton className="h-12 flex-1 rounded-xl" />
      </div>

      <div className="mt-8 flex flex-col gap-3">
        <Skeleton className="h-5 w-32" />
        {[0, 1, 2].map((i) => (
          <div key={i} className="flex items-center gap-3 rounded-2xl border border-border/70 bg-card p-3">
            <Skeleton className="size-16 shrink-0 rounded-xl" />
            <div className="flex flex-1 flex-col gap-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
              <Skeleton className="h-5 w-20 rounded-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
