import Link from "next/link";
import { Compass, Home } from "lucide-react";

import { Button } from "@/components/ui/button";
import { PaginaEmBranco } from "@/components/layout/pagina-em-branco";

/**
 * 404 global. Antes disso não existia um `not-found.tsx` próprio — o Next
 * usava a página padrão, que ainda assim ficava dentro do `RootLayout` e
 * por isso mostrava o `AppBackground` colorido por trás (visual ruim numa
 * tela de erro). Agora usa `PaginaEmBranco` para um fundo branco liso.
 */
export default function NotFound() {
  return (
    <PaginaEmBranco>
      <div className="mb-5 flex size-16 items-center justify-center rounded-full bg-muted text-muted-foreground">
        <Compass className="size-8" />
      </div>
      <h1 className="mb-2 font-display text-xl font-bold text-foreground">Página não encontrada</h1>
      <p className="mb-6 max-w-xs text-muted-foreground">
        O link que você seguiu pode estar quebrado, ou a página pode ter sido removida.
      </p>
      <Button asChild size="lg">
        <Link href="/">
          <Home className="size-5" />
          Voltar ao Início
        </Link>
      </Button>
    </PaginaEmBranco>
  );
}
