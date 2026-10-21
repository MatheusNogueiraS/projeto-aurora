import type { Meta, StoryObj } from "@storybook/react-vite"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Toaster } from "@/components/ui/sonner"

const types = { Padrão: toast, Sucesso: toast.success, Informação: toast.info, Atenção: toast.warning, Erro: toast.error } as const
type ToastType = keyof typeof types

// Controles no padrão do painel do Figma: tipo, texto e descrição. O aviso aparece ao clicar.
type ToastStoryArgs = { type: ToastType; title: string; showDescription: boolean; description: string }

function show({ type = "Sucesso", title, showDescription, description }: ToastStoryArgs) {
  types[type](title, { description: showDescription ? description : undefined })
}

const meta = {
  title: "Componentes/Sonner (toast)",
  tags: ["autodocs"],
  parameters: {
    docs: { description: { component: "Aviso temporário no canto da tela, para confirmar ações. Some sozinho." } },
  },
  args: { type: "Sucesso", title: "Proposta enviada!", showDescription: false, description: "Você receberá a resposta em até 2 dias úteis." },
  argTypes: {
    type: { name: "Tipo", control: "inline-radio", options: Object.keys(types), description: "Padrão, sucesso, informação, atenção ou erro." },
    title: { name: "Texto", control: "text", description: "Mensagem do aviso." },
    showDescription: { name: "Descrição", control: "boolean", description: "Mostra um texto de apoio." },
    description: { name: "Descrição · conteúdo", control: "text", if: { arg: "showDescription" } },
  },
  render: (args) => (
    <div className="flex flex-wrap items-center gap-md">
      <Button variant="outline" onClick={() => show(args)}>
        Mostrar aviso
      </Button>
      <Toaster />
    </div>
  ),
} satisfies Meta<ToastStoryArgs>

export default meta
type Story = StoryObj<typeof meta>

export const Padrao: Story = { name: "Padrão" }

export const Variantes: Story = {
  render: (args) => (
    <div className="flex flex-wrap items-center gap-md">
      {(Object.keys(types) as ToastType[]).map((type) => (
        <Button key={type} variant="outline" onClick={() => show({ ...args, type, title: type })}>
          {type}
        </Button>
      ))}
      <Toaster />
    </div>
  ),
}
