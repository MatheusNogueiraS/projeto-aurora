# Tokens do Aurora

Esta pasta é a **fonte de verdade** de todos os valores visuais do design system:
cores, espaços, tamanhos, raios, tipografia, sombras, camadas e animação.
Nenhum valor visual é escrito direto em componente ou em CSS à mão.

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
  nunca para um valor. Inclui os tokens específicos de componente
  (`radius.button`, `size.switch.width`), agrupados e descritos.
- **Componentes** usam **só semânticos**. Primitivos nunca viram classe.

## Como mudar algo no sistema inteiro

Edite **uma linha** no JSON e rode `pnpm tokens`:

| Quero mudar | Edite |
|---|---|
| A fonte dos textos | `font.body` |
| A fonte dos títulos | `font.heading` |
| O raio de todos os cards, campos e afins | `radius.s` (ou o token do componente, ex.: `radius.card`) |
| O formato do botão | `radius.button` |
| A cor de foco em todos os componentes | `color.focus` |
| A cor de erro dos campos | `color.invalid` |
| A borda dos campos | `color.field` |
| Um estilo de texto (ex.: corpo) | `typography.body` |
| A velocidade das animações | `motion.duration.*` |

## Usando nos componentes

O Tailwind roda **sem o tema padrão dele**: `p-4`, `text-sm`, `rounded-md`, `bg-white`
não existem. As classes disponíveis são as dos semânticos:

| Tipo | Exemplos de classe | Vem de |
|---|---|---|
| Cor | `bg-link-1`, `text-text-3`, `border-field`, `ring-focus` | `color.*` |
| Espaço | `p-nano`, `gap-quark`, `-ml-pico`, `inset-none` | `spacing.*` |
| Tamanho | `h-control-md`, `size-icon-md`, `w-popover`, `max-w-tooltip-max` | `size.*` |
| Raio | `rounded-button`, `rounded-card`, `rounded-t-card` | `radius.*` |
| Espessura | `border-default` | `stroke.default` |
| Opacidade | `opacity-disabled`, `bg-link-5/hover`, `ring-focus/focus-ring` | `opacity.*` |
| Sombra | `shadow-s`, `shadow-m` | `elevation.*` |
| Camada | `z-overlay`, `z-raised` | `layer.*` |
| Curva | `ease-standard` | `motion.easing.*` |
| Giro | `rotate-diagonal`, `rotate-flip` | `rotate.*` |
| Texto | `typo-body`, `typo-button-small`, `md:typo-body-small` | `typography.*` |
| Breakpoint | `sm:`, `md:`, `lg:` | `breakpoint.*` |

Onde o Tailwind não tem classe nomeada, use a variável semântica direto:
`duration-(--aurora-motion-duration-fast)`, `ring-(length:--aurora-stroke-focus)`,
`underline-offset-(--aurora-underline-offset)`, `zoom-in-(--aurora-motion-scale-overlay)`.

Sempre importe `cn` de `@/lib/utils` (ele conhece os tokens; o `cn` do pacote não).

## Criando um token novo

1. Precisa mesmo? Só vira token o que é **decisão de design** ou **se repete**.
   Antes, tente: (1) reaproveitar uma escala semântica que já existe;
   (2) derivar com uma conta entre semânticos
   (ex.: bolinha do switch = `size.switch.height - 2 × stroke.default`).
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
- Nenhum valor solto (`[13px]`, `opacity-50`, `rounded-full`, `z-50`, `/50`...).
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
- **Variáveis com prefixo `--aurora-`**: evitam colisão com o Tailwind e com outras
  aplicações na mesma página.
