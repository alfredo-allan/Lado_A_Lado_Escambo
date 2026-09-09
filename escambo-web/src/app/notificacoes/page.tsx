import { BellOff } from "lucide-react";

/**
 * Notificações (placeholder). Criada para o item "Avisos" da `BottomNav`
 * (ver `bottom-nav.tsx`) ter um destino de verdade — a central de
 * notificações real (push, novas propostas, mensagens) ainda não foi
 * pedida/priorizada; por enquanto só o estado vazio.
 */
export default function NotificacoesPage() {
  return (
    <div className="page-container flex max-w-md flex-col items-center py-20 text-center">
      <div className="mb-5 flex size-16 items-center justify-center rounded-full bg-muted text-muted-foreground">
        <BellOff className="size-8" />
      </div>
      <h1 className="mb-2 font-display text-xl font-bold text-foreground">Nenhuma notificação por enquanto</h1>
      <p className="text-muted-foreground">
        Avisos de novas propostas, mensagens e atualizações dos seus anúncios vão aparecer aqui.
      </p>
    </div>
  );
}
