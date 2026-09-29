

import React from 'react';
import {
  BookOpen,
  Calendar,
  Check,
  CalendarRange,
  CheckCircle2,
  Circle,
  FileText,
  Flame,
  FolderOpen,
  Info,
  RotateCcw,
  Save,
} from '../../shared/icons/ObsidianIcon';
import { t } from '../../../lang/helpers';
import {
  previewDayLabel,
  previewMonthShort,
} from '../../shared/widgetDrawer/previewDateLabels';
import type { CurrentStreakKind } from '../../../settings/types';
import { getReviewActiveLabel } from '../widgets/CurrentStreakReview';
import { cssVars } from '../../../styles/inlineStylePolicy';
import {
  Chevron,
  Eyebrow,
  Gauge,
  Mini,
  ProgressBar,
  Radar,
  SegmentedBar,
  toneClass,
  type PreviewTone,
} from '../../shared/widgetDrawer/previewPrimitives';

const ICON = '1.25em';


const WEEKDAY_INITIALS = ['M', 'T', 'W', 'T', 'F'];


const WEEK_BARS = [1.6, 1.1, 0.3, -0.3, 0.3].map((value, day) => ({
  day,
  value,
}));


const sampleNoise = (seed: number): number => {
  const x = Math.sin(seed * 12.9898) * 43758.5453;
  return x - Math.floor(x);
};


const sampleNote = () => ({
  title: t('home.widget-selector.sample-note.title'),
  intro: t('home.widget-selector.sample-note.intro'),
  checklistTitle: t('home.widget-selector.sample-note.checklist'),
  tasks: [
    [t('home.widget-selector.sample-note.task.calendar'), true],
    [t('home.widget-selector.sample-note.task.levels'), true],
    [t('home.widget-selector.sample-note.task.max-loss'), false],
    [t('home.widget-selector.sample-note.task.journal'), false],
  ] as const,
});

const HEATMAP_WEEKS = 24;

const heatmapLevel = (week: number, day: number): string => {
  if (day > 4) return '';
  const noise = sampleNoise(week * 7 + day + 1);
  const activity = 0.25 + (week / HEATMAP_WEEKS) * 0.6;
  if (noise > activity + 0.15) return '';
  if (noise < 0.14) return ' journalit-wpd-heat--neg';
  if (week > HEATMAP_WEEKS - 4 && noise > 0.55) return ' journalit-wpd-heat--4';
  if (noise > 0.6) return ' journalit-wpd-heat--3';
  if (noise > 0.4) return ' journalit-wpd-heat--2';
  return ' journalit-wpd-heat--1';
};

const HeatmapPreview: React.FC = () => (
  <Mini>
    <Eyebrow aside={<Chevron />}>
      {t('home.widget.heatmap.last-6-months')}
    </Eyebrow>
    <div className="journalit-wpd-heatmap">
      <div className="journalit-wpd-heatmap-months">
        {[3, 4, 5, 6, 7, 8].map((month) => (
          <span key={month}>{previewMonthShort(month)}</span>
        ))}
      </div>
      <div className="journalit-wpd-heatmap-body">
        <div className="journalit-wpd-heatmap-days">
          {[1, 3, 5, 0].map((weekday) => (
            <span key={weekday}>{previewDayLabel(weekday)}</span>
          ))}
        </div>
        <div className="journalit-wpd-heatmap-grid">
          {Array.from({ length: HEATMAP_WEEKS * 7 }, (_, index) => (
            <span
              key={index}
              className={`journalit-wpd-heat${heatmapLevel(Math.floor(index / 7), index % 7)}`}
            />
          ))}
        </div>
      </div>
      <div className="journalit-wpd-heatmap-legend">
        {t('calendar.legend.less')}
        <span className="journalit-wpd-heat journalit-wpd-heat--1" />
        <span className="journalit-wpd-heat journalit-wpd-heat--2" />
        <span className="journalit-wpd-heat journalit-wpd-heat--3" />
        <span className="journalit-wpd-heat journalit-wpd-heat--4" />
        {t('calendar.legend.more')}
      </div>
    </div>
  </Mini>
);

