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
      className={cn("grid w-full gap-xxxs", className)}
      {...props}
    />
  )
}

function RadioGroupItem({
  className,
  ...props
}: React.ComponentProps<typeof RadioGroupPrimitive.Item>) {
  return (
    <RadioGroupPrimitive.Item
      data-slot="radio-group-item"
      className={cn(
        "group/radio-group-item peer relative flex aspect-square size-icon-md shrink-0 rounded-radio border-default border-field outline-none group-has-[:focus-visible]/field-label:ring-(length:--aurora-stroke-none) group-has-[:focus-visible]/field-label:not-data-checked:border-field after:absolute after:-inset-x-xxxs after:-inset-y-nano focus-visible:border-focus focus-visible:ring-(length:--aurora-stroke-focus) focus-visible:ring-focus/focus-ring disabled:cursor-not-allowed disabled:opacity-disabled aria-invalid:border-invalid aria-invalid:ring-(length:--aurora-stroke-focus) aria-invalid:ring-invalid/invalid-ring aria-invalid:aria-checked:border-link-1 data-checked:border-link-1 data-checked:bg-link-1 data-checked:text-link-10 group-has-[:focus-visible]/field-label:data-checked:border-link-1",
        className
      )}
      {...props}
    >
      <RadioGroupPrimitive.Indicator
        data-slot="radio-group-indicator"
        className="flex size-icon-md items-center justify-center"
      >
        <span className="absolute top-1/2 left-1/2 size-radio-indicator -translate-x-1/2 -translate-y-1/2 rounded-radio bg-link-10" />
      </RadioGroupPrimitive.Indicator>
    </RadioGroupPrimitive.Item>
  )
}

export { RadioGroup, RadioGroupItem }
