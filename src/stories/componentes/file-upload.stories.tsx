import * as React from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"

import { FileUpload, type FileUploadFile } from "@/components/ui/file-upload"

const states = ["idle", "uploading", "loading", "done", "error"] as const
type State = (typeof states)[number]
const errorKinds = ["No file", "Upload failed"] as const

const sampleFile: FileUploadFile = { name: "comprovante-de-renda.pdf", size: 1_250_000, type: "application/pdf" }

// Os controles seguem o GUpload do Genesis (estados) e o Attachment do shadcn (mídia, tamanho, orientação).
type FileUploadStoryArgs = {
  state: State
  media: "icon" | "plain"
  size: "sm" | "default"
  orientation: "horizontal" | "vertical"
  title: string
  description: string
  progress: number
  error: string
  errorKind: (typeof errorKinds)[number]
  disabled: boolean
}

function StoryFileUpload({
  state = "idle",
  media,
  size,
  orientation,
  // controles escondidos (Título e Descrição só aparecem no Vazio) não chegam até aqui;
  // os padrões garantem que, ao remover o arquivo, o vazio volte completo
  title = "Selecionar arquivo",
  description = "PDF ou imagem, até 5 MB.",
  progress = 40,
  error = "Não foi possível enviar.",
  errorKind = "No file",
  disabled = false,
}: Partial<FileUploadStoryArgs>) {
  // a key de quem usa recria o componente quando "Estado" muda; aqui escolher e remover continuam funcionando
  const sendFailed = state === "error" && errorKind === "Upload failed"
  const [file, setFile] = React.useState<FileUploadFile | null>(state === "idle" || (state === "error" && !sendFailed) ? null : sampleFile)
  const [failed, setFailed] = React.useState(state === "error")
  return (
    <FileUpload
      className="max-w-[312px]"
      media={media}
      size={size}
      orientation={orientation}
      title={title}
      description={description}
      accept=".pdf,image/*"
      maxSize={5 * 1024 * 1024}
      disabled={disabled}
      file={file}
      status={failed && file ? "error" : state === "uploading" || state === "loading" ? "uploading" : "done"}
      progress={state === "loading" ? undefined : progress}
      error={failed ? error : undefined}
      onFileSelect={(f) => {
        setFailed(false)
        setFile(f)
      }}
      onRemove={() => setFile(null)}
      onRetry={() => setFailed(false)}
    />
  )
}

const meta = {
  title: "Components/File Upload",
  tags: ["autodocs"],
  parameters: {
    docs: { description: { component: "Envio de um arquivo, clicando ou arrastando para a área." } },
  },
  args: {
    state: "idle",
    media: "plain",
    size: "default",
    orientation: "horizontal",
    title: "Selecionar arquivo",
    description: "PDF ou imagem, até 5 MB.",
    progress: 40,
    error: "Não foi possível enviar.",
    errorKind: "No file",
    disabled: false,
  },
  argTypes: {
    state: { name: "State", control: "inline-radio", options: states, table: { defaultValue: { summary: '"idle"' } } },
    media: { name: "Media", control: "inline-radio", options: ["plain", "icon"], table: { defaultValue: { summary: '"plain"' } } },
    size: { name: "Size", control: "inline-radio", options: ["sm", "default"], table: { defaultValue: { summary: '"default"' } } },
    orientation: { name: "Orientation", control: "inline-radio", options: ["horizontal", "vertical"], table: { defaultValue: { summary: '"horizontal"' } } },
    title: { name: "Title", control: "text", if: { arg: "state", eq: "idle" }, table: { defaultValue: { summary: '"Selecionar arquivo"' } } },
    description: { name: "Description", control: "text", if: { arg: "state", eq: "idle" } },
    progress: { name: "Progress", control: { type: "range", min: 0, max: 100, step: 5 }, if: { arg: "state", eq: "uploading" } },
    error: { name: "Error · message", control: "text", if: { arg: "state", eq: "error" } },
    errorKind: { name: "Error · type", control: "inline-radio", options: errorKinds, if: { arg: "state", eq: "error" } },
    disabled: { name: "Disabled", control: "boolean", table: { category: "State" } },
  },
  render: (args) => <StoryFileUpload key={args.state + args.errorKind} {...args} />,
} satisfies Meta<FileUploadStoryArgs>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Variants: Story = {
  render: (args) => (
    <div className={args.orientation === "vertical" ? "flex flex-wrap items-start gap-lg" : "flex flex-col gap-lg"}>
      {states.map((s) => (
        <StoryFileUpload key={s} {...args} state={s} />
      ))}
    </div>
  ),
}

export const Sizes: Story = {
  render: (args) => (
    <div className={args.orientation === "vertical" ? "flex flex-wrap items-start gap-lg" : "flex flex-col gap-lg"}>
      <StoryFileUpload key={"s" + args.state} {...args} size="sm" />
      <StoryFileUpload key={"d" + args.state} {...args} size="default" />
    </div>
  ),
}

export const Disabled: Story = { args: { disabled: true } }
