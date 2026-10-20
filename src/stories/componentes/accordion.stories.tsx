import type { Meta, StoryObj } from "@storybook/react-vite"

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

const perguntas = [
  { id: "a", pergunta: "O que é o consignado?", resposta: "Um empréstimo com parcelas descontadas direto na folha." },
  { id: "b", pergunta: "Quais as taxas?", resposta: "As taxas variam conforme o convênio." },
  { id: "c", pergunta: "Posso antecipar parcelas?", resposta: "Sim, com desconto proporcional dos juros." },
]

const meta = {
  title: "Componentes/Accordion",
  component: Accordion,
  tags: ["autodocs"],
  parameters: {
    docs: { description: { component: "Lista de seções que abrem e fecham. Bom para perguntas frequentes e detalhes opcionais." } },
  },
  args: { type: "single", collapsible: true },
  render: (args) => (
    <Accordion {...args} className="max-w-popover">
      {perguntas.map((p) => (
        <AccordionItem key={p.id} value={p.id}>
          <AccordionTrigger>{p.pergunta}</AccordionTrigger>
          <AccordionContent>{p.resposta}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  ),
} satisfies Meta<typeof Accordion>

export default meta
type Story = StoryObj<typeof meta>

export const Fechado: Story = {}
export const Aberto: Story = { args: { type: "single", collapsible: true, defaultValue: "a" } }
export const VariosAbertos: Story = { name: "Vários abertos", args: { type: "multiple", defaultValue: ["a", "b"] } }
