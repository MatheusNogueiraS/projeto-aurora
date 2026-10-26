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
const selections = ["None", ...convenios]
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
  selected = "None",
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
    <Combobox key={selected} items={convenios} defaultValue={selected === "None" ? undefined : selected}>
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
  title: "Components/Combobox",
  tags: ["autodocs"],
  parameters: {
    docs: { description: { component: "Campo com busca e lista de sugestões; use quando a lista for longa demais para um Select." } },
  },
  args: {
    label: "Convênio",
    optional: false,
    required: false,
    selected: "None",
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
    label: { name: "Label", control: "text" },
    optional: { name: "Optional", control: "boolean" },
    required: { name: "Required", control: "boolean" },
    selected: { name: "Selected", control: "select", options: selections, if: { arg: "invalid", truthy: false }, table: { defaultValue: { summary: '"None"' } } },
    showHint: { name: "Hint", control: "boolean" },
    hint: { name: "Hint · content", control: "text", if: { arg: "showHint" } },
    showIconLeading: { name: "Icon Left", control: "boolean", table: { category: "Icons" } },
    iconLeadingName: { name: "Icon Left · icon", control: "select", options: Object.keys(icons), if: { arg: "showIconLeading" }, table: { category: "Icons" } },
    showTrigger: { name: "Trigger", control: "boolean", table: { defaultValue: { summary: "true" } } },
    showClear: { name: "Clear button", control: "boolean" },
    size: { name: "Size", control: "inline-radio", options: sizes, table: { defaultValue: { summary: '"default"' } } },
    invalid: { name: "Error", control: "boolean", if: { arg: "disabled", truthy: false }, table: { category: "State" } },
    errorMessage: { name: "Error · message", control: "text", if: { arg: "invalid" }, table: { category: "State" } },
    disabled: { name: "Disabled", control: "boolean", if: { arg: "invalid", truthy: false }, table: { category: "State" } },
  },
  render: (args) => <StoryCombobox {...args} selected={args.invalid ? "None" : args.selected} />,
} satisfies Meta<ComboboxStoryArgs>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Variants: Story = {
  render: (args) => (
    <div className="flex flex-col gap-xl">
      <StoryCombobox {...args} />
      <StoryCombobox {...args} selected="INSS" />
      <StoryCombobox {...args} optional showHint={false} />
      <StoryCombobox {...args} showIconLeading showClear selected="SIAPE" />
      <StoryCombobox {...args} invalid disabled={false} selected="None" />
    </div>
  ),
}

export const Sizes: Story = {
  render: (args) => (
    <div className="flex flex-col gap-xl">
      {sizes.map((size) => (
        <StoryCombobox key={size} {...args} size={size} label={`Tamanho ${size}`} />
      ))}
    </div>
  ),
}

export const Disabled: Story = { args: { disabled: true, selected: "INSS" } }
