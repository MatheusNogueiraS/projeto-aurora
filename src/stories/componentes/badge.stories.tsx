import type { Meta, StoryObj } from "@storybook/react-vite"
import { CheckIcon, CircleAlertIcon, ClockIcon, InfoIcon, StarIcon, XIcon } from "lucide-react"

import { Badge } from "@/components/ui/badge"

const variants = ["default", "secondary", "destructive", "outline"] as const
const sizes = ["default", "lg", "xl"] as const

// Ícones que dá para escolher nos controles (no código, qualquer ícone do lucide-react serve),
// com o texto que o leitor de tela anuncia quando o badge é só ícone.
const icons = {
  Check: { icon: CheckIcon, label: "Aprovado" },
  Clock: { icon: ClockIcon, label: "Em análise" },
  Info: { icon: InfoIcon, label: "Informação" },
  Alert: { icon: CircleAlertIcon, label: "Atenção" },
  Star: { icon: StarIcon, label: "Destaque" },
  X: { icon: XIcon, label: "Recusado" },
}
type IconName = keyof typeof icons

// Os controles seguem o Badge do Nitro: texto, ícones antes/depois e tamanho.
type BadgeStoryArgs = {
  variant: (typeof variants)[number]
  size: (typeof sizes)[number]
  iconOnly: boolean
  label: string
  showIconLeading: boolean
  iconLeadingName: IconName
  showIconTrailing: boolean
  iconTrailingName: IconName
}

function StoryBadge({ variant, size, iconOnly, label, showIconLeading, iconLeadingName = "Check", showIconTrailing, iconTrailingName = "X" }: BadgeStoryArgs) {
  if (iconOnly) {
    const { icon, label: a11y } = icons[iconLeadingName]
    return <Badge variant={variant} size={size} iconLeading={icon} aria-label={a11y} />
  }
  return (
    <Badge
      variant={variant}
      size={size}
      iconLeading={showIconLeading ? icons[iconLeadingName].icon : undefined}
      iconTrailing={showIconTrailing ? icons[iconTrailingName].icon : undefined}
    >
      {label}
    </Badge>
  )
}

const meta = {
  title: "Componentes/Badge",
  tags: ["autodocs"],
  parameters: { docs: { description: { component: "Rótulo curto de status ou categoria. Não é clicável." } } },
  args: {
    variant: "default",
    size: "default",
    iconOnly: false,
    label: "Em análise",
    showIconLeading: false,
    iconLeadingName: "Check",
    showIconTrailing: false,
    iconTrailingName: "X",
  },
  argTypes: {
    variant: { name: "Tipo", control: "select", options: variants, description: "Variante visual." },
    size: { name: "Tamanho", control: "inline-radio", options: sizes },
    iconOnly: { name: "Apenas ícone", control: "boolean", description: "Mostra só o ícone, sem texto." },
    label: { name: "Label", control: "text", description: "Texto do badge.", if: { arg: "iconOnly", truthy: false } },
    showIconLeading: { name: "Icon Leading", control: "boolean", description: "Mostra um ícone antes do texto.", if: { arg: "iconOnly", truthy: false }, table: { category: "Ícones" } },
    iconLeadingName: { name: "Icon Leading · ícone", control: "select", options: Object.keys(icons), table: { category: "Ícones" } },
    showIconTrailing: { name: "Icon Trailing", control: "boolean", description: "Mostra um ícone depois do texto.", if: { arg: "iconOnly", truthy: false }, table: { category: "Ícones" } },
    iconTrailingName: { name: "Icon Trailing · ícone", control: "select", options: Object.keys(icons), if: { arg: "showIconTrailing" }, table: { category: "Ícones" } },
  },
  render: (args) => <StoryBadge {...args} />,
} satisfies Meta<BadgeStoryArgs>

export default meta
type Story = StoryObj<typeof meta>

export const Padrao: Story = { name: "Padrão" }

export const Variantes: Story = {
  render: (args) => (
    <div className="flex flex-col gap-md">
      <div className="flex flex-wrap items-center gap-md">
        {variants.map((variant) => (
          <StoryBadge key={variant} {...args} variant={variant} iconOnly={false} label={variant} />
        ))}
      </div>
      <div className="flex flex-wrap items-center gap-md">
        {variants.map((variant) => (
          <StoryBadge key={variant} {...args} variant={variant} iconOnly />
        ))}
      </div>
    </div>
  ),
}

export const Tamanhos: Story = {
  render: (args) => (
    <div className="flex flex-col gap-md">
      <div className="flex flex-wrap items-center gap-md">
        {sizes.map((size) => (
          <StoryBadge key={size} {...args} size={size} iconOnly={false} label={`Tamanho ${size}`} />
        ))}
      </div>
      <div className="flex flex-wrap items-center gap-md">
        {sizes.map((size) => (
          <StoryBadge key={size} {...args} size={size} iconOnly />
        ))}
      </div>
    </div>
  ),
}
