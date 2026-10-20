import type { Meta, StoryObj } from "@storybook/react-vite"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Toaster } from "@/components/ui/sonner"

const meta = {
  title: "Componentes/Sonner (toast)",
  component: Toaster,
  tags: ["autodocs"],
  parameters: {
    docs: { description: { component: "Aviso temporário no canto da tela, para confirmar ações. Some sozinho." } },
  },
  render: () => (
    <div className="flex flex-wrap items-center gap-md">
      <Button variant="outline" onClick={() => toast.success("Proposta enviada!")}>
        Sucesso
      </Button>
      <Button variant="outline" onClick={() => toast.info("Você tem uma nova mensagem")}>
        Informação
      </Button>
      <Button variant="outline" onClick={() => toast.warning("Seu limite está quase no fim")}>
        Aviso
      </Button>
      <Button variant="outline" onClick={() => toast.error("Falha ao enviar")}>
        Erro
      </Button>
      <Toaster />
    </div>
  ),
} satisfies Meta<typeof Toaster>

export default meta
type Story = StoryObj<typeof meta>

export const Tipos: Story = {}
