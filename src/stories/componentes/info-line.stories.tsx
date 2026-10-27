import type { Meta, StoryObj } from "@storybook/react-vite"

import { InfoLine, InfoLineGroup } from "@/components/ui/info-line"

// O item é a unidade (como no Accordion): uma linha, sem divisor. Para empilhar e separar, ver Info Line/Group.
// Os controles cobrem todas as partes: rótulo e contexto (esquerda), valor, suporte e descrição (direita), tamanho e destaque.
type InfoLineStoryArgs = {
  label: string
  showContext: boolean
  context: string
  showValue: boolean
  value: string
  showSupport: boolean
  support: string
  showDescription: boolean
  description: string
  size: "sm" | "default" | "lg"
  emphasis: boolean
}

// controles escondidos não chegam até aqui, por isso os padrões
function StoryLine({
  label = "Parcelas",
  showContext = true,
  context = "Opcional",
  showValue = true,
  value = "84x de R$ 42,38",
  showSupport = true,
  support = "(0,00%)",
  showDescription = true,
  description = "Total R$ 3.559,92",
  size = "default",
  emphasis = false,
}: Partial<InfoLineStoryArgs>) {
  return (
    <InfoLine
      size={size}
      emphasis={emphasis}
      label={label}
      context={showContext ? context : undefined}
      value={showValue ? value : undefined}
      support={showValue && showSupport ? support : undefined}
      description={showDescription ? description : undefined}
    />
  )
}

const meta = {
  title: "Components/Info Line/Item",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: "Mostra um dado e o seu valor lado a lado, como numa tabela de preço.",
      },
    },
  },
  args: {
    label: "Parcelas",
    showContext: true,
    context: "Opcional",
    showValue: true,
    value: "84x de R$ 42,38",
    showSupport: true,
    support: "(0,00%)",
    showDescription: true,
    description: "Total R$ 3.559,92",
    size: "default",
    emphasis: false,
  },
  argTypes: {
    label: { name: "Label", control: "text" },
    showContext: { name: "Context", control: "boolean" },
    context: { name: "Context · content", control: "text", if: { arg: "showContext" } },
    showValue: { name: "Value", control: "boolean" },
    value: { name: "Value · content", control: "text", if: { arg: "showValue" } },
    showSupport: { name: "Support", control: "boolean", if: { arg: "showValue" } },
    support: { name: "Support · content", control: "text", if: { arg: "showSupport" } },
    showDescription: { name: "Description", control: "boolean" },
    description: { name: "Description · content", control: "text", if: { arg: "showDescription" } },
    size: { name: "Size", control: "inline-radio", options: ["sm", "default", "lg"], table: { defaultValue: { summary: '"default"' } } },
    emphasis: { name: "Emphasis", control: "boolean" },
  },
  render: (args) => (
    <div className="max-w-[400px]">
      <StoryLine {...args} />
    </div>
  ),
} satisfies Meta<InfoLineStoryArgs>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

// casos de conteúdo, empilhados num grupo para comparar; o Tamanho continua valendo
export const Variants: Story = {
  render: ({ size }) => (
    <div className="flex max-w-[400px] flex-col gap-xl">
      <InfoLineGroup>
        <InfoLine size={size} label="Valor do produto" value="R$ 3.299,00" />
        <InfoLine size={size} label="Taxa de juros" context="ao mês" value="0,00%" />
        <InfoLine size={size} label="CET" context="Custo Efetivo Total" value="12,34%" support="ao ano" />
        <InfoLine size={size} label="IOF" context="Imposto sobre operação" value="R$ 48,20" description="Incluso no valor total" />
        <InfoLine size={size} label="Parcelas" value="84x de R$ 42,38" support="(0,00%)" description="Primeira em 15/08/2025" />
        <InfoLine size={size} emphasis label="Total a pagar" value="R$ 3.559,92" />
      </InfoLineGroup>
      <InfoLineGroup>
        <InfoLine size={size} label="Só rótulo" context="Sem valor à direita" />
        <InfoLine size={size} label="Rótulo longo que precisa de mais espaço para caber" value="R$ 9,90" />
        <InfoLine size={size} label="Taxa" value="84x de R$ 1.234.567,89 com seguro prestamista incluso" />
        <InfoLine size={size} label="Código_do_contrato_sem_espaços" context="Palavra maior que a coluna" value="R$1.234.567.890,00" />
      </InfoLineGroup>
    </div>
  ),
}

export const Sizes: Story = {
  render: (args) => (
    <div className="flex max-w-[400px] flex-col gap-xl">
      <StoryLine {...args} size="sm" />
      <StoryLine {...args} size="default" />
      <StoryLine {...args} size="lg" />
    </div>
  ),
}
