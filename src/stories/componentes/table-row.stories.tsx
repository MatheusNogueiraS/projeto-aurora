import type { Meta, StoryObj } from "@storybook/react-vite"

import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table"

import { columns, parcelas } from "./table-example"

// A linha é um slot: recebe quantas Células precisar (ver Table/Célula) e é dona do divisor
// (a linha de baixo), do hover e da seleção, que pegam a linha toda. Três tipos, um para cada
// parte da tabela. As colunas são só exemplos de conteúdo.
type RowStoryArgs = {
  type: "Cabeçalho" | "Conteúdo" | "Rodapé"
  columns: number
  selected: boolean
}

// controles escondidos não chegam até aqui, por isso os padrões
function StoryRow({ type = "Conteúdo", columns: count = 4, selected = false }: Partial<RowStoryArgs>) {
  const cols = columns.slice(0, count)
  return (
    // colunas de largura igual, para as linhas soltas das Variantes ficarem alinhadas; a largura
    // mínima faz a linha rolar para o lado em tela estreita, em vez de apertar as colunas
    <Table className="min-w-[640px] table-fixed">
      {type === "Cabeçalho" && (
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
      {type === "Conteúdo" && (
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
      {type === "Rodapé" && (
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
  title: "Componentes/Table/Linha",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Junta as **Células** de uma linha, em qualquer quantidade (é um slot). É dela o divisor (a linha de baixo), o hover (passe o mouse) e a seleção, que pegam a linha toda. Tipos: cabeçalho, conteúdo e rodapé (total).",
      },
    },
  },
  args: { type: "Conteúdo", columns: 4, selected: false },
  argTypes: {
    type: { name: "Tipo", control: "inline-radio", options: ["Cabeçalho", "Conteúdo", "Rodapé"], description: "Títulos das colunas, dados ou total." },
    columns: { name: "Colunas", control: { type: "range", min: 1, max: 7, step: 1 }, description: "Quantidade de células na linha." },
    selected: { name: "Selecionada", control: "boolean", description: "Destaca a linha (ex.: marcada pela seleção).", if: { arg: "type", eq: "Conteúdo" }, table: { category: "Estado" } },
  },
  render: (args) => <StoryRow {...args} />,
} satisfies Meta<RowStoryArgs>

export default meta
type Story = StoryObj<typeof meta>

export const Padrao: Story = { name: "Padrão" }

// Os tipos de linha, na ordem em que aparecem na tabela.
export const Variantes: Story = {
  render: (args) => (
    <div className="flex flex-col gap-xl">
      <StoryRow {...args} type="Cabeçalho" />
      <StoryRow {...args} type="Conteúdo" selected={false} />
      <StoryRow {...args} type="Conteúdo" selected />
      <StoryRow {...args} type="Rodapé" />
    </div>
  ),
}
