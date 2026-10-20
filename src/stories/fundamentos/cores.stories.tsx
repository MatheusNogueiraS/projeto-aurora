import type { Meta, StoryObj } from "@storybook/react-vite"

import { Grid, Page, Section, TokenCard } from "./doc-ui"
import { cssVar, foundation, group, resolve, semantic, type Token } from "./tokens-data"

const meta = {
  title: "Fundamentos/Cores",
  parameters: { layout: "padded" },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

/** Amostra de cor semântica: usa a variável CSS, então acompanha o tema ativo. */
const SemanticSwatch = ({ token }: { token: Token }) => (
  <div className="size-control-lg rounded-item border-default border-divider" style={{ background: cssVar(token.id) }} />
)

/** Amostra de cor da fundação: usa o hex do JSON (átomos não viram variável de componente). */
const PaletteSwatch = ({ token }: { token: Token }) => (
  <div className="size-control-lg rounded-item border-default border-divider" style={{ background: String(resolve(token.id)) }} />
)

const semanticGroups: { title: string; description: string; filter: (t: Token) => boolean }[] = [
  {
    title: "Papéis de estado",
    description: "Cores que se repetem em todos os componentes. Mudou aqui, muda em todos.",
    filter: (t) => t.path.length === 2 && ["focus", "invalid", "divider", "field", "disabled", "disabled-surface"].includes(t.path[1]),
  },
  { title: "Marca", description: "Não mudam entre temas.", filter: (t) => t.path[1] === "brand" },
  { title: "Detalhes de marca", description: "", filter: (t) => t.path[1] === "brand-details" },
  { title: "Fundos", description: "", filter: (t) => t.path[1] === "background" },
  { title: "Textos", description: "", filter: (t) => t.path[1] === "text" },
  { title: "Detalhes e bordas", description: "", filter: (t) => t.path[1] === "details" },
  { title: "CTAs e links", description: "", filter: (t) => t.path[1] === "link" },
  { title: "Alertas", description: "", filter: (t) => t.path[1] === "alerts" },
  { title: "Ilustração", description: "", filter: (t) => t.path[1] === "img" },
  { title: "Outros", description: "", filter: (t) => t.path.length === 2 && ["splash", "shadow"].includes(t.path[1]) },
]

export const Semanticas: Story = {
  name: "Semânticas",
  render: () => {
    const colors = group(semantic, ["color"])
    return (
      <Page
        title="Cores semânticas"
        intro="As únicas cores que os componentes usam. Cada uma aponta para uma cor da paleta (fundação). Use o botão de tema na barra do Storybook para ver o tema escuro."
      >
        {semanticGroups.map((g) => (
          <Section key={g.title} title={g.title} description={g.description || undefined}>
            <Grid>
              {colors.filter(g.filter).map((t) => (
                <TokenCard key={t.id} token={t} hidePrefix="color." sample={<SemanticSwatch token={t} />} />
              ))}
            </Grid>
          </Section>
        ))}
      </Page>
    )
  },
}

export const Paleta: Story = {
  name: "Paleta (fundação)",
  render: () => {
    const palette = group(foundation, ["color"])
    const families = [...new Set(palette.map((t) => t.path[1]))]
    return (
      <Page
        title="Paleta"
        intro="Os átomos de cor, em hexadecimal. Nunca são usados direto nos componentes: só os semânticos apontam para eles."
      >
        {families.map((family) => (
          <Section key={family} title={family}>
            <Grid>
              {palette
                .filter((t) => t.path[1] === family)
                .map((t) => (
                  <TokenCard key={t.id} token={t} hidePrefix="color." sample={<PaletteSwatch token={t} />} />
                ))}
            </Grid>
          </Section>
        ))}
      </Page>
    )
  },
}
