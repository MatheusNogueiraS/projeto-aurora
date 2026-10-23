import * as React from "react"
import { XIcon } from "lucide-react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

import { IconButton } from "@/components/ui/icon-button"

// Rótulo de status ou categoria. Não é clicável: sem hover, seleção ou foco no badge.
// Anatomia como no Badge do Nitro: [indicador] [ícone] texto [x para remover]. Sem texto, vira
// "apenas ícone": um círculo com o ícone no centro, da mesma altura do badge com texto.
// Cores como no Design System CB, com os pares de cor do Alert: neutro (cinza) é o padrão;
// primary (laranja), secondary (roxo), success (verde), warning (amarelo), destructive (vermelho)
// e outline. A única ação possível é remover: o x é o nosso IconButton.
const badgeVariants = cva(
  "group/badge inline-flex w-fit shrink-0 items-center justify-center overflow-hidden rounded-pill border-default border-transparent whitespace-nowrap [&>svg]:pointer-events-none [&>svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-background-4 text-text-2",
        primary: "bg-link-1 text-link-10",
        secondary: "bg-link-5 text-link-4",
        success: "bg-alerts-2 text-alerts-3",
        warning: "bg-alerts-5 text-alerts-6",
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

// tamanho do x de remover, acompanhando o badge (ícone um passo menor que o do badge)
const removeStyle = {
  default: cn("size-[16px] [&_svg:not([class*='size-'])]:size-[10px]"),
  lg: cn("size-[20px] [&_svg:not([class*='size-'])]:size-[12px]"),
  xl: cn("size-[24px] [&_svg:not([class*='size-'])]:size-[16px]"),
}

/** Um ícone do lucide-react (ex.: CheckIcon) ou qualquer componente de ícone SVG. */
type BadgeIcon = React.ComponentType<React.SVGProps<SVGSVGElement>>

function Badge({
  className,
  variant = "default",
  size = "default",
  iconLeading: IconLeading,
  dot = false,
  onRemove,
  removeLabel = "Remover",
  children,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & {
    /** Ícone antes do texto. Sem texto, o badge mostra só este ícone (use aria-label). */
    iconLeading?: BadgeIcon
    /** Ponto na cor do badge antes do texto (ex.: status ativo). */
    dot?: boolean
    /** Mostra o x para remover e é chamado ao clicar nele. */
    onRemove?: () => void
    /** Nome do x para o leitor de tela (padrão: "Remover"). */
    removeLabel?: string
  }) {
  const iconOnly = !children && Boolean(IconLeading)
  const removable = Boolean(onRemove) && !iconOnly
  const removeSize = removeStyle[size ?? "default"]
  return (
    <span
      data-slot="badge"
      data-variant={variant}
      data-size={size}
      data-icon-only={iconOnly || undefined}
      // apenas ícone: sem texto visível, o aria-label de quem usa descreve o status
      role={iconOnly ? "img" : undefined}
      className={cn(badgeVariants({ variant, size }), iconOnly && "p-none", removable && "pr-xxs", className)}
      {...props}
    >
      {dot && !iconOnly && <span aria-hidden data-slot="badge-dot" className="size-[6px] shrink-0 rounded-pill bg-current" />}
      {IconLeading && <IconLeading aria-hidden />}
      {children}
      {removable && (
        <IconButton
          variant="ghost"
          size="xs"
          aria-label={removeLabel}
          onClick={onRemove}
          className={cn("-mr-xxs text-current hover:bg-current/xs", removeSize)}
        >
          <XIcon />
        </IconButton>
      )}
    </span>
  )
}

export { Badge, badgeVariants }
