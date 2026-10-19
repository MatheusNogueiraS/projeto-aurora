import * as React from "react"
import { cn } from "@/lib/utils"
import { Checkbox as CheckboxPrimitive } from "radix-ui"
import { CheckIcon } from "lucide-react"

function Checkbox({
  className,
  ...props
}: React.ComponentProps<typeof CheckboxPrimitive.Root>) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(
        "peer relative flex size-icon-md shrink-0 items-center justify-center rounded-checkbox border-default border-field shadow-s transition-shadow outline-none group-has-disabled/field:opacity-disabled group-has-[:focus-visible]/field-label:ring-(length:--aurora-stroke-none) group-has-[:focus-visible]/field-label:not-data-checked:border-field after:absolute after:-inset-x-xxxs after:-inset-y-nano focus-visible:border-focus focus-visible:ring-(length:--aurora-stroke-focus) focus-visible:ring-focus/focus-ring disabled:cursor-not-allowed disabled:opacity-disabled aria-invalid:border-invalid aria-invalid:ring-(length:--aurora-stroke-focus) aria-invalid:ring-invalid/invalid-ring aria-invalid:aria-checked:border-link-1 data-checked:border-link-1 data-checked:bg-link-1 data-checked:text-link-10 group-has-[:focus-visible]/field-label:data-checked:border-link-1",
        className
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        className="grid place-content-center text-current transition-none [&>svg]:size-icon-sm"
      >
        <CheckIcon
        />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  )
}

export { Checkbox }
