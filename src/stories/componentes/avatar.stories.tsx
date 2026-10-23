import type { Meta, StoryObj } from "@storybook/react-vite"
import { CheckIcon, UserIcon } from "lucide-react"

import { Avatar, AvatarBadge, AvatarFallback, AvatarGroup, AvatarGroupCount, AvatarImage } from "@/components/ui/avatar"

// foto de exemplo local (sem buscar imagem em serviço externo)
const photo =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80"><rect width="80" height="80" fill="#C6BCDC"/><circle cx="40" cy="32" r="14" fill="#482B74"/><path d="M14 80c2-16 13-24 26-24s24 8 26 24z" fill="#482B74"/></svg>`
  )

const displays = ["Único", "Grupo"] as const
const contents = ["Foto", "Iniciais", "Ícone"] as const
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
function Person({ content = "Foto", initials = "MN", size = "default", showBadge = false, badgeIcon = false }: Partial<AvatarStoryArgs>) {
  return (
    <Avatar size={size}>
      {content === "Foto" && <AvatarImage src={photo} alt="Foto de perfil" />}
      <AvatarFallback>{content === "Ícone" ? <UserIcon className="size-[16px]" /> : initials}</AvatarFallback>
      {showBadge && <AvatarBadge>{badgeIcon && <CheckIcon />}</AvatarBadge>}
    </Avatar>
  )
}

function StoryAvatar({ display = "Único", count = 3, extra = 3, ...args }: Partial<AvatarStoryArgs>) {
  if (display === "Único") return <Person {...args} />
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
  title: "Componentes/Avatar",
  tags: ["autodocs"],
  parameters: { docs: { description: { component: "Representa uma pessoa. Sem foto, mostra as iniciais ou um ícone." } } },
  args: { display: "Único", content: "Foto", initials: "MN", size: "default", showBadge: false, badgeIcon: false, count: 3, extra: 3 },
  argTypes: {
    display: { name: "Exibição", control: "inline-radio", options: displays, description: "Um avatar ou um grupo sobreposto." },
    content: { name: "Conteúdo", control: "inline-radio", options: contents, description: "Foto, iniciais ou ícone." },
    initials: { name: "Iniciais", control: "text", description: "Até duas letras.", if: { arg: "content", eq: "Iniciais" } },
    size: { name: "Tamanho", control: "inline-radio", options: ["sm", "default", "lg"], description: "sm (24px), default (32px) ou lg (40px)." },
    showBadge: { name: "Selo", control: "boolean", description: "Mostra um selo no canto (ex.: online).", if: { arg: "display", eq: "Único" } },
    badgeIcon: { name: "Selo · ícone", control: "boolean", description: "Ícone dentro do selo. Não aparece no sm.", if: { arg: "showBadge" } },
    count: { name: "Quantidade", control: { type: "range", min: 2, max: 5, step: 1 }, description: "Avatares no grupo.", if: { arg: "display", eq: "Grupo" } },
    extra: { name: "Contador", control: { type: "number", min: 0, max: 99 }, description: "Pessoas a mais (+N). Zero esconde.", if: { arg: "display", eq: "Grupo" } },
  },
  render: (args) => <StoryAvatar {...args} />,
} satisfies Meta<AvatarStoryArgs>

export default meta
type Story = StoryObj<typeof meta>

export const Padrao: Story = { name: "Padrão" }

export const Variantes: Story = {
  render: (args) => (
    <div className="flex flex-wrap items-center gap-lg">
      {contents.map((c) => (
        <Person key={c} {...args} content={c} />
      ))}
      <Person {...args} showBadge />
      <Person {...args} showBadge badgeIcon />
      <StoryAvatar {...args} display="Grupo" />
    </div>
  ),
}

export const Tamanhos: Story = {
  render: (args) => (
    <div className="flex flex-wrap items-center gap-lg">
      <StoryAvatar {...args} size="sm" />
      <StoryAvatar {...args} size="default" />
      <StoryAvatar {...args} size="lg" />
    </div>
  ),
}
