// Trava do design system. Falha (exit 1) se:
//   1. os arquivos gerados em src/styles/ estão desatualizados em relação a tokens/*.json;
//   2. algum componente usa uma classe que não gera CSS (ex.: p-4, text-sm — não existem sem o tema do Tailwind);
//   3. algum componente usa valor solto ([13px], opacity-50, rounded-full...) ou token de fundação;
//   4. algum par de cores principal fica abaixo do contraste mínimo (WCAG), em qualquer tema.
//
//   node scripts/tokens/check.mjs
import { readFileSync, readdirSync, statSync, existsSync } from "node:fs"
import path from "node:path"
import { fileURLToPath, pathToFileURL } from "node:url"
import { manifest } from "./build.mjs"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..")
const problems = []
const report = (file, msg) => problems.push(`${file}: ${msg}`)

// ---------------------------------------------------------------------------
// 1. Arquivos gerados atualizados
// ---------------------------------------------------------------------------
for (const [rel, content] of Object.entries(manifest.outputs)) {
  const file = path.join(root, rel)
  const current = existsSync(file) ? readFileSync(file, "utf8").replace(/\r\n/g, "\n") : null
  if (current !== content) report(rel, "desatualizado em relação a tokens/*.json (rode: pnpm tokens)")
}

// ---------------------------------------------------------------------------
// Extração das classes usadas nos componentes
// ---------------------------------------------------------------------------
const SOURCE_DIRS = ["src"]
const files = []
const walkDir = dir => {
  for (const name of readdirSync(dir)) {
    const p = path.join(dir, name)
    if (statSync(p).isDirectory()) walkDir(p)
    else if (/\.(tsx|ts)$/.test(name)) files.push(p)
  }
}
SOURCE_DIRS.forEach(d => walkDir(path.join(root, d)))

// Regiões que contêm classes: className=..., cn(...), cva(...)
function regions(src) {
  const out = []
  const balanced = (start, open, close) => {
    let depth = 0, i = start, quote = null
    for (; i < src.length; i++) {
      const ch = src[i]
      if (quote) { if (ch === "\\") i++; else if (ch === quote) quote = null; continue }
      if (ch === '"' || ch === "'" || ch === "`") { quote = ch; continue }
      if (ch === open) depth++
      else if (ch === close && --depth === 0) return i
    }
    return src.length
  }
  for (const m of src.matchAll(/className=(["'{])/g)) {
    const s = m.index + m[0].length - 1
    if (m[1] === "{") out.push([s, balanced(s, "{", "}")])
    else out.push([s, src.indexOf(m[1], s + 1)])
  }
  for (const m of src.matchAll(/\b(?:cn|cva)\(/g)) {
    const s = m.index + m[0].length - 1
    out.push([s, balanced(s, "(", ")")])
  }
  return out
}
function stringsIn(src, [a, b]) {
  let chunk = src.slice(a, b + 1)
  // valores padrão de variantes não são classes
  chunk = chunk.replace(/defaultVariants\s*:\s*\{[^}]*\}/g, "")
  const out = []
  for (const m of chunk.matchAll(/"((?:[^"\\\n]|\\.)*)"|'((?:[^'\\\n]|\\.)*)'|`((?:[^`\\]|\\.)*)`/g)) {
    // não são classes: chaves de objeto ("inline-start": ...) e comparações (=== "popper")
    const after = chunk.slice(m.index + m[0].length).match(/^\s*(.)/)
    const before = chunk.slice(0, m.index).match(/(===|!==|==|!=)\s*$/)
    if ((after && after[1] === ":") || before) continue
    const raw = (m[1] ?? m[2] ?? m[3] ?? "").replace(/\$\{[^}]*\}/g, " ")
    out.push({ text: raw, offset: a + m.index })
  }
  return out
}
const lineOf = (src, offset) => src.slice(0, offset).split("\n").length

