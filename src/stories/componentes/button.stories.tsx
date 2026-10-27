import type { Meta, StoryObj } from "@storybook/react-vite"
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  CheckIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  DownloadIcon,
  PlusIcon,
  SearchIcon,
} from "lucide-react"

import { Button } from "@/components/ui/button"

const variants = ["default", "outline", "secondary", "ghost", "destructive", "link"] as const
const sizes = ["xs", "sm", "default", "lg"] as const

// Ícones que dá para escolher nos controles (no código, qualquer ícone do lucide-react serve).
const icons = {
  Plus: PlusIcon,
  ArrowLeft: ArrowLeftIcon,
  ArrowRight: ArrowRightIcon,
  ChevronLeft: ChevronLeftIcon,
  ChevronRight: ChevronRightIcon,
  Check: CheckIcon,
  Download: DownloadIcon,
  Search: SearchIcon,
}
type IconName = keyof typeof icons

// Os controles seguem o Button do Nitro: liga/desliga de cada ícone + qual ícone usar.
// No código, isso vira uma propriedade só: iconLeading={PlusIcon} / iconTrailing={ArrowRightIcon}.
type ButtonStoryArgs = React.ComponentProps<typeof Button> & {
  showIconLeading: boolean
  iconLeadingName: IconName
  showIconTrailing: boolean
  iconTrailingName: IconName
}

// O Storybook não envia o valor de um controle escondido (o "· ícone" some quando o
// liga/desliga está desligado); por isso os ícones têm um padrão aqui também.
function StoryButton({
  showIconLeading,
  iconLeadingName = "Plus",
  showIconTrailing,
  iconTrailingName = "ArrowRight",
  ...args
}: ButtonStoryArgs) {
  return (
    <Button
      {...args}
      iconLeading={showIconLeading ? icons[iconLeadingName] : undefined}
      iconTrailing={showIconTrailing ? icons[iconTrailingName] : undefined}
    />
  )
}

const meta = {
  title: "Components/Button",
  component: Button,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Dispara uma ação; para botão só com ícone, use o **Icon Button**.",
      },
    },
  },
  args: {
    variant: "default",
    size: "default",
    disabled: false,
    loading: false,
    fullWidth: false,
    children: "Continuar",
    showIconLeading: false,
    iconLeadingName: "Plus",
    showIconTrailing: false,
    iconTrailingName: "ArrowRight",
  },
  argTypes: {
    variant: { name: "Type", control: "select", options: variants },
    size: { name: "Size", control: "select", options: sizes },
    disabled: { name: "Disabled", control: "boolean", table: { category: "State" } },
    loading: { name: "Loading", control: "boolean", table: { category: "State" } },
    fullWidth: { name: "Full width", control: "boolean" },
    children: { name: "Label", control: "text" },
    showIconLeading: {
      name: "Icon Leading",
      control: "boolean",
      table: { category: "Icons" },
    },
    iconLeadingName: {
      name: "Icon Leading · icon",
      control: "select",
      options: Object.keys(icons),
      if: { arg: "showIconLeading" },
      table: { category: "Icons" },
    },
    showIconTrailing: {
      name: "Icon Trailing",
      control: "boolean",
      table: { category: "Icons" },
    },
    iconTrailingName: {
      name: "Icon Trailing · icon",
      control: "select",
      options: Object.keys(icons),
      if: { arg: "showIconTrailing" },
      table: { category: "Icons" },
    },
    // as propriedades reais recebem o componente do ícone; nos controles, usamos os de cima
    iconLeading: { table: { disable: true } },
    iconTrailing: { table: { disable: true } },
  },
  render: (args) => <StoryButton {...args} />,
} satisfies Meta<ButtonStoryArgs>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Variants: Story = {
  render: (args) => (
    <div className="flex flex-col gap-md">
      <div className="flex flex-wrap items-center gap-md">
        {variants.map((variant) => (
          <StoryButton key={variant} {...args} variant={variant}>
            {variant}
          </StoryButton>
        ))}
      </div>
      <div className="flex flex-wrap items-center gap-md">
        {variants.map((variant) => (
          <StoryButton key={variant} {...args} variant={variant} loading>
            Carregando
          </StoryButton>
        ))}
      </div>
    </div>
  ),
}

export const Sizes: Story = {
  render: (args) => (
    <div className="flex flex-wrap items-center gap-md">
      {sizes.map((size) => (
        <StoryButton key={size} {...args} size={size}>
          Tamanho {size}
        </StoryButton>
      ))}
    </div>
  ),
}

export const Disabled: Story = { args: { disabled: true, showIconLeading: true } }
