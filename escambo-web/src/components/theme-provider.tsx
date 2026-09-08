"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import type { ThemeProviderProps } from "next-themes";

/**
 * Contexto de tema dinâmico do Escambo.
 *
 * - `attribute="class"`      -> alterna a classe `.dark` no <html>, consumida
 *                               pelas variáveis CSS em `globals.css`.
 * - `defaultTheme="system"`  -> respeita a preferência do aparelho no
 *                               primeiro acesso ("auto").
 * - `enableSystem`           -> permite ao usuário escolher "Automático"
 *                               explicitamente (ver <ThemeToggle />).
 */
export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
      {...props}
    >
      {children}
    </NextThemesProvider>
  );
}
