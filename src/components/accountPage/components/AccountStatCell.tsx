

import React from 'react';
import { cssVars } from '../../../styles/inlineStylePolicy';


export interface MetricLayoutVars {
  span: string;
  spanMd: string;
  spanSm: string;
}


export type MetricTile = React.ReactElement<{ layoutVars?: MetricLayoutVars }>;

type AccountStatTone = 'positive' | 'negative' | 'neutral';

interface AccountStatCellProps {
  label: React.ReactNode;
  value: React.ReactNode;
  
  tone?: AccountStatTone;
  
  muted?: boolean;
  
  layoutVars?: MetricLayoutVars;
}

export const AccountStatCell: React.FC<AccountStatCellProps> = ({
  label,
  value,
  tone,
  muted = false,
  layoutVars,
}) => {
  const toneClass =
    tone === 'positive'
      ? ' is-positive'
      : tone === 'negative'
        ? ' is-negative'
        : '';

  return (
    <div
      className="journalit-account-stat"
      style={cssVars({
        '--journalit-metric-span': layoutVars?.span,
        '--journalit-metric-span-md': layoutVars?.spanMd,
        '--journalit-metric-span-sm': layoutVars?.spanSm,
      })}
    >
      <span className="journalit-account-stat-label">{label}</span>
      <span
        className={`journalit-account-stat-value${toneClass}${muted ? ' is-muted' : ''}`}
      >
        {value}
      </span>
    </div>
  );
};


export function statTone(value: number, masked: boolean): AccountStatTone {
  if (masked) return 'neutral';
  if (value > 0) return 'positive';
  if (value < 0) return 'negative';
  return 'neutral';
}
