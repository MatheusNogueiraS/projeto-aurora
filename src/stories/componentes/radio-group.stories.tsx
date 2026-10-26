import type { Meta, StoryObj } from "@storybook/react-vite"

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

const options = [
  ["pix", "Pix"],
  ["ted", "TED"],
  ["boleto", "Boleto"],
] as const
const selections = ["None", "Pix", "TED", "Boleto"] as const

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
  title: "Components/Radio Group",
  tags: ["autodocs"],
  parameters: { docs: { description: { component: "Escolha de uma única opção entre poucas, todas visíveis." } } },
  args: { selected: "Pix", showDescription: false, invalid: false, disabled: false },
  argTypes: {
    selected: { name: "Selected", control: "inline-radio", options: selections, if: { arg: "invalid", truthy: false }, table: { defaultValue: { summary: '"None"' } } },
    showDescription: { name: "Description", control: "boolean" },
    invalid: { name: "Error", control: "boolean", if: { arg: "disabled", truthy: false }, table: { category: "State" } },
    disabled: { name: "Disabled", control: "boolean", if: { arg: "invalid", truthy: false }, table: { category: "State" } },
  },
  render: (args) => <StoryRadioGroup {...args} selected={args.invalid ? "None" : args.selected} />,
} satisfies Meta<RadioGroupStoryArgs>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
export const Disabled: Story = { args: { disabled: true } }
