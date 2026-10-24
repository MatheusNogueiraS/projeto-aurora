import type { Meta, StoryObj } from "@storybook/react-vite"

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { DataLine } from "@/components/ui/data-line"

const variants = { Linha: "line", Caixa: "box" } as const
type VariantName = keyof typeof variants

// Itens de exemplo (o que vai em cada um se escolhe na página Accordion/Item).
const items = [
  { title: "Detalhes do empréstimo", lines: [["Parcelas", "84x de R$ 42,38"], ["Taxa de juros", "1,80% a.m."], ["CET", "2,05% a.m."]] },
  { title: "Documentos necessários", text: "RG, CPF e comprovante de renda." },
  { title: "Como cancelar", text: "Em até 7 dias, sem custo, pelo app." },
  { title: "Fale com a gente", text: "Pelo chat do app ou no 0800 da central." },
]

// O grupo é só a montagem, como no shadcn: Accordion junta os itens e decide se abrem vários
// juntos ou um por vez. A separação fica só entre os itens: divisor (linha) ou espaço (caixa).
type GroupStoryArgs = {
  variant: VariantName
  count: number
  openMode: "Vários" | "Um por vez"
}

// controles escondidos não chegam até aqui, por isso os padrões
function StoryGroup({ variant = "Linha", count = 3, openMode = "Vários" }: Partial<GroupStoryArgs>) {
  const children = items.slice(0, count).map((it, i) => (
    <AccordionItem key={it.title} value={`item-${i + 1}`} variant={variants[variant]}>
      <AccordionTrigger>{it.title}</AccordionTrigger>
      <AccordionContent>
        {it.text ?? it.lines?.map(([label, value]) => <DataLine key={label} label={label} value={value} size="sm" divider={false} className="py-xs" />)}
      </AccordionContent>
    </AccordionItem>
  ))
  // o primeiro começa aberto; a key recria o grupo quando a abertura muda
  return openMode === "Um por vez" ? (
    <Accordion key={openMode} type="single" collapsible defaultValue="item-1" className="max-w-[360px]">
      {children}
    </Accordion>
  ) : (
    <Accordion key={openMode} defaultValue={["item-1"]} className="max-w-[360px]">
      {children}
    </Accordion>
  )
}

const meta = {
  title: "Componentes/Accordion/Grupo",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Vários **Itens** juntos. Em linha, um divisor entre eles; em caixa, cada item na sua caixa, com espaço entre elas. Abrem vários juntos ou um por vez.",
      },
    },
  },
  args: { variant: "Linha", count: 3, openMode: "Vários" },
  argTypes: {
    variant: { name: "Tipo", control: "inline-radio", options: Object.keys(variants), description: "O tipo de todos os itens: linha ou caixa." },
    count: { name: "Itens", control: { type: "range", min: 1, max: 4, step: 1 }, description: "Quantidade de itens. Um item sozinho não tem divisor." },
    openMode: { name: "Abertura", control: "inline-radio", options: ["Vários", "Um por vez"], description: "Vários abertos juntos ou um por vez (abrir um fecha o outro)." },
  },
  render: (args) => <StoryGroup {...args} />,
} satisfies Meta<GroupStoryArgs>

export default meta
type Story = StoryObj<typeof meta>

export const Padrao: Story = { name: "Padrão" }

// Os dois tipos lado a lado.
export const Variantes: Story = {
  render: (args) => (
    <div className="flex flex-wrap items-start gap-xl">
      {(Object.keys(variants) as VariantName[]).map((variant) => (
        <StoryGroup key={variant} {...args} variant={variant} />
      ))}
    </div>
  ),
}
