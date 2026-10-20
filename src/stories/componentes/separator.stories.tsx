import type { Meta, StoryObj } from "@storybook/react-vite"

import { Separator } from "@/components/ui/separator"

const meta = {
  title: "Componentes/Separator",
  component: Separator,
  tags: ["autodocs"],
  parameters: { docs: { description: { component: "Linha que separa grupos de conteúdo." } } },
} satisfies Meta<typeof Separator>

export default meta
type Story = StoryObj<typeof meta>

export const Horizontal: Story = {
  render: () => (
    <div className="flex max-w-[288px] flex-col gap-sm typo-body-md-regular">
      <span>Dados pessoais</span>
      <Separator />
      <span>Endereço</span>
    </div>
  ),
}

export const Vertical: Story = {
  render: () => (
    <div className="flex h-[20px] items-center gap-md typo-body-md-regular">
      <span>Perfil</span>
      <Separator orientation="vertical" />
      <span>Conta</span>
      <Separator orientation="vertical" />
      <span>Sair</span>
    </div>
  ),
}
