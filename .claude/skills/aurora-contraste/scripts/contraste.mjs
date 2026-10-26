// Análise de contraste do Aurora, nos temas claro e escuro, a partir dos pares que os componentes usam de verdade.
//
//   node .claude/skills/aurora-contraste/scripts/contraste.mjs            relatório (falhas e atenções)
//   node .claude/skills/aurora-contraste/scripts/contraste.mjs --all      relatório com todos os pares
//   node .claude/skills/aurora-contraste/scripts/contraste.mjs --check    só falhas de WCAG AA; exit 1 se houver
//   node .claude/skills/aurora-contraste/scripts/contraste.mjs --selftest confere as fórmulas com valores conhecidos
//
// Critérios (fontes na SKILL.md):
//   - WCAG 2.2 AA, normativo: texto 4.5:1 (1.4.3); texto grande 3:1; borda/anel/ícone que identifica controle ou
//     estado 3:1 contra a cor vizinha (1.4.11). Desabilitado e decorativo ficam isentos.
//   - APCA (rascunho do WCAG 3), só de apoio: aponta pares que passam no WCAG 2 mas leem mal, comum no tema escuro.
import { readFileSync, readdirSync } from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../../..")
const args = process.argv.slice(2)

// ---------------------------------------------------------------------------
// Fórmulas
// ---------------------------------------------------------------------------
const hexToRgb = hex => {
  const h = hex.replace("#", "")
  return { r: parseInt(h.slice(0, 2), 16), g: parseInt(h.slice(2, 4), 16), b: parseInt(h.slice(4, 6), 16), a: h.length === 8 ? parseInt(h.slice(6, 8), 16) / 255 : 1 }
}
const rgbToHex = ({ r, g, b }) => "#" + [r, g, b].map(v => Math.round(v).toString(16).padStart(2, "0")).join("").toUpperCase()
// cor com transparência sobre um fundo opaco (como o navegador pinta)
const over = (fg, bg) => ({ r: fg.r * fg.a + bg.r * (1 - fg.a), g: fg.g * fg.a + bg.g * (1 - fg.a), b: fg.b * fg.a + bg.b * (1 - fg.a), a: 1 })

