import * as React from "react"
import { cn } from "@/lib/utils"
import { Select as SelectPrimitive } from "radix-ui"
import { ChevronDownIcon, CheckIcon, ChevronUpIcon } from "lucide-react"

function Select({
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Root>) {
  return <SelectPrimitive.Root data-slot="select" {...props} />
}

function SelectGroup({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Group>) {
  return (
    <SelectPrimitive.Group
      data-slot="select-group"
      className={cn("scroll-my-xs p-xs", className)}
      {...props}
    />
  )
}

function SelectValue({
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Value>) {
  return <SelectPrimitive.Value data-slot="select-value" {...props} />
}

function SelectTrigger({
  className,
  size = "default",
  children,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Trigger> & {
  /** sm 31, default 39 e lg 42px: as mesmas alturas do Button e do Input. */
  size?: "sm" | "default" | "lg"
}) {
  // hover: borda roxa. Erro só com o campo habilitado e sem valor escolhido (vermelho sobre
  // uma escolha feita seria mal interpretado); desabilitado nunca fica em erro.
  return (
    <SelectPrimitive.Trigger
      data-slot="select-trigger"
      data-size={size}
      className={cn(
        "flex w-fit items-center justify-between gap-xs rounded-sm border-default border-field bg-transparent py-sm pr-sm pl-md typo-body-md-regular whitespace-nowrap shadow-s transition-[color,box-shadow] outline-none not-aria-invalid:not-focus-visible:enabled:hover:border-link-4 focus-visible:border-focus focus-visible:ring-(length:--aurora-stroke-focus) focus-visible:ring-focus/md disabled:cursor-not-allowed disabled:opacity-md aria-invalid:data-placeholder:enabled:border-invalid aria-invalid:data-placeholder:enabled:ring-(length:--aurora-stroke-focus) aria-invalid:data-placeholder:enabled:ring-invalid/xs aria-invalid:not-data-placeholder:not-focus-visible:enabled:hover:border-link-4 data-placeholder:text-text-3 data-[size=sm]:py-xs data-[size=lg]:typo-body-lg-regular *:data-[slot=select-value]:line-clamp-1 *:data-[slot=select-value]:flex *:data-[slot=select-value]:items-center *:data-[slot=select-value]:gap-xs [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-[16px]",
        className
      )}
      {...props}
    >
      {children}
      <SelectPrimitive.Icon asChild>
        <ChevronDownIcon className="pointer-events-none size-[16px] text-text-3" />
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  )
}

function SelectContent({
  className,
  children,
  position = "item-aligned",
  align = "center",
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Content>) {
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        data-slot="select-content"
        data-align-trigger={position === "item-aligned"}
        className={cn("relative z-overlay max-h-(--radix-select-content-available-height) min-w-[144px] origin-(--radix-select-content-transform-origin) overflow-x-hidden overflow-y-auto rounded-sm bg-background-6 text-text-1 shadow-m ring-(length:--aurora-stroke-default) ring-divider duration-(--aurora-motion-duration-fast) data-[align-trigger=true]:animate-none data-[side=bottom]:slide-in-from-top-overlay data-[side=left]:slide-in-from-right-overlay data-[side=right]:slide-in-from-left-overlay data-[side=top]:slide-in-from-bottom-overlay data-open:animate-in data-open:fade-in-(--aurora-opacity-none) data-open:zoom-in-(--aurora-motion-scale-overlay) data-closed:animate-out data-closed:fade-out-(--aurora-opacity-none) data-closed:zoom-out-(--aurora-motion-scale-overlay)", position ==="popper"&&"data-[side=bottom]:translate-y-xs data-[side=left]:-translate-x-xs data-[side=right]:translate-x-xs data-[side=top]:-translate-y-xs", className )}
        position={position}
        align={align}
        {...props}
      >
        <SelectScrollUpButton />
        <SelectPrimitive.Viewport
          data-position={position}
          className={cn(
            "data-[position=popper]:h-(--radix-select-trigger-height) data-[position=popper]:w-full data-[position=popper]:min-w-(--radix-select-trigger-width)",
            position === "popper" && ""
          )}
        >
          {children}
        </SelectPrimitive.Viewport>
        <SelectScrollDownButton />
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  )
}

function SelectLabel({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Label>) {
  return (
    <SelectPrimitive.Label
      data-slot="select-label"
      className={cn("px-sm py-sm typo-body-sm-regular text-text-3", className)}
      {...props}
    />
  )
}

function SelectItem({
  className,
  children,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Item>) {
  return (
    <SelectPrimitive.Item
      data-slot="select-item"
      className={cn(
        "relative flex w-full cursor-default items-center gap-sm rounded-xs py-sm pr-xxl pl-sm typo-body-md-regular outline-hidden select-none focus:bg-background-4 focus:text-text-1 not-data-[variant=destructive]:focus:**:text-text-1 data-disabled:pointer-events-none data-disabled:opacity-md [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-[16px] *:[span]:last:flex *:[span]:last:items-center *:[span]:last:gap-sm",
        className
      )}
      {...props}
    >
      <span className="pointer-events-none absolute right-sm flex size-[16px] items-center justify-center">
        <SelectPrimitive.ItemIndicator>
          <CheckIcon className="pointer-events-none" />
        </SelectPrimitive.ItemIndicator>
      </span>
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
    </SelectPrimitive.Item>
  )
}

function SelectSeparator({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Separator>) {
  return (
    <SelectPrimitive.Separator
      data-slot="select-separator"
      className={cn("pointer-events-none -mx-xs my-xs h-px bg-divider", className)}
      {...props}
    />
  )
}

function SelectScrollUpButton({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollUpButton>) {
  return (
    <SelectPrimitive.ScrollUpButton
      data-slot="select-scroll-up-button"
      className={cn(
        "z-raised flex cursor-default items-center justify-center bg-background-6 py-xs [&_svg:not([class*='size-'])]:size-[16px]",
        className
      )}
      {...props}
    >
      <ChevronUpIcon
      />
    </SelectPrimitive.ScrollUpButton>
  )
}

function SelectScrollDownButton({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollDownButton>) {
  return (
    <SelectPrimitive.ScrollDownButton
      data-slot="select-scroll-down-button"
      className={cn(
        "z-raised flex cursor-default items-center justify-center bg-background-6 py-xs [&_svg:not([class*='size-'])]:size-[16px]",
        className
      )}
      {...props}
    >
      <ChevronDownIcon
      />
    </SelectPrimitive.ScrollDownButton>
  )
}

export {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
}
