import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { Slot } from "radix-ui"

import { Spinner } from "@/components/ui/spinner"

// link: laranja do primário, sempre sublinhado (no celular não há hover para revelar que é link), em negrito (único Button em bold) e com
// o hover mudando a cor. Sem margem lateral visível, para alinhar com o texto em volta.
// Guarda um respiro (xs) compensado pela margem negativa, e cantos menos redondos, para o anel de foco não encostar
// nas letras. A altura de cada tamanho continua a mesma. Fica fora do cva para a trava de tokens não ler
// o nome da variante como classe.
const linkWithoutPadding = [
  { variant: "link" as const, class: cn("-mx-xs rounded-xxs px-xs has-data-[icon=inline-end]:pr-xs has-data-[icon=inline-start]:pl-xs") },
  { variant: "link" as const, size: "xs" as const, class: cn("typo-body-sm-bold") },
  { variant: "link" as const, size: ["sm" as const, "default" as const], class: cn("typo-body-md-bold") },
  { variant: "link" as const, size: "lg" as const, class: cn("typo-body-lg-bold") },
]

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-pill border-default border-transparent bg-clip-padding typo-body-md-regular whitespace-nowrap transition-all outline-none select-none focus-visible:border-focus focus-visible:ring-(length:--aurora-stroke-focus) focus-visible:ring-focus/md disabled:pointer-events-none disabled:text-disabled aria-invalid:border-invalid aria-invalid:ring-(length:--aurora-stroke-focus) aria-invalid:ring-invalid/xs [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-[16px]",
  {
    variants: {
      variant: {
        default:
          "bg-link-1 text-link-10 hover:bg-link-3 aria-expanded:bg-link-3 disabled:bg-disabled-surface",
        outline:
          "border-link-4 bg-transparent text-link-4 hover:bg-link-5 aria-expanded:bg-link-5 disabled:border-details-1",
        secondary:
          "bg-link-5 text-link-4 hover:bg-link-5/lg aria-expanded:bg-link-5/lg disabled:bg-disabled-surface",
        // ghost: só tons de cinza (ação discreta), texto e hover em tokens neutros
        ghost: "text-text-2 hover:bg-background-4 aria-expanded:bg-background-4",
        destructive:
          "bg-alerts-8 text-alerts-9 hover:bg-alerts-8/lg focus-visible:border-alerts-7/sm focus-visible:ring-alerts-7/xs disabled:bg-disabled-surface",
        link: "text-link-1 underline underline-offset-(--aurora-underline-offset) hover:text-link-3",
      },
      size: {
        default:
          "gap-xs px-lg py-sm typo-body-md-regular in-data-[slot=button-group]:rounded-pill has-data-[icon=inline-end]:pr-md has-data-[icon=inline-start]:pl-md",
        xs: "gap-xs px-sm py-xxs typo-body-sm-regular in-data-[slot=button-group]:rounded-pill has-data-[icon=inline-end]:pr-sm has-data-[icon=inline-start]:pl-sm [&_svg:not([class*='size-'])]:size-[12px]",
        sm: "gap-xs px-md py-xs typo-body-md-regular in-data-[slot=button-group]:rounded-pill has-data-[icon=inline-end]:pr-sm has-data-[icon=inline-start]:pl-sm",
        lg: "gap-sm px-lg py-sm typo-body-lg-regular has-data-[icon=inline-end]:pr-md has-data-[icon=inline-start]:pl-md",
      },
    },
    compoundVariants: linkWithoutPadding,
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

/** Um ícone do lucide-react (ex.: PlusIcon) ou qualquer componente de ícone SVG. */
type ButtonIcon = React.ComponentType<React.SVGProps<SVGSVGElement>>

// Anatomia como no Button do Nitro: [ícone antes] texto [ícone depois].
// Os ícones são opcionais e valem em todas as variantes e tamanhos; o lado com ícone
// ganha menos padding (has-data-[icon=...]) para o conjunto parecer centralizado.
// Carregando (loading): o Spinner entra no lugar do ícone de antes e o botão fica bloqueado.
function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  iconLeading: IconLeading,
  iconTrailing: IconTrailing,
  loading = false,
  disabled,
  children,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
    /** Ícone antes do texto. Sem valor, não aparece. */
    iconLeading?: ButtonIcon
    /** Ícone depois do texto. Sem valor, não aparece. */
    iconTrailing?: ButtonIcon
    /** Carregando: mostra o Spinner antes do texto e bloqueia o clique. */
    loading?: boolean
  }) {
  const Comp = asChild ? Slot.Root : "button"

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...props}
    >
      {loading ? (
        // o Spinner acompanha a cor do texto do botão e o tamanho do ícone (12px no xs)
        <Spinner data-icon="inline-start" size="sm" tone="inherit" className={cn(size === "xs" && "[&_svg]:size-[12px]")} />
      ) : (
        IconLeading && <IconLeading data-icon="inline-start" aria-hidden />
      )}
      <Slot.Slottable>{children}</Slot.Slottable>
      {IconTrailing && <IconTrailing data-icon="inline-end" aria-hidden />}
    </Comp>
  )
}

export { Button, buttonVariants }
