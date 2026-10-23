import * as React from "react"
import { cva } from "class-variance-authority"
import {
  CircleCheckIcon,
  FileArchiveIcon,
  FileAudioIcon,
  FileIcon,
  FileImageIcon,
  FileSpreadsheetIcon,
  FileTextIcon,
  FileVideoIcon,
  PaperclipIcon,
  RotateCwIcon,
  Trash2Icon,
} from "lucide-react"
import { cn } from "@/lib/utils"

import { IconButton } from "@/components/ui/icon-button"
import { Progress } from "@/components/ui/progress"
import { Spinner } from "@/components/ui/spinner"

/** Arquivo exibido no componente (um File serve, ou só nome e tamanho vindos do servidor). */
type FileUploadFile = { name: string; size: number; type?: string }

/** Tamanho legível em português: 820 B, 34,5 KB, 2,1 MB. */
function formatFileSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  const kb = bytes / 1024
  if (kb < 1024) return `${kb.toLocaleString("pt-BR", { maximumFractionDigits: 1 })} KB`
  return `${(kb / 1024).toLocaleString("pt-BR", { maximumFractionDigits: 1 })} MB`
}

// Ícone pelo tipo de arquivo (como o File Type Icon do Nitro, com os ícones do lucide-react).
function FileTypeIcon({ file }: { file: FileUploadFile }) {
  const type = file.type ?? ""
  const ext = file.name.split(".").pop()?.toLowerCase() ?? ""
  if (type.startsWith("image/") || ["jpg", "jpeg", "png", "gif", "webp", "svg"].includes(ext)) return <FileImageIcon />
  if (type.startsWith("video/") || ["mp4", "mov", "avi", "mkv"].includes(ext)) return <FileVideoIcon />
  if (type.startsWith("audio/") || ["mp3", "wav"].includes(ext)) return <FileAudioIcon />
  if (["xls", "xlsx", "csv"].includes(ext)) return <FileSpreadsheetIcon />
  if (["zip", "rar", "7z"].includes(ext)) return <FileArchiveIcon />
  if (["pdf", "doc", "docx", "txt"].includes(ext)) return <FileTextIcon />
  return <FileIcon />
}

// Mesmo formato do atributo accept do HTML: ".pdf,image/*,application/zip".
function matchesAccept(file: File, accept?: string) {
  if (!accept) return true
  const name = file.name.toLowerCase()
  return accept.split(",").some((raw) => {
    const rule = raw.trim().toLowerCase()
    if (rule.startsWith(".")) return name.endsWith(rule)
    if (rule.endsWith("/*")) return file.type.startsWith(rule.slice(0, -1))
    return file.type === rule
  })
}

// Cartão: base no Attachment oficial do shadcn, trazido à mão e adaptado às escalas do Aurora.
// Estados: idle (vazio, tracejado), uploading, error e done.
const cardVariants = cva(
  "group/file-upload relative flex w-full min-w-[0px] rounded-sm border-default border-divider bg-background-6 text-text-1 transition-colors focus-within:ring-(length:--aurora-stroke-focus) focus-within:ring-focus/md has-[>button:enabled]:hover:bg-background-4 data-disabled:cursor-not-allowed data-disabled:opacity-md data-[state=error]:border-invalid data-[state=idle]:border-dashed data-[state=idle]:border-field",
  {
    variants: {
      size: {
        default: "gap-md typo-body-md-regular",
        sm: "gap-sm typo-body-sm-regular",
      },
      orientation: {
        horizontal: "items-center",
        // um bloco compacto de 160px (como o Attachment vertical do shadcn), não a largura toda
        vertical: "w-[160px] flex-col items-center text-center",
      },
    },
  }
)

// Borda interna: ícone em quadro fica mais perto da borda; só o ícone segue o GUpload (16px).
const cardPadding = {
  default: { icon: "p-sm", plain: "p-lg" },
  sm: { icon: "p-xs", plain: "p-sm" },
}

// Cor do ícone: na cor do texto (vazio e enviando); colorido só como retorno — erro em vermelho
// (par do Alert) e concluído no verde da marca, cheio com ícone branco (no fundo claro não teria contraste). Ícone: 16px; 24px na vertical.
const mediaVariants = cva(
  "relative flex shrink-0 items-center justify-center [&_svg]:pointer-events-none [&_svg]:size-[16px] group-data-[orientation=vertical]/file-upload:[&_svg]:size-[24px]",
  {
    variants: {
      media: {
        // quadro de 40px com ícone de 20px (32/16 no sm, 48/24 na vertical)
        // (no hover do vazio o cartão fica background-4, então o quadro escurece um passo para não sumir)
        icon: "aspect-square w-[40px] rounded-xs bg-background-4 text-text-1 group-data-[size=sm]/file-upload:w-[32px] group-data-[orientation=vertical]/file-upload:w-[48px] group-data-[state=idle]/file-upload:group-has-[>button:enabled]/file-upload:group-hover/file-upload:bg-background-3 group-data-[state=done]/file-upload:bg-alerts-1 group-data-[state=done]/file-upload:text-link-10 group-data-[state=error]/file-upload:bg-alerts-8 group-data-[state=error]/file-upload:text-alerts-9 [&_svg]:size-[20px] group-data-[size=sm]/file-upload:[&_svg]:size-[16px]",
        // só o ícone, alinhado à primeira linha do título (como o GUpload)
        plain: "h-[24px] self-start text-text-1 group-data-[size=sm]/file-upload:h-[20px] group-data-[orientation=vertical]/file-upload:h-auto group-data-[orientation=vertical]/file-upload:self-center group-data-[state=done]/file-upload:text-alerts-1 group-data-[state=error]/file-upload:text-alerts-7",
      },
    },
  }
)

