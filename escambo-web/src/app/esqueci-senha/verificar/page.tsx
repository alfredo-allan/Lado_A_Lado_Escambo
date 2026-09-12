"use client";

import { Suspense, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Loader2, ShieldCheck } from "lucide-react";

import { AvisoToast } from "@/components/ui/aviso-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { solicitarRecuperacaoSenha, verificarCodigoRecuperacao } from "@/lib/api/recuperacao-senha";

function mascararEmail(email: string) {
  const [usuario, dominio] = email.split("@");
  if (!dominio || usuario.length <= 2) return email;
  return `${usuario.slice(0, 2)}${"*".repeat(Math.max(usuario.length - 2, 3))}@${dominio}`;
}

/**
 * Etapa 2 de "Esqueci minha senha". Usa `useSearchParams` (e-mail + o
 * `codigoDemo` opcional vindos de `/esqueci-senha`) — por isso precisa do
 * mesmo padrão de `Suspense` já usado em `/login`.
 */
export default function VerificarCodigoPage() {
  return (
    <Suspense fallback={null}>
      <VerificarCodigoConteudo />
    </Suspense>
  );
}

function VerificarCodigoConteudo() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") ?? "";

  const [codigo, setCodigo] = useState("");
  const [codigoDemo, setCodigoDemo] = useState(searchParams.get("codigoDemo"));
  const [enviando, setEnviando] = useState(false);
  const [reenviando, setReenviando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [aviso, setAviso] = useState<string | null>(null);

  if (!email) {
    return (
      <div className="page-container flex max-w-md flex-col items-center py-16 text-center">
        <h1 className="mb-2 font-display text-xl font-bold text-foreground">Sessão de recuperação não encontrada</h1>
        <p className="mb-6 text-muted-foreground">
          Solicite a recuperação de senha novamente para receber um novo código.
        </p>
        <Button asChild size="lg">
          <Link href="/esqueci-senha">Esqueci minha senha</Link>
        </Button>
      </div>
    );
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (codigo.trim().length !== 6) {
      setErro("Digite os 6 dígitos do código.");
      return;
    }

    setEnviando(true);
    setErro(null);
    const resultado = await verificarCodigoRecuperacao({ email, codigo: codigo.trim() });
    setEnviando(false);

    if (!resultado.ok) {
      setErro(resultado.erro);
      return;
    }

    router.push(`/esqueci-senha/nova-senha?token=${encodeURIComponent(resultado.tokenRedefinicao)}`);
  }

  async function reenviarCodigo() {
    setReenviando(true);
    setErro(null);
    const resultado = await solicitarRecuperacaoSenha({ email });
    setReenviando(false);

    if (resultado.ok) {
      setCodigoDemo(resultado.codigoDemo ?? null);
      setAviso("Enviamos um novo código.");
      setTimeout(() => setAviso(null), 2600);
    } else {
      setErro(resultado.erro);
    }
  }

  return (
    <div className="page-container max-w-xl py-4 pb-14">
      <div className="mb-4 flex items-center justify-between">
        <Link
          href="/esqueci-senha"
          aria-label="Voltar"
          className="flex size-11 items-center justify-center rounded-full bg-muted text-foreground transition-transform active:scale-95"
        >
          <ArrowLeft className="size-5" />
        </Link>
        <div className="flex items-center gap-1.5 rounded-full bg-primary-container/25 px-3 py-1.5">
          <ShieldCheck className="size-4 text-primary" />
          <span className="font-display text-xs font-bold tracking-wide text-primary">Recuperar Acesso</span>
        </div>
      </div>

      <header className="mb-6">
        <div className="mb-2 inline-flex items-center gap-2">
          <span className="size-2.5 rounded-full bg-primary" />
          <span className="font-display text-xs font-bold uppercase tracking-wider text-primary">
            Confirme seu e-mail
          </span>
        </div>
        <h1 className="mb-2 font-display text-2xl font-bold text-foreground">Digite o código que enviamos</h1>
        <p className="text-muted-foreground">
          Enviamos um código de 6 dígitos para <strong className="text-foreground">{mascararEmail(email)}</strong>.
        </p>
      </header>

      {codigoDemo && (
        <div className="mb-5 rounded-xl border border-dashed border-tertiary/50 bg-tertiary-container/20 px-4 py-3">
          <p className="text-xs font-bold uppercase tracking-wide text-tertiary-container-foreground">
            Ambiente de testes
          </p>
          <p className="mt-1 text-sm text-tertiary-container-foreground">
            Sem servidor de e-mail ainda — use o código{" "}
            <span className="font-display font-bold tracking-widest">{codigoDemo}</span>.
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="codigo">Código de verificação</Label>
          <Input
            id="codigo"
            name="codigo"
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={6}
            placeholder="• • • • • •"
            className="text-center font-display text-2xl font-bold tracking-[0.3em] placeholder:tracking-normal placeholder:font-normal"
            required
            value={codigo}
            onChange={(e) => setCodigo(e.target.value.replace(/\D/g, "").slice(0, 6))}
          />
        </div>

        {erro && (
          <p
            role="alert"
            className="rounded-xl bg-destructive-container px-4 py-3 text-sm font-medium text-destructive-container-foreground"
          >
            {erro}
          </p>
        )}

        <Button type="submit" size="lg" disabled={enviando} className="w-full">
          {enviando ? (
            <>
              <Loader2 className="size-5 animate-spin" />
              Confirmando...
            </>
          ) : (
            "Confirmar código"
          )}
        </Button>

        <button
          type="button"
          onClick={reenviarCodigo}
          disabled={reenviando}
          className="text-center text-sm font-bold text-primary underline-offset-4 hover:underline disabled:opacity-60"
        >
          {reenviando ? "Enviando novo código..." : "Não recebeu? Reenviar código"}
        </button>
      </form>

      <AvisoToast mensagem={aviso} />
    </div>
  );
}
