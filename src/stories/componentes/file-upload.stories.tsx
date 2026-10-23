import * as React from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"

import { FileUpload, type FileUploadFile } from "@/components/ui/file-upload"

const states = ["Vazio", "Enviando", "Concluído", "Erro"] as const
type State = (typeof states)[number]
const errorKinds = ["Sem arquivo", "Falha no envio"] as const

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
  state = "Vazio",
  media,
  size,
  orientation,
  // controles escondidos (Título e Descrição só aparecem no Vazio) não chegam até aqui;
  // os padrões garantem que, ao remover o arquivo, o vazio volte completo
  title = "Selecionar arquivo",
  description = "PDF ou imagem, até 5 MB.",
  progress = 40,
  error = "Não foi possível enviar.",
  errorKind = "Sem arquivo",
  disabled = false,
}: Partial<FileUploadStoryArgs>) {
  // a key de quem usa recria o componente quando "Estado" muda; aqui escolher e remover continuam funcionando
  const sendFailed = state === "Erro" && errorKind === "Falha no envio"
  const [file, setFile] = React.useState<FileUploadFile | null>(state === "Vazio" || (state === "Erro" && !sendFailed) ? null : sampleFile)
  const [failed, setFailed] = React.useState(state === "Erro")
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
      status={failed && file ? "error" : state === "Enviando" ? "uploading" : "done"}
      progress={progress}
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
  title: "Componentes/FileUpload",
  tags: ["autodocs"],
  parameters: {
    docs: { description: { component: "Envio de um arquivo. Clique ou arraste o arquivo para a área; o tipo e o tamanho são conferidos antes do envio." } },
  },
  args: {
    state: "Vazio",
    media: "plain",
    size: "default",
    orientation: "horizontal",
    title: "Selecionar arquivo",
    description: "PDF ou imagem, até 5 MB.",
    progress: 40,
    error: "Não foi possível enviar.",
    errorKind: "Sem arquivo",
    disabled: false,
  },
  argTypes: {
    state: { name: "Estado", control: "inline-radio", options: states, description: "Vazio, enviando, concluído ou erro." },
    media: { name: "Mídia", control: "inline-radio", options: ["plain", "icon"], description: "plain: só o ícone; icon: ícone num quadro." },
    size: { name: "Tamanho", control: "inline-radio", options: ["sm", "default"], description: "sm (14px) ou default (16px)." },
    orientation: { name: "Orientação", control: "inline-radio", options: ["horizontal", "vertical"], description: "vertical: ícone acima do texto." },
    title: { name: "Título", control: "text", description: "Chamada da área vazia.", if: { arg: "state", eq: "Vazio" } },
    description: { name: "Descrição", control: "text", description: "Requisitos do arquivo.", if: { arg: "state", eq: "Vazio" } },
    progress: { name: "Progresso", control: { type: "range", min: 0, max: 100, step: 5 }, description: "Quanto já foi enviado, de 0 a 100.", if: { arg: "state", eq: "Enviando" } },
    error: { name: "Mensagem de erro", control: "text", if: { arg: "state", eq: "Erro" } },
    errorKind: { name: "Erro · tipo", control: "inline-radio", options: errorKinds, description: "Sem arquivo (ex.: tipo não aceito) ou falha ao enviar um arquivo escolhido.", if: { arg: "state", eq: "Erro" } },
    disabled: { name: "Desabilitado", control: "boolean", description: "Bloqueia a escolha e a remoção.", table: { category: "Estado" } },
  },
  render: (args) => <StoryFileUpload key={args.state + args.errorKind} {...args} />,
} satisfies Meta<FileUploadStoryArgs>

export default meta
type Story = StoryObj<typeof meta>

export const Padrao: Story = { name: "Padrão" }

export const Variantes: Story = {
  render: (args) => (
    <div className={args.orientation === "vertical" ? "flex flex-wrap items-start gap-lg" : "flex flex-col gap-lg"}>
      {states.map((s) => (
        <StoryFileUpload key={s} {...args} state={s} />
      ))}
    </div>
  ),
}

export const Tamanhos: Story = {
  render: (args) => (
    <div className={args.orientation === "vertical" ? "flex flex-wrap items-start gap-lg" : "flex flex-col gap-lg"}>
      <StoryFileUpload key={"s" + args.state} {...args} size="sm" />
      <StoryFileUpload key={"d" + args.state} {...args} size="default" />
    </div>
  ),
}

export const Desabilitado: Story = { args: { disabled: true } }
