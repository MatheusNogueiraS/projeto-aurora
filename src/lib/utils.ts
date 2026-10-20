import { createCn } from "cn/config"

import { tokenMergeConfig } from "./tokens-merge"

// cn() que conhece os tokens do Aurora: funde corretamente classes como
// border-default (espessura) + border-field (cor), ou rounded-sm + rounded-pill.
export const cn = createCn(tokenMergeConfig)
