import type { Usuario } from "@/types/usuario";
import { ADMIN_ATUAL_MOCK, USUARIO_ATUAL_MOCK } from "@/lib/mock/usuario-atual";

/**
 * Base de usuários para a Central de Usuários do Admin (Etapa 4). Reaproveita
 * as duas contas "logáveis" (`USUARIO_ATUAL_MOCK`, `ADMIN_ATUAL_MOCK`) e
 * promove os vendedores já usados em `MOCK_ANUNCIOS` (que lá só têm um
 * subconjunto de campos, via `Vendedor`) a registros completos de `Usuario`
 * — mais um usuário fictício já suspenso, pra a tela de moderação ter algo
 * de verdade pra mostrar/reverter.
 */
export const MOCK_USUARIOS_ADMIN: Usuario[] = [
  USUARIO_ATUAL_MOCK,
  ADMIN_ATUAL_MOCK,
  {
    id: "usr_marcia-sp",
    nome: "Márcia Oliveira",
    email: "marcia.oliveira@exemplo.com.br",
    telefone: "(11) 97777-2233",
    cpfMascarado: "***.223.344-**",
    estado: "SP",
    municipio: "São Paulo",
    criadoEm: "2024-08-15T00:00:00.000Z",
    verificado: true,
    reputacao: { nota: 4.9, trocasConcluidas: 17 },
    papel: "usuario",
    status: "ativo",
  },
  {
    id: "usr_joao-poa",
    nome: "João Pedro Alves",
    email: "joao.alves@exemplo.com.br",
    telefone: "(51) 98888-1122",
    cpfMascarado: "***.556.677-**",
    estado: "RS",
    municipio: "Porto Alegre",
    criadoEm: "2026-01-10T00:00:00.000Z",
    verificado: true,
    reputacao: { nota: 5.0, trocasConcluidas: 9 },
    papel: "usuario",
    status: "ativo",
  },
  {
    id: "usr_ana-feira-santana",
    nome: "Ana Beatriz Souza",
    email: "ana.souza@exemplo.com.br",
    telefone: "(75) 99999-3344",
    cpfMascarado: "***.889.900-**",
    estado: "BA",
    municipio: "Feira de Santana",
    criadoEm: "2026-05-02T00:00:00.000Z",
    verificado: false,
    reputacao: { nota: 4.7, trocasConcluidas: 5 },
    papel: "usuario",
    status: "ativo",
  },
  {
    id: "usr_pedro-suspenso",
    nome: "Pedro Almeida",
    email: "pedro.almeida@exemplo.com.br",
    telefone: "(21) 96666-5544",
    cpfMascarado: "***.001.122-**",
    estado: "RJ",
    municipio: "Rio de Janeiro",
    criadoEm: "2026-08-20T00:00:00.000Z",
    verificado: false,
    reputacao: { nota: 2.1, trocasConcluidas: 1 },
    papel: "usuario",
    status: "suspenso",
  },
];
