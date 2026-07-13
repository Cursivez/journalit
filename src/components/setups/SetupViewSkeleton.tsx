import React from 'react';

import { t } from '../../lang/helpers';
import { SkeletonBox } from '../shared/SkeletonBox';
import { SkeletonText } from '../shared/SkeletonText';
import type { SetupsViewPage } from './setupsViewTypes';

const SETUP_SKELETON_CARDS = [
  'setup-skeleton-1',
  'setup-skeleton-2',
  'setup-skeleton-3',
  'setup-skeleton-4',
  'setup-skeleton-5',
  'setup-skeleton-6',
  'setup-skeleton-7',
  'setup-skeleton-8',
];
const SETUP_SKELETON_STATS = [
  'pf',
  'pnl',
  'win-rate',
  'expectancy',
  'drawdown',
];
const SETUP_SKELETON_RULES = ['context', 'entry', 'risk'];
const SETUP_SKELETON_BREAKDOWNS = [
  'compare-breakdown-instrument',
  'compare-breakdown-weekday',
  'compare-breakdown-direction',
];

export const SetupViewSkeleton: React.FC<{ page: SetupsViewPage }> = ({
  page,
}) => {
  switch (page) {
    case 'detail':
      return <SetupDetailSkeleton />;
    case 'compare':
      return <SetupCompareSkeleton />;
    case 'overview':
    default:
      return <SetupOverviewSkeleton />;
  }
};

SetupViewSkeleton.displayName = 'SetupViewSkeleton';

const SetupOverviewSkeleton: React.FC = () => (
  <div
    className="journalit-setups-view journalit-setups-skeleton"
    role="status"
    aria-live="polite"
    aria-busy="true"
  >
    <span className="journalit-skeleton-screenreader-status">
      {t('setups.view.loading')}
    </span>
    <header className="journalit-setups-view__header">
      <div />
      <div className="journalit-setups-skeleton__tabs">
        <SkeletonBox width={106} height={32} borderRadius="6px" />
        <SkeletonBox width={104} height={32} borderRadius="6px" />
      </div>
      <div className="journalit-setups-view__actions">
        <SkeletonBox width={112} height={32} borderRadius="6px" />
      </div>
    </header>

    <section className="journalit-chart-widget journalit-setups-performance-widget journalit-setups-skeleton__chart-card">
      <div className="journalit-setups-performance-widget__header">
        <div className="journalit-setups-performance-widget__heading">
          <SkeletonText width={220} height={18} />
          <SkeletonText width={420} height={13} />
        </div>
        <SkeletonBox width={112} height={30} borderRadius="6px" />
      </div>
      <div className="journalit-setups-skeleton__ranking-chart">
        <SkeletonBox width="82%" height={16} borderRadius="4px" />
        <SkeletonBox width="66%" height={16} borderRadius="4px" />
        <SkeletonBox width="54%" height={16} borderRadius="4px" />
        <SkeletonBox width="38%" height={16} borderRadius="4px" />
      </div>
    </section>

    <section className="journalit-setups-card-grid" aria-hidden="true">
      {SETUP_SKELETON_CARDS.map((key) => (
        <SetupCardSkeleton key={key} />
      ))}
    </section>
  </div>
);

SetupOverviewSkeleton.displayName = 'SetupOverviewSkeleton';

const SetupCardSkeleton: React.FC = () => (
  <article className="journalit-setup-card journalit-setup-card--skeleton">
    <div className="journalit-setup-card__header">
      <SkeletonText width="46%" height={18} />
      <SkeletonBox width={72} height={20} borderRadius="8px" />
    </div>
    <div className="journalit-setup-card__metric-row">
      <div className="journalit-setup-card__metric-block journalit-setup-card__metric-block--hero">
        <SkeletonText width={78} height={12} />
        <SkeletonText width={92} height={25} />
      </div>
      <div className="journalit-setup-card__metric-block journalit-setup-card__metric-block--win-rate">
        <SkeletonText width={58} height={12} />
        <SkeletonText width={64} height={25} />
      </div>
    </div>
    <SkeletonBox width="100%" height={44} borderRadius="8px" />
    <div className="journalit-setup-card__footer">
      <SkeletonText width={136} height={13} />
      <SkeletonText width={58} height={13} />
    </div>
  </article>
);

SetupCardSkeleton.displayName = 'SetupCardSkeleton';

