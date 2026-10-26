import type { Meta, StoryObj } from "@storybook/react-vite"
import { CalendarIcon, EyeIcon, LockIcon, MailIcon, SearchIcon, UserIcon } from "lucide-react"

import { InputField } from "@/components/ui/input-field"

const sizes = ["sm", "default", "lg"] as const
// ícones que dá para escolher nos controles (no código, qualquer ícone do lucide-react serve)
const icons = { User: UserIcon, Mail: MailIcon, Lock: LockIcon, Search: SearchIcon, Calendar: CalendarIcon, Eye: EyeIcon }
type IconName = keyof typeof icons

// Controles no padrão do painel do Text Input do Nitro: label (sempre flutuante, com
// opcional/obrigatório), valor, hint, ícones, tamanho e estados.
type InputStoryArgs = {
  label: string
  optional: boolean
  required: boolean
  value: string
  showHint: boolean
  hint: string
  showIconLeading: boolean
  iconLeadingName: IconName
  showIconTrailing: boolean
  iconTrailingName: IconName
  size: (typeof sizes)[number]
  invalid: boolean
  errorMessage: string
  disabled: boolean
}

// controles escondidos não chegam até aqui, por isso os padrões
function StoryInput({
  label = "Nome completo",
  optional = false,
  required = false,
  value = "",
  showHint = true,
  hint = "Sem abreviações.",
  showIconLeading = false,
  iconLeadingName = "User",
  showIconTrailing = false,
  iconTrailingName = "Eye",
  size = "default",
  invalid = false,
  errorMessage = "Preencha o nome completo.",
  disabled = false,
}: Partial<InputStoryArgs>) {
  return (
    <InputField
      // a key recria o campo quando "Valor" muda; depois disso dá para digitar normalmente
      key={value}
      className="max-w-[312px]"
      label={label}
      optional={optional}
      required={required}
      defaultValue={value}
      hint={showHint ? hint : undefined}
      iconLeading={showIconLeading ? icons[iconLeadingName] : undefined}
      iconTrailing={showIconTrailing ? icons[iconTrailingName] : undefined}
      size={size}
      invalid={invalid}
      errorMessage={errorMessage}
      disabled={disabled}
    />
  )
}

const meta = {
  title: "Components/Input",
  tags: ["autodocs"],
  parameters: { docs: { description: { component: "Campo de texto de uma linha, com label, dica e ícones opcionais." } } },
  args: {
    label: "Nome completo",
    optional: false,
    required: false,
    value: "",
    showHint: true,
    hint: "Sem abreviações.",
    showIconLeading: false,
    iconLeadingName: "User",
    showIconTrailing: false,
    iconTrailingName: "Eye",
    size: "default",
    invalid: false,
    errorMessage: "Preencha o nome completo.",
    disabled: false,
  },
  argTypes: {
    label: { name: "Label", control: "text" },
    optional: { name: "Optional", control: "boolean" },
    required: { name: "Required", control: "boolean" },
    value: { name: "Value", control: "text" },
    showHint: { name: "Hint", control: "boolean" },
    hint: { name: "Hint · content", control: "text", if: { arg: "showHint" } },
    showIconLeading: { name: "Icon Left", control: "boolean", table: { category: "Icons" } },
    iconLeadingName: { name: "Icon Left · icon", control: "select", options: Object.keys(icons), if: { arg: "showIconLeading" }, table: { category: "Icons" } },
    showIconTrailing: { name: "Icon Right", control: "boolean", table: { category: "Icons" } },
    iconTrailingName: { name: "Icon Right · icon", control: "select", options: Object.keys(icons), if: { arg: "showIconTrailing" }, table: { category: "Icons" } },
    size: { name: "Size", control: "inline-radio", options: sizes, table: { defaultValue: { summary: '"default"' } } },
    invalid: { name: "Error", control: "boolean", if: { arg: "disabled", truthy: false }, table: { category: "State" } },
    errorMessage: { name: "Error · message", control: "text", if: { arg: "invalid" }, table: { category: "State" } },
    disabled: { name: "Disabled", control: "boolean", if: { arg: "invalid", truthy: false }, table: { category: "State" } },
  },
  render: (args) => <StoryInput {...args} />,
} satisfies Meta<InputStoryArgs>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Variants: Story = {
  render: (args) => (
    <div className="flex flex-col gap-xl">
      <StoryInput {...args} />
      <StoryInput {...args} value="Maria Souza" />
      <StoryInput {...args} label="E-mail" hint="Usaremos para contato." showIconLeading iconLeadingName="Mail" />
      <StoryInput {...args} label="Senha" hint="Mínimo de 8 caracteres." showIconLeading iconLeadingName="Lock" showIconTrailing iconTrailingName="Eye" required />
      <StoryInput {...args} invalid disabled={false} />
      <StoryInput {...args} label="Buscar" showHint={false} showIconLeading iconLeadingName="Search" />
    </div>
  ),
}

export const Sizes: Story = {
  render: (args) => (
    <div className="flex flex-col gap-xl">
      {sizes.map((size) => (
        <StoryInput key={size} {...args} size={size} label={`Tamanho ${size}`} />
      ))}
    </div>
  ),
}

export const Disabled: Story = { args: { disabled: true, value: "Maria Souza" } }
