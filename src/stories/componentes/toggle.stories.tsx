import type { Meta, StoryObj } from "@storybook/react-vite"
import { BoldIcon, ItalicIcon } from "lucide-react"

import { Toggle } from "@/components/ui/toggle"

const meta = {
  title: "Componentes/Toggle",
  component: Toggle,
  tags: ["autodocs"],
  parameters: { docs: { description: { component: "Botão que fica ligado ou desligado (ex.: negrito numa barra de ferramentas)." } } },
  args: { variant: "default", size: "default", disabled: false },
  argTypes: {
    variant: { control: "select", options: ["default", "outline"] },
    size: { control: "select", options: ["sm", "default", "lg"] },
  },
  render: (args) => (
    <div className="flex items-center gap-xxxs">
      <Toggle {...args} aria-label="Negrito">
        <BoldIcon />
      </Toggle>
      <Toggle {...args} aria-label="Itálico" defaultPressed>
        <ItalicIcon />
      </Toggle>
    </div>
  ),
} satisfies Meta<typeof Toggle>

export default meta
type Story = StoryObj<typeof meta>

export const Padrao: Story = { name: "Padrão" }
export const Outline: Story = { args: { variant: "outline" } }
export const ComTexto: Story = {
  name: "Com texto",
  args: { variant: "outline" },
  render: (args) => (
    <Toggle {...args} aria-label="Negrito">
      <BoldIcon /> Negrito
    </Toggle>
  ),
}
