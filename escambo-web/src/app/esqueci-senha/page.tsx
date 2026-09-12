"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, KeyRound, Loader2, Mail, ShieldCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { solicitarRecuperacaoSenha } from "@/lib/api/recuperacao-senha";

/**
 * Etapa 1 de "Esqueci minha senha" (ver `src/lib/api/recuperacao-senha.ts`
 * para as 3 etapas completas): só pede o e-mail. Depois de "enviar" o código
 * (mock — sem servidor de e-mail ainda), segue para `/esqueci-senha/
 * verificar`, levando o e-mail — e, só nesta fase, o próprio código — via
 * query string, para essa tela conseguir mostrar "enviamos um código para
 * fulano@..." sem precisar de um contexto/estado global só para isso.
 */
export default function EsqueciSenhaPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!email.trim()) {
      setErro("Informe o e-mail cadastrado na sua conta.");
      return;
    }

    setEnviando(true);
    setErro(null);
    const resultado = await solicitarRecuperacaoSenha({ email: email.trim() });
    setEnviando(false);

    if (!resultado.ok) {
      setErro(resultado.erro);
      return;
    }

    const params = new URLSearchParams({ email: email.trim() });
    if (resultado.codigoDemo) {
      params.set("codigoDemo", resultado.codigoDemo);
    }
    router.push(`/esqueci-senha/verificar?${params.toString()}`);
  }

  return (
    <div className="page-container max-w-xl py-4 pb-14">
      <div className="mb-4 flex items-center justify-between">
        <Link
          href="/login"
          aria-label="Voltar para o Login"
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
            Esqueci minha senha
          </span>
        </div>
        <h1 className="mb-2 font-display text-2xl font-bold text-foreground">Vamos recuperar seu acesso</h1>
        <p className="text-muted-foreground">
          Informe o e-mail da sua conta. Vamos enviar um código de 6 dígitos para confirmar que é você.
        </p>
      </header>

      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="email">E-mail cadastrado</Label>
          <div className="relative flex items-center">
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="seuemail@exemplo.com.br"
              className="pr-12"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Mail className="pointer-events-none absolute right-4 size-5 text-muted-foreground" />
          </div>
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
              Enviando código...
            </>
          ) : (
            <>
              <KeyRound className="size-5" />
              Enviar código
            </>
          )}
        </Button>

        <p className="text-center text-sm text-muted-foreground">
          Lembrou a senha?{" "}
          <Link href="/login" className="font-bold text-primary underline-offset-4 hover:underline">
            Voltar para o Login
          </Link>
        </p>
      </form>
    </div>
  );
}
