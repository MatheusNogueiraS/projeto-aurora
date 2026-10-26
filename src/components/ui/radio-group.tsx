import * as React from "react"
import { cn } from "@/lib/utils"
import { RadioGroup as RadioGroupPrimitive } from "radix-ui"

function RadioGroup({
  className,
  ...props
}: React.ComponentProps<typeof RadioGroupPrimitive.Root>) {
  return (
    <RadioGroupPrimitive.Root
      data-slot="radio-group"
      className={cn("group/radio-group grid w-full gap-md", className)}
      {...props}
    />
  )
}

// Item com texto e descrição opcionais, como no Checkbox. Hover: borda roxa desmarcado,
// laranja mais escuro marcado. Erro só aparece habilitado e enquanto nenhuma opção do grupo
// foi escolhida (escolha obrigatória); desabilitado nunca fica em erro.
function RadioGroupItem({
  className,
  label,
  description,
  ...props
}: React.ComponentProps<typeof RadioGroupPrimitive.Item> & {
  /** Texto ao lado. Sem ele, aparece só o controle. */
  label?: React.ReactNode
  /** Texto de apoio abaixo do label. */
  description?: React.ReactNode
}) {
  const control = (
    <RadioGroupPrimitive.Item
      data-slot="radio-group-item"
      className={cn(
        "group/radio-group-item peer relative flex aspect-square size-[16px] shrink-0 rounded-pill border-default border-field outline-none group-has-[:focus-visible]/field-label:ring-(length:--aurora-stroke-none) group-has-[:focus-visible]/field-label:not-data-checked:border-field after:absolute after:-inset-x-md after:-inset-y-sm focus-visible:border-focus focus-visible:ring-(length:--aurora-stroke-focus) focus-visible:ring-focus/md disabled:cursor-not-allowed disabled:opacity-md data-checked:border-link-1 data-checked:bg-link-1 data-checked:text-link-10 group-has-[:focus-visible]/field-label:data-checked:border-link-1 enabled:not-focus-visible:hover:border-link-4 enabled:not-focus-visible:group-hover/radio-field:border-link-4 data-checked:enabled:hover:border-link-3 data-checked:enabled:hover:bg-link-3 data-checked:enabled:group-hover/radio-field:border-link-3 data-checked:enabled:group-hover/radio-field:bg-link-3",
        "not-group-has-[[data-state=checked]]/radio-group:aria-invalid:enabled:border-invalid not-group-has-[[data-state=checked]]/radio-group:aria-invalid:enabled:ring-(length:--aurora-stroke-focus) not-group-has-[[data-state=checked]]/radio-group:aria-invalid:enabled:ring-invalid/xs",
        (label || description) && "mt-xxs",
        className
      )}
      {...props}
    >
      <RadioGroupPrimitive.Indicator
        data-slot="radio-group-indicator"
        className="flex size-[16px] items-center justify-center"
      >
        <span className="absolute top-1/2 left-1/2 size-[8px] -translate-x-1/2 -translate-y-1/2 rounded-pill bg-link-10" />
      </RadioGroupPrimitive.Indicator>
    </RadioGroupPrimitive.Item>
  )

  if (!label && !description) return control

  return (
    <label
      data-slot="radio-field"
      className="group/radio-field flex w-fit items-start gap-sm text-text-1 has-disabled:cursor-not-allowed"
    >
      {control}
      <span className="flex flex-col group-has-disabled/radio-field:opacity-md">
        {label && <span className="typo-body-md-regular">{label}</span>}
        {description && (
          <span className="typo-body-sm-regular text-text-3 not-group-has-[[data-state=checked]]/radio-group:group-has-[[aria-invalid=true]:enabled]/radio-field:text-alerts-7">
            {description}
          </span>
        )}
      </span>
    </label>
  )
}

export { RadioGroup, RadioGroupItem }
