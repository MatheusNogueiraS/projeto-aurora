// Prepara o build estático do Storybook para publicar como Artifact no mesmo link.
//
//   node preparar.mjs <storybook-static> <pasta-de-saida> [publicados.json]
//
// publicados.json (opcional): lista JSON com os caminhos que o Artifact tem hoje. Cada publicação
// leva junto o seu publicados.json, então na próxima basta baixá-lo do próprio link.
// Os que não existem mais no build novo saem como null, para serem removidos na publicação.
// Saída: <pasta-de-saida>/storybook-aurora.html (a página), <pasta-de-saida>/publicados.json e
// <pasta-de-saida>/files.json (o mapa `files` pronto para a publicação, só com o que mudou, com a pasta de saída como `root`).
import { readFileSync, writeFileSync, rmSync, cpSync, readdirSync, statSync, existsSync } from "node:fs"
import path from "node:path"

const [src, out, publishedFile] = process.argv.slice(2)
if (!src || !out) {
  console.error("uso: node preparar.mjs <storybook-static> <pasta-de-saida> [arquivos-publicados.json]")
  process.exit(1)
}
if (!existsSync(path.join(src, "index.html"))) {
  console.error(`${src}/index.html não existe: rode pnpm build-storybook antes`)
  process.exit(1)
}

// 1. copia o build para uma pasta limpa. Só apaga pasta vazia ou de uma preparação anterior:
// um caminho errado (ex.: ".") apagaria o projeto.
if (existsSync(out) && readdirSync(out).length && !existsSync(path.join(out, "storybook-aurora.html"))) {
  console.error(`${out} não está vazia e não é uma preparação anterior: escolha outra pasta de saída`)
  process.exit(1)
}
rmSync(out, { recursive: true, force: true })
cpSync(src, out, { recursive: true })

// 2. página principal: o Artifact monta o esqueleto do documento, então fica só o
// conteúdo do <head> (sem charset/viewport/título) e do <body>
const html = readFileSync(path.join(out, "index.html"), "utf8")
const head = html.slice(html.indexOf("<head>") + 6, html.indexOf("</head>"))
  .replace(/<meta charset[^>]*>/, "")
  .replace(/<title>[\s\S]*?<\/title>/, "")
  .replace(/<meta name="viewport"[^>]*>/, "")
  .trim()
const body = html.slice(html.indexOf("<body>") + 6, html.indexOf("</body>")).trim()
writeFileSync(path.join(out, "storybook-aurora.html"), `<title>Storybook Aurora</title>\n${head}\n${body}\n`)
rmSync(path.join(out, "index.html"))
rmSync(path.join(out, "project.json"), { force: true })

// 3. o Artifact recusa o caractere U+FFFD literal; troca `�` por `�` (mesmo valor em JS)
const REPLACEMENT = String.fromCharCode(0xfffd)
const BACKTICK = String.fromCharCode(0x60)
const LITERAL = BACKTICK + REPLACEMENT + BACKTICK
const ESCAPED = BACKTICK + "\\" + "uFFFD" + BACKTICK
const walk = d => readdirSync(d).flatMap(n => { const p = path.join(d, n); return statSync(p).isDirectory() ? walk(p) : [p] })
let escaped = 0, left = 0
for (const f of walk(out).filter(f => /\.(js|html|json|css)$/.test(f))) {
  const s = readFileSync(f, "utf8")
  if (!s.includes(REPLACEMENT)) continue
  const t = s.split(LITERAL).join(ESCAPED)
  escaped += s.split(LITERAL).length - 1
  left += t.split(REPLACEMENT).length - 1
  writeFileSync(f, t)
}

// 4. mapa `files`: cada arquivo de apoio no próprio caminho + os antigos que sumiram como null.
// A página em si nunca entra: o Artifact a lista como index.html, e removê-la apagaria o Storybook.
const PAGE = ["storybook-aurora.html", "index.html"]
const files = [...walk(out).map(f => path.relative(out, f).replace(/\\/g, "/")).filter(f => !PAGE.includes(f)), "publicados.json"].sort()
writeFileSync(path.join(out, "publicados.json"), JSON.stringify(files, null, 2))
const published = publishedFile && existsSync(publishedFile) ? JSON.parse(readFileSync(publishedFile, "utf8")) : []
const removed = published.filter(p => !PAGE.includes(p) && !files.includes(p))
// Só vai o que mudou: os arquivos de assets/ têm o hash no nome (mesmo nome = mesmo conteúdo) e, se já estão no link,
// ficam de fora (a publicação mantém o que não é citado). O resto (iframe.html, index.json, sb-*) vai sempre.
const keep = new Set(published)
const send = files.filter(f => !f.startsWith("assets/") || !keep.has(f))
const map = Object.fromEntries([...send.map(f => [f, f]), ...removed.map(f => [f, null])])
writeFileSync(path.join(out, "files.json"), JSON.stringify(map, null, 2))

console.log(JSON.stringify({ arquivos: files.length, removidos: removed, fffdTrocados: escaped, fffdRestantes: left }))
// limites do Artifact: 255 arquivos por publicação; U+FFFD literal é recusado
if (files.length > 255) console.error("mais de 255 arquivos: publique em duas vezes no mesmo link")
if (left > 0) console.error("ainda há U+FFFD literal fora de crases: a publicação será recusada")
