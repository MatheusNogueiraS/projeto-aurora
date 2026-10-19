import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

function InputGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="input-group"
      role="group"
      className={cn(
        "group/input-group relative flex h-control-md w-full min-w-none items-center rounded-input border-default border-field shadow-s transition-[color,box-shadow] outline-none in-data-[slot=combobox-content]:focus-within:border-inherit in-data-[slot=combobox-content]:focus-within:ring-(length:--aurora-stroke-none) has-[[data-slot=input-group-control]:focus-visible]:border-focus has-[[data-slot=input-group-control]:focus-visible]:ring-(length:--aurora-stroke-focus) has-[[data-slot=input-group-control]:focus-visible]:ring-focus/focus-ring has-[[data-slot][aria-invalid=true]]:border-invalid has-[[data-slot][aria-invalid=true]]:ring-(length:--aurora-stroke-focus) has-[[data-slot][aria-invalid=true]]:ring-invalid/invalid-ring has-[>[data-align=block-end]]:h-auto has-[>[data-align=block-end]]:flex-col has-[>[data-align=block-start]]:h-auto has-[>[data-align=block-start]]:flex-col has-[>textarea]:h-auto has-[>[data-align=block-end]]:[&>input]:pt-xxxs has-[>[data-align=block-start]]:[&>input]:pb-xxxs has-[>[data-align=inline-end]]:[&>input]:pr-quark-plus has-[>[data-align=inline-start]]:[&>input]:pl-quark-plus",
        className
      )}
      {...props}
    />
  )
}

const inputGroupAddonVariants = cva(
  "flex h-auto cursor-text items-center justify-center gap-nano py-quark-plus typo-body-small text-text-3 select-none group-data-[disabled=true]/input-group:opacity-disabled [&>kbd]:rounded-kbd [&>svg:not([class*='size-'])]:size-icon-md",
  {
    variants: {
      align: {
        "inline-start":
          "order-first pl-nano has-[>button]:-ml-quark has-[>kbd]:-ml-pico",
        "inline-end":
          "order-last pr-nano has-[>button]:-mr-quark has-[>kbd]:-mr-pico",
        "block-start":
          "order-first w-full justify-start px-nano-plus pt-nano group-has-[>input]/input-group:pt-nano [.border-b]:pb-nano",
        "block-end":
          "order-last w-full justify-start px-nano-plus pb-nano group-has-[>input]/input-group:pb-nano [.border-t]:pt-nano",
      },
    },
    defaultVariants: {
      align: "inline-start",
    },
  }
)

function InputGroupAddon({
  className,
  align = "inline-start",
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof inputGroupAddonVariants>) {
  return (
    <div
      role="group"
      data-slot="input-group-addon"
      data-align={align}
      className={cn(inputGroupAddonVariants({ align }), className)}
      onClick={(e) => {
        if ((e.target as HTMLElement).closest("button")) {
          return
        }
        e.currentTarget.parentElement?.querySelector("input")?.focus()
      }}
      {...props}
    />
  )
}

const inputGroupButtonVariants = cva(
  "flex items-center gap-nano typo-button-small shadow-none has-data-[icon=inline-end]:pr-nano has-data-[icon=inline-start]:pl-nano",
  {
    variants: {
      size: {
        xs: "h-control-xs gap-quark rounded-button px-quark-plus [&>svg:not([class*='size-'])]:size-icon-sm",
        sm: "px-nano-plus",
        "icon-xs":
          "size-control-xs rounded-button p-none has-[>svg]:p-none",
        "icon-sm": "size-control-sm p-none has-[>svg]:p-none",
      },
    },
    defaultVariants: {
      size: "xs",
    },
  }
)

function InputGroupButton({
  className,
  type = "button",
  variant = "ghost",
  size = "xs",
  ...props
}: Omit<React.ComponentProps<typeof Button>, "size"> &
  VariantProps<typeof inputGroupButtonVariants>) {
  return (
    <Button
      type={type}
      data-size={size}
      variant={variant}
      className={cn(inputGroupButtonVariants({ size }), className)}
      {...props}
    />
  )
}

function InputGroupText({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      className={cn(
        "flex items-center gap-nano typo-body-small text-text-3 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-icon-md",
        className
      )}
      {...props}
    />
  )
}

function InputGroupInput({
  className,
  ...props
}: React.ComponentProps<"input">) {
  return (
    <Input
      data-slot="input-group-control"
      className={cn(
        "flex-1 rounded-none border-(length:--aurora-stroke-none) bg-transparent shadow-none ring-(length:--aurora-stroke-none) focus-visible:ring-(length:--aurora-stroke-none) aria-invalid:ring-(length:--aurora-stroke-none)",
        className
      )}
      {...props}
    />
  )
}

function InputGroupTextarea({
  className,
  ...props
}: React.ComponentProps<"textarea">) {
  return (
    <Textarea
      data-slot="input-group-control"
      className={cn(
        "flex-1 resize-none rounded-none border-(length:--aurora-stroke-none) bg-transparent py-nano shadow-none ring-(length:--aurora-stroke-none) focus-visible:ring-(length:--aurora-stroke-none) aria-invalid:ring-(length:--aurora-stroke-none)",
        className
      )}
      {...props}
    />
  )
}

export {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupText,
  InputGroupInput,
  InputGroupTextarea,
}
