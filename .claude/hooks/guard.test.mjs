// Testes da trava (guard.mjs). Rode depois de qualquer mudança nela:
//   node .claude/hooks/guard.test.mjs
// Funciona em qualquer branch: na main, os casos de edição esperam bloqueio. Rode também na main antes de concluir.
// O caso "commit fora da main" (que roda lint/tipos/inventário) não está aqui: teste-o à parte com um componente quebrado de propósito.
import { spawnSync, execFileSync } from "node:child_process"
import path from "node:path"
import { fileURLToPath } from "node:url"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..")
const guard = path.join(root, ".claude/hooks/guard.mjs")
const onMain = execFileSync("git", ["rev-parse", "--abbrev-ref", "HEAD"], { cwd: root, encoding: "utf8" }).trim() === "main"
const run = (tool_name, tool_input) => spawnSync("node", [guard], { input: JSON.stringify({ tool_name, tool_input }), encoding: "utf8" })
const edit = onMain ? 2 : 0
const at = p => path.join(root, p)
const git = (...words) => words.join(" ") // monta "git commit" sem escrever a expressão inteira (a própria trava leria este arquivo como comando)

const cases = [
  ["Edit componente", "Edit", { file_path: at("src/components/ui/button.tsx") }, edit],
  ["Write arquivo novo no projeto", "Write", { file_path: at("src/novo.tsx") }, edit],
  ["Edit caminho relativo", "Edit", { file_path: "src/components/ui/badge.tsx" }, edit],
  ["Edit fonte tokens/semantic.json", "Edit", { file_path: at("tokens/semantic.json") }, edit],
  ["Edit gerado tokens.css", "Edit", { file_path: at("src/styles/tokens.css") }, 2],
  ["Edit gerado tailwind.css", "Edit", { file_path: at("src/styles/tailwind.css") }, 2],
  ["Edit gerado tokens-merge.ts", "Edit", { file_path: at("src/lib/tokens-merge.ts") }, 2],
  ["Edit gerado manifest.json", "Edit", { file_path: at(".claude/skills/aurora-componente/manifest.json") }, 2],
  // falam de "ARQUIVO GERADO" mas não são gerados (falso positivo já visto)
  ["Edit guard.mjs", "Edit", { file_path: at(".claude/hooks/guard.mjs") }, edit],
  ["Edit build.mjs", "Edit", { file_path: at("scripts/tokens/build.mjs") }, edit],
  ["Edit check.mjs", "Edit", { file_path: at("scripts/tokens/check.mjs") }, edit],
  ["Edit manifest.mjs", "Edit", { file_path: at(".claude/skills/aurora-componente/scripts/manifest.mjs") }, edit],
  ["Edit CLAUDE.md", "Edit", { file_path: at("CLAUDE.md") }, edit],
  ["Edit fora do projeto", "Write", { file_path: path.join(root, "..", "fora-do-aurora", "a.md") }, 0],
  ["Read não é vigiado", "Read", { file_path: at("src/styles/tokens.css") }, 0],
  ["add -A", "Bash", { command: git("git", "add", "-A") }, 2],
  ["add --all", "Bash", { command: git("git", "add", "--all") + " && git status" }, 2],
  ["add .", "Bash", { command: "cd x && " + git("git", "add", ".") }, 2],
  ["add por nome", "Bash", { command: git("git", "add", "src/a.tsx", ".claude/") }, 0],
  ["commit -am", "Bash", { command: git("git", "commit", "-am", '"x"') }, 2],
  ["push --force", "Bash", { command: git("git", "push", "--force", "origin", "feat/x") }, 2],
  ["push -f", "Bash", { command: git("git", "push", "-f") }, 2],
  ["push normal", "Bash", { command: git("git", "push", "-u", "origin", "feat/x") }, 0],
  ["PowerShell add -A", "PowerShell", { command: git("git", "add", "-A") + "; git status" }, 2],
  ["comando comum", "Bash", { command: "pnpm lint" }, 0],
  ["git status", "Bash", { command: "git status --short" }, 0],
  ...(onMain ? [["commit na main", "Bash", { command: git("git", "commit", "-m", '"x"') }, 2]] : []),
]

let fail = 0
for (const [name, tool, input, expected] of cases) {
  const r = run(tool, input)
  const ok = r.status === expected
  if (!ok) fail++
  console.log(`${ok ? "ok   " : "FALHA"} ${name.padEnd(30)} esperado ${expected}, veio ${r.status}${ok ? "" : "  " + r.stderr.trim().split("\n")[0]}`)
}
console.log(`\n${onMain ? "na main" : "fora da main"}: ${fail ? `${fail} caso(s) falharam` : `${cases.length} casos passaram`}`)
process.exit(fail ? 1 : 0)
