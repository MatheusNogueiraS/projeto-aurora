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

const sides = ["top", "right", "bottom", "left"] as const
type Side = (typeof sides)[number]

// Controles no padrão do painel do Figma: título, descrição, posição e se fica aberto.
type PopoverStoryArgs = { title: string; showDescription: boolean; description: string; side: Side; open: boolean }

function StoryPopover({ title, showDescription, description = "", side = "bottom", open }: PopoverStoryArgs) {
  return (
    <Popover key={`${String(open)}-${side}`} defaultOpen={open}>
      <PopoverTrigger asChild>
        <Button variant="secondary">Ver detalhes</Button>
      </PopoverTrigger>
      <PopoverContent side={side}>
        <PopoverHeader>
          <PopoverTitle>{title}</PopoverTitle>
          {showDescription && <PopoverDescription>{description}</PopoverDescription>}
        </PopoverHeader>
      </PopoverContent>
    </Popover>
  )
}

const meta = {
  title: "Components/Popover",
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: { description: { component: "Painel que abre ao clicar, com informação ou ações complementares." } },
  },
  decorators: [(Story) => <div className="p-xxl"><Story /></div>],
  args: { title: "Detalhes da parcela", showDescription: true, description: "Vencimento todo dia 10. Valor de R$ 250,00.", side: "bottom", open: true },
  argTypes: {
    title: { name: "Title", control: "text" },
    showDescription: { name: "Description", control: "boolean" },
    description: { name: "Description · content", control: "text", if: { arg: "showDescription" } },
    side: { name: "Position", control: "inline-radio", options: sides, table: { defaultValue: { summary: '"bottom"' } } },
    open: { name: "Open", control: "boolean", table: { category: "State" } },
  },
  render: (args) => <StoryPopover {...args} />,
} satisfies Meta<PopoverStoryArgs>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
