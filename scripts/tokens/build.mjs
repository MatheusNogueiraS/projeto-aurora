// Gera os arquivos de tokens a partir de tokens/*.json (fonte de verdade).
//
//   node scripts/tokens/build.mjs           gera src/styles/tokens.css e src/styles/tailwind.css
//   node scripts/tokens/build.mjs --check   só confere se os arquivos gerados estão atualizados
//
// Regras validadas (o build para se alguma for quebrada):
//   - fundação: só valores literais, nunca referências;
//   - semântico: só referências ({grupo.nome}), nunca valores literais;
//   - temas: só sobrescrevem semânticos existentes, nunca color.brand;
//   - toda referência existe, não há referência circular nem nome duplicado.
import { readFileSync, writeFileSync, readdirSync, mkdirSync, existsSync } from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..")
const PREFIX = "--aurora-"
const REF = /^\{([^{}]+)\}$/
const NEG_REF = /^-\{([^{}]+)\}$/
const GENERIC_FONTS = new Set(["serif", "sans-serif", "monospace", "cursive", "fantasy", "system-ui", "ui-sans-serif", "ui-serif", "ui-monospace"])
const PX_GROUPS_KEPT = ["letter-spacing"] // dimensões que continuam em px

const errors = []
const fail = msg => errors.push(msg)

// ---------------------------------------------------------------------------
// Leitura
// ---------------------------------------------------------------------------
// O JavaScript põe chaves que parecem inteiro ("0", "100") antes das demais, o que
// jogaria "025" para o fim da escala. Aqui as chaves numéricas seguem a ordem do
// número (025 < 050 < 100) e as outras mantêm a ordem do JSON.
const orderedEntries = obj => {
  const entries = Object.entries(obj)
  const numeric = entries.filter(([k]) => /^\d+$/.test(k)).sort(([a], [b]) => Number(a) - Number(b))
  return [...numeric, ...entries.filter(([k]) => !/^\d+$/.test(k))]
}

function flatten(obj, tier, file, prefix = [], inheritedType) {
  const out = []
  const type = obj.$type ?? inheritedType
  if ("$value" in obj) {
    const children = Object.keys(obj).filter(k => !k.startsWith("$"))
    if (children.length) fail(`${file}: "${prefix.join(".")}" é token e grupo ao mesmo tempo`)
    if (!type && tier !== "theme") fail(`${file}: "${prefix.join(".")}" sem $type`) // temas herdam o tipo do semântico
    out.push({ id: prefix.join("."), path: prefix, tier, file, type, value: obj.$value, description: obj.$description })
    return out
  }
  for (const [key, child] of orderedEntries(obj)) {
    if (key.startsWith("$")) continue
    if (typeof child !== "object" || child === null) { fail(`${file}: "${[...prefix, key].join(".")}" não é token nem grupo`); continue }
    out.push(...flatten(child, tier, file, [...prefix, key], type))
  }
  return out
}

const readJson = rel => JSON.parse(readFileSync(path.join(root, rel), "utf8"))
const foundation = flatten(readJson("tokens/foundation.json"), "foundation", "foundation.json")
const semantic = flatten(readJson("tokens/semantic.json"), "semantic", "semantic.json")
const themesDir = path.join(root, "tokens/themes")
const themes = existsSync(themesDir)
  ? readdirSync(themesDir).filter(f => f.endsWith(".json")).sort().map(f => ({
      name: f.replace(/\.json$/, ""),
      tokens: flatten(readJson(`tokens/themes/${f}`), "theme", `themes/${f}`),
    }))
  : []

// ---------------------------------------------------------------------------
// Validação
// ---------------------------------------------------------------------------
const all = new Map()
for (const t of [...foundation, ...semantic]) {
  if (all.has(t.id)) fail(`"${t.id}" definido duas vezes (${all.get(t.id).file} e ${t.file})`)
  all.set(t.id, t)
}
const cssName = id => PREFIX + id.split(".").join("-")
const byCss = new Map()
for (const t of all.values()) {
  const n = cssName(t.id)
  if (byCss.has(n)) fail(`"${t.id}" e "${byCss.get(n)}" geram a mesma variável ${n}`)
  byCss.set(n, t.id)
}

function refsOf(value) {
  if (typeof value === "string") {
    const m = value.match(REF) || value.match(NEG_REF)
    return m ? [m[1]] : []
  }
  if (value && typeof value === "object" && !Array.isArray(value)) return Object.values(value).flatMap(refsOf)
  return []
}
function isPureRef(value) {
  if (typeof value === "string") return REF.test(value) || NEG_REF.test(value)
  if (value && typeof value === "object" && !Array.isArray(value)) return Object.values(value).every(isPureRef)
  return false
}

