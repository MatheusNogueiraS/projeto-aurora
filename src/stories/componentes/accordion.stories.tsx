import type { Meta, StoryObj } from "@storybook/react-vite"
import { CalendarIcon, CircleHelpIcon, ClockIcon, FileTextIcon, InfoIcon, WalletIcon } from "lucide-react"

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

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

// Os controles seguem o Accordion do Nitro: título, conteúdo, ícone à esquerda e estados.
// O componente documentado é um item; uma lista é a soma de itens.
type AccordionStoryArgs = {
  title: string
  content: string
  showIconLeading: boolean
  iconLeadingName: IconName
  divider: boolean
  open: boolean
  disabled: boolean
}

function StoryAccordion({ title, content, showIconLeading, iconLeadingName = "CircleHelp", divider = true, open, disabled }: AccordionStoryArgs) {
  return (
    // a key recria o item quando "Aberto" muda nos controles, mas ele continua clicável
    <Accordion key={String(open)} defaultValue={open ? ["item"] : []} className="max-w-[320px]">
      <AccordionItem value="item" divider={divider} disabled={disabled}>
        <AccordionTrigger iconLeading={showIconLeading ? icons[iconLeadingName] : undefined}>{title}</AccordionTrigger>
        <AccordionContent>{content}</AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}

const meta = {
  title: "Componentes/Accordion",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: "Seção que abre e fecha, para perguntas frequentes e detalhes opcionais. Para formar uma lista, some vários itens.",
      },
    },
  },
  args: {
    title: "O que é o consignado?",
    content: "Um empréstimo com parcelas descontadas direto na folha.",
    showIconLeading: false,
    iconLeadingName: "CircleHelp",
    divider: true,
    open: false,
    disabled: false,
  },
  argTypes: {
    title: { name: "Título", control: "text", description: "Texto do título." },
    content: { name: "Conteúdo", control: "text", description: "Texto exibido ao abrir." },
    showIconLeading: { name: "Icon Leading", control: "boolean", description: "Mostra um ícone antes do título.", table: { category: "Ícone" } },
    iconLeadingName: {
      name: "Icon Leading · ícone",
      control: "select",
      options: Object.keys(icons),
      if: { arg: "showIconLeading" },
      table: { category: "Ícone" },
    },
    divider: { name: "Divisor", control: "boolean", description: "Mostra a linha embaixo do item. Numa lista, o último fica sem linha." },
    open: { name: "Aberto", control: "boolean", description: "Mostra o item aberto.", table: { category: "Estado" } },
    disabled: { name: "Desabilitado", control: "boolean", description: "Bloqueia o clique: o item não abre nem fecha.", table: { category: "Estado" } },
  },
  render: (args) => <StoryAccordion {...args} />,
} satisfies Meta<AccordionStoryArgs>

export default meta
type Story = StoryObj<typeof meta>

export const Padrao: Story = { name: "Padrão" }
export const Aberto: Story = { args: { open: true } }
export const Desabilitado: Story = { args: { disabled: true } }
