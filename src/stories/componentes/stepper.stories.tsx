import type { Meta, StoryObj } from "@storybook/react-vite"

import { Stepper, StepperItem, type StepStatus } from "@/components/ui/stepper"

// etapas de exemplo: um processo de crédito, com data/detalhe como descrição
const sample = [
  { title: "Proposta enviada", description: "12/10 · 09:40" },
  { title: "Análise de crédito", description: "12/10 · 14:15" },
  { title: "Assinatura do contrato", description: "Aguardando o cliente" },
  { title: "Liberação do valor", description: "Até 2 dias úteis" },
  { title: "Concluído", description: "Valor na conta" },
  { title: "Pesquisa de satisfação", description: "Opcional" },
]

// Os controles seguem os steppers de mercado: orientação, tamanho, quantidade de etapas,
// etapa atual (com opção de erro) e descrição.
type StepperStoryArgs = {
  orientation: "horizontal" | "vertical"
  size: "sm" | "default"
  steps: number
  current: number
  error: boolean
  showDescription: boolean
}

function StoryStepper({ orientation = "horizontal", size = "default", steps = 4, current = 2, error = false, showDescription = false }: Partial<StepperStoryArgs>) {
  const status = (i: number): StepStatus =>
    i < current ? "complete" : i === current ? (error ? "error" : "current") : "upcoming"
  return (
    <Stepper orientation={orientation} size={size} aria-label="Andamento da proposta">
      {sample.slice(0, steps).map((s, i) => (
        <StepperItem
          key={s.title}
          step={i + 1}
          title={s.title}
          description={showDescription ? s.description : undefined}
          status={status(i + 1)}
        />
      ))}
    </Stepper>
  )
}

const meta = {
  title: "Componentes/Stepper",
  tags: ["autodocs"],
  parameters: {
    docs: { description: { component: "Mostra as etapas de um processo e em qual delas se está, como um andamento ou histórico." } },
  },
  args: { orientation: "horizontal", size: "default", steps: 4, current: 2, error: false, showDescription: false },
  argTypes: {
    orientation: { name: "Orientação", control: "inline-radio", options: ["horizontal", "vertical"], description: "Etapas lado a lado ou empilhadas (histórico)." },
    size: { name: "Tamanho", control: "inline-radio", options: ["sm", "default"], description: "sm (círculo de 20px) ou default (27px)." },
    steps: { name: "Etapas", control: { type: "range", min: 2, max: 6, step: 1 }, description: "Quantas etapas o processo tem." },
    current: { name: "Etapa atual", control: { type: "range", min: 1, max: 7, step: 1 }, description: "As anteriores ficam concluídas. Depois da última, todas concluídas." },
    error: { name: "Erro", control: "boolean", description: "A etapa atual teve um problema.", table: { category: "Estado" } },
    showDescription: { name: "Descrição", control: "boolean", description: "Texto de apoio embaixo de cada etapa." },
  },
  render: (args) => (
    <div className="max-w-[720px]">
      <StoryStepper {...args} />
    </div>
  ),
} satisfies Meta<StepperStoryArgs>

export default meta
type Story = StoryObj<typeof meta>

export const Padrao: Story = { name: "Padrão" }

export const Variantes: Story = {
  render: (args) => (
    <div className="flex max-w-[720px] flex-col gap-xl">
      <StoryStepper {...args} orientation="horizontal" current={2} error={false} />
      <StoryStepper {...args} orientation="horizontal" current={2} error />
      <StoryStepper {...args} orientation="horizontal" current={args.steps + 1} error={false} />
      <StoryStepper {...args} orientation="vertical" steps={5} current={3} error={false} showDescription />
    </div>
  ),
}

export const Tamanhos: Story = {
  render: (args) => (
    <div className="flex max-w-[720px] flex-col gap-xl">
      <StoryStepper {...args} size="sm" />
      <StoryStepper {...args} size="default" />
    </div>
  ),
}
