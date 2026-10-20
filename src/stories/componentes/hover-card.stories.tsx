import type { Meta, StoryObj } from "@storybook/react-vite"

import { Button } from "@/components/ui/button"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"

const meta = {
  title: "Componentes/Hover Card",
  component: HoverCard,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: { description: { component: "Prévia que aparece ao passar o mouse sobre um link. Não use para conteúdo essencial: não existe no toque." } },
  },
} satisfies Meta<typeof HoverCard>

export default meta
type Story = StoryObj<typeof meta>

const Conteudo = () => (
  <HoverCardContent>
    <p className="typo-body-small-bold">Projeto Aurora</p>
    <p className="typo-body-small text-text-3">Design system do Bmg.</p>
  </HoverCardContent>
)

export const Padrao: Story = {
  name: "Padrão",
  render: () => (
    <HoverCard>
      <HoverCardTrigger asChild>
        <Button variant="link">@aurora</Button>
      </HoverCardTrigger>
      <Conteudo />
    </HoverCard>
  ),
}

export const Aberto: Story = {
  render: () => (
    <HoverCard defaultOpen>
      <HoverCardTrigger asChild>
        <Button variant="link">@aurora</Button>
      </HoverCardTrigger>
      <Conteudo />
    </HoverCard>
  ),
}
