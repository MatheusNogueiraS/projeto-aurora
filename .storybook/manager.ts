import { addons } from "storybook/manager-api"
import { create } from "storybook/theming"

// Nome do design system na barra lateral do Storybook.
addons.setConfig({
  theme: create({
    base: "light",
    brandTitle: "Aurora · Design System",
  }),
})
