import type { Meta, StoryObj } from "@storybook/react-vite"

import { Button } from "@/components/ui/button"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"

const sides = { Cima: "top", Direita: "right", Baixo: "bottom", Esquerda: "left" } as const
type Side = keyof typeof sides

// Controles no padrão do painel do Figma: título, descrição, posição e se fica aberto.
type HoverCardStoryArgs = { title: string; showDescription: boolean; description: string; side: Side; open: boolean }

function StoryHoverCard({ title, showDescription, description = "", side = "Baixo", open }: HoverCardStoryArgs) {
  return (
    <HoverCard key={`${String(open)}-${side}`} defaultOpen={open}>
      <HoverCardTrigger asChild>
        <Button variant="link">@aurora</Button>
      </HoverCardTrigger>
      <HoverCardContent side={sides[side]}>
        <p className="typo-body-md-bold">{title}</p>
        {showDescription && <p className="typo-body-md-regular text-text-3">{description}</p>}
      </HoverCardContent>
    </HoverCard>
  )
}

const meta = {
  title: "Componentes/Hover Card",
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: { description: { component: "Prévia que aparece ao passar o mouse sobre um link. Não use para conteúdo essencial: não existe no toque." } },
  },
  decorators: [(Story) => <div className="p-xxl"><Story /></div>],
  args: { title: "Projeto Aurora", showDescription: true, description: "Design system do Bmg.", side: "Baixo", open: true },
  argTypes: {
    title: { name: "Título", control: "text", description: "Texto do título." },
    showDescription: { name: "Descrição", control: "boolean", description: "Mostra um texto de apoio." },
    description: { name: "Descrição · conteúdo", control: "text", if: { arg: "showDescription" } },
    side: { name: "Posição", control: "inline-radio", options: Object.keys(sides), description: "Lado em que a prévia abre." },
    open: { name: "Aberto", control: "boolean", description: "Mantém a prévia visível.", table: { category: "Estado" } },
  },
  render: (args) => <StoryHoverCard {...args} />,
} satisfies Meta<HoverCardStoryArgs>

export default meta
type Story = StoryObj<typeof meta>

export const Padrao: Story = { name: "Padrão" }