const NON_UTILITY = [/^group$/, /^peer$/, /^group\/[\w-]+$/, /^peer\/[\w-]+$/, /^toaster$/, /^cn-toast$/]
const candidates = new Map() // classe -> [onde]
for (const file of files) {
  const src = readFileSync(file, "utf8")
  const rel = path.relative(root, file).replace(/\\/g, "/")
  const seen = new Set()
  for (const region of regions(src)) {
    for (const { text, offset } of stringsIn(src, region)) {
      for (const cls of text.split(/\s+/).filter(Boolean)) {
        if (NON_UTILITY.some(r => r.test(cls))) continue
        const key = `${cls}@${offset}`
        if (seen.has(key)) continue
        seen.add(key)
        if (!candidates.has(cls)) candidates.set(cls, [])
        candidates.get(cls).push(`${rel}:${lineOf(src, offset)}`)
      }
    }
  }
}

// ---------------------------------------------------------------------------
// 3. Valores soltos e tokens de fundação
// ---------------------------------------------------------------------------
const semanticVars = new Set(manifest.semanticVars)
const foundationVars = new Set(manifest.foundationVars)
const utilityOf = cls => {
  // remove variantes (tudo até o último ":" fora de colchetes/parênteses)
  let depth = 0, cut = 0
  for (let i = 0; i < cls.length; i++) {
    const ch = cls[i]
    if (ch === "[" || ch === "(") depth++
    else if (ch === "]" || ch === ")") depth--
    else if (ch === ":" && depth === 0) cut = i + 1
  }
  return cls.slice(cut).replace(/^!|!$/g, "").replace(/^-/, "")
}
const FORBIDDEN = [
  [/^(border|border-[trblxyse])$/, "espessura de borda solta (1px): use border-default"],
  [/^(border|border-[trblxyse])-\d+$/, "espessura de borda solta: use border-default ou border-(length:--aurora-stroke-*)"],
  [/^ring(-\d+)?$/, "espessura de anel solta: use ring-(length:--aurora-stroke-*)"],
  [/^outline-\d+$/, "espessura de contorno solta"],
  [/^rounded(-[tblrse]{1,2})?(-full)?$/, "raio solto: use um token de radius (rounded-button, rounded-pill...)"],
  [/^(opacity|z|duration|delay|rotate|scale|scale-[xy]|zoom-(in|out)|fade-(in|out)|spin-(in|out))-\d+$/, "valor numérico solto: use um token semântico"],
  [/^slide-(in|out)-from-[a-z]+-\d+$/, "distância solta: use slide-*-overlay"],
  [/^(max-w|max-h)-none$/, "colide com o token spacing.none (0) e vira largura/altura máxima zero; para tirar o limite, não use classe de max"],
  [/^(underline-offset|outline-offset|ring-offset|decoration|leading|blur|backdrop-blur)-\d+$/, "valor numérico solto: use um token semântico (ex.: underline-offset-(--aurora-underline-offset))"],
  [/^(?!(w|h|size|min-w|max-w|min-h|max-h|inset|inset-[xy]|top|left|right|bottom|start|end|translate-[xy]|basis|aspect)-\d+\/\d+$).*\/\d+$/, "opacidade solta (ex.: /50): use um token de opacity (ex.: /hover)"],
  [/--spacing\(/, "--spacing() não existe sem o tema do Tailwind: use um token"],
]
const UNIT = /(\d)(px|rem|em|vh|vw|deg|turn|ms|s)\b|#[0-9a-f]{3,8}\b|\b(rgb|rgba|hsl|hsla|oklch|oklab)\(/i
for (const [cls, where] of candidates) {
  const util = utilityOf(cls)
  for (const [re, msg] of FORBIDDEN) if (re.test(util) || (re.source.startsWith("--") && re.test(cls))) where.forEach(w => report(w, `"${cls}" — ${msg}`))
  // valores arbitrários (fora dos colchetes de variantes)
  const values = [...util.matchAll(/\[([^\]]*)\]/g)].map(m => m[1])
  for (const v of values) if (UNIT.test(v.replace(/_/g, " "))) where.forEach(w => report(w, `"${cls}" — valor solto dentro de [...]: use var(--aurora-<semântico>)`))
  // variáveis referenciadas
  for (const m of cls.matchAll(/--aurora-[a-z0-9-]+/g)) {
    if (foundationVars.has(m[0])) where.forEach(w => report(w, `"${cls}" — ${m[0]} é fundação; componentes só usam semânticos`))
    else if (!semanticVars.has(m[0])) where.forEach(w => report(w, `"${cls}" — ${m[0]} não existe`))
  }
}

