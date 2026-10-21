import type { Meta, StoryObj } from "@storybook/react-vite"

import { Skeleton } from "@/components/ui/skeleton"

// Formato e uma largura de exemplo para cada um (no produto, a largura vem do conteúdo).
const shapes = {
  Texto: { shape: "text", className: "w-[200px]" },
  Círculo: { shape: "circle", className: "w-[40px]" },
  Bloco: { shape: "block", className: "h-[80px] w-[200px]" },
} as const
type Shape = keyof typeof shapes
type SkeletonStoryArgs = { shape: Shape }

const meta = {
  title: "Componentes/Skeleton",
  tags: ["autodocs"],
  parameters: {
    docs: { description: { component: "Marcador de lugar enquanto o conteúdo carrega. Imita o formato do que vai aparecer." } },
  },
  args: { shape: "Texto" },
  argTypes: {
    shape: { name: "Formato", control: "inline-radio", options: Object.keys(shapes), description: "Forma do conteúdo que vai aparecer." },
  },
  render: ({ shape = "Texto" }) => <Skeleton {...shapes[shape]} />,
} satisfies Meta<SkeletonStoryArgs>

export default meta
type Story = StoryObj<typeof meta>

export const Padrao: Story = { name: "Padrão" }

export const Variantes: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-lg">
      {(Object.keys(shapes) as Shape[]).map((s) => (
        <Skeleton key={s} {...shapes[s]} />
      ))}
    </div>
  ),
}
