"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowLeftRight,
  CalendarDays,
  Camera,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  Handshake,
  Heart,
  Hourglass,
  Info,
  MapPin,
  MessageCircle,
  PawPrint,
  Scale,
  Send,
  Share2,
  ShieldAlert,
  ShieldCheck,
  Smile,
  Star,
  Syringe,
  X,
  type LucideIcon,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { useUsuarioAtual } from "@/lib/auth";
import type { Anuncio } from "@/types/anuncio";

const STATUS_VARIANT = {
  disponivel: "success",
  em_negociacao: "tertiary",
  trocado: "neutral",
} as const;

const STATUS_LABEL: Record<Anuncio["status"], string> = {
  disponivel: "Disponível para Escambo",
  em_negociacao: "Em Negociação",
  trocado: "Troca Concluída",
};

const BALANCA_LABEL: Record<Anuncio["balanca"], string> = {
  equivalente: "Equivalente / Volta Negociável",
  flexivel: "Flexível — aceita variações",
  aceita_volta: "Aceita volta em dinheiro",
};

const BALANCA_SEGMENTOS: Record<Anuncio["balanca"], number> = {
  equivalente: 65,
  flexivel: 50,
  aceita_volta: 30,
};

const FICHA_CONFIG: { chave: keyof NonNullable<Anuncio["fichaAnimal"]>; label: string; icon: LucideIcon }[] = [
  { chave: "idade", label: "Idade", icon: Hourglass },
  { chave: "temperamento", label: "Temperamento", icon: Smile },
  { chave: "raca", label: "Raça", icon: PawPrint },
  { chave: "documento", label: "Documento", icon: Syringe },
];

