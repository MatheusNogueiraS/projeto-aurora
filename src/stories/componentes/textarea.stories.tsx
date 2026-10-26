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
  title: "Componentes/Textarea",
  tags: ["autodocs"],
  parameters: { docs: { description: { component: "Campo de texto de várias linhas, com label e dica. Cresce conforme o conteúdo." } } },
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
    label: { name: "Label", control: "text", description: "Nome do campo, dentro dele; ao focar ou digitar, diminui e sobe." },
    optional: { name: "Opcional", control: "boolean", description: "Mostra \"(opcional)\" ao lado do label." },
    required: { name: "Obrigatório", control: "boolean", description: "Mostra o asterisco ao lado do label." },
    value: { name: "Valor", control: "text", description: "Texto já preenchido." },
    showHint: { name: "Hint", control: "boolean", description: "Texto de ajuda embaixo do campo." },
    hint: { name: "Hint · conteúdo", control: "text", if: { arg: "showHint" } },
    size: { name: "Tamanho", control: "inline-radio", options: sizes, description: "Muda o tamanho do texto e o respiro interno, com espaço para o label subir." },
    invalid: { name: "Erro", control: "boolean", description: "Campo em vermelho, com mensagem.", if: { arg: "disabled", truthy: false }, table: { category: "Estado" } },
    errorMessage: { name: "Erro · mensagem", control: "text", if: { arg: "invalid" }, table: { category: "Estado" } },
    disabled: { name: "Desabilitado", control: "boolean", description: "Bloqueia o campo. Não fica em erro.", if: { arg: "invalid", truthy: false }, table: { category: "Estado" } },
  },
  render: (args) => <StoryTextarea {...args} />,
} satisfies Meta<TextareaStoryArgs>

export default meta
type Story = StoryObj<typeof meta>

export const Padrao: Story = { name: "Padrão" }

export const Variantes: Story = {
  render: (args) => (
    <div className="flex flex-col gap-xl">
      <StoryTextarea {...args} />
      <StoryTextarea {...args} value="Cliente prefere contato por e-mail." />
      <StoryTextarea {...args} label="Motivo" optional showHint={false} />
      <StoryTextarea {...args} invalid disabled={false} />
    </div>
  ),
}

export const Tamanhos: Story = {
  render: (args) => (
    <div className="flex flex-col gap-xl">
      {sizes.map((size) => (
        <StoryTextarea key={size} {...args} size={size} label={`Tamanho ${size}`} value="Cliente prefere contato por e-mail." />
      ))}
    </div>
  ),
}

export const Desabilitado: Story = { args: { disabled: true, value: "Cliente prefere contato por e-mail." } }
