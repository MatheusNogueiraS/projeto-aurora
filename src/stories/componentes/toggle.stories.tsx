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
  title: "Components/Toggle",
  tags: ["autodocs"],
  parameters: { docs: { description: { component: "Botão que fica ligado ou desligado, como o negrito numa barra de ferramentas." } } },
  args: { variant: "default", size: "default", iconName: "Bold", showLabel: false, label: "Negrito", pressed: false, disabled: false },
  argTypes: {
    variant: { name: "Type", control: "inline-radio", options: variants, table: { defaultValue: { summary: '"default"' } } },
    size: { name: "Size", control: "inline-radio", options: sizes, table: { defaultValue: { summary: '"default"' } } },
    iconName: { name: "Icon", control: "select", options: Object.keys(icons) },
    showLabel: { name: "Text", control: "boolean" },
    label: { name: "Text · content", control: "text", if: { arg: "showLabel" } },
    pressed: { name: "Pressed", control: "boolean", table: { category: "State" } },
    disabled: { name: "Disabled", control: "boolean", table: { category: "State" } },
  },
  render: (args) => <StoryToggle {...args} />,
} satisfies Meta<ToggleStoryArgs>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Variants: Story = {
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

export const Sizes: Story = {
  render: (args) => (
    <div className="flex flex-wrap items-center gap-md">
      {sizes.map((size) => (
        <StoryToggle key={size} {...args} size={size} />
      ))}
    </div>
  ),
}

export const Disabled: Story = { args: { disabled: true } }
