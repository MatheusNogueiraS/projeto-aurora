import * as React from "react"
import { cn } from "@/lib/utils"

import { FieldCounter, FieldHint, FloatingLabel, fieldInputSize, type InputFieldSize } from "@/components/ui/input-field"
import { Textarea } from "@/components/ui/textarea"

// Campo de várias linhas completo, igual ao InputField: label flutuante (com opcional/obrigatório) e
// hint embaixo (no erro, vira a mensagem de erro). O label é obrigatório e sempre visível: vazio,
// fica na primeira linha no lugar do placeholder; ao focar ou digitar, diminui e sobe. Montado com o
// Textarea e as mesmas peças (FloatingLabel, FieldHint) e o mesmo espaço interno do InputField.
// Com maxLength, mostra o contador ("42/200") na linha do hint, à direita. O limite bloqueia a digitação
// (o próprio navegador corta o que passar, inclusive ao colar): não há estado de "passou do limite".

type TextareaFieldProps = Omit<React.ComponentProps<"textarea">, "size" | "placeholder"> & {
  /** Nome do campo (obrigatório): dentro dele, sobe ao focar ou digitar. */
  label: React.ReactNode
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
  size?: InputFieldSize
  /** Limite de caracteres: bloqueia a digitação no limite e mostra o contador ("42/200"). */
  maxLength?: number
}

function TextareaField({
  className,
  id,
  label,
  optional = false,
  required = false,
  hint,
  invalid = false,
  errorMessage,
  size = "default",
  disabled,
  maxLength,
  onChange,
  ...props
}: TextareaFieldProps) {
  const generatedId = React.useId()
  const textareaId = id ?? generatedId
  const hintId = `${textareaId}-hint`
  const counterId = `${textareaId}-counter`
  // a contagem vem do value (campo controlado) ou do que foi digitado (campo livre)
  const [typed, setTyped] = React.useState(String(props.defaultValue ?? "").length)
  const count = props.value !== undefined ? String(props.value).length : typed
  const hasCounter = maxLength !== undefined
  const showError = invalid && !disabled
  const message = showError && errorMessage ? errorMessage : hint

  return (
    <div
      data-slot="textarea-field"
      data-size={size}
      data-invalid={showError || undefined}
      data-disabled={disabled || undefined}
      className={cn("flex w-full flex-col gap-xs", className)}
    >
      {/* desabilitado: o bloco inteiro esmaece (campo e label), então o campo não esmaece de novo */}
      <div className={cn("relative", disabled && "cursor-not-allowed opacity-md")}>
        <Textarea
          id={textareaId}
          size={size}
          disabled={disabled}
          required={required}
          aria-invalid={showError || undefined}
          aria-describedby={[message && hintId, hasCounter && counterId].filter(Boolean).join(" ") || undefined}
          maxLength={maxLength}
          onChange={(event) => {
            setTyped(event.target.value.length)
            onChange?.(event)
          }}
          // o placeholder vazio (" ") avisa se o campo tem texto, e o label sobe
          placeholder=" "
          className={cn("peer disabled:opacity-full", fieldInputSize[size])}
          {...props}
        />
        <FloatingLabel
          htmlFor={textareaId}
          label={label}
          optional={optional}
          required={required}
          size={size}
          multiline
        />
      </div>
      {/* hint à esquerda, contador à direita; sem hint, o contador fica sozinho à direita */}
      {(message || hasCounter) && (
        <div className="flex items-start justify-between gap-md">
          <FieldHint id={hintId} invalid={showError} disabled={disabled}>
            {message}
          </FieldHint>
          {hasCounter && <FieldCounter id={counterId} count={count} max={maxLength} disabled={disabled} />}
        </div>
      )}
    </div>
  )
}

export { TextareaField }
