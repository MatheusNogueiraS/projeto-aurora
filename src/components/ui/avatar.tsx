import * as React from "react"
import { cn } from "@/lib/utils"
import { Avatar as AvatarPrimitive } from "radix-ui"

// Base: o Avatar do shadcn (radix-vega), trazido à mão e adaptado aos tokens do Aurora.
// Mostra a foto da pessoa; sem foto (ou enquanto carrega), mostra as iniciais.
// Com label, o nome da pessoa aparece à direita do círculo (só no avatar único; num grupo seriam vários nomes).
// O texto acompanha o tamanho do avatar. Sem label, a estrutura é só o círculo, como sempre foi.
const avatarLabelSize = {
  sm: "typo-body-sm-regular",
  default: "typo-body-md-regular",
  lg: "typo-body-lg-regular",
}

function Avatar({
  className,
  size = "default",
  label,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Root> & {
  size?: "default" | "sm" | "lg"
  /** Nome da pessoa, à direita do círculo. Sem valor, só o círculo. */
  label?: React.ReactNode
}) {
  const avatar = (
    <AvatarPrimitive.Root
      data-slot="avatar"
      data-size={size}
      className={cn(
        "group/avatar relative flex size-[32px] shrink-0 rounded-pill select-none after:absolute after:inset-none after:rounded-pill after:border-default after:border-divider after:mix-blend-darken data-[size=lg]:size-[40px] data-[size=sm]:size-[24px] dark:after:mix-blend-lighten",
        className
      )}
      {...props}
    />
  )
  if (label == null || label === "") return avatar

  return (
    <span data-slot="avatar-item" data-size={size} className="inline-flex max-w-full min-w-[0px] items-center gap-sm">
      {avatar}
      <span data-slot="avatar-label" className={cn("truncate text-text-1", avatarLabelSize[size])}>
        {label}
      </span>
    </span>
  )
}

function AvatarImage({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Image>) {
  return (
    <AvatarPrimitive.Image
      data-slot="avatar-image"
      className={cn("aspect-square size-full rounded-pill object-cover", className)}
      {...props}
    />
  )
}

function AvatarFallback({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Fallback>) {
  return (
    <AvatarPrimitive.Fallback
      data-slot="avatar-fallback"
      className={cn(
        "flex size-full items-center justify-center rounded-pill bg-background-4 typo-body-md-regular text-text-3 group-data-[size=sm]/avatar:typo-overline-regular",
        className
      )}
      {...props}
    />
  )
}

// Selo no canto (status, notificação). Com ícone dentro a partir do default.
function AvatarBadge({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="avatar-badge"
      className={cn(
        "absolute right-none bottom-none z-raised inline-flex items-center justify-center rounded-pill bg-link-1 text-link-10 ring-(length:--aurora-stroke-focus) ring-background-5 select-none",
        "group-data-[size=sm]/avatar:size-[8px] group-data-[size=sm]/avatar:[&>svg]:hidden",
        "group-data-[size=default]/avatar:size-[10px] group-data-[size=default]/avatar:[&>svg]:size-[8px]",
        "group-data-[size=lg]/avatar:size-[12px] group-data-[size=lg]/avatar:[&>svg]:size-[8px]",
        className
      )}
      {...props}
    />
  )
}

// Vários avatares sobrepostos; o contorno da cor do fundo da página separa um do outro.
function AvatarGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="avatar-group"
      className={cn(
        "group/avatar-group flex -space-x-sm has-data-[size=sm]:-space-x-xs *:data-[slot=avatar]:ring-(length:--aurora-stroke-focus) *:data-[slot=avatar]:ring-background-5",
        className
      )}
      {...props}
    />
  )
}

// "+N" no fim do grupo, no mesmo tamanho dos avatares.
function AvatarGroupCount({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="avatar-group-count"
      className={cn(
        "relative flex size-[32px] shrink-0 items-center justify-center rounded-pill bg-background-4 typo-body-md-regular text-text-3 ring-(length:--aurora-stroke-focus) ring-background-5 group-has-data-[size=lg]/avatar-group:size-[40px] group-has-data-[size=sm]/avatar-group:size-[24px] group-has-data-[size=sm]/avatar-group:typo-overline-regular [&>svg]:size-[16px] group-has-data-[size=lg]/avatar-group:[&>svg]:size-[20px] group-has-data-[size=sm]/avatar-group:[&>svg]:size-[12px]",
        className
      )}
      {...props}
    />
  )
}

export {
  Avatar,
  AvatarImage,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
  AvatarBadge,
}
