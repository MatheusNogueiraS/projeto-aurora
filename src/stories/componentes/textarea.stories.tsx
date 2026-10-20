import type { Meta, StoryObj } from "@storybook/react-vite"

import { Textarea } from "@/components/ui/textarea"

const meta = {
  title: "Componentes/Textarea",
  component: Textarea,
  tags: ["autodocs"],
  parameters: { docs: { description: { component: "Campo de texto de várias linhas; cresce conforme o conteúdo." } } },
  args: { placeholder: "Escreva uma observação", disabled: false },
  render: (args) => <Textarea {...args} className="max-w-popover" />,
} satisfies Meta<typeof Textarea>

export default meta
type Story = StoryObj<typeof meta>

export const Padrao: Story = { name: "Padrão" }
export const ComErro: Story = { name: "Com erro", args: { "aria-invalid": true, defaultValue: "Texto inválido" } }
export const Desabilitado: Story = { args: { disabled: true } }
