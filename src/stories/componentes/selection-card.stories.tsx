import type { Meta, StoryObj } from "@storybook/react-vite"
import { ChevronRightIcon } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { IconButton } from "@/components/ui/icon-button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  SelectionCard,
  SelectionCardAction,
  SelectionCardContent,
  SelectionCardDescription,
  SelectionCardTitle,
} from "@/components/ui/selection-card"

// as opções da tag são os tipos do próprio Badge
const tagVariants = ["warning", "default", "secondary", "success"] as const

// Os controles seguem o Check_Terms da jornada de Formalização (Genesis) e o Choice Card do shadcn:
// controle (aceitar ou escolher), tag, título, descrição, ação de abrir e os estados.
type CardStoryArgs = {
  control: "Checkbox" | "Radio"
  showTag: boolean
  tag: string
  tagVariant: (typeof tagVariants)[number]
  title: string
  showDescription: boolean
  description: string
  showAction: boolean
  selected: boolean
  invalid: boolean
  disabled: boolean
}

// controles escondidos não chegam até aqui, por isso os padrões
function StoryCard({
  value = "card",
  control = "Checkbox",
  showTag = false,
  tag = "Obrigatório",
  tagVariant = "warning",
  title,
  showDescription = false,
  description = "",
  showAction = false,
  selected = false,
  invalid = false,
  disabled = false,
}: Partial<CardStoryArgs> & { value?: string }) {
  return (
    <SelectionCard>
      {control === "Radio" ? (
        <RadioGroupItem value={value} disabled={disabled} aria-invalid={invalid || undefined} />
      ) : (
        <Checkbox defaultChecked={selected} disabled={disabled} aria-invalid={invalid || undefined} />
      )}
      <SelectionCardContent>
        {showTag && <Badge variant={tagVariant}>{tag}</Badge>}
        <SelectionCardTitle>{title}</SelectionCardTitle>
        {showDescription && <SelectionCardDescription>{description}</SelectionCardDescription>}
      </SelectionCardContent>
      {showAction && (
        <SelectionCardAction>
          <IconButton variant="ghost" size="sm" aria-label={`Abrir: ${title}`} disabled={disabled}>
            <ChevronRightIcon />
          </IconButton>
        </SelectionCardAction>
      )}
    </SelectionCard>
  )
}

// um card de Radio precisa estar num RadioGroup (o grupo é quem guarda a escolha)
function StoryOne(args: Partial<CardStoryArgs>) {
  const card = <StoryCard {...args} />
  return (
    <div className="max-w-[360px]" key={`${args.control}-${String(args.selected)}`}>
      {args.control === "Radio" ? <RadioGroup defaultValue={args.selected ? "card" : undefined}>{card}</RadioGroup> : card}
    </div>
  )
}

const meta = {
  title: "Components/Selection Card",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: "Card inteiro clicável que marca uma escolha: aceitar (Checkbox) ou escolher uma opção (Radio).",
      },
    },
  },
  args: {
    control: "Checkbox",
    showTag: true,
    tag: "Obrigatório",
    tagVariant: "warning",
    title: "Termos de Uso e Aviso de Privacidade",
    showDescription: false,
    description: "Leia antes de aceitar.",
    showAction: true,
    selected: false,
    invalid: false,
    disabled: false,
  },
  argTypes: {
    control: { name: "Selection", control: "inline-radio", options: ["Checkbox", "Radio"] },
    showTag: { name: "Tag", control: "boolean" },
    tag: { name: "Tag · text", control: "text", if: { arg: "showTag" } },
    tagVariant: { name: "Tag · type", control: "inline-radio", options: tagVariants, if: { arg: "showTag" }, table: { defaultValue: { summary: '"default"' } } },
    title: { name: "Title", control: "text" },
    showDescription: { name: "Description", control: "boolean" },
    description: { name: "Description · content", control: "text", if: { arg: "showDescription" } },
    showAction: { name: "Action", control: "boolean" },
    selected: { name: "Selected", control: "boolean", table: { category: "State" } },
    invalid: { name: "Error", control: "boolean", if: { arg: "disabled", truthy: false }, table: { category: "State" } },
    disabled: { name: "Disabled", control: "boolean", if: { arg: "invalid", truthy: false }, table: { category: "State" } },
  },
  render: (args) => <StoryOne {...args} />,
} satisfies Meta<CardStoryArgs>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

// Usos mais comuns: aceite de termos (vários), escolha de uma opção (um só) e opcional com descrição.
export const Variants: Story = {
  render: () => (
    <div className="flex flex-wrap items-start gap-xl">
      <div className="flex w-[360px] flex-col gap-md">
        <span className="typo-body-sm-bold text-text-3">Aceite de termos</span>
        <StoryCard showTag showAction selected title="Termos de Uso e Aviso de Privacidade" />
        <StoryCard showTag showAction title="Consulta ao Sistema de Informação de Crédito (SCR) e Histórico de Crédito (Cadastro Positivo)" />
        <StoryCard showAction title="Desejo receber ofertas do Bmg e Parceiros" />
      </div>
      <div className="flex w-[360px] flex-col gap-md">
        <span className="typo-body-sm-bold text-text-3">Escolha de uma opção</span>
        <RadioGroup defaultValue="pix" className="gap-md">
          <StoryCard control="Radio" value="pix" showTag tagVariant="success" tag="Na hora" title="Receber por Pix" showDescription description="O dinheiro cai na sua conta em minutos." />
          <StoryCard control="Radio" value="ted" title="Receber por TED" showDescription description="Em até 1 dia útil." />
          <StoryCard control="Radio" value="conta" title="Receber na conta Bmg" showDescription description="Sem custo e na hora." />
        </RadioGroup>
      </div>
      <div className="flex w-[360px] flex-col gap-md">
        <span className="typo-body-sm-bold text-text-3">Opcional com descrição</span>
        <StoryCard showTag tagVariant="secondary" tag="Recomendado" title="Seguro prestamista" showDescription description="Quita o saldo do empréstimo em caso de imprevistos. R$ 4,90 por mês." />
        <StoryCard showTag invalid title="Autorizo o desconto das parcelas na folha de pagamento" showAction />
      </div>
    </div>
  ),
}

export const Disabled: Story = { args: { disabled: true } }
