import { EllipsisVerticalIcon } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { IconButton } from "@/components/ui/icon-button"

// Dados e colunas de exemplo das páginas da Table (Linha e Tabela usam as mesmas).
// 4 parcelas de exemplo, a primeira paga
export const parcelas = ["10/11/2026", "10/12/2026", "10/01/2027", "10/02/2027"].map((vencimento, i) => ({
  numero: `${i + 1}/4`,
  contrato: "4821",
  cliente: "Maria Souza",
  vencimento,
  valor: 250,
  status: i === 0 ? "Pago" : "Pendente",
}))
type Parcela = (typeof parcelas)[number]

export const real = (n: number) => n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })

type Column = {
  title: string
  align?: "right"
  cell: (p: Parcela) => React.ReactNode
  /** Valor no rodapé (o total), quando a coluna tem um. */
  total?: (items: Parcela[]) => React.ReactNode
}

export const columns: Column[] = [
  { title: "Parcela", cell: (p) => p.numero },
  { title: "Cliente", cell: (p) => p.cliente },
  { title: "Vencimento", cell: (p) => p.vencimento },
  { title: "Valor", align: "right", cell: (p) => real(p.valor), total: (items) => real(items.reduce((s, p) => s + p.valor, 0)) },
  { title: "Status", cell: (p) => <Badge variant={p.status === "Pago" ? "success" : "default"}>{p.status}</Badge> },
  { title: "Contrato", cell: (p) => p.contrato },
  {
    title: "Ações",
    align: "right",
    cell: (p) => (
      <IconButton variant="ghost" size="sm" aria-label={`Mais ações da parcela ${p.numero}`}>
        <EllipsisVerticalIcon />
      </IconButton>
    ),
  },
]
