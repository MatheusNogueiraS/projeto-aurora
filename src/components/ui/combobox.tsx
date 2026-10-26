"use client"

import * as React from "react"
import { Combobox as ComboboxPrimitive } from "@base-ui/react"
import { cn } from "@/lib/utils"

import { IconButton } from "@/components/ui/icon-button"
import { FieldHint, FloatingLabel, fieldInputSize } from "@/components/ui/input-field"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group"
import { ChevronDownIcon, XIcon, CheckIcon } from "lucide-react"

const Combobox = ComboboxPrimitive.Root

function ComboboxValue({ ...props }: ComboboxPrimitive.Value.Props) {
  return <ComboboxPrimitive.Value data-slot="combobox-value" {...props} />
}

function ComboboxTrigger({
  className,
  children,
  ...props
}: ComboboxPrimitive.Trigger.Props) {
  return (
    <ComboboxPrimitive.Trigger
      data-slot="combobox-trigger"
      className={cn("[&_svg:not([class*='size-'])]:size-[16px]", className)}
      {...props}
    >
      {children}
      <ChevronDownIcon className="pointer-events-none size-[16px] text-text-3" />
    </ComboboxPrimitive.Trigger>
  )
}

function ComboboxClear({ className, ...props }: ComboboxPrimitive.Clear.Props) {
  return (
    <ComboboxPrimitive.Clear
      data-slot="combobox-clear"
      render={<InputGroupButton variant="ghost" size="icon-xs" />}
      className={cn(className)}
      {...props}
    >
      <XIcon className="pointer-events-none" />
    </ComboboxPrimitive.Clear>
  )
}

// Sem label (ex.: a busca dentro da lista), o campo é só uma linha de texto centralizada: no default o
// padding da escala já fecha a conta; no sm e no lg não há passo exato, então o mínimo completa.
// Com label, vale o espaço do InputField (fieldInputSize), com o label subindo, igual ao Input.
const inputSize = {
  sm: cn("min-h-[39px] py-sm typo-body-md-regular"),
  default: cn("py-md"),
  lg: cn("min-h-[52px] py-md typo-body-lg-regular md:typo-body-lg-regular"),
}

function ComboboxInput({
  className,
  children,
  disabled = false,
  showTrigger = true,
  showClear = false,
  iconLeading: IconLeading,
  size = "default",
  id,
  label,
  optional = false,
  required = false,
  hint,
  invalid = false,
  errorMessage,
  ...props
}: Omit<ComboboxPrimitive.Input.Props, "size"> & {
  showTrigger?: boolean
  showClear?: boolean
  /** Nome do campo, flutuante como no Input: dentro dele, sobe ao focar ou escolher. Sem label, o campo é só a linha de texto. */
  label?: React.ReactNode
  /** Mostra "(opcional)" ao lado do label. */
  optional?: boolean
  /** Mostra o asterisco de obrigatório ao lado do label. */
  required?: boolean
  /** Texto de ajuda embaixo do campo. */
  hint?: React.ReactNode
  /** Erro: campo em vermelho. Só aparece com o campo habilitado. */
  invalid?: boolean
  /** Mensagem de erro; no erro, aparece no lugar do hint. */
  errorMessage?: React.ReactNode
  /** Ícone dentro do campo, à esquerda (ex.: SearchIcon do lucide-react). */
  iconLeading?: React.ComponentType<React.SVGProps<SVGSVGElement>>
  size?: keyof typeof inputSize
}) {
  const generatedId = React.useId()
  const inputId = id ?? generatedId
  const hintId = `${inputId}-hint`
  const showError = invalid && !disabled
  const message = showError && errorMessage ? errorMessage : hint
  const hasMessage = message != null && message !== ""

  const group = (
    <InputGroup className={cn("w-auto", !hasMessage && className)}>
      {IconLeading && (
        <InputGroupAddon align="inline-start">
          <IconLeading aria-hidden />
        </InputGroupAddon>
      )}
      <ComboboxPrimitive.Input
        id={inputId}
        render={<InputGroupInput disabled={disabled} className={cn(label && "peer", label ? fieldInputSize[size] : inputSize[size])} />}
        // com label, o placeholder vazio (" ") avisa se o campo tem texto, e o label sobe
        placeholder={label ? " " : undefined}
        aria-invalid={showError || undefined}
        aria-describedby={hasMessage ? hintId : undefined}
        {...props}
      />
      {label && (
        <FloatingLabel
          htmlFor={inputId}
          label={label}
          optional={optional}
          required={required}
          size={size}
          iconLeading={!!IconLeading}
          iconTrailing={showTrigger || showClear}
        />
      )}
      {/* no sm, o botão da seta (24px) com o padding normal passaria da altura do campo */}
      <InputGroupAddon align="inline-end" className={cn(size === "sm" && "py-xs")}>
        {showTrigger && (
          <InputGroupButton
            size="icon-xs"
            variant="ghost"
            asChild
            data-slot="input-group-button"
            className="group-has-data-[slot=combobox-clear]/input-group:hidden data-pressed:bg-transparent"
            disabled={disabled}
          >
            <ComboboxTrigger />
          </InputGroupButton>
        )}
        {showClear && <ComboboxClear disabled={disabled} />}
      </InputGroupAddon>
      {children}
    </InputGroup>
  )

  // a dica fica fora do campo; sem dica, o campo segue sozinho (ex.: a busca dentro da lista)
  if (!hasMessage) return group
  return (
    <div className={cn("flex w-full flex-col gap-xs", className)}>
      {group}
      <FieldHint id={hintId} invalid={showError} disabled={disabled}>
        {message}
      </FieldHint>
    </div>
  )
}

