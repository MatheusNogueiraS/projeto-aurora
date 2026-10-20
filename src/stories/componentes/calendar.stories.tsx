import * as React from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"
import type { DateRange } from "react-day-picker"

import { Calendar } from "@/components/ui/calendar"

const meta = {
  title: "Componentes/Calendar",
  component: Calendar,
  tags: ["autodocs"],
  parameters: { docs: { description: { component: "Escolha de uma data ou de um intervalo de datas." } } },
} satisfies Meta<typeof Calendar>

export default meta
type Story = StoryObj<typeof meta>

function DataUnica() {
  const [data, setData] = React.useState<Date | undefined>(new Date())
  return <Calendar mode="single" selected={data} onSelect={setData} className="rounded-sm border-default border-divider" />
}

function Intervalo() {
  const [intervalo, setIntervalo] = React.useState<DateRange | undefined>(() => {
    const hoje = new Date()
    return { from: hoje, to: new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate() + 5) }
  })
  return (
    <Calendar
      mode="range"
      selected={intervalo}
      onSelect={setIntervalo}
      className="rounded-sm border-default border-divider"
    />
  )
}

export const DataUnicaStory: Story = { name: "Data única", render: () => <DataUnica /> }
export const IntervaloStory: Story = { name: "Intervalo", render: () => <Intervalo /> }
