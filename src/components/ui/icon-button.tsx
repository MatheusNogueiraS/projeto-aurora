import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

// Botão só com ícone (como o Icon Button do Nitro e o GButtonIcon do Genesis).
// Cores, estados e raio vêm do Button; aqui só muda o tamanho: um quadrado da mesma
// altura do Button do mesmo tamanho, para os dois alinharem lado a lado.
// Se mudar o padding ou a tipografia do Button, atualize estas medidas.
const iconButtonVariants = cva("p-none", {
  variants: {
    size: {
      xs: "size-[24px] [&_svg:not([class*='size-'])]:size-[12px]",
      sm: "size-[31px]",
      default: "size-[39px]",
      lg: "size-[42px]",
    },
  },
  defaultVariants: {
    size: "default",
  },
})

type IconButtonProps = React.ComponentProps<"button"> &
  Pick<VariantProps<typeof buttonVariants>, "variant"> &
  VariantProps<typeof iconButtonVariants> & {
    asChild?: boolean
    /** Obrigatório: sem texto visível, é o que o leitor de tela anuncia. */
    "aria-label": string
  }

function IconButton({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: IconButtonProps) {
  const Comp = asChild ? Slot.Root : "button"

  return (
    <Comp
      data-slot="icon-button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size: null }), iconButtonVariants({ size }), className)}
      {...props}
    />
  )
}

export { IconButton, iconButtonVariants }
