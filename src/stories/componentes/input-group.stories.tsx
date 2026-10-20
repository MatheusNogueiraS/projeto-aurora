import type { Meta, StoryObj } from "@storybook/react-vite"
import { MailIcon, SearchIcon } from "lucide-react"

import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
  InputGroupTextarea,
} from "@/components/ui/input-group"

const meta = {
  title: "Componentes/Input Group",
  component: InputGroup,
  tags: ["autodocs"],
  parameters: {
    docs: { description: { component: "Campo com elementos colados: ícone, texto fixo ou botão." } },
  },
} satisfies Meta<typeof InputGroup>

export default meta
type Story = StoryObj<typeof meta>

export const ComIcone: Story = {
  name: "Com ícone",
  render: () => (
    <InputGroup className="max-w-popover">
      <InputGroupAddon>
        <SearchIcon />
      </InputGroupAddon>
      <InputGroupInput placeholder="Buscar proposta" />
    </InputGroup>
  ),
}

export const ComTextoEBotao: Story = {
  name: "Com texto e botão",
  render: () => (
    <InputGroup className="max-w-popover">
      <InputGroupAddon>
        <MailIcon />
      </InputGroupAddon>
      <InputGroupInput placeholder="email" />
      <InputGroupAddon align="inline-end">
        <InputGroupText>@bmg.com.br</InputGroupText>
        <InputGroupButton variant="secondary">Enviar</InputGroupButton>
      </InputGroupAddon>
    </InputGroup>
  ),
}

export const ComTextarea: Story = {
  name: "Com textarea",
  render: () => (
    <InputGroup className="max-w-popover">
      <InputGroupTextarea placeholder="Descreva o problema" />
      <InputGroupAddon align="block-end">
        <InputGroupButton variant="default" className="ml-auto">
          Enviar
        </InputGroupButton>
      </InputGroupAddon>
    </InputGroup>
  ),
}
