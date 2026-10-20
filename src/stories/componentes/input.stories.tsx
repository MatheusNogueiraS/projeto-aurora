import type { Meta, StoryObj } from "@storybook/react-vite"

import { Input } from "@/components/ui/input"

const meta = {
  title: "Componentes/Input",
  component: Input,
  tags: ["autodocs"],
  parameters: { docs: { description: { component: "Campo de texto de uma linha." } } },
  args: { placeholder: "Seu nome", disabled: false },
  render: (args) => <Input {...args} className="max-w-popover" />,
} satisfies Meta<typeof Input>

export default meta
type Story = StoryObj<typeof meta>

export const Padrao: Story = { name: "Padrão" }
export const Preenchido: Story = { args: { defaultValue: "Maria Souza" } }
export const ComErro: Story = { name: "Com erro", args: { "aria-invalid": true, defaultValue: "email-invalido" } }
export const Desabilitado: Story = { args: { disabled: true, placeholder: "Desabilitado" } }
