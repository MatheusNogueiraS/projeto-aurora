import type { Meta, StoryObj } from "@storybook/react-vite"
import { CircleAlertIcon, CircleCheckIcon, InfoIcon, TriangleAlertIcon } from "lucide-react"

import { Alert, AlertAction, AlertDescription, AlertTitle } from "@/components/ui/alert"

const variants = ["default", "info", "success", "warning", "destructive"] as const
type Variant = (typeof variants)[number]

// Ícone e texto de exemplo de cada variante (no código, o ícone é escolhido por quem usa).
const examples: Record<Variant, { icon: React.ComponentType; title: string; description: string }> = {
  default: { icon: InfoIcon, title: "Proposta enviada", description: "Você receberá a resposta em até 2 dias úteis." },
  info: { icon: InfoIcon, title: "Atualização disponível", description: "Uma nova versão do contrato está pronta para leitura." },
  success: { icon: CircleCheckIcon, title: "Pagamento confirmado", description: "O valor cai na sua conta em até 1 dia útil." },
  warning: { icon: TriangleAlertIcon, title: "Documento perto de vencer", description: "Envie um documento atualizado até sexta-feira." },
  destructive: { icon: CircleAlertIcon, title: "Não foi possível enviar", description: "Confira os dados e tente novamente." },
}

// Os controles seguem o Alert do Nitro: título, descrição (liga/desliga) e ação (liga/desliga).
// No código, descrição e CTA são o <AlertDescription> e o <AlertAction>; os dois são opcionais.
type AlertStoryArgs = React.ComponentProps<typeof Alert> & {
  title: string
  showDescription: boolean
  description: string
  showAction: boolean
  actionLabel: string
  actionStyle: "link" | "outline"
}

function StoryAlert({
  title,
  showDescription,
  description = "",
  showAction,
  actionLabel = "Ver",
  actionStyle = "link",
  ...args
}: AlertStoryArgs) {
  const Icon = examples[args.variant ?? "default"].icon
  return (
    <Alert {...args} className="max-w-[360px]">
      <Icon />
      <AlertTitle>{title}</AlertTitle>
      {showDescription && <AlertDescription>{description}</AlertDescription>}
      {showAction && (
        <AlertAction variant={actionStyle}>{actionLabel}</AlertAction>
      )}
    </Alert>
  )
}

const meta = {
  title: "Componentes/Alert",
  component: Alert,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Mensagem fixa na tela para informar o resultado de uma ação ou um aviso importante. Anatomia: **ícone, título, descrição (opcional) e ação/CTA (opcional)** à direita.\n\nO CTA segue a cor do texto de cada Tipo, sem token próprio. No código: `<AlertAction variant=\"link\">Ver</AlertAction>`, que só aceita os estilos `link` e `outline`.",
      },
    },
  },
  args: {
    variant: "default",
    title: "Proposta enviada",
    showDescription: true,
    description: "Você receberá a resposta em até 2 dias úteis.",
    showAction: false,
    actionLabel: "Ver",
    actionStyle: "link",
  },
  argTypes: {
    variant: { name: "Tipo", control: "select", options: variants, description: "default (neutro), info, success (sucesso), warning (atenção) e destructive (erro)." },
    title: { name: "Título", control: "text" },
    showDescription: { name: "Descrição", control: "boolean", description: "Liga/desliga a descrição: dá para ter alert só com título." },
    description: { name: "Descrição · texto", control: "text", if: { arg: "showDescription" } },
    showAction: { name: "Ação (CTA)", control: "boolean", description: "Mostra uma ação à direita, na cor do texto do Tipo. No código: `<AlertAction>`.", table: { category: "Ação" } },
    actionLabel: { name: "Ação · texto", control: "text", if: { arg: "showAction" }, table: { category: "Ação" } },
    actionStyle: { name: "Ação · estilo", control: "inline-radio", options: ["link", "outline"], if: { arg: "showAction" }, table: { category: "Ação" } },
  },
  render: (args) => <StoryAlert {...args} />,
} satisfies Meta<AlertStoryArgs>

export default meta
type Story = StoryObj<typeof meta>

export const Padrao: Story = { name: "Padrão" }

export const Variantes: Story = {
  render: (args) => (
    <div className="flex flex-col gap-md">
      {variants.map((variant) => (
        <StoryAlert
          key={variant}
          {...args}
          variant={variant}
          title={examples[variant].title}
          description={examples[variant].description}
        />
      ))}
    </div>
  ),
}
