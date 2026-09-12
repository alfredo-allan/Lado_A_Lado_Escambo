import { Skeleton } from "@/components/ui/skeleton";

/**
 * Silhueta do Detalhe do Anúncio, usada em `anuncio-local.tsx` enquanto
 * confere o `localStorage` em busca de um anúncio publicado pelo próprio
 * visitante (ver `src/lib/anuncios-usuario.ts`). Reproduz a forma real da
 * tela (foto grande, título, chip de categoria, descrição, dock de ação) —
 * não um spinner genérico — pra não parecer que a tela travou nem "pular"
 * o layout quando o conteúdo de verdade chega.
 */
export function AnuncioDetalheSkeleton() {
  return (
    <div className="pb-32">
      <div className="relative aspect-square w-full sm:aspect-video">
        <Skeleton className="absolute inset-0 rounded-none" />
      </div>

      <div className="page-container flex flex-col gap-4 py-5">
        <Skeleton className="h-5 w-28 rounded-full" />
        <Skeleton className="h-7 w-3/4" />
        <Skeleton className="h-4 w-1/2" />

        <div className="flex flex-col gap-2">
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-2/3" />
        </div>

        <Skeleton className="h-28 w-full rounded-2xl" />
      </div>

      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-card p-4">
        <div className="mx-auto flex max-w-xl items-center gap-2">
          <Skeleton className="h-14 flex-1 rounded-xl" />
          <Skeleton className="h-14 flex-1 rounded-xl" />
        </div>
      </div>
    </div>
  );
}
