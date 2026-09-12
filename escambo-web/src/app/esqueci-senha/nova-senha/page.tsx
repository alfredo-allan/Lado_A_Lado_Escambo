"use client";

import { Suspense, useState, type FormEvent } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, KeyRound, Loader2, Lock, LogIn, ShieldCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { redefinirSenha } from "@/lib/api/recuperacao-senha";

/**
 * Etapa 3 (e final) de "Esqueci minha senha". Lê o `token` gerado na etapa 2
 * via `useSearchParams` — mesmo padrão de `Suspense` de `/login` e
 * `/esqueci-senha/verificar`. Sucesso é um estado dentro desta mesma tela
 * (não uma 4ª rota), seguindo o padrão já usado em Cadastro/Anunciar.
 */
export default function NovaSenhaPage() {
  return (
    <Suspense fallback={null}>
      <NovaSenhaConteudo />
    </Suspense>
  );
}

function NovaSenhaConteudo() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";

  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [sucesso, setSucesso] = useState(false);

  if (!token) {
    return (
      <div className="page-container flex max-w-md flex-col items-center py-16 text-center">
        <h1 className="mb-2 font-display text-xl font-bold text-foreground">Link de redefinição inválido</h1>
        <p className="mb-6 text-muted-foreground">
          Solicite a recuperação de senha novamente para gerar um novo link.
        </p>
        <Button asChild size="lg">
          <Link href="/esqueci-senha">Esqueci minha senha</Link>
        </Button>
      </div>
    );
  }

  if (sucesso) {
    return (
      <div className="page-container flex max-w-md flex-col items-center py-16 text-center">
        <div className="mb-5 flex size-16 items-center justify-center rounded-full bg-success text-success-foreground">
          <CheckCircle2 className="size-8" />
        </div>
        <h1 className="mb-2 font-display text-xl font-bold text-foreground">Senha redefinida!</h1>
        <p className="mb-6 text-muted-foreground">
          Sua senha foi alterada com sucesso. Entre com a nova senha para continuar.
        </p>
        <Button asChild size="lg" className="w-full">
          <Link href="/login">
            <LogIn className="size-5" />
            Ir para o Login
          </Link>
        </Button>
      </div>
    );
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (novaSenha.length < 8) {
      setErro("A nova senha precisa ter pelo menos 8 caracteres.");
      return;
    }
    if (novaSenha !== confirmarSenha) {
      setErro("As senhas não coincidem.");
      return;
    }

    setEnviando(true);
    setErro(null);
    const resultado = await redefinirSenha({ tokenRedefinicao: token, novaSenha });
    setEnviando(false);

    if (!resultado.ok) {
      setErro(resultado.erro);
      return;
    }

    setSucesso(true);
  }

  return (
    <div className="page-container max-w-xl py-4 pb-14">
      <div className="mb-4 flex w-fit items-center gap-1.5 rounded-full bg-primary-container/25 px-3 py-1.5">
        <ShieldCheck className="size-4 text-primary" />
        <span className="font-display text-xs font-bold tracking-wide text-primary">Recuperar Acesso</span>
      </div>

      <header className="mb-6">
        <div className="mb-2 inline-flex items-center gap-2">
          <span className="size-2.5 rounded-full bg-primary" />
          <span className="font-display text-xs font-bold uppercase tracking-wider text-primary">Última etapa</span>
        </div>
        <h1 className="mb-2 font-display text-2xl font-bold text-foreground">Defina sua nova senha</h1>
        <p className="text-muted-foreground">Escolha uma senha com pelo menos 8 caracteres.</p>
      </header>

      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="novaSenha">Nova senha</Label>
          <div className="relative flex items-center">
            <Input
              id="novaSenha"
              name="novaSenha"
              type="password"
              placeholder="Mínimo de 8 caracteres"
              className="pr-12"
              required
              value={novaSenha}
              onChange={(e) => setNovaSenha(e.target.value)}
            />
            <Lock className="pointer-events-none absolute right-4 size-5 text-muted-foreground" />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="confirmarSenha">Confirmar nova senha</Label>
          <div className="relative flex items-center">
            <Input
              id="confirmarSenha"
              name="confirmarSenha"
              type="password"
              placeholder="Repita a nova senha"
              className="pr-12"
              required
              value={confirmarSenha}
              onChange={(e) => setConfirmarSenha(e.target.value)}
            />
            <KeyRound className="pointer-events-none absolute right-4 size-5 text-muted-foreground" />
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
              Salvando...
            </>
          ) : (
            "Redefinir senha"
          )}
        </Button>
      </form>
    </div>
  );
}