function ComboboxContent({
  className,
  side = "bottom",
  sideOffset = 6,
  align = "start",
  alignOffset = 0,
  anchor,
  ...props
}: ComboboxPrimitive.Popup.Props &
  Pick<
    ComboboxPrimitive.Positioner.Props,
    "side" | "align" | "sideOffset" | "alignOffset" | "anchor"
  >) {
  return (
    <ComboboxPrimitive.Portal>
      <ComboboxPrimitive.Positioner
        side={side}
        sideOffset={sideOffset}
        align={align}
        alignOffset={alignOffset}
        anchor={anchor}
        className="isolate z-overlay"
      >
        <ComboboxPrimitive.Popup
          data-slot="combobox-content"
          data-chips={!!anchor}
          className={cn("group/combobox-content relative max-h-(--available-height) w-(--anchor-width) max-w-(--available-width) min-w-[calc(var(--anchor-width)+28px)] origin-(--transform-origin) overflow-hidden rounded-sm bg-background-6 text-text-1 shadow-m ring-(length:--aurora-stroke-default) ring-divider duration-(--aurora-motion-duration-fast) data-[chips=true]:min-w-(--anchor-width) data-[side=bottom]:slide-in-from-top-overlay data-[side=inline-end]:slide-in-from-left-overlay data-[side=inline-start]:slide-in-from-right-overlay data-[side=left]:slide-in-from-right-overlay data-[side=right]:slide-in-from-left-overlay data-[side=top]:slide-in-from-bottom-overlay *:data-[slot=input-group]:m-xs *:data-[slot=input-group]:mb-none *:data-[slot=input-group]:border-divider *:data-[slot=input-group]:bg-background-4 *:data-[slot=input-group]:shadow-none data-open:animate-in data-open:fade-in-(--aurora-opacity-none) data-open:zoom-in-(--aurora-motion-scale-overlay) data-closed:animate-out data-closed:fade-out-(--aurora-opacity-none) data-closed:zoom-out-(--aurora-motion-scale-overlay)", className )}
          {...props}
        />
      </ComboboxPrimitive.Positioner>
    </ComboboxPrimitive.Portal>
  )
}

function ComboboxList({ className, ...props }: ComboboxPrimitive.List.Props) {
  return (
    <ComboboxPrimitive.List
      data-slot="combobox-list"
      className={cn(
        "no-scrollbar max-h-[min(249px,calc(var(--available-height)_-_39px))] scroll-py-xs overflow-y-auto overscroll-contain p-xs data-empty:p-none",
        className
      )}
      {...props}
    />
  )
}

function ComboboxItem({
  className,
  children,
  ...props
}: ComboboxPrimitive.Item.Props) {
  return (
    <ComboboxPrimitive.Item
      data-slot="combobox-item"
      className={cn(
        "relative flex w-full cursor-default items-center gap-sm rounded-xs py-sm pr-xxl pl-sm typo-body-md-regular outline-hidden select-none data-highlighted:bg-background-4 data-highlighted:text-text-1 not-data-[variant=destructive]:data-highlighted:**:text-text-1 data-disabled:pointer-events-none data-disabled:opacity-md [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-[16px]",
        className
      )}
      {...props}
    >
      {children}
      <ComboboxPrimitive.ItemIndicator
        render={
          <span className="pointer-events-none absolute right-sm flex size-[16px] items-center justify-center" />
        }
      >
        <CheckIcon className="pointer-events-none" />
      </ComboboxPrimitive.ItemIndicator>
    </ComboboxPrimitive.Item>
  )
}

