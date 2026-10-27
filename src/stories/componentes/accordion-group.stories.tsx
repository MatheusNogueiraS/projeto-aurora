import type { Meta, StoryObj } from "@storybook/react-vite"

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { DataLine } from "@/components/ui/data-line"

const variants = ["line", "box"] as const

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
  variant: (typeof variants)[number]
  count: number
  openMode: "multiple" | "single"
}

// controles escondidos não chegam até aqui, por isso os padrões
function StoryGroup({ variant = "line", count = 3, openMode = "multiple" }: Partial<GroupStoryArgs>) {
  const children = items.slice(0, count).map((it, i) => (
    <AccordionItem key={it.title} value={`item-${i + 1}`} variant={variant}>
      <AccordionTrigger>{it.title}</AccordionTrigger>
      <AccordionContent>
        {it.text ?? it.lines?.map(([label, value]) => <DataLine key={label} label={label} value={value} divider={false} className="py-xs" />)}
      </AccordionContent>
    </AccordionItem>
  ))
  // o primeiro começa aberto; a key recria o grupo quando a abertura muda
  return openMode === "single" ? (
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
  title: "Components/Accordion/Group",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: "Vários itens juntos, que abrem ao mesmo tempo ou um por vez.",
      },
    },
  },
  args: { variant: "line", count: 3, openMode: "multiple" },
  argTypes: {
    variant: { name: "Type", control: "inline-radio", options: variants, table: { defaultValue: { summary: '"line"' } } },
    count: { name: "Items", control: { type: "range", min: 1, max: 4, step: 1 } },
    openMode: { name: "Open mode", control: "inline-radio", options: ["multiple", "single"], table: { defaultValue: { summary: '"multiple"' } } },
  },
  render: (args) => <StoryGroup {...args} />,
} satisfies Meta<GroupStoryArgs>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

// Os dois tipos lado a lado.
export const Variants: Story = {
  render: (args) => (
    <div className="flex flex-wrap items-start gap-xl">
      {variants.map((variant) => (
        <StoryGroup key={variant} {...args} variant={variant} />
      ))}
    </div>
  ),
}
