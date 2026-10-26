import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

// Tamanhos com as mesmas alturas do Button (sm 31, default 39, lg 42), para alinharem lado a lado.
// Hover: borda roxa. Erro só aparece com o campo habilitado (desabilitado nunca fica em erro).
const inputVariants = cva(
  "w-full min-w-[0px] rounded-sm border-default border-field bg-transparent px-md shadow-s transition-[color,box-shadow] outline-none file:inline-flex file:border-(length:--aurora-stroke-none) file:bg-transparent file:typo-body-md-regular file:text-text-1 placeholder:text-text-3 not-aria-invalid:not-focus-visible:enabled:hover:border-link-4 focus-visible:border-focus focus-visible:ring-(length:--aurora-stroke-focus) focus-visible:ring-focus/md disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-md aria-invalid:enabled:border-invalid aria-invalid:enabled:ring-(length:--aurora-stroke-focus) aria-invalid:enabled:ring-invalid/xs",
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

function Input({
  className,
  type,
  size = "default",
  ...props
}: Omit<React.ComponentProps<"input">, "size"> & VariantProps<typeof inputVariants>) {
  return (
    <input
      type={type}
      data-slot="input"
      data-size={size}
      className={cn(inputVariants({ size }), className)}
      {...props}
    />
  )
}

export { Input, inputVariants }
