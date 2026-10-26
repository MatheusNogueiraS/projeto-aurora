---
name: aurora-storybook-publicar
description: Atualiza o Storybook online do Aurora (design system do Bmg) no mesmo link a cada PR — gera o build da branch, prepara os arquivos com o script da skill e republica o Artifact, pondo o link na primeira linha da descrição da PR. Use ao abrir ou atualizar uma PR, ou quando pedirem para publicar/atualizar o Storybook online.
---

# Publicar o Storybook — Aurora

Contrato:

| | |
|---|---|
| **Faz** | Republica o Storybook da branch da PR no link de sempre e devolve o link para a PR. |
| **Não faz** | Não cria link novo nem publica em outro serviço sem ok do responsável (regra 7). Não publica arquivos de outro trabalho que estejam soltos na pasta (só o que está na branch). |
| **Ferramentas** | `pnpm build-storybook`, `scripts/preparar.mjs`, ferramenta Artifact (`read`, `list`, `publish`). |
| **Entrega** | O link, na primeira linha da descrição da PR e na resposta. |

**Link de sempre:** https://claude.ai/artifact/XGcafrb6sDsz9Xe2eJKv7D (Artifact privado da conta do responsável). Só quem tem acesso de edição consegue republicar; sem acesso, pule esta skill e avise. Não crie outro link.

## Passo a passo

1. **Build da branch:** com a pasta limpa (`git status` sem arquivos de outro trabalho; se houver, `git stash push -u -- <arquivos>`), rode `pnpm build-storybook`.
2. **Ler o link e baixar a lista do que está publicado:** `Artifact` com `action: "read"`, o `url` e `path: "publicados.json"`. A ferramenta salva o arquivo localmente e diz onde; essa leitura também libera a publicação no passo 4. Se o `publicados.json` não existir no link (publicações antigas), use `action: "list"`, `scope: "files"` e grave os caminhos listados como uma lista JSON.
3. **Preparar:**
   ```bash
   node .claude/skills/aurora-storybook-publicar/scripts/preparar.mjs storybook-static <scratchpad>/storybook-publicar <publicados.json do passo 2>
   ```
   O script copia o build, transforma o `index.html` em `storybook-aurora.html` (o Artifact monta o esqueleto da página), troca o caractere U+FFFD (que o Artifact recusa), grava o `publicados.json` novo e o `files.json` com o mapa de arquivos, inclusive os antigos a remover (`null`). A página nunca entra como remoção. Confira na saída: `fffdRestantes` = 0, `arquivos` ≤ 255 e `removidos` só com arquivos de `assets/` de builds anteriores.
4. **Ler antes de publicar:** se o passo 2 usou só a listagem, faça `Artifact` `action: "read"` com o `url` (a publicação é recusada para um link não lido nesta conversa).
5. **Publicar:** `Artifact` com `file_path` = `<scratchpad>/storybook-publicar/storybook-aurora.html`, `url` = o link, `root` = `<scratchpad>/storybook-publicar` e `files` = o conteúdo de `files.json`.
6. **Conferir:** abra o link e veja que a página do componente da PR aparece.
7. **Entregar:** link na primeira linha da descrição da PR (`**Storybook desta PR:** <link>`) e na resposta.

Se duas PRs estiverem abertas ao mesmo tempo, o link mostra só uma. Diga qual está publicada, ou publique um build com as duas branches juntas se pedirem.

## Futuro: Netlify (adiado)

Escolhido em 22/10/2026 para substituir este processo (deploy automático pelo GitHub e prévia por PR), mas **adiado até terminar a revisão dos componentes**. Não ofereça de novo antes disso. Receita testada: `netlify.toml` com `command = "pnpm build-storybook"`, `publish = "storybook-static"`, `NODE_VERSION = "24"`, `STORYBOOK_DISABLE_TELEMETRY = "1"`. Fixar `"packageManager": "pnpm@12.11.2"` faz o pnpm reescrever o `pnpm-lock.yaml` (esperado; entra no mesmo commit). Pendências: no plano grátis o site é público, sem senha (o Cloudflare Pages restringe por e-mail de graça), e falta decidir se a prévia do Netlify substitui esta skill.
