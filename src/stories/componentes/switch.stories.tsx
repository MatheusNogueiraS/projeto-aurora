import type { Meta, StoryObj } from "@storybook/react-vite"

import { Switch } from "@/components/ui/switch"

const meta = {
  title: "Componentes/Switch",
  component: Switch,
  tags: ["autodocs"],
  parameters: { docs: { description: { component: "Liga ou desliga uma opção com efeito imediato." } } },
  args: { size: "default", disabled: false },
  argTypes: { size: { control: "select", options: ["default", "sm"] } },
  render: (args) => (
    <label className="flex items-center gap-sm typo-body-md-regular">
      <Switch {...args} /> Receber notificações
    </label>
  ),
} satisfies Meta<typeof Switch>

export default meta
type Story = StoryObj<typeof meta>

export const Desligado: Story = {}
export const Ligado: Story = { args: { defaultChecked: true } }
export const Pequeno: Story = { args: { size: "sm", defaultChecked: true } }
export const Desabilitado: Story = { args: { disabled: true } }
