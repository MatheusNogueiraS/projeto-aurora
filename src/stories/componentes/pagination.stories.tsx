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

const displays = ["Números", "Pontos"] as const
const types = ["Setas", "Com texto"] as const
const arrowStyles = { Contorno: "outline", Fantasma: "ghost" } as const

// Os controles seguem o painel do Nitro (tipo, estilo das setas, tamanho), mais a exibição em
// números ou pontos, o total, a página inicial, os vizinhos e a última página sempre visível.
type PaginationStoryArgs = {
  display: (typeof displays)[number]
  total: number
  page: number
  siblings: number
  showLast: boolean
  type: (typeof types)[number]
  arrowStyle: keyof typeof arrowStyles
  size: "sm" | "default"
}

// controles escondidos não chegam até aqui, por isso os padrões
function StoryPagination({
  display = "Números",
  total = 20,
  page = 1,
  siblings = 1,
  showLast = false,
  type = "Setas",
  arrowStyle = "Contorno",
  size = "default",
}: Partial<PaginationStoryArgs>) {
  // a key de quem usa recria o componente quando "Página atual" muda; aqui os cliques continuam funcionando
  const [current, setCurrent] = React.useState(Math.min(Math.max(page, 1), Math.max(total, 1)))
  const arrow = { size, variant: arrowStyles[arrowStyle] }
  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious {...arrow} text={type === "Com texto" ? "Anterior" : undefined} disabled={current <= 1} onClick={() => setCurrent((p) => p - 1)} />
        </PaginationItem>
        {display === "Pontos"
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
          <PaginationNext {...arrow} text={type === "Com texto" ? "Próxima" : undefined} disabled={current >= total} onClick={() => setCurrent((p) => p + 1)} />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}

const meta = {
  title: "Componentes/Pagination",
  tags: ["autodocs"],
  parameters: {
    docs: { description: { component: "Navega entre páginas de uma lista ou de um grupo de cards. Em números ou em pontos." } },
  },
  args: { display: "Números", total: 20, page: 1, siblings: 2, showLast: false, type: "Setas", arrowStyle: "Contorno", size: "default" },
  argTypes: {
    display: { name: "Exibição", control: "inline-radio", options: displays, description: "Números ou pontos (para poucas páginas, como cards)." },
    total: { name: "Total de páginas", control: { type: "number", min: 1, max: 999 }, description: "Quantas páginas existem." },
    page: { name: "Página atual", control: { type: "number", min: 1, max: 999 }, description: "Página aberta ao começar." },
    siblings: { name: "Vizinhos", control: "inline-radio", options: [0, 1, 2], description: "Páginas ao lado da atual: 0 só com 1 ou 2 páginas, 1 a partir de 3, 2 a partir de 5.", if: { arg: "display", eq: "Números" } },
    showLast: { name: "Última página", control: "boolean", description: "Deixa a última página sempre visível.", if: { arg: "display", eq: "Números" } },
    type: { name: "Tipo", control: "inline-radio", options: types, description: "Só setas ou setas com texto." },
    arrowStyle: { name: "Setas · estilo", control: "inline-radio", options: Object.keys(arrowStyles), description: "Com contorno ou só a seta. Com pontos, sempre só a seta.", if: { arg: "display", eq: "Números" } },
    size: { name: "Tamanho", control: "inline-radio", options: ["sm", "default"], description: "sm (31px) ou default (39px), como o Button." },
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

export const Padrao: Story = { name: "Padrão" }

export const Variantes: Story = {
  render: (args) => (
    <div className="flex flex-col gap-xl">
      <StoryPagination {...args} display="Números" type="Setas" arrowStyle="Contorno" />
      <StoryPagination {...args} display="Números" type="Setas" arrowStyle="Contorno" showLast />
      <StoryPagination {...args} display="Números" type="Setas" arrowStyle="Fantasma" page={10} showLast />
      <StoryPagination {...args} display="Números" type="Com texto" arrowStyle="Contorno" />
      <StoryPagination {...args} display="Pontos" type="Setas" arrowStyle="Fantasma" total={5} page={2} />
    </div>
  ),
}

// de 1 a 6 páginas, como seções com poucos cards; vale para números e pontos
export const PoucasPaginas: Story = {
  name: "Poucas páginas",
  render: (args) => (
    <div className="flex flex-col gap-xl">
      {[1, 2, 3, 4, 5, 6].map((total) => (
        <StoryPagination key={`${total}-${args.display}`} {...args} total={total} page={1} />
      ))}
    </div>
  ),
}

export const Tamanhos: Story = {
  render: (args) => (
    <div className="flex flex-col gap-xl">
      <StoryPagination key={`s-${args.display}`} {...args} size="sm" />
      <StoryPagination key={`d-${args.display}`} {...args} size="default" />
    </div>
  ),
}
