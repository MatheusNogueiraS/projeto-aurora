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
        // Componentes em ordem alfabética, com o IconButton logo abaixo do Button.
        order: ["Introdução", "Fundamentos", "Componentes", ["Accordion", "Alert", "Badge", "Breadcrumb", "Button", "IconButton", "*"]],
        method: "alphabetical",
      },
    },
  },
  decorators: [
    // Botão de tema na barra do Storybook: aplica .light / .dark no <html>, como no produto.
    withThemeByClassName({
      themes: { Claro: "light", Escuro: "dark" },
      defaultTheme: "Claro",
      parentSelector: "html",
    }),
  ],
}

export default preview
