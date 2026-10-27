import type { Meta, StoryObj } from "@storybook/react-vite"

import { InfoLine, InfoLineGroup } from "@/components/ui/info-line"

// Linhas de exemplo (o que vai em cada uma se escolhe na página Info Line/Item).
const lines = [
  { label: "Valor do produto", value: "R$ 3.299,00" },
  { label: "Taxa de juros", context: "ao mês", value: "0,00%" },
  { label: "CET", context: "Custo Efetivo Total", value: "12,34%", support: "ao ano" },
  { label: "IOF", value: "R$ 48,20" },
  { label: "Parcelas", value: "84x de R$ 42,38" },
  { label: "Total a pagar", value: "R$ 3.559,92", emphasis: true },
]

// O grupo é só a montagem, como no Accordion e na Table: empilha as linhas e decide se há divisor entre elas.
type GroupStoryArgs = {
  count: number
  divider: boolean
  size: "sm" | "default" | "lg"
}

// controles escondidos não chegam até aqui, por isso os padrões
function StoryGroup({ count = 4, divider = true, size = "default" }: Partial<GroupStoryArgs>) {
  return (
    <InfoLineGroup divider={divider} className="max-w-[400px]">
      {lines.slice(0, count).map((l) => (
        <InfoLine key={l.label} size={size} {...l} />
      ))}
    </InfoLineGroup>
  )
}

const meta = {
  title: "Components/Info Line/Group",
  tags: ["autodocs"],
  parameters: {
    docs: { description: { component: "Várias linhas juntas, como numa tabela de preço, com ou sem divisor entre elas." } },
  },
  args: { count: 4, divider: true, size: "default" },
  argTypes: {
    count: { name: "Items", control: { type: "range", min: 1, max: 6, step: 1 } },
    divider: { name: "Divider", control: "boolean", table: { defaultValue: { summary: "true" } } },
    size: { name: "Size", control: "inline-radio", options: ["sm", "default", "lg"], table: { defaultValue: { summary: '"default"' } } },
  },
  render: (args) => <StoryGroup {...args} />,
} satisfies Meta<GroupStoryArgs>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

// Com e sem divisor, lado a lado.
export const Variants: Story = {
  render: (args) => (
    <div className="flex flex-wrap items-start gap-xl">
      <StoryGroup {...args} divider />
      <StoryGroup {...args} divider={false} />
    </div>
  ),
}
