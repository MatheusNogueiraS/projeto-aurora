import * as React from "react"
import { cn } from "@/lib/utils"

// Data Line: uma linha "rótulo → valor", para tabelas de preço e resumos (parcelas, taxa, CET…).
// Inspirado no Data Line do Design System CB e no InfoLine do Genesis; construção própria.
//
// Encaixe de espaço: grid de duas colunas automáticas. Cada lado começa com o mínimo (a maior
// palavra) e o espaço que sobra é dividido por igual até cada lado caber inteiro. Assim só quebra
// linha o lado que realmente não cabe; se um lado é curto, o outro fica com o resto.

type DataLineSize = "sm" | "default" | "lg"

// Fora de um DataList a linha vira a própria lista de definição (dl), para o leitor de tela
// sempre ligar o rótulo ao valor.
const DataListContext = React.createContext(false)

// Várias linhas, com divisória só entre elas (opcional).
function DataList({
  className,
  divided = true,
  ...props
}: React.ComponentProps<"dl"> & { divided?: boolean }) {
  return (
    <DataListContext.Provider value>
      <dl
        data-slot="data-list"
        data-divided={divided || undefined}
        className={cn(
          "flex w-full flex-col",
          divided ? "divide-y divide-divider *:py-md *:first:pt-none *:last:pb-none" : "gap-md",
          className
        )}
        {...props}
      />
    </DataListContext.Provider>
  )
}

// estilos por tamanho; a variante "destaque" (ex.: total a pagar) sobe o valor um passo
const labelStyle = {
  sm: cn("typo-body-md-regular"),
  default: cn("typo-body-lg-regular"),
  lg: cn("typo-body-xl-regular"),
}
const labelEmphasisStyle = {
  sm: cn("typo-body-md-bold"),
  default: cn("typo-body-lg-bold"),
  lg: cn("typo-body-xl-bold"),
}
const valueStyle = {
  sm: cn("typo-body-md-bold"),
  default: cn("typo-body-lg-bold"),
  lg: cn("typo-body-xl-bold"),
}
const valueEmphasisStyle = {
  sm: cn("typo-body-lg-bold"),
  default: cn("typo-body-xl-bold"),
  lg: cn("typo-heading-6"),
}

// sem ref: a raiz pode ser div (dentro do DataList) ou dl (sozinha)
type DataLineProps = Omit<React.ComponentProps<"div">, "children" | "ref"> & {
  /** Nome do dado, à esquerda (ex.: "Parcelas"). */
  label: React.ReactNode
  /** Complemento do rótulo, embaixo dele (ex.: "ao mês"). */
  context?: React.ReactNode
  /** Valor, à direita (ex.: "84x de R$ 42,38"). */
  value?: React.ReactNode
  /** Complemento do valor, ao lado dele (ex.: "(0,00%)"). */
  support?: React.ReactNode
  /** Informação embaixo do valor (ex.: "Total R$ 3.559,92"). */
  description?: React.ReactNode
  size?: DataLineSize
  /** Linha de destaque, como o total a pagar: rótulo em negrito e valor maior. */
  emphasis?: boolean
}

function DataLine({
  className,
  label,
  context,
  value,
  support,
  description,
  size = "default",
  emphasis = false,
  ...props
}: DataLineProps) {
  const inList = React.useContext(DataListContext)
  // os atributos aceitos pelos dois são os mesmos; o tipo fica o de div
  const Root = (inList ? "div" : "dl") as "div"
  const hasRight = value != null || description != null

  return (
    <Root
      data-slot="data-line"
      data-size={size}
      data-emphasis={emphasis || undefined}
      className={cn("grid w-full grid-cols-[auto_auto] items-start justify-between gap-x-lg", className)}
      {...props}
    >
      <dt className={cn("flex min-w-[0px] flex-col gap-xxs", !hasRight && "col-span-2")}>
        <span className={cn(emphasis ? labelEmphasisStyle[size] : labelStyle[size], emphasis ? "text-text-1" : "text-text-2")}>
          {label}
        </span>
        {context != null && <span className="typo-body-sm-regular text-text-3">{context}</span>}
      </dt>
      {hasRight && (
        <dd className="flex min-w-[0px] flex-col items-end gap-xxs text-right">
          {value != null && (
            <span className="flex flex-wrap items-baseline justify-end gap-x-xs">
              <span className={cn(emphasis ? valueEmphasisStyle[size] : valueStyle[size], "text-balance text-text-1 tabular-nums")}>
                {value}
              </span>
              {support != null && <span className="typo-body-sm-regular text-text-3 tabular-nums">{support}</span>}
            </span>
          )}
          {description != null && <span className="typo-body-sm-regular text-text-3 tabular-nums">{description}</span>}
        </dd>
      )}
    </Root>
  )
}

export { DataLine, DataList }
