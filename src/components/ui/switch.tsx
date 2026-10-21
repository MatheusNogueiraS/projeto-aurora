import * as React from "react"
import { cn } from "@/lib/utils"
import { Switch as SwitchPrimitive } from "radix-ui"

// Texto ao lado (opcional), como no Checkbox: label e descrição abaixo dele.
const switchTextVariants = {
  sm: { label: "typo-body-sm-regular", description: "typo-body-sm-regular" },
  default: { label: "typo-body-md-regular", description: "typo-body-sm-regular" },
} as const

// Hover: desligado escurece o trilho; ligado escurece o laranja (também passando sobre o texto).
// Erro só aparece desligado e habilitado (ex.: aceite obrigatório); desabilitado nunca fica em erro.
function Switch({
  className,
  size = "default",
  label,
  description,
  ...props
}: React.ComponentProps<typeof SwitchPrimitive.Root> & {
  size?: "sm" | "default"
  /** Texto ao lado. Sem ele, aparece só o controle. */
  label?: React.ReactNode
  /** Texto de apoio abaixo do label. */
  description?: React.ReactNode
}) {
  const control = (
    <SwitchPrimitive.Root
      data-slot="switch"
      data-size={size}
      className={cn(
        "peer group/switch relative inline-flex shrink-0 items-center rounded-pill border-default border-transparent shadow-s transition-all outline-none group-has-[:focus-visible]/field-label:border-transparent group-has-[:focus-visible]/field-label:ring-(length:--aurora-stroke-none) after:absolute after:-inset-x-md after:-inset-y-sm focus-visible:border-focus focus-visible:ring-(length:--aurora-stroke-focus) focus-visible:ring-focus/focus-ring aria-invalid:data-unchecked:enabled:border-invalid aria-invalid:data-unchecked:enabled:ring-(length:--aurora-stroke-focus) aria-invalid:data-unchecked:enabled:ring-invalid/invalid-ring data-[size=default]:h-[18px] data-[size=default]:w-[32px] data-[size=sm]:h-[14px] data-[size=sm]:w-[24px] data-checked:bg-link-1 data-unchecked:bg-details-2 data-unchecked:enabled:hover:bg-details-1 data-unchecked:enabled:group-hover/switch-field:bg-details-1 data-checked:enabled:hover:bg-link-3 data-checked:enabled:group-hover/switch-field:bg-link-3 data-disabled:cursor-not-allowed data-disabled:opacity-disabled",
        (label || description) && "mt-xxs",
        className
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className="pointer-events-none block rounded-pill bg-background-5 ring-(length:--aurora-stroke-none) transition-transform group-data-[size=default]/switch:size-[16px] group-data-[size=sm]/switch:size-[12px] group-data-[size=default]/switch:data-checked:translate-x-[calc(100%-2*var(--aurora-stroke-default))] group-data-[size=sm]/switch:data-checked:translate-x-[calc(100%-2*var(--aurora-stroke-default))] group-data-[size=default]/switch:data-unchecked:translate-x-none group-data-[size=sm]/switch:data-unchecked:translate-x-none"
      />
    </SwitchPrimitive.Root>
  )

  if (!label && !description) return control

  const text = switchTextVariants[size]
  return (
    <label
      data-slot="switch-field"
      className="group/switch-field flex w-fit items-start gap-sm text-text-1 has-disabled:cursor-not-allowed"
    >
      {control}
      <span className="flex flex-col group-has-disabled/switch-field:opacity-disabled">
        {label && <span className={text.label}>{label}</span>}
        {description && (
          <span
            className={cn(
              text.description,
              "text-text-3 group-has-[[aria-invalid=true][data-state=unchecked]:enabled]/switch-field:text-alerts-7"
            )}
          >
            {description}
          </span>
        )}
      </span>
    </label>
  )
}

export { Switch }
