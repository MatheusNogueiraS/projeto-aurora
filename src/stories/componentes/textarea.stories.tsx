import type { Meta, StoryObj } from "@storybook/react-vite"

import { Textarea } from "@/components/ui/textarea"

const sizes = ["sm", "default", "lg"] as const

// Controles no padrão do painel do Figma: conteúdo, tamanho e estados.
type TextareaStoryArgs = {
  placeholder: string
  value: string
  size: (typeof sizes)[number]
  invalid: boolean
  disabled: boolean
}

function StoryTextarea({ placeholder, value, size, invalid, disabled }: TextareaStoryArgs) {
  return (
    <Textarea
      key={value}
      size={size}
      placeholder={placeholder}
      defaultValue={value}
      aria-invalid={invalid || undefined}
      disabled={disabled}
      aria-label="Observação"
      className="max-w-[288px]"
    />
  )
}

const meta = {
  title: "Componentes/Textarea",
  tags: ["autodocs"],
  parameters: { docs: { description: { component: "Campo de texto de várias linhas. Cresce conforme o conteúdo." } } },
  args: { size: "default", placeholder: "Escreva uma observação", value: "", invalid: false, disabled: false },
  argTypes: {
    placeholder: { name: "Placeholder", control: "text", description: "Texto de exemplo quando o campo está vazio." },
    value: { name: "Valor", control: "text", description: "Texto já preenchido." },
    size: { name: "Tamanho", control: "inline-radio", options: sizes, description: "Muda o tamanho do texto e o respiro interno." },
    invalid: { name: "Erro", control: "boolean", description: "Destaca o campo em vermelho.", if: { arg: "disabled", truthy: false }, table: { category: "Estado" } },
    disabled: { name: "Desabilitado", control: "boolean", description: "Bloqueia o campo.", if: { arg: "invalid", truthy: false }, table: { category: "Estado" } },
  },
  render: (args) => <StoryTextarea {...args} />,
} satisfies Meta<TextareaStoryArgs>

export default meta
type Story = StoryObj<typeof meta>

export const Padrao: Story = { name: "Padrão" }
export const Tamanhos: Story = {
  render: (args) => (
    <div className="flex flex-col gap-md">
      {sizes.map((size) => (
        <StoryTextarea key={size} {...args} size={size} placeholder={`Tamanho ${size}`} />
      ))}
    </div>
  ),
}

export const Desabilitado: Story = { args: { disabled: true, value: "Cliente prefere contato por e-mail." } }
