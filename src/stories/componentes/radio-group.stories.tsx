import type { Meta, StoryObj } from "@storybook/react-vite"

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

const options = [
  ["pix", "Pix"],
  ["ted", "TED"],
  ["boleto", "Boleto"],
] as const
const selections = ["Nenhuma", "Pix", "TED", "Boleto"] as const

// Controles no padrão do painel do Figma: opção escolhida, descrição e estados.
type RadioGroupStoryArgs = {
  selected: (typeof selections)[number]
  showDescription: boolean
  invalid: boolean
  disabled: boolean
}

const descriptions: Record<string, string> = { pix: "Na hora, a qualquer momento.", ted: "Em dias úteis.", boleto: "Até 3 dias úteis." }

function StoryRadioGroup({ selected = "Pix", showDescription, invalid, disabled }: RadioGroupStoryArgs) {
  const value = options.find(([, label]) => label === selected)?.[0] ?? ""
  return (
    <RadioGroup key={value} defaultValue={value} disabled={disabled} aria-label="Forma de pagamento">
      {options.map(([v, label]) => (
        <RadioGroupItem
          key={v}
          value={v}
          aria-invalid={invalid || undefined}
          label={label}
          description={showDescription ? descriptions[v] : undefined}
        />
      ))}
    </RadioGroup>
  )
}

const meta = {
  title: "Componentes/Radio Group",
  tags: ["autodocs"],
  parameters: { docs: { description: { component: "Escolha de uma única opção entre poucas, todas visíveis." } } },
  args: { selected: "Pix", showDescription: false, invalid: false, disabled: false },
  argTypes: {
    selected: { name: "Selecionado", control: "inline-radio", options: selections, description: "Opção marcada.", if: { arg: "invalid", truthy: false } },
    showDescription: { name: "Descrição", control: "boolean", description: "Mostra um texto de apoio em cada opção." },
    invalid: { name: "Erro", control: "boolean", description: "Escolha obrigatória não feita. Some ao escolher.", if: { arg: "disabled", truthy: false }, table: { category: "Estado" } },
    disabled: { name: "Desabilitado", control: "boolean", description: "Bloqueia a escolha.", if: { arg: "invalid", truthy: false }, table: { category: "Estado" } },
  },
  render: (args) => <StoryRadioGroup {...args} selected={args.invalid ? "Nenhuma" : args.selected} />,
} satisfies Meta<RadioGroupStoryArgs>

export default meta
type Story = StoryObj<typeof meta>

export const Padrao: Story = { name: "Padrão" }
export const Desabilitado: Story = { args: { disabled: true } }
