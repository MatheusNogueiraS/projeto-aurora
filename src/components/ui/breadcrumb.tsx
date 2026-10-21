import * as React from "react"
import { cn } from "@/lib/utils"
import { Slot } from "radix-ui"
import { ChevronRightIcon, MoreHorizontalIcon, SlashIcon } from "lucide-react"

/** Um ícone do lucide-react (ex.: HouseIcon) ou qualquer componente de ícone SVG. */
type BreadcrumbIcon = React.ComponentType<React.SVGProps<SVGSVGElement>>

// Divisor escolhido uma vez no Breadcrumb (como no Nitro: seta ou barra) e usado por todos
// os separadores, para não precisar repetir em cada um.
type BreadcrumbDivider = "arrow" | "slash"
const BreadcrumbContext = React.createContext<{ divider: BreadcrumbDivider }>({ divider: "arrow" })

function Breadcrumb({
  className,
  divider = "arrow",
  ...props
}: React.ComponentProps<"nav"> & {
  /** Divisor entre os níveis: seta (padrão) ou barra. */
  divider?: BreadcrumbDivider
}) {
  return (
    <BreadcrumbContext.Provider value={{ divider }}>
      <nav aria-label="breadcrumb" data-slot="breadcrumb" className={cn(className)} {...props} />
    </BreadcrumbContext.Provider>
  )
}

function BreadcrumbList({ className, ...props }: React.ComponentProps<"ol">) {
  return (
    <ol
      data-slot="breadcrumb-list"
      className={cn(
        "flex flex-wrap items-center gap-xs typo-body-md-regular wrap-break-word text-text-3 sm:gap-sm",
        className
      )}
      {...props}
    />
  )
}

function BreadcrumbItem({ className, ...props }: React.ComponentProps<"li">) {
  return (
    <li
      data-slot="breadcrumb-item"
      className={cn("inline-flex items-center gap-xs", className)}
      {...props}
    />
  )
}

// Link de um nível anterior. Ícone opcional antes do texto (mesma API do Button); sem texto,
// mostra só o ícone (ex.: casinha de "Início") e precisa de aria-label.
function BreadcrumbLink({
  asChild,
  className,
  iconLeading: IconLeading,
  children,
  ...props
}: React.ComponentProps<"a"> & {
  asChild?: boolean
  /** Ícone antes do texto. Sem texto, aparece só o ícone. */
  iconLeading?: BreadcrumbIcon
}) {
  const Comp = asChild ? Slot.Root : "a"

  return (
    <Comp
      data-slot="breadcrumb-link"
      className={cn(
        "inline-flex items-center gap-xs rounded-xxs underline-offset-(--aurora-underline-offset) transition-colors outline-none hover:text-text-1 hover:underline focus-visible:ring-(length:--aurora-stroke-focus) focus-visible:ring-focus/focus-ring [&>svg]:size-[16px] [&>svg]:shrink-0",
        className
      )}
      {...props}
    >
      {IconLeading && <IconLeading aria-hidden />}
      <Slot.Slottable>{children}</Slot.Slottable>
    </Comp>
  )
}

function BreadcrumbPage({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="breadcrumb-page"
      role="link"
      aria-disabled="true"
      aria-current="page"
      className={cn("text-text-1", className)}
      {...props}
    />
  )
}

function BreadcrumbSeparator({
  children,
  className,
  ...props
}: React.ComponentProps<"li">) {
  const { divider } = React.useContext(BreadcrumbContext)
  return (
    <li
      data-slot="breadcrumb-separator"
      role="presentation"
      aria-hidden="true"
      className={cn("[&>svg]:size-[14px]", className)}
      {...props}
    >
      {children ?? (divider === "slash" ? <SlashIcon /> : <ChevronRightIcon />)}
    </li>
  )
}

function BreadcrumbEllipsis({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="breadcrumb-ellipsis"
      role="presentation"
      aria-hidden="true"
      className={cn(
        "flex size-[20px] items-center justify-center [&>svg]:size-[16px]",
        className
      )}
      {...props}
    >
      <MoreHorizontalIcon />
      <span className="sr-only">Mais níveis</span>
    </span>
  )
}

export {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbEllipsis,
}
