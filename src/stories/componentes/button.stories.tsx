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
  title: "Componentes/Button",
  component: Button,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Dispara uma ação. Anatomia: **[ícone antes] texto [ícone depois]**, com os dois ícones opcionais em qualquer variante e tamanho. Para botão só com ícone, use o **IconButton**.\n\nUse `default` para a ação principal da tela (uma por contexto), `outline` e `secondary` para ações de apoio, `ghost` e `link` para ações discretas e `destructive` para ações que apagam ou cancelam.\n\nNo código: `<Button iconLeading={PlusIcon} iconTrailing={ArrowRightIcon}>Continuar</Button>`.",
      },
    },
  },
  args: {
    variant: "default",
    size: "default",
    disabled: false,
    children: "Continuar",
    showIconLeading: false,
    iconLeadingName: "Plus",
    showIconTrailing: false,
    iconTrailingName: "ArrowRight",
  },
  argTypes: {
    variant: { name: "Tipo", control: "select", options: variants, description: "Variante visual." },
    size: { name: "Tamanho", control: "select", options: sizes },
    disabled: { name: "Desabilitado", control: "boolean" },
    children: { name: "Label", control: "text", description: "Texto do botão." },
    showIconLeading: {
      name: "Icon Leading",
      control: "boolean",
      description: "Mostra um ícone antes do texto. No código: `iconLeading={PlusIcon}`.",
      table: { category: "Ícones" },
    },
    iconLeadingName: {
      name: "Icon Leading · ícone",
      control: "select",
      options: Object.keys(icons),
      if: { arg: "showIconLeading" },
      table: { category: "Ícones" },
    },
    showIconTrailing: {
      name: "Icon Trailing",
      control: "boolean",
      description: "Mostra um ícone depois do texto. No código: `iconTrailing={ArrowRightIcon}`.",
      table: { category: "Ícones" },
    },
    iconTrailingName: {
      name: "Icon Trailing · ícone",
      control: "select",
      options: Object.keys(icons),
      if: { arg: "showIconTrailing" },
      table: { category: "Ícones" },
    },
    // as propriedades reais recebem o componente do ícone; nos controles, usamos os de cima
    iconLeading: { table: { disable: true } },
    iconTrailing: { table: { disable: true } },
  },
  render: (args) => <StoryButton {...args} />,
} satisfies Meta<ButtonStoryArgs>

export default meta
type Story = StoryObj<typeof meta>

export const Padrao: Story = { name: "Padrão" }

export const Variantes: Story = {
  render: (args) => (
    <div className="flex flex-wrap items-center gap-md">
      {variants.map((variant) => (
        <StoryButton key={variant} {...args} variant={variant}>
          {variant}
        </StoryButton>
      ))}
    </div>
  ),
}

export const Tamanhos: Story = {
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

export const ComIcone: Story = {
  name: "Com ícone",
  parameters: {
    docs: {
      description: {
        story:
          "Ícone antes, depois ou nos dois lados, em cada tamanho. O lado com ícone fica com menos padding, para o conjunto parecer centralizado. Troque o Tipo nos controles para ver em outra variante.",
      },
    },
  },
  render: (args) => (
    <div className="flex flex-col gap-md">
      {sizes.map((size) => (
        <div key={size} className="flex flex-wrap items-center gap-md">
          <StoryButton {...args} size={size} showIconLeading showIconTrailing={false}>
            Antes
          </StoryButton>
          <StoryButton {...args} size={size} showIconLeading={false} showIconTrailing>
            Depois
          </StoryButton>
          <StoryButton {...args} size={size} showIconLeading showIconTrailing>
            Os dois
          </StoryButton>
          <span className="typo-body-sm-regular text-text-3">{size}</span>
        </div>
      ))}
    </div>
  ),
}

export const Desabilitado: Story = { args: { disabled: true, showIconLeading: true } }
