import { CREDENCIAIS_MOCK } from "@/lib/mock/usuario-atual";
import type { CadastroInput, CadastroResultado, LoginInput, LoginResultado } from "@/types/usuario";
import { simulateLatency } from "./config";

/**
 * Envia o cadastro (Etapa 2). Vira `POST /usuarios` no backend Python, que
 * deve:
 *   1. revalidar CPF/e-mail/telefone no servidor (nunca confiar só no client);
 *   2. persistir o usuário com o CPF criptografado em repouso;
 *   3. gravar o registro de consentimento LGPD — versão dos Termos aceita +
 *      timestamp — em tabela de auditoria própria (ver `ConsentimentoLGPD`
 *      em `src/types/usuario.ts`), nunca só como um booleano solto;
 *   4. disparar e-mail de confirmação de cadastro.
 *
 * Aqui o mock só simula sucesso/erro local, sem persistir nada de verdade.
 */
export async function criarUsuario(input: CadastroInput): Promise<CadastroResultado> {
  await simulateLatency(600);

  if (!input.aceitouTermos) {
    return {
      ok: false,
      erro: "É necessário aceitar os Termos de Uso e a Política de Privacidade para concluir o cadastro.",
      campo: "aceitouTermos",
    };
  }

  const ultimoBloco = input.cpf.match(/(\d{3}-\d{2})$/)?.[1] ?? "***-**";

  return {
    ok: true,
    usuario: {
      id: `usr_${Date.now()}`,
      nome: input.nome,
      email: input.email,
      telefone: input.telefone,
      cpfMascarado: `***.***.${ultimoBloco}`,
      estado: input.estado,
      municipio: input.municipio,
      criadoEm: new Date().toISOString(),
      verificado: false,
      reputacao: { nota: 0, trocasConcluidas: 0 },
      papel: "usuario",
      status: "ativo",
    },
  };
}

/**
 * Login (Etapa 4). Vira `POST /login` no backend, que devolveria um cookie
 * httpOnly de sessão em vez de expor o usuário direto na resposta. Aqui o
 * mock valida contra `CREDENCIAIS_MOCK` (ver `src/lib/mock/usuario-atual.ts`)
 * — as duas contas de demonstração (usuário comum e admin).
 */
export async function loginUsuario(input: LoginInput): Promise<LoginResultado> {
  await simulateLatency(500);

  const email = input.email.trim().toLowerCase();
  const credencial = CREDENCIAIS_MOCK.find((c) => c.email.toLowerCase() === email);

  if (!credencial || credencial.senha !== input.senha) {
    return { ok: false, erro: "E-mail ou senha incorretos." };
  }

  if (credencial.usuario.status === "suspenso") {
    return { ok: false, erro: "Esta conta está suspensa. Entre em contato com o suporte." };
  }

  return { ok: true, usuario: credencial.usuario };
}
