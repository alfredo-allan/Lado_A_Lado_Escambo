"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

import { loginUsuario } from "@/lib/api/usuarios";
import { CREDENCIAIS_MOCK } from "@/lib/mock/usuario-atual";
import type { LoginResultado, PapelUsuario, Usuario } from "@/types/usuario";

const STORAGE_KEY = "escambo_sessao_usuario_id";

/** Grava/limpa a sessão em `localStorage` — função top-level (sem closures) de propósito, para não precisar entrar em nenhum array de dependências de hook. */
function persistirSessao(usuario: Usuario | null) {
  try {
    if (usuario) {
      window.localStorage.setItem(STORAGE_KEY, usuario.id);
    } else {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  } catch {
    // localStorage indisponível (aba anônima, navegador bloqueando cookies/storage etc.)
    // — a sessão simplesmente não sobrevive a um refresh, sem quebrar a navegação.
  }
}

interface AuthContextValue {
  usuario: Usuario | null;
  /** Atalho para `usuario?.papel` — `null` quando deslogado. */
  papel: PapelUsuario | null;
  /** `true` só durante a reidratação inicial da sessão salva (evita "piscar" deslogado). */
  carregando: boolean;
  /** Login real via formulário — valida e-mail/senha contra as contas mock (ver `src/lib/api/usuarios.ts`). */
  login: (email: string, senha: string) => Promise<LoginResultado>;
  /** Atalho de demonstração: entra direto com a conta de Usuário ou de Administrador, sem senha. */
  loginComo: (papel: PapelUsuario) => void;
  /** Usado pelo Cadastro: já abre sessão com o usuário recém-criado, sem exigir login em seguida. */
  entrarComUsuario: (usuario: Usuario) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

/**
 * Contexto de sessão do Escambo (Etapa 4). Controla o que Usuário comum e
 * Administrador enxergam no app — hoje 100% mock (contas fixas em
 * `src/lib/mock/usuario-atual.ts`), persistido só em `localStorage` deste
 * navegador (não é um cookie httpOnly de verdade). Ao integrar o backend
 * real, a troca fica isolada aqui: `login`/`loginComo`/`logout` passam a
 * chamar endpoints de sessão de verdade — nenhuma tela que usa `useAuth()`
 * ou `useUsuarioAtual()` (ver `src/lib/auth.ts`) precisa mudar.
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    // Reidratação da sessão salva em `localStorage` — precisa rodar num
    // efeito (não num inicializador de `useState`) porque só existe
    // `window` no client: lido durante a renderização, quebraria o SSR e
    // causaria mismatch de hidratação. `carregando` cobre o instante entre
    // a primeira pintura (sempre deslogado) e este efeito rodar.
    try {
      const idSalvo = window.localStorage.getItem(STORAGE_KEY);
      const credencial = idSalvo ? CREDENCIAIS_MOCK.find((c) => c.usuario.id === idSalvo) : undefined;
      if (credencial) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setUsuario(credencial.usuario);
      }
    } catch {
      // segue deslogado
    } finally {
      setCarregando(false);
    }
  }, []);

  const login = useCallback(async (email: string, senha: string): Promise<LoginResultado> => {
    const resultado = await loginUsuario({ email, senha });
    if (resultado.ok) {
      setUsuario(resultado.usuario);
      persistirSessao(resultado.usuario);
    }
    return resultado;
  }, []);

  const loginComo = useCallback((papelDesejado: PapelUsuario) => {
    const credencial = CREDENCIAIS_MOCK.find((c) => c.usuario.papel === papelDesejado);
    if (!credencial) return;
    setUsuario(credencial.usuario);
    persistirSessao(credencial.usuario);
  }, []);

  const entrarComUsuario = useCallback((novoUsuario: Usuario) => {
    setUsuario(novoUsuario);
    persistirSessao(novoUsuario);
  }, []);

  const logout = useCallback(() => {
    setUsuario(null);
    persistirSessao(null);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      usuario,
      papel: usuario?.papel ?? null,
      carregando,
      login,
      loginComo,
      entrarComUsuario,
      logout,
    }),
    [usuario, carregando, login, loginComo, entrarComUsuario, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const contexto = useContext(AuthContext);
  if (!contexto) {
    throw new Error("useAuth() precisa ser chamado dentro de <AuthProvider> (ver src/app/layout.tsx).");
  }
  return contexto;
}
