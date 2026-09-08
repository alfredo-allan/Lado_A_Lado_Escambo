import { Plus_Jakarta_Sans, Inter } from "next/font/google";

/**
 * Plus Jakarta Sans - títulos, labels, badges e valores (DESIGN.md > Typography).
 * Pesos 600/700/800 usados em headline-* e label-*.
 */
export const fontJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  variable: "--font-jakarta",
  display: "swap",
});

/**
 * Inter - corpo de texto, descrições e dados técnicos (peso/raça/estado).
 * Alta legibilidade em x-height para leitura a pleno sol.
 */
export const fontInter = Inter({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-inter",
  display: "swap",
});
