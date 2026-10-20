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
    <div className="flex max-w-popover flex-col gap-nano">
      <Skeleton className="h-xxs w-3/4" />
      <Skeleton className="h-xxs w-1/2" />
    </div>
  ),
}

export const CartaoComAvatar: Story = {
  name: "Cartão com avatar",
  render: () => (
    <div className="flex max-w-popover items-center gap-xxxs">
      <Skeleton className="size-control-lg shrink-0 rounded-avatar" />
      <div className="flex flex-1 flex-col gap-nano">
        <Skeleton className="h-xxs w-2/3" />
        <Skeleton className="h-xxs w-1/3" />
      </div>
    </div>
  ),
}
