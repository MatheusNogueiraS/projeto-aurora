import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

// Formatos do que vai aparecer: texto (linha baixa), círculo (avatar, ícone) e bloco (imagem,
// card). A largura vem de quem usa; texto e círculo já trazem a altura. Cinza um passo mais
// escuro que o fundo das superfícies, para ser visto sobre o branco.
const skeletonVariants = cva("animate-pulse bg-background-3", {
  variants: {
    shape: {
      text: "h-[16px] rounded-xxs",
      circle: "aspect-square rounded-pill",
      block: "rounded-sm",
    },
  },
  defaultVariants: { shape: "block" },
})

function Skeleton({
  className,
  shape = "block",
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof skeletonVariants>) {
  return (
    <div
      data-slot="skeleton"
      data-shape={shape}
      className={cn(skeletonVariants({ shape }), className)}
      {...props}
    />
  )
}

export { Skeleton, skeletonVariants }
