"use client";

import { useState, type FormEvent, type ReactNode } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Ban,
  ChevronDown,
  Gavel,
  Handshake,
  IdCard,
  Info,
  Loader2,
  Lock,
  Mail,
  MapPin,
  MessageCircle,
  PartyPopper,
  ScanLine,
  ShieldCheck,
  Trash2,
  Users,
  type LucideIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { criarUsuario } from "@/lib/api/usuarios";
import { isValidCPF, isValidEmail, isValidTelefone, maskCPF, maskTelefone } from "@/lib/validators";
import { cn } from "@/lib/utils";
import type { CadastroInput, UF, Usuario } from "@/types/usuario";

/** Todas as UFs do Brasil — o Escambo é uma plataforma nacional. */
const ESTADOS: { value: UF; label: string }[] = [
  { value: "AC", label: "Acre (AC)" },
  { value: "AL", label: "Alagoas (AL)" },
  { value: "AP", label: "Amapá (AP)" },
  { value: "AM", label: "Amazonas (AM)" },
  { value: "BA", label: "Bahia (BA)" },
  { value: "CE", label: "Ceará (CE)" },
  { value: "DF", label: "Distrito Federal (DF)" },
  { value: "ES", label: "Espírito Santo (ES)" },
  { value: "GO", label: "Goiás (GO)" },
  { value: "MA", label: "Maranhão (MA)" },
  { value: "MT", label: "Mato Grosso (MT)" },
  { value: "MS", label: "Mato Grosso do Sul (MS)" },
  { value: "MG", label: "Minas Gerais (MG)" },
  { value: "PA", label: "Pará (PA)" },
  { value: "PB", label: "Paraíba (PB)" },
  { value: "PR", label: "Paraná (PR)" },
  { value: "PE", label: "Pernambuco (PE)" },
  { value: "PI", label: "Piauí (PI)" },
  { value: "RJ", label: "Rio de Janeiro (RJ)" },
  { value: "RN", label: "Rio Grande do Norte (RN)" },
  { value: "RS", label: "Rio Grande do Sul (RS)" },
  { value: "RO", label: "Rondônia (RO)" },
  { value: "RR", label: "Roraima (RR)" },
  { value: "SC", label: "Santa Catarina (SC)" },
  { value: "SP", label: "São Paulo (SP)" },
  { value: "SE", label: "Sergipe (SE)" },
  { value: "TO", label: "Tocantins (TO)" },
];

const FORM_INICIAL: CadastroInput = {
  nome: "",
  cpf: "",
  email: "",
  telefone: "",
  estado: "SP",
  municipio: "",
  aceitouTermos: false,
};

/**
 * Cadastro (Etapa 2). Usa dados mocks via `criarUsuario` — ver
 * `src/lib/api/usuarios.ts` para o ponto de troca pelo backend Python real,
 * incluindo onde entra o registro de consentimento LGPD.
 */
