import type { Meta, StoryObj } from "@storybook/react-vite"

import { Badge } from "@/components/ui/badge"

const variants = ["default", "secondary", "destructive", "outline", "ghost", "link"] as const

const meta = {
  title: "Componentes/Badge",
  component: Badge,
  tags: ["autodocs"],
  parameters: {
    docs: { description: { component: "Rótulo curto de status ou categoria. Não é clicável, a não ser quando usado como link." } },
  },
  args: { children: "Em análise", variant: "default" },
  argTypes: { variant: { control: "select", options: variants } },
} satisfies Meta<typeof Badge>

export default meta
type Story = StoryObj<typeof meta>

export const Padrao: Story = { name: "Padrão" }

export const Variantes: Story = {
  render: (args) => (
    <div className="flex flex-wrap items-center gap-xxxs">
      {variants.map((variant) => (
        <Badge key={variant} {...args} variant={variant}>
          {variant}
        </Badge>
      ))}
    </div>
  ),
}

export const Status: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-xxxs">
      <Badge>Aprovado</Badge>
      <Badge variant="secondary">Em análise</Badge>
      <Badge variant="outline">Rascunho</Badge>
      <Badge variant="destructive">Recusado</Badge>
    </div>
  ),
}
