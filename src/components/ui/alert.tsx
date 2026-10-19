import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const alertVariants = cva(
  "group/alert relative grid w-full gap-pico rounded-card border-default px-xxs py-xxxs text-left typo-body-small has-data-[slot=alert-action]:relative has-data-[slot=alert-action]:pr-xxl-plus has-[>svg]:grid-cols-[auto_1fr] has-[>svg]:gap-x-nano-plus *:[svg]:row-span-2 *:[svg]:translate-y-pico *:[svg]:text-current *:[svg:not([class*='size-'])]:size-icon-md",
  {
    variants: {
      variant: {
        default: "bg-background-6 text-text-1",
        destructive:
          "bg-background-6 text-alerts-7 *:data-[slot=alert-description]:text-alerts-7/text-subtle *:[svg]:text-current",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Alert({
  className,
  variant,
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof alertVariants>) {
  return (
    <div
      data-slot="alert"
      role="alert"
      className={cn(alertVariants({ variant }), className)}
      {...props}
    />
  )
}

function AlertTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-title"
      className={cn(
        "typo-body-small-bold group-has-[>svg]/alert:col-start-2 [&_a]:underline [&_a]:underline-offset-(--aurora-underline-offset) [&_a]:hover:text-text-1",
        className
      )}
      {...props}
    />
  )
}

function AlertDescription({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-description"
      className={cn(
        "typo-body-small text-balance text-text-3 md:text-pretty [&_a]:underline [&_a]:underline-offset-(--aurora-underline-offset) [&_a]:hover:text-text-1 [&_p:not(:last-child)]:mb-xxs",
        className
      )}
      {...props}
    />
  )
}

function AlertAction({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-action"
      className={cn("absolute top-nano-plus right-xxxs", className)}
      {...props}
    />
  )
}

export { Alert, AlertTitle, AlertDescription, AlertAction }
