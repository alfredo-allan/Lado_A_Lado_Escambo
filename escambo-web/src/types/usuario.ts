/**
 * Modelos de usuário e cadastro do Escambo.
 *
 * Espelham o formato esperado da futura API em Python (FastAPI + Pydantic).
 * Quando o backend estiver disponível, o ideal é gerar/sincronizar estes
 * tipos a partir dos schemas Pydantic (ex.: via openapi-typescript) em vez
 * de mantê-los manualmente — mas a FORMA deve continuar a mesma para que
 * `src/lib/api/usuarios.ts` troque de mock para fetch real sem quebrar as
 * telas que os consomem.
 */

/**
 * Todas as 26 UFs + Distrito Federal — o Escambo é uma plataforma nacional de
 * troca e reutilização de produtos variados, não restrita a uma região.
 */
export type UF =
  | "AC"
  | "AL"
  | "AP"
  | "AM"
  | "BA"
  | "CE"
  | "DF"
  | "ES"
  | "GO"
  | "MA"
  | "MT"
  | "MS"
  | "MG"
  | "PA"
  | "PB"
  | "PR"
  | "PE"
  | "PI"
  | "RJ"
  | "RN"
  | "RS"
  | "RO"
  | "RR"
  | "SC"
  | "SP"
  | "SE"
  | "TO";

export interface Usuario {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  /** CPF nunca é mantido/renderizado por completo no client após o cadastro. */
  cpfMascarado: string;
  estado: UF;
  municipio: string;
  /** ISO 8601 */
  criadoEm: string;
  verificado: boolean;
  reputacao: {
    nota: number;
    trocasConcluidas: number;
  };
}

/** Payload enviado pelo formulário de Cadastro (Etapa 2). */
export interface CadastroInput {
  nome: string;
  cpf: string;
  email: string;
  telefone: string;
  estado: UF;
  municipio: string;
  aceitouTermos: boolean;
}

/**
 * Registro de auditoria do aceite de Termos/Privacidade — exigido pela LGPD
 * (Lei 13.709/2018) para comprovar consentimento. No backend real isto vira
 * uma linha própria (não um campo solto no usuário), carimbada com a versão
 * exata do texto aceito.
 */
export interface ConsentimentoLGPD {
  usuarioId: string;
  versaoTermos: string;
  aceitoEm: string;
  finalidade: "cadastro_trocas";
}

export type CadastroResultado =
  | { ok: true; usuario: Usuario }
  | { ok: false; erro: string; campo?: keyof CadastroInput };
