import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { Toggle as TogglePrimitive } from "radix-ui"

const toggleVariants = cva(
  "group/toggle inline-flex items-center justify-center gap-quark rounded-toggle typo-button-small whitespace-nowrap transition-[color,box-shadow] outline-none hover:bg-background-4 hover:text-text-1 focus-visible:border-focus focus-visible:ring-(length:--aurora-stroke-focus) focus-visible:ring-focus/focus-ring disabled:pointer-events-none disabled:opacity-disabled aria-invalid:border-invalid aria-invalid:ring-invalid/invalid-ring aria-pressed:bg-background-4 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-icon-md",
  {
    variants: {
      variant: {
        default: "bg-transparent",
        outline: "border-default border-field bg-transparent shadow-s hover:bg-background-4",
      },
      size: {
        default:
          "h-control-md min-w-control-md px-nano-plus has-data-[icon=inline-end]:pr-nano has-data-[icon=inline-start]:pl-nano",
        sm: "h-control-sm min-w-control-sm px-nano-plus has-data-[icon=inline-end]:pr-quark-plus has-data-[icon=inline-start]:pl-quark-plus",
        lg: "h-control-lg min-w-control-lg px-nano-plus has-data-[icon=inline-end]:pr-nano has-data-[icon=inline-start]:pl-nano",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Toggle({
  className,
  variant = "default",
  size = "default",
  ...props
}: React.ComponentProps<typeof TogglePrimitive.Root> &
  VariantProps<typeof toggleVariants>) {
  return (
    <TogglePrimitive.Root
      data-slot="toggle"
      className={cn(toggleVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Toggle, toggleVariants }
