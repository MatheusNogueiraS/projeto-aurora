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
  { numero: "1/12", vencimento: "10/11/2026", valor: "R$ 250,00", status: "Pago" },
  { numero: "2/12", vencimento: "10/12/2026", valor: "R$ 250,00", status: "Pendente" },
  { numero: "3/12", vencimento: "10/01/2027", valor: "R$ 250,00", status: "Pendente" },
]

const meta = {
  title: "Componentes/Table",
  component: Table,
  tags: ["autodocs"],
  parameters: { docs: { description: { component: "Dados em linhas e colunas para comparar e consultar." } } },
} satisfies Meta<typeof Table>

export default meta
type Story = StoryObj<typeof meta>

export const Completa: Story = {
  render: () => (
    <Table>
      <TableCaption>Parcelas do contrato 4821</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Parcela</TableHead>
          <TableHead>Vencimento</TableHead>
          <TableHead>Valor</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {parcelas.map((p, i) => (
          <TableRow key={p.numero} data-state={i === 0 ? "selected" : undefined}>
            <TableCell>{p.numero}</TableCell>
            <TableCell>{p.vencimento}</TableCell>
            <TableCell>{p.valor}</TableCell>
            <TableCell>
              <Badge variant={p.status === "Pago" ? "default" : "outline"}>{p.status}</Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell colSpan={2}>Total</TableCell>
          <TableCell colSpan={2}>R$ 750,00</TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  ),
}
