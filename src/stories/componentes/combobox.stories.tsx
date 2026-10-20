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

const meta = {
  title: "Componentes/Combobox",
  component: Combobox,
  tags: ["autodocs"],
  parameters: {
    docs: { description: { component: "Campo com busca e lista de sugestões. Use quando a lista for longa demais para um Select." } },
  },
} satisfies Meta<typeof Combobox>

export default meta
type Story = StoryObj<typeof meta>

const Lista = () => (
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
)

export const ComBotaoDeAbrir: Story = {
  name: "Com botão de abrir",
  render: () => (
    <Combobox items={convenios}>
      <ComboboxInput placeholder="Escolha o convênio" />
      <Lista />
    </Combobox>
  ),
}

export const ComBotaoDeLimpar: Story = {
  name: "Com botão de limpar",
  render: () => (
    <Combobox items={convenios} defaultValue="INSS">
      <ComboboxInput placeholder="Escolha o convênio" showClear />
      <Lista />
    </Combobox>
  ),
}
