import type { Meta, StoryObj } from "@storybook/react-vite"

import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

const sides = ["top", "right", "bottom", "left"] as const
type Side = (typeof sides)[number]

// Controles no padrão do painel do Figma: texto, posição e se fica aberto na prévia.
type TooltipStoryArgs = { content: string; side: Side; open: boolean }

function StoryTooltip({ content, side = "top", open }: TooltipStoryArgs) {
  return (
    <Tooltip key={`${String(open)}-${side}`} defaultOpen={open}>
      <TooltipTrigger asChild>
        <Button variant="outline">Passe o mouse</Button>
      </TooltipTrigger>
      <TooltipContent side={side}>{content}</TooltipContent>
    </Tooltip>
  )
}

const meta = {
  title: "Components/Tooltip",
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
  args: { content: "Simule antes de contratar", side: "top", open: true },
  argTypes: {
    content: { name: "Text", control: "text" },
    side: { name: "Position", control: "inline-radio", options: sides, table: { defaultValue: { summary: '"top"' } } },
    open: { name: "Open", control: "boolean", table: { category: "State" } },
  },
  render: (args) => <StoryTooltip {...args} />,
} satisfies Meta<TooltipStoryArgs>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
