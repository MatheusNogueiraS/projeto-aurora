import type { Meta, StoryObj } from "@storybook/react-vite"

import { Skeleton } from "@/components/ui/skeleton"

// Formato e uma largura de exemplo para cada um (no produto, a largura vem do conteúdo).
const shapes = {
  text: { shape: "text", className: "w-[200px]" },
  circle: { shape: "circle", className: "w-[40px]" },
  block: { shape: "block", className: "h-[80px] w-[200px]" },
} as const
type Shape = keyof typeof shapes
type SkeletonStoryArgs = { shape: Shape }

const meta = {
  title: "Components/Skeleton",
  tags: ["autodocs"],
  parameters: {
    docs: { description: { component: "Marcador de lugar enquanto o conteúdo carrega, no formato do que vai aparecer." } },
  },
  args: { shape: "text" },
  argTypes: {
    shape: { name: "Shape", control: "inline-radio", options: Object.keys(shapes), table: { defaultValue: { summary: '"block"' } } },
  },
  render: ({ shape = "text" }) => <Skeleton {...shapes[shape]} />,
} satisfies Meta<SkeletonStoryArgs>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Variants: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-lg">
      {(Object.keys(shapes) as Shape[]).map((s) => (
        <Skeleton key={s} {...shapes[s]} />
      ))}
    </div>
  ),
}
