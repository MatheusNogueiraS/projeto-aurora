// Trava do harness (hook PreToolUse do Claude Code). Barra (exit 2, motivo no stderr):
//   1. editar arquivo do projeto na main                       (regra 1 do CLAUDE.md)
//   2. editar arquivo gerado (carimbo de gerado na abertura)  (regra 11)
//   3. git add -A / git add . / git commit -a                   (aurora-git-fluxo, regra 4)
//   4. git push --force                                         (aurora-git-fluxo, regra 9)
//   5. git commit na main, ou com lint/tipos/inventário/contraste falhando (regras 1, 4 e 18b)
// Erro interno da trava não bloqueia (exit 0): uma trava quebrada não pode travar o trabalho.
import { readFileSync, existsSync } from "node:fs"
import { execFileSync, execSync } from "node:child_process"
import path from "node:path"
import { fileURLToPath } from "node:url"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..")
// carimbo que os geradores escrevem na abertura do arquivo (tokens: comentário; manifest: $comment)
const GENERATED = /^(\/\*\s*\*\s*ARQUIVO GERADO|\{\s*"\$comment":\s*"GERADO)/
const block = msg => { process.stderr.write(`Barrado pela trava do Aurora (.claude/hooks/guard.mjs): ${msg}\n`); process.exit(2) }
const branch = () => execFileSync("git", ["rev-parse", "--abbrev-ref", "HEAD"], { cwd: root, encoding: "utf8" }).trim()

let input
try {
  input = JSON.parse(readFileSync(0, "utf8"))
} catch {
  process.exit(0)
}
const { tool_name: tool, tool_input: args = {} } = input

try {
  if (["Edit", "Write", "MultiEdit", "NotebookEdit"].includes(tool)) {
    const file = path.resolve(root, args.file_path ?? args.notebook_path ?? "")
    const inProject = !path.relative(root, file).startsWith("..") && !path.isAbsolute(path.relative(root, file))
    if (!inProject) process.exit(0) // memória, scratchpad e outros projetos ficam livres
    if (existsSync(file) && GENERATED.test(readFileSync(file, "utf8").slice(0, 200)))
      block(`${path.relative(root, file).replace(/\\/g, "/")} é gerado. Edite a fonte (tokens/*.json → pnpm tokens; componentes → manifest.mjs) e gere de novo.`)
    if (branch() === "main")
      block("você está na main. Crie uma branch antes de editar (skill aurora-git-fluxo: main atualizada e validada → git switch -c <tipo>/<assunto>).")
  }

  if (["Bash", "PowerShell"].includes(tool)) {
    const cmd = String(args.command ?? "")
    // shortcut: lê o comando como texto; "git commit" escrito dentro de uma mensagem (ex.: corpo de PR) também conta
    if (/\bgit\s+add\b[^;&|\n]*\s(-A|--all|\.)(?=\s|$|[;&|])/.test(cmd))
      block("git add -A / git add . junta arquivos de outro trabalho. Adicione os arquivos pelo nome (git add <arquivos>).")
    if (/\bgit\s+commit\b[^;&|\n]*\s-[a-zA-Z]*a[a-zA-Z]*(?=\s|$)/.test(cmd))
      block("git commit -a junta tudo o que mudou. Adicione os arquivos pelo nome (git add <arquivos>) e faça o commit sem -a.")
    if (/\bgit\s+push\b[^;&|\n]*\s(--force(-with-lease)?|-f)(?=\s|$)/.test(cmd))
      block("push --force reescreve a história. Para desfazer algo, reverta por PR (aurora-git-fluxo, regra 9). Se for mesmo necessário, quem está operando roda à mão.")
    if (/\bgit\s+commit\b/.test(cmd)) {
      if (branch() === "main") block("commit na main não é permitido. Mova as mudanças para uma branch (git switch -c <tipo>/<assunto>).")
      const checks = [
        ["pnpm lint", "lint e trava de tokens"],
        ["pnpm exec tsc -b --noEmit", "tipos"],
        ["node .claude/skills/aurora-componente/scripts/manifest.mjs --check", "inventário de componentes"],
        ["node .claude/skills/aurora-contraste/scripts/contraste.mjs --check", "contraste (WCAG AA, claro e escuro)"],
      ]
      for (const [check, label] of checks) {
        try {
          execSync(check, { cwd: root, stdio: "pipe", encoding: "utf8" })
        } catch (err) {
          const out = `${err.stdout ?? ""}${err.stderr ?? ""}`.trim().split("\n").slice(-25).join("\n")
          block(`a checagem de ${label} falhou (${check}). Corrija antes do commit:\n${out}`)
        }
      }
    }
  }
} catch (err) {
  process.stderr.write(`guard.mjs: erro interno, ação liberada (${err.message})\n`)
  process.exit(0)
}
process.exit(0)
