import * as React from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"
import { useArgs, useEffect, useRef } from "storybook/preview-api"

import {
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
} from "@/components/ui/pagination"

const displays = ["numbers", "dots"] as const
const types = ["arrows", "text"] as const
const arrowStyles = ["outline", "ghost"] as const

// Os controles seguem o painel do Nitro (tipo, estilo das setas, tamanho), mais a exibição em
// números ou pontos, o total, a página inicial, os vizinhos e a última página sempre visível.
type PaginationStoryArgs = {
  display: (typeof displays)[number]
  total: number
  page: number
  siblings: number
  showLast: boolean
  type: (typeof types)[number]
  arrowStyle: (typeof arrowStyles)[number]
  size: "sm" | "default"
}

// controles escondidos não chegam até aqui, por isso os padrões
function StoryPagination({
  display = "numbers",
  total = 20,
  page = 1,
  siblings = 1,
  showLast = false,
  type = "arrows",
  arrowStyle = "outline",
  size = "default",
}: Partial<PaginationStoryArgs>) {
  // a key de quem usa recria o componente quando "Página atual" muda; aqui os cliques continuam funcionando
  const [current, setCurrent] = React.useState(Math.min(Math.max(page, 1), Math.max(total, 1)))
  const arrow = { size, variant: arrowStyle }
  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious {...arrow} text={type === "text" ? "Anterior" : undefined} disabled={current <= 1} onClick={() => setCurrent((p) => p - 1)} />
        </PaginationItem>
        {display === "dots"
          ? Array.from({ length: total }, (_, i) => i + 1).map((n) => (
              <PaginationItem key={n}>
                <PaginationDot size={size} isActive={n === current} aria-label={`Página ${n}`} onClick={() => setCurrent(n)} />
              </PaginationItem>
            ))
          : paginationRange(current, total, siblings, showLast).map((item, i) => (
              <PaginationItem key={item === "ellipsis" ? `e${i}` : item}>
                {item === "ellipsis" ? (
                  <PaginationEllipsis size={size} />
                ) : (
                  <PaginationLink size={size} isActive={item === current} aria-label={`Página ${item}`} onClick={() => setCurrent(item)}>
                    {item}
                  </PaginationLink>
                )}
              </PaginationItem>
            ))}
        <PaginationItem>
          <PaginationNext {...arrow} text={type === "text" ? "Próxima" : undefined} disabled={current >= total} onClick={() => setCurrent((p) => p + 1)} />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}

const meta = {
  title: "Components/Pagination",
  tags: ["autodocs"],
  parameters: {
    docs: { description: { component: "Navega entre páginas de uma lista ou de um grupo de cards." } },
  },
  args: { display: "numbers", total: 20, page: 1, siblings: 2, showLast: false, type: "arrows", arrowStyle: "outline", size: "default" },
  argTypes: {
    display: { name: "Display", control: "inline-radio", options: displays },
    total: { name: "Total pages", control: { type: "number", min: 1, max: 999 } },
    page: { name: "Current page", control: { type: "number", min: 1, max: 999 } },
    siblings: { name: "Siblings", control: "inline-radio", options: [0, 1, 2], if: { arg: "display", eq: "numbers" }, table: { defaultValue: { summary: "2" } } },
    showLast: { name: "Last page", control: "boolean", if: { arg: "display", eq: "numbers" } },
    type: { name: "Type", control: "inline-radio", options: types, table: { defaultValue: { summary: '"arrows"' } } },
    arrowStyle: { name: "Arrows · style", control: "inline-radio", options: arrowStyles, if: { arg: "display", eq: "numbers" }, table: { defaultValue: { summary: '"outline"' } } },
    size: { name: "Size", control: "inline-radio", options: ["sm", "default"], table: { defaultValue: { summary: '"default"' } } },
  },
  render: function Render(args) {
    // Ao mudar o total, os vizinhos vão para o recomendado (o maior permitido: 0, 1 ou 2);
    // ao escolher um vizinho fora do permitido, ele volta para o valor válido.
    const [, updateArgs] = useArgs()
    const previousTotal = useRef(args.total)
    const allowed = paginationSiblings(args.total, args.siblings)
    useEffect(() => {
      const totalChanged = previousTotal.current !== args.total
      previousTotal.current = args.total
      const target = totalChanged ? paginationSiblings(args.total, 2) : allowed
      if (target !== args.siblings) updateArgs({ siblings: target })
    }, [args.total, args.siblings, allowed])
    return <StoryPagination key={`${args.page}-${args.total}-${args.display}`} {...args} siblings={allowed} />
  },
} satisfies Meta<PaginationStoryArgs>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Variants: Story = {
  render: (args) => (
    <div className="flex flex-col gap-xl">
      <StoryPagination {...args} display="numbers" type="arrows" arrowStyle="outline" />
      <StoryPagination {...args} display="numbers" type="arrows" arrowStyle="outline" showLast />
      <StoryPagination {...args} display="numbers" type="arrows" arrowStyle="ghost" page={10} showLast />
      <StoryPagination {...args} display="numbers" type="text" arrowStyle="outline" />
      <StoryPagination {...args} display="dots" type="arrows" arrowStyle="ghost" total={5} page={2} />
    </div>
  ),
}

// de 1 a 6 páginas, como seções com poucos cards; vale para números e pontos
export const FewPages: Story = {
  render: (args) => (
    <div className="flex flex-col gap-xl">
      {[1, 2, 3, 4, 5, 6].map((total) => (
        <StoryPagination key={`${total}-${args.display}`} {...args} total={total} page={1} />
      ))}
    </div>
  ),
}

export const Sizes: Story = {
  render: (args) => (
    <div className="flex flex-col gap-xl">
      <StoryPagination key={`s-${args.display}`} {...args} size="sm" />
      <StoryPagination key={`d-${args.display}`} {...args} size="default" />
    </div>
  ),
}
