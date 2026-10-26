# Harness do Aurora

O harness é o conjunto de peças que faz o Claude Code trabalhar neste repositório do jeito do Aurora, para qualquer pessoa que clonar o projeto: as **regras** que valem sempre, os **procedimentos** de cada tarefa, os **scripts** que eles chamam e as **travas** que barram erros antes de acontecerem.

```
CLAUDE.md                                ← regras (lido em toda conversa)
.claude/
├── README.md                            ← este mapa + decisões registradas
├── settings.json                        ← hooks (travas) e permissões
├── hooks/
│   ├── guard.mjs                        ← trava: main, arquivos gerados, git add -A, push --force, commit
│   └── guard.test.mjs                   ← testes da trava
└── skills/
    ├── aurora-git-fluxo/SKILL.md        ← branch → PR → merge → limpeza
    ├── aurora-componente/
    │   ├── SKILL.md                     ← criar, instalar ou alterar componente (caminho completo)
    │   ├── referencias.md               ← Nitro, Genesis, Figma Make: para quê e como acessar
    │   ├── manifest.json                ← inventário dos componentes (gerado)
    │   └── scripts/manifest.mjs         ← gera e confere o manifest + lacunas de documentação
    ├── aurora-storybook-cobertura/SKILL.md  ← tudo do componente no Storybook e testado
    ├── aurora-storybook-review/SKILL.md     ← padrão da documentação + achados
    └── aurora-storybook-publicar/
        ├── SKILL.md                     ← republicar o Storybook online a cada PR
        └── scripts/preparar.mjs         ← prepara o build para o link de sempre
```

Fora do `.claude/`, o harness usa a infraestrutura do projeto: `scripts/tokens/build.mjs` (`pnpm tokens`) e `scripts/tokens/check.mjs` (dentro do `pnpm lint`).

## Como as peças se conectam

| Camada | Quando age | Exemplo |
|---|---|---|
| **Regras** (`CLAUDE.md`) | Sempre, desde o início da conversa | "Componente nunca usa valor solto" (regra 12) |
| **Skills** | Quando a tarefa pede (o Claude escolhe pela descrição, ou alguém chama `/nome`) | Pedido de componente novo → `aurora-componente` |
| **Scripts** | Quando uma skill ou trava manda rodar | `manifest.mjs` acusa variante sem história |
| **Travas** (hooks) | Antes de cada edição ou comando, sem depender de ninguém lembrar | Commit na `main` é barrado |

Uma regra que precisa valer sempre vira trava quando dá para checar por código; as que pedem julgamento (ex.: "ajustar não é recriar") ficam no texto.

## Skills

| Skill | Gatilho | Faz | Não faz | Chama |
|---|---|---|---|---|
| `aurora-git-fluxo` | Antes de qualquer trabalho; commit, push, PR; depois do merge | Branch da main validada, PR pequena em linguagem simples, limpeza depois do merge | Commit/push/PR/merge sem pedido | `aurora-storybook-publicar` (link da PR) |
| `aurora-componente` | Criar, instalar ou alterar componente | Diagnóstico → partes → tokens → estados → travas → Storybook → revisão de tech lead → aprovação | PR antes da aprovação; token de componente | `manifest.mjs`, `aurora-storybook-cobertura`, `aurora-storybook-review` |
| `aurora-storybook-cobertura` | Depois de instalar, criar ou alterar componente | Inventário → mapa de cobertura → teste controle a controle no navegador | Corrigir só na história | `manifest.mjs` |
| `aurora-storybook-review` | Revisar/padronizar a documentação | Ajusta só o arquivo de histórias; levanta achados | Mudar componente ou token | — |
| `aurora-storybook-publicar` | Abrir ou atualizar PR | Build → preparar → republicar no link de sempre | Criar link novo ou publicar em outro serviço | `preparar.mjs` |

## Scripts

