

import React from 'react';
import { SkeletonBox } from '../shared/SkeletonBox';
import {
  AlertTriangle,
  BadgeCheck,
  CalendarRange,
} from '../shared/icons/ObsidianIcon';
import { t, type TranslationKey } from '../../lang/helpers';
import { resolveUpgradeUrl } from '../../services/upgrade/upgradeOrigin';
import { openExternalUrl } from '../../utils/externalLinks';


const SKELETON_CURRENCY_CHIPS = [
  'aud',
  'cad',
  'chf',
  'eur',
  'gbp',
  'jpy',
  'nzd',
  'usd',
];
const SKELETON_IMPACT_CHIPS = ['high', 'medium', 'low', 'none'];


const SKELETON_DAYS = [
  { key: 'first', titleWidths: ['54%', '38%', '61%', '45%', '50%'] },
  { key: 'second', titleWidths: ['47%', '58%', '35%', '52%'] },
  { key: 'third', titleWidths: ['41%', '56%', '33%', '49%'] },
].map((day) => ({
  key: day.key,
  rows: day.titleWidths.map((titleWidth, position) => ({
    key: `${day.key}-${position}`,
    titleWidth,
  })),
}));

const EconomicCalendarSkeletonRow: React.FC<{ titleWidth: string }> = ({
  titleWidth,
}) => (
  <div className="journalit-econ-row journalit-econ-row--skeleton">
    <div className="journalit-econ-row__select">
      <SkeletonBox width="14px" height="14px" borderRadius="3px" />
    </div>
    <SkeletonBox width="46px" height="11px" />
    <SkeletonBox width="34px" height="18px" borderRadius="3px" />
    <SkeletonBox width="8px" height="8px" borderRadius="50%" />
    <div className="journalit-econ-row__name">
      <SkeletonBox width={titleWidth} height="12px" />
    </div>
    <div className="journalit-econ-row__readings">
      <span className="journalit-econ-reading journalit-econ-reading--actual">
        <SkeletonBox width="34px" height="10px" />
      </span>
      <span className="journalit-econ-reading journalit-econ-reading--forecast">
        <SkeletonBox width="34px" height="10px" />
      </span>
      <span className="journalit-econ-reading journalit-econ-reading--previous">
        <SkeletonBox width="34px" height="10px" />
      </span>
    </div>
  </div>
);

export const EconomicCalendarLoading: React.FC = () => (
  <div
    className="journalit-econ-loading"
    role="status"
    aria-label={t('common.loading')}
  >
    <div className="journalit-econ-filters">
      <div className="journalit-econ-filter-group">
        <SkeletonBox width="56px" height="10px" />
        <div className="journalit-econ-chips">
          {SKELETON_CURRENCY_CHIPS.map((key) => (
            <SkeletonBox
              key={key}
              width="46px"
              height="22px"
              borderRadius="11px"
            />
          ))}
        </div>
      </div>
      <div className="journalit-econ-filter-group">
        <SkeletonBox width="44px" height="10px" />
        <div className="journalit-econ-chips">
          {SKELETON_IMPACT_CHIPS.map((key) => (
            <SkeletonBox
              key={key}
              width="68px"
              height="22px"
              borderRadius="11px"
            />
          ))}
        </div>
      </div>
      <div className="journalit-econ-loading__select-all">
        <SkeletonBox width="62px" height="12px" />
      </div>
    </div>

    <div className="journalit-econ-list">
      <div className="journalit-econ-columns" aria-hidden="true">
        <SkeletonBox
          width="40px"
          height="9px"
          className="journalit-econ-columns__label--actual"
        />
        <SkeletonBox
          width="48px"
          height="9px"
          className="journalit-econ-columns__label--forecast"
        />
        <SkeletonBox
          width="48px"
          height="9px"
          className="journalit-econ-columns__label--previous"
        />
      </div>
      {SKELETON_DAYS.map((day) => (
        <section key={day.key} className="journalit-econ-day">
          <div className="journalit-econ-day__label">
            <SkeletonBox width="64px" height="10px" />
            <SkeletonBox width="52px" height="10px" />
          </div>
          {day.rows.map((row) => (
            <EconomicCalendarSkeletonRow
              key={row.key}
              titleWidth={row.titleWidth}
            />
          ))}
        </section>
      ))}
    </div>

    <div className="journalit-econ-footer">
      <SkeletonBox width="118px" height="29px" borderRadius="5px" />
    </div>
  </div>
);

EconomicCalendarLoading.displayName = 'EconomicCalendarLoading';

export const EconomicCalendarEmpty: React.FC = () => (
  <div className="journalit-econ-message">
    <CalendarRange size={22} aria-hidden="true" />
    <p className="journalit-econ-message__text">
      {t('view.economic-calendar.empty')}
    </p>
  </div>
);

EconomicCalendarEmpty.displayName = 'EconomicCalendarEmpty';

interface EconomicCalendarErrorProps {
  messageKey: TranslationKey;
  onRetry: () => void;
}

export const EconomicCalendarError: React.FC<EconomicCalendarErrorProps> = ({
  messageKey,
  onRetry,
}) => (
  <div className="journalit-econ-message">
    <AlertTriangle size={22} aria-hidden="true" />
    <p className="journalit-econ-message__text">{t(messageKey)}</p>
    <button
      type="button"
      className="journalit-econ-message__action"
      onClick={onRetry}
    >
      {t('view.economic-calendar.retry')}
    </button>
  </div>
);

EconomicCalendarError.displayName = 'EconomicCalendarError';

export const EconomicCalendarProGate: React.FC = () => (
  <div className="journalit-econ-gate">
    <div className="journalit-econ-gate__icon" aria-hidden="true">
      <CalendarRange size={24} strokeWidth={1.8} />
    </div>
    <h2 className="journalit-econ-gate__title">
      {t('view.economic-calendar.pro-required')}
    </h2>
    <div className="journalit-econ-gate__benefits">
      <div>
        <BadgeCheck size={15} aria-hidden="true" />
        <span>{t('view.economic-calendar.pro-benefit')}</span>
      </div>
      <div>
        <BadgeCheck size={15} aria-hidden="true" />
        <span>{t('view.economic-calendar.pro-benefit-trial')}</span>
      </div>
    </div>
    <button
      type="button"
      className="journalit-econ-gate__cta"
      onClick={() => openExternalUrl(resolveUpgradeUrl('economicCalendar'))}
    >
      {t('premium.gate.cta.continue-pro')}
    </button>
  </div>
);

EconomicCalendarProGate.displayName = 'EconomicCalendarProGate';
