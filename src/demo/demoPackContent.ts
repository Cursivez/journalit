import type { SetupData } from '../services/setup/types';
import { calculatePnL } from '../utils/pnlCalculation';
import {
  SETUP_NAMES,
  addCalendarDays,
  atZonedTime,
  endOfDay,
  type CompiledDemoEntity,
  type DemoMediaRecipe,
  type DemoReviewRecipe,
  type DemoSupportNote,
  type DemoTradeData,
} from './demoPackCore';

export function createSetups(
  instanceId: string,
  root: string
): Array<CompiledDemoEntity<SetupData>> {
  return SETUP_NAMES.map((name, index) => ({
    entityId: `setup-${index + 1}`,
    data: {
      name,
      status: 'active',
      tags: [index % 2 === 0 ? 'Trend Day' : 'Range Day'],
      preferredSessions: ['regular-session'],
      preferredTimeframes: ['5m', '15m'],
      preferredTickers: index < 2 ? ['MES', 'MNQ'] : ['AAPL', 'MSFT'],
      direction: index % 2 === 0 ? 'both' : 'long',
      playbookMarkdown: [
        `Use ${name} only when the market context supports the premise.`,
        '',
        '**Entry:** wait for the stated trigger and confirmation.',
        '**Exit:** scale only when the planned target is reached.',
        '**Invalidation:** leave when the original premise is no longer true.',
        '**Common mistakes:** entering early, widening risk, or grading the decision only by its outcome.',
        ...(index === 0
          ? ['', `![[${root}/Media/sample-chart-09.svg]]`]
          : index === 2
            ? ['', `![[${root}/Media/sample-chart-10.svg]]`]
            : []),
      ].join('\n\n'),
      rules: [
        {
          id: `rule_${index + 1}_context`,
          label: 'Context matches the playbook',
          description: 'The session condition supports the setup.',
          required: true,
          category: 'context',
          groupId: 'group_context',
          order: 0,
        },
        {
          id: `rule_${index + 1}_entry`,
          label: 'Entry confirmation is present',
          description: 'Do not anticipate the trigger.',
          required: true,
          category: 'entry',
          groupId: 'group_entry',
          order: 1,
        },
        {
          id: `rule_${index + 1}_risk`,
          label: 'Risk and invalidation are defined',
          required: true,
          category: 'risk',
          groupId: 'group_risk',
          order: 2,
        },
      ],
      ruleGroups: [
        { id: 'group_context', name: 'Conditions', order: 0 },
        { id: 'group_entry', name: 'Entry', order: 1 },
        { id: 'group_risk', name: 'Risk and invalidation', order: 2 },
      ],
      linkedNotes: [],
      journalitSampleInstance: instanceId,
      journalitSampleEntityId: `setup-${index + 1}`,
    },
  }));
}

