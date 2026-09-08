/**
 * Máscaras e validações de campos sensíveis do Cadastro (Etapa 2).
 *
 * A validação aqui é apenas a primeira barreira (feedback imediato em
 * campo/sem sinal). O backend em Python DEVE revalidar tudo — CPF, e-mail,
 * telefone — antes de persistir, e é ele quem decide o que fica
 * criptografado em repouso (CPF nunca deve ser armazenado em texto puro).
 */

export function maskCPF(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  return digits
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
}

export function maskTelefone(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  if (digits.length > 10) {
    return digits.replace(/(\d{2})(\d{5})(\d{0,4})/, (_match, ddd, prefixo, sufixo) =>
      sufixo ? `(${ddd}) ${prefixo}-${sufixo}` : `(${ddd}) ${prefixo}`,
    );
  }
  return digits
    .replace(/(\d{2})(\d)/, "($1) $2")
    .replace(/(\d{4})(\d{1,4})$/, "$1-$2");
}

/** Validação de CPF por dígito verificador (algoritmo padrão da Receita Federal). */
export function isValidCPF(value: string): boolean {
  const cpf = value.replace(/\D/g, "");
  if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;

  const calcularDigito = (base: string, fatorInicial: number) => {
    let total = 0;
    let fator = fatorInicial;
    for (const char of base) {
      total += Number(char) * fator;
      fator -= 1;
    }
    const resto = (total * 10) % 11;
    return resto === 10 ? 0 : resto;
  };

  const digito1 = calcularDigito(cpf.slice(0, 9), 10);
  const digito2 = calcularDigito(cpf.slice(0, 10), 11);
  return digito1 === Number(cpf[9]) && digito2 === Number(cpf[10]);
}

export function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

export function isValidTelefone(value: string): boolean {
  return value.replace(/\D/g, "").length >= 10;
}
