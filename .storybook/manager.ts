import { addons } from "storybook/manager-api"
import { create } from "storybook/theming"
import { GLOBALS_UPDATED, SET_GLOBALS } from "storybook/internal/core-events"

// Nome do design system na barra lateral do Storybook.
// No escuro, barra lateral, header e páginas usam o mesmo fundo do Aurora (color.neutral.10) para ficar uniforme.
const dark = "#0A0A0A"
const managerTheme = (base: "light" | "dark") =>
  create({
    base,
    brandTitle: "Aurora · Design System",
    ...(base === "dark" && { appBg: dark, appContentBg: dark, appPreviewBg: dark, barBg: dark, appBorderColor: "rgba(255,255,255,0.1)" }),
  })

addons.setConfig({ theme: managerTheme("light") })

// A interface do Storybook (barra lateral e painéis) acompanha o tema escolhido na barra (Light/Dark).
addons.register("aurora/tema", (api) => {
  const apply = ({ globals }: { globals?: { theme?: string } }) =>
    api.setOptions({ theme: managerTheme(globals?.theme === "Dark" ? "dark" : "light") })
  api.on(SET_GLOBALS, apply)
  api.on(GLOBALS_UPDATED, apply)
})