export function createMedia(root: string): DemoMediaRecipe[] {
  const definitions: Array<Omit<DemoMediaRecipe, 'entityId' | 'path'>> = [
    {
      title: 'Trend pullback entry',
      description: 'Illustrative sample entry after a pullback holds.',
      points: [48, 50, 53, 51, 52, 56, 59, 61, 64, 66],
      entryIndex: 4,
      exitIndexes: [],
      tone: 'win',
    },
    {
      title: 'Trend pullback exits',
      description: 'Illustrative sample with two planned exits.',
      points: [52, 54, 57, 60, 64, 67, 65, 70, 72, 74],
      entryIndex: 0,
      exitIndexes: [4, 8],
      tone: 'win',
    },
    {
      title: 'Valid losing pullback entry',
      description: 'Illustrative sample entry that met the setup rules.',
      points: [66, 64, 63, 65, 62, 60, 59, 57, 56, 55],
      entryIndex: 3,
      exitIndexes: [],
      tone: 'loss',
    },
    {
      title: 'Valid losing pullback exit',
      description:
        'Illustrative sample planned stop without a process mistake.',
      points: [65, 63, 61, 60, 58, 57, 55, 54, 53, 52],
      entryIndex: 0,
      exitIndexes: [6],
      tone: 'loss',
    },
    {
      title: 'Chased breakout entry',
      description: 'Illustrative sample showing an entry before confirmation.',
      points: [44, 46, 49, 54, 58, 57, 62, 65, 68, 70],
      entryIndex: 3,
      exitIndexes: [],
      tone: 'neutral',
    },
    {
      title: 'Chased breakout result',
      description: 'Illustrative profit despite lower decision quality.',
      points: [54, 56, 59, 63, 66, 69, 67, 71, 73, 75],
      entryIndex: 0,
      exitIndexes: [8],
      tone: 'win',
    },
    {
      title: 'Premature exit study',
      description: 'Illustrative sample exit before the favourable excursion.',
      points: [50, 52, 55, 57, 56, 61, 66, 70, 74, 78],
      entryIndex: 0,
      exitIndexes: [3],
      tone: 'neutral',
    },
    {
      title: 'Failed breakout loss',
      description: 'Illustrative sample losing trade with controlled risk.',
      points: [58, 61, 64, 62, 59, 56, 54, 53, 51, 50],
      entryIndex: 2,
      exitIndexes: [7],
      tone: 'loss',
    },
    {
      title: 'Opening range setup',
      description: 'Illustrative sample setup diagram for the opening range.',
      points: [45, 46, 47, 46, 48, 55, 58, 60, 59, 63],
      entryIndex: 5,
      exitIndexes: [9],
      tone: 'neutral',
    },
    {
      title: 'Range reversal setup',
      description: 'Illustrative sample reversal from a defined range edge.',
      points: [68, 70, 72, 70, 66, 62, 59, 57, 55, 54],
      entryIndex: 3,
      exitIndexes: [8],
      tone: 'neutral',
    },
    {
      title: 'Session forecast',
      description:
        'Illustrative sample forecast with key levels, not live data.',
      points: [52, 52, 53, 55, 54, 56, 58, 57, 60, 61],
      tone: 'neutral',
    },
    {
      title: 'Weekly review curve',
      description:
        'Illustrative sample review chart generated from the sample story.',
      points: [50, 53, 51, 56, 54, 60, 58, 63, 66, 65],
      tone: 'neutral',
    },
  ];

  return definitions.map((definition, index) => ({
    ...definition,
    entityId: `media-${index + 1}`,
    path: `${root}/Media/sample-chart-${String(index + 1).padStart(2, '0')}.svg`,
  }));
}

export function createSupportNotes(
  root: string,
  latestSession: Date
): DemoSupportNote[] {
  const dateLabel = latestSession.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  });
  return [
    {
      entityId: 'support-start-here',
      path: `${root}/Start Here.md`,
      title: 'Start Here',
      body: [
        '# Start Here',
        '',
        'This is an editable fictional journal. Every account, trade, chart and review is synthetic.',
        '',
        '## Suggested routine',
        '',
        '1. Open **Home** and use the Daily Routine layout.',
        '2. Open **Trading Dashboard** to inspect the recent populated range.',
        '3. Open **Trade Log**, edit a trade, and mark an unfinished review complete.',
        '4. Use the sample menu to exit, reset, or remove the sample journal.',
        '',
        `Latest populated session when this instance was created: **${dateLabel}**.`,
        '',
        'The chart paths are illustrative and are not historical prices for their assigned dates.',
        '',
        `![[${root}/Media/sample-chart-11.svg]]`,
      ].join('\n'),
    },
    {
      entityId: 'support-checklist',
      path: `${root}/Practice Checklist.md`,
      title: 'Practice Checklist',
      body: [
        '# Practice Checklist',
        '',
        '- [ ] Wait for the planned trigger',
        '- [ ] Confirm invalidation before entry',
        '- [ ] Record deviations separately from outcomes',
        '- [ ] Complete the next-period action in the review',
      ].join('\n'),
    },
  ];
}

function netPnlForDates(
  trades: Array<CompiledDemoEntity<DemoTradeData>>,
  start: Date,
  end: Date
): number {
  return trades.reduce((sum, trade) => {
    const entry = trade.data.entryTime;
    if (entry < start || entry > end || trade.data.tradeStatus === 'OPEN') {
      return sum;
    }
    return sum + calculatePnL(trade.data);
  }, 0);
}

function formatSignedCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    signDisplay: 'always',
  }).format(value);
}

export function createReviews(options: {
  root: string;
  timezone: string;
  anchorInstant: Date;
  latestSession: Date;
  recentSessions: Date[];
  trades: Array<CompiledDemoEntity<DemoTradeData>>;
  weekStartDay: 'monday' | 'sunday';
}): DemoReviewRecipe[] {
  const reviews: DemoReviewRecipe[] = [];
  const selectedDailySessions = options.recentSessions.slice(-32);
  const gapIndexes = new Set([5, 14, 25, 30]);
  selectedDailySessions.forEach((date, index) => {
    if (gapIndexes.has(index)) return;
    const isRecentDraft = index >= selectedDailySessions.length - 5;
    const completed = !isRecentDraft && index % 6 !== 0;
    const dayStart = atZonedTime(date, options.timezone, 0, 0);
    const dayEnd = endOfDay(date, options.timezone);
    const pnl = netPnlForDates(options.trades, dayStart, dayEnd);
    const completedAt = completed
      ? atZonedTime(date, options.timezone, 18, 20)
      : undefined;
    reviews.push({
      entityId: `review-drc-${index + 1}`,
      type: 'drc',
      date,
      templateId: 'sample-drc-review',
      completed,
      completedAt: completedAt?.toISOString(),
      answers: {
        reflection:
          index === selectedDailySessions.length - 9
            ? 'I followed the pullback rules on the losing trade. The loss itself does not call for a rule change. The later breakout was profitable, but I entered before confirmation. Next session I will wait for the close before entering.'
            : completed
              ? `Net result was ${formatSignedCurrency(pnl)}. I graded the process separately from the outcome and recorded one specific action for the next session.`
              : `Draft: ${formatSignedCurrency(pnl)} so far. Finish the checklist and write the next-session action.`,
      },
      customFields: {
        trading_focus:
          index >= selectedDailySessions.length - 8
            ? 'Wait for candle-close confirmation; add a brief note when the context changes.'
            : 'Follow the planned trigger and invalidation.',
        ...(index % 4 !== 0 ? { energy_level: 1 + (index % 5) } : {}),
      },
    });
  });

  const currentWeekStart = addCalendarDays(
    options.latestSession,
    options.weekStartDay === 'sunday'
      ? -options.latestSession.getUTCDay()
      : -(options.latestSession.getUTCDay() === 0
          ? 6
          : options.latestSession.getUTCDay() - 1)
  );
  const historicalWeeklyAnchors = options.recentSessions.filter(
    (date) => date.getUTCDay() === 5 && date < currentWeekStart
  );
  const weeklyAnchors = [
    ...historicalWeeklyAnchors.slice(-7),
    options.latestSession,
  ];
  weeklyAnchors.forEach((date, index, values) => {
    const weekStart = addCalendarDays(
      date,
      options.weekStartDay === 'sunday'
        ? -date.getUTCDay()
        : -(date.getUTCDay() === 0 ? 6 : date.getUTCDay() - 1)
    );
    const weekEnd = endOfDay(addCalendarDays(weekStart, 6), options.timezone);
    const pnl = netPnlForDates(
      options.trades,
      atZonedTime(weekStart, options.timezone, 0, 0),
      weekEnd
    );
    const completed = index < values.length - 1;
    reviews.push({
      entityId: `review-weekly-${index + 1}`,
      type: 'weekly',
      date,
      templateId: 'sample-weekly-review',
      completed,
      completedAt: completed
        ? atZonedTime(date, options.timezone, 19, 10).toISOString()
        : undefined,
      answers: {
        'weekly-reflection': completed
          ? `The week finished at ${formatSignedCurrency(pnl)}. Late entries appeared more than once, including one profitable deviation. Next week the focus is candle-close confirmation. One daily reflection is intentionally missing; totals still include its trades.\n\n![[${options.root}/Media/sample-chart-12.svg]]`
          : `To date: ${formatSignedCurrency(pnl)}. Draft the final process lesson after the remaining daily review is complete.`,
      },
      customFields: {
        trading_focus: 'Wait for candle-close confirmation.',
      },
    });
  });

  const completedMonth = new Date(
    Date.UTC(
      options.latestSession.getUTCFullYear(),
      options.latestSession.getUTCMonth() - 1,
      15
    )
  );
  const currentMonth = new Date(options.latestSession);
  for (let offset = 3; offset >= 0; offset -= 1) {
    const date = new Date(
      Date.UTC(
        completedMonth.getUTCFullYear(),
        completedMonth.getUTCMonth() - offset,
        15
      )
    );
    const monthStart = new Date(
      Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), 1)
    );
    const monthEnd = endOfDay(
      new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + 1, 0)),
      options.timezone
    );
    const pnl = netPnlForDates(
      options.trades,
      atZonedTime(monthStart, options.timezone, 0, 0),
      monthEnd
    );
    reviews.push({
      entityId: `review-monthly-${4 - offset}`,
      type: 'monthly',
      date,
      templateId: 'sample-monthly-review',
      completed: true,
      completedAt: new Date(
        Math.min(
          atZonedTime(
            new Date(
              Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + 1, 2)
            ),
            options.timezone,
            18,
            0
          ).getTime(),
          options.anchorInstant.getTime()
        )
      ).toISOString(),
      answers: {
        'monthly-summary': `Completed month: ${formatSignedCurrency(pnl)}. Trend Pullback remained the clearest playbook; the process focus for the next month is confirmation before entry.`,
      },
      customFields: { trading_focus: 'Wait for confirmation before entry.' },
    });
  }
  reviews.push({
    entityId: 'review-monthly-current',
    type: 'monthly',
    date: currentMonth,
    templateId: 'sample-monthly-review',
    completed: false,
    answers: {
      'monthly-summary':
        'Current-month draft. Review the remaining daily notes before choosing the next focus.',
    },
    customFields: { trading_focus: 'Wait for confirmation before entry.' },
  });

  const currentQuarter = Math.floor(options.latestSession.getUTCMonth() / 3);
  const previousQuarterDate = new Date(
    Date.UTC(
      options.latestSession.getUTCFullYear(),
      (currentQuarter - 1) * 3 + 1,
      15
    )
  );
  reviews.push(
    {
      entityId: 'review-quarterly-previous',
      type: 'quarterly',
      date: previousQuarterDate,
      templateId: 'sample-quarterly-review',
      completed: true,
      completedAt: new Date(
        Math.min(
          atZonedTime(
            new Date(
              Date.UTC(
                previousQuarterDate.getUTCFullYear(),
                previousQuarterDate.getUTCMonth() + 2,
                3
              )
            ),
            options.timezone,
            18,
            0
          ).getTime(),
          options.anchorInstant.getTime()
        )
      ).toISOString(),
      answers: {
        'quarter-plan':
          'Completed quarter: keep the four playbooks, reduce anticipatory entries, and compare process adherence before changing any setup rule.',
      },
    },
    {
      entityId: 'review-quarterly-current',
      type: 'quarterly',
      date: options.latestSession,
      templateId: 'sample-quarterly-review',
      completed: false,
      answers: {
        'quarter-plan':
          'Quarter-to-date draft. The evaluation example remains inside its illustrative drawdown constraint.',
      },
    }
  );

  const priorYear = options.latestSession.getUTCFullYear() - 1;
  reviews.push(
    {
      entityId: 'review-yearly-prior',
      type: 'yearly',
      date: new Date(Date.UTC(priorYear, 6, 1)),
      templateId: 'sample-yearly-review',
      completed: true,
      completedAt: atZonedTime(
        new Date(Date.UTC(priorYear + 1, 0, 1)),
        options.timezone,
        12,
        0
      ).toISOString(),
      answers: {
        'year-plan':
          'Completed prior-year review: simplify the playbook set, keep losses that followed the rules, and address late entries with an observable confirmation step.',
      },
    },
    {
      entityId: 'review-yearly-current',
      type: 'yearly',
      date: options.latestSession,
      templateId: 'sample-yearly-review',
      completed: false,
      answers: {
        'year-plan':
          'Year-to-date progress review. This period is intentionally unfinished and does not pretend the year has elapsed.',
      },
    }
  );
  return reviews;
}
