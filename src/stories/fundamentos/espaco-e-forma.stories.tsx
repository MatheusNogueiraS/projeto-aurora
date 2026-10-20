import type { Meta, StoryObj } from "@storybook/react-vite"

import { Grid, Page, Section, TokenCard, TokenTable } from "./doc-ui"
import { cssVar, foundation, group, semantic } from "./tokens-data"

const meta = {
  title: "Fundamentos/Espaço e forma",
  parameters: { layout: "padded" },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const Espacamento: Story = {
  name: "Espaçamento",
  render: () => (
    <Page
      title="Espaçamento"
      intro="Espaço entre e dentro dos elementos (padding, gap, margem). Classes: p-nano, gap-quark, mt-xs..."
    >
      <div className="flex flex-col gap-nano">
        {group(semantic, ["spacing"]).map((t) => (
          <TokenCard
            key={t.id}
            token={t}
            sample={<div className="h-xxs w-xxxl"><div className="h-full rounded-xs bg-link-1" style={{ width: cssVar(t.id) }} /></div>}
          />
        ))}
      </div>
    </Page>
  ),
}

export const Tamanhos: Story = {
  render: () => (
    <Page
      title="Tamanhos"
      intro="Altura e largura de elementos. Use primeiro as escalas control (botões, campos) e icon; tamanhos específicos só quando nenhuma escala serve."
    >
      <Section title="Controles" description="Classes: h-control-md, size-control-sm...">
        <Grid>
          {group(semantic, ["size", "control"]).map((t) => (
            <TokenCard
              key={t.id}
              token={t}
              sample={<div className="rounded-xs bg-link-5" style={{ height: cssVar(t.id), width: cssVar(t.id) }} />}
            />
          ))}
        </Grid>
      </Section>
      <Section title="Ícones" description="Classes: size-icon-md...">
        <Grid>
          {group(semantic, ["size", "icon"]).map((t) => (
            <TokenCard
              key={t.id}
              token={t}
              sample={<div className="rounded-xxs bg-link-4" style={{ height: cssVar(t.id), width: cssVar(t.id) }} />}
            />
          ))}
        </Grid>
      </Section>
      <Section title="Específicos de componente e limites">
        <TokenTable tokens={group(semantic, ["size"]).filter((t) => !["control", "icon"].includes(t.path[1]))} />
      </Section>
    </Page>
  ),
}

export const Raio: Story = {
  render: () => (
    <Page
      title="Raio"
      intro="Arredondamento dos cantos. A escala (none a pill) serve aos tokens de componente; nos componentes, use o token do componente: rounded-button, rounded-card, rounded-input..."
    >
      <Grid>
        {group(semantic, ["radius"]).map((t) => (
          <TokenCard
            key={t.id}
            token={t}
            sample={
              <div
                className="h-control-lg w-xxxl border-default border-link-4 bg-link-5"
                style={{ borderRadius: cssVar(t.id) }}
              />
            }
          />
        ))}
      </Grid>
    </Page>
  ),
}

export const Elevacao: Story = {
  name: "Elevação",
  render: () => (
    <Page title="Elevação" intro="Sombras dos elementos que se destacam na tela. Classes: shadow-s, shadow-m, shadow-inverse.">
      <Grid>
        {group(semantic, ["elevation"]).map((t) => (
          <TokenCard
            key={t.id}
            token={t}
            sample={<div className="m-nano size-control-lg rounded-card bg-background-6" style={{ boxShadow: cssVar(t.id) }} />}
          />
        ))}
      </Grid>
    </Page>
  ),
}

export const Escala: Story = {
  name: "Escala de valores (fundação)",
  render: () => (
    <Page
      title="Escala de valores"
      intro="Os números de base de tudo (em px no JSON, gerados em rem). Imutáveis: para mudar um tamanho, aponte o semântico para outro valor."
    >
      <TokenTable tokens={group(foundation, ["value"])} />
    </Page>
  ),
}
