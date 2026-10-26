---
name: aurora-git-fluxo
description: Fluxo de Git do Aurora (design system do Bmg) — nunca trabalhar na main; toda mudança nasce numa branch curta criada da main atualizada e validada; entregas em PRs pequenas em linguagem simples; depois do merge, voltar para a main, atualizar, apagar a branch e só então abrir a próxima. Use SEMPRE antes de começar qualquer trabalho no projeto (ajuste, componente, token, documentação), ao terminar uma PR, quando perguntarem "em qual branch estamos", e antes de qualquer commit, push ou PR.
---

# Fluxo de Git — Aurora

O objetivo é controle de erros e rollback barato: se algo der errado, voltar atrás custa só a última entrega pequena, nunca dias de trabalho. O projeto segue o **GitHub Flow** (trunk-based): a `main` é sempre estável, e todo trabalho acontece em branches curtas que voltam para ela por PR. Sem `develop`, `release` ou ramos de integração.

**Travas automáticas** (hook `.claude/hooks/guard.mjs`): editar arquivo do projeto na `main`, commit na `main`, `git add -A`/`git add .`, `push --force` e commit com lint/tipos/inventário falhando são barrados. Se o hook barrar, resolva a causa; não contorne.

## Regras

1. **Nunca trabalhe na `main`.** Nem commit, nem edição de arquivo do projeto. Se estiver nela com mudanças, pare e mova as mudanças para uma branch (`git switch -c <branch>` leva as mudanças junto).
2. **Toda mudança começa assim**, nesta ordem:
   1. `git switch main` e `git pull`.
   2. Conferir que a `main` está 100%: `git rev-parse HEAD origin/main` iguais, `pnpm install --frozen-lockfile`, `pnpm lint`, `pnpm exec tsc -b --noEmit`, `pnpm build` e `pnpm build-storybook` passando. Arquivos soltos de outro trabalho ficam de lado durante a conferência (`git stash push -u -- <arquivos>` e depois `git stash pop`).
   3. `git switch -c <tipo>/<assunto>`. Tipos: `feat/` (novo), `fix/` (correção), `docs/` (só documentação), `chore/` (configuração). Nome curto em português sem acento (ex.: `feat/avatar`, `fix/storybook-mobile`).
3. **PR pequena.** Uma branch = um assunto (um componente, um ajuste de tokens, uma página de docs). Trabalho grande vira **várias PRs em sequência**, cada uma saindo da `main` atualizada depois do merge da anterior.
3a. **Componente finalizado = PR na hora.** Finalizado é quando **o responsável aprova o componente no Storybook**, não quando a construção termina: mostre no Storybook local, faça as revisões pedidas e só abra a PR depois do ok. Num trabalho em série, cada componente aprovado vira commit + PR imediatamente. Uma branch tem **uma PR aberta por vez**: antes de subir o próximo, confira se a anterior foi mergeada (`gh pr view N --json state`). Se foi: `git merge origin/main` na branch, suba e abra a nova PR. Se não foi: deixe o commit local, avise e, se quiserem seguir antes do merge, crie uma branch separada da `main` para o componente novo.
4. **Não misture assuntos.** Arquivos de outro trabalho não entram no commit (`git add <arquivos>` explícito) nem no Storybook publicado da PR.
5. **Antes de enviar commit para uma PR existente**, confira se ela já foi mergeada (`gh pr view N --json state`). Pode ser mergeada enquanto você ainda envia commits; se foi, a mudança vai para uma branch e PR novas.
6. **Depois do merge:** `git switch main`, `git pull`, conferir que está 100% (passo 2.2) e só então criar a próxima branch. Nunca continue numa branch já mergeada.
7. **Branch mergeada se apaga.** Com a PR em `MERGED` e a `main` atualizada: `git branch -d <branch>` e `git push origin --delete <branch>`. O rollback não depende da branch: o commit fica na `main` e a PR guarda tudo (botão Revert, `git revert -m 1`). **Nunca apague** branch com PR aberta ou sem merge.
8. **Commit, push, PR e merge só quando pedirem.** Ao terminar, ofereça.
9. **Rollback:** para desfazer uma entrega já na `main`, reverta a PR inteira (`git revert -m 1 <merge>` numa branch `fix/` e PR). Nunca reescreva a história da `main` (`reset`, `push --force`).

## Commit

- Mensagem em português, curta, dizendo o que muda para quem usa o DS (ex.: "Foco mais leve: linha laranja mesmo com o mouse em cima").
- Antes: o passo de validação da regra 4 do `CLAUDE.md`. O hook roda lint, tipos e inventário; `pnpm build` e `pnpm build-storybook` são com você.

## Descrição da PR

Qualquer pessoa precisa entender, inclusive quem não programa. Modelo:

```markdown
**Storybook desta PR:** <link do Storybook online>

## O que muda
<1–3 frases em linguagem de produto>

## O que muda visualmente
| Antes | Depois |
|---|---|
| ... | ... |

## Como revisar
<onde olhar no Storybook online (página/história) e a aba "Files changed"; nunca localhost>

## Decisões tomadas
<o que foi escolhido sem pedido explícito, para o responsável poder corrigir>
```

O link na primeira linha vem da skill `aurora-storybook-publicar`.

## Ao responder "em qual branch estamos?"

Diga a branch atual, se a PR dela já foi mergeada e o que há de arquivo solto na pasta. Se a branch já foi mergeada, proponha voltar para a `main` e abrir a próxima.
