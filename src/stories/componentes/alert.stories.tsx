import type { Meta, StoryObj } from "@storybook/react-vite"
import { InfoIcon, TriangleAlertIcon } from "lucide-react"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

const meta = {
  title: "Componentes/Alert",
  component: Alert,
  tags: ["autodocs"],
  parameters: {
    docs: { description: { component: "Mensagem fixa na tela para informar o resultado de uma ação ou um aviso importante." } },
  },
  args: { variant: "default" },
  argTypes: { variant: { control: "select", options: ["default", "destructive"] } },
  render: (args) => (
    <Alert {...args} className="max-w-popover">
      {args.variant === "destructive" ? <TriangleAlertIcon /> : <InfoIcon />}
      <AlertTitle>{args.variant === "destructive" ? "Não foi possível enviar" : "Proposta enviada"}</AlertTitle>
      <AlertDescription>
        {args.variant === "destructive"
          ? "Confira os dados e tente novamente."
          : "Você receberá a resposta em até 2 dias úteis."}
      </AlertDescription>
    </Alert>
  ),
} satisfies Meta<typeof Alert>

export default meta
type Story = StoryObj<typeof meta>

export const Padrao: Story = { name: "Padrão" }
export const Erro: Story = { args: { variant: "destructive" } }
