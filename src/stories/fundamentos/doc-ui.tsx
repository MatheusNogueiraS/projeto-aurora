// Peças visuais das páginas de Fundamentos.
import * as React from "react"

import { chain, formatValue, resolve, type Token } from "./tokens-data"

export function Page({ title, children, intro }: { title: string; intro: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-sm text-text-1">
      <header className="flex flex-col gap-nano">
        <h1 className="typo-headline-3">{title}</h1>
        <p className="typo-body-small text-text-3">{intro}</p>
      </header>
      {children}
    </div>
  )
}

export function Section({ title, description, children }: { title: string; description?: React.ReactNode; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-xxxs">
      <div className="flex flex-col gap-quark">
        <h2 className="typo-headline-5">{title}</h2>
        {description && <p className="typo-body-small text-text-3">{description}</p>}
      </div>
      {children}
    </section>
  )
}

export function Grid({ children }: { children: React.ReactNode }) {
  return <div className="grid gap-xxxs sm:grid-cols-2 lg:grid-cols-3">{children}</div>
}

/** Nome do token como aparece no JSON. */
export function TokenName({ id }: { id: string }) {
  return <code className="typo-body-small-bold break-all">{id}</code>
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
    <span className="typo-caption break-all text-text-3">
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
    <span className="typo-caption text-text-3">
      {dark ? `Claro ${light} · Escuro ${dark}` : light}
    </span>
  )
}

/** Cartão padrão de um token: amostra à esquerda, informações à direita. */
export function TokenCard({ token, sample, hidePrefix }: { token: Token; sample: React.ReactNode; hidePrefix?: string }) {
  return (
    <div className="flex min-w-none items-center gap-xxxs rounded-card border-default border-divider bg-background-6 p-nano">
      <div className="shrink-0">{sample}</div>
      <div className="flex min-w-none flex-col gap-pico">
        <TokenName id={strip(token.id, hidePrefix)} />
        <Chain id={token.id} hidePrefix={hidePrefix} />
        <Values token={token} />
        {token.description && <span className="typo-caption text-text-3">{token.description}</span>}
      </div>
    </div>
  )
}

/** Tabela simples: token, aponta para, valor. */
export function TokenTable({ tokens }: { tokens: Token[] }) {
  return (
    <div className="overflow-x-auto rounded-card border-default border-divider bg-background-6">
      <table className="w-full typo-body-small">
        <thead>
          <tr className="border-b-default border-divider text-left">
            <th className="p-nano typo-body-small-bold">Token</th>
            <th className="p-nano typo-body-small-bold">Aponta para</th>
            <th className="p-nano typo-body-small-bold">Valor</th>
          </tr>
        </thead>
        <tbody>
          {tokens.map((t) => (
            <tr key={t.id} className="border-b-default border-divider last:border-b-(length:--aurora-stroke-none)">
              <td className="p-nano align-top">
                <TokenName id={t.id} />
                {t.description && <div className="typo-caption text-text-3">{t.description}</div>}
              </td>
              <td className="p-nano align-top typo-caption text-text-3">{chain(t.id).slice(1).join(" → ") || "—"}</td>
              <td className="p-nano align-top typo-caption">
                <Values token={t} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
