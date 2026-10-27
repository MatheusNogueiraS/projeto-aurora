import type { Meta, StoryObj } from "@storybook/react-vite"
import { CalendarIcon, CircleHelpIcon, ClockIcon, FileTextIcon, InfoIcon, WalletIcon } from "lucide-react"

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { InfoLine, InfoLineGroup } from "@/components/ui/info-line"

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

const variants = ["line", "box"] as const

// Linhas de exemplo para o conteúdo em InfoLine (como o InfoDrop do Design System CB).
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
  variant: (typeof variants)[number]
  title: string
  contentType: "Text" | "Info Line"
  content: string
  lineCount: number
  showIconLeading: boolean
  iconLeadingName: IconName
  open: boolean
  disabled: boolean
}

// controles escondidos não chegam até aqui, por isso os padrões
function StoryItem({
  variant = "line",
  title,
  contentType = "Text",
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
      <AccordionItem value="item" variant={variant} disabled={disabled}>
        <AccordionTrigger iconLeading={showIconLeading ? icons[iconLeadingName] : undefined}>{title}</AccordionTrigger>
        <AccordionContent>
          {contentType === "Text"
            ? content
            : (
              <InfoLineGroup divider={false}>
                {lines.slice(0, lineCount).map((l) => <InfoLine key={l.label} className="py-xs" {...l} />)}
              </InfoLineGroup>
            )}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}

const meta = {
  title: "Components/Accordion/Item",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: "Seção que abre e fecha, para detalhes opcionais e perguntas frequentes.",
      },
    },
  },
  args: {
    variant: "line",
    title: "Detalhes do empréstimo",
    contentType: "Info Line",
    content: "Um empréstimo com parcelas descontadas direto na folha.",
    lineCount: 3,
    showIconLeading: false,
    iconLeadingName: "CircleHelp",
    open: false,
    disabled: false,
  },
  argTypes: {
    variant: { name: "Type", control: "inline-radio", options: variants, table: { defaultValue: { summary: '"line"' } } },
    title: { name: "Title", control: "text" },
    contentType: { name: "Content", control: "inline-radio", options: ["Text", "Info Line"] },
    content: { name: "Content · text", control: "text", if: { arg: "contentType", eq: "Text" } },
    lineCount: { name: "Content · lines", control: { type: "range", min: 1, max: 6, step: 1 }, if: { arg: "contentType", eq: "Info Line" } },
    showIconLeading: { name: "Icon Leading", control: "boolean", table: { category: "Icons" } },
    iconLeadingName: { name: "Icon Leading · icon", control: "select", options: Object.keys(icons), if: { arg: "showIconLeading" }, table: { category: "Icons" } },
    open: { name: "Open", control: "boolean", table: { category: "State" } },
    disabled: { name: "Disabled", control: "boolean", table: { category: "State" } },
  },
  render: (args) => <StoryItem {...args} />,
} satisfies Meta<ItemStoryArgs>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

// Os dois tipos, abertos.
export const Variants: Story = {
  args: { open: true },
  render: (args) => (
    <div className="flex flex-wrap items-start gap-xl">
      {variants.map((variant) => (
        <StoryItem key={variant} {...args} variant={variant} />
      ))}
    </div>
  ),
}

export const Disabled: Story = { args: { disabled: true } }
