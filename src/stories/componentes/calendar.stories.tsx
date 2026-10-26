import * as React from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"
import type { DateRange } from "react-day-picker"

import { Calendar } from "@/components/ui/calendar"

const hoje = new Date()
const emDias = (n: number) => new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate() + n)

// Controles pensados para quem desenha; as opções técnicas do componente ficam fora.
type CalendarStoryArgs = {
  mode: "single" | "range"
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
  return mode === "range" ? (
    <Calendar mode="range" selected={intervalo} onSelect={setIntervalo} {...common} />
  ) : (
    <Calendar mode="single" selected={data} onSelect={setData} {...common} />
  )
}

const meta = {
  title: "Components/Calendar",
  tags: ["autodocs"],
  parameters: { docs: { description: { component: "Escolha de uma data ou de um intervalo de datas." } } },
  args: { mode: "single", months: 1, showOutsideDays: true, monthYearPicker: false, disablePast: false },
  argTypes: {
    mode: { name: "Mode", control: "inline-radio", options: ["single", "range"] },
    months: { name: "Months", control: "inline-radio", options: [1, 2], table: { defaultValue: { summary: "1" } } },
    showOutsideDays: { name: "Outside days", control: "boolean", table: { defaultValue: { summary: "true" } } },
    monthYearPicker: { name: "Month and year picker", control: "boolean" },
    disablePast: { name: "Disable past dates", control: "boolean", table: { category: "State" } },
  },
  render: (args) => <StoryCalendar key={args.mode} {...args} />,
} satisfies Meta<CalendarStoryArgs>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Variants: Story = {
  render: (args) => (
    <div className="flex flex-wrap items-start gap-lg">
      <StoryCalendar {...args} mode="single" />
      <StoryCalendar {...args} mode="range" />
    </div>
  ),
}

export const Disabled: Story = { args: { disablePast: true } }
