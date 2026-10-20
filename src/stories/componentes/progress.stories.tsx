import type { Meta, StoryObj } from "@storybook/react-vite"

import { Progress } from "@/components/ui/progress"

const meta = {
  title: "Componentes/Progress",
  component: Progress,
  tags: ["autodocs"],
  parameters: { docs: { description: { component: "Mostra quanto de uma tarefa já foi concluído." } } },
  args: { value: 35 },
  argTypes: { value: { control: { type: "range", min: 0, max: 100, step: 5 } } },
  render: (args) => <Progress {...args} className="max-w-popover" aria-label="Progresso da proposta" />,
} satisfies Meta<typeof Progress>

export default meta
type Story = StoryObj<typeof meta>

export const EmAndamento: Story = { name: "Em andamento" }
export const Completo: Story = { args: { value: 100 } }
