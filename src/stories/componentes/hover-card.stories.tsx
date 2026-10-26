import type { Meta, StoryObj } from "@storybook/react-vite"

import { Button } from "@/components/ui/button"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"

const sides = ["top", "right", "bottom", "left"] as const
type Side = (typeof sides)[number]

// Controles no padrão do painel do Figma: título, descrição, posição e se fica aberto.
type HoverCardStoryArgs = { title: string; showDescription: boolean; description: string; side: Side; open: boolean }

function StoryHoverCard({ title, showDescription, description = "", side = "bottom", open }: HoverCardStoryArgs) {
  return (
    <HoverCard key={`${String(open)}-${side}`} defaultOpen={open}>
      <HoverCardTrigger asChild>
        <Button variant="link">@aurora</Button>
      </HoverCardTrigger>
      <HoverCardContent side={side}>
        <p className="typo-body-md-bold">{title}</p>
        {showDescription && <p className="typo-body-md-regular text-text-3">{description}</p>}
      </HoverCardContent>
    </HoverCard>
  )
}

const meta = {
  title: "Components/Hover Card",
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: { description: { component: "Prévia que aparece ao passar o mouse sobre um link; não use para conteúdo essencial." } },
  },
  decorators: [(Story) => <div className="p-xxl"><Story /></div>],
  args: { title: "Projeto Aurora", showDescription: true, description: "Design system do Bmg.", side: "bottom", open: true },
  argTypes: {
    title: { name: "Title", control: "text" },
    showDescription: { name: "Description", control: "boolean" },
    description: { name: "Description · content", control: "text", if: { arg: "showDescription" } },
    side: { name: "Position", control: "inline-radio", options: sides, table: { defaultValue: { summary: '"bottom"' } } },
    open: { name: "Open", control: "boolean", table: { category: "State" } },
  },
  render: (args) => <StoryHoverCard {...args} />,
} satisfies Meta<HoverCardStoryArgs>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
