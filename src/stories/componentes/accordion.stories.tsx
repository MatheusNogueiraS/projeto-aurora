import type { Meta, StoryObj } from "@storybook/react-vite"
import { CalendarIcon, CircleHelpIcon, ClockIcon, FileTextIcon, InfoIcon, WalletIcon } from "lucide-react"

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { DataLine } from "@/components/ui/data-line"

// Ícones que dá para escolher nos controles (no código, qualquer ícone do lucide-react serve).
const icons = {
  CircleHelp: CircleHelpIcon,
  Info: InfoIcon,
  Clock: ClockIcon,
  Calendar: CalendarIcon,
  Wallet: WalletIcon,
  FileText: FileTextIcon,
}
type IconName = keyof typeof icons

const variants = { Linha: "line", Caixa: "box" } as const
type VariantName = keyof typeof variants

// Linhas de exemplo para o conteúdo em DataLine (como o InfoDrop do Design System CB).
const lines = [
  { label: "Parcelas", value: "84x de R$ 42,38", support: "(0,00%)" },
  { label: "Taxa de juros", value: "1,80% a.m." },
  { label: "CET", value: "2,05% a.m." },
  { label: "IOF", value: "R$ 38,20" },
  { label: "Primeira parcela", value: "10/11/2026" },
  { label: "Valor liberado", value: "R$ 3.000,00" },
]

// O item é a unidade (como no Figma): título que abre e fecha e conteúdo livre (slot). Para a
// montagem de vários itens, ver Accordion/Grupo. Controles como no Accordion do Nitro e no InfoDrop.
type ItemStoryArgs = {
  variant: VariantName
  title: string
  contentType: "Texto" | "Linhas de dados"
  content: string
  lineCount: number
  showIconLeading: boolean
  iconLeadingName: IconName
  open: boolean
  disabled: boolean
}

// controles escondidos não chegam até aqui, por isso os padrões
function StoryItem({
  variant = "Linha",
  title,
  contentType = "Texto",
  content = "",
  lineCount = 3,
  showIconLeading = false,
  iconLeadingName = "CircleHelp",
  open = false,
  disabled = false,
}: Partial<ItemStoryArgs>) {
  return (
    // a key recria o item quando "Aberto" muda nos controles; ele continua clicável
    <Accordion key={String(open)} defaultValue={open ? ["item"] : []} className="max-w-[360px]">
      <AccordionItem value="item" variant={variants[variant]} disabled={disabled}>
        <AccordionTrigger iconLeading={showIconLeading ? icons[iconLeadingName] : undefined}>{title}</AccordionTrigger>
        <AccordionContent>
          {contentType === "Texto"
            ? content
            : lines.slice(0, lineCount).map((l) => <DataLine key={l.label} size="sm" divider={false} className="py-xs" {...l} />)}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}

const meta = {
  title: "Componentes/Accordion/Item",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Seção que abre e fecha, para detalhes opcionais e perguntas frequentes. Em **linha** ou em **caixa** (borda em volta de um item só). O conteúdo é livre: texto ou componentes, como o DataLine. Vários itens juntos: ver **Grupo**.",
      },
    },
  },
  args: {
    variant: "Linha",
    title: "Detalhes do empréstimo",
    contentType: "Linhas de dados",
    content: "Um empréstimo com parcelas descontadas direto na folha.",
    lineCount: 3,
    showIconLeading: false,
    iconLeadingName: "CircleHelp",
    open: false,
    disabled: false,
  },
  argTypes: {
    variant: { name: "Tipo", control: "inline-radio", options: Object.keys(variants), description: "Linha (num grupo, divisor entre os itens) ou caixa em volta do item." },
    title: { name: "Título", control: "text", description: "Texto do título." },
    contentType: { name: "Conteúdo", control: "inline-radio", options: ["Texto", "Linhas de dados"], description: "O que aparece ao abrir: texto ou linhas de DataLine." },
    content: { name: "Conteúdo · texto", control: "text", if: { arg: "contentType", eq: "Texto" } },
    lineCount: { name: "Conteúdo · linhas", control: { type: "range", min: 1, max: 6, step: 1 }, description: "Quantidade de linhas de dados.", if: { arg: "contentType", eq: "Linhas de dados" } },
    showIconLeading: { name: "Icon Leading", control: "boolean", description: "Mostra um ícone antes do título.", table: { category: "Ícone" } },
    iconLeadingName: { name: "Icon Leading · ícone", control: "select", options: Object.keys(icons), if: { arg: "showIconLeading" }, table: { category: "Ícone" } },
    open: { name: "Aberto", control: "boolean", description: "Mostra o item aberto.", table: { category: "Estado" } },
    disabled: { name: "Desabilitado", control: "boolean", description: "Bloqueia o clique: o item não abre nem fecha.", table: { category: "Estado" } },
  },
  render: (args) => <StoryItem {...args} />,
} satisfies Meta<ItemStoryArgs>

export default meta
type Story = StoryObj<typeof meta>

export const Padrao: Story = { name: "Padrão" }

// Os dois tipos, abertos.
export const Variantes: Story = {
  args: { open: true },
  render: (args) => (
    <div className="flex flex-wrap items-start gap-xl">
      {(Object.keys(variants) as VariantName[]).map((variant) => (
        <StoryItem key={variant} {...args} variant={variant} />
      ))}
    </div>
  ),
}

export const Desabilitado: Story = { args: { disabled: true } }