for (const t of foundation) {
  if (refsOf(t.value).length) fail(`fundação "${t.id}" usa referência; a fundação só aceita valores literais`)
}
for (const t of semantic) {
  if (!isPureRef(t.value)) fail(`semântico "${t.id}" tem valor literal; semânticos só apontam para outros tokens`)
  for (const r of refsOf(t.value)) if (!all.has(r)) fail(`semântico "${t.id}" aponta para "${r}", que não existe`)
}
for (const theme of themes) {
  for (const t of theme.tokens) {
    const base = all.get(t.id)
    if (!base || base.tier !== "semantic") fail(`tema ${theme.name}: "${t.id}" não é um semântico existente`)
    if (t.id.startsWith("color.brand.")) fail(`tema ${theme.name}: "${t.id}" é cor de marca e não pode mudar entre temas`)
    if (!isPureRef(t.value)) fail(`tema ${theme.name}: "${t.id}" tem valor literal; use referência`)
    for (const r of refsOf(t.value)) if (!all.has(r)) fail(`tema ${theme.name}: "${t.id}" aponta para "${r}", que não existe`)
  }
}
// referência circular
function walk(id, stack = []) {
  if (stack.includes(id)) { fail(`referência circular: ${[...stack, id].join(" -> ")}`); return }
  const t = all.get(id)
  if (!t) return
  for (const r of refsOf(t.value)) walk(r, [...stack, id])
}
for (const t of semantic) walk(t.id)

if (errors.length) {
  console.error("Tokens inválidos:\n  - " + errors.join("\n  - "))
  process.exit(1)
}

// ---------------------------------------------------------------------------
// Conversão de valores
// ---------------------------------------------------------------------------
const pxToRem = px => {
  const n = parseFloat(px)
  if (n === 0) return "0rem"
  return `${+(n / 16).toFixed(4)}rem`
}
function literal(t) {
  const v = t.value
  switch (t.type) {
    case "dimension":
      return PX_GROUPS_KEPT.includes(t.path[0]) ? v : pxToRem(v)
    case "number":
      return t.path[0] === "opacity" ? `${+(v * 100).toFixed(2)}%` : String(v)
    case "fontFamily":
      return (Array.isArray(v) ? v : [v]).map(f => (GENERIC_FONTS.has(f) ? f : `'${f}'`)).join(", ")
    case "cubicBezier":
      return `cubic-bezier(${v.join(", ")})`
    default:
      return String(v)
  }
}
const varOf = ref => `var(${cssName(ref)})`
function refToCss(str) {
  let m = str.match(REF)
  if (m) return varOf(m[1])
  m = str.match(NEG_REF)
  if (m) return `calc(${varOf(m[1])} * -1)`
  throw new Error(`valor inesperado: ${str}`)
}
// resolve um token até o literal (usado onde CSS não aceita var(), ex.: media queries)
function resolveLiteral(id) {
  const t = all.get(id)
  const m = typeof t.value === "string" && t.value.match(REF)
  return m ? resolveLiteral(m[1]) : literal(t)
}

const TYPO_PROPS = [
  ["fontFamily", "font-family"],
  ["fontWeight", "font-weight"],
  ["fontSize", "font-size"],
  ["lineHeight", "line-height"],
  ["letterSpacing", "letter-spacing"],
  ["textCase", "text-case"],
]
function declarations(t, valueOverride) {
  const value = valueOverride ?? t.value
  const name = cssName(t.id)
  if (t.type === "typography") {
    return TYPO_PROPS.map(([key, suffix]) => `${name}-${suffix}: ${refToCss(value[key])};`)
  }
  if (t.type === "shadow") {
    const { offsetX, offsetY, blur, spread, color } = value
    return [`${name}: ${[offsetX, offsetY, blur, spread, color].map(refToCss).join(" ")};`]
  }
  if (t.tier === "foundation") return [`${name}: ${literal(t)};`]
  return [`${name}: ${refToCss(value)};`]
}

