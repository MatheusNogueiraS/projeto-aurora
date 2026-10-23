# Tokens do Aurora

Esta pasta é a **fonte de verdade** de todos os valores visuais do design system:
cores, padding, gap, raios, tipografia, sombras, camadas e animação.
Nenhum valor visual é escrito direto em componente ou em CSS à mão. A única exceção são
as **medidas de tamanho** (largura, altura, mínimo e máximo), que não são token (veja abaixo).

```
tokens/
  foundation.json     átomos: valores literais (hex, px, pesos, durações...)
  semantic.json       semânticos: dão significado aos átomos; só apontam para outros tokens
  themes/dark.json    tema escuro: sobrescreve só os semânticos que mudam
scripts/tokens/
  build.mjs           gera os arquivos abaixo e valida as regras
  check.mjs           trava: barra uso errado nos componentes e contraste baixo
src/styles/tokens.css       GERADO: variáveis CSS puras (--aurora-*), independentes do Tailwind
src/styles/tailwind.css     GERADO: entrega só os semânticos ao Tailwind, como classes
src/lib/tokens-merge.ts     GERADO: ensina o cn() a fundir as classes dos tokens
```

## Comandos

| Comando | O que faz |
|---|---|
| `pnpm tokens` | Gera os arquivos a partir do JSON. Rode sempre que mudar um token. |
| `pnpm tokens:check` | Roda a trava (também roda dentro de `pnpm lint`). |
| `pnpm build` | Falha se os arquivos gerados estiverem desatualizados. |

## Os dois níveis

**Átomos servem semânticos; semânticos servem componentes.**

- **Fundação** (`foundation.json`): valores literais. É **imutável**: nunca mude o
  número de um token daqui para "ajustar" algo, porque o mesmo átomo alimenta coisas
  sem relação (ex.: `value.8` serve a raio, espaço, altura de linha e sombra).
  Para mudar, crie outro átomo e aponte o semântico para ele.
- **Semântico** (`semantic.json`): sempre aponta para outro token (`{grupo.nome}`),
  nunca para um valor. **Não há token específico de componente**: botão, card e campo
  usam as mesmas escalas gerais (`padding`, `gap`, `radius`). Se um token só serve a um
  componente, ele perde a função.
- **Componentes** usam **só semânticos**. Primitivos nunca viram classe.

## Como mudar algo no sistema inteiro

Edite **uma linha** no JSON e rode `pnpm tokens`:

| Quero mudar | Edite |
|---|---|
| A fonte dos textos | `font.text` |
| A fonte dos títulos | `font.heading` |
| O respiro (e a altura) dos controles | `padding.*` (ex.: `padding.sm`) |
| O espaço entre elementos | `gap.*` |
| O arredondamento de um passo da escala | `radius.*` (ex.: `radius.sm`) |
| A cor de foco em todos os componentes | `color.focus` |
| A cor de erro dos campos | `color.invalid` |
| A borda dos campos | `color.field` |
| O tamanho de um passo da escala de letra | `font-size.*` (ex.: `font-size.text.md`) |
| Um estilo de texto (ex.: corpo 14 bold) | `typography.*` (ex.: `typography.body-md-bold`) |
| A velocidade das animações | `motion.duration.*` |

## Usando nos componentes

O Tailwind roda **sem o tema padrão dele**: `p-4`, `text-sm`, `rounded-md`, `bg-white`
não existem. As classes disponíveis são as dos semânticos:

| Tipo | Exemplos de classe | Vem de |
|---|---|---|
| Cor | `bg-link-1`, `text-text-3`, `border-field`, `ring-focus` | `color.*` |
| Padding (dentro) | `p-sm`, `px-lg`, `py-xs`, `top-md`, `inset-x-none` | `padding.*` |
| Gap (entre) | `gap-xs`, `gap-x-md`, `mt-sm`, `-ml-xxs`, `space-y-sm`, `translate-y-xxs` | `gap.*` |
| Raio | `rounded-sm`, `rounded-pill`, `rounded-t-xs` | `radius.*` |
| Tamanho (não é token) | `size-[16px]`, `w-[32px]`, `min-h-[64px]`, `max-w-[320px]` | escrito no componente |
| Espessura | `border-default` | `stroke.default` |
| Opacidade | `opacity-md`, `bg-link-5/lg`, `ring-focus/md` | `opacity.*` |
| Sombra | `shadow-s`, `shadow-m` | `elevation.*` |
| Camada | `z-overlay`, `z-raised` | `layer.*` |
| Curva | `ease-standard` | `motion.easing.*` |
| Giro | `rotate-diagonal`, `rotate-flip` | `rotate.*` |
| Texto | `typo-heading-5`, `typo-body-md-regular`, `md:typo-body-md-bold` | `typography.*` |
| Breakpoint | `sm:`, `md:`, `lg:` | `breakpoint.*` |

