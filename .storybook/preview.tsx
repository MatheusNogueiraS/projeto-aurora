import type { Preview } from "@storybook/react-vite"
import { withThemeByClassName } from "@storybook/addon-themes"

// Mesmos estilos do produto: tokens, fontes e Tailwind.
import "../src/index.css"

const preview: Preview = {
  parameters: {
    layout: "padded",
    controls: { expanded: true },
    // Acessibilidade: problemas aparecem no painel "Accessibility" sem bloquear.
    a11y: { test: "todo" },
    options: {
      storySort: {
        order: ["Introdução", "Fundamentos", "Componentes"],
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
