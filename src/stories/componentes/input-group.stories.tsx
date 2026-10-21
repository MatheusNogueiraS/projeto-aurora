import type { Meta, StoryObj } from "@storybook/react-vite"
import { LockIcon, MailIcon, SearchIcon, UserIcon } from "lucide-react"

import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
  InputGroupTextarea,
} from "@/components/ui/input-group"

const icons = { Search: SearchIcon, Mail: MailIcon, User: UserIcon, Lock: LockIcon }
type IconName = keyof typeof icons

// Controles no padrão do painel do Figma: cada parte colada ao campo é um liga/desliga.
type InputGroupStoryArgs = {
  placeholder: string
  multiline: boolean
  showIcon: boolean
  iconName: IconName
  showText: boolean
  text: string
  showButton: boolean
  buttonLabel: string
  invalid: boolean
  disabled: boolean
}

function StoryInputGroup({
  placeholder,
  multiline,
  showIcon,
  iconName = "Search",
  showText,
  text = "@bmg.com.br",
  showButton,
  buttonLabel = "Enviar",
  invalid,
  disabled,
}: InputGroupStoryArgs) {
  const Icon = icons[iconName]
  if (multiline) {
    return (
      <InputGroup className="max-w-[288px]">
        <InputGroupTextarea placeholder={placeholder} disabled={disabled} aria-invalid={invalid || undefined} aria-label="Mensagem" />
        {showButton && (
          <InputGroupAddon align="block-end">
            <InputGroupButton variant="default" className="ml-auto" disabled={disabled}>
              {buttonLabel}
            </InputGroupButton>
          </InputGroupAddon>
        )}
      </InputGroup>
    )
  }
  return (
    <InputGroup className="max-w-[320px]">
      {showIcon && (
        <InputGroupAddon>
          <Icon />
        </InputGroupAddon>
      )}
      <InputGroupInput placeholder={placeholder} disabled={disabled} aria-invalid={invalid || undefined} aria-label="Campo" />
      {(showText || showButton) && (
        <InputGroupAddon align="inline-end">
          {showText && <InputGroupText>{text}</InputGroupText>}
          {showButton && (
            <InputGroupButton variant="secondary" disabled={disabled}>
              {buttonLabel}
            </InputGroupButton>
          )}
        </InputGroupAddon>
      )}
    </InputGroup>
  )
}

const meta = {
  title: "Componentes/Input Group",
  tags: ["autodocs"],
  parameters: { docs: { description: { component: "Campo com elementos colados: ícone, texto fixo ou botão." } } },
  args: {
    placeholder: "Buscar proposta",
    multiline: false,
    showIcon: true,
    iconName: "Search",
    showText: false,
    text: "@bmg.com.br",
    showButton: false,
    buttonLabel: "Enviar",
    invalid: false,
    disabled: false,
  },
  argTypes: {
    placeholder: { name: "Placeholder", control: "text", description: "Texto de exemplo quando o campo está vazio." },
    multiline: { name: "Várias linhas", control: "boolean", description: "Troca o campo por um de várias linhas." },
    showIcon: { name: "Ícone", control: "boolean", description: "Mostra um ícone no início.", if: { arg: "multiline", truthy: false }, table: { category: "Partes" } },
    iconName: { name: "Ícone · qual", control: "select", options: Object.keys(icons), if: { arg: "showIcon" }, table: { category: "Partes" } },
    showText: { name: "Texto fixo", control: "boolean", description: "Mostra um texto fixo no fim.", if: { arg: "multiline", truthy: false }, table: { category: "Partes" } },
    text: { name: "Texto fixo · conteúdo", control: "text", if: { arg: "showText" }, table: { category: "Partes" } },
    showButton: { name: "Botão", control: "boolean", description: "Mostra um botão no fim.", table: { category: "Partes" } },
    buttonLabel: { name: "Botão · texto", control: "text", if: { arg: "showButton" }, table: { category: "Partes" } },
    invalid: { name: "Erro", control: "boolean", description: "Destaca o campo em vermelho.", if: { arg: "disabled", truthy: false }, table: { category: "Estado" } },
    disabled: { name: "Desabilitado", control: "boolean", description: "Bloqueia o campo.", if: { arg: "invalid", truthy: false }, table: { category: "Estado" } },
  },
  render: (args) => <StoryInputGroup {...args} />,
} satisfies Meta<InputGroupStoryArgs>

export default meta
type Story = StoryObj<typeof meta>

export const Padrao: Story = { name: "Padrão" }

export const Variantes: Story = {
  render: (args) => (
    <div className="flex flex-col gap-md">
      <StoryInputGroup {...args} multiline={false} showIcon showText={false} showButton={false} />
      <StoryInputGroup {...args} multiline={false} showIcon iconName="Mail" placeholder="email" showText showButton />
      <StoryInputGroup {...args} multiline placeholder="Descreva o problema" showButton />
    </div>
  ),
}

export const Desabilitado: Story = { args: { disabled: true } }
