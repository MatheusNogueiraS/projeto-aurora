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

// Controles no padrão do painel do Figma: texto, valor, ícone, botões do campo, tamanho e estados.
type ComboboxStoryArgs = {
  placeholder: string
  selected: string
  showIconLeading: boolean
  iconLeadingName: IconName
  showTrigger: boolean
  showClear: boolean
  size: (typeof sizes)[number]
  invalid: boolean
  disabled: boolean
}

function StoryCombobox({
  placeholder,
  selected = "Nenhum",
  showIconLeading = false,
  iconLeadingName = "Search",
  showTrigger,
  showClear,
  size = "default",
  invalid,
  disabled,
}: ComboboxStoryArgs) {
  return (
    <Combobox key={selected} items={convenios} defaultValue={selected === "Nenhum" ? undefined : selected}>
      <ComboboxInput
        placeholder={placeholder}
        iconLeading={showIconLeading ? icons[iconLeadingName] : undefined}
        showTrigger={showTrigger}
        showClear={showClear}
        size={size}
        disabled={disabled}
        aria-invalid={invalid || undefined}
        aria-label="Convênio"
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
    docs: { description: { component: "Campo com busca e lista de sugestões. Use quando a lista for longa demais para um Select." } },
  },
  args: {
    placeholder: "Escolha o convênio",
    selected: "Nenhum",
    showIconLeading: false,
    iconLeadingName: "Search",
    showTrigger: true,
    showClear: false,
    size: "default",
    invalid: false,
    disabled: false,
  },
  argTypes: {
    placeholder: { name: "Placeholder", control: "text", description: "Texto quando nada foi escolhido." },
    selected: { name: "Selecionado", control: "select", options: selections, description: "Opção já escolhida.", if: { arg: "invalid", truthy: false } },
    showIconLeading: { name: "Icon Left", control: "boolean", description: "Ícone dentro do campo, à esquerda.", table: { category: "Ícones" } },
    iconLeadingName: { name: "Icon Left · ícone", control: "select", options: Object.keys(icons), if: { arg: "showIconLeading" }, table: { category: "Ícones" } },
    showTrigger: { name: "Botão de abrir", control: "boolean", description: "Mostra a seta que abre a lista." },
    showClear: { name: "Botão de limpar", control: "boolean", description: "Mostra o botão que apaga a escolha." },
    size: { name: "Tamanho", control: "inline-radio", options: sizes, description: "sm (41px), default (47px) ou lg (54px), as mesmas alturas do Input." },
    invalid: { name: "Erro", control: "boolean", description: "Escolha obrigatória não feita.", if: { arg: "disabled", truthy: false }, table: { category: "Estado" } },
    disabled: { name: "Desabilitado", control: "boolean", description: "Bloqueia o campo.", if: { arg: "invalid", truthy: false }, table: { category: "Estado" } },
  },
  render: (args) => <StoryCombobox {...args} selected={args.invalid ? "Nenhum" : args.selected} />,
} satisfies Meta<ComboboxStoryArgs>

export default meta
type Story = StoryObj<typeof meta>

export const Padrao: Story = { name: "Padrão" }

export const Tamanhos: Story = {
  render: (args) => (
    <div className="flex flex-col gap-xl">
      {sizes.map((size) => (
        <StoryCombobox key={size} {...args} size={size} placeholder={`Tamanho ${size}`} />
      ))}
    </div>
  ),
}

export const Desabilitado: Story = { args: { disabled: true, selected: "INSS" } }
