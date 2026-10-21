import type { Meta, StoryObj } from "@storybook/react-vite"

import { Progress } from "@/components/ui/progress"

type ProgressStoryArgs = { value: number }

const meta = {
  title: "Componentes/Progress",
  tags: ["autodocs"],
  parameters: { docs: { description: { component: "Mostra quanto de uma tarefa já foi concluído." } } },
  args: { value: 35 },
  argTypes: {
    value: { name: "Progresso", control: { type: "range", min: 0, max: 100, step: 5 }, description: "Quanto já foi concluído, de 0 a 100." },
  },
  render: ({ value }) => <Progress value={value} className="max-w-[288px]" aria-label="Progresso da proposta" />,
} satisfies Meta<ProgressStoryArgs>

export default meta
type Story = StoryObj<typeof meta>

export const Padrao: Story = { name: "Padrão" }

export const Variantes: Story = {
  render: () => (
    <div className="flex max-w-[288px] flex-col gap-md">
      {[0, 35, 100].map((value) => (
        <Progress key={value} value={value} aria-label={`${value}% concluído`} />
      ))}
    </div>
  ),
}
