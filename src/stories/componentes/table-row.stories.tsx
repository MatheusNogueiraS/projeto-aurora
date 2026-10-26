import type { Meta, StoryObj } from "@storybook/react-vite"

import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table"

import { columns, parcelas } from "./table-example"

// A linha é um slot: recebe quantas Células precisar (ver Table/Célula) e é dona do divisor
// (a linha de baixo), do hover e da seleção, que pegam a linha toda. Três tipos, um para cada
// parte da tabela. As colunas são só exemplos de conteúdo.
type RowStoryArgs = {
  type: "header" | "body" | "footer"
  columns: number
  selected: boolean
}

// controles escondidos não chegam até aqui, por isso os padrões
function StoryRow({ type = "body", columns: count = 4, selected = false }: Partial<RowStoryArgs>) {
  const cols = columns.slice(0, count)
  return (
    // colunas de largura igual, para as linhas soltas das Variantes ficarem alinhadas; a largura
    // mínima faz a linha rolar para o lado em tela estreita, em vez de apertar as colunas
    <Table className="min-w-[640px] table-fixed">
      {type === "header" && (
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
      {type === "body" && (
        <TableBody>
          <TableRow data-state={selected ? "selected" : undefined}>
            {cols.map((c) => (
              <TableCell key={c.title} align={c.align}>
                {c.cell(parcelas[0])}
              </TableCell>
            ))}
          </TableRow>
          {/* na tabela, a última linha do conteúdo não tem divisor; esta linha vazia faz a de
              cima aparecer como uma linha do meio, com o divisor */}
          <tr aria-hidden />
        </TableBody>
      )}
      {type === "footer" && (
        <TableFooter>
          <TableRow>
            {cols.map((c, i) => (
              <TableCell key={c.title} align={c.align}>
                {i === 0 ? "Total" : c.total?.(parcelas)}
              </TableCell>
            ))}
          </TableRow>
        </TableFooter>
      )}
    </Table>
  )
}

const meta = {
  title: "Components/Table/Row",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Junta as células de uma linha; é dela o divisor, o hover e a seleção.",
      },
    },
  },
  args: { type: "body", columns: 4, selected: false },
  argTypes: {
    type: { name: "Type", control: "inline-radio", options: ["header", "body", "footer"] },
    columns: { name: "Columns", control: { type: "range", min: 1, max: 7, step: 1 } },
    selected: { name: "Selected", control: "boolean", if: { arg: "type", eq: "body" }, table: { category: "State" } },
  },
  render: (args) => <StoryRow {...args} />,
} satisfies Meta<RowStoryArgs>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

// Os tipos de linha, na ordem em que aparecem na tabela.
export const Variants: Story = {
  render: (args) => (
    <div className="flex flex-col gap-xl">
      <StoryRow {...args} type="header" />
      <StoryRow {...args} type="body" selected={false} />
      <StoryRow {...args} type="body" selected />
      <StoryRow {...args} type="footer" />
    </div>
  ),
}
