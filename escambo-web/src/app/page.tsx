import Link from 'next/link'
import { ArrowRight, ShieldCheck, Bike } from 'lucide-react'

import { Button } from '@/components/ui/button'

export default function HomePage() {
  return (
    <div className="page-container flex flex-col gap-6 py-8">
      <div>
        <h1 className="font-display text-3xl font-extrabold tracking-tight text-foreground md:text-4xl hidden">Base da Etapa 1 pronta</h1>
        <p className="mt-2 max-w-prose text-[17px] leading-[26px] text-muted-foreground hidden">
          Next.js (App Router) + TypeScript + Tailwind v4 + tema Light/Dark automático, com a paleta Verde Terra Fértil / Sol Dourado / Rio
          & Chuva aplicada via variáveis CSS.
        </p>
      </div>

      {/* Views já construídas com dados mock (a Vitrine/Home real é a Etapa 3) */}
      <div className="grid gap-3 sm:grid-cols-2">
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
  )
}

function ColorSwatch({ name, className }: { name: string; className: string }) {
  return <div className={`flex h-20 items-center justify-center rounded-lg font-display font-bold shadow-card ${className}`}>{name}</div>
}

function PreviewCard({
  href,
  icon: Icon,
  titulo,
  descricao
}: {
  href: string
  icon: typeof ShieldCheck
  titulo: string
  descricao: string
}) {
  return (
    <Link
      href={href}
      className="group flex items-start gap-3 rounded-xl bg-card p-4 shadow-card transition-shadow hover:shadow-card-elevated">
      <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary-container text-primary-container-foreground">
        <Icon className="size-5" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="font-display font-bold text-foreground">{titulo}</p>
        <p className="mt-0.5 text-sm text-muted-foreground">{descricao}</p>
      </div>
      <ArrowRight className="mt-2 size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
    </Link>
  )
}
