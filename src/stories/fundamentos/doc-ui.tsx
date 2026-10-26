// Peças visuais das páginas de Fundamentos.
import * as React from "react"

import { chain, cssVarName, formatValue, resolve, type Theme, type Token } from "./tokens-data"

export function Page({ title, children, intro }: { title: string; intro: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-xxl text-text-1">
      <header className="flex flex-col gap-sm">
        <h1 className="typo-heading-5">{title}</h1>
        <p className="typo-body-md-regular text-text-3">{intro}</p>
      </header>
      {children}
    </div>
  )
}

export function Section({ title, description, children }: { title: string; description?: React.ReactNode; children?: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-md">
      <div className="flex flex-col gap-xs">
        <h2 className="typo-heading-6">{title}</h2>
        {description && <p className="typo-body-md-regular text-text-3">{description}</p>}
      </div>
      {children}
    </section>
  )
}

export function Grid({ children }: { children: React.ReactNode }) {
  return <div className="grid gap-md sm:grid-cols-2 lg:grid-cols-3">{children}</div>
}

/** Nome do token como aparece no JSON. */
export function TokenName({ id }: { id: string }) {
  return <code className="typo-body-md-bold break-all">{id}</code>
}

/** Tira um prefixo repetitivo do nome exibido (ex.: "color." na página de Cores). Só afeta a exibição. */
const strip = (id: string, prefix = "") => (prefix && id.startsWith(prefix) ? id.slice(prefix.length) : id)

/** "aponta para → brand.1 → orange.50" e, se o caminho mudar no tema escuro, o caminho do escuro. */
export function Chain({ id, hidePrefix }: { id: string; hidePrefix?: string }) {
  const light = chain(id, "light").slice(1).map((step) => strip(step, hidePrefix))
  const dark = chain(id, "dark").slice(1).map((step) => strip(step, hidePrefix))
  if (!light.length) return null
  const differs = dark.join() !== light.join()
  return (
    <span className="typo-body-sm-regular break-all text-text-3">
      → {light.join(" → ")}
      {differs && <> · escuro: → {dark.join(" → ")}</>}
    </span>
  )
}

/** Valor final no tema claro e, se for diferente, no escuro (mesmo que a mudança venha por herança). */
export function Values({ token }: { token: Token }) {
  const light = formatValue(resolve(token.id, "light"), token.type, token.id)
  const darkValue = formatValue(resolve(token.id, "dark"), token.type, token.id)
  const dark = darkValue !== light ? darkValue : null
  return (
    <span className="typo-body-sm-regular text-text-3">
      {dark ? `Claro ${light} · Escuro ${dark}` : light}
    </span>
  )
}

/** Cartão padrão de um token: amostra à esquerda, informações à direita. */
export function TokenCard({ token, sample, hidePrefix }: { token: Token; sample: React.ReactNode; hidePrefix?: string }) {
  return (
    <div className="flex min-w-[0px] items-center gap-md rounded-sm border-default border-divider bg-background-6 p-sm">
      <div className="shrink-0">{sample}</div>
      <div className="flex min-w-[0px] flex-col gap-xxs">
        <TokenName id={strip(token.id, hidePrefix)} />
        <Chain id={token.id} hidePrefix={hidePrefix} />
        <Values token={token} />
        {token.description && <span className="typo-body-sm-regular text-text-3">{token.description}</span>}
      </div>
    </div>
  )
}

/** Tabela simples: token, aponta para, valor. */
export function TokenTable({ tokens }: { tokens: Token[] }) {
  return (
    <div className="overflow-x-auto rounded-sm border-default border-divider bg-background-6">
      <table className="w-full typo-body-md-regular">
        <thead>
          <tr className="border-b-default border-divider text-left">
            <th className="p-sm typo-body-md-bold">Token</th>
            <th className="p-sm typo-body-md-bold">Aponta para</th>
            <th className="p-sm typo-body-md-bold">Valor</th>
          </tr>
        </thead>
        <tbody>
          {tokens.map((t) => (
            <tr key={t.id} className="border-b-default border-divider last:border-b-(length:--aurora-stroke-none)">
              <td className="p-sm align-top">
                <TokenName id={t.id} />
                {t.description && <div className="typo-body-sm-regular text-text-3">{t.description}</div>}
              </td>
              <td className="p-sm align-top typo-body-sm-regular text-text-3">{chain(t.id).slice(1).join(" → ") || "—"}</td>
              <td className="p-sm align-top typo-body-sm-regular">
                <Values token={t} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

/** Uma cor num tema: amostra, hex final e o caminho até a paleta (fundação). */
function ColorInTheme({ id, theme, hidePrefix }: { id: string; theme: Theme; hidePrefix?: string }) {
  const hex = String(resolve(id, theme)).toUpperCase()
  const path = chain(id, theme).slice(1).map((step) => strip(step, hidePrefix))
  const lightHex = String(resolve(id, "light")).toUpperCase()
  const samePath = theme === "dark" && chain(id, "dark").join() === chain(id, "light").join() && hex === lightHex
  return (
    <div className="flex items-center gap-sm">
      <div className="size-[32px] shrink-0 rounded-xs border-default border-divider" style={{ background: hex }} />
      <div className="flex min-w-[0px] flex-col">
        <code className="typo-body-md-bold">{hex}</code>
        <span className="typo-body-sm-regular break-all text-text-3">{samePath ? "igual ao claro" : "→ " + path.join(" → ")}</span>
      </div>
    </div>
  )
}

/**
 * Tabela de cores semânticas: o mesmo token, o valor dele no tema claro e no escuro, lado a lado.
 * As amostras usam o hex final (não a variável CSS), então os dois temas aparecem sempre, sem trocar o botão de tema.
 */
export function SemanticColorTable({ tokens, hidePrefix }: { tokens: Token[]; hidePrefix?: string }) {
  return (
    <div className="overflow-x-auto rounded-sm border-default border-divider bg-background-6">
      <table className="w-full min-w-[640px] table-fixed typo-body-md-regular">
        <thead>
          <tr className="border-b-default border-divider text-left">
            <th className="w-1/3 p-sm typo-body-md-bold">Token</th>
            <th className="w-1/3 p-sm typo-body-md-bold">Claro</th>
            <th className="w-1/3 p-sm typo-body-md-bold">Escuro</th>
          </tr>
        </thead>
        <tbody>
          {tokens.map((t) => (
            <tr key={t.id} className="border-b-default border-divider last:border-b-(length:--aurora-stroke-none)">
              <td className="p-sm align-top">
                <TokenName id={strip(t.id, hidePrefix)} />
                <div className="typo-body-sm-regular break-all text-text-3">{cssVarName(t.id)}</div>
                {t.description && <div className="typo-body-sm-regular text-text-3">{t.description}</div>}
              </td>
              <td className="p-sm align-top">
                <ColorInTheme id={t.id} theme="light" hidePrefix={hidePrefix} />
              </td>
              <td className="p-sm align-top">
                <ColorInTheme id={t.id} theme="dark" hidePrefix={hidePrefix} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
