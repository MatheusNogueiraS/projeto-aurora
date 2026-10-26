import * as React from "react"
import type { Preview } from "@storybook/react-vite"
import { withThemeByClassName } from "@storybook/addon-themes"
import { DocsContainer, type DocsContainerProps } from "@storybook/addon-docs/blocks"
import { themes } from "storybook/theming"

// Mesmos estilos do produto: tokens, fontes e Tailwind.
import "../src/index.css"

// Botão de tema na barra do Storybook → classe no <html>, como no produto.
const themeClasses = { Light: "light", Dark: "dark" } as const

// Página Docs no tema escolhido. O fundo da página fica transparente para aparecer o fundo do
// próprio Aurora (body com background-5), o mesmo das histórias.
const docsThemes = {
  light: { ...themes.light, appContentBg: "transparent" },
  dark: { ...themes.dark, appContentBg: "transparent" },
}

// shortcut: o Docs não tem API pública para ler o tema escolhido; lê do store interno do Storybook. Conferir ao atualizar o Storybook.
function ThemedDocsContainer({ context, children }: React.PropsWithChildren<DocsContainerProps>) {
  const store = (context as unknown as { store?: { userGlobals?: { get?: () => { theme?: string } } } }).store
  const theme = store?.userGlobals?.get?.().theme === "Dark" ? "dark" : "light"
  // páginas sem história (ex.: Introduction) não passam pelo decorator, então o tema é aplicado aqui também
  React.useLayoutEffect(() => {
    document.documentElement.classList.remove(...Object.values(themeClasses))
    document.documentElement.classList.add(theme)
  }, [theme])
  return (
    <DocsContainer context={context} theme={docsThemes[theme]}>
      {children}
    </DocsContainer>
  )
}

const preview: Preview = {
  parameters: {
    layout: "padded",
    // asChild é opção de código (o componente empresta o estilo ao elemento filho, ex.: um link).
    // Ligado com texto simples, quebra; por isso não aparece como controle.
    controls: { expanded: true, exclude: ["asChild"] },
    // Acessibilidade: problemas aparecem no painel "Accessibility" sem bloquear.
    a11y: { test: "todo" },
    docs: { container: ThemedDocsContainer },
    options: {
      storySort: {
        // Componentes em ordem alfabética, com o Icon Button logo abaixo do Button.
        order: ["Introduction", "Foundations", "Components", ["Accordion", "Alert", "Badge", "Breadcrumb", "Button", "Icon Button", "*"]],
        method: "alphabetical",
      },
    },
  },
  // Tabela de controles (regra 18c): só nome, tipo e Default.
  // - Sem descrição: tira também o comentário /** */ que o Storybook lê do código do componente.
  // - Tipo: quando o Storybook não consegue resumir (variantes do cva), usa o tipo do controle.
  // - Default: o padrão vem do código; liga/desliga e estados sem padrão no código mostram false
  //   (propriedade não informada = desligada).
  argTypesEnhancers: [
    ({ argTypes }) =>
      Object.fromEntries(
        Object.entries(argTypes).map(([name, argType]) => {
          const control = typeof argType.control === "string" ? argType.control : argType.control && argType.control.type
          const isBoolean = control === "boolean" || argType.type?.name === "boolean"
          const table = { ...argType.table }
          if (isBoolean && !table.defaultValue) table.defaultValue = { summary: "false" }
          if (!table.type?.summary && control) table.type = { summary: isBoolean ? "boolean" : control === "number" || control === "range" ? "number" : "string" }
          return [name, { ...argType, description: undefined, table }]
        })
      ),
  ],
  decorators: [
    withThemeByClassName({
      themes: themeClasses,
      defaultTheme: "Light",
      parentSelector: "html",
    }),
  ],
}

export default preview
