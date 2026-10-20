// Lê os tokens direto da fonte de verdade (tokens/*.json) para as páginas de Fundamentos.
// Nada aqui é copiado à mão: se o JSON mudar, a documentação muda junto.
import foundationJson from "../../../tokens/foundation.json"
import semanticJson from "../../../tokens/semantic.json"
import darkJson from "../../../tokens/themes/dark.json"

export type Tier = "foundation" | "semantic"
export type Theme = "light" | "dark"
export type Token = {
  id: string
  path: string[]
  type: string
  value: unknown
  description?: string
  tier: Tier
}

type Node = { [key: string]: unknown }
const REF = /^-?\{([^{}]+)\}$/

function flatten(obj: Node, tier: Tier, prefix: string[] = [], inheritedType = ""): Token[] {
  const type = typeof obj.$type === "string" ? obj.$type : inheritedType
  if ("$value" in obj) {
    return [{
      id: prefix.join("."),
      path: prefix,
      type,
      value: obj.$value,
      description: typeof obj.$description === "string" ? obj.$description : undefined,
      tier,
    }]
  }
  return Object.entries(obj)
    .filter(([key, child]) => !key.startsWith("$") && typeof child === "object" && child !== null)
    .flatMap(([key, child]) => flatten(child as Node, tier, [...prefix, key], type))
}

export const foundation = flatten(foundationJson as Node, "foundation")
export const semantic = flatten(semanticJson as Node, "semantic")
const byId = new Map([...foundation, ...semantic].map((t) => [t.id, t]))
const darkOverrides = new Map(flatten(darkJson as Node, "semantic").map((t) => [t.id, t.value]))

/** Nome da variável CSS de um token, ex.: "color.link.1" -> "--aurora-color-link-1". */
export const cssVarName = (id: string) => "--aurora-" + id.split(".").join("-")
/** Referência CSS de um token semântico, que acompanha o tema ativo. */
export const cssVar = (id: string) => `var(${cssVarName(id)})`

/** Token para o qual este aponta (um passo da cadeia). */
export function refOf(id: string, theme: Theme = "light"): string | undefined {
  const value = theme === "dark" && darkOverrides.has(id) ? darkOverrides.get(id) : byId.get(id)?.value
  const m = typeof value === "string" ? value.match(REF) : null
  return m ? m[1] : undefined
}

/** Valor final (literal) de um token, seguindo a cadeia de referências. */
export function resolve(id: string, theme: Theme = "light"): unknown {
  let current = id
  for (let i = 0; i < 20; i++) {
    const next = refOf(current, theme)
    if (!next) {
      const value = theme === "dark" && darkOverrides.has(current) ? darkOverrides.get(current) : byId.get(current)?.value
      if (typeof value === "string" && value.startsWith("-{")) return `-${String(resolve(value.slice(2, -1), theme))}`
      return value
    }
    current = next
  }
  return undefined
}

/** Cadeia completa, ex.: ["color.link.1", "color.brand.1", "color.orange.50"]. */
export function chain(id: string, theme: Theme = "light"): string[] {
  const out = [id]
  let next = refOf(id, theme)
  while (next && out.length < 20) {
    out.push(next)
    next = refOf(next, theme)
  }
  return out
}

/** Tokens de um grupo, ex.: group(semantic, ["color", "link"]). */
export const group = (list: Token[], prefix: string[]) =>
  list.filter((t) => prefix.every((segment, i) => t.path[i] === segment))

/** Nome curto do token dentro do grupo, ex.: ["color","link","1"] com prefixo ["color"] -> "link-1". */
export const shortName = (t: Token, prefix: string[]) => t.path.slice(prefix.length).join("-")

/** Texto de exibição de um valor literal. */
export function formatValue(value: unknown, type: string, id = ""): string {
  if (Array.isArray(value)) {
    return type === "cubicBezier" ? `cubic-bezier(${value.join(", ")})` : value.join(", ")
  }
  if (typeof value === "number") {
    if (id.startsWith("opacity.")) return `${Math.round(value * 100)}%`
    return String(value)
  }
  if (typeof value === "string" && /^-?\d+(\.\d+)?px$/.test(value) && !id.startsWith("letter-spacing")) {
    const px = parseFloat(value)
    return `${value} · ${+(px / 16).toFixed(4)}rem`
  }
  return String(value)
}

