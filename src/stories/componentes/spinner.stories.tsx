import type { Meta, StoryObj } from "@storybook/react-vite"

import { Spinner } from "@/components/ui/spinner"

const tones = ["brand", "neutral", "inherit"] as const
const sizes = ["sm", "default", "lg"] as const

// Os controles seguem o Spinner do shadcn (arco girando): cor, tamanho e o texto de contexto
// opcional. Dentro de um botão, use a opção Carregando do Button.
type SpinnerStoryArgs = {
  size: (typeof sizes)[number]
  tone: (typeof tones)[number]
  showLabel: boolean
  label: string
  labelPosition: "side" | "below"
}

// controles escondidos não chegam até aqui, por isso os padrões
function StorySpinner({ size = "default", tone = "brand", showLabel = false, label = "Carregando...", labelPosition = "side" }: Partial<SpinnerStoryArgs>) {
  return <Spinner size={size} tone={tone} label={showLabel ? label : undefined} labelPosition={labelPosition} />
}

const meta = {
  title: "Components/Spinner",
  tags: ["autodocs"],
  parameters: {
    docs: { description: { component: "Indica que algo está carregando; em botões, use o Loading do Button." } },
  },
  args: { size: "default", tone: "brand", showLabel: false, label: "Carregando...", labelPosition: "side" },
  argTypes: {
    size: { name: "Size", control: "inline-radio", options: sizes, table: { defaultValue: { summary: '"default"' } } },
    tone: { name: "Tone", control: "inline-radio", options: tones, table: { defaultValue: { summary: '"brand"' } } },
    showLabel: { name: "Text", control: "boolean" },
    label: { name: "Text · content", control: "text", if: { arg: "showLabel" } },
    labelPosition: { name: "Text · position", control: "inline-radio", options: ["side", "below"], if: { arg: "showLabel" }, table: { defaultValue: { summary: '"side"' } } },
  },
  render: (args) => <StorySpinner {...args} />,
} satisfies Meta<SpinnerStoryArgs>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Variants: Story = {
  render: (args) => (
    <div className="flex flex-col gap-xl">
      <div className="flex flex-wrap items-center gap-xl">
        <StorySpinner {...args} tone="brand" />
        <StorySpinner {...args} tone="neutral" />
      </div>
      <div className="flex flex-wrap items-center gap-xl">
        <StorySpinner {...args} showLabel labelPosition="side" />
        <StorySpinner {...args} showLabel labelPosition="below" label="Carregando a proposta..." />
      </div>
    </div>
  ),
}

export const Sizes: Story = {
  render: (args) => (
    <div className="flex flex-wrap items-center gap-xl">
      {sizes.map((size) => (
        <StorySpinner key={size} {...args} size={size} />
      ))}
    </div>
  ),
}
