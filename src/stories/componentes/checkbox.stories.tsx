import type { Meta, StoryObj } from "@storybook/react-vite"

import { Checkbox } from "@/components/ui/checkbox"

const meta = {
  title: "Componentes/Checkbox",
  component: Checkbox,
  tags: ["autodocs"],
  parameters: { docs: { description: { component: "Marca uma ou mais opções independentes." } } },
  args: { disabled: false },
  render: (args) => (
    <label className="flex items-center gap-nano typo-body-small">
      <Checkbox {...args} /> Aceito os termos
    </label>
  ),
} satisfies Meta<typeof Checkbox>

export default meta
type Story = StoryObj<typeof meta>

export const Desmarcado: Story = {}
export const Marcado: Story = { args: { defaultChecked: true } }
export const ComErro: Story = { name: "Com erro", args: { "aria-invalid": true } }
export const Desabilitado: Story = { args: { disabled: true } }
