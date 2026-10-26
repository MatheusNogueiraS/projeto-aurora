---
name: aurora-componente
description: Caminho completo para criar, instalar (shadcn) ou alterar um componente do Aurora (design system do Bmg) — diagnóstico, partes primeiro (reaproveitar Button/IconButton/Progress…), tokens só semânticos, checklist de estados, inventário automático (manifest.json), cobertura no Storybook, revisão de tech lead e aprovação antes da PR. Use sempre que pedirem um componente novo, instalar um componente, ou mudar variante, tamanho, estado, visual ou comportamento de um componente existente em src/components/ui.
---

# Componente — Aurora

Contrato desta skill:

| | |
|---|---|
| **Faz** | Leva um componente do pedido até "pronto para aprovação": partes, tokens, código, inventário, Storybook e revisão. |
| **Não faz** | Não abre PR sem aprovação do responsável (skill `aurora-git-fluxo`, regra 3a). Não muda token ou componente sem relação com o pedido (regra 20). Não cria token de componente (regra 12a). |
| **Ferramentas** | `manifest.mjs` (inventário e lacunas), `pnpm tokens`, `pnpm lint`, Storybook local, Figma MCP para as referências. |
| **Entrega** | Relato curto no formato do fim desta página. |

Regras citadas pelo número estão no `CLAUDE.md`.

## 0. Branch

Antes de editar qualquer arquivo: skill `aurora-git-fluxo` (main atualizada e validada → branch nova).

## 1. Diagnóstico

Responda antes de escrever código:

- **O que é pedido:** componente novo, instalação do shadcn ou alteração? Qual problema do produto ele resolve?
- **Qual é a unidade** (regra 18d): o que no Figma é um componente (ex.: Accordion = um item).
- **Referência:** procure o componente nas referências de [referencias.md](referencias.md) (Nitro para a estrutura e o painel de propriedades; Genesis para o visual do Bmg). Elas entram filtradas (regra 18a).
- **Instalar do shadcn** só quando pedirem (regra 6): `pnpm exec shadcn add <nome>`. Depois, o arquivo instalado é adaptado às regras: classes do shadcn viram tokens do Aurora; a trava de tokens aponta o que não serve.

Se a resposta depender de uma decisão do responsável (visual, marca, comportamento novo), pergunte antes de construir.

## 2. Partes primeiro (regra 18f)

Rode o inventário para ver o que já existe:

```bash
node .claude/skills/aurora-componente/scripts/manifest.mjs
```

Ele atualiza o [manifest.json](manifest.json) e mostra as lacunas. Para cada componente, o manifest diz o que ele **exporta**, suas **variantes** (cva), quais componentes do Aurora ele **usa** e quais o usam (**usadoPor**), e onde está **documentado** no Storybook.

Monte a tabela de partes antes de codar:

| Parte | Vem de |
|---|---|
| ex.: botão de fechar | `IconButton` (existe) |
| ex.: barra | `Progress` (existe) |
| ex.: selo de contagem | peça nova (crie primeiro, como componente próprio) |

**Alterando um componente existente:** olhe o `usadoPor` dele. Cada um da lista pode mudar junto (regra 21); confira cada um no Storybook antes de concluir.

## 3. Tokens

- Só semânticos (regra 12). Classes como `px-lg py-sm gap-xs rounded-sm typo-body-md-regular bg-link-1`; `cn` de `@/lib/utils`.
- Valor que não existe: primeiro uma escala geral (padding, gap, radius; regra 12a), arredondando para o passo mais próximo; depois uma conta entre tokens; só então um token novo no `tokens/semantic.json`, seguido de `pnpm tokens` (regras 11 e 15).
- Tamanho não é token: altura = padding + conteúdo; medidas fixas e mín./máx. em px no componente (`size-[16px]`).

## 4. Construção

Siga o jeito dos componentes existentes (abra um parecido, ex.: `button.tsx`):

- Variantes com `cva`; `data-slot="<nome>"` na raiz; ícones do `lucide-react`; comentários curtos em português explicando o porquê.
- Padrões já validados (hover, erro, label/description, tamanhos de campo…): tabela "Padrões já validados" da skill `aurora-storybook-review`.
- **Checklist de estados** (regra 18b): padrão, hover, foco, ativo, desabilitado, loading e erro quando fizer sentido; estados que se excluem viram regra do componente.

## 5. Travas

```bash
node .claude/skills/aurora-componente/scripts/manifest.mjs   # inventário + lacunas
pnpm lint                                                     # ESLint + trava de tokens
pnpm exec tsc -b --noEmit
```

O inventário falha se o componente ficar **órfão** (sem história e sem uso por outro componente) ou se uma **variante** não aparecer na história. O hook de commit roda as três checagens de novo.

## 6. Storybook

1. História no padrão da skill `aurora-storybook-review` (Padrão / Variantes / Tamanhos / Desabilitado, controles como no Figma).
2. **Cobertura** com a skill `aurora-storybook-cobertura` (regra 18e): inventário → controles → teste controle a controle no navegador, claro e escuro.
3. Arquivo novo: reinicie o Storybook local se o CSS não aparecer.

## 7. Revisão de tech lead (regra 8)

Releia o diff como quem revisa o código de outra pessoa. Procure, por prioridade:

1. **Recriação** de algo que já existe (`<button>` cru, barra, spinner…) em vez do componente do Aurora.
2. **Vazamento:** a mudança altera algum componente do `usadoPor` sem querer.
3. **Valores fora do sistema:** número solto, token de fundação, passo fora da escala (a trava pega a maioria; leia o resto).
4. **Estados:** combinação proibida que o componente permite; estado só por cor; foco invisível.
5. **Acessibilidade:** `aria-*`, contraste, alvo de toque, leitura por teclado.
6. **Duplicidade e acoplamento:** lógica copiada de outro componente, prop que ninguém usa.

Corrija o que for do escopo; o resto vira achado no relato.

## 8. Aprovação e entrega

Mostre no Storybook local e espere o ok do responsável. Só então: commit e PR (`aurora-git-fluxo`, regra 3a) e Storybook online (`aurora-storybook-publicar`).

## Formato do relato

```markdown
**<Componente>**: <uma frase do que foi feito>
Onde: <token | componente | só documentação>

| Parte | Vem de |
|---|---|

Cobertura: <tabela da skill aurora-storybook-cobertura>
Revisão: <achados corrigidos> / <achados para decidir>
Decisões que tomei: <lista>
Não verifiquei: <lista ou "nada">
```
