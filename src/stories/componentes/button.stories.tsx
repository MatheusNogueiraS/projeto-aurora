import type { Meta, StoryObj } from "@storybook/react-vite"
import { ArrowRightIcon, PlusIcon } from "lucide-react"

import { Button } from "@/components/ui/button"

const variants = ["default", "outline", "secondary", "ghost", "destructive", "link"] as const
const sizes = ["xs", "sm", "default", "lg"] as const

const meta = {
  title: "Componentes/Button",
  component: Button,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Dispara uma ação. Use `default` para a ação principal da tela (uma por contexto), `outline` e `secondary` para ações de apoio, `ghost` e `link` para ações discretas e `destructive` para ações que apagam ou cancelam.",
      },
    },
  },
  args: { children: "Continuar", variant: "default", size: "default", disabled: false },
  argTypes: {
    variant: { control: "select", options: variants },
    size: { control: "select", options: [...sizes, "icon", "icon-xs", "icon-sm", "icon-lg"] },
  },
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

export const Padrao: Story = { name: "Padrão" }

export const Variantes: Story = {
  render: (args) => (
    <div className="flex flex-wrap items-center gap-xxxs">
      {variants.map((variant) => (
        <Button key={variant} {...args} variant={variant}>
          {variant}
        </Button>
      ))}
    </div>
  ),
}

export const Tamanhos: Story = {
  render: (args) => (
    <div className="flex flex-wrap items-center gap-xxxs">
      {sizes.map((size) => (
        <Button key={size} {...args} size={size}>
          Tamanho {size}
        </Button>
      ))}
    </div>
  ),
}

export const ComIcone: Story = {
  name: "Com ícone",
  render: (args) => (
    <div className="flex flex-wrap items-center gap-xxxs">
      <Button {...args}>
        <PlusIcon data-icon="inline-start" /> Nova proposta
      </Button>
      <Button {...args} variant="outline">
        Avançar <ArrowRightIcon data-icon="inline-end" />
      </Button>
      <Button {...args} size="icon" aria-label="Adicionar">
        <PlusIcon />
      </Button>
    </div>
  ),
}

export const Desabilitado: Story = { args: { disabled: true } }
