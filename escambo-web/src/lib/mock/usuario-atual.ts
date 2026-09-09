import type { Usuario } from "@/types/usuario";

/**
 * Contas mock usadas para simular login (Etapa 4 — `src/lib/auth-context.tsx`).
 * `USUARIO_ATUAL_MOCK` é a conta de usuário comum (compradora/vendedora
 * comum da plataforma); `ADMIN_ATUAL_MOCK` é uma conta de equipe interna —
 * não existe fluxo de cadastro público que crie um Admin, só esta mock.
 * Quando o backend real existir, a troca é só no `AuthProvider`: em vez de
 * validar contra `CREDENCIAIS_MOCK`, ele chama a API de login de verdade.
 */
export const USUARIO_ATUAL_MOCK: Usuario = {
  id: "usr_voce",
  nome: "Camila Fernandes",
  email: "camila.fernandes@exemplo.com.br",
  telefone: "(11) 98888-7766",
  cpfMascarado: "***.456.789-**",
  estado: "SP",
  municipio: "São Paulo",
  criadoEm: "2025-11-02T00:00:00.000Z",
  verificado: true,
  reputacao: {
    nota: 4.8,
    trocasConcluidas: 6,
  },
  papel: "usuario",
  status: "ativo",
};

export const ADMIN_ATUAL_MOCK: Usuario = {
  id: "usr_admin",
  nome: "Rafael Nunes",
  email: "admin@escambo.com.br",
  telefone: "(11) 99222-1100",
  cpfMascarado: "***.112.233-**",
  estado: "SP",
  municipio: "São Paulo",
  criadoEm: "2025-06-10T00:00:00.000Z",
  verificado: true,
  reputacao: {
    nota: 5.0,
    trocasConcluidas: 0,
  },
  papel: "admin",
  status: "ativo",
};

/** Ids de `MOCK_ANUNCIOS` publicados pelo usuário atual, para a seção "Meus Anúncios" do Perfil. */
export const MEUS_ANUNCIOS_IDS = ["bicicleta-aro29-sao-paulo", "sofa-rack-feira-de-santana"];

/**
 * Credenciais mock para o formulário de `/login` — senha nunca é validada
 * com hash de verdade aqui (é um protótipo), só string exata. No backend
 * real isso vira uma chamada de autenticação de verdade (nunca comparar
 * senha em texto puro no client).
 */
export const CREDENCIAIS_MOCK: { email: string; senha: string; usuario: Usuario }[] = [
  { email: USUARIO_ATUAL_MOCK.email, senha: "escambo123", usuario: USUARIO_ATUAL_MOCK },
  { email: ADMIN_ATUAL_MOCK.email, senha: "admin123", usuario: ADMIN_ATUAL_MOCK },
];
