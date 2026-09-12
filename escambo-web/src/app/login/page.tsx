"use client";

import { Suspense, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Lock, LogIn, Loader2, Mail, ShieldCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/lib/auth-context";

/**
 * Login (Etapa 4). Suporta `?next=/algum/caminho` — usado pelo gate
 * `exigirCadastro` do Detalhe do Anúncio (ver `anuncio-detalhe.tsx`) para
 * voltar exatamente para onde o visitante estava tentando interagir depois
 * de logar. `useSearchParams` exige um limite de `Suspense` em volta — daí o
 * componente estar dividido em `LoginPage` (o limite) + `LoginConteudo` (a
 * tela de verdade).
 */
export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginConteudo />
    </Suspense>
  );
}

function LoginConteudo() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const next = searchParams.get("next");

  function irParaDestino(papel: "usuario" | "admin") {
    if (papel === "admin") {
      router.push("/admin");
      return;
    }
    router.push(next && next.startsWith("/") ? next : "/perfil");
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!email.trim() || !senha.trim()) {
      setErro("Preencha e-mail e senha para entrar.");
      return;
    }

    setEnviando(true);
    setErro(null);
    const resultado = await login(email.trim(), senha);
    setEnviando(false);

    if (resultado.ok) {
      irParaDestino(resultado.usuario.papel);
    } else {
      setErro(resultado.erro);
    }
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
          <span className="font-display text-xs font-bold tracking-wide text-primary">Acesso à Conta</span>
        </div>
      </div>

      <header className="mb-6">
        <div className="mb-2 inline-flex items-center gap-2">
          <span className="size-2.5 rounded-full bg-primary" />
          <span className="font-display text-xs font-bold uppercase tracking-wider text-primary">Bem-vindo de volta</span>
        </div>
        <h1 className="mb-2 font-display text-2xl font-bold text-foreground">Entrar no Escambo</h1>
        <p className="text-muted-foreground">
          Acesse sua conta para propor trocas, conversar com vendedores e anunciar seus itens.
        </p>
      </header>

      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="email">E-mail</Label>
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

        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <Label htmlFor="senha">Senha</Label>
            <Link
              href="/esqueci-senha"
              className="text-xs font-bold text-primary underline-offset-4 hover:underline"
            >
              Esqueci minha senha
            </Link>
          </div>
          <div className="relative flex items-center">
            <Input
              id="senha"
              name="senha"
              type="password"
              placeholder="Sua senha"
              className="pr-12"
              required
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
            />
            <Lock className="pointer-events-none absolute right-4 size-5 text-muted-foreground" />
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
              Entrando...
            </>
          ) : (
            <>
              <LogIn className="size-5" />
              Entrar
            </>
          )}
        </Button>

        <p className="text-center text-sm text-muted-foreground">
          Ainda não tem conta?{" "}
          <Link href="/cadastro" className="font-bold text-primary underline-offset-4 hover:underline">
            Criar conta
          </Link>
        </p>
      </form>
    </div>
  );
}
