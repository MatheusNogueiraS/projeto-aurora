import type { Meta, StoryObj } from "@storybook/react-vite"

import { DataLine, DataList } from "@/components/ui/data-line"

const displays = ["Linha", "Lista"] as const

// Os controles cobrem todas as partes: rótulo e contexto (esquerda), valor, suporte e
// descrição (direita), tamanho, destaque e a lista com divisória.
type DataLineStoryArgs = {
  display: (typeof displays)[number]
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
  divided: boolean
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
}: Partial<DataLineStoryArgs>) {
  return (
    <DataLine
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

// exemplo de tabela de preço, com o total em destaque
function PriceTable({ size, divided = true }: Partial<DataLineStoryArgs>) {
  return (
    <DataList divided={divided}>
      <DataLine size={size} label="Valor do produto" value="R$ 3.299,00" />
      <DataLine size={size} label="Taxa de juros" context="ao mês" value="0,00%" />
      <DataLine size={size} label="CET" context="Custo Efetivo Total" value="12,34%" support="ao ano" />
      <DataLine size={size} label="IOF" context="Imposto sobre operação" value="R$ 48,20" description="Incluso no valor total" />
      <DataLine size={size} label="Parcelas" value="84x de R$ 42,38" support="(0,00%)" description="Primeira em 15/08/2025" />
      <DataLine size={size} emphasis label="Total a pagar" value="R$ 3.559,92" />
    </DataList>
  )
}

function StoryDataLine({ display = "Linha", divided = true, ...args }: Partial<DataLineStoryArgs>) {
  return (
    <div className="max-w-[400px]">
      {display === "Linha" ? <StoryLine {...args} /> : <PriceTable size={args.size} divided={divided} />}
    </div>
  )
}

const meta = {
  title: "Componentes/DataLine",
  tags: ["autodocs"],
  parameters: {
    docs: { description: { component: "Mostra um dado e o seu valor lado a lado, como numa tabela de preço. Cada lado ocupa o espaço que precisa." } },
  },
  args: {
    display: "Linha",
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
    divided: true,
  },
  argTypes: {
    display: { name: "Exibição", control: "inline-radio", options: displays, description: "Uma linha ou uma lista (ex.: tabela de preço)." },
    label: { name: "Rótulo", control: "text", description: "Nome do dado, à esquerda.", if: { arg: "display", eq: "Linha" } },
    showContext: { name: "Contexto", control: "boolean", description: "Complemento embaixo do rótulo.", if: { arg: "display", eq: "Linha" } },
    context: { name: "Contexto · conteúdo", control: "text", if: { arg: "showContext" } },
    showValue: { name: "Valor", control: "boolean", description: "Valor à direita. Sem ele, só o rótulo.", if: { arg: "display", eq: "Linha" } },
    value: { name: "Valor · conteúdo", control: "text", if: { arg: "showValue" } },
    showSupport: { name: "Suporte", control: "boolean", description: "Complemento ao lado do valor.", if: { arg: "showValue" } },
    support: { name: "Suporte · conteúdo", control: "text", if: { arg: "showSupport" } },
    showDescription: { name: "Descrição", control: "boolean", description: "Informação embaixo do valor.", if: { arg: "display", eq: "Linha" } },
    description: { name: "Descrição · conteúdo", control: "text", if: { arg: "showDescription" } },
    size: { name: "Tamanho", control: "inline-radio", options: ["sm", "default", "lg"], description: "sm (14px), default (16px) ou lg (18px)." },
    emphasis: { name: "Destaque", control: "boolean", description: "Para o total: rótulo em negrito e valor maior.", if: { arg: "display", eq: "Linha" } },
    divided: { name: "Divisória", control: "boolean", description: "Linha entre os itens da lista.", if: { arg: "display", eq: "Lista" } },
  },
  render: (args) => <StoryDataLine {...args} />,
} satisfies Meta<DataLineStoryArgs>

export default meta
type Story = StoryObj<typeof meta>

export const Padrao: Story = { name: "Padrão" }

export const Variantes: Story = {
  render: (args) => (
    <div className="flex max-w-[400px] flex-col gap-xl">
      <PriceTable size={args.size} />
      <DataList>
        <DataLine size={args.size} label="Só rótulo" context="Sem valor à direita" />
        <DataLine
          size={args.size}
          label="Rótulo longo que precisa de mais espaço para caber"
          value="R$ 9,90"
        />
        <DataLine size={args.size} label="Taxa" value="84x de R$ 1.234.567,89 com seguro prestamista incluso" />
      </DataList>
    </div>
  ),
}

export const Tamanhos: Story = {
  render: (args) => (
    <div className="flex max-w-[400px] flex-col gap-xl">
      <StoryLine {...args} size="sm" />
      <StoryLine {...args} size="default" />
      <StoryLine {...args} size="lg" />
    </div>
  ),
}
