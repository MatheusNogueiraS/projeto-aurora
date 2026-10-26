// Inventário dos componentes do Aurora (src/components/ui) e das lacunas de documentação.
//
//   node .claude/skills/aurora-componente/scripts/manifest.mjs           atualiza manifest.json e mostra o resumo
//   node .claude/skills/aurora-componente/scripts/manifest.mjs --check   só confere (usado pelo hook de commit)
//
// Falha (exit 1) se:
//   1. manifest.json está desatualizado (só no --check);
//   2. um componente não tem história nem é usado por outro componente (órfão);
//   3. um valor de variante (cva) não aparece em nenhum arquivo do Storybook que importa o componente.
// Peça interna = sem história própria, mas usada por outro componente (ex.: input-group): é coberta pela história de quem a usa.
import { readFileSync, writeFileSync, readdirSync, statSync, existsSync } from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const here = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(here, "../../../..")
const UI = "src/components/ui"
const STORIES = "src/stories"
const OUT = path.join(here, "..", "manifest.json")
const rel = p => path.relative(root, p).replace(/\\/g, "/")
const walk = d => readdirSync(d).flatMap(n => { const p = path.join(d, n); return statSync(p).isDirectory() ? walk(p) : [p] })

// ---------------------------------------------------------------------------
// Leitura do código como texto (sem executar): import, export e cva
// ---------------------------------------------------------------------------
// shortcut: só remove comentários de linha inteira; um comentário no fim de uma linha dentro do cva pode confundir a leitura das variantes
const stripComments = src => src.replace(/^\s*\/\/.*$/gm, "").replace(/\/\*[\s\S]*?\*\//g, "")

// fecha o ( { [ que abre em `start`, pulando strings
function closing(src, start) {
  let depth = 0, quote = null
  for (let i = start; i < src.length; i++) {
    const ch = src[i]
    if (quote) { if (ch === "\\") i++; else if (ch === quote) quote = null; continue }
    if (ch === '"' || ch === "'" || ch === "`") quote = ch
    else if ("([{".includes(ch)) depth++
    else if (")]}".includes(ch) && --depth === 0) return i
  }
  return src.length
}
// separa por vírgulas de nível 0 (argumentos de função ou entradas de objeto)
function splitTop(body) {
  const parts = []
  let depth = 0, quote = null, start = 0
  for (let i = 0; i < body.length; i++) {
    const ch = body[i]
    if (quote) { if (ch === "\\") i++; else if (ch === quote) quote = null; continue }
    if (ch === '"' || ch === "'" || ch === "`") quote = ch
    else if ("([{".includes(ch)) depth++
    else if (")]}".includes(ch)) depth--
    else if (ch === "," && depth === 0) { parts.push(body.slice(start, i)); start = i + 1 }
  }
  parts.push(body.slice(start))
  return parts.map(p => p.trim()).filter(Boolean)
}
// entradas `chave: valor` de um objeto literal ("{ ... }")
const entries = obj =>
  splitTop(obj.trim().slice(1, -1)).flatMap(part => {
    const m = part.match(/^(?:(["'])([^"']+)\1|([\w$-]+))\s*:([\s\S]*)$/)
    return m ? [{ key: m[2] ?? m[3], value: m[4].trim() }] : []
  })

function cvaVariants(src) {
  const variants = {}
  for (const m of src.matchAll(/\bcva\(/g)) {
    const open = m.index + m[0].length - 1
    const args = splitTop(src.slice(open + 1, closing(src, open)))
    const config = args.find(a => a.startsWith("{"))
    const block = config && entries(config).find(e => e.key === "variants")
    if (!block?.value.startsWith("{")) continue
    for (const { key, value } of entries(block.value)) {
      if (!value.startsWith("{")) continue
      // duas chamadas de cva no mesmo arquivo com a mesma chave (ex.: size) somam os valores
      variants[key] = [...new Set([...(variants[key] ?? []), ...entries(value).map(e => e.key)])]
    }
  }
  return variants
}

function exportsOf(src) {
  const names = new Set()
  for (const m of src.matchAll(/^export\s*\{([^}]*)\}/gm))
    for (const item of m[1].split(",").map(s => s.trim()).filter(Boolean))
      if (!item.startsWith("type ")) names.add(item.split(/\s+as\s+/).pop())
  for (const m of src.matchAll(/^export\s+(?:default\s+)?(?:function|const|class)\s+([\w$]+)/gm)) names.add(m[1])
  return [...names].sort()
}

const uiImports = src => [...new Set([...src.matchAll(/from\s+["']@\/components\/ui\/([\w-]+)["']/g)].map(m => m[1]))].sort()

// ---------------------------------------------------------------------------
// Inventário
// ---------------------------------------------------------------------------
const componentFiles = readdirSync(path.join(root, UI)).filter(f => f.endsWith(".tsx")).sort()
const storyFiles = walk(path.join(root, STORIES)).filter(f => /\.(tsx|ts|mdx)$/.test(f)).sort()
const storySrc = Object.fromEntries(storyFiles.map(f => [rel(f), readFileSync(f, "utf8")]))

const components = {}
for (const file of componentFiles) {
  const name = file.replace(/\.tsx$/, "")
  const src = stripComments(readFileSync(path.join(root, UI, file), "utf8"))
  components[name] = {
    arquivo: `${UI}/${file}`,
    exporta: exportsOf(src),
    variantes: cvaVariants(src),
    usa: uiImports(src).filter(n => n !== name),
    usadoPor: [],
    documentadoEm: Object.keys(storySrc).filter(s => uiImports(storySrc[s]).includes(name)),
  }
}
for (const [name, c] of Object.entries(components)) for (const dep of c.usa) components[dep]?.usadoPor.push(name)

// ---------------------------------------------------------------------------
// Lacunas
// ---------------------------------------------------------------------------
const problems = []
for (const [name, c] of Object.entries(components)) {
  if (!c.documentadoEm.length) {
    if (!c.usadoPor.length) problems.push(`${c.arquivo}: órfão — sem história no Storybook e sem uso por outro componente`)
    continue // peça interna: as variantes aparecem pela história de quem a usa
  }
  const docs = c.documentadoEm.map(s => storySrc[s]).join("\n")
  for (const [variant, values] of Object.entries(c.variantes))
    for (const v of values)
      if (!new RegExp(`["'\`]${v.replace(/[-]/g, "\\-")}["'\`]`).test(docs))
        problems.push(`${c.arquivo}: variante ${variant}="${v}" não aparece no Storybook (${c.documentadoEm.join(", ")})`)
}

const manifest = {
  $comment: "GERADO — não edite à mão. Atualize com: node .claude/skills/aurora-componente/scripts/manifest.mjs",
  componentes: components,
}
const json = JSON.stringify(manifest, null, 2) + "\n"

if (process.argv.includes("--check")) {
  const current = existsSync(OUT) ? readFileSync(OUT, "utf8").replace(/\r\n/g, "\n") : null
  if (current !== json) problems.unshift(`${rel(OUT)}: desatualizado (rode: node .claude/skills/aurora-componente/scripts/manifest.mjs)`)
} else {
  writeFileSync(OUT, json)
  for (const [name, c] of Object.entries(components)) {
    const v = Object.entries(c.variantes).map(([k, vs]) => `${k}(${vs.length})`).join(" ") || "-"
    const doc = c.documentadoEm.length ? c.documentadoEm.map(s => path.basename(s)).join(", ") : "peça interna"
    console.log(`${name.padEnd(16)} variantes: ${v.padEnd(28)} usa: ${(c.usa.join(", ") || "-").padEnd(34)} usado por: ${c.usadoPor.length}  doc: ${doc}`)
  }
  console.log(`\n${componentFiles.length} componentes -> ${rel(OUT)}`)
}

if (problems.length) {
  console.error(`\n${problems.length} lacuna(s):\n  - ` + problems.join("\n  - "))
  process.exit(1)
}
console.log("componentes: inventário em dia, sem lacunas")
