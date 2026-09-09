import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ShieldCheck, Bike, LogIn } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <div className="page-container flex flex-col gap-6 py-8">
      {/* Logo em alta definição, mesmo tratamento da página de Cadastro —
          já que o AppHeader fica oculto nesta rota (ver `deveOcultar` em
          `app-header.tsx`), o logo grande é a única marca visível no topo. */}
      <div className="flex flex-col items-center gap-3 pt-2 text-center">
        <Image
          src="/logo-escambo.png"
          alt="Escambo"
          width={1600}
          height={1112}
          priority
          quality={100}
          unoptimized
          className="h-auto w-48 sm:w-56"
        />
        <p className="font-display text-sm font-bold tracking-wide">
          <span className="text-primary">Troque.</span> <span className="text-secondary">Economize.</span>{" "}
          <span className="text-tertiary">Reutilize.</span>
        </p>
      </div>

      <div>
        <h1 className="font-display text-3xl font-extrabold tracking-tight text-foreground md:text-4xl hidden">Base da Etapa 1 pronta</h1>
        <p className="mt-2 max-w-prose text-[17px] leading-[26px] text-muted-foreground hidden">
          Next.js (App Router) + TypeScript + Tailwind v4 + tema Light/Dark automático, com a paleta Verde Terra Fértil / Sol Dourado / Rio
          & Chuva aplicada via variáveis CSS.
        </p>
      </div>

      {/* Views já construídas com dados mock (a Vitrine/Home real é a Etapa 3) */}
      <div className="flex flex-col gap-3">
        {/* "Entrar" faltava aqui — só existia o atalho de Cadastro, mesmo já
            existindo sessão real (ver `src/lib/auth-context.tsx`). */}
        <PreviewCard
          href="/login"
          icon={LogIn}
          titulo="Entrar"
          descricao="Já tem conta? Acesse para ver seu perfil, propor trocas e anunciar itens."
        />
        <PreviewCard
          href="/cadastro"
          icon={ShieldCheck}
          titulo="Criar Conta"
          descricao="Cadastro com validação de CPF/e-mail/telefone e aceite de Termos + LGPD."
        />
        <PreviewCard
          href="/anuncios/bicicleta-aro29-sao-paulo"
          icon={Bike}
          titulo="Anúncio de Produto"
          descricao="Detalhe de um anúncio de troca, com proposta de escambo e dados do vendedor."
        />
      </div>

      <div className="flex flex-wrap gap-3 hidden">
        <Button>Propor Troca</Button>
        <Button variant="secondary">Contraproposta</Button>
        <Button variant="tertiary">Ver Detalhes</Button>
        <Button variant="outline">Cancelar</Button>
        <Button variant="destructive">Excluir Anúncio</Button>
      </div>
    </div>
  );
}

/**
 * Card de navegação — visual minimalista e objetivo (borda fina em vez de
 * sombra pesada, ícone circular, seta num "chip" que ganha cor no hover):
 * pedido explícito de modernizar o índice de telas construídas, que hoje é
 * só um atalho de desenvolvimento (a Vitrine/Home real ainda é Etapa 3).
 */
function PreviewCard({
  href,
  icon: Icon,
  titulo,
  descricao,
}: {
  href: string;
  icon: typeof ShieldCheck;
  titulo: string;
  descricao: string;
}) {
  return (
    <Link
      href={href}
      className="group flex items-center gap-4 rounded-2xl border border-border/70 bg-card p-4 transition-all hover:border-primary/40 hover:shadow-card active:scale-[0.99]"
    >
      <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-primary-container text-primary-container-foreground">
        <Icon className="size-5" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="font-display text-[15px] font-bold text-foreground">{titulo}</p>
        <p className="mt-0.5 text-sm leading-snug text-muted-foreground">{descricao}</p>
      </div>
      <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
        <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
      </div>
    </Link>
  );
}
