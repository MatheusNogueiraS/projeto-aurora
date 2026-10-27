import * as React from "react"
import { cn } from "@/lib/utils"

// Data Line: uma linha "rótulo → valor", para tabelas de preço e resumos (parcelas, taxa, CET…).
// É a unidade: para montar uma tabela, empilhe quantas linhas quiser (divisória só entre elas).
// Inspirado no Data Line do Design System CB e no InfoLine do Genesis; construção própria.
//
// Encaixe de espaço: grid de duas colunas automáticas. O espaço é dividido por igual até cada lado
// caber inteiro, então só quebra linha o lado que realmente não cabe; se um lado é curto, o outro
// fica com o resto. Palavras maiores que a coluna quebram dentro dela (wrap-anywhere), nunca
// passando por cima do outro lado.

type DataLineSize = "sm" | "default" | "lg"

// estilos por tamanho, na escala dos componentes que exibem informação (sm 12px, default 14px, lg 16px);
// o destaque (ex.: total a pagar) deixa o rótulo em negrito e sobe o valor um passo
const labelStyle = {
  sm: cn("typo-body-sm-regular"),
  default: cn("typo-body-md-regular"),
  lg: cn("typo-body-lg-regular"),
}
const labelEmphasisStyle = {
  sm: cn("typo-body-sm-bold"),
  default: cn("typo-body-md-bold"),
  lg: cn("typo-body-lg-bold"),
}
const valueStyle = {
  sm: cn("typo-body-sm-bold"),
  default: cn("typo-body-md-bold"),
  lg: cn("typo-body-lg-bold"),
}
const valueEmphasisStyle = {
  sm: cn("typo-body-md-bold"),
  default: cn("typo-body-lg-bold"),
  lg: cn("typo-body-xl-bold"),
}

// texto vazio (ex.: campo em branco vindo do sistema) conta como "sem conteúdo"
const filled = (node: React.ReactNode) => node != null && node !== false && node !== ""

type DataLineProps = Omit<React.ComponentProps<"dl">, "children"> & {
  /** Nome do dado, à esquerda (ex.: "Parcelas"). */
  label: React.ReactNode
  /** Complemento do rótulo, embaixo dele (ex.: "ao mês"). */
  context?: React.ReactNode
  /** Valor, à direita (ex.: "84x de R$ 42,38"). */
  value?: React.ReactNode
  /** Complemento do valor, ao lado dele (ex.: "(0,00%)"). Só aparece junto com o valor. */
  support?: React.ReactNode
  /** Informação embaixo do valor (ex.: "Total R$ 3.559,92"). */
  description?: React.ReactNode
  size?: DataLineSize
  /** Linha de destaque, como o total a pagar: rótulo em negrito e valor maior. */
  emphasis?: boolean
  /** Linha embaixo, para separar das linhas seguintes (some na última linha empilhada). */
  divider?: boolean
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
  divider = true,
  ...props
}: DataLineProps) {
  const hasValue = filled(value)
  const hasDescription = filled(description)
  const hasRight = hasValue || hasDescription

  // cada linha é uma lista de definição (dl): o leitor de tela liga o rótulo ao valor
  return (
    <dl
      data-slot="data-line"
      data-size={size}
      data-emphasis={emphasis || undefined}
      className={cn(
        "grid w-full grid-cols-[auto_auto] items-start justify-between gap-x-lg py-md",
        divider && "border-b-default [&:last-child:not(:only-child)]:border-b-(length:--aurora-stroke-none)",
        className
      )}
      {...props}
    >
      <dt className={cn("flex min-w-[0px] flex-col gap-xxs wrap-anywhere", !hasRight && "col-span-2")}>
        <span className={cn(emphasis ? labelEmphasisStyle[size] : labelStyle[size], emphasis ? "text-text-1" : "text-text-2")}>
          {label}
        </span>
        {filled(context) && <span className="typo-body-sm-regular text-text-3">{context}</span>}
      </dt>
      {hasRight && (
        <dd className="flex min-w-[0px] flex-col items-end gap-xxs text-right wrap-anywhere">
          {hasValue && (
            <span className="flex max-w-full flex-wrap items-baseline justify-end gap-x-xs">
              <span className={cn(emphasis ? valueEmphasisStyle[size] : valueStyle[size], "min-w-[0px] text-balance text-text-1 tabular-nums")}>
                {value}
              </span>
              {filled(support) && <span className="min-w-[0px] typo-body-sm-regular text-text-3 tabular-nums">{support}</span>}
            </span>
          )}
          {hasDescription && <span className="max-w-full typo-body-sm-regular text-text-3 tabular-nums">{description}</span>}
        </dd>
      )}
    </dl>
  )
}

export { DataLine }
