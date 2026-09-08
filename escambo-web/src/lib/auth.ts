"use client";

import { useState } from "react";
import type { Usuario } from "@/types/usuario";

/**
 * Facilitação de autenticação (Etapa 2 → backend).
 *
 * Regra de produto definida para o app: NAVEGAR é livre (qualquer visitante
 * pode ver a Vitrine e o Detalhe do Anúncio), mas INTERAGIR — propor troca,
 * conversar com o vendedor — exige cadastro concluído (com termos LGPD
 * assinados).
 *
 * Hoje não existe sessão real: este hook sempre devolve `usuario: null`,
 * simulando um visitante deslogado, para que as telas já apliquem essa regra
 * de gate. Ao integrar o backend, troque a implementação por uma leitura de
 * sessão de verdade (cookie httpOnly + endpoint `/me`, por exemplo) mantendo
 * a mesma assinatura — nenhuma tela que chama `useUsuarioAtual()` precisa
 * mudar.
 */
export function useUsuarioAtual(): { usuario: Usuario | null; carregando: boolean } {
  const [usuario] = useState<Usuario | null>(null);
  return { usuario, carregando: false };
}
