import type { Meta, StoryObj } from "@storybook/react-vite"

import { Skeleton } from "@/components/ui/skeleton"

const meta = {
  title: "Componentes/Skeleton",
  component: Skeleton,
  tags: ["autodocs"],
  parameters: {
    docs: { description: { component: "Marcador de lugar enquanto o conteúdo carrega. Imita o formato do que vai aparecer." } },
  },
} satisfies Meta<typeof Skeleton>

export default meta
type Story = StoryObj<typeof meta>

export const LinhasDeTexto: Story = {
  name: "Linhas de texto",
  render: () => (
    <div className="flex max-w-[288px] flex-col gap-sm">
      <Skeleton className="h-[16px] w-3/4" />
      <Skeleton className="h-[16px] w-1/2" />
    </div>
  ),
}

export const CartaoComAvatar: Story = {
  name: "Cartão com avatar",
  render: () => (
    <div className="flex max-w-[288px] items-center gap-md">
      <Skeleton className="size-[40px] shrink-0 rounded-pill" />
      <div className="flex flex-1 flex-col gap-sm">
        <Skeleton className="h-[16px] w-2/3" />
        <Skeleton className="h-[16px] w-1/3" />
      </div>
    </div>
  ),
}