// Qualquer variável CSS citada no código (classes, style={{...}}, strings):
// tokens do Aurora precisam ser semânticos existentes; as demais só podem ser
// variáveis conhecidas das bibliotecas (Radix, Base UI, react-day-picker, Tailwind).
const LIBRARY_VARS = /^--(radix-|anchor-|available-|transform-origin|cell-|tw-|accordion-panel|scroll-fade|normal-|border-radius$)/
for (const file of files) {
  const src = readFileSync(file, "utf8")
  const rel = path.relative(root, file).replace(/\\/g, "/")
  if (rel === "src/lib/tokens-merge.ts") continue
  for (const m of src.matchAll(/(?:var\(|\()(--[a-zA-Z0-9-]+)/g)) {
    const name = m[1]
    const where = `${rel}:${lineOf(src, m.index)}`
    if (name.startsWith("--aurora-")) {
      if (foundationVars.has(name)) report(where, `${name} é fundação; componentes só usam semânticos`)
      else if (!semanticVars.has(name)) report(where, `${name} não existe`)
    } else if (!LIBRARY_VARS.test(name)) {
      report(where, `variável ${name} desconhecida (não é token do Aurora nem de biblioteca conhecida)`)
    }
  }
}

// ---------------------------------------------------------------------------
// 2. Toda classe gera CSS
// ---------------------------------------------------------------------------
function resolvePackageCss(spec) {
  const parts = spec.split("/")
  const pkgName = spec.startsWith("@") ? parts.slice(0, 2).join("/") : parts[0]
  const sub = spec.slice(pkgName.length + 1)
  const pkgDir = path.join(root, "node_modules", pkgName)
  if (sub && existsSync(path.join(pkgDir, sub))) return path.join(pkgDir, sub)
  const pkg = JSON.parse(readFileSync(path.join(pkgDir, "package.json"), "utf8"))
  const pick = e => (typeof e === "string" ? e : e && (e.style || e.default || e.import))
  const entry = sub ? pick(pkg.exports?.["./" + sub]) : pick(pkg.exports?.["."]) || pkg.style || "index.css"
  return path.join(pkgDir, entry)
}
async function loadStylesheet(id, base) {
  const file = id.startsWith(".") || path.isAbsolute(id) ? path.resolve(base, id) : resolvePackageCss(id)
  return { path: file, base: path.dirname(file), content: readFileSync(file, "utf8") }
}
const twDir = path.join(root, "node_modules/tailwindcss")
const { compile } = await import(pathToFileURL(path.join(twDir, "dist/lib.mjs")).href)
const entry = path.join(root, "src/index.css")
// usa os arquivos gerados em memória (o que DEVERIA estar em disco)
const compiler = await compile(readFileSync(entry, "utf8"), {
  base: path.dirname(entry),
  loadStylesheet: async (id, base) => {
    const res = await loadStylesheet(id, base)
    const rel = path.relative(root, res.path).replace(/\\/g, "/")
    if (manifest.outputs[rel]) res.content = manifest.outputs[rel]
    return res
  },
})
const css = compiler.build([...candidates.keys()])
const cssEscape = s => s.replace(/[^a-zA-Z0-9_-]/g, ch => "\\" + ch)
for (const [cls, where] of candidates) {
  if (!css.includes("." + cssEscape(cls))) where.forEach(w => report(w, `"${cls}" não gera CSS (classe inexistente ou valor que não é token)`))
}

// ---------------------------------------------------------------------------
// 4. Contraste (WCAG)
// ---------------------------------------------------------------------------
const tokensCss = manifest.outputs["src/styles/tokens.css"]
const blockVars = selector => {
  const m = tokensCss.match(new RegExp(`(?:^|\\n)${selector.replace(".", "\\.")} \\{([\\s\\S]*?)\\n\\}`))
  return Object.fromEntries([...(m ? m[1] : "").matchAll(/(--aurora-[a-z0-9-]+):\s*([^;]+);/g)].map(x => [x[1], x[2].trim()]))
}
const rootVars = blockVars(":root")
const themeSelectors = [...tokensCss.matchAll(/\n(\.[a-z0-9-]+) \{/g)].map(m => m[1])
const resolveColor = (name, vars) => {
  let v = vars[name] ?? rootVars[name]
  for (let i = 0; i < 20 && v; i++) {
    const m = v.match(/^var\((--aurora-[a-z0-9-]+)\)$/)
    if (!m) return v
    v = vars[m[1]] ?? rootVars[m[1]]
  }
  return v
}
const lum = hex => {
  const n = hex.replace("#", "")
  const [r, g, b] = [0, 2, 4].map(i => parseInt(n.slice(i, i + 2), 16) / 255).map(c => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4))
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}
const ratio = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05) }
// [texto/elemento, fundo, mínimo, descrição]
const PAIRS = [
  ["text-1", "background-5", 4.5, "texto principal na página"],
  ["text-1", "background-6", 4.5, "texto principal em card/popover"],
  ["text-3", "background-5", 4.5, "texto secundário na página"],
  ["text-3", "background-6", 4.5, "texto secundário em card/popover"],
  ["text-1", "background-4", 4.5, "texto sobre superfície sutil"],
  ["background-5", "background-2", 4.5, "texto do tooltip"],
  ["link-4", "background-5", 4.5, "ação secundária / link na página"],
  ["link-4", "link-5", 4.5, "botão secundário"],
  ["link-10", "link-1", 3, "texto do botão principal (limitado pela marca: mínimo para texto grande)"],
  ["alerts-9", "alerts-8", 4.5, "botão/badge destrutivo"],
  ["alerts-7", "background-6", 4.5, "texto de alerta de erro"],
  ["text-1", "link-2", 4.5, "texto no intervalo do calendário"],
  ["field", "background-5", 3, "borda de campo (componente de interface)"],
  ["focus", "background-5", 3, "anel de foco"],
  ["invalid", "background-5", 3, "borda de campo inválido"],
]
const contrastLines = []
for (const [label, vars] of [["claro", {}], ...themeSelectors.map(s => [s.slice(1), blockVars(s)])]) {
  for (const [fg, bg, min, desc] of PAIRS) {
    const a = resolveColor(`--aurora-color-${fg}`, vars), b = resolveColor(`--aurora-color-${bg}`, vars)
    if (!/^#[0-9A-F]{6}$/i.test(a ?? "") || !/^#[0-9A-F]{6}$/i.test(b ?? "")) continue
    const r = ratio(a, b)
    const ok = r >= min
    contrastLines.push(`  ${ok ? "ok  " : "FALHA"} ${label.padEnd(6)} ${r.toFixed(2).padStart(5)}:1 (mín ${min}) ${fg} sobre ${bg} — ${desc}`)
    if (!ok) report(`tema ${label}`, `contraste ${r.toFixed(2)}:1 abaixo de ${min}:1 — ${fg} sobre ${bg} (${desc})`)
  }
}

// ---------------------------------------------------------------------------
console.log(`Contraste:\n${contrastLines.join("\n")}\n`)
console.log(`Classes verificadas: ${candidates.size} em ${files.length} arquivos`)
if (problems.length) {
  console.error(`\n${problems.length} problema(s):\n  - ` + [...new Set(problems)].join("\n  - "))
  process.exit(1)
}
console.log("tokens:check — tudo certo")
