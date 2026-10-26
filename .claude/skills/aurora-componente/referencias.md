# Referências do Aurora

Fontes que o responsável pediu para consultar. Todas entram **filtradas** (regra 18a do `CLAUDE.md`): aproveite o que soma e nunca desfaça regras por causa delas.

| Referência | Para quê | Acesso |
|---|---|---|
| **Nitro Core v3.0 (Copy)** — fileKey `5klgMA6TpNxCLpVEd6BCph` | **Estrutura**: escalas de tokens (units, radius, padding, gaps, tipografia) e o "painel" de propriedades de cada componente (`componentPropertyDefinitions`: Label, Icon Leading, Size, State…), que vira os controles do Storybook. | Edição. `use_figma` funciona. |
| **Genesis App Foundations** — fileKey `nLZV4Pi4Sk8PRfh5LlRWBk` | **Visual do Bmg** por componente (Avatar, Alert, Banners, Badge, Buttons, Calendar, Dropdown, Inputs, Select, Switch, Tag, Tabs, Toggle…). Página Buttons = node `8316-10431`. | Só leitura. `use_figma` falha até para trocar de página: use `get_metadata` (resultado grande vai para arquivo) e `get_screenshot` por node. |
| **Figma Make "Design System CB"** — fileKey `hseWu3LuCudVokAaIpekTb` | Inventário de componentes do dia a dia (forms, alerts, cards, data line, stepper em pílula, tabs, toasts…). | **Só quando o responsável citar.** Inspire-se em *quais* itens existem, nunca em *como* foram feitos (valores soltos, tudo num arquivo). `get_design_context` com nodeId `0:1` (create_session não funciona em Make) devolve recursos `file://figma/make/source/hseWu3LuCudVokAaIpekTb/<caminho>`; o principal é `src/app/App.tsx`. |

## Decisões ligadas às referências

- **Ícones:** Lucide, mesmo o Nitro usando Material Symbols. Não trocar sem pedido.
- **Tokens de componente** que aparecem em referências ou skills de terceiros (ex.: a `design-system` da ClaudeKit) **não entram** (regra 12a). Dessa skill ficou só o checklist de estados (regra 18b).
- O arquivo `yN2HUJqeaZryASnbS27450` (outra cópia do Nitro) não tem acesso.
