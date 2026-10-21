import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

// Rótulo de status ou categoria. Não é clicável: sem hover, foco ou variantes de link.
// Anatomia como no Badge do Nitro: [ícone antes] texto [ícone depois]. Sem texto, vira
// "apenas ícone": um círculo com o ícone no centro, da mesma altura do badge com texto.
const badgeVariants = cva(
  "group/badge inline-flex w-fit shrink-0 items-center justify-center overflow-hidden rounded-pill border-default border-transparent whitespace-nowrap [&>svg]:pointer-events-none [&>svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-link-1 text-link-10",
        secondary: "bg-link-5 text-link-4",
        destructive: "bg-alerts-8 text-alerts-9",
        outline: "border-divider text-text-1",
      },
      size: {
        default: "gap-xs px-sm py-none typo-body-sm-regular [&>svg]:size-[12px] data-[icon-only=true]:size-[20px]",
        lg: "gap-xs px-sm py-xxs typo-body-md-regular [&>svg]:size-[16px] data-[icon-only=true]:size-[27px]",
        xl: "gap-sm px-md py-xs typo-body-lg-regular [&>svg]:size-[20px] data-[icon-only=true]:size-[34px]",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

/** Um ícone do lucide-react (ex.: CheckIcon) ou qualquer componente de ícone SVG. */
type BadgeIcon = React.ComponentType<React.SVGProps<SVGSVGElement>>

function Badge({
  className,
  variant = "default",
  size = "default",
  iconLeading: IconLeading,
  iconTrailing: IconTrailing,
  children,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & {
    /** Ícone antes do texto. Sem texto, o badge mostra só este ícone. */
    iconLeading?: BadgeIcon
    /** Ícone depois do texto. */
    iconTrailing?: BadgeIcon
  }) {
  const iconOnly = !children && Boolean(IconLeading || IconTrailing)
  return (
    <span
      data-slot="badge"
      data-variant={variant}
      data-size={size}
      data-icon-only={iconOnly || undefined}
      // apenas ícone: sem texto visível, o aria-label de quem usa descreve o status
      role={iconOnly ? "img" : undefined}
      className={cn(badgeVariants({ variant, size }), iconOnly && "p-none", className)}
      {...props}
    >
      {IconLeading && <IconLeading aria-hidden />}
      {children}
      {IconTrailing && !iconOnly && <IconTrailing aria-hidden />}
      {iconOnly && !IconLeading && IconTrailing && <IconTrailing aria-hidden />}
    </span>
  )
}

export { Badge, badgeVariants }
