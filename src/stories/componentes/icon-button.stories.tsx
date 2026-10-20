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
  title: "Componentes/IconButton",
  // o aria-label é obrigatório no componente; aqui ele é gerado a partir do ícone escolhido
  component: IconButton as React.ComponentType<IconButtonStoryArgs>,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Botão só com ícone, para ações conhecidas (adicionar, fechar, favoritar). Mesmas variantes e alturas do **Button**.",
      },
    },
  },
  args: { variant: "default", size: "default", disabled: false, iconName: "Plus" },
  argTypes: {
    variant: { name: "Tipo", control: "select", options: variants, description: "Variante visual." },
    size: { name: "Tamanho", control: "select", options: sizes },
    disabled: { name: "Desabilitado", control: "boolean" },
    iconName: { name: "Ícone", control: "select", options: Object.keys(icons), description: "Ícone exibido." },
    // propriedades de código que não fazem sentido como controle visual
    children: { table: { disable: true } },
    "aria-label": { table: { disable: true } },
  },
  render: (args) => <StoryIconButton {...args} />,
} satisfies Meta<IconButtonStoryArgs>

export default meta
type Story = StoryObj<typeof meta>

export const Padrao: Story = { name: "Padrão" }

export const Variantes: Story = {
  render: (args) => (
    <div className="flex flex-wrap items-center gap-md">
      {variants.map((variant) => (
        <StoryIconButton key={variant} {...args} variant={variant} />
      ))}
    </div>
  ),
}

export const Tamanhos: Story = {
  render: (args) => (
    <div className="flex flex-wrap items-center gap-md">
      {sizes.map((size) => (
        <StoryIconButton key={size} {...args} size={size} />
      ))}
    </div>
  ),
}

export const Desabilitado: Story = { args: { disabled: true } }
