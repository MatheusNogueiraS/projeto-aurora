import * as React from "react"
import { ChevronLeftIcon, ChevronRightIcon, MoreHorizontalIcon } from "lucide-react"
import { cn } from "@/lib/utils"

import { Button } from "@/components/ui/button"
import { IconButton } from "@/components/ui/icon-button"

// Base: a Pagination do shadcn (radix-vega), trazida à mão e adaptada ao Aurora.
// Tipos e tamanhos como no Nitro: só setas ou setas com texto, e tamanhos sm/default
// (mesmas alturas do Button). Os números seguem o IconButton: círculos que crescem na largura
// quando o número tem mais algarismos.

type PaginationSize = "sm" | "default"

/**
 * Vizinhos permitidos para o total de páginas: 0 só com 1 ou 2 páginas; 1 a partir de 3;
 * 2 só a partir de 5 (antes disso não sobra o que esconder). Valor fora disso é ajustado.
 * Sem valor, usa o recomendado: o maior permitido para o total.
 */
function paginationSiblings(total: number, siblings = 2): 0 | 1 | 2 {
  if (!(total > 2)) return 0
  if (total < 5) return 1
  return siblings >= 2 ? 2 : 1
}

/**
 * Páginas a mostrar, como no shadcn: sempre a mesma quantidade de números (a atual e os vizinhos;
 * com 1 vizinho, 3 números) e reticências onde houver páginas escondidas. A quantidade fixa
 * evita a lista abrir e fechar enquanto se navega.
 * Ex. com 1 vizinho: (1, 20, 1) → [1, 2, 3, "ellipsis"]; (10, 20, 1) → ["ellipsis", 9, 10, 11, "ellipsis"];
 * (20, 20, 1) → ["ellipsis", 18, 19, 20]. Com 1 a 3 páginas aparecem todas, sem reticências.
 * Sem vizinhos informados, usa o recomendado para o total (até 2; ver paginationSiblings).
 * Com showLast, a última fica sempre visível: (1, 20, 1, true) → [1, 2, 3, "ellipsis", 20].
 */
function paginationRange(page: number, total: number, siblings = 2, showLast = false): (number | "ellipsis")[] {
  const range = (from: number, to: number) => Array.from({ length: to - from + 1 }, (_, i) => from + i)
  // valores inválidos (vazio, negativo, quebrado) não podem quebrar a lista
  const count = Number.isFinite(total) ? Math.floor(total) : 0
  if (count < 1) return []
  // com 2 páginas, reticências não fazem sentido: mostra as duas (mesmo sem vizinhos)
  if (count <= 2) return range(1, count)
  const near = paginationSiblings(count, siblings)
  const current = Number.isFinite(page) ? Math.min(Math.max(Math.floor(page), 1), count) : 1
  const size = Math.min(near * 2 + 1, count)
  // janela com a atual no meio, empurrada para dentro nas pontas (na página 1: 1 2 3)
  const start = Math.min(Math.max(current - near, 1), count - size + 1)
  const end = start + size - 1
  const lastVisible = showLast && end < count
  const before = start > 1 ? ["ellipsis" as const] : []
  // com a última visível, só há reticências se sobrar página escondida entre a janela e ela
  const after = end < (lastVisible ? count - 1 : count) ? ["ellipsis" as const] : []
  return [...before, ...range(start, end), ...after, ...(lastVisible ? [count] : [])]
}

function Pagination({ className, ...props }: React.ComponentProps<"nav">) {
  return (
    <nav
      aria-label="Paginação"
      data-slot="pagination"
      className={cn("flex w-full justify-center", className)}
      {...props}
    />
  )
}

// Com pontos, as setas são sempre fantasma e cinza (sem contorno nem roxo), para não pesar mais
// que os pontos; o desabilitado continua mais claro. Regra do componente: vale mesmo se quem usa
// pedir as setas com contorno.
function PaginationContent({ className, ...props }: React.ComponentProps<"ul">) {
  return (
    <ul
      data-slot="pagination-content"
      className={cn(
        "flex items-center gap-xs",
        "has-data-[slot=pagination-dot]:[&_[data-arrow]]:border-transparent has-data-[slot=pagination-dot]:[&_[data-arrow]]:bg-transparent has-data-[slot=pagination-dot]:[&_[data-arrow]]:text-text-2",
        "has-data-[slot=pagination-dot]:[&_[data-arrow]:hover]:bg-background-4 has-data-[slot=pagination-dot]:[&_[data-arrow]:hover]:text-text-1 has-data-[slot=pagination-dot]:[&_[data-arrow]:disabled]:text-disabled",
        className
      )}
      {...props}
    />
  )
}

function PaginationItem(props: React.ComponentProps<"li">) {
  return <li data-slot="pagination-item" {...props} />
}

