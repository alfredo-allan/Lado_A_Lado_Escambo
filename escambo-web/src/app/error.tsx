"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RotateCw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { PaginaEmBranco } from "@/components/layout/pagina-em-branco";

/**
 * Boundary de erro global (precisa ser Client Component — exigência do
 * Next). Mesma ideia do `not-found.tsx`: fundo branco liso via
 * `PaginaEmBranco` em vez do `AppBackground` colorido, para não misturar a
 * identidade visual "viva" da marca com uma tela de erro.
 */
export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    // Só um log local por enquanto — quando existir um serviço de
    // monitoramento de erros de verdade, o envio entra aqui.
    console.error(error);
  }, [error]);

  return (
    <PaginaEmBranco>
      <div className="mb-5 flex size-16 items-center justify-center rounded-full bg-destructive-container text-destructive-container-foreground">
        <AlertTriangle className="size-8" />
      </div>
      <h1 className="mb-2 font-display text-xl font-bold text-foreground">Algo deu errado</h1>
      <p className="mb-6 max-w-xs text-muted-foreground">
        Tivemos um problema para carregar esta página. Tente novamente em instantes.
      </p>
      <div className="flex w-full max-w-xs flex-col gap-2">
        <Button size="lg" className="w-full" onClick={() => reset()}>
          <RotateCw className="size-5" />
          Tentar novamente
        </Button>
        <Button asChild variant="outline" size="lg" className="w-full">
          <Link href="/">Voltar ao Início</Link>
        </Button>
      </div>
    </PaginaEmBranco>
  );
}