// WCAG 2.x: luminância relativa e razão (w3.org/TR/WCAG22, definição "relative luminance")
const lin = c => (c /= 255) <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
const luminance = ({ r, g, b }) => 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b)
const ratio = (a, b) => { const [x, y] = [luminance(a), luminance(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05) }

// APCA-W3 0.0.98G-4g (github.com/Myndex/apca-w3), resultado em Lc com sinal
const A = { trc: 2.4, rco: 0.2126729, gco: 0.7151522, bco: 0.072175, normBG: 0.56, normTXT: 0.57, revTXT: 0.62, revBG: 0.65, blkThrs: 0.022, blkClmp: 1.414, scale: 1.14, offset: 0.027, deltaYmin: 0.0005, loClip: 0.1 }
const apcaY = ({ r, g, b }) => A.rco * (r / 255) ** A.trc + A.gco * (g / 255) ** A.trc + A.bco * (b / 255) ** A.trc
function apca(text, bg) {
  let t = apcaY(text), b = apcaY(bg)
  t = t > A.blkThrs ? t : t + (A.blkThrs - t) ** A.blkClmp
  b = b > A.blkThrs ? b : b + (A.blkThrs - b) ** A.blkClmp
  if (Math.abs(b - t) < A.deltaYmin) return 0
  if (b > t) { const s = (b ** A.normBG - t ** A.normTXT) * A.scale; return s < A.loClip ? 0 : (s - A.offset) * 100 }
  const s = (b ** A.revBG - t ** A.revTXT) * A.scale
  return s > -A.loClip ? 0 : (s + A.offset) * 100
}

if (args.includes("--selftest")) {
  const near = (v, want, tol) => { if (Math.abs(v - want) > tol) throw new Error(`esperado ${want}, veio ${v}`) }
  near(ratio(hexToRgb("#000000"), hexToRgb("#FFFFFF")), 21, 0.001)
  near(ratio(hexToRgb("#767676"), hexToRgb("#FFFFFF")), 4.54, 0.01) // menor cinza que passa 4.5:1 no branco
  near(apca(hexToRgb("#000000"), hexToRgb("#FFFFFF")), 106.04, 0.1)
  near(apca(hexToRgb("#FFFFFF"), hexToRgb("#000000")), -107.88, 0.1)
  near(apca(hexToRgb("#888888"), hexToRgb("#FFFFFF")), 63.06, 0.5)
  near(over(hexToRgb("#00000080"), hexToRgb("#FFFFFF")).r, 127.5, 0.6)
  console.log("contraste: fórmulas conferidas")
  process.exit(0)
}

// ---------------------------------------------------------------------------
// Tokens: resolve cada semântico para o hex final em cada tema
// ---------------------------------------------------------------------------
const readJson = rel => JSON.parse(readFileSync(path.join(root, rel), "utf8"))
const flatten = (obj, prefix = []) =>
  "$value" in obj ? [[prefix.join("."), obj.$value]]
    : Object.entries(obj).filter(([k, v]) => !k.startsWith("$") && v && typeof v === "object").flatMap(([k, v]) => flatten(v, [...prefix, k]))
const base = new Map([...flatten(readJson("tokens/foundation.json")), ...flatten(readJson("tokens/semantic.json"))])
const dark = new Map(flatten(readJson("tokens/themes/dark.json")))
const THEMES = { claro: id => base.get(id), escuro: id => dark.get(id) ?? base.get(id) }
function resolve(id, theme) {
  let v = THEMES[theme](id)
  for (let i = 0; i < 20 && typeof v === "string" && /^\{.+\}$/.test(v); i++) v = THEMES[theme](v.slice(1, -1))
  return v
}
// nome da classe -> token: "link-5" -> color.link.5, "disabled-surface" -> color.disabled-surface
const colorIds = [...base.keys()].filter(id => id.startsWith("color.") && !/^color\.(neutral|orange|purple|yellow|aqua|green|red|skin|black-alpha|white-alpha|black|white)\b/.test(id))
const byClassName = new Map(colorIds.map(id => [id.slice(6).replace(/\./g, "-"), id]))
const opacity = name => Number(resolve(`opacity.${name}`, "claro"))
const PAGE = "color.background.5", CARD = "color.background.6"

// ---------------------------------------------------------------------------
// Pares usados nos componentes
// ---------------------------------------------------------------------------
// shortcut: lê as classes como texto, por string; cor herdada de outro elemento (ex.: texto de um pai) não é vista. Ampliar se aparecer falso "ok".
const UTIL = /^(text|bg|border(?:-[trblxyse])?|ring|outline|fill|stroke)-([a-z0-9-]+?)(?:\/([a-z]+))?$/
const EXEMPT_STATE = /(^|:)(disabled|aria-disabled|data-disabled|group-disabled|peer-disabled|group-data-\[disabled)/
const splitVariant = cls => { let depth = 0, cut = 0; for (let i = 0; i < cls.length; i++) { const c = cls[i]; if (c === "[" || c === "(") depth++; else if (c === "]" || c === ")") depth--; else if (c === ":" && depth === 0) cut = i + 1 } return [cls.slice(0, cut), cls.slice(cut)] }
const kindOf = prop => (prop === "text" ? "text" : prop === "bg" ? "bg" : prop === "fill" || prop === "stroke" ? "icon" : "edge")
// bordas/anéis que identificam controle ou estado (1.4.11); o resto é decorativo
const UI_EDGE = /^color\.(field|focus|invalid|link\.|alerts\.|brand\.)/

const uiDir = path.join(root, "src/components/ui")
const uses = []
for (const file of readdirSync(uiDir).filter(f => f.endsWith(".tsx"))) {
  const src = readFileSync(path.join(uiDir, file), "utf8")
  for (const m of src.matchAll(/"((?:[^"\\\n]|\\.)*)"|`((?:[^`\\]|\\.)*)`/g)) {
    const text = m[1] ?? m[2]
    const line = src.slice(0, m.index).split("\n").length
    const states = new Map() // variante -> { text, bg, edge[], icon[] }
    for (const cls of text.split(/\s+/)) {
      const [variant, util] = splitVariant(cls)
      const u = util.match(UTIL)
      const id = u && byClassName.get(u[2])
      if (!id) continue
      const s = states.get(variant) ?? { edge: [], icon: [] }
      const color = { id, alpha: u[3] ? opacity(u[3]) : 1 }
      const kind = kindOf(u[1])
      if (kind === "edge" || kind === "icon") s[kind].push(color)
      else s[kind] = color
      states.set(variant, s)
    }
    if (!states.size) continue
    const large = /typo-(display|heading-[1-4])\b/.test(text)
    // ícone pintado pela cor do texto (currentColor): chave de variante de ícone (icon:, media:, tone:...) ou peça de
    // tamanho fixo sem tipografia (marcador do Checkbox/Radio). Para ícone o mínimo é 3:1 (1.4.11), não 4.5:1.
    const key = src.slice(Math.max(0, m.index - 40), m.index)
    const iconString = /(icon|media|tone|indicator|arrow|brand|neutral|inherit|plain)\w*["']?\s*:\s*$/i.test(key) || (/\bsize-\[/.test(text) && !/typo-/.test(text))
    const baseState = states.get("") ?? { edge: [], icon: [] }
    // foco sólido em qualquer estado da mesma família (focus-visible / focus-within): o halo dessa família é decorativo
    const focusKey = v => v.match(/focus-(visible|within)/)?.[0]
    const solidFocus = new Set([...states].filter(([v, s]) => focusKey(v) && s.edge.some(e => e.alpha === 1 && UI_EDGE.test(e.id))).map(([v]) => focusKey(v)))
    for (const [variant, s] of states) {
      // condições entre colchetes (ex.: not-has-[...:disabled]) não tornam o estado desabilitado
      let plain = variant
      while (/\[[^[\]]*\]/.test(plain)) plain = plain.replace(/\[[^[\]]*\]/g, "") // colchetes aninhados
      // texto na cor de desabilitado é, por definição, estado desabilitado (isento pelo 1.4.3)
      const exempt = EXEMPT_STATE.test(plain) || /(^|:)(group-|peer-)?data-\[disabled/.test(variant) || /^color\.disabled/.test((s.text ?? baseState.text)?.id ?? "")
      const bg = s.bg ?? baseState.bg
      const fg = s.text ?? baseState.text
      const where = `${file}:${line}${variant ? ` (${variant.replace(/:$/, "")})` : ""}`
      const surfaces = bg ? [bg] : [{ id: PAGE, alpha: 1 }, { id: CARD, alpha: 1 }]
      const textKind = iconString || /icon|svg/.test(variant) ? "ícone" : large ? "texto grande" : "texto"
      // mesma cor do fundo = continuação da forma (ex.: seta do Tooltip), não informação
      const kindFor = (c, k) => (bg && c.id === bg.id ? "decorativo" : k)
      if (fg && (s.text || s.bg || !variant)) for (const b of surfaces) uses.push({ fg, bg: b, kind: kindFor(fg, textKind), exempt, where })
      // halo translúcido junto de uma borda sólida do mesmo estado: quem identifica é a borda
      const hasSolidEdge = s.edge.some(e => e.alpha === 1 && UI_EDGE.test(e.id)) || solidFocus.has(focusKey(variant))
      for (const e of s.edge) for (const b of [{ id: PAGE, alpha: 1 }, { id: CARD, alpha: 1 }])
        uses.push({ fg: e, bg: b, kind: !UI_EDGE.test(e.id) || (e.alpha < 1 && hasSolidEdge) ? "decorativo" : "borda/anel", exempt, where })
      for (const i of s.icon) for (const b of surfaces) uses.push({ fg: i, bg: b, kind: kindFor(i, "ícone"), exempt, where })
    }
  }
}

// ---------------------------------------------------------------------------
// Avaliação
// ---------------------------------------------------------------------------
const MIN = { texto: 4.5, "texto grande": 3, "borda/anel": 3, ícone: 3, decorativo: 0 }
// alvos APCA de apoio (Bronze): texto corrido Lc 60 (75 é o ideal para corpo), texto grande 45, elementos de interface 30
const LC = { texto: 60, "texto grande": 45, "borda/anel": 30, ícone: 30, decorativo: 0 }
const colorIn = (c, theme, backdrop) => {
  const rgb = hexToRgb(String(resolve(c.id, theme)))
  rgb.a *= c.alpha
  return rgb.a < 1 ? over(rgb, backdrop) : rgb
}
const results = new Map()
for (const theme of Object.keys(THEMES)) {
  const page = hexToRgb(String(resolve(PAGE, theme)))
  for (const u of uses) {
    const bg = colorIn(u.bg, theme, page)
    const fg = colorIn(u.fg, theme, bg)
    const r = ratio(fg, bg), lc = apca(fg, bg)
    const name = c => c.id.slice(6) + (c.alpha < 1 ? `/${Math.round(c.alpha * 100)}%` : "")
    const key = [theme, name(u.fg), name(u.bg), u.kind, u.exempt].join("|")
    const status = u.exempt || !MIN[u.kind] ? "isento" : r < MIN[u.kind] ? "FALHA" : Math.abs(lc) < LC[u.kind] ? "atenção" : "ok"
    const prev = results.get(key)
    if (prev) { prev.where.add(u.where); continue }
    results.set(key, { theme, fg: name(u.fg), bg: name(u.bg), kind: u.kind, ratio: r, lc, min: MIN[u.kind], status, hex: `${rgbToHex(fg)} / ${rgbToHex(bg)}`, where: new Set([u.where]) })
  }
}

// Exceções decididas pelo responsável (excecoes.json): continuam no relatório, mas não contam como falha.
// Só valem onde foram decididas: se o mesmo par aparecer em outro arquivo, volta a ser falha.
const exceptions = JSON.parse(readFileSync(path.join(path.dirname(fileURLToPath(import.meta.url)), "../excecoes.json"), "utf8"))
const all = [...results.values()]
for (const r of all) {
  if (r.status !== "FALHA") continue
  const e = exceptions.find(e => e.primeiroPlano === r.fg && (!e.fundo || e.fundo === r.bg) && (!e.tema || e.tema === r.theme) &&
    (!e.onde || [...r.where].every(w => [e.onde].flat().some(o => w.startsWith(o)))))
  if (e) Object.assign(r, { status: "exceção", motivo: e.motivo })
}
const fails = all.filter(r => r.status === "FALHA")
if (args.includes("--check")) {
  for (const f of fails) console.error(`FALHA ${f.theme}: ${f.fg} sobre ${f.bg} (${f.kind}) ${f.ratio.toFixed(2)}:1, mínimo ${f.min}:1 — ${[...f.where][0]}`)
  console.log(`contraste: ${fails.length} falha(s) de WCAG AA em ${all.length} pares`)
  process.exit(fails.length ? 1 : 0)
}
const order = { FALHA: 0, exceção: 1, atenção: 2, ok: 3, isento: 4 }
const show = all.filter(r => args.includes("--all") || r.status === "FALHA" || r.status === "exceção" || r.status === "atenção")
  .sort((a, b) => order[a.status] - order[b.status] || a.theme.localeCompare(b.theme) || a.ratio - b.ratio)
console.log(`# Contraste do Aurora\n`)
for (const theme of Object.keys(THEMES)) {
  const t = all.filter(r => r.theme === theme)
  const count = s => t.filter(r => r.status === s).length
  console.log(`- **${theme}:** ${t.length} pares · ${count("FALHA")} falha(s) WCAG AA · ${count("exceção")} exceção(ões) aceita(s) · ${count("atenção")} atenção (APCA) · ${count("ok")} ok · ${count("isento")} isentos`)
}
console.log(`\n| Situação | Tema | Primeiro plano | Fundo | Tipo | WCAG | APCA Lc | Hex | Onde |\n|---|---|---|---|---|---|---|---|---|`)
for (const r of show) {
  const where = [...r.where]
  console.log(`| ${r.status} | ${r.theme} | ${r.fg} | ${r.bg} | ${r.kind} | ${r.ratio.toFixed(2)}:1${r.min ? ` (mín ${r.min})` : ""} | ${r.lc.toFixed(0)} | ${r.hex} | ${where.slice(0, 2).join("; ")}${where.length > 2 ? ` +${where.length - 2}` : ""} |`)
}
