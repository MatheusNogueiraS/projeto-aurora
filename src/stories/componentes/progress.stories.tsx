import type { Meta, StoryObj } from "@storybook/react-vite"

import { Progress } from "@/components/ui/progress"

const contexts = ["Nenhum", "Porcentagem", "Etapas"] as const

// Os controles: o progresso, e o contexto opcional — porcentagem no fim da barra ou etapas
// no fim da barra, à direita ("3 de 5"). Com etapas, a barra segue a conta das etapas.
type ProgressStoryArgs = {
  context: (typeof contexts)[number]
  value: number
  total: number
  current: number
}

// controles escondidos não chegam até aqui, por isso os padrões
function StoryProgress({ context = "Nenhum", value = 35, total = 5, current = 3 }: Partial<ProgressStoryArgs>) {
  return (
    <Progress
      className="max-w-[312px]"
      aria-label="Progresso da proposta"
      value={context === "Etapas" ? undefined : value}
      showValue={context === "Porcentagem"}
      steps={context === "Etapas" ? { current, total } : undefined}
    />
  )
}

const meta = {
  title: "Componentes/Progress",
  tags: ["autodocs"],
  parameters: {
    docs: { description: { component: "Mostra quanto de uma tarefa já foi concluído. Pode mostrar a porcentagem ou as etapas." } },
  },
  args: { context: "Nenhum", value: 35, total: 5, current: 3 },
  argTypes: {
    context: { name: "Contexto", control: "inline-radio", options: contexts, description: "Só a barra, ou porcentagem ou etapas no fim dela." },
    value: { name: "Progresso", control: { type: "range", min: 0, max: 100, step: 5 }, description: "Quanto já foi concluído, de 0 a 100.", if: { arg: "context", neq: "Etapas" } },
    total: { name: "Etapas · total", control: { type: "range", min: 2, max: 10, step: 1 }, description: "Quantas etapas existem.", if: { arg: "context", eq: "Etapas" } },
    current: { name: "Etapas · atual", control: { type: "range", min: 0, max: 10, step: 1 }, description: "Quantas já foram feitas.", if: { arg: "context", eq: "Etapas" } },
  },
  render: (args) => <StoryProgress {...args} />,
} satisfies Meta<ProgressStoryArgs>

export default meta
type Story = StoryObj<typeof meta>

export const Padrao: Story = { name: "Padrão" }

export const Variantes: Story = {
  render: (args) => (
    <div className="flex max-w-[312px] flex-col gap-xl">
      <StoryProgress {...args} context="Nenhum" />
      <StoryProgress {...args} context="Porcentagem" />
      <StoryProgress {...args} context="Etapas" />
      <div className="flex flex-col gap-md">
        {[0, 10, 100].map((value) => (
          <StoryProgress key={value} {...args} context="Porcentagem" value={value} />
        ))}
      </div>
    </div>
  ),
}
