import type { Meta, StoryObj } from "@storybook/react-vite"
import { CheckIcon, UserIcon } from "lucide-react"

import { Avatar, AvatarBadge, AvatarFallback, AvatarGroup, AvatarGroupCount, AvatarImage } from "@/components/ui/avatar"

// foto de exemplo local (sem buscar imagem em serviço externo)
const photo =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80"><rect width="80" height="80" fill="#C6BCDC"/><circle cx="40" cy="32" r="14" fill="#482B74"/><path d="M14 80c2-16 13-24 26-24s24 8 26 24z" fill="#482B74"/></svg>`
  )

const displays = ["Single", "Group"] as const
const contents = ["Photo", "Initials", "Icon"] as const
const people = ["MN", "AB", "CD", "EF", "GH"]

// Os controles cobrem todas as partes do componente: conteúdo (foto, iniciais ou ícone),
// tamanho, selo (com ou sem ícone) e grupo (quantidade e contador +N).
type AvatarStoryArgs = {
  display: (typeof displays)[number]
  content: (typeof contents)[number]
  initials: string
  size: "sm" | "default" | "lg"
  showBadge: boolean
  badgeIcon: boolean
  count: number
  extra: number
}

// controles escondidos não chegam até aqui, por isso os padrões
function Person({ content = "Photo", initials = "MN", size = "default", showBadge = false, badgeIcon = false }: Partial<AvatarStoryArgs>) {
  return (
    <Avatar size={size}>
      {content === "Photo" && <AvatarImage src={photo} alt="Foto de perfil" />}
      <AvatarFallback>{content === "Icon" ? <UserIcon className="size-[16px]" /> : initials}</AvatarFallback>
      {showBadge && <AvatarBadge>{badgeIcon && <CheckIcon />}</AvatarBadge>}
    </Avatar>
  )
}

function StoryAvatar({ display = "Single", count = 3, extra = 3, ...args }: Partial<AvatarStoryArgs>) {
  if (display === "Single") return <Person {...args} />
  return (
    <AvatarGroup>
      {people.slice(0, count).map((p, i) => (
        <Person key={p} {...args} initials={i === 0 ? (args.initials ?? p) : p} showBadge={false} />
      ))}
      {extra > 0 && <AvatarGroupCount>+{extra}</AvatarGroupCount>}
    </AvatarGroup>
  )
}

const meta = {
  title: "Components/Avatar",
  tags: ["autodocs"],
  parameters: { docs: { description: { component: "Representa uma pessoa com foto, iniciais ou um ícone." } } },
  args: { display: "Single", content: "Photo", initials: "MN", size: "default", showBadge: false, badgeIcon: false, count: 3, extra: 3 },
  argTypes: {
    display: { name: "Display", control: "inline-radio", options: displays },
    content: { name: "Content", control: "inline-radio", options: contents },
    initials: { name: "Initials", control: "text", if: { arg: "content", eq: "Initials" } },
    size: { name: "Size", control: "inline-radio", options: ["sm", "default", "lg"], table: { defaultValue: { summary: '"default"' } } },
    showBadge: { name: "Badge", control: "boolean", if: { arg: "display", eq: "Single" } },
    badgeIcon: { name: "Badge · icon", control: "boolean", if: { arg: "showBadge" } },
    count: { name: "Count", control: { type: "range", min: 2, max: 5, step: 1 }, if: { arg: "display", eq: "Group" } },
    extra: { name: "Group count", control: { type: "number", min: 0, max: 99 }, if: { arg: "display", eq: "Group" } },
  },
  render: (args) => <StoryAvatar {...args} />,
} satisfies Meta<AvatarStoryArgs>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Variants: Story = {
  render: (args) => (
    <div className="flex flex-wrap items-center gap-lg">
      {contents.map((c) => (
        <Person key={c} {...args} content={c} />
      ))}
      <Person {...args} showBadge />
      <Person {...args} showBadge badgeIcon />
      <StoryAvatar {...args} display="Group" />
    </div>
  ),
}

export const Sizes: Story = {
  render: (args) => (
    <div className="flex flex-wrap items-center gap-lg">
      <StoryAvatar {...args} size="sm" />
      <StoryAvatar {...args} size="default" />
      <StoryAvatar {...args} size="lg" />
    </div>
  ),
}
