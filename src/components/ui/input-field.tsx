import * as React from "react"
import { CircleAlertIcon } from "lucide-react"
import { cn } from "@/lib/utils"

import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group"

// Campo de texto completo, como o Text Input do Nitro: label flutuante (com opcional/obrigatório),
// ícones à esquerda e à direita, e hint embaixo (no erro, vira a mensagem de erro). Referências:
// Text Input do Nitro, input do Genesis (ícone à direita, erro com "!") e o Field do shadcn
// (label e hint ligados ao campo para o leitor de tela).
// O label é obrigatório e sempre flutuante (sem variação): vazio, fica dentro do campo no lugar do
// placeholder; ao focar ou digitar, diminui e sobe, ficando escrito sobre o que se digita. Montado com o InputGroup (que já usa o
// nosso Input e põe os ícones dentro do campo). Carregamento não é daqui: use o Skeleton.

type InputFieldSize = "sm" | "default" | "lg"
/** Um ícone do lucide-react (ex.: MailIcon) ou qualquer componente de ícone SVG. */
type FieldIcon = React.ComponentType<React.SVGProps<SVGSVGElement>>

// Altura de cada tamanho: o espaço de cima guarda o label que sobe; o texto acompanha o tamanho.
// sm 41px, default 47px (50px no celular, texto de 16px) e lg 54px. É o mesmo espaço de todo campo
// de digitar (Input, Textarea, Combobox).
const fieldInputSize = {
  sm: cn("pt-lg pb-xxs typo-body-md-regular"),
  default: cn("pt-xl pb-xs"),
  lg: cn("pt-xl pb-sm typo-body-lg-regular md:typo-body-lg-regular"),
}
// posição do label quando sobe (focado ou com texto)
const floatedLabel = {
  sm: cn("peer-focus:top-xxs peer-[:not(:placeholder-shown)]:top-xxs"),
  default: cn("peer-focus:top-xs peer-[:not(:placeholder-shown)]:top-xs"),
  lg: cn("peer-focus:top-xs peer-[:not(:placeholder-shown)]:top-xs"),
}
// campo de várias linhas: o label vazio fica na primeira linha (onde o texto começa), não no meio
const multilineLabelTop = { sm: "top-lg", default: "top-xl", lg: "top-xl" }

type FloatingLabelProps = {
  htmlFor: string
  label: React.ReactNode
  optional?: boolean
  required?: boolean
  size?: InputFieldSize
  /** Há ícone à esquerda ou à direita: o label recua para não ficar embaixo dele. */
  iconLeading?: boolean
  iconTrailing?: boolean
  /** Campo de várias linhas (Textarea): o label vazio fica no alto, não no meio. */
  multiline?: boolean
}

// O label flutuante de todo campo de digitar. Precisa vir logo depois do campo, que leva a classe
// "peer" e placeholder=" " (o placeholder vazio avisa se há texto). Fica sempre visível: vazio, ocupa
// o lugar do placeholder; focado ou preenchido, diminui e sobe, sem sumir.
function FloatingLabel({ htmlFor, label, optional = false, required = false, size = "default", iconLeading = false, iconTrailing = false, multiline = false }: FloatingLabelProps) {
  return (
    <label
      htmlFor={htmlFor}
      className={cn(
        "pointer-events-none absolute truncate typo-body-md-regular text-text-3 transition-all",
        // a borda transparente repete a do campo, para o label alinhar com o texto digitado
        multiline ? cn("border-default border-transparent", multilineLabelTop[size]) : "top-[50%] -translate-y-1/2",
        iconLeading ? "left-xxl" : "left-md",
        iconTrailing ? "right-xxl" : "right-md",
        // focado ou com texto: diminui e sobe
        "peer-focus:translate-y-none peer-focus:typo-body-sm-regular peer-[:not(:placeholder-shown)]:translate-y-none peer-[:not(:placeholder-shown)]:typo-body-sm-regular",
        floatedLabel[size]
      )}
    >
      {label}
      {optional && <span> (opcional)</span>}
      {required && (
        <span aria-hidden className="text-alerts-7">
          {" "}*
        </span>
      )}
    </label>
  )
}

// Texto de ajuda embaixo do campo; no erro, fica vermelho e vira a mensagem de erro.
function FieldHint({ id, invalid = false, disabled = false, children }: { id: string; invalid?: boolean; disabled?: boolean; children: React.ReactNode }) {
  if (children == null || children === "") return null
  return (
    <p id={id} className={cn("typo-body-sm-regular", invalid ? "text-alerts-7" : "text-text-3", disabled && "opacity-md")}>
      {children}
    </p>
  )
}

type InputFieldProps = Omit<React.ComponentProps<"input">, "size" | "placeholder"> & {
  /** Nome do campo (obrigatório): dentro dele, sobe ao focar ou digitar. */
  label: React.ReactNode
  /** Mostra "(opcional)" ao lado do label. */
  optional?: boolean
  /** Mostra o asterisco de obrigatório ao lado do label. */
  required?: boolean
  /** Texto de ajuda embaixo do campo. */
  hint?: React.ReactNode
  /** Erro: campo em vermelho, com o ícone de alerta. Só aparece com o campo habilitado. */
  invalid?: boolean
  /** Mensagem de erro; no erro, aparece no lugar do hint. */
  errorMessage?: React.ReactNode
  /** Ícone dentro do campo, à esquerda. */
  iconLeading?: FieldIcon
  /** Ícone dentro do campo, à direita (no erro, dá lugar ao alerta). */
  iconTrailing?: FieldIcon
  size?: InputFieldSize
}

function InputField({
  className,
  id,
  label,
  optional = false,
  required = false,
  hint,
  invalid = false,
  errorMessage,
  iconLeading: IconLeading,
  iconTrailing,
  size = "default",
  disabled,
  ...props
}: InputFieldProps) {
  const generatedId = React.useId()
  const inputId = id ?? generatedId
  const hintId = `${inputId}-hint`
  const showError = invalid && !disabled
  const message = showError && errorMessage ? errorMessage : hint
  const IconTrailing = showError ? CircleAlertIcon : iconTrailing

  return (
    <div
      data-slot="input-field"
      data-size={size}
      data-invalid={showError || undefined}
      data-disabled={disabled || undefined}
      className={cn("flex w-full flex-col gap-xs", className)}
    >
      <InputGroup>
        {IconLeading && (
          <InputGroupAddon align="inline-start">
            <IconLeading aria-hidden />
          </InputGroupAddon>
        )}
        <InputGroupInput
          id={inputId}
          disabled={disabled}
          required={required}
          aria-invalid={showError || undefined}
          aria-describedby={message ? hintId : undefined}
          // o placeholder vazio (" ") avisa se o campo tem texto, e o label sobe
          placeholder=" "
          className={cn("peer", fieldInputSize[size])}
          {...props}
        />
        <FloatingLabel htmlFor={inputId} label={label} optional={optional} required={required} size={size} iconLeading={!!IconLeading} iconTrailing={!!IconTrailing} />
        {IconTrailing && (
          <InputGroupAddon align="inline-end" className={cn(showError && "text-alerts-7")}>
            <IconTrailing aria-hidden />
          </InputGroupAddon>
        )}
      </InputGroup>
      <FieldHint id={hintId} invalid={showError} disabled={disabled}>
        {message}
      </FieldHint>
    </div>
  )
}

export { InputField, FloatingLabel, FieldHint, fieldInputSize }
export type { InputFieldSize, FieldIcon }
