import * as React from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"
import type { ToasterProps } from "sonner"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Toaster, toast } from "@/components/ui/sonner"

const types = {
  default: toast,
  success: toast.success,
  info: toast.info,
  warning: toast.warning,
  error: toast.error,
} as const
type ToastType = keyof typeof types

// Texto de exemplo de cada tipo (no código, o texto é de quem usa).
const examples: Record<ToastType, { title: string; description: string }> = {
  default: { title: "Proposta salva", description: "Você pode continuar de onde parou." },
  success: { title: "Pagamento confirmado", description: "O valor cai na sua conta em até 1 dia útil." },
  info: { title: "Atualização disponível", description: "Uma nova versão do contrato está pronta." },
  warning: { title: "Documento perto de vencer", description: "Envie um documento atualizado até sexta-feira." },
  error: { title: "Não foi possível enviar", description: "Confira os dados e tente novamente." },
}

const positions = ["top-left", "top-center", "top-right", "bottom-left", "bottom-center", "bottom-right"] as const
const buttons = ["None", "Action", "Close"] as const

// Os controles seguem o Sonner do shadcn: tipo, texto, descrição, botão (ação ou fechar) e posição.
type ToastStoryArgs = {
  type: ToastType
  title: string
  showDescription: boolean
  description: string
  button: (typeof buttons)[number]
  actionLabel: string
  position: ToasterProps["position"]
}

// controles escondidos não chegam até aqui, por isso os padrões; texto vazio usa o exemplo do tipo.
// Na documentação o aviso fica aberto (duração infinita) para dar para ver; no produto some sozinho.
function show(toasterId: string, {
  type = "success",
  title,
  showDescription = true,
  description,
  button = "None",
  actionLabel = "Desfazer",
}: Partial<ToastStoryArgs>) {
  return types[type](title || examples[type].title, {
    toasterId,
    description: showDescription ? description || examples[type].description : undefined,
    action: button === "Action" ? { label: actionLabel, onClick: () => {} } : undefined,
    closeButton: button === "Close",
    duration: Infinity,
  })
}

// Mostra o aviso assim que a história abre e de novo a cada mudança nos controles. Cada história
// tem a sua lista de avisos (toasterId) e uma área própria: o transform faz o aviso, que é fixo na
// tela, ficar preso aos cantos desta área, e não aos da página da documentação.
function Preview({ list, position, expand = false }: { list: Partial<ToastStoryArgs>[]; position: ToastStoryArgs["position"]; expand?: boolean }) {
  const toasterId = React.useId()
  const open = React.useRef<(string | number)[]>([])
  const key = JSON.stringify(list)
  // troca os avisos abertos pelos novos (sem acumular)
  const replay = () => {
    open.current.forEach((id) => toast.dismiss(id))
    open.current = list.map((args) => show(toasterId, args))
  }
  React.useEffect(() => {
    // espera o Toaster montar antes do primeiro aviso
    const timer = setTimeout(replay)
    return () => clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key])
  return (
    <div className={cn("relative flex w-full transform-gpu items-center justify-center overflow-hidden", expand ? "h-[600px]" : "h-[320px]")}>
      <Button variant="outline" onClick={replay}>
        Mostrar de novo
      </Button>
      <Toaster id={toasterId} position={position} expand={expand} visibleToasts={Math.max(3, list.length)} />
    </div>
  )
}

const meta = {
  title: "Components/Toast",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Aviso temporário no canto da tela para dar retorno de uma ação; some sozinho.",
      },
    },
  },
  args: {
    type: "success",
    title: "",
    showDescription: true,
    description: "",
    button: "None",
    actionLabel: "Desfazer",
    position: "bottom-right",
  },
  argTypes: {
    type: { name: "Type", control: "inline-radio", options: Object.keys(types), table: { defaultValue: { summary: '"default"' } } },
    title: { name: "Text", control: "text" },
    showDescription: { name: "Description", control: "boolean" },
    description: { name: "Description · content", control: "text", if: { arg: "showDescription" } },
    button: { name: "Button", control: "inline-radio", options: buttons, table: { defaultValue: { summary: '"None"' } } },
    actionLabel: { name: "Action · text", control: "text", if: { arg: "button", eq: "Action" } },
    position: { name: "Position", control: "select", options: positions, table: { defaultValue: { summary: '"bottom-right"' } } },
  },
  render: (args) => <Preview list={[args]} position={args.position} />,
} satisfies Meta<ToastStoryArgs>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Variants: Story = {
  render: (args) => (
    <Preview
      list={(Object.keys(types) as ToastType[]).map((type) => ({ ...args, type, ...examples[type] }))}
      position={args.position}
      expand
    />
  ),
}
