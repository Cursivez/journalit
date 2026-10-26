import React, { useEffect, useReducer, useRef } from 'react';
import { usePlugin } from '../../../../hooks/usePlugin';
import { useEventBus } from '../../../../hooks/useEventBus';
import { useDisplayFormatter } from '../../../../hooks/useDisplayPolicy';
import { t } from '../../../../lang/helpers';
import {
  calculateExpectancyGap,
  type ExpectancySample,
} from '../../utils/expectancyGap';
import { MetricCard } from './MetricCard';
import { ExpectancyBenchmarkModal } from './ExpectancyBenchmarkModal';
import { Pencil } from '../../../shared/icons/ObsidianIcon';


export function ExpectancyGapMetric({
  sample,
  isEditingLayout,
}: {
  sample: ExpectancySample | undefined;
  isEditingLayout: boolean;
}) {
  const plugin = usePlugin();
  const { formatValue, shouldMask } = useDisplayFormatter();
  const [, refreshSettings] = useReducer((n: number) => n + 1, 0);
  const modalRef = useRef<ExpectancyBenchmarkModal | null>(null);
  useEffect(
    () => () => {
      modalRef.current?.close();
    },
    []
  );
  useEventBus('settings:changed', () => {
    refreshSettings();
    const modal = modalRef.current;
    if (
      modal &&
      (plugin?.settings.display?.privacyMode ||
        modal.value !==
          (plugin?.settings.dashboard?.expectancyBenchmarkR ?? null))
    )
      modal.close();
  });
  const expected = plugin?.settings.dashboard?.expectancyBenchmarkR ?? null;
  const realized = sample?.realizedR ?? null;
  const gap = calculateExpectancyGap(realized, expected);
  const masked = shouldMask('rMultiple');
  const displayR = (value: number | null) =>
    formatValue({
      kind: 'rMultiple',
      value: masked ? 0 : value,
      signed: true,
      precision: 2,
      fallback: t('common.na'),
    });
  return (
    <MetricCard
      name={t('metric.expectancyGap.name')}
      value={displayR(gap)}
      isPositive={!masked && gap !== null && gap !== 0 ? gap > 0 : undefined}
      tooltipDisclosureLabel={`${t('metric.expectancyGap.name')}: ${t('expectancy-gap.method-title')}`}
      tooltip={
        <div className="journalit-dashboard-metric-tooltip">
          <div>
            {t('expectancy-gap.expected')}: {displayR(expected)}
          </div>
          <div>
            {t('expectancy-gap.realized')}: {displayR(realized)}
          </div>
          <div>
            {t('expectancy-gap.sample', {
              included: formatValue({
                kind: 'metric',
                value: sample?.included ?? 0,
                precision: 0,
              }),
              total: formatValue({
                kind: 'metric',
                value: sample?.closed ?? 0,
                precision: 0,
              }),
            })}
          </div>
          <p>{t('expectancy-gap.method')}</p>
        </div>
      }
      headerAction={
        <button
          type="button"
          className="journalit-expectancy-metric-edit clickable-icon"
          aria-label={`${t('button.edit')}: ${t('expectancy-gap.expected')}`}
          disabled={masked || isEditingLayout || !plugin}
          onClick={() => {
            if (!plugin || modalRef.current) return;
            const modal = new ExpectancyBenchmarkModal(plugin, () => {
              modalRef.current = null;
            });
            modalRef.current = modal;
            modal.open();
          }}
        >
          <Pencil size={12} aria-hidden="true" />
        </button>
      }
    />
  );
}