function ComboboxGroup({ className, ...props }: ComboboxPrimitive.Group.Props) {
  return (
    <ComboboxPrimitive.Group
      data-slot="combobox-group"
      className={cn(className)}
      {...props}
    />
  )
}

function ComboboxLabel({
  className,
  ...props
}: ComboboxPrimitive.GroupLabel.Props) {
  return (
    <ComboboxPrimitive.GroupLabel
      data-slot="combobox-label"
      className={cn("px-sm py-sm typo-body-sm-regular text-text-3", className)}
      {...props}
    />
  )
}

function ComboboxCollection({ ...props }: ComboboxPrimitive.Collection.Props) {
  return (
    <ComboboxPrimitive.Collection data-slot="combobox-collection" {...props} />
  )
}

function ComboboxEmpty({ className, ...props }: ComboboxPrimitive.Empty.Props) {
  return (
    <ComboboxPrimitive.Empty
      data-slot="combobox-empty"
      className={cn(
        "hidden w-full justify-center py-sm text-center typo-body-md-regular text-text-3 group-data-empty/combobox-content:flex",
        className
      )}
      {...props}
    />
  )
}

function ComboboxSeparator({
  className,
  ...props
}: ComboboxPrimitive.Separator.Props) {
  return (
    <ComboboxPrimitive.Separator
      data-slot="combobox-separator"
      className={cn("-mx-xs my-xs h-px bg-divider", className)}
      {...props}
    />
  )
}

function ComboboxChips({
  className,
  ...props
}: React.ComponentPropsWithRef<typeof ComboboxPrimitive.Chips> &
  ComboboxPrimitive.Chips.Props) {
  return (
    <ComboboxPrimitive.Chips
      data-slot="combobox-chips"
      className={cn(
        "flex flex-wrap items-center gap-xs rounded-sm border-default border-field bg-transparent bg-clip-padding px-md py-sm typo-body-md-regular shadow-s transition-[color,box-shadow] focus-within:border-focus focus-within:ring-(length:--aurora-stroke-focus) focus-within:ring-focus/md not-has-aria-invalid:not-focus-within:hover:border-link-4 has-aria-invalid:not-has-data-[slot=combobox-chip]:border-invalid has-aria-invalid:not-has-data-[slot=combobox-chip]:ring-(length:--aurora-stroke-focus) has-aria-invalid:not-has-data-[slot=combobox-chip]:ring-invalid/xs has-data-[slot=combobox-chip]:px-sm has-data-[slot=combobox-chip]:py-xs",
        className
      )}
      {...props}
    />
  )
}

function ComboboxChip({
  className,
  children,
  showRemove = true,
  ...props
}: ComboboxPrimitive.Chip.Props & {
  showRemove?: boolean
}) {
  return (
    <ComboboxPrimitive.Chip
      data-slot="combobox-chip"
      className={cn(
        "flex w-fit items-center justify-center gap-xs rounded-xs bg-background-4 px-sm py-xxs typo-body-sm-regular whitespace-nowrap text-text-1 has-disabled:pointer-events-none has-disabled:cursor-not-allowed has-disabled:opacity-md has-data-[slot=combobox-chip-remove]:pr-none",
        className
      )}
      {...props}
    >
      {children}
      {showRemove && (
        <ComboboxPrimitive.ChipRemove
          render={<IconButton variant="ghost" size="xs" aria-label="Remover" />}
          className="-ml-xs opacity-md hover:opacity-full"
          data-slot="combobox-chip-remove"
        >
          <XIcon className="pointer-events-none" />
        </ComboboxPrimitive.ChipRemove>
      )}
    </ComboboxPrimitive.Chip>
  )
}

function ComboboxChipsInput({
  className,
  ...props
}: ComboboxPrimitive.Input.Props) {
  return (
    <ComboboxPrimitive.Input
      data-slot="combobox-chip-input"
      className={cn("min-w-[64px] flex-1 outline-none", className)}
      {...props}
    />
  )
}

function useComboboxAnchor() {
  return React.useRef<HTMLDivElement | null>(null)
}

export {
  Combobox,
  ComboboxInput,
  ComboboxContent,
  ComboboxList,
  ComboboxItem,
  ComboboxGroup,
  ComboboxLabel,
  ComboboxCollection,
  ComboboxEmpty,
  ComboboxSeparator,
  ComboboxChips,
  ComboboxChip,
  ComboboxChipsInput,
  ComboboxTrigger,
  ComboboxValue,
  useComboboxAnchor,
}