// ---------------------------------------------------------------------------
// tokens.css (CSS puro, independente do Tailwind)
// ---------------------------------------------------------------------------
const HEADER = `/*
 * ARQUIVO GERADO — não edite à mão.
 * Fonte de verdade: tokens/*.json. Para mudar um token, edite o JSON e rode:
 *   pnpm tokens
 */
`
function block(selector, list, overrides) {
  const lines = []
  let group = null
  for (const t of list) {
    const g = t.tier + ":" + t.path[0]
    if (g !== group) {
      group = g
      lines.push(`${lines.length ? "\n" : ""}    /* ${t.tier === "foundation" ? "fundação" : "semântico"} · ${t.path[0]} */`)
    }
    const base = overrides ? all.get(t.id) : t
    for (const d of declarations(base, overrides ? t.value : undefined)) lines.push(`    ${d}`)
  }
  return `${selector} {\n${lines.join("\n")}\n}\n`
}
let tokensCss = HEADER + `
/* Tema padrão (claro). Todos os tokens: fundação e semânticos. */
${block(":root", [...foundation, ...semantic])}`
for (const theme of themes) {
  tokensCss += `
/* Tema ${theme.name}: sobrescreve só os semânticos que mudam. Aplicado no <html>. */
${block(`.${theme.name}`, theme.tokens, true)}`
}

// ---------------------------------------------------------------------------
// tailwind.css (adaptador: expõe SÓ semânticos como classes)
// ---------------------------------------------------------------------------
// grupo semântico -> namespace(s) do Tailwind
// padding e gap ficam em namespaces próprios (não em --spacing-*), então cada classe
// só aceita a escala certa: p-sm usa padding, gap-sm/mt-sm usam gap. Larguras e alturas
// (w-, h-, size-, min-*, max-*) não têm token: são escritas direto no componente.
const NAMESPACES = [
  [["color"], "--color-"],
  [["padding"], ["--padding-", "--inset-", "--scroll-padding-"]],
  [["gap"], ["--gap-", "--margin-", "--space-", "--scroll-margin-", "--translate-"]],
  [["radius"], "--radius-"],
  [["opacity"], "--opacity-"],
  [["layer"], "--z-index-"],
  [["motion", "easing"], "--ease-"],
  [["motion", "distance"], "--translate-"],
  [["rotate"], "--rotate-"],
  [["elevation"], "--shadow-"],
  [["stroke"], "--border-width-"],
]
// nomes que colidem com classes fixas do Tailwind (ex.: border-none = estilo de borda) não viram classe
const NOT_EXPOSED = new Set(["stroke.none"])
const themeLines = []
const seenKeys = new Map()
for (const t of semantic) {
  if (NOT_EXPOSED.has(t.id)) continue
  const ns = NAMESPACES.find(([p]) => p.every((seg, i) => t.path[i] === seg))
  if (!ns) continue
  const [prefixPath, twPrefixes] = ns
  for (const twPrefix of [twPrefixes].flat()) {
    const key = twPrefix + t.path.slice(prefixPath.length).join("-")
    if (seenKeys.has(key)) { fail(`"${t.id}" e "${seenKeys.get(key)}" viram a mesma classe (${key})`); continue }
    seenKeys.set(key, t.id)
    themeLines.push(`    ${key}: var(${cssName(t.id)});`)
  }
}
if (errors.length) {
  console.error("Tokens inválidos:\n  - " + errors.join("\n  - "))
  process.exit(1)
}
const breakpoints = semantic.filter(t => t.path[0] === "breakpoint")
const typographies = semantic.filter(t => t.type === "typography")

const tailwindCss = HEADER + `
/*
 * Adaptador para o Tailwind. O tema padrão do Tailwind NÃO é carregado:
 * as únicas classes de valor que existem são as dos semânticos abaixo.
 * Primitivos (fundação) nunca viram classe.
 */

@custom-variant dark (&:where(.dark, .dark *));

/* Breakpoints: media queries não aceitam var(), por isso o valor é resolvido aqui. */
@theme {
${breakpoints.map(t => `    --breakpoint-${t.path[1]}: ${resolveLiteral(t.id)};`).join("\n")}
}

@theme inline {
${themeLines.join("\n")}

    /* Padrões usados por utilitários sem valor (transition, font-family base). */
    --default-transition-duration: var(${cssName("motion.duration.normal")});
    --default-transition-timing-function: var(${cssName("motion.easing.standard")});
    --default-font-family: var(${cssName("font.text")});

    /* Animações contínuas. */
    --animate-spin: spin var(${cssName("motion.duration.spin")}) var(${cssName("motion.easing.linear")}) infinite;
    --animate-pulse: pulse var(${cssName("motion.duration.pulse")}) var(${cssName("motion.easing.pulse")}) infinite;

    @keyframes spin {
        to { rotate: 1turn; }
    }
    @keyframes pulse {
        50% { opacity: var(${cssName("opacity.pulse")}); }
    }
}

/* Estilos de texto: uma classe aplica as 6 propriedades do estilo. */
${typographies.map(t => {
  const n = cssName(t.id)
  return `@utility typo-${t.path[1]} {
    font-family: var(${n}-font-family);
    font-weight: var(${n}-font-weight);
    font-size: var(${n}-font-size);
    line-height: var(${n}-line-height);
    letter-spacing: var(${n}-letter-spacing);
    text-transform: var(${n}-text-case);
}`
}).join("\n\n")}
`

