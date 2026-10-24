import * as React from "react"
import { cn } from "@/lib/utils"
import { Accordion as AccordionPrimitive } from "radix-ui"
import { ChevronDownIcon, ChevronUpIcon } from "lucide-react"

type AccordionRootProps = React.ComponentProps<typeof AccordionPrimitive.Root>
type AccordionMultipleProps = Extract<AccordionRootProps, { type: "multiple" }>

// Base: o Accordion do shadcn (radix-vega). Adaptações do Aurora:
// - tokens no lugar das cores e medidas do shadcn;
// - abre vários de uma vez por padrão (type "multiple"); "um por vez" é type="single" + collapsible;
// - Tipo do item (como o InfoDrop do Design System CB): linha (divisor só entre os itens, como no
//   shadcn) ou caixa (borda em volta de UM item; vários em caixa ficam empilhados, com espaço);
// - ícone opcional antes do título (iconLeading) e altura do conteúdo livre (ver AccordionContent).
function Accordion({
  className,
  ...props
}: AccordionRootProps | (Omit<AccordionMultipleProps, "type"> & { type?: undefined })) {
  const rootProps = (props.type ? props : { ...props, type: "multiple" }) as AccordionRootProps
  return (
    <AccordionPrimitive.Root
      data-slot="accordion"
      // itens em caixa ficam separados por um espaço
      className={cn("flex w-full flex-col has-[>[data-variant=box]]:gap-md", className)}
      {...rootProps}
    />
  )
}

// Linha: como no shadcn, o divisor fica embaixo de cada item, menos do último (um item sozinho
// não tem). Caixa: a borda envolve só este item.
function AccordionItem({
  className,
  variant = "line",
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Item> & {
  /** line: divisor entre os itens; box: borda em volta do item. */
  variant?: "line" | "box"
}) {
  return (
    <AccordionPrimitive.Item
      data-slot="accordion-item"
      data-variant={variant}
      className={cn(variant === "box" ? "rounded-sm border-default border-divider px-lg" : "not-last:border-b-default", className)}
      {...props}
    />
  )
}

/** Um ícone do lucide-react (ex.: ClockIcon) ou qualquer componente de ícone SVG. */
type AccordionIcon = React.ComponentType<React.SVGProps<SVGSVGElement>>

// Anatomia como no Accordion do Nitro: [ícone opcional] título ... [chevron].
// O ícone tem a mesma API do Button (iconLeading) e fica alinhado à primeira linha do título.
function AccordionTrigger({
  className,
  children,
  iconLeading: IconLeading,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Trigger> & {
  /** Ícone antes do título. Sem valor, não aparece. */
  iconLeading?: AccordionIcon
}) {
  return (
    <AccordionPrimitive.Header className="flex">
      <AccordionPrimitive.Trigger
        data-slot="accordion-trigger"
        className={cn(
          "group/accordion-trigger relative flex flex-1 items-start justify-between gap-sm rounded-sm border-default border-transparent py-lg text-left typo-body-md-bold transition-all outline-none hover:underline focus-visible:border-focus focus-visible:ring-(length:--aurora-stroke-focus) focus-visible:ring-focus/md focus-visible:after:border-focus disabled:pointer-events-none disabled:opacity-md **:data-[slot=accordion-trigger-icon]:ml-auto **:data-[slot=accordion-trigger-icon]:size-[16px] **:data-[slot=accordion-trigger-icon]:text-text-3 **:data-[slot=accordion-trigger-icon]:translate-y-xxs *:data-[icon=inline-start]:size-[16px] *:data-[icon=inline-start]:shrink-0 *:data-[icon=inline-start]:translate-y-xxs",
          className
        )}
        {...props}
      >
        {IconLeading && <IconLeading data-icon="inline-start" aria-hidden />}
        {children}
        <ChevronDownIcon data-slot="accordion-trigger-icon" className="pointer-events-none shrink-0 group-aria-expanded/accordion-trigger:hidden" />
        <ChevronUpIcon data-slot="accordion-trigger-icon" className="pointer-events-none hidden shrink-0 group-aria-expanded/accordion-trigger:inline" />
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  )
}

// O conteúdo é um slot: texto ou outros componentes (ex.: DataLine). Diferente do shadcn, a parte
// de dentro não fixa a altura medida ao abrir (h-(--radix-accordion-content-height)): com ela, o
// conteúdo que muda com o item aberto ficava cortado. A medida continua servindo à animação.
function AccordionContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Content>) {
  return (
    <AccordionPrimitive.Content
      data-slot="accordion-content"
      className="overflow-hidden typo-body-md-regular data-open:animate-accordion-down data-closed:animate-accordion-up"
      {...props}
    >
      <div
        className={cn(
          "pt-none pb-lg [&_a]:underline [&_a]:underline-offset-(--aurora-underline-offset) [&_a]:hover:text-text-1 [&_p:not(:last-child)]:mb-lg",
          className
        )}
      >
        {children}
      </div>
    </AccordionPrimitive.Content>
  )
}

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent }
