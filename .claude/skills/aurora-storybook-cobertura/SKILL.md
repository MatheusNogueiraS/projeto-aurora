---
name: aurora-storybook-cobertura
description: Confere se um componente do Aurora (design system do Bmg) está COMPLETAMENTE representado e funcionando no Storybook — toda parte, variante, tamanho, estado e propriedade instalada/criada vira controle ou história, e cada controle é testado de verdade no navegador. Use SEMPRE depois de instalar um componente (shadcn ou outro), criar um componente novo, ou atualizar/incrementar um existente, antes de dizer que terminou — mesmo que ninguém peça.
---

# Cobertura no Storybook — Aurora

O responsável valida o design system pelo Storybook. Se uma parte do componente existe no código mas não aparece (ou não funciona) nos controles, para ele ela não existe. Por isso **todo componente instalado, criado ou alterado passa por este processo antes de ser dado como pronto** (regra 18e do `CLAUDE.md`). Complementa a skill `aurora-storybook-review` (padrão de escrita da documentação).

## 1. Inventário do componente

Comece pelo inventário automático: `node .claude/skills/aurora-componente/scripts/manifest.mjs` (exportações, variantes do cva, onde está documentado). Depois leia o arquivo do componente e complete a lista com o que o script não enxerga:

- **Partes exportadas** (ex.: Avatar, AvatarImage, AvatarFallback, AvatarBadge, AvatarGroup, AvatarGroupCount).
- **Variantes** (`variant`, `media`, `orientation`…) e **tamanhos** (`size`), inclusive as que não usam cva.
- **Estados** (desabilitado, erro, carregando, aberto, selecionado, vazio…).
- **Conteúdos opcionais** (ícone, descrição, selo, ação, contador…).
- **Comportamentos** (clicar, arrastar, abrir, remover, validar).

## 2. Mapa de cobertura

Cada item do inventário precisa estar em pelo menos um lugar:

| Onde | Para quê |
|---|---|
| **Controle** (painel) | Tudo o que o designer escolheria no painel do Figma: conteúdo, variante, tamanho, partes opcionais (liga/desliga + conteúdo), quantidade, estados (categoria "State"). |
| **História** | Default / Variants / Sizes / Disabled (só as que fizerem sentido). As histórias **repassam os args**, então os controles continuam valendo nelas. |

Regras do padrão (detalhes na `aurora-storybook-review`):
- Nomes em inglês (glossário da `aurora-storybook-review`); controles sem descrição.
- Controles que dependem de outro se escondem (`if:`). Por isso o componente da história tem **valores padrão** para os args escondidos.
- Um estado de exemplo usa **`key`** para recriar o componente, sem `useEffect`.
- Nada de controle "só de código" (`asChild`, `className`…).
- Partes que só existem em conjunto (ex.: grupo, contador) entram como controle de exibição ("Single / Group") com os seus próprios controles.
- **Imagens de exemplo são locais** (SVG desenhado no código), nunca buscadas em serviço externo.

Se algum item não couber em controle nem em história, diga por quê.

## 3. Teste de verdade, controle por controle

1. **Componente ou arquivo novo:** o Storybook que já está rodando pode não gerar o CSS das classes novas, e o componente aparece quebrado. Confira com `getComputedStyle` (tamanho, cor, borda) e, se faltar estilo, **reinicie o Storybook** (servidor da porta 6006) antes de testar. Só "encostar" no `src/index.css` resolve parcialmente.
2. **Sequência de controles:** no iframe da história Padrão, mude um arg por vez com `window.__STORYBOOK_ADDONS_CHANNEL__.emit("updateStoryArgs", { storyId, updatedArgs })` e leia o resultado no DOM (quantidade de partes, texto, tamanho, presença do selo/ícone…). **Todo controle tem que mudar algo visível**, e nada pode "sobrar" na tela entre uma troca e outra. Inclua as combinações que interagem (ex.: selo com ícone no `sm`, contador zero, grupo com iniciais).
3. **Comportamento:** teste o que o usuário faria (clicar, arrastar, remover, digitar) e o hover/foco reais (regra 18b).
4. **Visual:** capture Variantes e Tamanhos nos temas **claro e escuro**. Procure texto cortado, sobreposição, contraste e halos.
5. Corrija o que aparecer **no componente** (nunca só na história, regra 19) e repita o teste.
6. Rode `pnpm lint`, `pnpm exec tsc -b --noEmit`, `pnpm build` e `pnpm build-storybook`.

### Armadilhas conhecidas

- **Captura de tela:** Chrome headless em `iframe.html?id=<story-id>&viewMode=story&args=...`. No Windows ele impõe largura mínima de ~500px; para ver o celular de verdade, use uma página auxiliar com um iframe de 390px servida junto do `storybook-static` (mesma origem).
- **`max-w-none`/`max-h-none`** viram 0 por causa do token `spacing.none` (a trava barra).

## 4. Relato

Inclua uma tabela curta de cobertura (parte → controle/história → testado ✓) e o que foi corrigido no caminho. Diga claramente o que ficou sem testar e se é preciso reiniciar o Storybook local para ver.
