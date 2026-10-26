# Aurora — design system do Bmg

Tokens, componentes (React + shadcn/Radix) e documentação no Storybook. Não existe app: o produto deste repositório é o design system.

Este arquivo é lido em toda conversa do Claude Code neste projeto e traz as **regras** (o que vale sempre). Os **procedimentos** (como fazer cada tarefa) ficam nas skills de `.claude/skills/`, e as **travas automáticas**, nos hooks de `.claude/settings.json`. Mapa do harness e o porquê de cada escolha: [.claude/README.md](.claude/README.md).

**Quem aprova:** o responsável pelo design system (hoje, Matheus Nogueira). Nas regras, "o responsável". Quem opera o Claude no repositório é "quem está operando" (pode ser a mesma pessoa).

## Onde fica cada coisa

| Pasta | O quê |
|---|---|
| `tokens/*.json` | Fonte de verdade dos tokens (fundação, semântico, temas). Regras em `tokens/README.md`. |
| `src/styles/*.css`, `src/lib/tokens-merge.ts` | **Gerados** a partir dos tokens (`pnpm tokens`). Nunca editar à mão (um hook barra). |
| `src/components/ui/` | Componentes. Inventário em `.claude/skills/aurora-componente/manifest.json`. |
| `src/stories/` | Storybook: `componentes/` (histórias) e `fundamentos/` (páginas que leem os tokens direto). |
| `scripts/tokens/` | Gerador e trava dos tokens; rodam no `pnpm build` e no `pnpm lint`. |
| `.claude/` | Harness: skills, hooks e permissões do Claude Code. |

## Comandos

```bash
pnpm storybook                 # Storybook em http://localhost:6006
pnpm tokens                    # gera o CSS a partir de tokens/*.json
pnpm lint                      # ESLint + trava de tokens (classes, valores soltos, contraste)
pnpm exec tsc -b --noEmit      # tipos
pnpm build                     # tokens atualizados + tipos
pnpm build-storybook           # Storybook publicável (storybook-static/)
node .claude/skills/aurora-componente/scripts/manifest.mjs   # inventário de componentes (--check só confere)
```

## Qual skill usar

| Situação | Skill |
|---|---|
| Começar qualquer trabalho; commit, push, PR; depois do merge | `aurora-git-fluxo` |
| Criar, instalar ou alterar um componente | `aurora-componente` |
| Conferir que um componente está inteiro no Storybook e funcionando | `aurora-storybook-cobertura` |
| Revisar ou padronizar a documentação de componentes | `aurora-storybook-review` |
| Atualizar o Storybook online (toda PR) | `aurora-storybook-publicar` |

## Regras

Cada regra traz o porquê, para ser aplicada com bom senso também em casos que ela não cita. Os números são citados pelas skills; não renumere.

### Fluxo de trabalho

1. **Todo trabalho começa numa branch nova, criada da `main` atualizada e validada, antes de editar qualquer arquivo; nunca se trabalha na `main`** (um hook barra). Passo a passo na skill `aurora-git-fluxo`.
   *Por quê:* cada mudança fica isolada, revisável e fácil de desfazer.

2. **Commit, push, Pull Request e merge só quando quem está operando pedir.** Ao terminar, ofereça.
   *Por quê:* nada sai da máquina nem entra na `main` sem revisão.

3. **Branch mergeada se apaga** (local e remota), só depois do merge confirmado e da `main` atualizada. Nunca apague branch com PR aberta ou sem merge.

4. **Antes de commitar, valide**: `pnpm lint` (inclui a trava de tokens), `pnpm exec tsc -b --noEmit`, `pnpm build` e `pnpm build-storybook`. Só diga que está pronto com tudo passando; se algo falhar, diga o quê. O hook de commit roda a parte rápida (lint, tipos e inventário); o build é com você.

4a. **Toda PR atualiza o Storybook online** no mesmo link, com o link na primeira linha da descrição da PR. Skill `aurora-storybook-publicar`.

5. **Descrição de PR em linguagem simples**: o que muda, o que muda visualmente e como revisar. Nada de `localhost` nem jargão sem explicação.
   *Por quê:* qualquer pessoa precisa entender a PR, não só quem programa.

6. **Não rode instaladores ou geradores de projeto por conta própria** (`init`, `create`…). As escolhas de configuração são do responsável: espere a configuração ou a confirmação. Dependências novas: versão fixa, publicada há pelo menos duas semanas.

7. **Nada sai para fora sem confirmação.** O conteúdo é do banco: publicar link, hospedar ou enviar para serviço externo só com ok. Telemetria de ferramentas fica desligada.

