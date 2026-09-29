

import React, { useId } from 'react';
import { useAccountMetricsTiles } from './AccountMetrics';
import { useSummaryBandTiles } from './AccountSummaryBand';
import type { PropChallengeCockpitState } from './propChallenge/usePropChallengeCockpitState';
import { useGuideTarget } from '../../../guides/GuideRuntimeLayer';
import { ACCOUNT_PAGE_METRICS_SECTION_TARGET_ID } from '../../../guides/accountPageGuideIds';
import { t } from '../../../lang/helpers';
import { cssVars } from '../../../styles/inlineStylePolicy';
import { metricGridLayout } from './metricGridLayout';


const MAX_COLUMNS = { lg: 7, md: 4, sm: 2 } as const;

export const AccountMetricsPanel: React.FC<{
  
  showSummaryBand: boolean;
  
  cockpitState: PropChallengeCockpitState | null;
}> = ({ showSummaryBand, cockpitState }) => {
  const registerMetricsSectionTarget = useGuideTarget(
    ACCOUNT_PAGE_METRICS_SECTION_TARGET_ID
  );
  const headingId = useId();
  const summaryTiles = useSummaryBandTiles(showSummaryBand, cockpitState);
  
  
  const metricTiles = useAccountMetricsTiles(!showSummaryBand);
  const tiles = [...summaryTiles, ...metricTiles];

  const lg = metricGridLayout(tiles.length, MAX_COLUMNS.lg);
  const md = metricGridLayout(tiles.length, MAX_COLUMNS.md);
  const sm = metricGridLayout(tiles.length, MAX_COLUMNS.sm);

  if (tiles.length === 0) return null;

  return (
    <section
      className="journalit-account-metrics-panel"
      aria-labelledby={headingId}
      ref={registerMetricsSectionTarget}
      style={cssVars({
        '--journalit-metric-tracks': String(lg.tracks),
        '--journalit-metric-tracks-md': String(md.tracks),
        '--journalit-metric-tracks-sm': String(sm.tracks),
      })}
    >
      
      <h3 id={headingId} className="journalit-account-page-sr-only">
        {t('account.performance.title')}
      </h3>
      {tiles.map((tile, index) =>
        React.cloneElement(tile, {
          layoutVars: {
            span: String(lg.spans[index]),
            spanMd: String(md.spans[index]),
            spanSm: String(sm.spans[index]),
          },
        })
      )}
    </section>
  );
};
