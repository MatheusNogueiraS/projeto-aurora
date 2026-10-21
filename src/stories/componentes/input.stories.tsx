import type { Meta, StoryObj } from "@storybook/react-vite"

import { Input } from "@/components/ui/input"

const types = { Texto: "text", "E-mail": "email", Senha: "password", Número: "number" } as const

const sizes = ["sm", "default", "lg"] as const

// Controles no padrão do painel do Figma: conteúdo, tamanho, tipo de campo e estados.
type InputStoryArgs = {
  placeholder: string
  value: string
  size: (typeof sizes)[number]
  type: keyof typeof types
  invalid: boolean
  disabled: boolean
}

function StoryInput({ placeholder, value, size, type = "Texto", invalid, disabled }: InputStoryArgs) {
  return (
    <Input
      key={value}
      type={types[type]}
      size={size}
      placeholder={placeholder}
      defaultValue={value}
      aria-invalid={invalid || undefined}
      disabled={disabled}
      aria-label="Campo de exemplo"
      className="max-w-[288px]"
    />
  )
}

const meta = {
  title: "Componentes/Input",
  tags: ["autodocs"],
  parameters: { docs: { description: { component: "Campo de texto de uma linha." } } },
  args: { size: "default", placeholder: "Seu nome", value: "", type: "Texto", invalid: false, disabled: false },
  argTypes: {
    placeholder: { name: "Placeholder", control: "text", description: "Texto de exemplo quando o campo está vazio." },
    value: { name: "Valor", control: "text", description: "Texto já preenchido." },
    size: { name: "Tamanho", control: "inline-radio", options: sizes, description: "sm (31px), default (39px) ou lg (42px): as alturas do Button." },
    type: { name: "Tipo de campo", control: "inline-radio", options: Object.keys(types), description: "Muda o teclado e a máscara (ex.: senha esconde o texto)." },
    invalid: { name: "Erro", control: "boolean", description: "Destaca o campo em vermelho.", if: { arg: "disabled", truthy: false }, table: { category: "Estado" } },
    disabled: { name: "Desabilitado", control: "boolean", description: "Bloqueia o campo.", if: { arg: "invalid", truthy: false }, table: { category: "Estado" } },
  },
  render: (args) => <StoryInput {...args} />,
} satisfies Meta<InputStoryArgs>

export default meta
type Story = StoryObj<typeof meta>

export const Padrao: Story = { name: "Padrão" }
export const Tamanhos: Story = {
  render: (args) => (
    <div className="flex flex-col gap-md">
      {sizes.map((size) => (
        <StoryInput key={size} {...args} size={size} placeholder={`Tamanho ${size}`} />
      ))}
    </div>
  ),
}

export const Desabilitado: Story = { args: { disabled: true, value: "Maria Souza" } }