export default function CadastroPage() {
  const [form, setForm] = useState<CadastroInput>(FORM_INICIAL);
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [usuarioCriado, setUsuarioCriado] = useState<Usuario | null>(null);

  const camposObrigatoriosOk =
    form.nome.trim().length > 2 &&
    isValidCPF(form.cpf) &&
    isValidEmail(form.email) &&
    isValidTelefone(form.telefone) &&
    form.municipio.trim().length > 1;

  const podeEnviar = camposObrigatoriosOk && form.aceitouTermos && !enviando;

  function update<K extends keyof CadastroInput>(campo: K, valor: CadastroInput[K]) {
    setForm((atual) => ({ ...atual, [campo]: valor }));
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!camposObrigatoriosOk) {
      setErro("Confira os campos obrigatórios antes de continuar.");
      return;
    }
    if (!form.aceitouTermos) {
      setErro("Marque a caixa de aceite dos Termos para concluir o cadastro.");
      return;
    }

    setEnviando(true);
    setErro(null);
    const resultado = await criarUsuario(form);
    setEnviando(false);

    if (resultado.ok) {
      setUsuarioCriado(resultado.usuario);
    } else {
      setErro(resultado.erro);
    }
  }

  if (usuarioCriado) {
    return <CadastroSucesso usuario={usuarioCriado} />;
  }

  return (
    <div className="page-container max-w-xl py-4 pb-14">
      <div className="mb-4 flex items-center justify-between">
        <Link
          href="/"
          aria-label="Voltar para a tela anterior"
          className="flex size-11 items-center justify-center rounded-full bg-muted text-foreground transition-transform active:scale-95"
        >
          <ArrowLeft className="size-5" />
        </Link>
        <div className="flex items-center gap-1.5 rounded-full bg-primary-container/25 px-3 py-1.5">
          <ShieldCheck className="size-4 text-primary" />
          <span className="font-display text-xs font-bold tracking-wide text-primary">Cadastro Seguro</span>
        </div>
      </div>

      <header className="mb-6">
        <div className="mb-2 inline-flex items-center gap-2">
          <span className="size-2.5 rounded-full bg-secondary" />
          <span className="font-display text-xs font-bold uppercase tracking-wider text-secondary">Novo Membro</span>
        </div>
        <h1 className="mb-2 font-display text-2xl font-bold text-foreground">Crie sua conta no Escambo</h1>
        <p className="text-muted-foreground">
          Faça parte da maior rede de trocas e reutilização de produtos do Brasil. Negocie direto com outras
          pessoas, com confiança.
        </p>
      </header>

      <div className="mb-6 flex items-center gap-3 rounded-xl bg-muted p-4 shadow-card">
        <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground">
          <Handshake className="size-6" />
        </div>
        <div className="min-w-0">
          <p className="font-display font-bold text-foreground">Rede Escambo Brasil</p>
          <p className="text-sm text-muted-foreground">
            Mais de 12.400 pessoas trocando roupas, eletrônicos, móveis e outros itens em todo o país.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
        <FormField label="Nome Completo" htmlFor="nome" obrigatorio>
          <div className="relative flex items-center">
            <Input
              id="nome"
              name="nome"
              placeholder="Ex: José da Silva Ribeiro"
              className="pr-12"
              required
              value={form.nome}
              onChange={(e) => update("nome", e.target.value)}
            />
            <IdCard className="pointer-events-none absolute right-4 size-5 text-muted-foreground" />
          </div>
          <FieldHint>Como você prefere ser chamado(a) na plataforma.</FieldHint>
        </FormField>

        <FormField
          label={
            <span className="flex items-center gap-1.5">
              <span>CPF</span>
              <Lock className="size-3.5 text-primary" />
            </span>
          }
          htmlFor="cpf"
          obrigatorio
        >
          <div className="relative flex items-center">
            <Input
              id="cpf"
              name="cpf"
              inputMode="numeric"
              placeholder="000.000.000-00"
              maxLength={14}
              className="pr-12"
              required
              value={form.cpf}
              onChange={(e) => update("cpf", maskCPF(e.target.value))}
            />
            <ScanLine className="pointer-events-none absolute right-4 size-5 text-muted-foreground" />
          </div>
          <FieldHint icon={ShieldCheck} tone="primary">
            Necessário para validação e combate a fraudes no campo.
          </FieldHint>
        </FormField>

        <FormField label="E-mail de Contato" htmlFor="email" obrigatorio>
          <div className="relative flex items-center">
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="seuemail@exemplo.com.br"
              className="pr-12"
              required
              value={form.email}
              onChange={(e) => update("email", e.target.value)}
            />
            <Mail className="pointer-events-none absolute right-4 size-5 text-muted-foreground" />
          </div>
          <FieldHint>Você receberá resumos de trocas e acordos firmados.</FieldHint>
        </FormField>

        <FormField label="Telefone / WhatsApp (com DDD)" htmlFor="telefone" obrigatorio>
          <div className="relative flex items-center">
            <Input
              id="telefone"
              name="telefone"
              inputMode="numeric"
              placeholder="(87) 99999-9999"
              maxLength={15}
              className="pr-12"
              required
              value={form.telefone}
              onChange={(e) => update("telefone", maskTelefone(e.target.value))}
            />
            <MessageCircle className="pointer-events-none absolute right-4 size-5 text-muted-foreground" />
          </div>
          <FieldHint>Usado para avisos imediatos de contrapropostas de troca.</FieldHint>
        </FormField>

        <div className="grid grid-cols-1 gap-4">
          <FormField label="Estado" htmlFor="estado">
            <div className="relative">
              <select
                id="estado"
                name="estado"
                className="h-14 w-full appearance-none rounded-xl border-[1.5px] border-input bg-card px-4 pr-10 text-foreground shadow-card outline-none focus-visible:border-primary focus-visible:ring-[3px] focus-visible:ring-ring/30"
                value={form.estado}
                onChange={(e) => update("estado", e.target.value as UF)}
              >
                {ESTADOS.map((uf) => (
                  <option key={uf.value} value={uf.value}>
                    {uf.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-4 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" />
            </div>
          </FormField>

          <FormField label="Município / Polo Regional" htmlFor="municipio">
            <div className="relative flex items-center">
              <Input
                id="municipio"
                name="municipio"
                placeholder="Ex: São Paulo, Belo Horizonte, Salvador..."
                className="pr-12"
                value={form.municipio}
                onChange={(e) => update("municipio", e.target.value)}
              />
              <MapPin className="pointer-events-none absolute right-4 size-5 text-muted-foreground" />
            </div>
            <FieldHint>Ajuda pessoas por perto a encontrar suas ofertas sem frete caro.</FieldHint>
          </FormField>
        </div>

        <div className="flex flex-col gap-4 rounded-xl bg-card p-5 shadow-card-elevated">
          <div className="flex items-start gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-tertiary-container text-tertiary-container-foreground shadow-sm">
              <Gavel className="size-5" />
            </div>
            <div>
              <span className="block font-display text-xs font-bold uppercase tracking-wider text-tertiary">
                Conformidade Legal
              </span>
              <h2 className="font-display text-base font-bold leading-snug text-foreground">
                Seus dados protegidos pela LGPD (Lei 13.709/2018)
              </h2>
            </div>
          </div>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Coletamos apenas as informações essenciais para garantir a confiabilidade das trocas e certificar que
            todos os participantes da rede são cidadãos verificados.{" "}
            <strong className="font-semibold text-foreground">Seus dados nunca serão comercializados</strong> para
            terceiros e você pode solicitar sua exclusão a qualquer momento através do seu perfil.
          </p>
          <div className="grid grid-cols-2 gap-2">
            <div className="flex items-center gap-2 rounded-lg bg-muted p-3">
              <Ban className="size-4 text-primary" />
              <span className="font-display text-xs font-bold text-foreground">Zero spam comercial</span>
            </div>
            <div className="flex items-center gap-2 rounded-lg bg-muted p-3">
              <Trash2 className="size-4 text-tertiary" />
              <span className="font-display text-xs font-bold text-foreground">Exclusão simplificada</span>
            </div>
          </div>
        </div>

        <div className="rounded-xl bg-muted p-5 shadow-card">
          <label className="flex cursor-pointer items-start gap-3 select-none" htmlFor="lgpdConsent">
            <Checkbox
              id="lgpdConsent"
              checked={form.aceitouTermos}
              onCheckedChange={(checked) => update("aceitouTermos", checked === true)}
              className="mt-0.5"
            />
            <div className="flex-1">
              <span className="mb-1 block font-display text-sm font-bold leading-tight text-foreground">
                Li e aceito os Termos de Uso e a Política de Privacidade de Dados
              </span>
              <p className="text-sm text-muted-foreground">
                Concordo com o tratamento responsável dos meus dados cadastrais e de localização para fins
                exclusivos de trocas no Escambo.
              </p>
              <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
                <Link href="/termos" className="text-xs font-bold text-tertiary underline-offset-4 hover:underline">
                  Ler Termos de Uso
                </Link>
                <Link
                  href="/privacidade"
                  className="text-xs font-bold text-tertiary underline-offset-4 hover:underline"
                >
                  Política de Privacidade
                </Link>
              </div>
            </div>
          </label>
        </div>

        {!form.aceitouTermos && (
          <div className="flex items-center gap-3 rounded-xl bg-secondary-container/30 p-4">
            <Info className="size-5 shrink-0 text-secondary" />
            <p className="text-sm text-secondary-container-foreground">
              Marque a caixa acima para ativar o botão e finalizar seu cadastro seguro.
            </p>
          </div>
        )}

        {erro && (
          <p
            role="alert"
            className="rounded-xl bg-destructive-container px-4 py-3 text-sm font-medium text-destructive-container-foreground"
          >
            {erro}
          </p>
        )}

        <div className="flex flex-col gap-2 pt-1">
          <Button type="submit" size="lg" disabled={!podeEnviar} className="w-full">
            {enviando ? (
              <>
                <Loader2 className="size-5 animate-spin" />
                Enviando cadastro...
              </>
            ) : (
              <>
                <ShieldCheck className="size-5" />
                Concluir Cadastro no Escambo
              </>
            )}
          </Button>
          <p className="flex items-center justify-center gap-1.5 py-2 text-xs text-muted-foreground">
            <Lock className="size-3.5 text-primary" />
            Conexão segura e criptografada com padrão bancário
          </p>
        </div>
      </form>

      <div className="mt-8 flex flex-col items-center gap-3 rounded-xl bg-muted p-5 text-center">
        <div className="flex size-12 items-center justify-center rounded-full bg-secondary-container text-secondary-container-foreground">
          <Users className="size-6" />
        </div>
        <div>
          <h3 className="font-display font-bold text-foreground">Economia Solidária e Sustentável</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Aqui, aquilo que você não usa mais vale roupas, eletrônicos, móveis ou ferramentas de outra pessoa. Sem
            atravessadores, direto entre vizinhos.
          </p>
        </div>
      </div>
    </div>
  );
}

function CadastroSucesso({ usuario }: { usuario: Usuario }) {
  return (
    <div className="page-container flex max-w-md flex-col items-center py-16 text-center">
      <div className="mb-5 flex size-16 items-center justify-center rounded-full bg-primary-container text-primary-container-foreground">
        <PartyPopper className="size-8" />
      </div>
      <h1 className="mb-2 font-display text-xl font-bold text-foreground">
        Bem-vindo ao Escambo, {usuario.nome.split(" ")[0]}!
      </h1>
      <p className="mb-6 text-muted-foreground">
        Seu cadastro foi realizado com sucesso e seus dados estão protegidos pela LGPD. Agora você pode publicar sua
        primeira oferta ou explorar as trocas disponíveis na sua região.
      </p>
      <Button asChild size="lg" className="w-full">
        <Link href="/">Começar a Trocar</Link>
      </Button>
    </div>
  );
}

function FormField({
  label,
  htmlFor,
  obrigatorio,
  children,
}: {
  label: ReactNode;
  htmlFor: string;
  obrigatorio?: boolean;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor={htmlFor} className="w-full justify-between font-normal">
        {label}
        {obrigatorio && <span className="text-xs font-bold text-secondary">Obrigatório</span>}
      </Label>
      {children}
    </div>
  );
}

function FieldHint({
  children,
  icon: Icon = ShieldCheck,
  tone = "secondary",
}: {
  children: ReactNode;
  icon?: LucideIcon;
  tone?: "secondary" | "primary";
}) {
  return (
    <div className="flex items-center gap-1.5 px-1 text-muted-foreground">
      <Icon className={cn("size-3.5", tone === "primary" ? "text-primary" : "text-secondary")} />
      <span className="text-xs">{children}</span>
    </div>
  );
}
