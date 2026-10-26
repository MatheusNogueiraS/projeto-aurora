import type { Meta, StoryObj } from "@storybook/react-vite"
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  CheckIcon,
  DownloadIcon,
  HeartIcon,
  PlusIcon,
  SearchIcon,
  Trash2Icon,
  XIcon,
} from "lucide-react"

import { IconButton } from "@/components/ui/icon-button"

const variants = ["default", "outline", "secondary", "ghost", "destructive"] as const
const sizes = ["xs", "sm", "default", "lg"] as const

// Ícones que dá para escolher nos controles (no código, qualquer ícone do lucide-react serve),
// com o texto que o leitor de tela anuncia para cada um.
const icons = {
  Plus: { icon: PlusIcon, label: "Adicionar" },
  Heart: { icon: HeartIcon, label: "Favoritar" },
  Search: { icon: SearchIcon, label: "Buscar" },
  Download: { icon: DownloadIcon, label: "Baixar" },
  Check: { icon: CheckIcon, label: "Confirmar" },
  X: { icon: XIcon, label: "Fechar" },
  Trash: { icon: Trash2Icon, label: "Excluir" },
  ArrowLeft: { icon: ArrowLeftIcon, label: "Voltar" },
  ArrowRight: { icon: ArrowRightIcon, label: "Avançar" },
}
type IconName = keyof typeof icons

type IconButtonStoryArgs = Omit<React.ComponentProps<typeof IconButton>, "aria-label"> & { "aria-label"?: string; iconName: IconName }

// O aria-label (obrigatório no código) sai do ícone escolhido, por isso não aparece nos controles.
function StoryIconButton({ iconName = "Plus", ...args }: IconButtonStoryArgs) {
  const { icon: Icon, label } = icons[iconName]
  return (
    <IconButton {...args} aria-label={label}>
      <Icon />
    </IconButton>
  )
}

const meta = {
  title: "Components/Icon Button",
  // o aria-label é obrigatório no componente; aqui ele é gerado a partir do ícone escolhido
  component: IconButton as React.ComponentType<IconButtonStoryArgs>,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Botão só com ícone, para ações conhecidas (adicionar, fechar, favoritar).",
      },
    },
  },
  args: { variant: "default", size: "default", disabled: false, loading: false, iconName: "Plus" },
  argTypes: {
    variant: { name: "Type", control: "select", options: variants },
    size: { name: "Size", control: "select", options: sizes },
    disabled: { name: "Disabled", control: "boolean", table: { category: "State" } },
    loading: { name: "Loading", control: "boolean", table: { category: "State" } },
    iconName: { name: "Icon", control: "select", options: Object.keys(icons) },
    // propriedades de código que não fazem sentido como controle visual
    children: { table: { disable: true } },
    "aria-label": { table: { disable: true } },
  },
  render: (args) => <StoryIconButton {...args} />,
} satisfies Meta<IconButtonStoryArgs>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Variants: Story = {
  render: (args) => (
    <div className="flex flex-col gap-md">
      <div className="flex flex-wrap items-center gap-md">
        {variants.map((variant) => (
          <StoryIconButton key={variant} {...args} variant={variant} />
        ))}
      </div>
      <div className="flex flex-wrap items-center gap-md">
        {variants.map((variant) => (
          <StoryIconButton key={variant} {...args} variant={variant} loading />
        ))}
      </div>
    </div>
  ),
}

export const Sizes: Story = {
  render: (args) => (
    <div className="flex flex-wrap items-center gap-md">
      {sizes.map((size) => (
        <StoryIconButton key={size} {...args} size={size} />
      ))}
    </div>
  ),
}

export const Disabled: Story = { args: { disabled: true } }
