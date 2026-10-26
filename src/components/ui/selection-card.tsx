import * as React from "react"
import { cn } from "@/lib/utils"

import { Card } from "@/components/ui/card"

// Card de seleção: um card inteiro clicável que marca o controle de dentro. Base: o padrão
// Choice Card do shadcn (um <label> envolvendo o controle e o conteúdo); visual do Check_Terms da
// jornada de Formalização (Genesis). É uma montagem dos nossos componentes, sem recriar nada:
// - caixa: o Card;
// - controle: Checkbox (aceitar, vários) ou RadioGroupItem (escolher um, dentro de um RadioGroup);
// - conteúdo: tag (Badge), título e descrição; livre para outros componentes;
// - ação opcional à direita (ex.: IconButton com seta para abrir o termo), que não marca o card.
// Foco pelo teclado: o anel aparece no card inteiro, e o anel próprio do controle sai para não duplicar.
// Hover como o do Checkbox: borda roxa desmarcado, laranja mais escuro marcado, com um fundo leve. Os
// grupos checkbox-field e radio-field são os do label do Checkbox e do Radio: passar o mouse em
// qualquer parte do card também acende o hover do controle.

// A caixa é o Card (mesmo raio, fundo, linha e sombra); o label em volta faz o card inteiro clicável.
// A linha do Card é um anel (ring): os estados mudam a cor dela.
function SelectionCard({ className, children, ...props }: React.ComponentProps<"label">) {
  return (
    <label
      data-slot="selection-card"
      className="group/selection-card group/checkbox-field group/radio-field block w-full cursor-pointer text-left has-[:is([role=checkbox],[role=radio]):disabled]:cursor-not-allowed"
      {...props}
    >
      <Card
        className={cn(
          "flex-row items-start gap-lg p-lg transition-[color,background-color,box-shadow]",
          // o controle de 16px alinha com a primeira linha do texto; o anel de foco dele fica com o card
          "*:data-[slot=checkbox]:mt-xs *:data-[slot=radio-group-item]:mt-xs",
          "*:data-[slot=checkbox]:focus-visible:ring-(length:--aurora-stroke-none) *:data-[slot=radio-group-item]:focus-visible:ring-(length:--aurora-stroke-none)",
          "has-data-checked:ring-link-1",
          // hover só com o controle habilitado; no foco pelo teclado, a linha fica a do foco
          "not-has-[:is([role=checkbox],[role=radio]):is(:disabled,:focus-visible)]:hover:ring-link-4 not-has-[:is([role=checkbox],[role=radio]):disabled]:hover:bg-background-4/md",
          "has-data-checked:not-has-[:is([role=checkbox],[role=radio]):is(:disabled,:focus-visible)]:hover:ring-link-3",
          // estados que vêm do controle de dentro (Checkbox ou Radio): erro e foco pelo teclado
          "has-[[aria-invalid=true]:not([data-state=checked])]:ring-invalid has-[[aria-invalid=true]:not([data-state=checked])]:hover:ring-invalid",
          "has-[:is([role=checkbox],[role=radio]):focus-visible]:ring-(length:--aurora-stroke-focus) has-[:is([role=checkbox],[role=radio]):focus-visible]:ring-focus/md",
          className
        )}
      >
        {children}
      </Card>
    </label>
  )
}

function SelectionCardContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="selection-card-content"
      className={cn(
        "flex min-w-[0px] flex-1 flex-col items-start gap-xs group-has-[:is([role=checkbox],[role=radio]):disabled]/selection-card:opacity-md",
        className
      )}
      {...props}
    />
  )
}

function SelectionCardTitle({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="selection-card-title" className={cn("typo-body-md-regular text-text-1", className)} {...props} />
}

function SelectionCardDescription({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="selection-card-description"
      className={cn("typo-body-sm-regular text-text-3", className)}
      {...props}
    />
  )
}

// Ação à direita, centralizada na altura do card, com o ícone em cinza (secundário, como no Figma).
// Um botão aqui não marca o controle (clicar num botão dentro de um label não ativa o label).
function SelectionCardAction({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="selection-card-action"
      className={cn("shrink-0 self-center *:data-[slot=icon-button]:text-text-3", className)}
      {...props}
    />
  )
}

export { SelectionCard, SelectionCardContent, SelectionCardTitle, SelectionCardDescription, SelectionCardAction }
