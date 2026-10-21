import type { Meta, StoryObj } from "@storybook/react-vite"

import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

const sides = { Cima: "top", Direita: "right", Baixo: "bottom", Esquerda: "left" } as const
type Side = keyof typeof sides

// Controles no padrão do painel do Figma: texto, posição e se fica aberto na prévia.
type TooltipStoryArgs = { content: string; side: Side; open: boolean }

function StoryTooltip({ content, side = "Cima", open }: TooltipStoryArgs) {
  return (
    <Tooltip key={`${String(open)}-${side}`} defaultOpen={open}>
      <TooltipTrigger asChild>
        <Button variant="outline">Passe o mouse</Button>
      </TooltipTrigger>
      <TooltipContent side={sides[side]}>{content}</TooltipContent>
    </Tooltip>
  )
}

const meta = {
  title: "Componentes/Tooltip",
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: { description: { component: "Dica curta que aparece ao passar o mouse ou focar um elemento." } },
  },
  decorators: [
    (Story) => (
      <TooltipProvider>
        <div className="p-xxl">
          <Story />
        </div>
      </TooltipProvider>
    ),
  ],
  args: { content: "Simule antes de contratar", side: "Cima", open: true },
  argTypes: {
    content: { name: "Texto", control: "text", description: "Texto da dica." },
    side: { name: "Posição", control: "inline-radio", options: Object.keys(sides), description: "Lado em que a dica aparece." },
    open: { name: "Aberto", control: "boolean", description: "Mantém a dica visível na prévia.", table: { category: "Estado" } },
  },
  render: (args) => <StoryTooltip {...args} />,
} satisfies Meta<TooltipStoryArgs>

export default meta
type Story = StoryObj<typeof meta>

export const Padrao: Story = { name: "Padrão" }
