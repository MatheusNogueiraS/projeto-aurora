import type { StorybookConfig } from "@storybook/react-vite"

// Storybook do Aurora. Usa o vite.config.ts do projeto (Tailwind, alias "@").
const config: StorybookConfig = {
  stories: ["../src/**/*.mdx", "../src/**/*.stories.@(ts|tsx)"],
  addons: ["@storybook/addon-docs", "@storybook/addon-a11y", "@storybook/addon-themes"],
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },
  // Não envia estatísticas de uso para fora (projeto interno do banco).
  core: { disableTelemetry: true },
}

export default config
