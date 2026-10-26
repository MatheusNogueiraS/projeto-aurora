import type { Meta, StoryObj } from "@storybook/react-vite"

import { Progress } from "@/components/ui/progress"

const contexts = ["none", "percentage", "steps"] as const

// Os controles: o progresso, e o contexto opcional — porcentagem no fim da barra ou etapas
// no fim da barra, à direita ("3 de 5"). Com etapas, a barra segue a conta das etapas.
type ProgressStoryArgs = {
  context: (typeof contexts)[number]
  value: number
  total: number
  current: number
}

// controles escondidos não chegam até aqui, por isso os padrões
function StoryProgress({ context = "none", value = 35, total = 5, current = 3 }: Partial<ProgressStoryArgs>) {
  return (
    <Progress
      className="max-w-[312px]"
      aria-label="Progresso da proposta"
      value={context === "steps" ? undefined : value}
      showValue={context === "percentage"}
      steps={context === "steps" ? { current, total } : undefined}
    />
  )
}

const meta = {
  title: "Components/Progress",
  tags: ["autodocs"],
  parameters: {
    docs: { description: { component: "Mostra quanto de uma tarefa já foi concluído." } },
  },
  args: { context: "none", value: 35, total: 5, current: 3 },
  argTypes: {
    context: { name: "Context", control: "inline-radio", options: contexts, table: { defaultValue: { summary: '"none"' } } },
    value: { name: "Progress", control: { type: "range", min: 0, max: 100, step: 5 }, if: { arg: "context", neq: "steps" } },
    total: { name: "Steps · total", control: { type: "range", min: 2, max: 10, step: 1 }, if: { arg: "context", eq: "steps" } },
    current: { name: "Steps · current", control: { type: "range", min: 0, max: 10, step: 1 }, if: { arg: "context", eq: "steps" } },
  },
  render: (args) => <StoryProgress {...args} />,
} satisfies Meta<ProgressStoryArgs>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Variants: Story = {
  render: (args) => (
    <div className="flex max-w-[312px] flex-col gap-xl">
      <StoryProgress {...args} context="none" />
      <StoryProgress {...args} context="percentage" />
      <StoryProgress {...args} context="steps" />
      <div className="flex flex-col gap-md">
        {[0, 10, 100].map((value) => (
          <StoryProgress key={value} {...args} context="percentage" value={value} />
        ))}
      </div>
    </div>
  ),
}
