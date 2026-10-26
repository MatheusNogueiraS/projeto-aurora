import type { Meta, StoryObj } from "@storybook/react-vite"
import { BuildingIcon, SearchIcon, UserIcon } from "lucide-react"

import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox"

const convenios = ["INSS", "SIAPE", "Forças Armadas", "Governo de São Paulo", "Prefeitura do Rio"]
const selections = ["Nenhum", ...convenios]
const sizes = ["sm", "default", "lg"] as const
// ícones que dá para escolher nos controles (no código, qualquer ícone do lucide-react serve)
const icons = { Search: SearchIcon, Building: BuildingIcon, User: UserIcon }
type IconName = keyof typeof icons

// Controles no mesmo padrão do Input: label (sempre flutuante, com opcional/obrigatório), valor,
// hint, ícone, botões do campo, tamanho e estados.
type ComboboxStoryArgs = {
  label: string
  optional: boolean
  required: boolean
  selected: string
  showHint: boolean
  hint: string
  showIconLeading: boolean
  iconLeadingName: IconName
  showTrigger: boolean
  showClear: boolean
  size: (typeof sizes)[number]
  invalid: boolean
  errorMessage: string
  disabled: boolean
}

// controles escondidos não chegam até aqui, por isso os padrões
function StoryCombobox({
  label = "Convênio",
  optional = false,
  required = false,
  selected = "Nenhum",
  showHint = true,
  hint = "Escolha o convênio da proposta.",
  showIconLeading = false,
  iconLeadingName = "Search",
  showTrigger = true,
  showClear = false,
  size = "default",
  invalid = false,
  errorMessage = "Escolha um convênio.",
  disabled = false,
}: Partial<ComboboxStoryArgs>) {
  return (
    <Combobox key={selected} items={convenios} defaultValue={selected === "Nenhum" ? undefined : selected}>
      <ComboboxInput
        className="max-w-[312px]"
        label={label}
        optional={optional}
        required={required}
        hint={showHint ? hint : undefined}
        iconLeading={showIconLeading ? icons[iconLeadingName] : undefined}
        showTrigger={showTrigger}
        showClear={showClear}
        size={size}
        disabled={disabled}
        invalid={invalid}
        errorMessage={errorMessage}
      />
      <ComboboxContent>
        <ComboboxEmpty>Nenhum convênio encontrado.</ComboboxEmpty>
        <ComboboxList>
          {(item: string) => (
            <ComboboxItem key={item} value={item}>
              {item}
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  )
}

const meta = {
  title: "Componentes/Combobox",
  tags: ["autodocs"],
  parameters: {
    docs: { description: { component: "Campo com busca e lista de sugestões, com label e dica como o Input. Use quando a lista for longa demais para um Select." } },
  },
  args: {
    label: "Convênio",
    optional: false,
    required: false,
    selected: "Nenhum",
    showHint: true,
    hint: "Escolha o convênio da proposta.",
    showIconLeading: false,
    iconLeadingName: "Search",
    showTrigger: true,
    showClear: false,
    size: "default",
    invalid: false,
    errorMessage: "Escolha um convênio.",
    disabled: false,
  },
  argTypes: {
    label: { name: "Label", control: "text", description: "Nome do campo, dentro dele; ao focar ou escolher, diminui e sobe." },
    optional: { name: "Opcional", control: "boolean", description: "Mostra \"(opcional)\" ao lado do label." },
    required: { name: "Obrigatório", control: "boolean", description: "Mostra o asterisco ao lado do label." },
    selected: { name: "Selecionado", control: "select", options: selections, description: "Opção já escolhida.", if: { arg: "invalid", truthy: false } },
    showHint: { name: "Hint", control: "boolean", description: "Texto de ajuda embaixo do campo." },
    hint: { name: "Hint · conteúdo", control: "text", if: { arg: "showHint" } },
    showIconLeading: { name: "Icon Left", control: "boolean", description: "Ícone dentro do campo, à esquerda.", table: { category: "Ícones" } },
    iconLeadingName: { name: "Icon Left · ícone", control: "select", options: Object.keys(icons), if: { arg: "showIconLeading" }, table: { category: "Ícones" } },
    showTrigger: { name: "Botão de abrir", control: "boolean", description: "Mostra a seta que abre a lista." },
    showClear: { name: "Botão de limpar", control: "boolean", description: "Mostra o botão que apaga a escolha." },
    size: { name: "Tamanho", control: "inline-radio", options: sizes, description: "sm (41px), default (47px) ou lg (54px), as mesmas alturas do Input, com espaço para o label subir." },
    invalid: { name: "Erro", control: "boolean", description: "Escolha obrigatória não feita.", if: { arg: "disabled", truthy: false }, table: { category: "Estado" } },
    errorMessage: { name: "Erro · mensagem", control: "text", if: { arg: "invalid" }, table: { category: "Estado" } },
    disabled: { name: "Desabilitado", control: "boolean", description: "Bloqueia o campo. Não fica em erro.", if: { arg: "invalid", truthy: false }, table: { category: "Estado" } },
  },
  render: (args) => <StoryCombobox {...args} selected={args.invalid ? "Nenhum" : args.selected} />,
} satisfies Meta<ComboboxStoryArgs>

export default meta
type Story = StoryObj<typeof meta>

export const Padrao: Story = { name: "Padrão" }

export const Variantes: Story = {
  render: (args) => (
    <div className="flex flex-col gap-xl">
      <StoryCombobox {...args} />
      <StoryCombobox {...args} selected="INSS" />
      <StoryCombobox {...args} optional showHint={false} />
      <StoryCombobox {...args} showIconLeading showClear selected="SIAPE" />
      <StoryCombobox {...args} invalid disabled={false} selected="Nenhum" />
    </div>
  ),
}

export const Tamanhos: Story = {
  render: (args) => (
    <div className="flex flex-col gap-xl">
      {sizes.map((size) => (
        <StoryCombobox key={size} {...args} size={size} label={`Tamanho ${size}`} />
      ))}
    </div>
  ),
}

export const Desabilitado: Story = { args: { disabled: true, selected: "INSS" } }
