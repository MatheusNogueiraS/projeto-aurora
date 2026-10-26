import type { Meta, StoryObj } from "@storybook/react-vite"

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const prazos = ["12 meses", "24 meses", "48 meses"] as const
const selections = ["None", ...prazos] as const
const sizes = ["sm", "default", "lg"] as const

// Controles no padrão do painel do Figma: texto, valor, tamanho e estados.
type SelectStoryArgs = {
  placeholder: string
  selected: (typeof selections)[number]
  size: (typeof sizes)[number]
  open: boolean
  invalid: boolean
  disabled: boolean
}

function StorySelect({ placeholder, selected = "None", size, open, invalid, disabled }: SelectStoryArgs) {
  const value = selected === "None" ? undefined : selected
  return (
    <Select key={`${selected}-${String(open)}`} defaultValue={value} defaultOpen={open} disabled={disabled}>
      <SelectTrigger size={size} aria-invalid={invalid || undefined} aria-label="Prazo">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Prazos</SelectLabel>
          {prazos.map((p) => (
            <SelectItem key={p} value={p}>
              {p}
            </SelectItem>
          ))}
          <SelectItem value="84 meses" disabled>
            84 meses
          </SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}

const meta = {
  title: "Components/Select",
  tags: ["autodocs"],
  parameters: { docs: { description: { component: "Escolha de uma opção numa lista fechada." } } },
  args: { placeholder: "Escolha um prazo", selected: "None", size: "default", open: false, invalid: false, disabled: false },
  argTypes: {
    placeholder: { name: "Placeholder", control: "text" },
    selected: { name: "Selected", control: "inline-radio", options: selections, if: { arg: "invalid", truthy: false }, table: { defaultValue: { summary: '"None"' } } },
    size: { name: "Size", control: "inline-radio", options: sizes, table: { defaultValue: { summary: '"default"' } } },
    open: { name: "Open", control: "boolean", if: { arg: "disabled", truthy: false }, table: { category: "State" } },
    invalid: { name: "Error", control: "boolean", if: { arg: "disabled", truthy: false }, table: { category: "State" } },
    disabled: { name: "Disabled", control: "boolean", if: { arg: "invalid", truthy: false }, table: { category: "State" } },
  },
  render: (args) => <StorySelect {...args} selected={args.invalid ? "None" : args.selected} />,
} satisfies Meta<SelectStoryArgs>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Sizes: Story = {
  render: (args) => (
    <div className="flex flex-wrap items-center gap-md">
      {sizes.map((size) => (
        <StorySelect key={size} {...args} size={size} open={false} />
      ))}
    </div>
  ),
}

export const Disabled: Story = { args: { disabled: true, selected: "24 meses" } }
