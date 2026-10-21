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
  divider: "Seta" | "Barra"
  homeIcon: boolean
  homeIconOnly: boolean
}

function StoryBreadcrumb({ amount, divider, homeIcon, homeIconOnly }: BreadcrumbStoryArgs) {
  // pega o início e os últimos níveis, para sempre terminar na página atual
  const items = [niveis[0], ...niveis.slice(niveis.length - (amount - 1))]
  return (
    <Breadcrumb divider={divider === "Barra" ? "slash" : "arrow"}>
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
  title: "Componentes/Breadcrumb",
  tags: ["autodocs"],
  parameters: {
    docs: { description: { component: "Mostra onde a pessoa está e permite voltar para níveis anteriores. O último nível é a página atual." } },
  },
  args: { amount: 3, divider: "Seta", homeIcon: false, homeIconOnly: false },
  argTypes: {
    amount: { name: "Níveis", control: "inline-radio", options: [2, 3, 4], description: "Quantidade de níveis, contando a página atual. Com 4, os do meio viram reticências." },
    divider: { name: "Divisor", control: "inline-radio", options: ["Seta", "Barra"], description: "Separador entre os níveis." },
    homeIcon: { name: "Ícone de início", control: "boolean", description: "Mostra um ícone no primeiro nível.", table: { category: "Ícone" } },
    homeIconOnly: { name: "Apenas ícone", control: "boolean", description: "Mostra só o ícone no primeiro nível.", if: { arg: "homeIcon" }, table: { category: "Ícone" } },
  },
  render: (args) => <StoryBreadcrumb {...args} />,
} satisfies Meta<BreadcrumbStoryArgs>

export default meta
type Story = StoryObj<typeof meta>

export const Padrao: Story = { name: "Padrão" }

export const Variantes: Story = {
  render: (args) => (
    <div className="flex flex-col gap-md">
      <StoryBreadcrumb {...args} divider="Seta" />
      <StoryBreadcrumb {...args} divider="Barra" />
      <StoryBreadcrumb {...args} divider="Seta" homeIcon homeIconOnly />
      <StoryBreadcrumb {...args} amount={4} />
    </div>
  ),
}
