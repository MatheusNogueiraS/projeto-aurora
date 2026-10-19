import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { Slot } from "radix-ui"

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-button border-default border-transparent bg-clip-padding typo-button-small whitespace-nowrap transition-all outline-none select-none focus-visible:border-focus focus-visible:ring-(length:--aurora-stroke-focus) focus-visible:ring-focus/focus-ring active:not-aria-[haspopup]:translate-y-hairline disabled:pointer-events-none disabled:text-disabled aria-invalid:border-invalid aria-invalid:ring-(length:--aurora-stroke-focus) aria-invalid:ring-invalid/invalid-ring [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-icon-md",
  {
    variants: {
      variant: {
        default:
          "bg-link-1 text-link-10 hover:bg-link-3 aria-expanded:bg-link-3 disabled:bg-disabled-surface",
        outline:
          "border-link-4 bg-transparent text-link-4 hover:bg-link-5 aria-expanded:bg-link-5 disabled:border-details-1",
        secondary:
          "bg-link-5 text-link-4 hover:bg-link-5/hover aria-expanded:bg-link-5/hover disabled:bg-disabled-surface",
        ghost: "text-link-4 hover:bg-link-5 aria-expanded:bg-link-5",
        destructive:
          "bg-alerts-8 text-alerts-9 hover:bg-alerts-8/hover focus-visible:border-alerts-7/danger-border focus-visible:ring-alerts-7/invalid-ring disabled:bg-disabled-surface",
        link: "text-link-4 underline-offset-(--aurora-underline-offset) hover:underline",
      },
      size: {
        default:
          "h-control-md gap-quark-plus px-xxs typo-button-small-bold in-data-[slot=button-group]:rounded-button has-data-[icon=inline-end]:pr-xxxs has-data-[icon=inline-start]:pl-xxxs",
        xs: "h-control-xs gap-quark px-nano typo-caption in-data-[slot=button-group]:rounded-button has-data-[icon=inline-end]:pr-quark-plus has-data-[icon=inline-start]:pl-quark-plus [&_svg:not([class*='size-'])]:size-icon-xs",
        sm: "h-control-sm gap-quark-plus px-xxxs typo-button-small-bold in-data-[slot=button-group]:rounded-button has-data-[icon=inline-end]:pr-nano has-data-[icon=inline-start]:pl-nano",
        lg: "h-control-lg gap-nano px-xxs typo-button-bold has-data-[icon=inline-end]:pr-xxxs has-data-[icon=inline-start]:pl-xxxs",
        icon: "size-control-md",
        "icon-xs":
          "size-control-xs in-data-[slot=button-group]:rounded-button [&_svg:not([class*='size-'])]:size-icon-xs",
        "icon-sm":
          "size-control-sm in-data-[slot=button-group]:rounded-button",
        "icon-lg": "size-control-lg",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot.Root : "button"

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
