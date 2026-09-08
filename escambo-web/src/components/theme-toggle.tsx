"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { Laptop, Moon, Sun } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const OPTIONS = [
  { value: "light", label: "Claro", icon: Sun },
  { value: "dark", label: "Escuro", icon: Moon },
  { value: "system", label: "Automático", icon: Laptop },
] as const;

/**
 * Alternador de tema Light / Dark / Automático.
 * Renderiza apenas após montar no cliente para evitar mismatch de
 * hidratação (o tema resolvido depende de `prefers-color-scheme`).
 */
export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    // Guard proposital de hidratação: o tema resolvido (light/dark) só é
    // conhecido no cliente (depende de `prefers-color-scheme`/localStorage),
    // então adiamos a renderização do ícone real em um único tick pós-mount.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  const current = OPTIONS.find((o) => o.value === theme) ?? OPTIONS[2];
  const CurrentIcon = current.icon;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          aria-label="Alternar tema"
          className="text-foreground"
        >
          {mounted ? <CurrentIcon className="size-5" /> : <Sun className="size-5" />}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {OPTIONS.map(({ value, label, icon: Icon }) => (
          <DropdownMenuItem key={value} onClick={() => setTheme(value)}>
            <Icon className="size-4" />
            {label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
