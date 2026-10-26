import * as React from "react"
import { cn } from "@/lib/utils"

// Base: o Card do shadcn (radix-vega), trazido à mão e adaptado aos tokens do Aurora. É a caixa
// padrão de conteúdo na página: mesmo raio, fundo, linha e sombra do Hover Card e do Popover.
// Partes: cabeçalho (título, descrição e ação no canto), conteúdo e rodapé. O espaço interno é o
// mesmo em volta e entre as partes: lg (16px) no default e md (12px) no sm.
// Para um card que marca uma escolha (aceitar, escolher uma opção), use o Card de seleção.

function Card({ className, size = "default", ...props }: React.ComponentProps<"div"> & { size?: "default" | "sm" }) {
  return (
    <div
      data-slot="card"
      data-size={size}
      className={cn(
        "group/card flex flex-col gap-lg overflow-hidden rounded-sm bg-background-6 py-lg typo-body-md-regular text-text-1 shadow-m ring-(length:--aurora-stroke-default) ring-divider data-[size=sm]:gap-md data-[size=sm]:py-md",
        // imagem como primeira parte: encosta no topo e acompanha os cantos
        "has-[>img:first-child]:pt-none *:[img:first-child]:rounded-t-sm *:[img:last-child]:rounded-b-sm",
        className
      )}
      {...props}
    />
  )
}

function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        "group/card-header grid auto-rows-min items-start gap-xs px-lg group-data-[size=sm]/card:px-md has-data-[slot=card-action]:grid-cols-[1fr_auto] has-data-[slot=card-description]:grid-rows-[auto_auto]",
        className
      )}
      {...props}
    />
  )
}

function CardTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-title"
      className={cn("typo-body-lg-bold text-text-1 group-data-[size=sm]/card:typo-body-md-bold", className)}
      {...props}
    />
  )
}

function CardDescription({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="card-description" className={cn("typo-body-sm-regular text-text-3", className)} {...props} />
}

// Algo no canto do cabeçalho (ex.: Badge, IconButton), ao lado do título.
function CardAction({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-action"
      className={cn("col-start-2 row-span-2 row-start-1 self-start justify-self-end", className)}
      {...props}
    />
  )
}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-content"
      className={cn("flex flex-col gap-md px-lg group-data-[size=sm]/card:px-md", className)}
      {...props}
    />
  )
}

function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-footer"
      className={cn("flex items-center gap-sm px-lg group-data-[size=sm]/card:px-md", className)}
      {...props}
    />
  )
}

export { Card, CardHeader, CardFooter, CardTitle, CardAction, CardDescription, CardContent }
