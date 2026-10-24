import * as React from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"
import type { ToasterProps } from "sonner"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Toaster, toast } from "@/components/ui/sonner"

const types = {
  Padrão: toast,
  Sucesso: toast.success,
  Informação: toast.info,
  Atenção: toast.warning,
  Erro: toast.error,
} as const
type ToastType = keyof typeof types

// Texto de exemplo de cada tipo (no código, o texto é de quem usa).
const examples: Record<ToastType, { title: string; description: string }> = {
  Padrão: { title: "Proposta salva", description: "Você pode continuar de onde parou." },
  Sucesso: { title: "Pagamento confirmado", description: "O valor cai na sua conta em até 1 dia útil." },
  Informação: { title: "Atualização disponível", description: "Uma nova versão do contrato está pronta." },
  Atenção: { title: "Documento perto de vencer", description: "Envie um documento atualizado até sexta-feira." },
  Erro: { title: "Não foi possível enviar", description: "Confira os dados e tente novamente." },
}

const positions = ["top-left", "top-center", "top-right", "bottom-left", "bottom-center", "bottom-right"] as const
const buttons = ["Nenhum", "Ação", "Fechar"] as const

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
  type = "Sucesso",
  title,
  showDescription = true,
  description,
  button = "Nenhum",
  actionLabel = "Desfazer",
}: Partial<ToastStoryArgs>) {
  return types[type](title || examples[type].title, {
    toasterId,
    description: showDescription ? description || examples[type].description : undefined,
    action: button === "Ação" ? { label: actionLabel, onClick: () => {} } : undefined,
    closeButton: button === "Fechar",
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
  title: "Componentes/Toast",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Aviso temporário no canto da tela, para dar retorno de uma ação (feedback). Some sozinho. Mesmas cores do **Alert** em cada tipo.",
      },
    },
  },
  args: {
    type: "Sucesso",
    title: "",
    showDescription: true,
    description: "",
    button: "Nenhum",
    actionLabel: "Desfazer",
    position: "bottom-right",
  },
  argTypes: {
    type: { name: "Tipo", control: "inline-radio", options: Object.keys(types), description: "Padrão, sucesso, informação, atenção ou erro." },
    title: { name: "Texto", control: "text", description: "Mensagem do aviso. Vazio: o exemplo do tipo." },
    showDescription: { name: "Descrição", control: "boolean", description: "Mostra um texto de apoio." },
    description: { name: "Descrição · conteúdo", control: "text", description: "Vazio: o exemplo do tipo.", if: { arg: "showDescription" } },
    button: { name: "Botão", control: "inline-radio", options: buttons, description: "Uma ação (ex.: Desfazer) ou o X de fechar; nunca os dois." },
    actionLabel: { name: "Ação · texto", control: "text", if: { arg: "button", eq: "Ação" } },
    position: { name: "Posição", control: "select", options: positions, description: "Canto da tela onde aparece." },
  },
  render: (args) => <Preview list={[args]} position={args.position} />,
} satisfies Meta<ToastStoryArgs>

export default meta
type Story = StoryObj<typeof meta>

export const Padrao: Story = { name: "Padrão" }

export const Variantes: Story = {
  render: (args) => (
    <Preview
      list={(Object.keys(types) as ToastType[]).map((type) => ({ ...args, type, ...examples[type] }))}
      position={args.position}
      expand
    />
  ),
}
