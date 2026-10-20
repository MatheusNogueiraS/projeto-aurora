import * as React from "react"
import { cn } from "@/lib/utils"
import { Switch as SwitchPrimitive } from "radix-ui"

function Switch({
  className,
  size = "default",
  ...props
}: React.ComponentProps<typeof SwitchPrimitive.Root> & {
  size?: "sm" | "default"
}) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      data-size={size}
      className={cn(
        "peer group/switch relative inline-flex shrink-0 items-center rounded-pill border-default border-transparent shadow-s transition-all outline-none group-has-[:focus-visible]/field-label:border-transparent group-has-[:focus-visible]/field-label:ring-(length:--aurora-stroke-none) after:absolute after:-inset-x-md after:-inset-y-sm focus-visible:border-focus focus-visible:ring-(length:--aurora-stroke-focus) focus-visible:ring-focus/focus-ring aria-invalid:border-invalid aria-invalid:ring-(length:--aurora-stroke-focus) aria-invalid:ring-invalid/invalid-ring data-[size=default]:h-[18px] data-[size=default]:w-[32px] data-[size=sm]:h-[14px] data-[size=sm]:w-[24px] data-checked:bg-link-1 data-unchecked:bg-details-2 data-disabled:cursor-not-allowed data-disabled:opacity-disabled",
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
}

export { Switch }
