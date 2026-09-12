/**
 * Persistência client-only do fluxo "Esqueci minha senha" (mock — Fase M).
 *
 * Duas coisas diferentes moram aqui, de propósito em armazenamentos
 * diferentes:
 *
 * 1. O código/token de uma recuperação EM ANDAMENTO — `sessionStorage`:
 *    efêmero de propósito (não deve sobreviver a fechar a aba/navegador,
 *    diferente de uma senha, que deve).
 * 2. A senha em si, quando redefinida com sucesso — `localStorage`, mesmo
 *    espírito de `src/lib/anuncios-usuario.ts`: sobrepõe (override) a senha
 *    mock fixa de `CREDENCIAIS_MOCK` para o próximo login já funcionar com a
 *    senha nova, sem precisar de backend nenhum.
 *
 * Nada disto substitui um backend de verdade — existe só para o fluxo
 * funcionar de ponta a ponta no protótipo. No FastAPI real:
 *   - o código vai por e-mail de verdade e NUNCA volta numa resposta HTTP;
 *   - o "token de redefinição" é assinado (ex.: JWT de curta duração) e
 *     validado no servidor — não fica guardado no `sessionStorage` do
 *     próprio cliente, que qualquer um pode inspecionar/editar;
 *   - a senha nova é hasheada (bcrypt/argon2) antes de persistir — nunca
 *     comparada ou guardada em texto puro como aqui;
 *   - o backend deve limitar tentativas de código (rate limit) e invalidar
 *     códigos/tokens não usados depois de expirar, o que aqui é só um
 *     timestamp checado no client.
 */

const PENDENTE_KEY = "escambo_recuperacao_senha_pendente";
const OVERRIDES_KEY = "escambo_senha_overrides";
const VALIDADE_CODIGO_MS = 10 * 60 * 1000; // 10 minutos
const VALIDADE_TOKEN_MS = 15 * 60 * 1000; // 15 minutos

interface RecuperacaoPendente {
  email: string;
  codigo: string;
  expiraEm: number;
  tokenRedefinicao?: string;
  tokenExpiraEm?: number;
}

function gerarCodigo(): string {
  return String(Math.floor(100000 + Math.random() * 900000));
}

function gerarToken(): string {
  return `rst_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}

function lerPendente(): RecuperacaoPendente | null {
  if (typeof window === "undefined") return null;
  try {
    const bruto = window.sessionStorage.getItem(PENDENTE_KEY);
    return bruto ? (JSON.parse(bruto) as RecuperacaoPendente) : null;
  } catch {
    return null;
  }
}

function salvarPendente(pendente: RecuperacaoPendente) {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.setItem(PENDENTE_KEY, JSON.stringify(pendente));
  } catch {
    // sessionStorage indisponível — o fluxo simplesmente não avança, sem quebrar a tela.
  }
}

/** Gera e guarda um novo código de 6 dígitos para o e-mail informado (etapa 1). */
export function iniciarRecuperacaoPendente(email: string): string {
  const codigo = gerarCodigo();
  salvarPendente({ email: email.toLowerCase(), codigo, expiraEm: Date.now() + VALIDADE_CODIGO_MS });
  return codigo;
}

/** Confere o código digitado (etapa 2); se bater, já gera e guarda o token da etapa 3. */
export function conferirCodigoPendente(email: string, codigo: string): string | null {
  const pendente = lerPendente();
  if (!pendente) return null;
  if (pendente.email !== email.toLowerCase()) return null;
  if (Date.now() > pendente.expiraEm) return null;
  if (pendente.codigo !== codigo.trim()) return null;

  const token = gerarToken();
  salvarPendente({ ...pendente, tokenRedefinicao: token, tokenExpiraEm: Date.now() + VALIDADE_TOKEN_MS });
  return token;
}

/** Confere o token da etapa final (etapa 3) e devolve o e-mail associado, para gravar a senha nova. */
export function conferirTokenRedefinicao(token: string): string | null {
  const pendente = lerPendente();
  if (!pendente || !pendente.tokenRedefinicao || !pendente.tokenExpiraEm) return null;
  if (pendente.tokenRedefinicao !== token) return null;
  if (Date.now() > pendente.tokenExpiraEm) return null;
  return pendente.email;
}

/** Encerra a recuperação em andamento (chamado depois de redefinir com sucesso). */
export function finalizarRecuperacao() {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.removeItem(PENDENTE_KEY);
  } catch {
    // ignora — não há mais nada a limpar de qualquer forma.
  }
}

/** Sobrepõe a senha mock de um e-mail — mesmo espírito de `anuncios-usuario.ts`. */
export function salvarOverrideSenha(email: string, novaSenha: string) {
  if (typeof window === "undefined") return;
  try {
    const bruto = window.localStorage.getItem(OVERRIDES_KEY);
    const mapa = bruto ? (JSON.parse(bruto) as Record<string, string>) : {};
    mapa[email.toLowerCase()] = novaSenha;
    window.localStorage.setItem(OVERRIDES_KEY, JSON.stringify(mapa));
  } catch {
    // sem localStorage, a senha nova só vale até recarregar a página — aceitável no protótipo.
  }
}

/** Lê a senha redefinida (se houver) para sobrepor a mock fixa no login. */
export function lerOverrideSenha(email: string): string | null {
  if (typeof window === "undefined") return null;
  try {
    const bruto = window.localStorage.getItem(OVERRIDES_KEY);
    if (!bruto) return null;
    const mapa = JSON.parse(bruto) as Record<string, string>;
    return mapa[email.toLowerCase()] ?? null;
  } catch {
    return null;
  }
}
