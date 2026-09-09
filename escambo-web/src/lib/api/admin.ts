import { MOCK_ANUNCIOS } from "@/lib/mock/anuncios";
import { MOCK_DENUNCIAS } from "@/lib/mock/denuncias";
import { MOCK_USUARIOS_ADMIN } from "@/lib/mock/usuarios-admin";
import type { Anuncio } from "@/types/anuncio";
import type { Denuncia } from "@/types/denuncia";
import type { Usuario } from "@/types/usuario";
import { simulateLatency } from "./config";

/**
 * Camada de facilitação do Painel Admin (Etapa 4). Segue o mesmo padrão de
 * `src/lib/api/anuncios.ts`/`usuarios.ts`: hoje lê dados mock com latência
 * simulada; no backend real vira `fetch` para endpoints protegidos por
 * papel `admin` (o próprio `AuthProvider`/`AdminLayout` já fazem esse gate
 * no client — o backend real precisa repetir a checagem no servidor).
 *
 * As ações de moderação (`getUsuariosAdmin`, `getAnunciosAdmin`,
 * `getDenuncias`) devolvem só uma cópia snapshot — cada tela do Admin
 * guarda o resultado em `useState` próprio e aplica as mudanças (suspender,
 * destacar, resolver...) só localmente, sem persistir de volta aqui. Isso
 * é consistente com o resto do app (`criarAnuncio`/`criarUsuario` também
 * não persistem) e documentado tela a tela.
 */

export interface MetricasAdmin {
  totalUsuarios: number;
  usuariosSuspensos: number;
  anunciosAtivos: number;
  trocasConcluidas: number;
  denunciasPendentes: number;
}

export async function getMetricasAdmin(): Promise<MetricasAdmin> {
  await simulateLatency();

  return {
    totalUsuarios: MOCK_USUARIOS_ADMIN.filter((u) => u.papel === "usuario").length,
    usuariosSuspensos: MOCK_USUARIOS_ADMIN.filter((u) => u.status === "suspenso").length,
    anunciosAtivos: MOCK_ANUNCIOS.filter((a) => a.status !== "trocado").length,
    trocasConcluidas: MOCK_ANUNCIOS.filter((a) => a.status === "trocado").length,
    denunciasPendentes: MOCK_DENUNCIAS.filter((d) => d.status === "pendente").length,
  };
}

export async function getUsuariosAdmin(): Promise<Usuario[]> {
  await simulateLatency();
  return [...MOCK_USUARIOS_ADMIN];
}

export async function getAnunciosAdmin(): Promise<Anuncio[]> {
  await simulateLatency();
  return [...MOCK_ANUNCIOS];
}

export async function getDenuncias(): Promise<Denuncia[]> {
  await simulateLatency();
  return [...MOCK_DENUNCIAS];
}
