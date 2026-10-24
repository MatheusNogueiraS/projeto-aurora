import * as React from "react"
import { cn } from "@/lib/utils"

function Table({ className, ...props }: React.ComponentProps<"table">) {
  return (
    <div
      data-slot="table-container"
      className="relative w-full overflow-x-auto"
    >
      <table
        data-slot="table"
        className={cn("w-full caption-bottom typo-body-md-regular", className)}
        {...props}
      />
    </div>
  )
}

function TableHeader({ className, ...props }: React.ComponentProps<"thead">) {
  return (
    <thead
      data-slot="table-header"
      className={cn("[&_tr]:border-b-default", className)}
      {...props}
    />
  )
}

function TableBody({ className, ...props }: React.ComponentProps<"tbody">) {
  return (
    <tbody
      data-slot="table-body"
      className={cn("[&_tr:last-child]:border-(length:--aurora-stroke-none)", className)}
      {...props}
    />
  )
}

function TableFooter({ className, ...props }: React.ComponentProps<"tfoot">) {
  return (
    <tfoot
      data-slot="table-footer"
      className={cn(
        "border-t-default bg-background-4/md typo-body-md-bold [&>tr]:last:border-b-(length:--aurora-stroke-none)",
        className
      )}
      {...props}
    />
  )
}

function TableRow({ className, ...props }: React.ComponentProps<"tr">) {
  return (
    <tr
      data-slot="table-row"
      className={cn(
        "border-b-default transition-colors hover:bg-background-4/md has-aria-expanded:bg-background-4/md data-[state=selected]:bg-background-4",
        className
      )}
      {...props}
    />
  )
}

// Alinhamento do conteúdo da célula (cabeçalho e conteúdo da mesma coluna usam o mesmo):
// valores e números à direita, para as casas se alinharem. O texto segue o text-align; componentes
// em bloco (Checkbox, Select) vão para o lado pela margem, e grupos em grade (Radio) pelo justify.
// Na última coluna, overflow-x-clip: a área de toque invisível dos controles (maior que eles) não
// passa da borda da tabela nem cria rolagem lateral. Só nela: nas outras, cortaria em silêncio
// um texto (ex.: um valor) quando a coluna tem largura fixa.
const cellAlign = {
  left: cn("text-left"),
  center: cn("text-center *:mx-auto *:justify-items-center"),
  right: cn("text-right *:ml-auto *:justify-items-end"),
}
type CellAlign = keyof typeof cellAlign

// Célula de cabeçalho (título da coluna).
function TableHead({ className, align = "left", ...props }: Omit<React.ComponentProps<"th">, "align"> & { align?: CellAlign }) {
  return (
    <th
      data-slot="table-head"
      className={cn(
        cellAlign[align],
        "px-sm last:overflow-x-clip py-sm align-middle typo-body-md-bold whitespace-nowrap text-text-1",
        className
      )}
      {...props}
    />
  )
}

// Célula de conteúdo: texto ou qualquer componente dentro (Badge, Checkbox, Avatar, ação...).
function TableCell({ className, align = "left", ...props }: Omit<React.ComponentProps<"td">, "align"> & { align?: CellAlign }) {
  return (
    <td
      data-slot="table-cell"
      className={cn(
        cellAlign[align],
        "p-sm last:overflow-x-clip align-middle whitespace-nowrap",
        className
      )}
      {...props}
    />
  )
}

function TableCaption({
  className,
  ...props
}: React.ComponentProps<"caption">) {
  return (
    <caption
      data-slot="table-caption"
      className={cn("mt-lg typo-body-md-regular text-text-3", className)}
      {...props}
    />
  )
}

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
}