Onde o Tailwind não tem classe nomeada, use a variável semântica direto:
`duration-(--aurora-motion-duration-fast)`, `ring-(length:--aurora-stroke-focus)`,
`underline-offset-(--aurora-underline-offset)`, `zoom-in-(--aurora-motion-scale-overlay)`.

Sempre importe `cn` de `@/lib/utils` (ele conhece os tokens; o `cn` do pacote não).

## Criando um token novo

1. Precisa mesmo? Só vira token o que é **decisão de design** ou **se repete**.
   Antes, tente: (1) reaproveitar uma escala semântica que já existe;
   (2) derivar com uma conta entre semânticos
   (ex.: deslocamento da bolinha do switch = `100% - 2 × stroke.default`).
   Nunca crie token com nome de componente nem token de tamanho.
2. Se o valor não existe, crie o átomo em `foundation.json`.
3. Crie o semântico em `semantic.json` apontando para ele, com `$description`.
4. `pnpm tokens` e `pnpm tokens:check`.

## Temas

- O tema padrão é o claro (Bmg). `themes/dark.json` sobrescreve só o que muda.
- **Cores de marca (`color.brand.*`) não mudam entre temas**: o build recusa.
- O tema é aplicado **no `<html>`** (classe `.dark`). Aplicar um tema só em um trecho
  da página não atualiza os semânticos que apontam para outros semânticos
  (ex.: `link.1 -> brand.1`); é uma limitação conhecida e aceita.
- Para criar um tema novo: um arquivo em `themes/`, só com semânticos.

## O que a trava confere

- Arquivos gerados atualizados com o JSON.
- Toda classe usada nos componentes gera CSS.
- Nenhum valor solto (`[13px]`, `opacity-50`, `rounded-full`, `z-50`, `/50`...), exceto
  medidas de tamanho em px (`w-`, `h-`, `size-`, `min-*`, `max-*`).
- Nenhum token de fundação nos componentes; nenhuma variável desconhecida.
- Contraste mínimo (WCAG) dos pares principais, em todos os temas.

## Decisões conscientes

- **Valores em px no JSON, rem no CSS** (1rem = 16px): o layout acompanha quem aumenta
  a fonte do navegador. Espaçamento entre letras fica em px.
- **Nomes padronizados em kebab-case**: `link-1`, `brand-details-1`, `img-skin-1`.
- **`color.field` aponta direto para `neutral.50`**: a borda dos campos precisa de
  3:1 de contraste (WCAG 1.4.11); `details.2` não atinge.
- **`stroke.none` não vira classe**: `border-none` já é uma classe do Tailwind
  (estilo de borda). Use `border-(length:--aurora-stroke-none)`.
- **Contraste do botão principal** (branco sobre laranja da marca, 3,07:1) atende
  só ao mínimo de texto grande; é limitado pela cor da marca.
- **Escalas como no Nitro Core**: padding e gap têm os mesmos passos (none, xxs 2, xs 4,
  sm 8, md 12, lg 16, xl 20, xxl 32), mas são independentes: mudar o padding não mexe no gap.
  `p-*` só aceita padding; `gap-*`, margens e `translate-*` só aceitam gap.
- **Altura dos controles = padding + conteúdo**: com a linha de texto do Nitro (150%), as
  alturas dão números inteiros (botão padrão: 21 + 2 × 8 + 2 de borda = 39px). O IconButton
  (botão só com ícone) usa a mesma altura do Button do seu tamanho (ex.: `size-[39px]`): se mudar o
  padding ou a tipografia do Button, atualize as medidas em `icon-button.tsx`.
- **Variáveis com prefixo `--aurora-`**: evitam colisão com o Tailwind e com outras
  aplicações na mesma página.
- **Tipografia como no Nitro**: `font` (heading, text) → `font-size` (heading xxs–4xl,
  text xs–xl) → estilos `display-1..3`, `heading-1..6`, `body-<tamanho>-<peso>`, `overline-*`.
  Linha: títulos 120% (heading-6 130%), body xl 140%, demais 150%; espaço entre letras 0,
  exceto overline (1px, caixa alta). Os textos só têm **regular e bold**: a Lato (fonte de
  texto) só existe em 400 e 700, então medium e semibold seriam pesos falsos.