const SetupDetailSkeleton: React.FC = () => (
  <div
    className="journalit-setups-view journalit-setups-skeleton"
    role="status"
    aria-live="polite"
    aria-busy="true"
  >
    <span className="journalit-skeleton-screenreader-status">
      {t('setups.view.loading')}
    </span>
    <header className="journalit-setups-detail-header">
      <div className="journalit-setups-detail-header__back">
        <SkeletonBox width={74} height={30} borderRadius="6px" />
      </div>
      <div className="journalit-setups-detail-header__identity">
        <SkeletonText width={260} height={28} />
        <div className="journalit-setups-badges">
          <SkeletonBox width={58} height={20} borderRadius="999px" />
          <SkeletonBox width={118} height={20} borderRadius="999px" />
          <SkeletonBox width={96} height={20} borderRadius="999px" />
        </div>
      </div>
      <div className="journalit-setups-detail-header__actions">
        <SkeletonBox width={32} height={32} borderRadius="6px" />
        <SkeletonBox width={32} height={32} borderRadius="6px" />
        <SkeletonBox width={32} height={32} borderRadius="6px" />
      </div>
    </header>
    <div className="journalit-setups-detail-scaffold">
      <section className="journalit-setups-detail-scaffold__hero journalit-setups-detail-scaffold__panel journalit-setups-detail-performance">
        <div className="journalit-setups-detail-performance__header">
          <div className="journalit-setups-detail-performance__stats">
            {SETUP_SKELETON_STATS.map((stat) => (
              <div
                key={stat}
                className="journalit-setups-detail-performance__stat"
              >
                <SkeletonText width="54%" height={10} />
                <SkeletonText width="62%" height={24} />
              </div>
            ))}
          </div>
        </div>
        <div className="journalit-setups-detail-performance__chart">
          <SkeletonBox
            className="journalit-setups-skeleton__chart-toggle"
            width={176}
            height={30}
            borderRadius="8px"
          />
          <SkeletonBox width="100%" height="100%" borderRadius="10px" />
        </div>
      </section>
      <aside className="journalit-setups-detail-scaffold__panel journalit-setups-brief">
        <SkeletonText width={128} height={14} />
        <SkeletonBox width="100%" height={12} borderRadius="0" />
        <SkeletonText width="82%" height={13} />
        <SkeletonText width="64%" height={13} />
        <SkeletonBox width="100%" height={1} borderRadius="0" />
        <SkeletonText width={148} height={14} />
        <SkeletonText width="72%" height={13} />
      </aside>
      <section className="journalit-setups-detail-scaffold__main journalit-setups-detail-scaffold__panel journalit-setups-playbook-panel">
        <SkeletonText width={120} height={22} />
        <SkeletonText width="90%" lines={3} height={13} />
      </section>
      <section className="journalit-setups-detail-scaffold__side journalit-setups-detail-scaffold__panel journalit-setups-rules-panel">
        <SkeletonText width={92} height={20} />
        {SETUP_SKELETON_RULES.map((rule) => (
          <SkeletonBox
            key={rule}
            width="72%"
            height={28}
            borderRadius="999px"
          />
        ))}
      </section>
    </div>
  </div>
);

SetupDetailSkeleton.displayName = 'SetupDetailSkeleton';

const SetupCompareSkeleton: React.FC = () => (
  <div
    className="journalit-setups-view journalit-setups-compare-page journalit-setups-skeleton"
    role="status"
    aria-live="polite"
    aria-busy="true"
  >
    <span className="journalit-skeleton-screenreader-status">
      {t('setups.view.loading')}
    </span>
    <header className="journalit-setups-compare-header">
      <SkeletonBox width={74} height={30} borderRadius="6px" />
      <div className="journalit-setups-skeleton__compare-title">
        <SkeletonText width={180} height={28} />
        <SkeletonText width={26} height={14} />
        <SkeletonText width={180} height={28} />
      </div>
    </header>

    <section className="journalit-setups-compare-edge-card journalit-setups-skeleton__compare-edge">
      <div className="journalit-setups-compare-edge-card__primary">
        <SkeletonBox width={38} height={38} borderRadius="999px" />
        <div>
          <SkeletonText width={78} height={11} />
          <SkeletonText width={220} height={22} />
        </div>
      </div>
      <div className="journalit-setups-compare-edge-card__stat">
        <SkeletonText width={64} height={11} />
        <SkeletonText width={96} height={22} />
      </div>
      <div className="journalit-setups-compare-edge-card__stat">
        <SkeletonText width={76} height={11} />
        <SkeletonText width={84} height={22} />
      </div>
      <div className="journalit-setups-compare-edge-card__reasons">
        <SkeletonBox width="100%" height={28} borderRadius="8px" />
        <SkeletonBox width="86%" height={28} borderRadius="8px" />
      </div>
    </section>

    <section className="journalit-setups-compare-body-card">
      <div className="journalit-setups-compare-main-grid">
        <section className="journalit-setups-compare-panel journalit-setups-compare-panel--metrics">
          <SkeletonText width={150} height={18} />
          <div className="journalit-setups-skeleton__compare-metrics">
            {SETUP_SKELETON_STATS.map((stat) => (
              <SkeletonBox
                key={stat}
                width="100%"
                height={34}
                borderRadius="6px"
              />
            ))}
          </div>
        </section>
        <section className="journalit-setups-compare-panel journalit-setups-compare-panel--chart">
          <div className="journalit-setups-compare-panel__header">
            <SkeletonText width={180} height={18} />
            <SkeletonBox width={110} height={30} borderRadius="6px" />
          </div>
          <SkeletonBox width="100%" height={300} borderRadius="10px" />
        </section>
      </div>

      <section className="journalit-setups-compare-breakdown-section">
        <div className="journalit-setups-compare-breakdowns">
          {SETUP_SKELETON_BREAKDOWNS.map((breakdown) => (
            <article
              className="journalit-setups-compare-breakdown"
              key={breakdown}
            >
              <div className="journalit-setups-compare-breakdown__header">
                <SkeletonText width={110} height={16} />
                <SkeletonText width={48} height={11} />
              </div>
              <SkeletonBox width="100%" height={170} borderRadius="8px" />
            </article>
          ))}
        </div>
      </section>
    </section>
  </div>
);

SetupCompareSkeleton.displayName = 'SetupCompareSkeleton';
