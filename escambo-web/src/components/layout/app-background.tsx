/**
 * Fundo decorativo global do Escambo — massas orgânicas verde/amarelo no
 * topo e ondas azuis na base, atrás de todo o conteúdo do app.
 *
 * Decisões (confirmadas com o usuário):
 * - As cores NÃO são hardcoded: usam `hsl(var(--primary))`, `--secondary`,
 *   `--tertiary` (e as respectivas `-container`, mais claras) — os MESMOS
 *   tokens já usados em botões/badges/cards em `globals.css`. Isso garante
 *   consistência com o resto da identidade visual e faz o fundo acompanhar
 *   automaticamente o tema Claro/Escuro/Automático (os tokens já têm valor
 *   próprio em `:root` e `.dark`), sem precisar de nenhum hook de tema aqui.
 * - Opacidade propositalmente moderada: como o fundo aparece atrás do app
 *   inteiro (inclusive fotos de anúncio e listas de cards), cores muito
 *   saturadas brigariam com o conteúdo. Os valores abaixo foram calibrados
 *   para dar uma "lavagem" de cor perceptível nas bordas/vãos entre cards,
 *   sem comprometer a legibilidade do que fica por cima.
 * - `viewBox="0 0 390 844"` (proporção de smartphone) + `preserveAspectRatio
 *   ="xMidYMid slice"` faz o SVG preencher qualquer viewport cortando o
 *   excesso, sem esticar/deformar as curvas — funciona igual em mobile e
 *   desktop.
 */
export function AppBackground() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 390 844"
      preserveAspectRatio="xMidYMid slice"
      className="pointer-events-none fixed inset-0 z-0 size-full"
    >
      <defs>
        {/* Verde (topo-esquerda) — do `--primary` sólido até o `--primary-container`
            claro, esmaecendo para transparente (deixa o rect base aparecer). */}
        <linearGradient id="bgGreen" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="hsl(var(--primary))" />
          <stop offset="55%" stopColor="hsl(var(--primary-container))" />
          <stop offset="100%" stopColor="hsl(var(--primary-container))" stopOpacity="0" />
        </linearGradient>
        <radialGradient id="bgGreenGlow" cx="10%" cy="5%" r="75%">
          <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.7" />
          <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0" />
        </radialGradient>

        {/* Amarelo/dourado (topo-direita) — mesmo esquema, com `--secondary`. */}
        <linearGradient id="bgYellow" x1="1" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="hsl(var(--secondary))" />
          <stop offset="55%" stopColor="hsl(var(--secondary-container))" />
          <stop offset="100%" stopColor="hsl(var(--secondary-container))" stopOpacity="0" />
        </linearGradient>
        <radialGradient id="bgYellowGlow" cx="90%" cy="5%" r="75%">
          <stop offset="0%" stopColor="hsl(var(--secondary))" stopOpacity="0.7" />
          <stop offset="100%" stopColor="hsl(var(--secondary))" stopOpacity="0" />
        </radialGradient>

        {/* Azul (base) — três tons a partir de `--tertiary`/`-container`. */}
        <linearGradient id="bgBlue" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="hsl(var(--tertiary))" />
          <stop offset="100%" stopColor="hsl(var(--tertiary-container))" />
        </linearGradient>
        <linearGradient id="bgBlueSoft" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="hsl(var(--tertiary))" />
          <stop offset="100%" stopColor="hsl(var(--tertiary-container))" stopOpacity="0.4" />
        </linearGradient>

        {/* Realce central claro, funde verde/amarelo de volta ao fundo neutro. */}
        <radialGradient id="bgCenterFade" cx="50%" cy="20%" r="60%">
          <stop offset="0%" stopColor="hsl(var(--background))" stopOpacity="0.9" />
          <stop offset="100%" stopColor="hsl(var(--background))" stopOpacity="0" />
        </radialGradient>

        <filter id="bgSoftBlur" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="22" />
        </filter>
      </defs>

      {/* Base neutra — substitui o `bg-background` que antes ia direto no <body>. */}
      <rect width="390" height="844" fill="hsl(var(--background))" />

      {/* ===== Massa verde, canto superior esquerdo (onda descendo até ~38% da altura) ===== */}
      <path
        d="M 0 0 H 270 C 235 45 215 70 195 100 C 170 138 150 165 130 195 C 100 235 55 270 0 300 Z"
        fill="url(#bgGreen)"
        opacity="0.62"
      />
      <path
        d="M 0 0 H 225 C 195 55 165 95 135 130 C 105 165 60 195 0 220 Z"
        fill="url(#bgGreenGlow)"
        opacity="0.55"
        filter="url(#bgSoftBlur)"
      />

      {/* ===== Massa amarela, canto superior direito (espelha a verde) ===== */}
      <path
        d="M 190 0 H 390 V 330 C 350 300 320 265 290 235 C 260 205 235 185 205 155 C 180 130 160 110 145 95 C 165 60 180 30 190 0 Z"
        fill="url(#bgYellow)"
        opacity="0.62"
      />
      <path
        d="M 260 0 H 390 V 240 C 350 215 320 185 295 160 C 270 135 240 110 210 90 C 225 60 240 28 260 0 Z"
        fill="url(#bgYellowGlow)"
        opacity="0.55"
        filter="url(#bgSoftBlur)"
      />

      {/* ===== Área branca/central — funde as duas cores de volta ao neutro ===== */}
      <ellipse cx="195" cy="260" rx="195" ry="165" fill="url(#bgCenterFade)" />

      {/* ===== Ondas azuis, base da tela — 3 camadas para dar profundidade ===== */}
      <path
        d="M 0 620 C 55 600 95 625 135 655 C 180 690 230 700 285 680 C 330 662 360 640 390 610 V 844 H 0 Z"
        fill="url(#bgBlue)"
        opacity="0.55"
      />
      <path
        d="M 0 665 C 55 635 115 655 165 690 C 220 730 285 740 390 680 V 844 H 0 Z"
        fill="url(#bgBlueSoft)"
        opacity="0.4"
      />
      <path
        d="M 0 750 C 70 710 130 735 185 775 C 235 810 310 800 390 750 V 844 H 0 Z"
        fill="hsl(var(--tertiary))"
        opacity="0.32"
      />
    </svg>
  );
}
