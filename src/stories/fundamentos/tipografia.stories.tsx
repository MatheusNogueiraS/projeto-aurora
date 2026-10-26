import type { Meta, StoryObj } from "@storybook/react-vite"

import { Page, Section, TokenName, TokenTable } from "./doc-ui"
import { cssVarName, foundation, formatValue, group, resolve, semantic } from "./tokens-data"

const meta = {
  title: "Foundations/Typography",
  parameters: { layout: "padded" },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

type TypoProp = "font-family" | "font-weight" | "font-size" | "line-height" | "letter-spacing" | "text-case"
const css = (id: string, prop: TypoProp) => `var(${cssVarName(id)}-${prop})`

export const Styles: Story = {
  render: () => {
    const styles = group(semantic, ["typography"])
    return (
      <Page
        title="Estilos de texto"
        intro="Cada estilo junta fonte, peso, tamanho, altura de linha, espaço entre letras e caixa. Nos componentes, aplique com uma classe só: typo-<estilo> (ex.: typo-body-md-regular)."
      >
        <div className="flex flex-col gap-md">
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
              <div key={t.id} className="flex flex-col gap-xs rounded-sm border-default border-divider bg-background-6 p-md">
                <div className="flex flex-wrap items-baseline justify-between gap-sm">
                  <TokenName id={`typo-${t.path[1]}`} />
                  <span className="typo-body-sm-regular text-text-3">{spec}</span>
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
                {t.description && <span className="typo-body-sm-regular text-text-3">{t.description}</span>}
              </div>
            )
          })}
        </div>
      </Page>
    )
  },
}

export const Foundation: Story = {
  render: () => (
    <Page title="Fundação de tipografia" intro="As peças que os estilos combinam, na mesma estrutura do Nitro: papéis de fonte, escala de tamanhos (heading e text), pesos, altura de linha e espaço entre letras.">
      <Section title="Papéis de fonte" description="Trocar a fonte do produto = mudar só estes dois tokens.">
        <TokenTable tokens={group(semantic, ["font"])} />
      </Section>
      <Section title="Tamanhos de letra" description="heading para títulos, text para textos. Mudar um passo muda todos os estilos que o usam.">
        <TokenTable tokens={group(semantic, ["font-size"])} />
      </Section>
      {(["font-family", "font-weight", "line-height", "letter-spacing", "text-case"] as const).map((g) => (
        <Section key={g} title={g}>
          <TokenTable tokens={group(foundation, [g])} />
        </Section>
      ))}
    </Page>
  ),
}
