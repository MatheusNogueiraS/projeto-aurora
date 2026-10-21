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

const prazos = ["12 meses", "24 meses", "48 meses"] as const
const selections = ["Nenhum", ...prazos] as const
const sizes = ["sm", "default", "lg"] as const

// Controles no padrão do painel do Figma: texto, valor, tamanho e estados.
type SelectStoryArgs = {
  placeholder: string
  selected: (typeof selections)[number]
  size: (typeof sizes)[number]
  open: boolean
  invalid: boolean
  disabled: boolean
}

function StorySelect({ placeholder, selected = "Nenhum", size, open, invalid, disabled }: SelectStoryArgs) {
  const value = selected === "Nenhum" ? undefined : selected
  return (
    <Select key={`${selected}-${String(open)}`} defaultValue={value} defaultOpen={open} disabled={disabled}>
      <SelectTrigger size={size} aria-invalid={invalid || undefined} aria-label="Prazo">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Prazos</SelectLabel>
          {prazos.map((p) => (
            <SelectItem key={p} value={p}>
              {p}
            </SelectItem>
          ))}
          <SelectItem value="84 meses" disabled>
            84 meses
          </SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}

const meta = {
  title: "Componentes/Select",
  tags: ["autodocs"],
  parameters: { docs: { description: { component: "Escolha de uma opção numa lista fechada." } } },
  args: { placeholder: "Escolha um prazo", selected: "Nenhum", size: "default", open: false, invalid: false, disabled: false },
  argTypes: {
    placeholder: { name: "Placeholder", control: "text", description: "Texto quando nada foi escolhido." },
    selected: { name: "Selecionado", control: "inline-radio", options: selections, description: "Opção já escolhida.", if: { arg: "invalid", truthy: false } },
    size: { name: "Tamanho", control: "inline-radio", options: sizes, description: "sm (31px), default (39px) ou lg (42px): as alturas do Button." },
    open: { name: "Aberto", control: "boolean", description: "Mostra a lista aberta.", if: { arg: "disabled", truthy: false }, table: { category: "Estado" } },
    invalid: { name: "Erro", control: "boolean", description: "Escolha obrigatória não feita. Some ao escolher.", if: { arg: "disabled", truthy: false }, table: { category: "Estado" } },
    disabled: { name: "Desabilitado", control: "boolean", description: "Bloqueia a escolha.", if: { arg: "invalid", truthy: false }, table: { category: "Estado" } },
  },
  render: (args) => <StorySelect {...args} selected={args.invalid ? "Nenhum" : args.selected} />,
} satisfies Meta<SelectStoryArgs>

export default meta
type Story = StoryObj<typeof meta>

export const Padrao: Story = { name: "Padrão" }

export const Tamanhos: Story = {
  render: (args) => (
    <div className="flex flex-wrap items-center gap-md">
      {sizes.map((size) => (
        <StorySelect key={size} {...args} size={size} open={false} />
      ))}
    </div>
  ),
}

export const Desabilitado: Story = { args: { disabled: true, selected: "24 meses" } }
