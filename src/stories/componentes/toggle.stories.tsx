import type { Meta, StoryObj } from "@storybook/react-vite"
import { AlignCenterIcon, BoldIcon, HeartIcon, ItalicIcon, StarIcon } from "lucide-react"

import { Toggle } from "@/components/ui/toggle"

const variants = ["default", "outline"] as const
const sizes = ["sm", "default", "lg"] as const

// Ícones que dá para escolher nos controles, com o texto que o leitor de tela anuncia.
const icons = {
  Bold: { icon: BoldIcon, label: "Negrito" },
  Italic: { icon: ItalicIcon, label: "Itálico" },
  AlignCenter: { icon: AlignCenterIcon, label: "Centralizar" },
  Star: { icon: StarIcon, label: "Favorito" },
  Heart: { icon: HeartIcon, label: "Curtir" },
}
type IconName = keyof typeof icons

// Controles no padrão do painel do Figma: tipo, tamanho, ícone, texto e estados.
type ToggleStoryArgs = {
  variant: (typeof variants)[number]
  size: (typeof sizes)[number]
  iconName: IconName
  showLabel: boolean
  label: string
  pressed: boolean
  disabled: boolean
}

function StoryToggle({ variant, size, iconName = "Bold", showLabel, label = "Negrito", pressed, disabled }: ToggleStoryArgs) {
  const { icon: Icon, label: a11y } = icons[iconName]
  return (
    <Toggle
      key={String(pressed)}
      variant={variant}
      size={size}
      defaultPressed={pressed}
      disabled={disabled}
      aria-label={showLabel ? undefined : a11y}
    >
      <Icon data-icon={showLabel ? "inline-start" : undefined} />
      {showLabel && label}
    </Toggle>
  )
}

const meta = {
  title: "Componentes/Toggle",
  tags: ["autodocs"],
  parameters: { docs: { description: { component: "Botão que fica ligado ou desligado, como o negrito numa barra de ferramentas." } } },
  args: { variant: "default", size: "default", iconName: "Bold", showLabel: false, label: "Negrito", pressed: false, disabled: false },
  argTypes: {
    variant: { name: "Tipo", control: "inline-radio", options: variants, description: "Variante visual." },
    size: { name: "Tamanho", control: "inline-radio", options: sizes },
    iconName: { name: "Ícone", control: "select", options: Object.keys(icons), description: "Ícone exibido." },
    showLabel: { name: "Texto", control: "boolean", description: "Mostra um texto ao lado do ícone." },
    label: { name: "Texto · conteúdo", control: "text", if: { arg: "showLabel" } },
    pressed: { name: "Ligado", control: "boolean", description: "Mostra o botão ligado.", table: { category: "Estado" } },
    disabled: { name: "Desabilitado", control: "boolean", description: "Bloqueia o clique.", table: { category: "Estado" } },
  },
  render: (args) => <StoryToggle {...args} />,
} satisfies Meta<ToggleStoryArgs>

export default meta
type Story = StoryObj<typeof meta>

export const Padrao: Story = { name: "Padrão" }

export const Variantes: Story = {
  render: (args) => (
    <div className="flex flex-wrap items-center gap-md">
      {variants.map((variant) => (
        <StoryToggle key={variant} {...args} variant={variant} />
      ))}
      {variants.map((variant) => (
        <StoryToggle key={`${variant}-on`} {...args} variant={variant} pressed />
      ))}
    </div>
  ),
}

export const Tamanhos: Story = {
  render: (args) => (
    <div className="flex flex-wrap items-center gap-md">
      {sizes.map((size) => (
        <StoryToggle key={size} {...args} size={size} />
      ))}
    </div>
  ),
}

export const Desabilitado: Story = { args: { disabled: true } }
