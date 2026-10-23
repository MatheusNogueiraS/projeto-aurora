import * as React from "react"
import { cn } from "@/lib/utils"
import { Accordion as AccordionPrimitive } from "radix-ui"
import { ChevronDownIcon, ChevronUpIcon } from "lucide-react"

type AccordionRootProps = React.ComponentProps<typeof AccordionPrimitive.Root>
type AccordionMultipleProps = Extract<AccordionRootProps, { type: "multiple" }>

// O componente de design é o item (como no Nitro): uma lista é a soma de itens, e por
// padrão cada um abre e fecha sozinho (type "multiple"). O grupo existe por acessibilidade
// (setas do teclado entre os títulos); "um aberto por vez" continua disponível com type="single".
function Accordion({
  className,
  ...props
}: AccordionRootProps | (Omit<AccordionMultipleProps, "type"> & { type?: undefined })) {
  const rootProps = (props.type ? props : { ...props, type: "multiple" }) as AccordionRootProps
  return (
    <AccordionPrimitive.Root
      data-slot="accordion"
      className={cn("flex w-full flex-col", className)}
      {...rootProps}
    />
  )
}

// O divisor faz parte do item (linha embaixo). Numa lista, o último item fica sem linha;
// um item sozinho mantém a linha.
function AccordionItem({
  className,
  divider = true,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Item> & {
  /** Linha embaixo do item. Ligada por padrão. */
  divider?: boolean
}) {
  return (
    <AccordionPrimitive.Item
      data-slot="accordion-item"
      className={cn(
        divider && "border-b-default [&:last-child:not(:only-child)]:border-b-(length:--aurora-stroke-none)",
        className
      )}
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
          "h-(--radix-accordion-content-height) pt-none pb-lg [&_a]:underline [&_a]:underline-offset-(--aurora-underline-offset) [&_a]:hover:text-text-1 [&_p:not(:last-child)]:mb-lg",
          className
        )}
      >
        {children}
      </div>
    </AccordionPrimitive.Content>
  )
}

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent }
