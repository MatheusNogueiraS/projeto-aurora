import * as React from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"

import { Checkbox } from "@/components/ui/checkbox"

const selections = ["unchecked", "checked", "indeterminate"] as const
type Selection = (typeof selections)[number]
type CheckedState = React.ComponentProps<typeof Checkbox>["checked"]
// controles escondidos não chegam até aqui (ex.: Seleção some com Erro ligado), por isso o padrão desmarcado
const toChecked = (s?: Selection): CheckedState => (s === "checked" ? true : s === "indeterminate" ? "indeterminate" : false)

// Os controles seguem o Checkbox do Nitro: textos, tamanho, seleção e estados.
type CheckboxStoryArgs = {
  showLabel: boolean
  label: string
  showDescription: boolean
  description: string
  size: "sm" | "default" | "lg"
  selection: Selection
  invalid: boolean
  disabled: boolean
}

function StoryCheckbox({ showLabel, label, showDescription, description, size, selection, invalid, disabled }: CheckboxStoryArgs) {
  // a key de quem usa recria o componente quando "Seleção" muda; aqui o clique continua funcionando
  const [checked, setChecked] = React.useState<CheckedState>(toChecked(selection))
  return (
    <Checkbox
      size={size}
      checked={checked}
      onCheckedChange={setChecked}
      disabled={disabled}
      aria-invalid={invalid || undefined}
      aria-label={showLabel ? undefined : label}
      label={showLabel ? label : undefined}
      description={showDescription ? description : undefined}
    />
  )
}

const meta = {
  title: "Components/Checkbox",
  tags: ["autodocs"],
  parameters: { docs: { description: { component: "Marca uma ou mais opções independentes." } } },
  args: {
    showLabel: true,
    label: "Aceito os termos",
    showDescription: false,
    description: "Você pode cancelar quando quiser.",
    size: "default",
    selection: "unchecked",
    invalid: false,
    disabled: false,
  },
  argTypes: {
    showLabel: { name: "Text", control: "boolean" },
    label: { name: "Text · content", control: "text", if: { arg: "showLabel" } },
    showDescription: { name: "Description", control: "boolean" },
    description: { name: "Description · content", control: "text", if: { arg: "showDescription" } },
    size: { name: "Size", control: "inline-radio", options: ["sm", "default", "lg"], table: { defaultValue: { summary: '"default"' } } },
    selection: { name: "Selection", control: "inline-radio", options: selections, if: { arg: "invalid", truthy: false }, table: { defaultValue: { summary: '"unchecked"' } } },
    invalid: { name: "Error", control: "boolean", if: { arg: "disabled", truthy: false }, table: { category: "State" } },
    disabled: { name: "Disabled", control: "boolean", if: { arg: "invalid", truthy: false }, table: { category: "State" } },
  },
  render: (args) => <StoryCheckbox key={args.selection} {...args} />,
} satisfies Meta<CheckboxStoryArgs>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Variants: Story = {
  render: (args) => (
    <div className="flex flex-col gap-md">
      {selections.map((s) => (
        <StoryCheckbox key={s} {...args} selection={s} label={s} />
      ))}
    </div>
  ),
}

export const Sizes: Story = {
  render: (args) => (
    <div className="flex flex-col gap-md">
      <StoryCheckbox key={"s" + args.selection} {...args} size="sm" label="sm (14px)" />
      <StoryCheckbox key={"d" + args.selection} {...args} size="default" label="default (16px)" />
      <StoryCheckbox key={"l" + args.selection} {...args} size="lg" label="lg (20px)" />
    </div>
  ),
}

export const Disabled: Story = { args: { disabled: true, selection: "checked" } }
