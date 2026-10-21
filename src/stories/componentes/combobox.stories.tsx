import type { Meta, StoryObj } from "@storybook/react-vite"

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

// Controles no padrão do painel do Figma: texto, valor, botões do campo e estados.
type ComboboxStoryArgs = {
  placeholder: string
  selected: string
  showTrigger: boolean
  showClear: boolean
  invalid: boolean
  disabled: boolean
}

function StoryCombobox({ placeholder, selected = "Nenhum", showTrigger, showClear, invalid, disabled }: ComboboxStoryArgs) {
  return (
    <Combobox key={selected} items={convenios} defaultValue={selected === "Nenhum" ? undefined : selected}>
      <ComboboxInput
        placeholder={placeholder}
        showTrigger={showTrigger}
        showClear={showClear}
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
  args: { placeholder: "Escolha o convênio", selected: "Nenhum", showTrigger: true, showClear: false, invalid: false, disabled: false },
  argTypes: {
    placeholder: { name: "Placeholder", control: "text", description: "Texto quando nada foi escolhido." },
    selected: { name: "Selecionado", control: "select", options: selections, description: "Opção já escolhida.", if: { arg: "invalid", truthy: false } },
    showTrigger: { name: "Botão de abrir", control: "boolean", description: "Mostra a seta que abre a lista." },
    showClear: { name: "Botão de limpar", control: "boolean", description: "Mostra o botão que apaga a escolha." },
    invalid: { name: "Erro", control: "boolean", description: "Escolha obrigatória não feita.", if: { arg: "disabled", truthy: false }, table: { category: "Estado" } },
    disabled: { name: "Desabilitado", control: "boolean", description: "Bloqueia o campo.", if: { arg: "invalid", truthy: false }, table: { category: "Estado" } },
  },
  render: (args) => <StoryCombobox {...args} selected={args.invalid ? "Nenhum" : args.selected} />,
} satisfies Meta<ComboboxStoryArgs>

export default meta
type Story = StoryObj<typeof meta>

export const Padrao: Story = { name: "Padrão" }
export const Desabilitado: Story = { args: { disabled: true, selected: "INSS" } }