// ---------------------------------------------------------------------------
// tokens-merge.ts (ensina o cn() a fundir as classes dos nossos tokens)
// Sem isto, o cn() não sabe que "border-default" é espessura e "border-field" é cor,
// e descarta uma delas; nem que "rounded-button" e "rounded-pill" são o mesmo tipo.
// ---------------------------------------------------------------------------
const namesOf = (prefixPath, filter = () => true) =>
  semantic
    .filter(t => prefixPath.every((seg, i) => t.path[i] === seg) && filter(t))
    .map(t => t.path.slice(prefixPath.length).join("-"))
const borderWidths = namesOf(["stroke"], t => !NOT_EXPOSED.has(t.id))
const sides = ["x", "y", "s", "e", "t", "r", "b", "l"]
const mergeConfig = {
  override: {
    theme: {
      // + palavras-chave do CSS, que não são tokens mas precisam ser reconhecidas como cor
      // (sem elas, cn("border-transparent", "border-link-4") mantém as duas e a transparente vence)
      color: [...namesOf(["color"]), "transparent", "current", "currentcolor", "inherit"],
      spacing: [...new Set([...namesOf(["padding"]), ...namesOf(["gap"])])],
      radius: namesOf(["radius"]),
      shadow: namesOf(["elevation"]),
      ease: namesOf(["motion", "easing"]),
    },
  },
  extend: {
    classGroups: {
      "border-w": [{ border: borderWidths }],
      ...Object.fromEntries(sides.map(s => [`border-w-${s}`, [{ [`border-${s}`]: borderWidths }]])),
      opacity: [{ opacity: namesOf(["opacity"]) }],
      z: [{ z: namesOf(["layer"]) }],
      rotate: [{ rotate: namesOf(["rotate"]) }],
      typography: [{ typo: namesOf(["typography"]) }],
    },
    conflictingClassGroups: {
      typography: ["font-size", "font-weight", "font-family", "leading", "tracking", "text-transform"],
    },
  },
}
const mergeTs = `/*
 * ARQUIVO GERADO — não edite à mão.
 * Fonte de verdade: tokens/*.json. Para atualizar, rode: pnpm tokens
 *
 * Configuração do cn() (fusão de classes) com os nomes dos nossos tokens.
 */
export const tokenMergeConfig = ${JSON.stringify(mergeConfig, null, 2)} as const
`

// ---------------------------------------------------------------------------
// Manifesto (usado pela checagem de componentes)
// ---------------------------------------------------------------------------
export const manifest = {
  semanticVars: semantic.flatMap(t =>
    t.type === "typography" ? TYPO_PROPS.map(([, s]) => `${cssName(t.id)}-${s}`) : [cssName(t.id)]
  ),
  foundationVars: foundation.map(t => cssName(t.id)),
  outputs: { "src/styles/tokens.css": tokensCss, "src/styles/tailwind.css": tailwindCss, "src/lib/tokens-merge.ts": mergeTs },
}

// ---------------------------------------------------------------------------
// Escrita / checagem
// ---------------------------------------------------------------------------
const isMain = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)
if (isMain) {
  const check = process.argv.includes("--check")
  let stale = []
  for (const [rel, content] of Object.entries(manifest.outputs)) {
    const file = path.join(root, rel)
    const current = existsSync(file) ? readFileSync(file, "utf8").replace(/\r\n/g, "\n") : null
    if (check) {
      if (current !== content) stale.push(rel)
    } else {
      mkdirSync(path.dirname(file), { recursive: true })
      writeFileSync(file, content)
    }
  }
  if (check && stale.length) {
    console.error(`Arquivos gerados desatualizados: ${stale.join(", ")}\nRode: pnpm tokens`)
    process.exit(1)
  }
  console.log(
    check
      ? "tokens: arquivos gerados estão atualizados"
      : `tokens: ${foundation.length} de fundação, ${semantic.length} semânticos, ${themes.length} tema(s) -> ${Object.keys(manifest.outputs).join(", ")}`
  )
}
