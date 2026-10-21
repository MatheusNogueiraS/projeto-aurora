import type { Meta, StoryObj } from "@storybook/react-vite"

import { Switch } from "@/components/ui/switch"

const sizes = ["sm", "default"] as const

// Controles no padrão do painel do Figma: texto, descrição, tamanho e estados.
type SwitchStoryArgs = {
  showLabel: boolean
  label: string
  showDescription: boolean
  description: string
  size: (typeof sizes)[number]
  checked: boolean
  invalid: boolean
  disabled: boolean
}

function StorySwitch({ showLabel, label = "Receber notificações", showDescription, description, size, checked, invalid, disabled }: SwitchStoryArgs) {
  return (
    <Switch
      key={String(checked)}
      size={size}
      defaultChecked={checked}
      aria-invalid={invalid || undefined}
      disabled={disabled}
      aria-label={showLabel ? undefined : label}
      label={showLabel ? label : undefined}
      description={showDescription ? description : undefined}
    />
  )
}

const meta = {
  title: "Componentes/Switch",
  tags: ["autodocs"],
  parameters: { docs: { description: { component: "Liga ou desliga uma opção com efeito imediato." } } },
  args: { showLabel: true, label: "Receber notificações", showDescription: false, description: "Avisos sobre a sua proposta.", size: "default", checked: false, invalid: false, disabled: false },
  argTypes: {
    showLabel: { name: "Texto", control: "boolean", description: "Mostra o texto ao lado." },
    label: { name: "Texto · conteúdo", control: "text", if: { arg: "showLabel" } },
    showDescription: { name: "Descrição", control: "boolean", description: "Mostra um texto de apoio." },
    description: { name: "Descrição · conteúdo", control: "text", if: { arg: "showDescription" } },
    size: { name: "Tamanho", control: "inline-radio", options: sizes },
    checked: { name: "Ligado", control: "boolean", description: "Mostra a opção ligada.", if: { arg: "invalid", truthy: false } },
    invalid: { name: "Erro", control: "boolean", description: "Opção obrigatória desligada. Some ao ligar.", if: { arg: "disabled", truthy: false }, table: { category: "Estado" } },
    disabled: { name: "Desabilitado", control: "boolean", description: "Bloqueia o clique.", if: { arg: "invalid", truthy: false }, table: { category: "Estado" } },
  },
  render: (args) => <StorySwitch {...args} />,
} satisfies Meta<SwitchStoryArgs>

export default meta
type Story = StoryObj<typeof meta>

export const Padrao: Story = { name: "Padrão" }

export const Variantes: Story = {
  render: (args) => (
    <div className="flex flex-col gap-md">
      <StorySwitch {...args} checked={false} label="Desligado" />
      <StorySwitch {...args} checked label="Ligado" />
    </div>
  ),
}

export const Tamanhos: Story = {
  render: (args) => (
    <div className="flex flex-col gap-md">
      {sizes.map((size) => (
        <StorySwitch key={size} {...args} size={size} label={`Tamanho ${size}`} />
      ))}
    </div>
  ),
}

export const Desabilitado: Story = { args: { disabled: true, checked: true } }