// Número de página. A atual fica preenchida e em negrito (não depende só da cor).
// É um botão; para navegar por endereço, use asChild com um <a>.
function PaginationLink({
  className,
  isActive = false,
  size = "default",
  asChild,
  ...props
}: React.ComponentProps<typeof Button> & { isActive?: boolean; size?: PaginationSize }) {
  return (
    <Button
      asChild={asChild}
      variant={isActive ? "default" : "ghost"}
      size={null}
      aria-current={isActive ? "page" : undefined}
      data-slot="pagination-link"
      data-active={isActive || undefined}
      className={cn(
        // sem transição: ao trocar de página a lista se rearruma, e o destaque não pode deslizar entre números
        "p-none px-xs tabular-nums transition-none",
        size === "sm" ? "h-[31px] min-w-[31px]" : "h-[39px] min-w-[39px]",
        isActive ? "typo-body-md-bold" : "typo-body-md-regular text-text-1",
        className
      )}
      {...props}
    />
  )
}

type PaginationArrowProps = Omit<React.ComponentProps<"button">, "children"> & {
  size?: PaginationSize
  /** outline: com contorno; ghost: só a seta/texto (como Outline e Fill no Nitro). */
  variant?: "outline" | "ghost"
  /** Texto ao lado da seta. Sem ele, só a seta (com nome para o leitor de tela). */
  text?: string
}

function PaginationArrow({
  direction,
  size = "default",
  variant = "outline",
  text,
  className,
  ...props
}: PaginationArrowProps & { direction: "previous" | "next" }) {
  const Icon = direction === "previous" ? ChevronLeftIcon : ChevronRightIcon
  const label = direction === "previous" ? "Ir para a página anterior" : "Ir para a próxima página"
  if (!text) {
    return (
      <IconButton
        data-slot={`pagination-${direction}`}
        data-arrow
        variant={variant}
        size={size}
        aria-label={label}
        className={className}
        {...props}
      >
        <Icon />
      </IconButton>
    )
  }
  return (
    <Button
      data-slot={`pagination-${direction}`}
      data-arrow
      variant={variant}
      size={size}
      aria-label={label}
      iconLeading={direction === "previous" ? Icon : undefined}
      iconTrailing={direction === "next" ? Icon : undefined}
      className={className}
      {...props}
    >
      {text}
    </Button>
  )
}

function PaginationPrevious(props: PaginationArrowProps) {
  return <PaginationArrow direction="previous" {...props} />
}

function PaginationNext(props: PaginationArrowProps) {
  return <PaginationArrow direction="next" {...props} />
}

// Variante de pontos (como no Design System CB): cada página é um ponto, e o da atual se alonga.
// Para poucas páginas, como um carrossel de cards. É o nosso Button (foco, desabilitado e
// acessibilidade vêm dele), com o ponto desenhado dentro. Área de toque 20×24px; com o gap da
// lista, os centros ficam a 24px, o mínimo do WCAG 2.5.8 para alvos pequenos. Cores como
// no resto do DS: atual em laranja (como a página atual e o Progress), hover em roxo (como os
// botões). O nome da página vem de quem usa (aria-label="Página 2").
function PaginationDot({
  className,
  isActive = false,
  size = "default",
  ...props
}: React.ComponentProps<typeof Button> & { isActive?: boolean; size?: PaginationSize }) {
  return (
    <Button
      variant="ghost"
      size={null}
      aria-current={isActive ? "page" : undefined}
      data-slot="pagination-dot"
      data-active={isActive || undefined}
      className={cn("group/dot h-[24px] min-w-[20px] p-none hover:bg-transparent", className)}
      {...props}
    >
      <span
        aria-hidden
        className={cn(
          "block rounded-pill transition-all",
          size === "sm" ? "h-[6px] w-[6px]" : "h-[8px] w-[8px]",
          isActive
            ? cn("bg-link-1", size === "sm" ? "w-[14px]" : "w-[18px]")
            : "bg-field group-hover/dot:bg-link-4"
        )}
      />
    </Button>
  )
}

// Páginas escondidas entre os números; não é clicável.
function PaginationEllipsis({ className, size = "default", ...props }: React.ComponentProps<"span"> & { size?: PaginationSize }) {
  return (
    <span
      data-slot="pagination-ellipsis"
      className={cn(
        "flex items-center justify-center text-text-3 [&_svg]:size-[16px]",
        size === "sm" ? "h-[31px] w-[31px]" : "h-[39px] w-[39px]",
        className
      )}
      {...props}
    >
      <MoreHorizontalIcon aria-hidden />
      <span className="sr-only">Mais páginas</span>
    </span>
  )
}

export {
  Pagination,
  PaginationContent,
  PaginationDot,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  paginationRange,
  paginationSiblings,
}
