---
name: aurora-contraste
description: Análise de contraste de cores do Aurora (design system do Bmg) nos temas claro e escuro, pelos pares que os componentes usam de verdade — WCAG 2.2 AA como regra (texto 4.5:1, texto grande 3:1, borda/foco/ícone 3:1) e APCA como apoio para leitura no escuro. Use ao mudar ou criar cor/token, ao criar ou alterar componente que pinte texto, borda, foco ou ícone, ao revisar o tema escuro, ou quando perguntarem se um contraste está bom.
---

# Contraste — Aurora

Contrato:

| | |
|---|---|
| **Faz** | Mede todos os pares de cor usados nos componentes, nos dois temas, classifica cada achado e recomenda a correção. |
| **Não faz** | Não muda cor nem componente sozinha: o relatório vai para o responsável decidir (regra 24). Não troca cor de marca (regra 17). Não cria exceção sem decisão do responsável. |
| **Trava** | `contraste.mjs --check` roda no hook de commit: falha nova de WCAG AA barra o commit; exceções aceitas não. |
| **Ferramentas** | `scripts/contraste.mjs` (cálculo), páginas de Fundamentos do Storybook (conferência visual). |
| **Entrega** | Tabela de achados por prioridade, com o par, a razão, o tema, onde aparece e a sugestão. |

## Critérios (fontes)

| Critério | Mínimo | O que entra | Fonte |
|---|---|---|---|
| **WCAG 2.2 · 1.4.3** (AA, normativo) | 4.5:1 texto; 3:1 texto grande (≥ 24px, ou ≥ 18.5px em negrito) | Todo texto, inclusive placeholder e texto de hover/foco | [w3.org · Contrast (Minimum)](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html) |
| **WCAG 2.2 · 1.4.11** (AA, normativo) | 3:1 contra a cor vizinha | Borda que identifica o controle (campo), indicador de estado e de foco, ícone que carrega informação | [w3.org · Non-text Contrast](https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html) |
| **Isentos** | — | Desabilitado, decorativo (divisor, halo que acompanha uma borda sólida), logotipo | as duas páginas acima |
| **APCA** (rascunho do WCAG 3, só apoio) | Lc 75 corpo de texto (ideal), 60 texto comum, 45 texto grande, 30 elementos de interface | Aponta par que passa no WCAG 2 mas lê mal, comum no escuro: o WCAG 2 superestima contraste de texto claro sobre fundo escuro | [APCA · Myndex](https://github.com/Myndex/apca-introduction), fórmula [apca-w3 0.0.98G-4g](https://github.com/Myndex/apca-w3) |

A razão não é arredondada: 4.49:1 não passa em 4.5:1. Cor com transparência é misturada com o fundo antes da conta, como o navegador pinta.

## Passo a passo

1. **Rodar** (tokens e componentes já salvos):
   ```bash
   node .claude/skills/aurora-contraste/scripts/contraste.mjs --selftest   # confere as fórmulas
   node .claude/skills/aurora-contraste/scripts/contraste.mjs              # falhas e atenções
   node .claude/skills/aurora-contraste/scripts/contraste.mjs --all        # todos os pares
   ```
   O script lê as classes dos componentes (`src/components/ui`), separa por estado (padrão, hover, foco, erro, marcado, desabilitado…), resolve cada token no claro e no escuro e calcula WCAG e APCA. Texto sem fundo próprio é medido sobre a página (`background.5`) e sobre o card (`background.6`).
2. **Conferir cada achado no código** antes de levar adiante. O script lê classes como texto e pode errar o tipo:
   - cor de texto que pinta **ícone** (o mínimo vira 3:1); ele reconhece variantes `icon:`, `media:`, `tone:` e peças de tamanho fixo sem tipografia, mas confira;
   - cor **herdada** de outro elemento não é vista;
   - **halo** translúcido só é decorativo se houver borda sólida do mesmo papel no mesmo estado.
3. **Classificar** por prioridade:
   1. **Falha WCAG em foco, erro ou campo** (alguém não acha o controle ou não vê onde está).
   2. **Falha WCAG em texto.**
   3. **Falha em hover** (o WCAG não exige 3:1 no hover, mas ele não pode piorar o controle).
   4. **Atenção APCA** no escuro (passa no WCAG, lê mal).
4. **Recomendar a correção na fonte certa** (regras 11, 12, 17 e 19):
   - cor errada em um tema → o **semântico** daquele tema (`tokens/themes/dark.json` ou `semantic.json`); a fundação não muda;
   - falta um tom → átomo novo na fundação, sem fugir da linha da marca;
   - componente usando o papel errado (ex.: foco só com halo) → o **componente**.
   Calcule a alternativa antes de sugerir (o script e a paleta dão os valores).
5. **Depois da correção:** rodar de novo e conferir a página Foundations / Colors no Storybook nos dois temas.

## Exceções aceitas

Decisões do responsável que o relatório continua mostrando como falha, para não serem esquecidas:

Ficam em [excecoes.json](excecoes.json) (fonte única): par, tema e arquivos onde valem, e o motivo. Uma exceção só vale nos arquivos listados; o mesmo par num componente novo volta a ser falha. Nova exceção só com decisão do responsável.

## Formato do relato

```markdown
| Prioridade | Tema | Par | Hoje | Onde | Sugestão (com a conta) |
|---|---|---|---|---|---|
```
Feche com o que não deu para verificar (ex.: cor herdada, imagem, gráfico).
