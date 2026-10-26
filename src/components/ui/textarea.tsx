import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

// Mesmos tamanhos de texto e respiro do Input (sm, default, lg). Hover: borda roxa.
// Erro só aparece com o campo habilitado (desabilitado nunca fica em erro).
const textareaVariants = cva(
  "flex field-sizing-content min-h-[64px] w-full rounded-sm border-default border-field bg-transparent px-md shadow-s transition-[color,box-shadow] outline-none placeholder:text-text-3 not-aria-invalid:not-focus-visible:enabled:hover:border-link-4 focus-visible:border-focus focus-visible:ring-(length:--aurora-stroke-focus) focus-visible:ring-focus/md disabled:cursor-not-allowed disabled:opacity-md aria-invalid:enabled:border-invalid aria-invalid:enabled:ring-(length:--aurora-stroke-focus) aria-invalid:enabled:ring-invalid/xs",
  {
    variants: {
      size: {
        sm: "py-xs typo-body-md-regular",
        default: "py-sm typo-body-lg-regular md:typo-body-md-regular",
        lg: "py-sm typo-body-lg-regular",
      },
    },
    defaultVariants: { size: "default" },
  }
)

function Textarea({
  className,
  size = "default",
  ...props
}: React.ComponentProps<"textarea"> & VariantProps<typeof textareaVariants>) {
  return (
    <textarea
      data-slot="textarea"
      data-size={size}
      className={cn(textareaVariants({ size }), className)}
      {...props}
    />
  )
}

export { Textarea, textareaVariants }
