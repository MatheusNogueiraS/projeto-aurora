---
name: aurora-storybook-review
description: Revisão da documentação de um componente do Aurora (design system do Bmg) no Storybook — nomes em inglês pelo glossário, explicações mínimas em pt-BR, controles com nomes do painel do Figma, estados como controles, histórias Default/Variants/Sizes/Disabled — e levantamento dos achados que exigem mudar o componente. Use quando pedirem para revisar, padronizar ou "passar o review" na documentação/Storybook de um ou mais componentes, ou para olhar como um componente está configurado no Storybook.
---

# Review de componente no Storybook — Aurora

Processo validado revisando Button, IconButton, Alert, Accordion, Calendar, Checkbox, Badge e Breadcrumb. Complementa as regras do `CLAUDE.md`; em conflito, valem elas.

## Escopo: só a documentação

- **No review, mude apenas o arquivo de histórias** (`src/stories/componentes/<nome>.stories.tsx`). **Nunca altere o componente** (`src/components/ui/*`) ou tokens.
- Tudo o que pedir mudança de comportamento, forma ou visual vira **achado**, para o responsável decidir e fazer junto, um componente por vez.
- Se a documentação só puder mostrar algo mudando o componente, **não mostre**: registre o achado.

## Padrões já validados (podem ir para o componente quando autorizado)

Decididos com o responsável em 20/10/2026. Fora deles, continua sendo achado. A skill `aurora-componente` usa esta tabela ao construir.

| Achado | Padrão |
|---|---|
| Sem hover | Campos e controles desmarcados: borda `link-4` (`not-aria-invalid:enabled:hover:border-link-4`). Marcados/ligados: `link-3` (fundo e borda). Trilho desligado do Switch: `details-1`. Hover também ao passar sobre o texto do componente (`group-hover/<nome>-field`). |
| Hover igual a outro estado | Ligado/pressionado em `link-5` com conteúdo `link-4` (como o Button secondary); hover fica em `background-4`. |
| Erro + desabilitado | Erro só com `enabled`. Em escolhas, erro só sem valor: Checkbox/Switch desmarcado (`data-unchecked`), Select com `data-placeholder`, Radio enquanto o grupo não tem item marcado (`not-group-has-[[data-state=checked]]/radio-group`), chips do Combobox sem chip. Hover não sobrescreve o erro (`not-aria-invalid:`). |
| Sem texto próprio | `label` e `description` opcionais no componente (como Checkbox, Switch e RadioGroupItem): `<label data-slot="<nome>-field">`, controle com `mt-xxs`, texto `body-md` / descrição `body-sm text-3`, desabilitado esmaece só o texto, descrição vira `alerts-7` no erro. |
| Tamanhos de campo | sm / default / lg com as alturas do Button (31 / 39 / 42): `py-xs body-md`, `py-sm body-lg md:body-md`, `py-sm body-lg`. |
| Grupo com campo dentro | O grupo esmaece sozinho quando o campo está desabilitado (`has-[...:disabled]`) e as partes internas não esmaecem de novo (`disabled:opacity-visible`). |
| Skeleton/fundos fracos | Um passo de cinza mais escuro (`background-3`) e formatos como variante. |

Ao mudar um componente, meça hover/erro no navegador antes de concluir.

## 1. Entenda o componente antes de documentar

1. Leia o componente: props reais, variantes (cva), tamanhos, estados que ele já suporta (disabled, aria-invalid, data-state…), partes (Item, Trigger, Content…). O `manifest.json` da skill `aurora-componente` dá o resumo.
2. Consulte as referências em `.claude/skills/aurora-componente/referencias.md`, filtradas (regra 18a). No Nitro, as `componentPropertyDefinitions` do component set mostram o "painel" de controles.
3. **O componente documentado é a unidade do Figma** (ex.: Accordion = um item; lista = soma de itens).

## Idioma e glossário (regra 18c)

**Nomes em inglês, explicações em pt-BR.** Nomes (menu, histórias, categorias, controles, opções) seguem a tabela abaixo. A descrição do componente, as legendas, os textos de exemplo e os `aria-label` são em pt-BR. Controles não têm descrição.

Use sempre estes termos, para todo componente falar igual:

