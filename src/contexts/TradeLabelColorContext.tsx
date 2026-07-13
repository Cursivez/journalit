import { createContext, use } from 'react';
import { LabelColor } from '../types/labelColor';
import { normalizeSetupKey } from '../services/setup/setupIdentity';
import { normalizeOptionKey } from '../utils/stringNormalization';

export interface TradeLabelColors {
  setups: Readonly<Record<string, LabelColor>>;
  tags: Readonly<Record<string, LabelColor>>;
}

const EMPTY_TRADE_LABEL_COLORS: TradeLabelColors = {
  setups: {},
  tags: {},
};

const TradeLabelColorContext = createContext<TradeLabelColors>(
  EMPTY_TRADE_LABEL_COLORS
);

export const TradeLabelColorProvider = TradeLabelColorContext.Provider;

export function useTradeLabelColors(): TradeLabelColors {
  return use(TradeLabelColorContext);
}

export function getSetupLabelColor(
  colors: Readonly<Record<string, LabelColor>>,
  label: string
): LabelColor | undefined {
  return colors[normalizeSetupKey(label)];
}

export function getTagLabelColor(
  colors: Readonly<Record<string, LabelColor>>,
  label: string
): LabelColor | undefined {
  return colors[normalizeOptionKey(label)];
}
