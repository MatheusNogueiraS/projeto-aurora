import type { Meta, StoryObj } from "@storybook/react-vite"

import { Page, Section } from "./doc-ui"
import { resolve } from "./tokens-data"

// Os logos são arquivos de imagem (SVG) em src/assets/logos/<família>/<fundo>.svg, exportados do
// Figma "Genesis tokens". Ficam com as cores originais da marca: logo não muda com o tema.
const files = import.meta.glob<string>("../../assets/logos/*/*.svg", { eager: true, query: "?url", import: "default" })

type Family = { id: string; name: string; description?: string }
const groups: { title: string; description: string; families: Family[] }[] = [
  {
    title: "Marca principal",
    description: "O logo completo e o símbolo, para quando o espaço é pequeno (ex.: ícone do app).",
    families: [
      { id: "bmg", name: "Bmg" },
      { id: "bmg-icone", name: "Símbolo Bmg" },
    ],
  },
  {
    title: "Sub-marcas",
    description: "Logos de produtos e áreas do Bmg.",
    families: [
      { id: "grupo-bmg", name: "Grupo Bmg" },
      { id: "bmg-empresas", name: "Bmg Empresas" },
      { id: "bmg-corporate", name: "Bmg Corporate" },
      { id: "bmg-backoffice", name: "Bmg Backoffice" },
      { id: "bmg-blog", name: "Bmg Blog" },
      { id: "bmg-sou-parceiro", name: "Bmg Sou Parceiro" },
      { id: "bmg-correspondente", name: "Bmg Correspondente" },
    ],
  },
  {
    title: "Help",
    description: "O símbolo Help e o logo da Loja Help!",
    families: [
      { id: "help-icone", name: "Símbolo Help" },
      { id: "loja-help", name: "Loja Help!" },
    ],
  },
]

// Fundo de cada variação, lido dos tokens (como nas outras páginas de Fundamentos): as cores da
// marca e o branco e o preto puros, que não mudam com o tema.
const backgrounds: Record<string, string> = {
  laranja: String(resolve("color.brand.1", "light")),
  roxo: String(resolve("color.brand.2", "light")),
  preto: String(resolve("color.neutral.0", "light")),
  branco: String(resolve("color.neutral.100", "light")),
}
const backgroundOf = (variant: string) => backgrounds[variant.split("-")[0]]

const labels: Record<string, string> = { laranja: "Fundo laranja", roxo: "Fundo roxo", preto: "Fundo preto", branco: "Fundo branco" }
function labelOf(variant: string) {
  const [bg, ...rest] = variant.split("-")
  const extras = rest.map((r) => ({ mono: "monocromático", desabilitado: "desabilitado", alt: "alternativo" })[r] ?? r)
  return [labels[bg], ...extras].join(" · ")
}

// ordem das variações na página: as coloridas primeiro, depois as monocromáticas
const order = ["laranja", "branco", "roxo", "preto"]
const rank = (v: string) => order.indexOf(v.split("-")[0]) * 10 + (v.includes("-alt") ? 2 : v.includes("-") ? 1 : 0)

function LogoCard({ family, variant, url }: { family: string; variant: string; url: string }) {
  return (
    <figure className="flex flex-col gap-xs">
      <div
        className="flex h-[136px] items-center justify-center rounded-sm border-default border-divider p-lg"
        style={{ background: backgroundOf(variant) }}
      >
        <img src={url} alt={`${family}, ${labelOf(variant).toLowerCase()}`} className="max-h-[64px] max-w-full" />
      </div>
      <figcaption className="flex items-center justify-between gap-sm typo-body-sm-regular text-text-3">
        {labelOf(variant)}
        <a href={url} download={`${family}-${variant}.svg`} className="text-link-4 underline underline-offset-(--aurora-underline-offset)">
          Baixar SVG
        </a>
      </figcaption>
    </figure>
  )
}

function LogosPage() {
  return (
    <Page
      title="Logos"
      intro="Os logos do Bmg em SVG, em cada fundo em que podem ser usados. Use sempre a versão feita para o fundo da tela e não recolora o logo: as cores vêm prontas no arquivo e não mudam com o tema."
    >
      {groups.map((group) => (
        <Section key={group.title} title={group.title} description={group.description}>
          <div className="flex flex-col gap-xl">
            {group.families.map((fam) => {
              const variants = Object.entries(files)
                .filter(([path]) => path.includes(`/logos/${fam.id}/`))
                .map(([path, url]) => ({ variant: path.split("/").pop()!.replace(".svg", ""), url }))
                .sort((a, b) => rank(a.variant) - rank(b.variant))
              return (
                <div key={fam.id} className="flex flex-col gap-sm">
                  <h3 className="typo-body-lg-bold">{fam.name}</h3>
                  <div className="grid gap-md sm:grid-cols-2 lg:grid-cols-3">
                    {variants.map((v) => (
                      <LogoCard key={v.variant} family={fam.id} {...v} />
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </Section>
      ))}
    </Page>
  )
}

const meta = {
  title: "Foundations/Logos",
  parameters: { layout: "padded" },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const Logos: Story = { render: () => <LogosPage /> }
