import * as React from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"

import { Checkbox } from "@/components/ui/checkbox"

const selections = ["Desmarcado", "Marcado", "Indeterminado"] as const
type Selection = (typeof selections)[number]
type CheckedState = React.ComponentProps<typeof Checkbox>["checked"]
// controles escondidos não chegam até aqui (ex.: Seleção some com Erro ligado), por isso o padrão desmarcado
const toChecked = (s?: Selection): CheckedState => (s === "Marcado" ? true : s === "Indeterminado" ? "indeterminate" : false)

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
  title: "Componentes/Checkbox",
  tags: ["autodocs"],
  parameters: { docs: { description: { component: "Marca uma ou mais opções independentes. Texto e descrição são opcionais." } } },
  args: {
    showLabel: true,
    label: "Aceito os termos",
    showDescription: false,
    description: "Você pode cancelar quando quiser.",
    size: "default",
    selection: "Desmarcado",
    invalid: false,
    disabled: false,
  },
  argTypes: {
    showLabel: { name: "Texto", control: "boolean", description: "Mostra o texto ao lado." },
    label: { name: "Texto · conteúdo", control: "text", if: { arg: "showLabel" } },
    showDescription: { name: "Descrição", control: "boolean", description: "Mostra um texto de apoio." },
    description: { name: "Descrição · conteúdo", control: "text", if: { arg: "showDescription" } },
    size: { name: "Tamanho", control: "inline-radio", options: ["sm", "default", "lg"], description: "sm (14px), default (16px) ou lg (20px)." },
    selection: { name: "Seleção", control: "inline-radio", options: selections, description: "Indeterminado: parte de uma lista marcada.", if: { arg: "invalid", truthy: false } },
    invalid: { name: "Erro", control: "boolean", description: "Campo obrigatório não marcado. Só aparece desmarcado.", if: { arg: "disabled", truthy: false }, table: { category: "Estado" } },
    disabled: { name: "Desabilitado", control: "boolean", description: "Bloqueia o clique. Não fica em erro.", if: { arg: "invalid", truthy: false }, table: { category: "Estado" } },
  },
  render: (args) => <StoryCheckbox key={args.selection} {...args} />,
} satisfies Meta<CheckboxStoryArgs>

export default meta
type Story = StoryObj<typeof meta>

export const Padrao: Story = { name: "Padrão" }

export const Variantes: Story = {
  render: (args) => (
    <div className="flex flex-col gap-md">
      {selections.map((s) => (
        <StoryCheckbox key={s} {...args} selection={s} label={s} />
      ))}
    </div>
  ),
}

export const Tamanhos: Story = {
  render: (args) => (
    <div className="flex flex-col gap-md">
      <StoryCheckbox key={"s" + args.selection} {...args} size="sm" label="sm (14px)" />
      <StoryCheckbox key={"d" + args.selection} {...args} size="default" label="default (16px)" />
      <StoryCheckbox key={"l" + args.selection} {...args} size="lg" label="lg (20px)" />
    </div>
  ),
}

export const Desabilitado: Story = { args: { disabled: true, selection: "Marcado" } }
