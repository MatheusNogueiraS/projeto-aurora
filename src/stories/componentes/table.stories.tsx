import type { Meta, StoryObj } from "@storybook/react-vite"

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import { columns, parcelas } from "./table-example"

// A tabela é só a montagem: Linhas (ver Table/Linha) feitas de Células (ver Table/Célula).
// O que vai em cada célula e o estado de cada linha se escolhe nas páginas delas.
type TableStoryArgs = {
  columns: number
  showHeader: boolean
  showFooter: boolean
  showCaption: boolean
  caption: string
}

// as linhas de conteúdo são só exemplo (4); quem usa monta quantas precisar
function StoryTable({ columns: count = 4, showHeader = true, showFooter = true, showCaption = false, caption = "" }: Partial<TableStoryArgs>) {
  const items = parcelas
  const cols = columns.slice(0, count)
  return (
    <Table>
      {showCaption && <TableCaption>{caption}</TableCaption>}
      {showHeader && (
        <TableHeader>
          <TableRow>
            {cols.map((c) => (
              <TableHead key={c.title} align={c.align}>
                {c.title}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
      )}
      <TableBody>
        {items.map((p) => (
          <TableRow key={p.numero}>
            {cols.map((c) => (
              <TableCell key={c.title} align={c.align}>
                {c.cell(p)}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
      {showFooter && (
        <TableFooter>
          <TableRow>
            {cols.map((c, i) => (
              <TableCell key={c.title} align={c.align}>
                {i === 0 ? "Total" : c.total?.(items)}
              </TableCell>
            ))}
          </TableRow>
        </TableFooter>
      )}
    </Table>
  )
}

const meta = {
  title: "Components/Table/Table",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Dados em linhas e colunas para comparar e consultar.",
      },
    },
  },
  args: { columns: 4, showHeader: true, showFooter: true, showCaption: false, caption: "Parcelas do contrato 4821" },
  argTypes: {
    columns: { name: "Columns", control: { type: "range", min: 1, max: 7, step: 1 } },
    showHeader: { name: "Header", control: "boolean", table: { category: "Parts" } },
    showFooter: { name: "Footer", control: "boolean", table: { category: "Parts" } },
    showCaption: { name: "Caption", control: "boolean", table: { category: "Parts" } },
    caption: { name: "Caption · content", control: "text", if: { arg: "showCaption" }, table: { category: "Parts" } },
  },
  render: (args) => <StoryTable {...args} />,
} satisfies Meta<TableStoryArgs>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

// Todas as partes e colunas.
export const Full: Story = { args: { columns: 7, showCaption: true } }
