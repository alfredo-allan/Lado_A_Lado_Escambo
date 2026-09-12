"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  CalendarDays,
  ChevronRight,
  Handshake,
  LogIn,
  LogOut,
  MapPin,
  Package,
  Pencil,
  ShieldCheck,
  Star,
  UserCog,
  UserRound,
} from "lucide-react";

import { AvisoToast } from "@/components/ui/aviso-toast";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PerfilSkeleton } from "@/components/skeletons/perfil-skeleton";
import { useAuth } from "@/lib/auth-context";
import { MEUS_ANUNCIOS_IDS, USUARIO_ATUAL_MOCK } from "@/lib/mock/usuario-atual";
import { MOCK_ANUNCIOS } from "@/lib/mock/anuncios";
import { listarAnunciosDoUsuario } from "@/lib/anuncios-usuario";
import type { Anuncio } from "@/types/anuncio";

const STATUS_LABEL: Record<Anuncio["status"], string> = {
  disponivel: "Disponível",
  em_negociacao: "Em Negociação",
  trocado: "Trocado",
};

const STATUS_VARIANT: Record<Anuncio["status"], "success" | "tertiary" | "neutral"> = {
  disponivel: "success",
  em_negociacao: "tertiary",
  trocado: "neutral",
};

function formatarMesAno(iso: string) {
  return new Intl.DateTimeFormat("pt-BR", { month: "long", year: "numeric" }).format(new Date(iso));
}

/**
 * Perfil (Etapa 4). Lê a sessão real via `useAuth()` — mostra quem estiver
 * logado (Usuário comum ou Administrador) e, se ninguém estiver, convida
 * para logar/cadastrar em vez de mostrar dados de exemplo à força (era assim
 * antes, quando `useUsuarioAtual()` sempre devolvia `null`). "Meus Anúncios"
 * agora inclui os anúncios publicados de verdade via `/anunciar`,
 * persistidos no `localStorage` (ver `src/lib/anuncios-usuario.ts`), não só
 * os mock fixos. Sem o logo grande (só Cadastro/Home o usam) — o `AppHeader`
 * global já fica visível nesta rota (em telas >= md).
 */