| Script | Comando | O que faz | Falha quando |
|---|---|---|---|
| `manifest.mjs` | `node .claude/skills/aurora-componente/scripts/manifest.mjs` (`--check` só confere) | Inventário: exportações, variantes (cva), quem usa quem (`usa`/`usadoPor`) e onde cada componente está documentado | Manifest desatualizado; componente órfão (sem história e sem uso); variante que não aparece no Storybook; nome do Storybook em português ou controle com descrição (regra 18c) |
| `preparar.mjs` | `node .claude/skills/aurora-storybook-publicar/scripts/preparar.mjs <storybook-static> <saída> [publicados.json]` | Converte o build no formato do Artifact e calcula o que remover do link | Build ausente |
| `guard.mjs` | (hook, automático) | Ver "Travas" | — |
| `guard.test.mjs` | `node .claude/hooks/guard.test.mjs` | 26–27 casos da trava (rode na branch e na main) | Algum caso da trava mudou de comportamento |

## Travas (`.claude/settings.json` → `guard.mjs`)

| Barra | Regra | Mensagem leva a |
|---|---|---|
| Editar arquivo do projeto na `main` | 1 | Criar branch |
| Editar arquivo gerado (tokens.css, tailwind.css, tokens-merge.ts, manifest.json) | 11 | Editar a fonte e gerar de novo |
| `git add -A`, `git add .`, `git commit -a` | git-fluxo 4 | Adicionar arquivos pelo nome |
| `git push --force` | git-fluxo 9 | Reverter por PR |
| `git commit` na `main` | 1 | Mover para branch |
| `git commit` com `pnpm lint`, tipos ou inventário falhando (~7 s) | 4 | O erro, com arquivo e linha |

## Como manter

**Criar ou mudar uma skill** (o fluxo que gerou este harness):

1. **Diagnóstico:** que problema do fluxo ela resolve? Qual o gatilho? O que nunca deve fazer? Qual o formato da entrega?
2. **Discovery:** leia o que já existe (skills, scripts, `CLAUDE.md`) antes de criar; não duplique.
3. **Camadas:** primeiro o `SKILL.md` (o contrato), depois o script que ele chama. A `description` do topo é o gatilho: diga quando usar.
4. **Teste com caso real:** crie um caso que deveria falhar e confirme que falha; depois o caso limpo e confirme que passa.
5. **Registre a decisão** na seção abaixo.

**Mudou a trava?** Rode `node .claude/hooks/guard.test.mjs` numa branch e na `main`. Teste o commit à parte: crie um componente com uma classe solta (`p-4`) e sem história, rode `node .claude/hooks/guard.mjs` com `{"tool_name":"Bash","tool_input":{"command":"git commit -m x"}}` na entrada e confira o bloqueio; apague o componente.

**Mudou o `settings.json`?** O Claude Code costuma recarregar sozinho; se a trava não reagir, abra `/hooks` para revisar ou reinicie a conversa.

## Decisões de design registradas

