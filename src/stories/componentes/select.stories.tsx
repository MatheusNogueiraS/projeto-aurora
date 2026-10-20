import type { Meta, StoryObj } from "@storybook/react-vite"

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const meta = {
  title: "Componentes/Select",
  component: Select,
  tags: ["autodocs"],
  parameters: { docs: { description: { component: "Escolha de uma opção numa lista fechada." } } },
} satisfies Meta<typeof Select>

export default meta
type Story = StoryObj<typeof meta>

const Prazos = () => (
  <SelectContent>
    <SelectGroup>
      <SelectLabel>Prazos</SelectLabel>
      <SelectItem value="12">12 meses</SelectItem>
      <SelectItem value="24">24 meses</SelectItem>
      <SelectItem value="48">48 meses</SelectItem>
      <SelectItem value="84" disabled>
        84 meses
      </SelectItem>
    </SelectGroup>
  </SelectContent>
)

export const Vazio: Story = {
  render: () => (
    <Select>
      <SelectTrigger>
        <SelectValue placeholder="Escolha um prazo" />
      </SelectTrigger>
      <Prazos />
    </Select>
  ),
}

export const ComValor: Story = {
  name: "Com valor",
  render: () => (
    <Select defaultValue="24">
      <SelectTrigger>
        <SelectValue />
      </SelectTrigger>
      <Prazos />
    </Select>
  ),
}

export const Pequeno: Story = {
  render: () => (
    <Select defaultValue="12">
      <SelectTrigger size="sm">
        <SelectValue />
      </SelectTrigger>
      <Prazos />
    </Select>
  ),
}

export const ComErro: Story = {
  name: "Com erro",
  render: () => (
    <Select>
      <SelectTrigger aria-invalid>
        <SelectValue placeholder="Escolha um prazo" />
      </SelectTrigger>
      <Prazos />
    </Select>
  ),
}
