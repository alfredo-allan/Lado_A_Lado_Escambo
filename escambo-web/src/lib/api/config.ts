/**
 * Camada de facilitação (data-access layer) do Escambo.
 *
 * Hoje toda função em `src/lib/api/*` lê dados mockados de `src/lib/mock/*`.
 * Quando o backend em Python (FastAPI) estiver no ar, a troca fica isolada
 * nesta pasta: cada função passa a fazer `fetch(`${API_BASE_URL}/...`)`
 * mantendo a MESMA assinatura (mesmos parâmetros, mesmo tipo de retorno em
 * `src/types/*`) — assim nenhuma tela precisa ser alterada.
 *
 * Padrão sugerido por endpoint, ao integrar:
 *
 *   const res = await fetch(`${API_BASE_URL}/anuncios/${id}`, { cache: "no-store" });
 *   if (!res.ok) throw new ApiError(res.status, await res.text());
 *   return (await res.json()) as Anuncio; // idealmente validado com zod
 */
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "";

/** true enquanto o backend Python não estiver integrado. */
export const USING_MOCK_DATA = true;

/** Simula latência de rede realista para os estados de loading não ficarem "mascarados". */
export function simulateLatency(ms = 350): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}
