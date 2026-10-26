import * as React from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"
import { CheckIcon, CircleAlertIcon, ClockIcon, InfoIcon, StarIcon, XIcon } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

const variants = ["default", "primary", "secondary", "success", "warning", "destructive", "outline"] as const
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

// Os controles seguem o Badge do Nitro (texto, ícone, tamanho) mais os extras do Design System CB:
// indicador e removível. O badge não é clicável; a única ação é remover.
type BadgeStoryArgs = {
  variant: (typeof variants)[number]
  size: (typeof sizes)[number]
  iconOnly: boolean
  label: string
  dot: boolean
  showIconLeading: boolean
  iconLeadingName: IconName
  removable: boolean
}

// controles escondidos não chegam até aqui, por isso os padrões
function StoryBadge({
  variant = "default",
  size = "default",
  iconOnly = false,
  label = "Em análise",
  dot = false,
  showIconLeading = false,
  iconLeadingName = "Check",
  removable = false,
}: Partial<BadgeStoryArgs>) {
  // a key de quem usa recria o componente quando "Removível" muda; aqui remover continua funcionando
  const [removed, setRemoved] = React.useState(false)
  if (removed) {
    return (
      <Button variant="link" size="xs" onClick={() => setRemoved(false)}>
        Mostrar de novo
      </Button>
    )
  }
  if (iconOnly) {
    const { icon, label: a11y } = icons[iconLeadingName]
    return <Badge variant={variant} size={size} iconLeading={icon} aria-label={a11y} />
  }
  return (
    <Badge
      variant={variant}
      size={size}
      dot={dot}
      iconLeading={showIconLeading ? icons[iconLeadingName].icon : undefined}
      onRemove={removable ? () => setRemoved(true) : undefined}
    >
      {label}
    </Badge>
  )
}

const meta = {
  title: "Components/Badge",
  tags: ["autodocs"],
  parameters: {
    docs: { description: { component: "Rótulo curto de status ou categoria." } },
  },
  args: {
    variant: "default",
    size: "default",
    iconOnly: false,
    label: "Em análise",
    dot: false,
    showIconLeading: false,
    iconLeadingName: "Check",
    removable: false,
  },
  argTypes: {
    variant: { name: "Type", control: "select", options: variants, table: { defaultValue: { summary: '"default"' } } },
    size: { name: "Size", control: "inline-radio", options: sizes, table: { defaultValue: { summary: '"default"' } } },
    iconOnly: { name: "Icon only", control: "boolean" },
    label: { name: "Label", control: "text", if: { arg: "iconOnly", truthy: false } },
    dot: { name: "Dot", control: "boolean", if: { arg: "iconOnly", truthy: false } },
    showIconLeading: { name: "Icon Leading", control: "boolean", if: { arg: "iconOnly", truthy: false }, table: { category: "Icons" } },
    iconLeadingName: { name: "Icon Leading · icon", control: "select", options: Object.keys(icons), table: { category: "Icons" } },
    removable: { name: "Removable", control: "boolean", if: { arg: "iconOnly", truthy: false } },
  },
  render: (args) => <StoryBadge key={String(args.removable)} {...args} />,
} satisfies Meta<BadgeStoryArgs>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Variants: Story = {
  render: (args) => (
    <div className="flex flex-col gap-md">
      <div className="flex flex-wrap items-center gap-md">
        {variants.map((variant) => (
          <StoryBadge key={variant} {...args} variant={variant} iconOnly={false} label={variant} />
        ))}
      </div>
      <div className="flex flex-wrap items-center gap-md">
        {variants.map((variant) => (
          <StoryBadge key={variant} {...args} variant={variant} iconOnly={false} dot label="Indicador" />
        ))}
      </div>
      <div className="flex flex-wrap items-center gap-md">
        {variants.map((variant) => (
          <StoryBadge key={variant} {...args} variant={variant} iconOnly={false} removable label="Removível" />
        ))}
      </div>
      <div className="flex flex-wrap items-center gap-md">
        {variants.map((variant) => (
          <StoryBadge key={variant} {...args} variant={variant} iconOnly={false} showIconLeading label="Com ícone" />
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

export const Sizes: Story = {
  render: (args) => (
    <div className="flex flex-col gap-md">
      <div className="flex flex-wrap items-center gap-md">
        {sizes.map((size) => (
          <StoryBadge key={size} {...args} size={size} iconOnly={false} label={`Tamanho ${size}`} />
        ))}
      </div>
      <div className="flex flex-wrap items-center gap-md">
        {sizes.map((size) => (
          <StoryBadge key={size} {...args} size={size} iconOnly={false} removable dot label="Removível" />
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
