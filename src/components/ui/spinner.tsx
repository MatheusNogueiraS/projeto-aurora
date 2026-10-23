import * as React from "react"
import { LoaderCircleIcon } from "lucide-react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

// Base: o Spinner do shadcn (arco girando, anunciado como "carregando"), adaptado ao Aurora.
// Só em arco (como o Spinner Round do Nitro). Dentro do Button, use a opção loading do Button.
// Contexto opcional: um texto ao lado ou embaixo (ex.: "Carregando..."), para não ser só o ícone.
// O giro usa o token de movimento (motion.duration.spin) pela classe animate-spin.

const spinnerVariants = cva("shrink-0 animate-spin", {
  variants: {
    size: {
      sm: "size-[16px]",
      default: "size-[24px]",
      lg: "size-[32px]",
    },
    // cor: laranja da marca, cinza neutro, ou a cor de quem está em volta (ex.: dentro de um botão)
    tone: {
      brand: "text-link-1",
      neutral: "text-text-3",
      inherit: "",
    },
  },
  defaultVariants: { size: "default", tone: "brand" },
})

type SpinnerProps = Omit<React.ComponentProps<"span">, "children"> &
  VariantProps<typeof spinnerVariants> & {
    /** Texto de contexto (ex.: "Carregando..."). Sem ele, o leitor de tela ouve "Carregando". */
    label?: React.ReactNode
    /** Onde fica o texto: ao lado ou embaixo do ícone. */
    labelPosition?: "side" | "below"
  }

function Spinner({
  className,
  size = "default",
  tone = "brand",
  label,
  labelPosition = "side",
  ...props
}: SpinnerProps) {
  const hasLabel = label != null && label !== ""
  return (
    <span
      role="status"
      data-slot="spinner"
      data-size={size}
      className={cn(
        "inline-flex items-center",
        labelPosition === "below" ? "flex-col gap-sm" : "gap-sm",
        className
      )}
      {...props}
    >
      <LoaderCircleIcon aria-hidden className={spinnerVariants({ size, tone })} />
      {hasLabel ? (
        <span className={cn("text-text-2", size === "lg" ? "typo-body-lg-regular" : size === "sm" ? "typo-body-sm-regular" : "typo-body-md-regular")}>
          {label}
        </span>
      ) : (
        <span className="sr-only">Carregando</span>
      )}
    </span>
  )
}

export { Spinner, spinnerVariants }