type CardProps = Omit<React.ComponentProps<"div">, "title"> & {
  state: "idle" | "uploading" | "error" | "done"
  size: "default" | "sm"
  orientation: "horizontal" | "vertical"
  media: "icon" | "plain"
  disabled: boolean
  icon: React.ReactNode
  title: React.ReactNode
  /** O título é o nome do arquivo (corta com reticências em vez de quebrar a linha). */
  isFileName?: boolean
  description?: React.ReactNode
  /** Torna o cartão inteiro clicável (escolher arquivo, tentar de novo), por baixo das ações. */
  onCardClick?: () => void
  cardLabel?: string
  actions?: React.ReactNode
}

function Card({
  className,
  state,
  size,
  orientation,
  media,
  disabled,
  icon,
  title,
  isFileName = false,
  description,
  onCardClick,
  cardLabel,
  actions,
  children,
  ...props
}: CardProps) {
  return (
    <div
      data-slot="file-upload-card"
      data-state={state}
      data-size={size}
      data-orientation={orientation}
      data-media={media}
      data-disabled={disabled || undefined}
      className={cn(cardVariants({ size, orientation }), cardPadding[size][media], className)}
      {...props}
    >
      {onCardClick && (
        <button
          type="button"
          aria-label={cardLabel}
          disabled={disabled}
          onClick={onCardClick}
          className="absolute inset-none z-base rounded-sm outline-none disabled:cursor-not-allowed"
        />
      )}
      <div data-slot="file-upload-media" className={cn(mediaVariants({ media }))}>
        {icon}
      </div>
      <div className="flex max-w-full min-w-[0px] flex-1 flex-col gap-xxs group-data-[orientation=vertical]/file-upload:w-full group-data-[orientation=vertical]/file-upload:items-center">
        {/* nome de arquivo corta com reticências; a chamada (vazio ou erro) quebra a linha */}
        <span className={cn("block max-w-full min-w-[0px] typo-body-md-bold group-data-[size=sm]/file-upload:typo-body-sm-bold", isFileName && "truncate")}>
          {title}
        </span>
        {description && (
          <span className="block max-w-full min-w-[0px] typo-body-sm-regular text-text-3 group-data-[state=error]/file-upload:text-alerts-7">
            {description}
          </span>
        )}
        {children}
      </div>
      {actions && (
        <div className="relative z-raised flex shrink-0 items-center gap-xs group-data-[media=plain]/file-upload:self-start group-data-[orientation=vertical]/file-upload:absolute group-data-[orientation=vertical]/file-upload:top-sm group-data-[orientation=vertical]/file-upload:right-sm">
          {actions}
        </div>
      )}
    </div>
  )
}

type FileUploadProps = Omit<React.ComponentProps<"div">, "title"> & {
  /** Texto de chamada quando está vazio. */
  title?: React.ReactNode
  /** Requisitos do arquivo (tipos e tamanho aceitos). */
  description?: React.ReactNode
  /** Tipos aceitos, no formato do HTML (ex.: ".pdf,image/*"). */
  accept?: string
  /** Tamanho máximo, em bytes. */
  maxSize?: number
  disabled?: boolean
  /** Nome do campo, para formulários. */
  name?: string
  /** icon: ícone num quadro; plain: só o ícone (como o GUpload). */
  media?: "icon" | "plain"
  size?: "default" | "sm"
  /** vertical: ícone acima do texto, centralizado. */
  orientation?: "horizontal" | "vertical"
  /** Arquivo escolhido. Sem ele, o componente mostra a área de envio. */
  file?: FileUploadFile | null
  /** Situação do envio do arquivo escolhido. */
  status?: "uploading" | "done" | "error"
  /** Progresso do envio, de 0 a 100. Sem ele, o envio mostra o Spinner (carregando, sem porcentagem). */
  progress?: number
  /** Mensagem de erro (ex.: falha no envio, campo obrigatório). */
  error?: string
  /** Chamado com o arquivo escolhido, já validado (tipo e tamanho). */
  onFileSelect?: (file: File) => void
  /** Mostra a lixeira e é chamado ao remover o arquivo. */
  onRemove?: () => void
  /** Chamado ao tentar de novo um envio que falhou. Sem ele, abre a escolha de arquivo. */
  onRetry?: () => void
}