export default function PerfilPage() {
  const router = useRouter();
  const { usuario, papel, carregando, logout } = useAuth();
  const [aviso, setAviso] = useState<string | null>(null);
  const [anunciosPublicados, setAnunciosPublicados] = useState<Anuncio[]>([]);

  // Anúncios publicados de verdade pelo usuário logado via "Anunciar" (ver
  // `src/lib/anuncios-usuario.ts`) — persistidos no `localStorage`, então só
  // dá para ler depois de montar no client (evita mismatch de hidratação,
  // mesmo padrão do `AuthProvider` em `src/lib/auth-context.tsx`).
  useEffect(() => {
    if (!usuario) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setAnunciosPublicados(listarAnunciosDoUsuario(usuario.id));
  }, [usuario]);

  // "Meus Anúncios": para a conta de demonstração de usuário comum, os
  // anúncios mock fixos associados a ela (`MEUS_ANUNCIOS_IDS`) mais qualquer
  // anúncio publicado de verdade via "Anunciar" nesta sessão/navegador; para
  // o Admin, ou qualquer outra conta, só os publicados de verdade (a seção
  // aparece vazia até a pessoa publicar algo, o que é correto).
  const meusAnuncios = [
    ...(usuario?.id === USUARIO_ATUAL_MOCK.id
      ? MOCK_ANUNCIOS.filter((anuncio) => MEUS_ANUNCIOS_IDS.includes(anuncio.id))
      : []),
    ...anunciosPublicados,
  ];

  function mostrarAviso(mensagem: string) {
    setAviso(mensagem);
    setTimeout(() => setAviso(null), 2600);
  }

  function sair() {
    logout();
    router.push("/");
  }

  if (carregando) {
    return <PerfilSkeleton />;
  }

  if (!usuario) {
    return (
      <div className="page-container flex max-w-md flex-col items-center py-16 text-center">
        <div className="mb-5 flex size-16 items-center justify-center rounded-full bg-primary-container text-primary-container-foreground">
          <UserRound className="size-8" />
        </div>
        <h1 className="mb-2 font-display text-xl font-bold text-foreground">Faça login para ver seu perfil</h1>
        <p className="mb-6 text-muted-foreground">
          Entre na sua conta para ver suas estatísticas, seus anúncios publicados e gerenciar sua presença no
          Escambo.
        </p>
        <div className="flex w-full flex-col gap-2">
          <Button asChild size="lg" className="w-full">
            <Link href="/login">
              <LogIn className="size-5" />
              Entrar
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="w-full">
            <Link href="/cadastro">Criar conta</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container max-w-xl py-6 pb-14">
      {usuario.papel === "admin" && (
        <Link
          href="/admin"
          className="mb-4 flex items-center gap-3 rounded-2xl bg-tertiary-container/30 p-4 shadow-card transition-colors hover:bg-tertiary-container/45"
        >
          <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-tertiary text-tertiary-foreground">
            <UserCog className="size-5" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-display text-sm font-bold text-foreground">Conta de Administrador</p>
            <p className="text-xs text-muted-foreground">Ir para o Painel Admin</p>
          </div>
          <ArrowRight className="size-4 shrink-0 text-tertiary" />
        </Link>
      )}

      {/* Cabeçalho do perfil */}
      <div className="flex flex-col items-center gap-3 rounded-2xl bg-card p-6 text-center shadow-card">
        <div className="relative">
          <div className="flex size-24 items-center justify-center rounded-full bg-primary-container font-display text-3xl font-bold text-primary-container-foreground">
            {usuario.nome
              .split(" ")
              .slice(0, 2)
              .map((parte) => parte[0])
              .join("")}
          </div>
          {usuario.verificado && (
            <div className="absolute -bottom-1 -right-1 flex size-8 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm">
              <ShieldCheck className="size-4" />
            </div>
          )}
        </div>

        <div>
          <h1 className="font-display text-xl font-bold text-foreground">{usuario.nome}</h1>
          <p className="mt-1 flex items-center justify-center gap-1.5 text-sm text-muted-foreground">
            <MapPin className="size-4 text-secondary" />
            {usuario.municipio}, {usuario.estado}
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2">
          {usuario.verificado && (
            <Badge variant="primary">
              <ShieldCheck className="size-3.5" />
              Perfil Verificado
            </Badge>
          )}
          {papel === "admin" && <Badge variant="tertiary">Administrador</Badge>}
        </div>

        {/* Estatísticas */}
        <div className="mt-2 grid w-full grid-cols-3 gap-2">
          <EstatCard icon={Star} valor={usuario.reputacao.nota.toFixed(1)} label="Nota" tone="text-secondary" />
          <EstatCard
            icon={Handshake}
            valor={String(usuario.reputacao.trocasConcluidas)}
            label="Trocas"
            tone="text-primary"
          />
          <EstatCard icon={Package} valor={String(meusAnuncios.length)} label="Anúncios" tone="text-tertiary" />
        </div>

        <p className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
          <CalendarDays className="size-3.5" />
          Na comunidade desde {formatarMesAno(usuario.criadoEm)}
        </p>
      </div>

      {/* Ações rápidas */}
      <div className="mt-4 flex items-center gap-2">
        <Button
          variant="outline"
          className="h-12 flex-1"
          onClick={() => mostrarAviso("Edição de perfil chega em breve!")}
        >
          <Pencil className="size-4" />
          Editar Perfil
        </Button>
        <Button variant="outline" className="h-12 flex-1" onClick={sair}>
          <LogOut className="size-4" />
          Sair
        </Button>
      </div>

      {/* Meus anúncios */}
      <div className="mt-8 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-base font-bold text-foreground">Meus Anúncios</h2>
          <Link
            href="/anunciar"
            className="flex items-center gap-1 text-xs font-bold text-primary transition-colors hover:text-primary/80"
          >
            Anunciar novo
            <ArrowRight className="size-3.5" />
          </Link>
        </div>

        {meusAnuncios.length === 0 ? (
          <div className="flex flex-col items-center gap-2 rounded-2xl border border-dashed border-border py-10 text-center">
            <Package className="size-8 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">Você ainda não publicou nenhum anúncio.</p>
          </div>
        ) : (
          meusAnuncios.map((anuncio) => (
            <Link
              key={anuncio.id}
              href={`/anuncios/${anuncio.id}`}
              className="group flex items-center gap-3 rounded-2xl border border-border/70 bg-card p-3 transition-all hover:border-primary/40 hover:shadow-card active:scale-[0.99]"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={anuncio.imagens[0]}
                alt={anuncio.titulo}
                className="size-16 shrink-0 rounded-xl object-cover"
              />
              <div className="min-w-0 flex-1">
                <p className="truncate font-display text-sm font-bold text-foreground">{anuncio.titulo}</p>
                <p className="mt-0.5 truncate text-xs text-muted-foreground">{anuncio.localidade}</p>
                <Badge variant={STATUS_VARIANT[anuncio.status]} className="mt-1.5">
                  {STATUS_LABEL[anuncio.status]}
                </Badge>
              </div>
              <ChevronRight className="size-5 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
            </Link>
          ))
        )}
      </div>

      <AvisoToast mensagem={aviso} />
    </div>
  );
}

function EstatCard({
  icon: Icon,
  valor,
  label,
  tone,
}: {
  icon: typeof Star;
  valor: string;
  label: string;
  tone: string;
}) {
  return (
    <div className="flex flex-col items-center gap-0.5 rounded-xl bg-muted py-3">
      <Icon className={`size-4 ${tone}`} />
      <span className="font-display text-base font-bold text-foreground">{valor}</span>
      <span className="text-[11px] text-muted-foreground">{label}</span>
    </div>
  );
}
