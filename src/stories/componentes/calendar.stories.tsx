import * as React from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"
import type { DateRange } from "react-day-picker"

import { Calendar } from "@/components/ui/calendar"

const hoje = new Date()
const emDias = (n: number) => new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate() + n)

// Controles pensados para quem desenha; as opções técnicas do componente ficam fora.
type CalendarStoryArgs = {
  mode: "Data única" | "Intervalo"
  months: 1 | 2
  showOutsideDays: boolean
  monthYearPicker: boolean
  disablePast: boolean
}

function StoryCalendar({ mode, months, showOutsideDays, monthYearPicker, disablePast }: CalendarStoryArgs) {
  const [data, setData] = React.useState<Date | undefined>(hoje)
  const [intervalo, setIntervalo] = React.useState<DateRange | undefined>({ from: hoje, to: emDias(5) })
  const common = {
    numberOfMonths: months,
    showOutsideDays,
    captionLayout: monthYearPicker ? ("dropdown" as const) : ("label" as const),
    disabled: disablePast ? { before: hoje } : undefined,
    className: "rounded-sm border-default border-divider",
  }
  return mode === "Intervalo" ? (
    <Calendar mode="range" selected={intervalo} onSelect={setIntervalo} {...common} />
  ) : (
    <Calendar mode="single" selected={data} onSelect={setData} {...common} />
  )
}

const meta = {
  title: "Componentes/Calendar",
  tags: ["autodocs"],
  parameters: { docs: { description: { component: "Escolha de uma data ou de um intervalo de datas." } } },
  args: { mode: "Data única", months: 1, showOutsideDays: true, monthYearPicker: false, disablePast: false },
  argTypes: {
    mode: { name: "Modo", control: "inline-radio", options: ["Data única", "Intervalo"], description: "Uma data ou um período (início e fim)." },
    months: { name: "Meses", control: "inline-radio", options: [1, 2], description: "Quantos meses aparecem lado a lado." },
    showOutsideDays: { name: "Dias de outros meses", control: "boolean", description: "Mostra os dias do mês anterior e do próximo nas pontas." },
    monthYearPicker: { name: "Seletor de mês e ano", control: "boolean", description: "Troca o título por listas para escolher mês e ano." },
    disablePast: { name: "Bloquear datas passadas", control: "boolean", description: "Impede escolher dias antes de hoje.", table: { category: "Estado" } },
  },
  render: (args) => <StoryCalendar key={args.mode} {...args} />,
} satisfies Meta<CalendarStoryArgs>

export default meta
type Story = StoryObj<typeof meta>

export const Padrao: Story = { name: "Padrão" }

export const Variantes: Story = {
  render: (args) => (
    <div className="flex flex-wrap items-start gap-lg">
      <StoryCalendar {...args} mode="Data única" />
      <StoryCalendar {...args} mode="Intervalo" />
    </div>
  ),
}

export const Desabilitado: Story = { args: { disablePast: true } }
