import { CREDENCIAIS_MOCK } from "@/lib/mock/usuario-atual";
import {
  conferirCodigoPendente,
  conferirTokenRedefinicao,
  finalizarRecuperacao,
  iniciarRecuperacaoPendente,
  salvarOverrideSenha,
} from "@/lib/senha-recuperacao";
import type {
  RedefinirSenhaInput,
  RedefinirSenhaResultado,
  SolicitarRecuperacaoInput,
  SolicitarRecuperacaoResultado,
  VerificarCodigoInput,
  VerificarCodigoResultado,
} from "@/types/usuario";
import { simulateLatency } from "./config";

/**
 * Recuperação de senha ("Esqueci minha senha", `/esqueci-senha`) — 3 funções
 * que viram 3 endpoints no backend real:
 *
 *   POST /senha/recuperacao/solicitar   { email }          -> sempre 200
 *   POST /senha/recuperacao/verificar   { email, codigo }  -> token
 *   POST /senha/recuperacao/redefinir   { token, novaSenha } -> 200/erro
 *
 * Ver `src/lib/senha-recuperacao.ts` para onde o mock guarda o código/token
 * pendente e a lista de cuidados de segurança que o backend real precisa
 * cobrir (nunca devolver o código na resposta, expirar/limitar tentativas,
 * hashear a senha).
 */

/**
 * Etapa 1. Resposta sempre "ok", exista ou não a conta — evita que alguém
 * descubra quais e-mails têm cadastro só testando este formulário
 * (ataque de enumeração de contas). `codigoDemo` só vem preenchido quando a
 * conta existe (senão não haveria o que digitar na etapa 2) e só existe
 * nesta fase sem servidor de e-mail — ver o comentário no tipo em
 * `src/types/usuario.ts`.
 */
export async function solicitarRecuperacaoSenha(
  input: SolicitarRecuperacaoInput,
): Promise<SolicitarRecuperacaoResultado> {
  await simulateLatency(700);

  const email = input.email.trim().toLowerCase();
  const existe = CREDENCIAIS_MOCK.some((c) => c.email.toLowerCase() === email);

  if (!existe) {
    return { ok: true };
  }

  const codigoDemo = iniciarRecuperacaoPendente(email);
  return { ok: true, codigoDemo };
}

/** Etapa 2. Código certo dentro da validade -> devolve o token de curta duração da etapa 3. */
export async function verificarCodigoRecuperacao(input: VerificarCodigoInput): Promise<VerificarCodigoResultado> {
  await simulateLatency(500);

  const token = conferirCodigoPendente(input.email.trim().toLowerCase(), input.codigo);
  if (!token) {
    return { ok: false, erro: "Código inválido ou expirado. Confira o número ou peça um novo código." };
  }
  return { ok: true, tokenRedefinicao: token };
}

/** Etapa 3. Token válido -> grava a senha nova (override mock) e encerra a recuperação. */
export async function redefinirSenha(input: RedefinirSenhaInput): Promise<RedefinirSenhaResultado> {
  await simulateLatency(600);

  const email = conferirTokenRedefinicao(input.tokenRedefinicao);
  if (!email) {
    return { ok: false, erro: "Este link de redefinição não é mais válido. Solicite a recuperação novamente." };
  }

  if (input.novaSenha.length < 8) {
    return { ok: false, erro: "A nova senha precisa ter pelo menos 8 caracteres." };
  }

  salvarOverrideSenha(email, input.novaSenha);
  finalizarRecuperacao();
  return { ok: true };
}
