import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { Slot } from "radix-ui"

const badgeVariants = cva(
  "group/badge inline-flex h-badge w-fit shrink-0 items-center justify-center gap-quark overflow-hidden rounded-tag border-default border-transparent px-nano py-pico typo-caption whitespace-nowrap transition-all focus-visible:border-focus focus-visible:ring-(length:--aurora-stroke-focus) focus-visible:ring-focus/focus-ring has-data-[icon=inline-end]:pr-quark-plus has-data-[icon=inline-start]:pl-quark-plus aria-invalid:border-invalid aria-invalid:ring-invalid/invalid-ring [&>svg]:pointer-events-none [&>svg]:size-icon-xs!",
  {
    variants: {
      variant: {
        default: "bg-link-1 text-link-10 [a]:hover:bg-link-3",
        secondary: "bg-link-5 text-link-4 [a]:hover:bg-link-5/hover",
        destructive:
          "bg-alerts-8 text-alerts-9 focus-visible:ring-alerts-7/invalid-ring [a]:hover:bg-alerts-8/hover",
        outline:
          "border-divider text-text-1 [a]:hover:bg-background-4 [a]:hover:text-text-3",
        ghost: "hover:bg-background-4 hover:text-text-3",
        link: "text-link-4 underline-offset-(--aurora-underline-offset) hover:underline",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : "span"

  return (
    <Comp
      data-slot="badge"
      data-variant={variant}
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
