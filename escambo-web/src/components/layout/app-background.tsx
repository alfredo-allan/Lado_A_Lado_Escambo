/**
 * Fundo decorativo global do Escambo — v5: duas imagens PNG reais, não SVG.
 *
 * Histórico: v1-v2 usaram um SVG desenhado à mão (curvas Bézier, tokens de
 * tema depois cores fixas). v3 foi rejeitada pelo usuário por baixa
 * fidelidade ("horrível", "muito longe"). v4 reconstruiu os contornos do
 * SVG por medição de pixels da imagem de referência (numpy/PIL), o que
 * resolveu o bug de sobreposição verde/dourado e o formato invertido da
 * onda azul, mas ainda era uma aproximação vetorial da referência.
 *
 * O usuário decidiu então abandonar o SVG por completo: recortou a própria
 * imagem de referência idealizada pelo gerente em dois frames PNG com
 * fundo transparente (alfa com esmaecimento suave nas bordas, não corte
 * duro) — um para o topo da tela (verde/dourado + trama de pontos) e outro
 * para a base (onda azul) — e pediu para renderizá-los diretamente,
 * responsivos para mobile, no lugar do SVG. Isso elimina de vez a
 * necessidade de reproduzir curvas/gradientes à mão: a imagem É a
 * referência.
 *
 * Implementação:
 * - `public/bg-top.png` (912×863) e `public/bg-low.png` (912×490) —
 *   arquivos fornecidos pelo usuário (já inseridos por ele em `public/`),
 *   com transparência real (alfa 0-255,
 *   confirmado via PIL) já esmaecendo suavemente para fora da área
 *   colorida — não precisam de gradiente/blur adicional para dissolver no
 *   creme de fundo.
 * - Cada imagem fica num contêiner de altura limitada por `clamp(...)`
 *   (mistura px mínimo/máximo com unidade de viewport) ancorado no topo ou
 *   na base da tela, com `object-fit: cover` e `object-position` voltado
 *   para a borda externa — reproduz o efeito de "cortar o excesso sem
 *   esticar" que o `preserveAspectRatio="xMidYMid slice"` do SVG antigo
 *   dava, agora com uma imagem raster.
 * - A cor de fundo creme de base (`#F4F6E8`, medida por amostragem de
 *   pixel na própria referência) voltou para `body` em `globals.css`, já
 *   que não há mais um `<rect>` de SVG para pintá-la.
 * - Sem hook de tema (mesma decisão de sempre: é um asset de marca fixo,
 *   igual em Claro/Escuro).
 */

export function AppBackground() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <div
        className="absolute inset-x-0 top-0"
        style={{ height: "clamp(260px, 44vh, 420px)" }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element -- asset decorativo estático, sem otimização necessária */}
        <img
          src="/bg-top.png"
          alt=""
          className="size-full object-cover object-top"
        />
      </div>
      <div
        className="absolute inset-x-0 bottom-0"
        style={{ height: "clamp(190px, 30vh, 300px)" }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element -- asset decorativo estático, sem otimização necessária */}
        <img
          src="/bg-low.png"
          alt=""
          className="size-full object-cover object-bottom"
        />
      </div>
    </div>
  );
}