### Revisão e qualidade

8. **Todo desenvolvimento novo, principalmente os maiores, passa por uma revisão no estilo tech lead antes de ser dado como concluído.** Procure lacunas reais que vão gerar problema no futuro (escalabilidade, reprodutibilidade, duplicidade, acoplamento, algo que quebra em silêncio), não melhorias cosméticas. Apresente por prioridade e corrija o que for do escopo.
   *Por quê:* a base não pode gerar dor depois; é melhor descobrir o problema agora.

9. **Antes de aplicar uma mudança em muitos lugares, revise se ela encaixa** (ex.: tokens novos cobrem todos os casos antes de irem para todos os componentes).
   *Por quê:* ajustar a base é mais barato que consertar componente por componente.

10. **Verifique, não suponha.** Compile, rode, capture a tela antes de afirmar que algo funciona ou está quebrado. O que não deu para verificar, diga.

### Design system

11. **A fonte de verdade vem primeiro; a implementação depois.** Tokens nascem em `tokens/*.json` e o CSS é gerado. Arquivos gerados nunca são editados à mão.

12. **Lógica atômica.** Átomos (fundação) servem semânticos; semânticos servem componentes. Componentes nunca usam fundação nem valores diretos (número, hex ou medida solta). Se faltar um valor, ele nasce primeiro como token.
    *Por quê:* mudar um átomo ou um semântico muda o design system inteiro, sem revisar componente por componente.
    **Exceção: tamanho não é token.** Altura de controle é padding + conteúdo; medidas fixas (ícone, switch, checkbox) e mínimos/máximos ficam no componente, em px (`size-[16px]`, `max-w-[320px]`).

12a. **Nunca crie token específico de componente** (`radius.button`, `size.switch`…). Componentes usam só as escalas gerais, como no Nitro Core: **padding** (dentro) e **gap** (entre), com os mesmos passos e independentes (none/xxs 2/xs 4/sm 8/md 12/lg 16/xl 20/xxl 32), e **radius** (none/xxs 4/xs 6/sm 8/md 12/lg 16/xl 24/pill). Valor fora da escala é arredondado para o passo mais próximo.
    *Por quê:* um token que só serve a um componente perde a função de controlar o sistema.

13. **Cores sempre em hexadecimal** na base de tokens.

14. **Nada duplicado.** Uma coleção por assunto; nunca duas fontes cuidando da mesma coisa (inclusive padrões de bibliotecas competindo com os tokens).

15. **Enxuto.** Só vira token o que é decisão de design ou se repete. Antes de criar um token: reaproveite uma escala, depois tente derivar com uma conta entre tokens, só então crie.

16. **Independente de framework.** Os tokens não dependem de bibliotecas (ex.: Tailwind); a biblioteca só consome o que os tokens definem, sem o tema padrão dela.

17. **Cores de marca não mudam entre temas.** No tema escuro, ajuste os outros semânticos; se faltar contraste, crie átomos novos sem fugir da linha da marca.

18. **Nomes vindos de fonte externa (ex.: Figma) têm a digitação corrigida** e seguem um padrão único.

18a. **Referências externas entram filtradas** (Nitro, Genesis, skills de terceiros, guias de mercado). Aproveite só o que soma; nunca desfaça o que foi construído nem estas regras por causa de uma referência, salvo prática absolutamente de mercado e já pesquisada com o responsável. Se uma referência contradiz uma regra, aponte o conflito e siga a regra. Onde ficam as referências: `.claude/skills/aurora-componente/referencias.md`.

### Componentes

18b. **Checklist de estados** em todo componente revisado: padrão, hover, foco (visível), ativo, desabilitado e, quando fizer sentido, loading e erro. Prioridade quando se somam: desabilitado > loading > ativo > foco > hover > padrão. Cada estado usa semânticos existentes; estado que muda só cor nunca depende só da cor (ícone, texto ou forma junto). Acessibilidade: `disabled`/`aria-disabled`, `aria-busy` no loading, `aria-invalid` + mensagem no erro, contraste mínimo 4.5:1 para texto e 3:1 para borda, ícone e foco.
    **Teste hover e foco de verdade** (mouse sobre o componente e sobre o texto; Tab para o foco). Estados que se excluem viram regra do componente, não só da documentação (ex.: Checkbox: erro só desmarcado e habilitado; desabilitado nunca em erro).

