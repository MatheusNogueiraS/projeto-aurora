import type { Preview } from "@storybook/react-vite"
import { withThemeByClassName } from "@storybook/addon-themes"

// Mesmos estilos do produto: tokens, fontes e Tailwind.
import "../src/index.css"

const preview: Preview = {
  parameters: {
    layout: "padded",
    // asChild é opção de código (o componente empresta o estilo ao elemento filho, ex.: um link).
    // Ligado com texto simples, quebra; por isso não aparece como controle.
    controls: { expanded: true, exclude: ["asChild"] },
    // Acessibilidade: problemas aparecem no painel "Accessibility" sem bloquear.
    a11y: { test: "todo" },
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
    // Botão de tema na barra do Storybook: aplica .light / .dark no <html>, como no produto.
    withThemeByClassName({
      themes: { Light: "light", Dark: "dark" },
      defaultTheme: "Light",
      parentSelector: "html",
    }),
  ],
}

export default preview
