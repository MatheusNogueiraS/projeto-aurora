import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { Toggle as TogglePrimitive } from "radix-ui"

const toggleVariants = cva(
  "group/toggle inline-flex items-center justify-center gap-xs rounded-sm typo-body-md-regular whitespace-nowrap transition-[color,box-shadow] outline-none hover:bg-background-4 hover:text-text-1 focus-visible:border-focus focus-visible:ring-(length:--aurora-stroke-focus) focus-visible:ring-focus/focus-ring disabled:pointer-events-none disabled:opacity-disabled aria-invalid:border-invalid aria-invalid:ring-invalid/invalid-ring aria-pressed:bg-background-4 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-[16px]",
  {
    variants: {
      variant: {
        default: "bg-transparent",
        outline: "border-default border-field bg-transparent shadow-s hover:bg-background-4",
      },
      size: {
        default:
          "min-h-[37px] min-w-[37px] px-md py-sm has-data-[icon=inline-end]:pr-sm has-data-[icon=inline-start]:pl-sm",
        sm: "min-h-[29px] min-w-[29px] px-md py-xs has-data-[icon=inline-end]:pr-sm has-data-[icon=inline-start]:pl-sm",
        lg: "min-h-[45px] min-w-[45px] px-md py-md has-data-[icon=inline-end]:pr-sm has-data-[icon=inline-start]:pl-sm",
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
