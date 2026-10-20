import type { Meta, StoryObj } from "@storybook/react-vite"

import { Grid, Page, Section, TokenCard, TokenTable } from "./doc-ui"
import { cssVar, foundation, group, semantic } from "./tokens-data"

const meta = {
  title: "Fundamentos/Linha, opacidade e movimento",
  parameters: { layout: "padded" },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const Opacidade: Story = {
  render: () => (
    <Page
      title="Opacidade"
      intro="Transparências por papel. Na cor: bg-link-5/hover. No elemento: opacity-disabled."
    >
      <Grid>
        {group(semantic, ["opacity"]).map((t) => (
          <TokenCard
            key={t.id}
            token={t}
            sample={<div className="size-control-lg rounded-item bg-link-1" style={{ opacity: cssVar(t.id) }} />}
          />
        ))}
      </Grid>
      <Section title="Fundação">
        <TokenTable tokens={group(foundation, ["opacity"])} />
      </Section>
    </Page>
  ),
}

export const Linhas: Story = {
  name: "Espessura de linha",
  render: () => (
    <Page title="Espessura de linha" intro="Bordas (border-default) e anel de foco (ring-(length:--aurora-stroke-focus)).">
      <Grid>
        {group(semantic, ["stroke"]).map((t) => (
          <TokenCard
            key={t.id}
            token={t}
            sample={<div className="w-xxxl border-link-4" style={{ borderTopWidth: cssVar(t.id), borderTopStyle: "solid" }} />}
          />
        ))}
      </Grid>
    </Page>
  ),
}

export const Movimento: Story = {
  render: () => (
    <Page
      title="Movimento"
      intro="Velocidades e curvas das animações. Hover e foco usam motion-duration-normal com motion-easing-standard."
    >
      <TokenTable tokens={group(semantic, ["motion"])} />
      <Section title="Fundação">
        <TokenTable tokens={[...group(foundation, ["duration"]), ...group(foundation, ["easing"]), ...group(foundation, ["scale"])]} />
      </Section>
    </Page>
  ),
}

export const CamadasGiroBreakpoints: Story = {
  name: "Camadas, giro e breakpoints",
  render: () => (
    <Page title="Camadas, giro e breakpoints" intro="Ordem de empilhamento (z-overlay...), giros fixos (rotate-flip...) e larguras de tela (sm:, md:, lg:).">
      <Section title="Camadas">
        <TokenTable tokens={group(semantic, ["layer"])} />
      </Section>
      <Section title="Giro">
        <TokenTable tokens={group(semantic, ["rotate"])} />
      </Section>
      <Section title="Breakpoints">
        <TokenTable tokens={group(semantic, ["breakpoint"])} />
      </Section>
      <Section title="Sublinhado de links">
        <TokenTable tokens={group(semantic, ["underline-offset"])} />
      </Section>
    </Page>
  ),
}
