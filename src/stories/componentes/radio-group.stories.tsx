import type { Meta, StoryObj } from "@storybook/react-vite"

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

const meta = {
  title: "Componentes/Radio Group",
  component: RadioGroup,
  tags: ["autodocs"],
  parameters: { docs: { description: { component: "Escolha de uma única opção entre poucas, todas visíveis." } } },
  args: { defaultValue: "pix", disabled: false },
  render: (args) => (
    <RadioGroup {...args}>
      {[
        ["pix", "Pix"],
        ["ted", "TED"],
        ["boleto", "Boleto"],
      ].map(([value, label]) => (
        <label key={value} className="flex items-center gap-nano typo-body-small">
          <RadioGroupItem value={value} /> {label}
        </label>
      ))}
    </RadioGroup>
  ),
} satisfies Meta<typeof RadioGroup>

export default meta
type Story = StoryObj<typeof meta>

export const Padrao: Story = { name: "Padrão" }
export const Desabilitado: Story = { args: { disabled: true } }