export function AnuncioDetalhe({ anuncio }: { anuncio: Anuncio }) {
  const router = useRouter();
  const { usuario } = useUsuarioAtual();

  const [fotoAtual, setFotoAtual] = useState(0);
  const [favorito, setFavorito] = useState(false);
  const [sheetAberto, setSheetAberto] = useState(false);
  const [aviso, setAviso] = useState<string | null>(null);

  const temVariasFotos = anuncio.imagens.length > 1;
  const fichaAnimal = anuncio.fichaAnimal;

  function mostrarAviso(mensagem: string) {
    setAviso(mensagem);
    setTimeout(() => setAviso(null), 2600);
  }

  function proximaFoto() {
    setFotoAtual((atual) => (atual + 1) % anuncio.imagens.length);
  }
  function fotoAnterior() {
    setFotoAtual((atual) => (atual - 1 + anuncio.imagens.length) % anuncio.imagens.length);
  }

  function alternarFavorito() {
    setFavorito((atual) => !atual);
    mostrarAviso(favorito ? "Removido dos favoritos" : "Salvo nos seus favoritos!");
  }

  function compartilhar() {
    if (typeof navigator !== "undefined" && navigator.share) {
      navigator
        .share({ title: anuncio.titulo, text: `Confira este escambo no Escambo: ${anuncio.titulo}`, url: window.location.href })
        .catch(() => {});
    } else {
      mostrarAviso("Link do anúncio copiado!");
    }
  }

  /**
   * Regra de produto: navegar é livre, interagir exige cadastro. `usuario`
   * vem de `useUsuarioAtual()` (hoje sempre `null` — ver `src/lib/auth.ts`).
   */
  function exigirCadastro(acao: () => void) {
    if (!usuario) {
      mostrarAviso("Crie sua conta para continuar essa ação.");
      router.push("/cadastro");
      return;
    }
    acao();
  }

  return (
    <div className="pb-32">
      <div className="page-container flex items-center justify-between py-3">
        <Link
          href="/"
          aria-label="Voltar"
          className="flex size-11 items-center justify-center rounded-full bg-muted text-foreground transition-transform active:scale-95"
        >
          <ArrowLeft className="size-5" />
        </Link>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-primary-container/20 px-3 py-1.5">
          <ShieldCheck className="size-4 text-primary" />
          <span className="font-display text-xs font-bold uppercase tracking-wide text-primary">Verificado no Campo</span>
        </span>
      </div>

      <div className="page-container flex items-center justify-end gap-2 pb-2">
        <button
          type="button"
          aria-label="Favoritar anúncio"
          aria-pressed={favorito}
          onClick={alternarFavorito}
          className="flex size-11 items-center justify-center rounded-full bg-muted text-foreground shadow-card transition-transform active:scale-90"
        >
          <Heart className={cn("size-5", favorito && "fill-destructive text-destructive")} />
        </button>
        <button
          type="button"
          aria-label="Compartilhar anúncio"
          onClick={compartilhar}
          className="flex size-11 items-center justify-center rounded-full bg-muted text-foreground shadow-card transition-transform active:scale-90"
        >
          <Share2 className="size-5" />
        </button>
      </div>

      {/* Carrossel de imagens */}
      <div className="page-container">
        <div className="relative h-72 w-full overflow-hidden rounded-xl bg-muted shadow-card">
          {/* Placeholder de mock — as fotos reais virão do upload do anunciante (Etapa 3). */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={anuncio.imagens[fotoAtual]} alt={anuncio.titulo} className="size-full object-cover" />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />

          <div className="absolute bottom-3 left-3 flex items-center gap-1.5 rounded-full bg-black/60 px-3 py-1 backdrop-blur-md">
            <Camera className="size-3.5 text-white" />
            <span className="font-display text-xs font-bold text-white">
              {fotoAtual + 1} de {anuncio.imagens.length}
            </span>
          </div>

          <div className="absolute right-3 top-3 flex items-center gap-1.5 rounded-full bg-card/90 px-3 py-1 shadow-sm backdrop-blur-md">
            <PawPrint className="size-3.5 text-primary" />
            <span className="font-display text-xs text-foreground">{anuncio.categoriaLabel}</span>
          </div>

          {temVariasFotos && (
            <>
              <button
                type="button"
                onClick={fotoAnterior}
                aria-label="Foto anterior"
                className="absolute left-2 top-1/2 flex size-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm transition-transform active:scale-90"
              >
                <ChevronLeft className="size-5" />
              </button>
              <button
                type="button"
                onClick={proximaFoto}
                aria-label="Próxima foto"
                className="absolute right-2 top-1/2 flex size-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm transition-transform active:scale-90"
              >
                <ChevronRight className="size-5" />
              </button>
            </>
          )}
        </div>
      </div>

      <div className="page-container mt-4 flex flex-col gap-4">
        {/* Título e identificadores */}
        <div className="flex flex-col gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant={STATUS_VARIANT[anuncio.status]}>{STATUS_LABEL[anuncio.status]}</Badge>
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="size-3.5" />
              Publicado há {anuncio.publicadoHa}
            </span>
          </div>
          <h1 className="font-display text-2xl font-bold leading-tight text-foreground">{anuncio.titulo}</h1>
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <MapPin className="size-4 text-secondary" />
            <span className="text-sm font-semibold">
              {anuncio.localidade}
              {anuncio.distanciaKm !== undefined && ` • a ${anuncio.distanciaKm} km`}
            </span>
          </div>
        </div>

        {/* Card de proposta de escambo */}
        <div className="rounded-xl bg-secondary-container/20 p-4 shadow-card">
          <div className="flex items-start gap-3">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-secondary-container text-secondary-container-foreground shadow-sm">
              <ArrowLeftRight className="size-5" />
            </div>
            <div className="flex min-w-0 flex-1 flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-display text-xs font-bold uppercase tracking-wider text-secondary">
                  Proposta de Escambo
                </span>
                <span className="size-1.5 rounded-full bg-secondary" />
              </div>
              <p className="mt-0.5 font-display text-sm font-bold text-foreground">O que o vendedor aceita em troca:</p>
            </div>
          </div>

          <div className="mt-3 flex flex-col gap-2">
            {anuncio.opcoesTroca.map((opcao, index) => {
              const Icon = index === 0 ? CheckCircle2 : ArrowLeftRight;
              return (
                <div key={opcao.titulo} className="flex items-start gap-3 rounded-lg bg-card p-3 shadow-card">
                  <Icon className={cn("mt-0.5 size-5", index === 0 ? "text-primary" : "text-secondary")} />
                  <div className="min-w-0 flex-1">
                    <p className="font-display text-sm font-bold text-foreground">{opcao.titulo}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">{opcao.descricao}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-3 flex flex-col gap-1.5 pt-2">
            <div className="flex items-center justify-between text-muted-foreground">
              <span className="flex items-center gap-1 text-xs font-bold">
                <Scale className="size-3.5 text-tertiary" />
                Balança de Troca
              </span>
              <span className="text-xs font-bold text-primary">{BALANCA_LABEL[anuncio.balanca]}</span>
            </div>
            <div className="flex h-2 w-full overflow-hidden rounded-full bg-muted">
              <div className="h-full bg-primary-container" style={{ width: `${BALANCA_SEGMENTOS[anuncio.balanca]}%` }} />
              <div
                className="h-full bg-secondary-container"
                style={{ width: `${100 - BALANCA_SEGMENTOS[anuncio.balanca]}%` }}
              />
            </div>
          </div>
        </div>

        {/* Card do vendedor */}
        <div className="flex flex-col gap-3 rounded-xl bg-card p-4 shadow-card">
          <div className="flex items-center justify-between">
            <span className="font-display text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Vendedor Responsável
            </span>
            {anuncio.vendedor.verificado && (
              <span className="inline-flex items-center gap-1 rounded-full bg-primary-container/25 px-2.5 py-1 font-display text-[11px] font-bold text-primary">
                <ShieldCheck className="size-3.5" />
                Verificado
              </span>
            )}
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              {anuncio.vendedor.fotoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={anuncio.vendedor.fotoUrl}
                  alt={anuncio.vendedor.nome}
                  className="size-16 rounded-full object-cover shadow-inner"
                />
              ) : (
                <div className="flex size-16 items-center justify-center rounded-full bg-primary-container font-display text-xl font-bold text-primary-container-foreground">
                  {anuncio.vendedor.iniciais}
                </div>
              )}
              <div className="absolute -bottom-1 -right-1 flex size-6 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm">
                <Handshake className="size-3.5" />
              </div>
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate font-display font-bold text-foreground">{anuncio.vendedor.nome}</p>
              <p className="truncate text-sm text-muted-foreground">{anuncio.localidade}</p>
              <div className="mt-0.5 flex items-center gap-1.5">
                <span className="inline-flex items-center gap-1 font-display text-xs font-bold text-secondary">
                  <Star className="size-3.5 fill-secondary" />
                  {anuncio.vendedor.nota.toFixed(1)}
                </span>
                <span className="text-xs text-muted-foreground">•</span>
                <span className="text-xs font-medium text-muted-foreground">
                  {anuncio.vendedor.trocasConcluidas} trocas concluídas
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1">
            <div className="flex items-center gap-2 rounded-lg bg-muted p-2.5">
              <CalendarDays className="size-4 text-primary" />
              <div className="flex flex-col">
                <span className="text-xs font-bold text-foreground">Na Comunidade</span>
                <span className="text-xs text-muted-foreground">{anuncio.vendedor.naComunidadeDesde}</span>
              </div>
            </div>
            <div className="flex items-center gap-2 rounded-lg bg-muted p-2.5">
              <CheckCircle2 className="size-4 text-primary" />
              <div className="flex flex-col">
                <span className="text-xs font-bold text-foreground">Compromisso</span>
                <span className="text-xs text-muted-foreground">{anuncio.vendedor.percentualEntregas}% Entregas</span>
              </div>
            </div>
          </div>
        </div>

        {/* Ficha do animal, quando existir */}
        {fichaAnimal && (
          <div className="flex flex-col gap-2">
            <h2 className="font-display text-base font-bold text-foreground">Ficha do Animal</h2>
            <div className="grid grid-cols-2 gap-2">
              {FICHA_CONFIG.map(({ chave, label, icon: Icon }) => (
                <div key={chave} className="flex items-center gap-2.5 rounded-lg bg-muted p-3">
                  <div className="flex size-9 items-center justify-center rounded-full bg-card text-primary shadow-sm">
                    <Icon className="size-4.5" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">{label}</p>
                    <p className="font-display text-sm font-bold text-foreground">{fichaAnimal[chave]}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Descrição */}
        <div className="flex flex-col gap-2 rounded-xl bg-card p-4 shadow-card">
          <h2 className="font-display text-base font-bold text-foreground">Detalhes da Oferta</h2>
          <p className="text-sm leading-relaxed text-foreground/90">{anuncio.descricaoLonga}</p>
          {anuncio.motivoTroca && (
            <p className="text-sm leading-relaxed text-foreground/90">
              <strong className="font-semibold text-foreground">Motivo da troca:</strong> {anuncio.motivoTroca}
            </p>
          )}
          {anuncio.atributos.length > 0 && (
            <div className="mt-1 flex flex-wrap gap-2">
              {anuncio.atributos.map((atributo) => (
                <Badge key={atributo} variant="outline">
                  {atributo}
                </Badge>
              ))}
            </div>
          )}
        </div>

        {/* Banner de segurança — reaproveita o token `warning`, reservado para alertas de fraude */}
        <div className="flex flex-col gap-3 rounded-xl bg-warning/15 p-4">
          <div className="flex items-start gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-warning text-warning-foreground shadow-sm">
              <ShieldAlert className="size-5" />
            </div>
            <h3 className="font-display text-sm font-bold leading-snug text-foreground">
              Dicas de segurança para trocas presenciais
            </h3>
          </div>
          <p className="text-sm leading-relaxed text-foreground/90">
            Faça a avaliação do item sempre em local público movimentado (shopping, mercado, praça) ou na
            presença de terceiros de confiança.{" "}
            <strong className="font-semibold text-foreground">Nunca transfira quantias antecipadas</strong> sem
            inspecionar o que está recebendo e, no caso de animais, conferir a Guia de Trânsito Animal (GTA).
          </p>
        </div>
      </div>

      {/* Dock fixo de ações — substitui a BottomNav global nesta rota */}
      <div
        className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 px-4 pt-3 shadow-sheet backdrop-blur"
        style={{ paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))" }}
      >
        <div className="mx-auto flex max-w-md flex-col gap-2">
          <Button size="lg" className="w-full" onClick={() => exigirCadastro(() => setSheetAberto(true))}>
            <Handshake className="size-5" />
            Fazer Proposta de Escambo
          </Button>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              className="h-12 flex-1"
              onClick={() => exigirCadastro(() => mostrarAviso(`Abrindo conversa com ${anuncio.vendedor.nome}...`))}
            >
              <MessageCircle className="size-5 text-primary" />
              Conversar com {anuncio.vendedor.nome.split(" ")[0]}
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-12 w-12"
              aria-label="Condições da troca"
              onClick={() => mostrarAviso(`Condições: ${BALANCA_LABEL[anuncio.balanca]}`)}
            >
              <Info className="size-5" />
            </Button>
          </div>
        </div>
      </div>

      {sheetAberto && (
        <PropostaSheet anuncio={anuncio} onFechar={() => setSheetAberto(false)} onEnviar={() => mostrarAviso(`Proposta enviada para ${anuncio.vendedor.nome}!`)} />
      )}

      {aviso && (
        <div className="fixed left-1/2 top-20 z-50 -translate-x-1/2 rounded-full bg-inverse-surface px-4 py-2.5 text-inverse-on-surface shadow-lg">
          <span className="font-display text-sm font-bold">{aviso}</span>
        </div>
      )}
    </div>
  );
}

/**
 * Painel de proposta — só a interação de UI por enquanto (protótipo).
 * Enviar propostas de verdade e o chat pertencem à Etapa 4; quando essa
 * etapa existir, `onEnviar` chama a API real em vez de só disparar o aviso.
 */
function PropostaSheet({
  anuncio,
  onFechar,
  onEnviar,
}: {
  anuncio: Anuncio;
  onFechar: () => void;
  onEnviar: () => void;
}) {
  const [tipoOferta, setTipoOferta] = useState<"item" | "item_dinheiro">("item");
  const [mensagem, setMensagem] = useState("");

  function enviar() {
    onEnviar();
    onFechar();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-inverse-surface/60 backdrop-blur-sm">
      <div className="flex w-full max-w-md flex-col gap-4 rounded-t-2xl bg-background p-6 shadow-xl">
        <div className="mx-auto h-1.5 w-12 rounded-full bg-border" />
        <div className="flex items-center justify-between">
          <div>
            <span className="font-display text-xs font-bold uppercase tracking-wider text-primary">Escambo Direto</span>
            <h2 className="font-display text-lg font-bold text-foreground">Minha Oferta de Troca</h2>
          </div>
          <button
            type="button"
            onClick={onFechar}
            aria-label="Fechar"
            className="flex size-10 items-center justify-center rounded-full bg-muted text-foreground"
          >
            <X className="size-5" />
          </button>
        </div>

        <p className="text-sm text-muted-foreground">
          Escolha o que você vai oferecer para <strong className="text-foreground">{anuncio.vendedor.nome}</strong> em
          troca de &ldquo;{anuncio.titulo}&rdquo;:
        </p>

        <div className="flex flex-col gap-2">
          <label className="flex cursor-pointer items-center justify-between rounded-xl bg-muted p-4 transition-colors hover:bg-accent">
            <div className="flex items-center gap-3">
              <Handshake className="size-5 text-primary" />
              <div>
                <p className="font-display text-sm font-bold text-foreground">Item do meu inventário</p>
                <p className="text-xs text-muted-foreground">Ferramenta, animal, grãos ou sementes</p>
              </div>
            </div>
            <input
              type="radio"
              name="tipo-oferta"
              checked={tipoOferta === "item"}
              onChange={() => setTipoOferta("item")}
              className="size-5 accent-primary"
            />
          </label>
          <label className="flex cursor-pointer items-center justify-between rounded-xl bg-muted p-4 transition-colors hover:bg-accent">
            <div className="flex items-center gap-3">
              <ArrowLeftRight className="size-5 text-secondary" />
              <div>
                <p className="font-display text-sm font-bold text-foreground">Item + Volta em dinheiro</p>
                <p className="text-xs text-muted-foreground">Completar diferença em espécie/PIX</p>
              </div>
            </div>
            <input
              type="radio"
              name="tipo-oferta"
              checked={tipoOferta === "item_dinheiro"}
              onChange={() => setTipoOferta("item_dinheiro")}
              className="size-5 accent-primary"
            />
          </label>
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="mensagem-proposta" className="text-xs font-bold text-muted-foreground">
            Descreva seu produto ou mensagem inicial
          </label>
          <Textarea
            id="mensagem-proposta"
            placeholder="Ex: Olá! Tenho uma sela quarto de milha novinha com nota fiscal..."
            value={mensagem}
            onChange={(e) => setMensagem(e.target.value)}
            rows={3}
          />
        </div>

        <Button size="lg" className="w-full" onClick={enviar}>
          <Send className="size-5" />
          Enviar Proposta Segura
        </Button>
      </div>
    </div>
  );
}
