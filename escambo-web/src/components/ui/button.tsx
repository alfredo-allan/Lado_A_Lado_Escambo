import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

/**
 * Variantes de botão do Escambo (DESIGN.md > Components > 1. Buttons).
 * Altura padrão de 52px (h-13) em "default" garante o alvo de toque mínimo
 * exigido para uso em campo (48-56px).
 */
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-display font-bold tracking-[0.01em] transition-colors disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 shrink-0 outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50",
  {
    variants: {
      variant: {
        // Ação primária: Propor Troca / Confirmar
        default:
          "bg-primary text-primary-foreground shadow-card hover:bg-primary/90 active:bg-primary/80",
        // Contraproposta / ação de destaque secundária
        secondary:
          "bg-secondary text-secondary-foreground shadow-card hover:bg-secondary/90",
        // Logística / verificação
        tertiary:
          "bg-tertiary text-tertiary-foreground shadow-card hover:bg-tertiary/90",
        destructive:
          "bg-destructive text-destructive-foreground shadow-card hover:bg-destructive/90",
        // Cancelar / Ver detalhes
        outline:
          "border-[1.5px] border-border bg-transparent text-primary hover:bg-primary-container",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        // 52px - altura de botão primário definida em DESIGN.md
        default: "h-[3.25rem] px-6 has-[>svg]:px-5",
        sm: "h-11 rounded-md px-4 has-[>svg]:px-3",
        lg: "h-14 rounded-xl px-8 text-base has-[>svg]:px-6",
        // 48px - alvo de toque mínimo (touch-min) para ações icon-only
        icon: "size-touch-min rounded-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