const LimitRows: React.FC<{
  rows: Array<{
    name: string;
    value: string;
    tone: PreviewTone;
    filled: number;
    remaining: string;
  }>;
}> = ({ rows }) => (
  <div className="journalit-wpd-limit-rows">
    {rows.map((row) => (
      <div key={row.name} className="journalit-wpd-limit-row">
        <div className="journalit-wpd-row-split">
          <span className="journalit-wpd-text">{row.name}</span>
          <span className={`journalit-wpd-strong ${toneClass(row.tone)}`}>
            {row.value}
          </span>
        </div>
        <SegmentedBar segments={18} filled={row.filled} tone={row.tone} />
        <span className="journalit-wpd-faint">{row.remaining}</span>
      </div>
    ))}
  </div>
);



interface HomePreviewInstance {
  label: string;
  streakKind?: CurrentStreakKind;
}

export const HOME_WIDGET_PREVIEWS: Record<
  string,
  (instance?: HomePreviewInstance) => React.ReactNode
> = {
  recentItems: () => (
    <Mini>
      <Eyebrow>{t('home.widget.recent.title')}</Eyebrow>
      <div className="journalit-wpd-list">
        {[
          { icon: Calendar, name: '2026-09-25', hours: '1' },
          { icon: FileText, name: 'MNQ 2026-09-25 Long', hours: '2' },
          { icon: BookOpen, name: '2026-W39', hours: '5' },
          { icon: CalendarRange, name: '2026-09', hours: '20' },
        ].map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.name} className="journalit-wpd-list-row">
              <Icon size={ICON} className="journalit-wpd-muted" />
              <span className="journalit-wpd-list-body">
                <span className="journalit-wpd-text">{item.name}</span>
                <span className="journalit-wpd-faint">
                  {t('home.widget.recent.hours-ago', { hours: item.hours })}
                </span>
              </span>
            </div>
          );
        })}
      </div>
    </Mini>
  ),
  yearHeatmap: () => <HeatmapPreview />,
  gettingStarted: () => (
    <Mini>
      <div className="journalit-wpd-row-split">
        <span className="journalit-wpd-title-text">
          {t('home.widget.getting-started.name')}
        </span>
        <span className="journalit-wpd-faint">
          {t('home.widget.getting-started.progress', {
            completed: '2',
            total: '6',
          })}
        </span>
      </div>
      <div className="journalit-wpd-list">
        {(
          [
            ['account', true],
            ['create', true],
            ['tradelog', false],
          ] as const
        ).map(([item, done]) => (
          <div key={item} className="journalit-wpd-check-item">
            {done ? (
              <CheckCircle2 size={ICON} className="journalit-wpd-tone--pos" />
            ) : (
              <Circle size={ICON} />
            )}
            <span className="journalit-wpd-list-body">
              <span className="journalit-wpd-strong">
                {t(`home.widget.getting-started.item.${item}.title`)}
              </span>
              <span className="journalit-wpd-faint journalit-wpd-ellipsis">
                {t(`home.widget.getting-started.item.${item}.description`)}
              </span>
            </span>
            <span className="journalit-wpd-faint">
              {t(`home.widget.getting-started.item.${item}.time`)}
            </span>
          </div>
        ))}
      </div>
    </Mini>
  ),
  weeklySummary: () => (
    <Mini>
      <Eyebrow>{t('home.widget.weekly.title')}</Eyebrow>
      <div className="journalit-wpd-center">
        <span className="journalit-wpd-hero journalit-wpd-tone--pos">
          $2,780.74
        </span>
        <span className="journalit-wpd-muted">
          {t('home.widget.weekly.above-average')}
        </span>
      </div>
      <div className="journalit-wpd-weekbars">
        {WEEK_BARS.map(({ day, value }) => (
          <span key={day} className="journalit-wpd-weekbar">
            <span
              className={`journalit-wpd-weekbar-fill ${toneClass(value >= 0 ? 'pos' : 'neg')}`}
              style={cssVars({
                '--journalit-wpd-fill': `${Math.round((Math.abs(value) / 1.6) * 100)}%`,
              })}
            />
            <span className="journalit-wpd-faint">{WEEKDAY_INITIALS[day]}</span>
          </span>
        ))}
      </div>
    </Mini>
  ),
  keyEvents: () => (
    <Mini>
      <Eyebrow aside={<Calendar size="1em" />}>
        {t('widget.key-events.title')}
      </Eyebrow>
      <div className="journalit-wpd-list">
        {(
          [
            ['CPI m/m', '08:30', 'neg'],
            ['Retail Sales m/m', '08:30', 'warn'],
            ['FOMC Statement', '14:00', 'neg'],
            ['Crude Oil Inventories', '10:30', 'muted'],
          ] as const
        ).map(([name, time, tone]) => (
          <div key={name} className="journalit-wpd-event-row">
            <span className={`journalit-wpd-rail ${toneClass(tone)}`} />
            <span className="journalit-wpd-text journalit-wpd-grow">
              {name}
            </span>
            <span className="journalit-wpd-faint">{time}</span>
          </div>
        ))}
      </div>
    </Mini>
  ),
  positionSize: () => (
    <Mini>
      <Eyebrow
        aside={
          <span className="journalit-wpd-icon-pair">
            <Save size="1em" />
            <RotateCcw size="1em" />
          </span>
        }
      >
        {t('widget.position-size.title')}
      </Eyebrow>
      <div className="journalit-wpd-segmented">
        <span className="journalit-wpd-segmented-option journalit-wpd-segmented-option--active">
          {t('widget.position-size.stock-crypto')}
        </span>
        <span className="journalit-wpd-segmented-option">
          {t('widget.position-size.futures')}
        </span>
        <span className="journalit-wpd-segmented-option">
          {t('widget.position-size.forex')}
        </span>
      </div>
      <div className="journalit-wpd-fields">
        {(
          [
            ['widget.position-size.account-balance', '10000'],
            ['widget.position-size.risk-percent', '1'],
            ['widget.position-size.entry-price', '184.20'],
            ['form.field.stop-loss', '182.60'],
          ] as const
        ).map(([label, value]) => (
          <span key={label} className="journalit-wpd-field">
            <span className="journalit-wpd-text">{t(label)}</span>
            <span className="journalit-wpd-input">{value}</span>
          </span>
        ))}
      </div>
    </Mini>
  ),
  embeddedNote: (instance) => {
    const note = sampleNote();
    return (
      <Mini>
        <Eyebrow aside={<FolderOpen size="1em" />}>
          {instance?.label ?? note.title}
        </Eyebrow>
        <div className="journalit-wpd-note">
          <span className="journalit-wpd-note-h1">{note.title}</span>
          <span className="journalit-wpd-note-text">{note.intro}</span>
          <span className="journalit-wpd-note-h2">{note.checklistTitle}</span>
          {note.tasks.map(([task, done]) => (
            <span
              key={task}
              className={`journalit-wpd-task${done ? ' journalit-wpd-task--done' : ''}`}
            >
              <span className="journalit-wpd-task-box">
                {done && <Check size="0.8em" strokeWidth={4} />}
              </span>
              {task}
            </span>
          ))}
        </div>
      </Mini>
    );
  },
  currentStreak: (instance) => (
    <Mini>
      <Eyebrow
        aside={`${t('home.widget.streak.best')} 7 · ${t('home.widget.streak.avg')} 3.2`}
      >
        {instance?.label ?? t('home.widget.streak.title')}
      </Eyebrow>
      <div className="journalit-wpd-center journalit-wpd-tone--pos">
        <Flame size="1.8em" />
        <span className="journalit-wpd-hero">5</span>
        {instance?.streakKind && instance.streakKind !== 'trade-outcome' ? (
          <>
            <span>{getReviewActiveLabel(instance.streakKind, 5)}</span>
            <span className="journalit-wpd-muted">
              {t('home.widget.streak.keep-reviewing')}
            </span>
          </>
        ) : (
          <>
            <span>
              {t('home.widget.streak.wins')} {t('home.widget.streak.in-a-row')}
            </span>
            <span className="journalit-wpd-muted">
              {t('home.widget.streak.keep-going')}
            </span>
          </>
        )}
      </div>
    </Mini>
  ),
  bestHours: () => (
    <Mini>
      <Eyebrow>{t('home.widget.best-hours.title')}</Eyebrow>
      <div className="journalit-wpd-center">
        <span className="journalit-wpd-hero journalit-wpd-hero--sm">
          9:30am-10am
        </span>
        <span className="journalit-wpd-strong journalit-wpd-tone--pos">
          $62.03
        </span>
      </div>
      <div className="journalit-wpd-timeline">
        {[4, 2, 2, 1, 2].map((level, index) => (
          <span
            key={index}
            className={`journalit-wpd-heat journalit-wpd-heat--${level}`}
          />
        ))}
      </div>
      <div className="journalit-wpd-row-split journalit-wpd-faint">
        <span>9:30am</span>
        <span>10am</span>
        <span>11am</span>
        <span>12pm</span>
      </div>
    </Mini>
  ),
  setupLeaderboard: (instance) => (
    <Mini>
      <Eyebrow>
        {instance?.label ??
          t('home.widget.top-breakdown.title', {
            dimension: t('tradelog.column.setups'),
          })}
      </Eyebrow>
      <div className="journalit-wpd-rank-rows">
        {(
          [
            ['Opening Range Breakout', 100, '$4,253.95'],
            ['Range Reversal', 80, '$3,408.74'],
            ['Failed Breakout', 72, '$3,064.17'],
          ] as const
        ).map(([name, pct, value]) => (
          <div key={name} className="journalit-wpd-rank-row">
            <span className="journalit-wpd-text journalit-wpd-ellipsis">
              {name}
            </span>
            <ProgressBar pct={pct} tone="pos" />
            <span className="journalit-wpd-strong journalit-wpd-tone--pos">
              {value}
            </span>
          </div>
        ))}
      </div>
    </Mini>
  ),
  unreviewedTrades: () => (
    <Mini className="journalit-wpd-mini--centered journalit-wpd-mini--large">
      <span className="journalit-wpd-inline">
        <span className="journalit-wpd-dot-marker journalit-wpd-tone--warn" />
        <span className="journalit-wpd-text journalit-wpd-text--lg">
          {t('home.widget.unreviewed.need-review.other', { count: '48' })}
        </span>
        <Chevron />
      </span>
      <span className="journalit-wpd-faint">
        {t('home.widget.unreviewed.this-week', { count: '5' })}
      </span>
    </Mini>
  ),
  goalsProgress: (instance) => (
    <Mini>
      <Eyebrow aside={<Chevron />}>
        {instance?.label ?? t('home.widget.goals-progress.header.pnl')}
      </Eyebrow>
      <div className="journalit-wpd-center journalit-wpd-center--wide">
        <span className="journalit-wpd-hero journalit-wpd-tone--pos">
          $3,240
        </span>
        <span className="journalit-wpd-muted">
          {t('home.widget.goals-progress.of-target', {
            target: '$5,000',
            period: t('home.widget.goals-progress.period-label.this-month'),
          })}
        </span>
        <ProgressBar pct={65} tone="pos" />
        <span className="journalit-wpd-tone--pos">
          {t('home.widget.goals-progress.complete-percent', { percent: '65' })}
        </span>
      </div>
    </Mini>
  ),
  tradingScore: () => (
    <Mini>
      <Eyebrow
        aside={
          <span className="journalit-wpd-icon-pair">
            <Info size="1em" />
            <Chevron />
          </span>
        }
      >
        {t('home.widget.trading-score.name')}
      </Eyebrow>
      <div className="journalit-wpd-score">
        <Radar values={[0.55, 0.95, 0.9, 0.6, 0.45, 0.95]} />
        <span className="journalit-wpd-hero journalit-wpd-tone--pos">70</span>
        <span className="journalit-wpd-faint">
          <span className="journalit-wpd-tone--accent">
            {t('widget.trading-score.phase.established')}
          </span>{' '}
          · 91w
        </span>
      </div>
    </Mini>
  ),
  aum: () => (
    <Mini className="journalit-wpd-aum">
      <Eyebrow aside={t('home.widget.aum.period.all')}>
        {t('home.widget.aum.title')}
      </Eyebrow>
      <svg
        className="journalit-wpd-aum-spark journalit-wpd-tone--pos"
        viewBox="0 0 100 30"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <polyline
          className="journalit-wpd-line"
          vectorEffect="non-scaling-stroke"
          points="0,26 20,26 25,21 45,21 55,20 62,18 70,15 76,12 84,13 90,10 100,4"
        />
      </svg>
      <div className="journalit-wpd-row-split journalit-wpd-row-split--end">
        <span className="journalit-wpd-stack-col">
          <span className="journalit-wpd-hero">$236K</span>
          <span className="journalit-wpd-muted">
            {t('home.widget.aum.account-count-plural', { count: '5' })}
          </span>
        </span>
        <span className="journalit-wpd-stack-col journalit-wpd-align-end journalit-wpd-tone--pos">
          <span className="journalit-wpd-strong journalit-wpd-text--lg">
            ↗ +24.3%
          </span>
          <span>$46,117.27</span>
        </span>
      </div>
    </Mini>
  ),
  drawdownMonitor: () => (
    <Mini>
      <Eyebrow>{t('home.widget.drawdown.title')}</Eyebrow>
      <LimitRows
        rows={[
          {
            name: 'Apex 50K',
            value: '22%',
            tone: 'pos',
            filled: 4,
            remaining: `$1,950 ${t('home.widget.drawdown.remaining')}`,
          },
          {
            name: 'FTMO 100K',
            value: '68%',
            tone: 'warn',
            filled: 12,
            remaining: `$3,200 ${t('home.widget.drawdown.remaining')}`,
          },
        ]}
      />
    </Mini>
  ),
  profitTarget: () => (
    <Mini>
      <Eyebrow>{t('home.widget.profit-target.title')}</Eyebrow>
      <LimitRows
        rows={[
          {
            name: 'Apex 50K',
            value: '64%',
            tone: 'accent',
            filled: 12,
            remaining: `$1,080 ${t('home.widget.profit-target.remaining')}`,
          },
          {
            name: 'FTMO 100K',
            value: t('home.widget.profit-target.achieved').toUpperCase(),
            tone: 'pos',
            filled: 18,
            remaining: `$0 ${t('home.widget.profit-target.remaining')}`,
          },
        ]}
      />
    </Mini>
  ),
  evalRoi: () => (
    <Mini>
      <Eyebrow
        aside={`${t('home.widget.eval-roi.challenge-count-plural', { count: '3' })} · ${t('home.widget.aum.period.all')}`}
      >
        {t('home.widget.eval-roi.title')}
      </Eyebrow>
      <div className="journalit-wpd-roi">
        <div className="journalit-wpd-roi-gauge">
          <Gauge ratio={0.78} tone="pos" />
          <span className="journalit-wpd-strong journalit-wpd-tone--pos">
            +142%
          </span>
        </div>
        <div className="journalit-wpd-ledger">
          <span className="journalit-wpd-row-split">
            <span>{t('home.widget.eval-roi.spent')}</span>
            <span className="journalit-wpd-muted">$1,480</span>
          </span>
          <span className="journalit-wpd-row-split">
            <span>{t('home.widget.eval-roi.payouts')}</span>
            <span>$3,580</span>
          </span>
          <span className="journalit-wpd-row-split journalit-wpd-ledger-net">
            <span>{t('home.widget.eval-roi.net')}</span>
            <span className="journalit-wpd-tone--pos">$2,100</span>
          </span>
        </div>
      </div>
    </Mini>
  ),
  challengeAlerts: () => (
    <Mini>
      <Eyebrow
        aside={t('home.widget.challenge-alerts.count-plural', { count: '3' })}
      >
        {t('home.widget.challenge-alerts.title')}
      </Eyebrow>
      <div className="journalit-wpd-list">
        {(
          [
            ['Apex 50K', 'home.widget.challenge-alerts.kind.target', 'pos'],
            ['FTMO 100K', 'home.widget.challenge-alerts.kind.payout', 'accent'],
            ['Topstep 50K', 'home.widget.challenge-alerts.kind.failed', 'neg'],
          ] as const
        ).map(([account, kind, tone]) => (
          <div key={account} className="journalit-wpd-alert-row">
            <span className={`journalit-wpd-dot-marker ${toneClass(tone)}`} />
            <span className="journalit-wpd-strong">{account}</span>
            <span className="journalit-wpd-muted journalit-wpd-ellipsis journalit-wpd-grow">
              {t(kind)}
            </span>
            <Chevron />
          </div>
        ))}
      </div>
    </Mini>
  ),
};
