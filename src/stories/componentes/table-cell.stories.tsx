import type { Meta, StoryObj } from "@storybook/react-vite"
import { EllipsisVerticalIcon, StarIcon } from "lucide-react"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { IconButton } from "@/components/ui/icon-button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Toggle } from "@/components/ui/toggle"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

// A célula é a unidade da tabela (como no Figma): de cabeçalho (TableHead) ou de conteúdo
// (TableCell). Dentro dela vai texto ou um componente do Aurora (embutido).
const contents = ["Text", "Text with support", "Badge", "Checkbox", "Radio", "Switch", "Toggle", "Select", "Avatar", "Action", "Link"] as const
type Content = (typeof contents)[number]
const aligns = ["left", "center", "right"] as const

type CellStoryArgs = {
  type: "header" | "body"
  content: Content
  text: string
  support: string
  align: (typeof aligns)[number]
}

function CellContent({ content, text, support }: { content: Content; text: string; support: string }) {
  switch (content) {
    case "Text with support":
      return (
        <>
          <span className="block">{text}</span>
          <span className="block typo-body-sm-regular text-text-3">{support}</span>
        </>
      )
    case "Badge":
      return <Badge variant="success">{text}</Badge>
    case "Checkbox":
      return <Checkbox aria-label={text} />
    case "Radio":
      // na tabela, o grupo junta os radios de todas as linhas (escolher uma linha só)
      return (
        <RadioGroup aria-label={text} defaultValue="linha">
          <RadioGroupItem value="linha" aria-label={text} />
        </RadioGroup>
      )
    case "Switch":
      return <Switch aria-label={text} defaultChecked />
    case "Toggle":
      return (
        <Toggle size="sm" aria-label={text}>
          <StarIcon />
        </Toggle>
      )
    case "Select":
      return (
        <Select defaultValue="24 meses">
          <SelectTrigger size="sm" aria-label={text}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {["12 meses", "24 meses", "36 meses", "48 meses"].map((p) => (
              <SelectItem key={p} value={p}>
                {p}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )
    case "Avatar":
      return (
        <span className="inline-flex items-center gap-sm">
          <Avatar size="sm">
            <AvatarFallback>MS</AvatarFallback>
          </Avatar>
          {text}
        </span>
      )
    case "Action":
      return (
        <IconButton variant="ghost" size="sm" aria-label={text}>
          <EllipsisVerticalIcon />
        </IconButton>
      )
    case "Link":
      return (
        <Button variant="link" size="sm">
          {text}
        </Button>
      )
    default:
      return text
  }
}

// controles escondidos não chegam até aqui, por isso os padrões
function StoryCell({ type = "body", content = "Text", text = "Maria Souza", support = "CPF 123.456.789-00", align = "left" }: Partial<CellStoryArgs>) {
  const inner = <CellContent content={content} text={text} support={support} />
  return (
    // só a célula: sem divisor nem fundo, que são da Linha (ver Table/Linha)
    <div className="w-[280px]">
      <Table>
        {type === "header" ? (
          <TableHeader className="[&_tr]:border-b-(length:--aurora-stroke-none)">
            <TableRow className="hover:bg-transparent">
              <TableHead align={align}>{inner}</TableHead>
            </TableRow>
          </TableHeader>
        ) : (
          <TableBody>
            <TableRow>
              <TableCell align={align}>{inner}</TableCell>
            </TableRow>
          </TableBody>
        )}
      </Table>
    </div>
  )
}

// Texto de exemplo de cada conteúdo (no código, o conteúdo é de quem usa).
const examples: Record<Content, string> = {
  Text: "Maria Souza",
  "Text with support": "Maria Souza",
  Badge: "Pago",
  Checkbox: "Selecionar linha",
  Radio: "Escolher esta linha",
  Switch: "Ativar débito automático",
  Toggle: "Favoritar",
  Select: "Prazo",
  Avatar: "Maria Souza",
  Action: "Mais ações",
  Link: "Ver contrato",
}

const meta = {
  title: "Components/Table/Cell",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "A unidade da tabela, de cabeçalho ou de conteúdo, com texto ou um componente dentro.",
      },
    },
  },
  args: { type: "body", content: "Text", text: "Maria Souza", support: "CPF 123.456.789-00", align: "left" },
  argTypes: {
    type: { name: "Type", control: "inline-radio", options: ["header", "body"] },
    content: { name: "Content", control: "select", options: contents },
    text: { name: "Text", control: "text" },
    support: { name: "Support", control: "text", if: { arg: "content", eq: "Text with support" } },
    align: { name: "Alignment", control: "inline-radio", options: aligns, table: { defaultValue: { summary: '"left"' } } },
  },
  render: (args) => <StoryCell {...args} />,
} satisfies Meta<CellStoryArgs>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

// Cada conteúdo possível numa célula de conteúdo, e a célula de cabeçalho.
export const Variants: Story = {
  render: (args) => (
    <div className="flex flex-col gap-md">
      <StoryCell {...args} type="header" content="Text" text="Cliente" />
      {contents.map((content) => (
        <StoryCell key={content} {...args} type="body" content={content} text={examples[content]} />
      ))}
    </div>
  ),
}