| # | Decisão | Por quê | Alternativa descartada |
|---|---|---|---|
| 1 | As regras-base moram no `CLAUDE.md`, não numa skill | Regra que vale sempre não pode depender de gatilho; o `CLAUDE.md` é lido em toda conversa. Skills ficam só com procedimentos. | Skill `aurora-ds` (carregava só quando o Claude achava que o assunto pedia) |
| 2 | Regras falam em "o responsável" e "quem está operando", não no nome de uma pessoa | O repositório é de qualquer pessoa que o clonar. Preferências pessoais (ditado por voz, explicação didática de Git) ficam na memória local de cada um. | Manter tudo citando o Matheus |
| 3 | Hooks dentro do `settings.json` | É onde o Claude Code lê hooks de projeto. `hooks.json` separado é o formato de plugins. | `hooks.json` como na referência |
| 4 | Scripts de tokens continuam em `scripts/tokens/`; scripts do harness ficam dentro da skill | Os de tokens são infraestrutura do projeto (rodam no `pnpm build`/`lint`, também para devs sem Claude). Os do harness só existem para as skills. | Mover tudo para `.claude/` |
| 5 | `manifest.json` versionado, conferido pela trava de commit (não pelo `pnpm lint`) | Quem revisa a PR vê no diff o que mudou no inventário (variante nova, quem passou a usar o quê). Conferir na trava mantém o harness independente da esteira dos devs. | Gerar só na hora (sem histórico) ou travar no `pnpm lint` (mexe no fluxo de todos) |
| 6 | O inventário deduz peça interna e órfão pelo uso real (imports), sem lista de exceções | Lista à mão fica desatualizada; o import não mente. Ex.: `input` é documentado pelo `InputField`, `input-group` é peça de outros. | Lista fixa de "componentes sem história" |
| 7 | A checagem de variante procura o valor entre aspas nos arquivos do Storybook que importam o componente | Barato e pega o caso real: variante nova esquecida nos controles. | Executar o Storybook (lento, precisa de navegador) |
| 8 | Trava de commit roda só a parte rápida (lint, tipos, inventário: ~7 s); `build` e `build-storybook` ficam na skill | Commit não pode virar espera de minutos; o que é lento é exigido no procedimento. | Rodar tudo a cada commit |
| 9 | Arquivo gerado é reconhecido pelo carimbo na abertura ("ARQUIVO GERADO" / `"$comment": "GERADO`) | Gerador novo que carimbe o arquivo já fica protegido, sem atualizar lista. A primeira versão procurava o carimbo em qualquer ponto do começo e barrou o próprio `guard.mjs`, que cita o carimbo num comentário; virou caso de teste. | Lista fixa de arquivos gerados |
| 10 | Erro interno da trava libera a ação (falha aberta) | Uma trava quebrada não pode impedir o trabalho; o erro aparece no aviso. | Falha fechada |
| 11 | A trava lê o comando como texto | Simples e sem dependência. Limite conhecido: um comando que só *cita* "git commit" (ex.: corpo de PR) também dispara a checagem de commit. Ela só barra se a checagem falhar. | Interpretar o shell |
| 12 | Travas valem para o Claude; quem commita direto no terminal não passa por elas | Hooks do Claude Code só existem dentro do Claude Code. O caminho para cobrir todo mundo é CI no GitHub (próximos passos). | Git hooks com husky (dependência nova) |
| 13 | Permissões pré-aprovadas só para validar e ler (`pnpm lint`, `build`, `git status/diff/log`, `gh pr view/list`) | Menos pedidos de permissão sem liberar nada que mude o Git ou publique. | Liberar `git`/`gh` inteiros |
| 14 | O link publicado guarda a lista do que publicou (`publicados.json`) | A próxima publicação baixa a lista do próprio link e remove só o que ficou velho. Na primeira versão do script, a página aparecia como `index.html` na listagem e seria marcada para remoção; virou regra do script e caso de teste. | Comparar a listagem à mão a cada PR |
| 15 | O agente `repo-sync` continua na pasta pessoal (`~/.claude/agents`) | É genérico (serve a vários repositórios) e depende de um script de outro repositório. | Trazer para o Aurora |
| 16 | As cópias antigas das skills em `~/.claude/skills` são apagadas depois do merge | Skill pessoal com o mesmo nome vence a do projeto; as melhorias do repositório seriam ignoradas na máquina de quem tem a cópia. | Manter as duas |

## Próximos passos sugeridos

| Prioridade | O quê | Por quê |
|---|---|---|
| 1 | **CI no GitHub** (Actions) rodando `pnpm lint`, `tsc`, `pnpm build` e `manifest.mjs --check` em toda PR | Único jeito de a trava valer também para quem não usa o Claude (decisão 12). |
| 2 | **Scripts de teste do Storybook** dentro da `aurora-storybook-cobertura` (captura claro/escuro, troca de controles via `updateStoryArgs`, hover/foco) | Hoje são recriados a cada conversa em pastas temporárias. Fixá-los torna o passo 3 da cobertura reproduzível. |
| 3 | **Skill `aurora-tokens`** (criar ou mudar token: escala → JSON → `pnpm tokens` → página de Fundamentos → contraste) | O caminho existe nas regras 11–17 e no `tokens/README.md`, mas não como procedimento. |
| 4 | **Subagente revisor** (`.claude/agents/`) para a revisão de tech lead da regra 8 | Revisar com contexto limpo pega o que quem construiu não vê; começo da "squad" de agentes. |
