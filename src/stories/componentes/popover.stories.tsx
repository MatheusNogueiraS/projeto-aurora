import type { Meta, StoryObj } from "@storybook/react-vite"

import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover"

const sides = { Cima: "top", Direita: "right", Baixo: "bottom", Esquerda: "left" } as const
type Side = keyof typeof sides

// Controles no padrão do painel do Figma: título, descrição, posição e se fica aberto.
type PopoverStoryArgs = { title: string; showDescription: boolean; description: string; side: Side; open: boolean }

function StoryPopover({ title, showDescription, description = "", side = "Baixo", open }: PopoverStoryArgs) {
  return (
    <Popover key={`${String(open)}-${side}`} defaultOpen={open}>
      <PopoverTrigger asChild>
        <Button variant="secondary">Ver detalhes</Button>
      </PopoverTrigger>
      <PopoverContent side={sides[side]}>
        <PopoverHeader>
          <PopoverTitle>{title}</PopoverTitle>
          {showDescription && <PopoverDescription>{description}</PopoverDescription>}
        </PopoverHeader>
      </PopoverContent>
    </Popover>
  )
}

const meta = {
  title: "Componentes/Popover",
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: { description: { component: "Painel que abre ao clicar, com informação ou ações complementares." } },
  },
  decorators: [(Story) => <div className="p-xxl"><Story /></div>],
  args: { title: "Detalhes da parcela", showDescription: true, description: "Vencimento todo dia 10. Valor de R$ 250,00.", side: "Baixo", open: true },
  argTypes: {
    title: { name: "Título", control: "text", description: "Texto do título." },
    showDescription: { name: "Descrição", control: "boolean", description: "Mostra um texto de apoio." },
    description: { name: "Descrição · conteúdo", control: "text", if: { arg: "showDescription" } },
    side: { name: "Posição", control: "inline-radio", options: Object.keys(sides), description: "Lado em que o painel abre." },
    open: { name: "Aberto", control: "boolean", description: "Mantém o painel visível na prévia.", table: { category: "Estado" } },
  },
  render: (args) => <StoryPopover {...args} />,
} satisfies Meta<PopoverStoryArgs>

export default meta
type Story = StoryObj<typeof meta>

export const Padrao: Story = { name: "Padrão" }
