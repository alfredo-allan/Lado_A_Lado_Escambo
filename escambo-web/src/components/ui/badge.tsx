import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

/**
 * Selos/chips de status (DESIGN.md > Components > 2. Barter Status Chips).
 * `success`/`tertiary`/`secondary` mapeiam "Disponível" / "Em Negociação" /
 * "Troca por...".
 */
const badgeVariants = cva(
  "inline-flex w-fit shrink-0 items-center gap-1 whitespace-nowrap rounded-full px-2.5 py-1 font-display text-[11px] font-bold uppercase tracking-wide [&_svg]:pointer-events-none [&_svg]:size-3.5",
  {
    variants: {
      variant: {
        success: "bg-success text-success-foreground",
        primary: "bg-primary-container text-primary-container-foreground",
        secondary: "bg-secondary-container text-secondary-container-foreground",
        tertiary: "bg-tertiary-container text-tertiary-container-foreground",
        warning: "bg-warning text-warning-foreground",
        neutral: "bg-muted text-muted-foreground",
        outline: "border border-border bg-card text-foreground",
      },
    },
    defaultVariants: { variant: "neutral" },
  },
);

function Badge({
  className,
  variant,
  ...props
}: React.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return <span data-slot="badge" className={cn(badgeVariants({ variant, className }))} {...props} />;
}

export { Badge, badgeVariants };
