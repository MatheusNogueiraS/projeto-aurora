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
const actions = ["None", "Tag", "Icon Button"] as const

// Como o Card do shadcn: a caixa, com cabeçalho (título, descrição e ação no canto), conteúdo
// livre e rodapé. Os controles ligam cada parte; o conteúdo é um slot (texto ou outros componentes).
type CardStoryArgs = {
  size: "default" | "sm"
  showHeader: boolean
  title: string
  showDescription: boolean
  description: string
  action: (typeof actions)[number]
  contentType: "Text" | "Data Line"
  showFooter: boolean
}

// controles escondidos não chegam até aqui, por isso os padrões
function StoryCard({
  size = "default",
  showHeader = true,
  title = "",
  showDescription = true,
  description = "",
  action = "None",
  contentType = "Data Line",
  showFooter = true,
}: Partial<CardStoryArgs>) {
  return (
    <Card size={size} className="w-[320px]">
      {showHeader && (
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          {showDescription && <CardDescription>{description}</CardDescription>}
          {action !== "None" && (
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
        {contentType === "Text" ? (
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
  title: "Components/Card",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Caixa para agrupar um conteúdo na página; para marcar uma escolha, use o **Selection Card**.",
      },
    },
  },
  args: {
    size: "default",
    showHeader: true,
    title: "Resumo da proposta",
    showDescription: true,
    description: "Confira antes de continuar.",
    action: "None",
    contentType: "Data Line",
    showFooter: true,
  },
  argTypes: {
    size: { name: "Size", control: "inline-radio", options: ["sm", "default"], table: { defaultValue: { summary: '"default"' } } },
    showHeader: { name: "Header", control: "boolean", table: { category: "Parts" } },
    title: { name: "Title", control: "text", if: { arg: "showHeader" }, table: { category: "Parts" } },
    showDescription: { name: "Description", control: "boolean", if: { arg: "showHeader" }, table: { category: "Parts" } },
    description: { name: "Description · content", control: "text", if: { arg: "showDescription" }, table: { category: "Parts" } },
    action: { name: "Action", control: "inline-radio", options: actions, if: { arg: "showHeader" }, table: { category: "Parts", defaultValue: { summary: '"None"' } } },
    contentType: { name: "Content", control: "inline-radio", options: ["Text", "Data Line"], table: { category: "Parts" } },
    showFooter: { name: "Footer", control: "boolean", table: { category: "Parts" } },
  },
  render: (args) => <StoryCard {...args} />,
} satisfies Meta<CardStoryArgs>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

// Usos comuns: resumo com rodapé, aviso só com texto e card com tag no canto.
export const Variants: Story = {
  render: () => (
    <div className="flex flex-wrap items-start gap-xl">
      <StoryCard title="Resumo da proposta" description="Confira antes de continuar." />
      <StoryCard title="Quando o dinheiro cai" showDescription={false} contentType="Text" showFooter={false} />
      <StoryCard title="Proposta 4821" description="Consignado INSS" action="Tag" showFooter={false} />
    </div>
  ),
}

export const Sizes: Story = {
  render: (args) => (
    <div className="flex flex-wrap items-start gap-xl">
      <StoryCard {...args} size="sm" />
      <StoryCard {...args} size="default" />
    </div>
  ),
}
