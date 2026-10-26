import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { Checkbox as CheckboxPrimitive } from "radix-ui"
import { CheckIcon, MinusIcon } from "lucide-react"

// Tamanhos: sm 14, default 16 e lg 20 (os dois últimos como Medium e Large do Nitro).
// Erro só aparece desmarcado e habilitado: marcado ou desabilitado nunca fica vermelho
// (vermelho sobre o laranja da seleção seria mal interpretado). Erro = obrigatório não marcado.
const checkboxVariants = cva(
  "peer relative flex shrink-0 items-center justify-center rounded-xxs border-default border-field shadow-s transition-shadow outline-none group-has-disabled/field:opacity-md group-has-[:focus-visible]/field-label:ring-(length:--aurora-stroke-none) group-has-[:focus-visible]/field-label:not-data-checked:border-field after:absolute after:-inset-x-md after:-inset-y-sm focus-visible:border-focus focus-visible:ring-(length:--aurora-stroke-focus) focus-visible:ring-focus/md disabled:cursor-not-allowed disabled:opacity-md aria-invalid:data-[state=unchecked]:enabled:border-invalid aria-invalid:data-[state=unchecked]:enabled:ring-(length:--aurora-stroke-focus) aria-invalid:data-[state=unchecked]:enabled:ring-invalid/xs data-checked:border-link-1 data-checked:bg-link-1 data-checked:text-link-10 data-[state=indeterminate]:border-link-1 data-[state=indeterminate]:bg-link-1 data-[state=indeterminate]:text-link-10 group-has-[:focus-visible]/field-label:data-checked:border-link-1 enabled:not-focus-visible:hover:border-link-4 enabled:not-focus-visible:group-hover/checkbox-field:border-link-4 data-checked:enabled:hover:border-link-3 data-checked:enabled:hover:bg-link-3 data-checked:enabled:group-hover/checkbox-field:border-link-3 data-checked:enabled:group-hover/checkbox-field:bg-link-3 data-[state=indeterminate]:enabled:hover:border-link-3 data-[state=indeterminate]:enabled:hover:bg-link-3 data-[state=indeterminate]:enabled:group-hover/checkbox-field:border-link-3 data-[state=indeterminate]:enabled:group-hover/checkbox-field:bg-link-3",
  {
    variants: {
      size: {
        sm: "size-[14px] [&_svg]:size-[12px]",
        default: "size-[16px] [&_svg]:size-[14px]",
        lg: "size-[20px] [&_svg]:size-[16px]",
      },
    },
    defaultVariants: { size: "default" },
  }
)

// Texto ao lado (opcional), como no Checkbox do Nitro: label e descrição abaixo dele.
const checkboxTextVariants = {
  sm: { label: "typo-body-sm-regular", description: "typo-body-sm-regular" },
  default: { label: "typo-body-md-regular", description: "typo-body-sm-regular" },
  lg: { label: "typo-body-lg-regular", description: "typo-body-md-regular" },
} as const

function Checkbox({
  className,
  size = "default",
  label,
  description,
  ...props
}: React.ComponentProps<typeof CheckboxPrimitive.Root> &
  VariantProps<typeof checkboxVariants> & {
    /** Texto ao lado. Sem ele, aparece só o controle. */
    label?: React.ReactNode
    /** Texto de apoio abaixo do label. */
    description?: React.ReactNode
  }) {
  const box = (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(checkboxVariants({ size }), (label || description) && "mt-xxs", className)}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        className="group/indicator grid place-content-center text-current transition-none"
      >
        <CheckIcon className="group-data-[state=indeterminate]/indicator:hidden" />
        <MinusIcon className="hidden group-data-[state=indeterminate]/indicator:block" />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  )

  if (!label && !description) return box

  // Com texto: o label inteiro é clicável. Desabilitado esmaece o texto (a caixinha já se esmaece
  // sozinha) e erro pinta a descrição.
  const text = checkboxTextVariants[size ?? "default"]
  return (
    <label
      data-slot="checkbox-field"
      className="group/checkbox-field flex w-fit items-start gap-sm text-text-1 has-disabled:cursor-not-allowed"
    >
      {box}
      <span className="flex flex-col group-has-disabled/checkbox-field:opacity-md">
        {label && <span className={text.label}>{label}</span>}
        {description && (
          <span className={cn(text.description, "text-text-3 group-has-[[aria-invalid=true][data-state=unchecked]:enabled]/checkbox-field:text-alerts-7")}>
            {description}
          </span>
        )}
      </span>
    </label>
  )
}

export { Checkbox, checkboxVariants }
