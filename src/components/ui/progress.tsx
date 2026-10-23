import * as React from "react"
import { cn } from "@/lib/utils"
import { Progress as ProgressPrimitive } from "radix-ui"

// Barra de progresso de 0 a 100. Contexto opcional no fim da barra, à direita, para não ser só a barra:
// porcentagem (showValue: "10%") ou etapas (steps: "3 de 5"; com as duas, valem as etapas).
// Os textos são visuais; o leitor de tela recebe o valor pela própria barra.
function Progress({
  className,
  value,
  showValue = false,
  steps,
  ...props
}: React.ComponentProps<typeof ProgressPrimitive.Root> & {
  /** Mostra a porcentagem no fim da barra (ex.: 10%). */
  showValue?: boolean
  /** Mostra as etapas no fim da barra (ex.: 3 de 5); sem value, a barra segue a conta. */
  steps?: { current: number; total: number }
}) {
  const stepTotal = steps ? Math.max(1, Math.floor(steps.total) || 1) : 0
  const stepCurrent = steps ? Math.min(Math.max(Math.floor(steps.current) || 0, 0), stepTotal) : 0
  const stepsText = steps ? `${stepCurrent} de ${stepTotal}` : ""
  const percent = Math.min(Math.max(value ?? (steps ? (stepCurrent / stepTotal) * 100 : 0), 0), 100)
  const hasContext = showValue || Boolean(steps)

  const bar = (
    <ProgressPrimitive.Root
      data-slot="progress"
      value={percent}
      getValueLabel={steps ? () => stepsText : undefined}
      className={cn(
        "relative flex h-[6px] w-full items-center overflow-x-hidden rounded-pill bg-background-4",
        !hasContext && className
      )}
      {...props}
    >
      <ProgressPrimitive.Indicator
        data-slot="progress-indicator"
        // em 0% a barra fica fora da área visível, mas o arredondamento da borda deixava um fio aparecer
        className={cn("size-full flex-1 bg-link-1 transition-all", !percent && "invisible")}
        style={{ transform: `translateX(-${100 - percent}%)` }}
      />
    </ProgressPrimitive.Root>
  )
  if (!hasContext) return bar

  return (
    // o contexto fica no fim da barra, à direita: as etapas (3 de 5) ou a porcentagem (10%)
    <div data-slot="progress-field" className={cn("flex w-full items-center gap-sm", className)}>
      {bar}
      <span
        aria-hidden
        className={cn(
          "shrink-0 text-right typo-body-sm-regular text-text-3 tabular-nums",
          // porcentagem com largura fixa (cabe 100 por cento): a barra tem sempre o mesmo comprimento
          !steps && "min-w-[32px]"
        )}
      >
        {steps ? stepsText : `${Math.round(percent)}%`}
      </span>
    </div>
  )
}

export { Progress }
