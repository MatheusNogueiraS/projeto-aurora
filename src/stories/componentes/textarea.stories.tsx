import type { Meta, StoryObj } from "@storybook/react-vite"

import { TextareaField } from "@/components/ui/textarea-field"

const sizes = ["sm", "default", "lg"] as const

// Controles no mesmo padrão do Input: label (sempre flutuante, com opcional/obrigatório), valor,
// hint, tamanho e estados.
type TextareaStoryArgs = {
  label: string
  optional: boolean
  required: boolean
  value: string
  showHint: boolean
  hint: string
  size: (typeof sizes)[number]
  invalid: boolean
  errorMessage: string
  disabled: boolean
}

// controles escondidos não chegam até aqui, por isso os padrões
function StoryTextarea({
  label = "Observação",
  optional = false,
  required = false,
  value = "",
  showHint = true,
  hint = "Conte o que for importante para o atendimento.",
  size = "default",
  invalid = false,
  errorMessage = "Escreva uma observação.",
  disabled = false,
}: Partial<TextareaStoryArgs>) {
  return (
    <TextareaField
      // a key recria o campo quando "Valor" muda; depois disso dá para digitar normalmente
      key={value}
      className="max-w-[312px]"
      label={label}
      optional={optional}
      required={required}
      defaultValue={value}
      hint={showHint ? hint : undefined}
      size={size}
      invalid={invalid}
      errorMessage={errorMessage}
      disabled={disabled}
    />
  )
}

const meta = {
  title: "Components/Textarea",
  tags: ["autodocs"],
  parameters: { docs: { description: { component: "Campo de texto de várias linhas que cresce conforme o conteúdo." } } },
  args: {
    label: "Observação",
    optional: false,
    required: false,
    value: "",
    showHint: true,
    hint: "Conte o que for importante para o atendimento.",
    size: "default",
    invalid: false,
    errorMessage: "Escreva uma observação.",
    disabled: false,
  },
  argTypes: {
    label: { name: "Label", control: "text" },
    optional: { name: "Optional", control: "boolean" },
    required: { name: "Required", control: "boolean" },
    value: { name: "Value", control: "text" },
    showHint: { name: "Hint", control: "boolean" },
    hint: { name: "Hint · content", control: "text", if: { arg: "showHint" } },
    size: { name: "Size", control: "inline-radio", options: sizes, table: { defaultValue: { summary: '"default"' } } },
    invalid: { name: "Error", control: "boolean", if: { arg: "disabled", truthy: false }, table: { category: "State" } },
    errorMessage: { name: "Error · message", control: "text", if: { arg: "invalid" }, table: { category: "State" } },
    disabled: { name: "Disabled", control: "boolean", if: { arg: "invalid", truthy: false }, table: { category: "State" } },
  },
  render: (args) => <StoryTextarea {...args} />,
} satisfies Meta<TextareaStoryArgs>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Variants: Story = {
  render: (args) => (
    <div className="flex flex-col gap-xl">
      <StoryTextarea {...args} />
      <StoryTextarea {...args} value="Cliente prefere contato por e-mail." />
      <StoryTextarea {...args} label="Motivo" optional showHint={false} />
      <StoryTextarea {...args} invalid disabled={false} />
    </div>
  ),
}

export const Sizes: Story = {
  render: (args) => (
    <div className="flex flex-col gap-xl">
      {sizes.map((size) => (
        <StoryTextarea key={size} {...args} size={size} label={`Tamanho ${size}`} value="Cliente prefere contato por e-mail." />
      ))}
    </div>
  ),
}

export const Disabled: Story = { args: { disabled: true, value: "Cliente prefere contato por e-mail." } }
