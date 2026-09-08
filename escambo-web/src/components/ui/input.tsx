import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * Input de 56px (h-14) — DESIGN.md > Components > 4. Inputs & Selection
 * Controls ("52px height" no spec original; arredondado para a escala de
 * toque de 56px já usada em outros elementos do app).
 */
function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "flex h-14 w-full rounded-xl border-[1.5px] border-input bg-card px-4 text-base text-foreground shadow-card outline-none transition-all placeholder:text-muted-foreground/80 selection:bg-primary selection:text-primary-foreground focus-visible:border-primary focus-visible:ring-[3px] focus-visible:ring-ring/30 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        className,
      )}
      {...props}
    />
  );
}

export { Input };
