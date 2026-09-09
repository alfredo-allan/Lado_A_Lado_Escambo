"use client";

import { useAuth } from "@/lib/auth-context";
import type { Usuario } from "@/types/usuario";

/**
 * Facilitação de autenticação (Etapa 2 → Etapa 4).
 *
 * Regra de produto definida para o app: NAVEGAR é livre (qualquer visitante
 * pode ver a Vitrine e o Detalhe do Anúncio), mas INTERAGIR — propor troca,
 * conversar com o vendedor, publicar um anúncio — exige sessão (cadastro ou
 * login concluídos).
 *
 * Este hook agora lê a sessão real do `AuthProvider` (`src/lib/auth-context.tsx`)
 * — deixou de devolver sempre `null`. Mantido como um wrapper fino (em vez de
 * apagar e trocar todo mundo por `useAuth()` direto) só para não obrigar a
 * reescrever as telas que já chamavam `useUsuarioAtual()`; para login/logout
 * e o papel (usuário/admin), use `useAuth()` diretamente.
 */
export function useUsuarioAtual(): { usuario: Usuario | null; carregando: boolean } {
  const { usuario, carregando } = useAuth();
  return { usuario, carregando };
}
