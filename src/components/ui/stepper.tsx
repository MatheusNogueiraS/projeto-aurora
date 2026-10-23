import * as React from "react"
import { CheckIcon, XIcon } from "lucide-react"
import { cn } from "@/lib/utils"

import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

// Stepper: mostra as etapas de um processo e em qual delas se está, como um andamento ou
// histórico (complemento do Breadcrumb, que é navegação). Referências: GWStepper do Genesis
// (círculo de 24px, texto em Lato, linha de 2px que fica verde quando a etapa termina),
// Steps do Design System CB e os steppers de mercado (MUI, Carbon, Ant, Atlassian): estados
// concluída, atual, pendente e com erro; horizontal ou vertical; descrição opcional.
// Montado com o que já temos: o círculo é o nosso Badge (só o círculo) e a linha é o Separator.

type StepStatus = "complete" | "current" | "upcoming" | "error"
type StepperSize = "sm" | "default"

const StepperContext = React.createContext<{ orientation: "horizontal" | "vertical"; size: StepperSize }>({
  orientation: "horizontal",
  size: "default",
})

// texto para o leitor de tela, já que o estado aparece por cor e ícone
const statusText: Record<StepStatus, string> = {
  complete: "concluída",
  current: "etapa atual",
  upcoming: "pendente",
  error: "com erro",
}

function Stepper({
  className,
  orientation = "horizontal",
  size = "default",
  ...props
}: React.ComponentProps<"ol"> & { orientation?: "horizontal" | "vertical"; size?: StepperSize }) {
  return (
    <StepperContext.Provider value={{ orientation, size }}>
      <ol
        data-slot="stepper"
        data-orientation={orientation}
        data-size={size}
        className={cn("group/stepper flex w-full", orientation === "vertical" ? "flex-col" : "items-start", className)}
        {...props}
      />
    </StepperContext.Provider>
  )
}

type StepperItemProps = Omit<React.ComponentProps<"li">, "title"> & {
  /** Número da etapa (aparece no círculo das etapas atual e pendentes). */
  step: number
  /** Nome da etapa. */
  title: React.ReactNode
  /** Texto de apoio embaixo do nome (ex.: data, responsável, detalhe). */
  description?: React.ReactNode
  status?: StepStatus
}

function StepperItem({ className, step, title, description, status = "upcoming", ...props }: StepperItemProps) {
  const { orientation, size } = React.useContext(StepperContext)
  const vertical = orientation === "vertical"
  // círculo: o Badge (lg no default, default no sm); concluída e com erro mostram ícone, as outras o número
  const badgeSize = size === "sm" ? "default" : "lg"
  const circle = size === "sm" ? "size-[20px]" : "size-[27px]"
  const indicator =
    status === "complete" ? (
      <Badge variant="success" size={badgeSize} iconLeading={CheckIcon} aria-hidden />
    ) : status === "error" ? (
      <Badge variant="destructive" size={badgeSize} iconLeading={XIcon} aria-hidden />
    ) : (
      <Badge
        variant={status === "current" ? "primary" : "outline"}
        size={badgeSize}
        aria-hidden
        className={cn(circle, "p-none tabular-nums", status === "current" ? "typo-body-sm-bold" : "text-text-3")}
      >
        {step}
      </Badge>
    )
  // linha até a próxima etapa: verde depois de uma etapa concluída (some na última)
  const connector = (
    <Separator
      orientation={vertical ? "vertical" : "horizontal"}
      className={cn(
        "group-last/step:hidden",
        // o Separator estica na vertical (data-vertical:self-stretch); aqui ele fica no centro do círculo
        vertical ? "my-xs w-[2px] min-h-[16px] flex-1 data-vertical:self-center" : "h-[2px] min-w-[8px] flex-1",
        status === "complete" && "bg-alerts-1"
      )}
    />
  )
  const text = (
    <div className={cn("flex min-w-[0px] flex-col gap-xxs", vertical ? "pb-lg group-last/step:pb-none" : "pr-sm")}>
      <span
        className={cn(
          size === "sm" ? "typo-body-sm-regular" : "typo-body-md-regular",
          status === "current" && (size === "sm" ? "typo-body-sm-bold" : "typo-body-md-bold"),
          status === "upcoming" ? "text-text-3" : status === "error" ? "text-alerts-7" : "text-text-1"
        )}
      >
        {title}
        <span className="sr-only">, {statusText[status]}</span>
      </span>
      {description != null && description !== "" && <span className="typo-body-sm-regular text-text-3">{description}</span>}
    </div>
  )

  return (
    <li
      data-slot="stepper-item"
      data-status={status}
      aria-current={status === "current" ? "step" : undefined}
      className={cn(
        "group/step",
        vertical ? "grid grid-cols-[auto_1fr] gap-x-sm" : "flex min-w-[0px] flex-1 flex-col gap-xs",
        className
      )}
      {...props}
    >
      {vertical ? (
        <>
          <div className="flex flex-col items-center">
            {indicator}
            {connector}
          </div>
          {text}
        </>
      ) : (
        <>
          {/* círculo e linha em cima; nome embaixo. Cada etapa ocupa a mesma largura, e em espaço
              curto o nome quebra linha em vez de empurrar as etapas para fora da tela */}
          <div className="flex items-center gap-xs">
            {indicator}
            {connector}
          </div>
          {text}
        </>
      )}
    </li>
  )
}

export { Stepper, StepperItem }
export type { StepStatus }
