import type { Meta, StoryObj } from "@storybook/react-vite"

import { DataLine } from "@/components/ui/data-line"

// Os controles cobrem todas as partes: rótulo e contexto (esquerda), valor, suporte e
// descrição (direita), tamanho, destaque e divisória.
type DataLineStoryArgs = {
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
  divider: boolean
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
  divider = true,
}: Partial<DataLineStoryArgs>) {
  return (
    <DataLine
      size={size}
      emphasis={emphasis}
      divider={divider}
      label={label}
      context={showContext ? context : undefined}
      value={showValue ? value : undefined}
      support={showValue && showSupport ? support : undefined}
      description={showDescription ? description : undefined}
    />
  )
}

const meta = {
  title: "Components/Data Line",
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
    divider: true,
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
    divider: { name: "Divider", control: "boolean", table: { defaultValue: { summary: "true" } } },
  },
  render: (args) => (
    <div className="max-w-[400px]">
      <StoryLine {...args} />
    </div>
  ),
} satisfies Meta<DataLineStoryArgs>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

// linhas empilhadas, como numa tabela de preço; Tamanho e Divisória continuam valendo
export const Variants: Story = {
  render: ({ size, divider }) => (
    <div className="flex max-w-[400px] flex-col gap-xl">
      <div>
        <DataLine size={size} divider={divider} label="Valor do produto" value="R$ 3.299,00" />
        <DataLine size={size} divider={divider} label="Taxa de juros" context="ao mês" value="0,00%" />
        <DataLine size={size} divider={divider} label="CET" context="Custo Efetivo Total" value="12,34%" support="ao ano" />
        <DataLine size={size} divider={divider} label="IOF" context="Imposto sobre operação" value="R$ 48,20" description="Incluso no valor total" />
        <DataLine size={size} divider={divider} label="Parcelas" value="84x de R$ 42,38" support="(0,00%)" description="Primeira em 15/08/2025" />
        <DataLine size={size} divider={divider} emphasis label="Total a pagar" value="R$ 3.559,92" />
      </div>
      <div>
        <DataLine size={size} divider={divider} label="Só rótulo" context="Sem valor à direita" />
        <DataLine size={size} divider={divider} label="Rótulo longo que precisa de mais espaço para caber" value="R$ 9,90" />
        <DataLine size={size} divider={divider} label="Taxa" value="84x de R$ 1.234.567,89 com seguro prestamista incluso" />
        <DataLine size={size} divider={divider} label="Código_do_contrato_sem_espaços" context="Palavra maior que a coluna" value="R$1.234.567.890,00" />
      </div>
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
