import * as React from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"
import { BuildingIcon, HouseIcon, LayoutGridIcon, UserIcon, WalletIcon } from "lucide-react"

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

const niveis = ["Início", "Consignado", "Propostas", "Detalhes da proposta"]

// Ícones que dá para escolher para o primeiro nível (no código, qualquer ícone do lucide-react serve).
const icons = { House: HouseIcon, Building: BuildingIcon, LayoutGrid: LayoutGridIcon, User: UserIcon, Wallet: WalletIcon }
type IconName = keyof typeof icons

// Os controles seguem o Breadcrumb do Nitro: quantidade de níveis e ícone de início. O divisor é sempre a seta.
// As reticências não são controle: o componente as mostra sozinho com mais de 3 níveis.
type BreadcrumbStoryArgs = {
  amount: 2 | 3 | 4
  homeIcon: boolean
  homeIconName: IconName
  homeIconOnly: boolean
}

// controles escondidos não chegam até aqui, por isso os padrões
function StoryBreadcrumb({ amount, homeIcon, homeIconName = "House", homeIconOnly = false }: BreadcrumbStoryArgs) {
  // pega o início e os últimos níveis, para sempre terminar na página atual
  const items = [niveis[0], ...niveis.slice(niveis.length - (amount - 1))]
  return (
    <Breadcrumb>
      <BreadcrumbList>
        {items.map((label, i) => {
          const last = i === items.length - 1
          return (
            <React.Fragment key={`${label}-${i}`}>
              <BreadcrumbItem>
                {last ? (
                  <BreadcrumbPage>{label}</BreadcrumbPage>
                ) : i === 0 && homeIcon ? (
                  <BreadcrumbLink href="#" iconLeading={icons[homeIconName]} aria-label={homeIconOnly ? label : undefined}>
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
  args: { amount: 3, homeIcon: false, homeIconName: "House", homeIconOnly: false },
  argTypes: {
    amount: { name: "Levels", control: "inline-radio", options: [2, 3, 4] },
    homeIcon: { name: "Home icon", control: "boolean", table: { category: "Icons" } },
    homeIconName: { name: "Home icon · icon", control: "select", options: Object.keys(icons), if: { arg: "homeIcon" }, table: { category: "Icons" } },
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
      <StoryBreadcrumb {...args} />
      <StoryBreadcrumb {...args} homeIcon />
      <StoryBreadcrumb {...args} homeIcon homeIconOnly />
      <StoryBreadcrumb {...args} amount={4} />
    </div>
  ),
}
