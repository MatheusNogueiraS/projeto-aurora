import type { Meta, StoryObj } from "@storybook/react-vite"

import { Page, Section, TokenName, TokenTable } from "./doc-ui"
import { cssVarName, foundation, formatValue, group, resolve, semantic } from "./tokens-data"

const meta = {
  title: "Fundamentos/Tipografia",
  parameters: { layout: "padded" },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

type TypoProp = "font-family" | "font-weight" | "font-size" | "line-height" | "letter-spacing" | "text-case"
const css = (id: string, prop: TypoProp) => `var(${cssVarName(id)}-${prop})`

export const Estilos: Story = {
  render: () => {
    const styles = group(semantic, ["typography"])
    return (
      <Page
        title="Estilos de texto"
        intro="Cada estilo junta fonte, peso, tamanho, altura de linha, espaço entre letras e caixa. Nos componentes, aplique com uma classe só: typo-<estilo> (ex.: typo-body-small)."
      >
        <div className="flex flex-col gap-xxxs">
          {styles.map((t) => {
            const v = t.value as Record<string, string>
            const spec = [
              String(resolve(v.fontFamily.slice(1, -1))).split(",")[0],
              resolve(v.fontWeight.slice(1, -1)),
              formatValue(resolve(v.fontSize.slice(1, -1)), "dimension").split(" ·")[0],
              formatValue(resolve(v.lineHeight.slice(1, -1)), "dimension").split(" ·")[0],
              resolve(v.letterSpacing.slice(1, -1)),
            ].join(" / ")
            return (
              <div key={t.id} className="flex flex-col gap-quark rounded-card border-default border-divider bg-background-6 p-xxxs">
                <div className="flex flex-wrap items-baseline justify-between gap-nano">
                  <TokenName id={`typo-${t.path[1]}`} />
                  <span className="typo-caption text-text-3">{spec}</span>
                </div>
                <p
                  style={{
                    fontFamily: css(t.id, "font-family"),
                    fontWeight: css(t.id, "font-weight"),
                    fontSize: css(t.id, "font-size"),
                    lineHeight: css(t.id, "line-height"),
                    letterSpacing: css(t.id, "letter-spacing"),
                    textTransform: css(t.id, "text-case") as "none",
                  }}
                >
                  Simule seu consignado em 2 minutos
                </p>
                {t.description && <span className="typo-caption text-text-3">{t.description}</span>}
              </div>
            )
          })}
        </div>
      </Page>
    )
  },
}

export const Fundacao: Story = {
  name: "Fundação",
  render: () => (
    <Page title="Fundação de tipografia" intro="As peças soltas que os estilos combinam. Tamanhos e alturas de linha fixas vêm da escala value.">
      <Section title="Papéis de fonte" description="Trocar a fonte do produto = mudar só estes dois tokens.">
        <TokenTable tokens={group(semantic, ["font"])} />
      </Section>
      {(["font-family", "font-weight", "line-height", "letter-spacing", "text-case"] as const).map((g) => (
        <Section key={g} title={g}>
          <TokenTable tokens={group(foundation, [g])} />
        </Section>
      ))}
    </Page>
  ),
}
