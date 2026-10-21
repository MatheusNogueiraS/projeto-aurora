import type { Meta, StoryObj } from "@storybook/react-vite"

import { Badge } from "@/components/ui/badge"
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

const parcelas = [
  { numero: "1/5", vencimento: "10/11/2026", valor: 250, status: "Pago" },
  { numero: "2/5", vencimento: "10/12/2026", valor: 250, status: "Pendente" },
  { numero: "3/5", vencimento: "10/01/2027", valor: 250, status: "Pendente" },
  { numero: "4/5", vencimento: "10/02/2027", valor: 250, status: "Pendente" },
  { numero: "5/5", vencimento: "10/03/2027", valor: 250, status: "Pendente" },
]
const real = (n: number) => n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })

// Controles no padrão do painel do Figma: quantidade de linhas e partes opcionais.
type TableStoryArgs = { rows: number; showCaption: boolean; caption: string; showFooter: boolean; selectedRow: boolean }

function StoryTable({ rows, showCaption, caption = "", showFooter, selectedRow }: TableStoryArgs) {
  const items = parcelas.slice(0, rows)
  return (
    <Table>
      {showCaption && <TableCaption>{caption}</TableCaption>}
      <TableHeader>
        <TableRow>
          <TableHead>Parcela</TableHead>
          <TableHead>Vencimento</TableHead>
          <TableHead>Valor</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {items.map((p, i) => (
          <TableRow key={p.numero} data-state={selectedRow && i === 0 ? "selected" : undefined}>
            <TableCell>{p.numero}</TableCell>
            <TableCell>{p.vencimento}</TableCell>
            <TableCell>{real(p.valor)}</TableCell>
            <TableCell>
              <Badge variant={p.status === "Pago" ? "default" : "outline"}>{p.status}</Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
      {showFooter && (
        <TableFooter>
          <TableRow>
            <TableCell colSpan={2}>Total</TableCell>
            <TableCell colSpan={2}>{real(items.reduce((s, p) => s + p.valor, 0))}</TableCell>
          </TableRow>
        </TableFooter>
      )}
    </Table>
  )
}

const meta = {
  title: "Componentes/Table",
  tags: ["autodocs"],
  parameters: { docs: { description: { component: "Dados em linhas e colunas para comparar e consultar." } } },
  args: { rows: 3, showCaption: true, caption: "Parcelas do contrato 4821", showFooter: true, selectedRow: false },
  argTypes: {
    rows: { name: "Linhas", control: { type: "range", min: 1, max: 5, step: 1 }, description: "Quantidade de linhas de dados." },
    showCaption: { name: "Legenda", control: "boolean", description: "Mostra uma legenda abaixo da tabela." },
    caption: { name: "Legenda · conteúdo", control: "text", if: { arg: "showCaption" } },
    showFooter: { name: "Rodapé", control: "boolean", description: "Mostra a linha de total." },
    selectedRow: { name: "Linha selecionada", control: "boolean", description: "Destaca a primeira linha.", table: { category: "Estado" } },
  },
  render: (args) => <StoryTable {...args} />,
} satisfies Meta<TableStoryArgs>

export default meta
type Story = StoryObj<typeof meta>

export const Padrao: Story = { name: "Padrão" }