// Envio de um arquivo, no modelo do GUpload do Genesis: um cartão que muda de estado —
// vazio (área tracejada; clique ou arraste), enviando (barra de progresso ou, sem progresso, o Spinner),
// concluído e erro.
// Valida tipo e tamanho antes de entregar o arquivo.
function FileUpload({
  className,
  title = "Selecionar arquivo",
  description,
  accept,
  maxSize,
  disabled = false,
  name,
  media = "plain",
  size = "default",
  orientation = "horizontal",
  file,
  status = "done",
  progress,
  error,
  onFileSelect,
  onRemove,
  onRetry,
  ...props
}: FileUploadProps) {
  const inputRef = React.useRef<HTMLInputElement>(null)
  const [validationError, setValidationError] = React.useState<string | null>(null)
  const [dragging, setDragging] = React.useState(false)

  const openPicker = () => inputRef.current?.click()

  function handleFiles(list: FileList | null) {
    const picked = list?.[0]
    if (!picked) return
    if (!matchesAccept(picked, accept)) {
      setValidationError("Tipo de arquivo não aceito.")
    } else if (maxSize && picked.size > maxSize) {
      setValidationError(`Arquivo maior que ${formatFileSize(maxSize)}.`)
    } else {
      setValidationError(null)
      onFileSelect?.(picked)
    }
    if (inputRef.current) inputRef.current.value = ""
  }

  // área de envio (vazio ou erro sem arquivo): aceita soltar arquivo e destaca ao arrastar
  const dropzone = disabled
    ? {}
    : {
        "data-dragging": dragging || undefined,
        onDragOver: (e: React.DragEvent) => {
          e.preventDefault()
          setDragging(true)
        },
        onDragLeave: () => setDragging(false),
        onDrop: (e: React.DragEvent) => {
          e.preventDefault()
          setDragging(false)
          handleFiles(e.dataTransfer.files)
        },
      }
  // ação (remover, tentar de novo) na cor do texto, com ícone de 16px
  const actionClass = "text-text-1 [&_svg]:size-[16px]"
  const dropzoneClass =
    "data-dragging:data-[state]:border-solid data-dragging:data-[state]:border-link-4 data-dragging:data-[state]:bg-background-4"

  const shared = { size, orientation, media, disabled }
  const uploadFailed = Boolean(file) && status === "error"
  const errorMessage = validationError ?? (uploadFailed || !file ? error : undefined)

  let card: React.ReactNode
  if (file && !uploadFailed) {
    const uploading = status === "uploading"
    const loading = uploading && progress == null
    card = (
      <Card
        {...shared}
        state={status === "uploading" ? "uploading" : "done"}
        icon={
          status === "done" ? <CircleCheckIcon /> : loading ? <Spinner size="sm" tone="inherit" /> : <FileTypeIcon file={file} />
        }
        title={file.name}
        isFileName
        description={
          loading
            ? `${formatFileSize(file.size)} · Enviando...`
            : uploading
              ? `${formatFileSize(file.size)} · ${Math.round(progress ?? 0)}%`
              : formatFileSize(file.size)
        }
        actions={
          onRemove && (
            <IconButton variant="ghost" size="xs" className={actionClass} aria-label="Remover arquivo" onClick={onRemove} disabled={disabled}>
              <Trash2Icon />
            </IconButton>
          )
        }
      >
        {uploading && !loading && (
          <Progress value={progress} aria-label={`Enviando ${file.name}`} className="mt-xs" />
        )}
      </Card>
    )
  } else if (errorMessage) {
    const retry = uploadFailed && onRetry ? onRetry : openPicker
    card = (
      <Card
        {...shared}
        {...(!uploadFailed && dropzone)}
        state="error"
        className={cn(!uploadFailed && dropzoneClass)}
        icon={<PaperclipIcon />}
        title={uploadFailed && file ? file.name : "Toque para anexar"}
        isFileName={uploadFailed}
        description={<span role="alert">{errorMessage}</span>}
        onCardClick={retry}
        cardLabel={uploadFailed ? "Tentar enviar de novo" : "Escolher arquivo"}
        actions={
          <IconButton variant="ghost" size="xs" className={actionClass} aria-label="Tentar de novo" onClick={retry} disabled={disabled}>
            <RotateCwIcon />
          </IconButton>
        }
      />
    )
  } else {
    card = (
      <Card
        {...shared}
        {...dropzone}
        state="idle"
        className={cn(dropzoneClass, "has-[>button:enabled]:hover:border-link-4")}
        icon={<PaperclipIcon />}
        title={title}
        description={description}
        onCardClick={openPicker}
        cardLabel={typeof title === "string" ? title : "Selecionar arquivo"}
      />
    )
  }

  return (
    <div data-slot="file-upload" className={cn(orientation === "vertical" ? "w-fit" : "w-full", className)} {...props}>
      {card}
      <input
        ref={inputRef}
        type="file"
        name={name}
        accept={accept}
        disabled={disabled}
        tabIndex={-1}
        aria-hidden
        className="sr-only"
        onChange={(e) => handleFiles(e.target.files)}
      />
    </div>
  )
}

export { FileUpload, formatFileSize }
export type { FileUploadFile }
