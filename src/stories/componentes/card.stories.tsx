import type { Meta, StoryObj } from "@storybook/react-vite"
import { EllipsisVerticalIcon } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { DataLine } from "@/components/ui/data-line"
import { IconButton } from "@/components/ui/icon-button"

const lines = [
  { label: "Valor liberado", value: "R$ 3.000,00" },
  { label: "Parcelas", value: "84x de R$ 42,38" },
  { label: "Taxa de juros", value: "1,80% a.m." },
]
const actions = ["Nenhuma", "Tag", "Botão de ícone"] as const

// Como o Card do shadcn: a caixa, com cabeçalho (título, descrição e ação no canto), conteúdo
// livre e rodapé. Os controles ligam cada parte; o conteúdo é um slot (texto ou outros componentes).
type CardStoryArgs = {
  size: "default" | "sm"
  showHeader: boolean
  title: string
  showDescription: boolean
  description: string
  action: (typeof actions)[number]
  contentType: "Texto" | "Linhas de dados"
  showFooter: boolean
}

// controles escondidos não chegam até aqui, por isso os padrões
function StoryCard({
  size = "default",
  showHeader = true,
  title = "",
  showDescription = true,
  description = "",
  action = "Nenhuma",
  contentType = "Linhas de dados",
  showFooter = true,
}: Partial<CardStoryArgs>) {
  return (
    <Card size={size} className="w-[320px]">
      {showHeader && (
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          {showDescription && <CardDescription>{description}</CardDescription>}
          {action !== "Nenhuma" && (
            <CardAction>
              {action === "Tag" ? (
                <Badge variant="success">Aprovada</Badge>
              ) : (
                <IconButton variant="ghost" size="sm" aria-label="Mais ações">
                  <EllipsisVerticalIcon />
                </IconButton>
              )}
            </CardAction>
          )}
        </CardHeader>
      )}
      <CardContent>
        {contentType === "Texto" ? (
          <p>O valor cai na sua conta em até 1 dia útil depois da assinatura.</p>
        ) : (
          <div>
            {lines.map((l) => (
              <DataLine key={l.label} {...l} size="sm" />
            ))}
          </div>
        )}
      </CardContent>
      {showFooter && (
        <CardFooter>
          <Button size={size === "sm" ? "sm" : "default"} className="w-full">
            Continuar
          </Button>
        </CardFooter>
      )}
    </Card>
  )
}

const meta = {
  title: "Componentes/Card",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Caixa para agrupar um conteúdo na página: cabeçalho, conteúdo e rodapé, todos opcionais. Mesma caixa do **Hover Card** e do **Popover**. Para um card que marca uma escolha, use o **Card de seleção**.",
      },
    },
  },
  args: {
    size: "default",
    showHeader: true,
    title: "Resumo da proposta",
    showDescription: true,
    description: "Confira antes de continuar.",
    action: "Nenhuma",
    contentType: "Linhas de dados",
    showFooter: true,
  },
  argTypes: {
    size: { name: "Tamanho", control: "inline-radio", options: ["sm", "default"], description: "Espaço interno de 12px (sm) ou 16px (default)." },
    showHeader: { name: "Cabeçalho", control: "boolean", description: "Mostra o título no topo.", table: { category: "Partes" } },
    title: { name: "Título", control: "text", if: { arg: "showHeader" }, table: { category: "Partes" } },
    showDescription: { name: "Descrição", control: "boolean", description: "Texto de apoio abaixo do título.", if: { arg: "showHeader" }, table: { category: "Partes" } },
    description: { name: "Descrição · conteúdo", control: "text", if: { arg: "showDescription" }, table: { category: "Partes" } },
    action: { name: "Ação", control: "inline-radio", options: actions, description: "Algo no canto do cabeçalho: uma tag ou um botão.", if: { arg: "showHeader" }, table: { category: "Partes" } },
    contentType: { name: "Conteúdo", control: "inline-radio", options: ["Texto", "Linhas de dados"], description: "O que vai no meio: texto ou outros componentes (ex.: DataLine).", table: { category: "Partes" } },
    showFooter: { name: "Rodapé", control: "boolean", description: "Mostra o rodapé, com o botão.", table: { category: "Partes" } },
  },
  render: (args) => <StoryCard {...args} />,
} satisfies Meta<CardStoryArgs>

export default meta
type Story = StoryObj<typeof meta>

export const Padrao: Story = { name: "Padrão" }

// Usos comuns: resumo com rodapé, aviso só com texto e card com tag no canto.
export const Variantes: Story = {
  render: () => (
    <div className="flex flex-wrap items-start gap-xl">
      <StoryCard title="Resumo da proposta" description="Confira antes de continuar." />
      <StoryCard title="Quando o dinheiro cai" showDescription={false} contentType="Texto" showFooter={false} />
      <StoryCard title="Proposta 4821" description="Consignado INSS" action="Tag" showFooter={false} />
    </div>
  ),
}

export const Tamanhos: Story = {
  render: (args) => (
    <div className="flex flex-wrap items-start gap-xl">
      <StoryCard {...args} size="sm" />
      <StoryCard {...args} size="default" />
    </div>
  ),
}
