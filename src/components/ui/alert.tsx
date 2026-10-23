import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

const alertVariants = cva(
  "group/alert relative grid w-full gap-xxs rounded-sm border-default px-lg py-md text-left typo-body-md-regular has-data-[slot=alert-action]:grid-cols-[1fr_auto] has-data-[slot=alert-action]:gap-x-md has-[>svg]:grid-cols-[auto_1fr] has-[>svg]:has-data-[slot=alert-action]:grid-cols-[auto_1fr_auto] has-[>svg]:gap-x-sm *:[svg]:row-span-2 *:[svg]:translate-y-xxs *:[svg]:text-current *:[svg:not([class*='size-'])]:size-[16px]",
  {
    variants: {
      variant: {
        // neutro: fundo da página com borda
        default: "bg-background-6 text-text-1",
        // status (como a versão light do Genesis): fundo claro e texto escuro da mesma cor,
        // sem borda; título, descrição e ícone seguem a cor do status
        info: "border-transparent bg-link-5 text-link-4 *:data-[slot=alert-description]:text-link-4",
        success: "border-transparent bg-alerts-2 text-alerts-3 *:data-[slot=alert-description]:text-alerts-3",
        warning: "border-transparent bg-alerts-5 text-alerts-6 *:data-[slot=alert-description]:text-alerts-6",
        destructive: "border-transparent bg-alerts-8 text-alerts-9 *:data-[slot=alert-description]:text-alerts-9",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Alert({
  className,
  variant,
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof alertVariants>) {
  return (
    <div
      data-slot="alert"
      role="alert"
      className={cn(alertVariants({ variant }), className)}
      {...props}
    />
  )
}

function AlertTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-title"
      className={cn(
        "typo-body-md-bold group-has-[>svg]/alert:col-start-2 [&_a]:underline [&_a]:underline-offset-(--aurora-underline-offset) [&_a]:hover:text-text-1",
        className
      )}
      {...props}
    />
  )
}

function AlertDescription({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-description"
      className={cn(
        "typo-body-md-regular text-balance text-text-3 md:text-pretty [&_a]:underline [&_a]:underline-offset-(--aurora-underline-offset) [&_a]:hover:text-text-1 [&_p:not(:last-child)]:mb-lg",
        className
      )}
      {...props}
    />
  )
}

// O CTA do alert já é o botão: só aceita os estilos link e outline (travado no tipo),
// sempre pequeno, e segue a cor do texto do alert (currentColor), mudando junto com o
// Tipo, sem token próprio.
const alertActionStyles = {
  link: "text-current underline hover:opacity-lg",
  outline: "border-current text-current hover:bg-transparent hover:opacity-lg",
} as const

function AlertAction({
  className,
  variant = "link",
  ...props
}: Omit<React.ComponentProps<typeof Button>, "variant" | "size"> & {
  /** Estilo do CTA: link (padrão) ou outline. */
  variant?: keyof typeof alertActionStyles
}) {
  return (
    <div data-slot="alert-action" className="-col-start-2 row-span-2 row-start-1 self-start">
      <Button size="xs" variant={variant} className={cn(alertActionStyles[variant], className)} {...props} />
    </div>
  )
}

export { Alert, AlertTitle, AlertDescription, AlertAction }
