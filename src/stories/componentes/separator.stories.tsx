import type { Meta, StoryObj } from "@storybook/react-vite"

import { Separator } from "@/components/ui/separator"

const orientations = ["horizontal", "vertical"] as const
type SeparatorStoryArgs = { orientation: (typeof orientations)[number] }

function StorySeparator({ orientation }: SeparatorStoryArgs) {
  return orientation === "vertical" ? (
    <div className="flex h-[20px] items-center gap-md typo-body-md-regular">
      <span>Perfil</span>
      <Separator orientation="vertical" />
      <span>Conta</span>
    </div>
  ) : (
    <div className="flex max-w-[288px] flex-col gap-sm typo-body-md-regular">
      <span>Dados pessoais</span>
      <Separator />
      <span>Endereço</span>
    </div>
  )
}

const meta = {
  title: "Components/Separator",
  tags: ["autodocs"],
  parameters: { docs: { description: { component: "Linha que separa grupos de conteúdo." } } },
  args: { orientation: "horizontal" },
  argTypes: {
    orientation: { name: "Orientation", control: "inline-radio", options: orientations, table: { defaultValue: { summary: '"horizontal"' } } },
  },
  render: (args) => <StorySeparator {...args} />,
} satisfies Meta<SeparatorStoryArgs>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Variants: Story = {
  render: () => (
    <div className="flex flex-col gap-lg">
      {orientations.map((o) => (
        <StorySeparator key={o} orientation={o} />
      ))}
    </div>
  ),
}
