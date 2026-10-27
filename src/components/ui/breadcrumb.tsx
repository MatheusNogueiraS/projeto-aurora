import * as React from "react"
import { cn } from "@/lib/utils"
import { Slot } from "radix-ui"
import { ChevronRightIcon, MoreHorizontalIcon } from "lucide-react"

/** Um ícone do lucide-react (ex.: HouseIcon) ou qualquer componente de ícone SVG. */
type BreadcrumbIcon = React.ComponentType<React.SVGProps<SVGSVGElement>>

function Breadcrumb({ className, ...props }: React.ComponentProps<"nav">) {
  return <nav aria-label="breadcrumb" data-slot="breadcrumb" className={cn(className)} {...props} />
}

// Regra do componente: com mais de 3 níveis, mostra o início, reticências e os dois últimos
// níveis (ex.: Início › … › Propostas › Detalhes). Os separadores são refeitos nesse caso.
const MAX_VISIBLE_LEVELS = 3

function BreadcrumbList({ className, children, ...props }: React.ComponentProps<"ol">) {
  // abre os fragmentos (<>…</>) para contar os níveis mesmo quando vêm agrupados com o separador.
  // Cada elemento recebe uma key única (key do fragmento + a dele); sem isso, níveis de fragmentos
  // diferentes ficavam com a mesma key e o React deixava níveis antigos na tela ao trocar.
  const flatten = (nodes: React.ReactNode, prefix = ""): React.ReactNode[] =>
    React.Children.toArray(nodes).flatMap((node) => {
      if (!React.isValidElement<{ children?: React.ReactNode }>(node)) return [node]
      if (node.type === React.Fragment) return flatten(node.props.children, `${prefix}${node.key}/`)
      return [React.cloneElement(node, { key: `${prefix}${node.key}` })]
    })
  const items = flatten(children).filter(
    (child): child is React.ReactElement => React.isValidElement(child) && child.type === BreadcrumbItem
  )
  const collapsed =
    items.length > MAX_VISIBLE_LEVELS
      ? [items[0], <BreadcrumbItem key="ellipsis"><BreadcrumbEllipsis /></BreadcrumbItem>, ...items.slice(-2)].flatMap(
          (item, i) => (i === 0 ? [item] : [<BreadcrumbSeparator key={`sep-${i}`} />, item])
        )
      : null

  return (
    <ol
      data-slot="breadcrumb-list"
      className={cn(
        "flex flex-wrap items-center gap-xs typo-body-md-regular wrap-break-word text-text-3 sm:gap-sm",
        className
      )}
      {...props}
    >
      {collapsed ?? children}
    </ol>
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
        "inline-flex items-center gap-xs rounded-xxs underline-offset-(--aurora-underline-offset) transition-colors outline-none hover:text-text-1 hover:underline focus-visible:ring-(length:--aurora-stroke-focus) focus-visible:ring-focus [&>svg]:size-[16px] [&>svg]:shrink-0",
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

// Divisor entre os níveis: sempre a seta (a opção de barra saiu em 26/10/2026).
function BreadcrumbSeparator({
  children,
  className,
  ...props
}: React.ComponentProps<"li">) {
  return (
    <li
      data-slot="breadcrumb-separator"
      role="presentation"
      aria-hidden="true"
      className={cn("[&>svg]:size-[14px]", className)}
      {...props}
    >
      {children ?? <ChevronRightIcon />}
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
