import type { Meta, StoryObj } from "@storybook/react-vite"

import { Grid, Page, TokenCard, TokenTable } from "./doc-ui"
import { cssVar, foundation, group, semantic } from "./tokens-data"

const meta = {
  title: "Foundations/Space and Shape",
  parameters: { layout: "padded" },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const Padding: Story = {
  render: () => (
    <Page
      title="Padding"
      intro="Espaço DENTRO de um elemento, e a distância de um item posicionado até a borda do container. A altura dos controles vem daqui: padding + conteúdo. Classes: p-sm, px-lg, py-xs, top-md, inset-x-sm..."
    >
      <div className="flex flex-col gap-sm">
        {group(semantic, ["padding"]).map((t) => (
          <TokenCard
            key={t.id}
            token={t}
            sample={
              <div className="w-fit rounded-xxs border-default border-dashed border-link-4 bg-link-5" style={{ padding: cssVar(t.id) }}>
                <div className="h-[16px] w-[40px] rounded-xxs bg-link-1" />
              </div>
            }
          />
        ))}
      </div>
    </Page>
  ),
}

export const Gap: Story = {
  render: () => (
    <Page
      title="Gap"
      intro="Espaço ENTRE elementos: gap, margem, space-between e deslocamentos. Classes: gap-sm, gap-x-md, mt-xs, -ml-xxs, translate-y-xxs..."
    >
      <div className="flex flex-col gap-sm">
        {group(semantic, ["gap"]).map((t) => (
          <TokenCard
            key={t.id}
            token={t}
            sample={
              <div className="flex" style={{ gap: cssVar(t.id) }}>
                <div className="h-[16px] w-[24px] rounded-xxs bg-link-1" />
                <div className="h-[16px] w-[24px] rounded-xxs bg-link-1" />
              </div>
            }
          />
        ))}
      </div>
    </Page>
  ),
}

export const Radius: Story = {
  render: () => (
    <Page
      title="Raio"
      intro="Arredondamento dos cantos. Escala única: todo componente usa um destes passos, sem token próprio. Classes: rounded-sm, rounded-pill, rounded-t-xs..."
    >
      <Grid>
        {group(semantic, ["radius"]).map((t) => (
          <TokenCard
            key={t.id}
            token={t}
            sample={
              <div
                className="h-[40px] w-[80px] border-default border-link-4 bg-link-5"
                style={{ borderRadius: cssVar(t.id) }}
              />
            }
          />
        ))}
      </Grid>
    </Page>
  ),
}

export const Elevation: Story = {
  render: () => (
    <Page title="Elevação" intro="Sombras dos elementos que se destacam na tela. Classes: shadow-s, shadow-m, shadow-inverse.">
      <Grid>
        {group(semantic, ["elevation"]).map((t) => (
          <TokenCard
            key={t.id}
            token={t}
            sample={<div className="m-sm size-[40px] rounded-sm bg-background-6" style={{ boxShadow: cssVar(t.id) }} />}
          />
        ))}
      </Grid>
    </Page>
  ),
}

export const Scale: Story = {
  name: "Value scale (foundation)",
  render: () => (
    <Page
      title="Escala de valores"
      intro="Os números de base de tudo (em px no JSON, gerados em rem). Imutáveis: para mudar um tamanho, aponte o semântico para outro valor."
    >
      <TokenTable tokens={group(foundation, ["value"])} />
    </Page>
  ),
}
