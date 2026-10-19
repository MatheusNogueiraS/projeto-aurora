import * as React from "react"
import { cn } from "@/lib/utils"
import { Tooltip as TooltipPrimitive } from "radix-ui"

function TooltipProvider({
  delayDuration = 0,
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Provider>) {
  return (
    <TooltipPrimitive.Provider
      data-slot="tooltip-provider"
      delayDuration={delayDuration}
      {...props}
    />
  )
}

function Tooltip({
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Root>) {
  return <TooltipPrimitive.Root data-slot="tooltip" {...props} />
}

function TooltipTrigger({
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Trigger>) {
  return <TooltipPrimitive.Trigger data-slot="tooltip-trigger" {...props} />
}

function TooltipContent({
  className,
  sideOffset = 0,
  children,
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Content>) {
  return (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Content
        data-slot="tooltip-content"
        sideOffset={sideOffset}
        className={cn(
          "z-overlay inline-flex w-fit max-w-tooltip-max origin-(--radix-tooltip-content-transform-origin) items-center gap-quark-plus rounded-tooltip bg-background-2 px-xxxs py-quark-plus typo-caption text-background-5 has-data-[slot=kbd]:pr-quark-plus data-[side=bottom]:slide-in-from-top-overlay data-[side=left]:slide-in-from-right-overlay data-[side=right]:slide-in-from-left-overlay data-[side=top]:slide-in-from-bottom-overlay **:data-[slot=kbd]:relative **:data-[slot=kbd]:isolate **:data-[slot=kbd]:z-overlay **:data-[slot=kbd]:rounded-kbd data-[state=delayed-open]:animate-in data-[state=delayed-open]:fade-in-(--aurora-opacity-hidden) data-[state=delayed-open]:zoom-in-(--aurora-motion-scale-overlay) data-open:animate-in data-open:fade-in-(--aurora-opacity-hidden) data-open:zoom-in-(--aurora-motion-scale-overlay) data-closed:animate-out data-closed:fade-out-(--aurora-opacity-hidden) data-closed:zoom-out-(--aurora-motion-scale-overlay)",
          className
        )}
        {...props}
      >
        {children}
        <TooltipPrimitive.Arrow className="z-overlay size-tooltip-arrow translate-y-[calc(-50%_-_var(--aurora-spacing-pico))] rotate-diagonal rounded-tooltip-arrow bg-background-2 fill-background-2" />
      </TooltipPrimitive.Content>
    </TooltipPrimitive.Portal>
  )
}

export { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger }
