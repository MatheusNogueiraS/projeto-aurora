import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

// O grupo é o campo: hover (borda roxa), erro só com o campo habilitado e, se o campo estiver
// desabilitado, o grupo inteiro esmaece (as partes internas não esmaecem de novo).
function InputGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="input-group"
      role="group"
      className={cn(
        "group/input-group relative flex w-full min-w-[0px] items-center rounded-sm border-default border-field shadow-s transition-[color,box-shadow] outline-none in-data-[slot=combobox-content]:focus-within:border-inherit in-data-[slot=combobox-content]:focus-within:ring-(length:--aurora-stroke-none) not-has-[[data-slot][aria-invalid=true]:enabled]:not-has-[[data-slot=input-group-control]:disabled]:not-has-[[data-slot=input-group-control]:focus-visible]:hover:border-link-4 has-[[data-slot=input-group-control]:disabled]:cursor-not-allowed has-[[data-slot=input-group-control]:disabled]:opacity-md has-[[data-slot=input-group-control]:focus-visible]:border-focus has-[[data-slot=input-group-control]:focus-visible]:ring-(length:--aurora-stroke-focus) has-[[data-slot=input-group-control]:focus-visible]:ring-focus/md has-[[data-slot][aria-invalid=true]:enabled]:border-invalid has-[[data-slot][aria-invalid=true]:enabled]:ring-(length:--aurora-stroke-focus) has-[[data-slot][aria-invalid=true]:enabled]:ring-invalid/xs has-[>[data-align=block-end]]:h-auto has-[>[data-align=block-end]]:flex-col has-[>[data-align=block-start]]:h-auto has-[>[data-align=block-start]]:flex-col has-[>textarea]:h-auto has-[>[data-align=block-end]]:[&>input]:pt-md has-[>[data-align=block-start]]:[&>input]:pb-md has-[>[data-align=inline-end]]:[&>input]:pr-sm has-[>[data-align=inline-start]]:[&>input]:pl-sm",
        className
      )}
      {...props}
    />
  )
}

const inputGroupAddonVariants = cva(
  "flex h-auto cursor-text items-center justify-center gap-sm py-sm typo-body-md-regular text-text-3 select-none [&>kbd]:rounded-xxs [&>svg:not([class*='size-'])]:size-[16px]",
  {
    variants: {
      align: {
        "inline-start":
          "order-first pl-sm has-[>button]:-ml-xs has-[>kbd]:-ml-xxs",
        "inline-end":
          "order-last pr-sm has-[>button]:-mr-xs has-[>kbd]:-mr-xxs",
        "block-start":
          "order-first w-full justify-start px-md pt-sm group-has-[>input]/input-group:pt-sm [.border-b]:pb-sm",
        "block-end":
          "order-last w-full justify-start px-md pb-sm group-has-[>input]/input-group:pb-sm [.border-t]:pt-sm",
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
  "flex items-center gap-sm typo-body-md-regular shadow-none has-data-[icon=inline-end]:pr-sm has-data-[icon=inline-start]:pl-sm",
  {
    variants: {
      size: {
        xs: "gap-xs rounded-pill px-sm py-xxs [&>svg:not([class*='size-'])]:size-[14px]",
        sm: "px-md py-xs",
        "icon-xs":
          "size-[24px] rounded-pill p-none has-[>svg]:p-none",
        "icon-sm": "size-[32px] p-none has-[>svg]:p-none",
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
        "flex items-center gap-sm typo-body-md-regular text-text-3 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-[16px]",
        className
      )}
      {...props}
    />
  )
}

function InputGroupInput({
  className,
  ...props
}: Omit<React.ComponentProps<"input">, "size">) {
  return (
    <Input
      data-slot="input-group-control"
      className={cn(
        "flex-1 rounded-none border-(length:--aurora-stroke-none) bg-transparent shadow-none ring-(length:--aurora-stroke-none) focus-visible:ring-(length:--aurora-stroke-none) aria-invalid:enabled:ring-(length:--aurora-stroke-none) disabled:opacity-full",
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
        "flex-1 resize-none rounded-none border-(length:--aurora-stroke-none) bg-transparent py-sm shadow-none ring-(length:--aurora-stroke-none) focus-visible:ring-(length:--aurora-stroke-none) aria-invalid:enabled:ring-(length:--aurora-stroke-none) disabled:opacity-full",
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
