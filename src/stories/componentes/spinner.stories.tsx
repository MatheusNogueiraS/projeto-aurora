import type { Meta, StoryObj } from "@storybook/react-vite"

import { Spinner } from "@/components/ui/spinner"

const tones = { Marca: "brand", Neutro: "neutral", "Cor do entorno": "inherit" } as const
const sizes = ["sm", "default", "lg"] as const

// Os controles seguem o Spinner do shadcn (arco girando): cor, tamanho e o texto de contexto
// opcional. Dentro de um botão, use a opção Carregando do Button.
type SpinnerStoryArgs = {
  size: (typeof sizes)[number]
  tone: keyof typeof tones
  showLabel: boolean
  label: string
  labelPosition: "side" | "below"
}

// controles escondidos não chegam até aqui, por isso os padrões
function StorySpinner({ size = "default", tone = "Marca", showLabel = false, label = "Carregando...", labelPosition = "side" }: Partial<SpinnerStoryArgs>) {
  return <Spinner size={size} tone={tones[tone]} label={showLabel ? label : undefined} labelPosition={labelPosition} />
}

const meta = {
  title: "Componentes/Spinner",
  tags: ["autodocs"],
  parameters: {
    docs: { description: { component: "Indica que algo está carregando. Pode ter um texto de contexto. Em botões, use a opção Carregando do Button." } },
  },
  args: { size: "default", tone: "Marca", showLabel: false, label: "Carregando...", labelPosition: "side" },
  argTypes: {
    size: { name: "Tamanho", control: "inline-radio", options: sizes, description: "sm (16px), default (24px) ou lg (32px)." },
    tone: { name: "Cor", control: "inline-radio", options: Object.keys(tones), description: "Laranja da marca, cinza, ou a cor de onde está." },
    showLabel: { name: "Texto", control: "boolean", description: "Texto de contexto junto do ícone." },
    label: { name: "Texto · conteúdo", control: "text", if: { arg: "showLabel" } },
    labelPosition: { name: "Texto · posição", control: "inline-radio", options: ["side", "below"], description: "Ao lado (side) ou embaixo (below).", if: { arg: "showLabel" } },
  },
  render: (args) => <StorySpinner {...args} />,
} satisfies Meta<SpinnerStoryArgs>

export default meta
type Story = StoryObj<typeof meta>

export const Padrao: Story = { name: "Padrão" }

export const Variantes: Story = {
  render: (args) => (
    <div className="flex flex-col gap-xl">
      <div className="flex flex-wrap items-center gap-xl">
        <StorySpinner {...args} tone="Marca" />
        <StorySpinner {...args} tone="Neutro" />
      </div>
      <div className="flex flex-wrap items-center gap-xl">
        <StorySpinner {...args} showLabel labelPosition="side" />
        <StorySpinner {...args} showLabel labelPosition="below" label="Carregando a proposta..." />
      </div>
    </div>
  ),
}

export const Tamanhos: Story = {
  render: (args) => (
    <div className="flex flex-wrap items-center gap-xl">
      {sizes.map((size) => (
        <StorySpinner key={size} {...args} size={size} />
      ))}
    </div>
  ),
}
