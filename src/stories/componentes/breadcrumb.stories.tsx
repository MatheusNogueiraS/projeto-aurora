import * as React from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"
import { HouseIcon } from "lucide-react"

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

const niveis = ["Início", "Consignado", "Propostas", "Detalhes da proposta"]

// Os controles seguem o Breadcrumb do Nitro: quantidade de níveis, divisor e ícone de início.
// As reticências não são controle: o componente as mostra sozinho com mais de 3 níveis.
type BreadcrumbStoryArgs = {
  amount: 2 | 3 | 4
  divider: "arrow" | "slash"
  homeIcon: boolean
  homeIconOnly: boolean
}

function StoryBreadcrumb({ amount, divider, homeIcon, homeIconOnly }: BreadcrumbStoryArgs) {
  // pega o início e os últimos níveis, para sempre terminar na página atual
  const items = [niveis[0], ...niveis.slice(niveis.length - (amount - 1))]
  return (
    <Breadcrumb divider={divider}>
      <BreadcrumbList>
        {items.map((label, i) => {
          const last = i === items.length - 1
          return (
            <React.Fragment key={`${label}-${i}`}>
              <BreadcrumbItem>
                {last ? (
                  <BreadcrumbPage>{label}</BreadcrumbPage>
                ) : i === 0 && homeIcon ? (
                  <BreadcrumbLink href="#" iconLeading={HouseIcon} aria-label={homeIconOnly ? label : undefined}>
                    {homeIconOnly ? null : label}
                  </BreadcrumbLink>
                ) : (
                  <BreadcrumbLink href="#">{label}</BreadcrumbLink>
                )}
              </BreadcrumbItem>
              {!last && <BreadcrumbSeparator />}
            </React.Fragment>
          )
        })}
      </BreadcrumbList>
    </Breadcrumb>
  )
}

const meta = {
  title: "Components/Breadcrumb",
  tags: ["autodocs"],
  parameters: {
    docs: { description: { component: "Mostra onde a pessoa está e permite voltar para níveis anteriores." } },
  },
  args: { amount: 3, divider: "arrow", homeIcon: false, homeIconOnly: false },
  argTypes: {
    amount: { name: "Levels", control: "inline-radio", options: [2, 3, 4] },
    divider: { name: "Divider", control: "inline-radio", options: ["arrow", "slash"], table: { defaultValue: { summary: '"arrow"' } } },
    homeIcon: { name: "Home icon", control: "boolean", table: { category: "Icons" } },
    homeIconOnly: { name: "Icon only", control: "boolean", if: { arg: "homeIcon" }, table: { category: "Icons" } },
  },
  render: (args) => <StoryBreadcrumb {...args} />,
} satisfies Meta<BreadcrumbStoryArgs>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Variants: Story = {
  render: (args) => (
    <div className="flex flex-col gap-md">
      <StoryBreadcrumb {...args} divider="arrow" />
      <StoryBreadcrumb {...args} divider="slash" />
      <StoryBreadcrumb {...args} divider="arrow" homeIcon homeIconOnly />
      <StoryBreadcrumb {...args} amount={4} />
    </div>
  ),
}
