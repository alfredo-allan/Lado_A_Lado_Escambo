"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowLeftRight,
  Camera,
  Handshake,
  Loader2,
  Send,
  ShieldCheck,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { enviarMensagem } from "@/lib/api/mensagens";
import type { Anuncio } from "@/types/anuncio";
import type { Mensagem } from "@/types/mensagem";

/**
 * Conversa simulada com o vendedor (Etapa 4). Sem gate de cadastro nesta
 * tela por enquanto — quem chega aqui já passou pelo `exigirCadastro` do
 * botão "Conversar" em `anuncio-detalhe.tsx`; trocar por verificação de
 * sessão real quando ela existir.
 */
export function ConversaAnuncio({
  anuncio,
  mensagensIniciais,
}: {
  anuncio: Anuncio;
  mensagensIniciais: Mensagem[];
}) {
  const [mensagens, setMensagens] = useState<Mensagem[]>(mensagensIniciais);
  const [texto, setTexto] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [formPropostaAberto, setFormPropostaAberto] = useState(false);
  const [itemOferecido, setItemOferecido] = useState("");
  const [voltaEmDinheiro, setVoltaEmDinheiro] = useState("");
  const fimDaListaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fimDaListaRef.current?.scrollIntoView({ block: "end" });
  }, [mensagens.length]);

  async function enviarTexto(event: FormEvent) {
    event.preventDefault();
    const conteudo = texto.trim();
    if (!conteudo || enviando) return;

    setEnviando(true);
    setTexto("");
    const mensagem = await enviarMensagem(anuncio.id, conteudo);
    setMensagens((atual) => [...atual, mensagem]);
    setEnviando(false);
  }

  async function enviarProposta(event: FormEvent) {
    event.preventDefault();
    if (!itemOferecido.trim() || enviando) return;

    setEnviando(true);
    const mensagem = await enviarMensagem(anuncio.id, "Te enviei uma nova proposta de troca:", {
      itemOferecido: itemOferecido.trim(),
      voltaEmDinheiro: voltaEmDinheiro.trim() || undefined,
    });
    setMensagens((atual) => [...atual, mensagem]);
    setItemOferecido("");
    setVoltaEmDinheiro("");
    setFormPropostaAberto(false);
    setEnviando(false);
  }

  return (
    <div className="flex min-h-[calc(100dvh-4rem)] flex-col pb-40">
      {/* Barra superior — item + vendedor */}
      <div className="page-container flex items-center gap-3 py-3">
        <Link
          href={`/anuncios/${anuncio.id}`}
          aria-label="Voltar ao anúncio"
          className="flex size-11 shrink-0 items-center justify-center rounded-full bg-muted text-foreground transition-transform active:scale-95"
        >
          <ArrowLeft className="size-5" />
        </Link>

        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={anuncio.imagens[0]}
          alt={anuncio.titulo}
          className="size-11 shrink-0 rounded-xl object-cover shadow-card"
        />

        <div className="min-w-0 flex-1">
          <p className="truncate font-display text-sm font-bold text-foreground">{anuncio.vendedor.nome}</p>
          <p className="flex items-center gap-1 truncate text-xs text-muted-foreground">
            {anuncio.vendedor.verificado && <ShieldCheck className="size-3 shrink-0 text-primary" />}
            {anuncio.titulo}
          </p>
        </div>
      </div>

      {/* Histórico de mensagens */}
      <div className="page-container flex flex-1 flex-col gap-3 py-2">
        {mensagens.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-2 py-16 text-center">
            <Handshake className="size-8 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              Comece a conversa com {anuncio.vendedor.nome.split(" ")[0]}!
            </p>
          </div>
        ) : (
          mensagens.map((mensagem) => <BolhaMensagem key={mensagem.id} mensagem={mensagem} />)
        )}
        <div ref={fimDaListaRef} />
      </div>

      {/* Barra fixa de envio — "Inserir Proposta de Escambo" */}
      <div
        className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 px-4 pt-3 shadow-sheet backdrop-blur"
        style={{ paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))" }}
      >
        <div className="mx-auto flex max-w-md flex-col gap-2">
          {formPropostaAberto ? (
            <form
              onSubmit={enviarProposta}
              className="flex flex-col gap-2 rounded-xl bg-secondary-container/20 p-3 shadow-card"
            >
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 font-display text-xs font-bold uppercase tracking-wide text-secondary">
                  <ArrowLeftRight className="size-3.5" />
                  Proposta de Escambo
                </span>
                <button
                  type="button"
                  onClick={() => setFormPropostaAberto(false)}
                  aria-label="Fechar formulário de proposta"
                  className="flex size-7 items-center justify-center rounded-full bg-muted text-foreground"
                >
                  <X className="size-4" />
                </button>
              </div>
              <Input
                placeholder="O que você está oferecendo? Ex: Fone de ouvido bluetooth"
                value={itemOferecido}
                onChange={(e) => setItemOferecido(e.target.value)}
                required
              />
              <Input
                placeholder="Volta em dinheiro (opcional) — Ex: R$ 50"
                value={voltaEmDinheiro}
                onChange={(e) => setVoltaEmDinheiro(e.target.value)}
              />
              <Button type="submit" size="sm" disabled={!itemOferecido.trim() || enviando} className="w-full">
                {enviando ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
                Enviar Proposta
              </Button>
            </form>
          ) : (
            <button
              type="button"
              onClick={() => setFormPropostaAberto(true)}
              className="flex items-center justify-center gap-1.5 rounded-full bg-secondary-container/40 px-4 py-2 font-display text-xs font-bold text-secondary transition-colors hover:bg-secondary-container/60"
            >
              <ArrowLeftRight className="size-3.5" />
              Fazer Proposta de Escambo
            </button>
          )}

          <form onSubmit={enviarTexto} className="flex items-center gap-2">
            <button
              type="button"
              aria-label="Anexar foto"
              onClick={() => setFormPropostaAberto(false)}
              className="flex size-11 shrink-0 items-center justify-center rounded-full bg-muted text-foreground transition-transform active:scale-90"
            >
              <Camera className="size-5" />
            </button>
            <Input
              placeholder="Digite sua mensagem..."
              value={texto}
              onChange={(e) => setTexto(e.target.value)}
              className="h-12 flex-1 rounded-full"
              aria-label="Mensagem"
            />
            <button
              type="submit"
              disabled={!texto.trim() || enviando}
              aria-label="Enviar mensagem"
              className="flex size-11 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-card transition-transform active:scale-90 disabled:opacity-50"
            >
              {enviando ? <Loader2 className="size-5 animate-spin" /> : <Send className="size-5" />}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

function BolhaMensagem({ mensagem }: { mensagem: Mensagem }) {
  const souEu = mensagem.autor === "eu";

  return (
    <div className={cn("flex flex-col gap-1", souEu ? "items-end" : "items-start")}>
      <div
        className={cn(
          "max-w-[80%] rounded-2xl px-4 py-2.5 shadow-card",
          souEu
            ? "rounded-br-sm bg-primary text-primary-foreground"
            : "rounded-bl-sm bg-card text-foreground",
        )}
      >
        <p className="text-sm leading-relaxed">{mensagem.texto}</p>

        {mensagem.proposta && (
          <div
            className={cn(
              "mt-2 flex flex-col gap-1 rounded-xl p-3",
              souEu ? "bg-primary-foreground/15" : "bg-secondary-container/25",
            )}
          >
            <span className="flex items-center gap-1.5 font-display text-[11px] font-bold uppercase tracking-wide">
              <Handshake className="size-3.5" />
              Oferta
            </span>
            <p className="text-sm font-semibold">{mensagem.proposta.itemOferecido}</p>
            {mensagem.proposta.voltaEmDinheiro && (
              <p className="text-xs opacity-90">+ {mensagem.proposta.voltaEmDinheiro} de volta</p>
            )}
          </div>
        )}
      </div>
      <span className="px-1 text-[11px] text-muted-foreground">{mensagem.enviadoEm}</span>
    </div>
  );
}