| Onde | Termo |
|---|---|
| **Menu** | `Introduction`, `Foundations/<page>`, `Components/<Name>`. O nome do componente é o nome do código separado em palavras (`SelectionCard` → "Selection Card", `IconButton` → "Icon Button"). Partes: `Components/Table/Cell`, `…/Row`, `…/Table`; `Components/Accordion/Item`, `…/Group`. |
| **Histórias** | `Default`, `Variants`, `Sizes`, `Disabled` (o nome do export já é o nome: `export const Default`). |
| **Categorias** | `State`, `Parts`, `Icons`, `Action`. |
| **Controles** | Type, Size, Label, Text, Title, Description, Content, Value, Icon, Icon Leading, Icon Trailing, Position, Alignment, Orientation, Divider, Header, Footer, Caption, Action, Tag, Hint, Placeholder, Selection, Display, Count, Mode, Tone, Shape, Media, Emphasis, Steps. |
| **Estados** | Disabled, Error, Open, Selected, Loading, Required, Optional. "Ligado" segue o termo do componente: Checked (Switch), Pressed (Toggle). |
| **Controle dependente** | `<Parte> · <detalhe>`, detalhe em minúsculas: `Description · content`, `Tag · text`, `Tag · type`, `Icon Leading · icon`, `Error · message`, `Action · style`. |
| **Opções** | O valor do código, como está: `warning / default / secondary / success`, `sm / default / lg`, `top / bottom`, `line / box`, `unchecked / checked / indeterminate`, `header / body / footer`. Nunca tradução ("Atenção", "Baixo"). Sem valor no código (escolha que só existe na história): nome em inglês (`Single / Group`, `Text / Info Line`); "nada escolhido" é `None`. Componentes citados pelo nome (`Checkbox`, `Radio`, `Icon Button`). Exemplos de conteúdo nas opções (Pix, prazos) ficam em pt-BR. |
| **Descrições** | Componente: 1 frase em pt-BR. Controles: nenhuma (a tabela mostra só nome e tipo). |
| **Coluna Default** | O padrão do código (regra 18c), conferido no arquivo do componente. Na história: `table: { defaultValue: { summary: '"<valor>"' } }` (aspas como o Storybook mostra; número sem aspas). Booleanos saem `false` sozinhos; se o código começa ligado (ex.: `showTrigger = true`), escreva `"true"`. Não ligue a história ao componente (`component:`) só para isso: o Storybook traz junto props de código (`onRemove`…) e bagunça a ordem. |
| **Legendas nas histórias** (pt-BR) | Curtas: "Aceite de termos". |

Termo novo que não está aqui: escolha o do painel do Nitro (está em inglês) e acrescente a esta tabela.

## 2. Histórias

- Só as que se aplicam, nesta ordem: **Default**, **Variants**, **Sizes**, **Disabled**.
- Simples e visuais, um ao lado do outro. **Nada de histórias de composição/demonstração** (ex.: "Ao lado do Button").
- Estados viram **controles**, não histórias extras ("With error" vira o controle Error).
- Sem tabela de estados.

## 3. Controles (painel)

- **Nomes em inglês, como no painel do Figma/Nitro**, pelo glossário acima: Type, Size, Label, Text, Description, Content, Title, Icon Leading, Icon Trailing, Divider…
- Cada parte opcional = **liga/desliga + controle do conteúdo** que só aparece quando ligado (`if: { arg: "showX" }`), ex.: "Description" + "Description · content"; "Icon Leading" + "Icon Leading · icon" (lista curta de ícones do lucide-react).
- **Estados na categoria "State"** (`table: { category: "State" }`): Disabled, Error, Open, Loading… — só os que o componente realmente suporta.
- **Estados que se excluem se escondem** uns aos outros com `if` (ex.: Checkbox: Error esconde Selection e Disabled; Disabled esconde Error). Se o componente permite a combinação proibida, registre como achado.
- **Fora da tabela** (`table: { disable: true }` ou `parameters.controls.exclude`): `asChild`, `className`, `children` como objeto, `aria-*`, handlers e props de comportamento técnico (ex.: `collapsible`). Comportamento que dá para testar e entender (ex.: "Multiple open") pode virar controle com nome de produto.
- `aria-label` obrigatório: **gere na história** a partir do conteúdo (ex.: do ícone escolhido), não exponha.

## 4. Textos

- Em pt-BR, curtas e diretas. O que não for necessário, não entra.
- Componente: **1 frase**, para que serve.
- Controles: **sem descrição**. A tabela mostra só o nome e o tipo (boolean, string…). Se o componente tiver comentário `/** */` na prop, confira que ele não aparece na tabela.

## 5. Implementação na história (armadilhas conhecidas)

- Use um tipo próprio de args + função `Story<Nome>` que traduz os controles para as props reais; `satisfies Meta<Args>`.
- **Controle escondido não chega na história**: dê valor padrão no parâmetro da função (ex.: `iconLeadingName = "Plus"`).
- Prévia com estado (aberto, marcado, data selecionada): use `key` derivada do controle para recriar o componente quando ele muda, mantendo o clique funcionando. **Não** use `useEffect` para sincronizar (o lint barra).
- Componente com `aria-label` obrigatório no tipo: na meta use `component: X as React.ComponentType<Args>`.
- Strings de descrição com aspas: escape (`\"`); em Markdown, evite trechos de código longos.
- Toda variante do cva precisa aparecer na história (nas `options` do controle): o inventário (`manifest.mjs --check`) falha se faltar.

## 6. Verifique antes de concluir

1. `pnpm lint` (inclui `tokens:check`), `pnpm exec tsc -b --noEmit`, `pnpm build-storybook`.
2. Capture a tela das histórias (Chrome headless em `iframe.html?id=<story-id>&viewMode=story&args=...`).
3. **Teste a troca de controles em sequência** (`window.__STORYBOOK_ADDONS_CHANNEL__.emit("updateStoryArgs", …)`) e confira que nada "sobra" na tela entre uma troca e outra.
4. **Teste hover e foco de verdade** (mouse sobre o componente e sobre o texto; Tab). Se o hover não for visível, é achado.

## 7. Entrega

Por componente, em linguagem simples:
- **O que mudou na documentação** (controles, histórias, textos).
- **Achados para fazer junto**: o que exige mudar o componente (hover invisível, estado faltando, tamanho, ícone opcional, valores fora das escalas, combinações proibidas permitidas…), com a referência do Nitro/Genesis quando houver.
- O que não foi possível verificar.

Commit, PR e Storybook online só quando pedirem (regras 2 e 4a do `CLAUDE.md`).