18c. **Documentação curta e sem código**: descrição em 1–2 frases; cada controle em uma frase do que faz, sem caracterizar demais ("Mostra o texto ao lado.", nunca "ao lado da caixinha"). Sem tabela de estados: estados mostráveis viram **controles** na categoria "Estado". Histórias Padrão / Variantes / Tamanhos / Desabilitado, com controles nomeados como no painel do Figma. Detalhes na skill `aurora-storybook-review`.

18d. **O componente documentado é a unidade do Figma** (ex.: Accordion = um item; lista = soma de itens independentes). Agrupamentos que existem só por comportamento ou acessibilidade continuam no código, mas não viram controle.

18e. **Toda instalação, criação ou atualização de componente passa pela skill `aurora-storybook-cobertura`** antes de ser dada como pronta.
    *Por quê:* o que não aparece ou não funciona no Storybook, para quem valida, não existe.

18f. **Construção atômica: nunca recrie um componente que já existe.** Botão é o `Button`/`IconButton`, barra de progresso é o `Progress`, e assim por diante. Componente complexo: primeiro as partes (o que existe, o que falta criar como peça), depois o todo. Comportamento próprio do componente não conta como recriar (ex.: o cartão inteiro do FileUpload ser clicável).
    *Por quê:* foco, hover, estados e acessibilidade ficam iguais em todo o DS, e mudar um átomo muda todos que o usam.

### Storybook e ajustes

19. **O Storybook é onde o responsável valida o trabalho. Ajuste pedido olhando o Storybook vai para a fonte** (token ou componente), nunca só para a história. Só fica no Storybook o que é apresentação da documentação (textos, exemplos, layout das páginas).
    *Por quê:* o que foi aprovado no Storybook tem que ser exatamente o que vai para o produto.

20. **Ajustar não é recriar.** Para aproximar um componente de uma referência, mude só o que foi pedido, mantenha a estrutura e a coerência com os demais. Se destoar, procure o meio-termo.

21. **Proteja o que reaproveita o que você mudou.** Ao alterar algo usado por outros componentes (veja `usadoPor` no manifest), confira que a mudança não vaza para eles sem querer.

### Comunicação

22. **Em português, em linguagem de produto.** O design system é conduzido por design: diga o que vai fazer e por quê, explique termos técnicos rapidamente, use tabelas para comparar opções e recomende uma.

23. **Ao terminar um ajuste, diga em uma linha onde ele foi feito** (token, componente ou só documentação) **e liste as decisões tomadas sozinho**, para o responsável poder corrigir.

24. **Pergunte quando a decisão for do responsável** (configuração, marca, o que publicar); nos demais casos, escolha o mais sensato, siga e conte o que escolheu.

## Decisões em vigor

Escolhas já feitas com o responsável. Não mude sem pedido.

- **Ícones:** Lucide (`lucide-react`), mesmo o Nitro usando Material Symbols.
- **Fontes:** Poppins 700 nos títulos; Lato 400/700 no texto (por isso texto só regular/bold).
- **Celular = desktop** por enquanto. Diferenças mantidas de propósito: Input/Textarea com 16px no celular e 14px no desktop (evita o zoom do iPhone); Breadcrumb com gap 4→8 a partir de `sm`; Alert com `text-balance`→`pretty` a partir de `md`.
- **Sem app próprio:** o app de demonstração foi removido; o projeto é DS + Storybook.
- **Passos de escala sem uso** (gap xxl, radius md/lg/xl, headings grandes) ficam de propósito.
- **Opacidade** é escala genérica: none 0 / xs 20 / sm 40 / md 50 / lg 70 / xl 90 / full 100.
- **Adiado:** ajuste de acessibilidade em todos os componentes (ícones 24px, texto 16px, linha de 56px como no Genesis). Primeiro todos os componentes no padrão atual.
- **Adiado:** hospedar o Storybook no Netlify, até terminar a revisão dos componentes (receita na skill `aurora-storybook-publicar`).

## Pendências técnicas (para devs)

Achados de auditoria que ficam para o time de desenvolvimento. **Não corrija sem pedido**; se um deles afetar a tarefa, mencione e pergunte.

- A trava de tokens só lê classes dentro de `className`, `cn()` e `cva()`; classes em strings soltas passam sem checagem (por isso o Button guarda constantes dentro de `cn()`).
- FileUpload: a prop `name` não tem uso; conferir se soltar um arquivo fora da área abre o arquivo no navegador.
- Dependências sem uso direto no código: `@tanstack/react-table`, `date-fns`.
- Tabela: falta um Radio para escolher uma linha (o RadioGroup é grid e não envolve o `tbody`).
