import React from 'react';
import { t } from '../../../../lang/helpers';
import {
  PropChallengeField,
  PropChallengeFieldHelp,
  type PropChallengeFieldControlProps,
} from './PropChallengeField';

const FIELD_HELP = {
  'account.prop-challenge.payout-rules.cycle':
    'account.prop-challenge.payout-rules.help.cycle',
  'account.prop-challenge.payout-rules.days':
    'account.prop-challenge.payout-rules.help.days',
  'account.prop-challenge.payout-rules.minimum-daily-profit':
    'account.prop-challenge.payout-rules.help.daily-profit',
  'account.prop-challenge.payout.requirement.qualifying-days':
    'account.prop-challenge.payout-rules.help.qualifying-days',
  'account.prop-challenge.rule.minimum_profitable_days':
    'account.prop-challenge.payout-rules.help.profitable-days',
  'account.prop-challenge.payout-rules.anchor':
    'account.prop-challenge.payout-rules.help.anchor',
  'account.prop-challenge.payout-rules.minimum-elapsed-hours':
    'account.prop-challenge.payout-rules.help.elapsed-hours',
  'account.prop-challenge.payout-rules.request-window':
    'account.prop-challenge.payout-rules.help.request-window',
  'account.prop-challenge.payout-rules.request-window.time-zone':
    'account.prop-challenge.payout-rules.help.time-zone',
  'account.prop-challenge.payout-rules.request-window.allowed-days':
    'account.prop-challenge.payout-rules.help.request-days',
  'account.prop-challenge.payout-rules.minimum-balance':
    'account.prop-challenge.payout-rules.help.minimum-balance',
  'account.prop-challenge.payout-rules.minimum-cycle-profit':
    'account.prop-challenge.payout-rules.help.cycle-profit',
  'account.prop-challenge.payout-rules.minimum-cycle-profit-schedule':
    'account.prop-challenge.payout-rules.help.profit-schedule',
  'account.prop-challenge.payout-rules.schedule-repeat-value':
    'account.prop-challenge.payout-rules.help.repeat-final',
  'account.prop-challenge.payout-rules.schedule-repeat-last':
    'account.prop-challenge.payout-rules.help.repeat-final',
  'account.prop-challenge.payout-rules.positive-cycle-after-first':
    'account.prop-challenge.payout-rules.help.positive-cycle',
  'account.prop-challenge.payout-rules.consistency-percent':
    'account.prop-challenge.payout-rules.help.consistency',
  'account.prop-challenge.payout-rules.consistency-percent-schedule':
    'account.prop-challenge.payout-rules.help.consistency-schedule',
  'account.prop-challenge.payout-rules.availability':
    'account.prop-challenge.payout-rules.help.availability',
  'account.prop-challenge.payout-rules.balance-floor':
    'account.prop-challenge.payout-rules.help.balance-floor',
  'account.prop-challenge.payout-rules.request-percent':
    'account.prop-challenge.payout-rules.help.request-percent',
  'account.prop-challenge.payout-rules.new-profit-percent':
    'account.prop-challenge.payout-rules.new-profit-percent-help',
  'account.prop-challenge.payout-rules.minimum-request':
    'account.prop-challenge.payout-rules.help.minimum-request',
  'account.prop-challenge.payout-rules.maximum':
    'account.prop-challenge.payout-rules.help.maximum',
  'account.prop-challenge.payout-rules.maximum-amount':
    'account.prop-challenge.payout-rules.help.maximum-amount',
  'account.prop-challenge.payout-rules.maximum-first-amount':
    'account.prop-challenge.payout-rules.help.first-maximum',
  'account.prop-challenge.payout-rules.schedule':
    'account.prop-challenge.payout-rules.help.maximum-schedule',
  'account.prop-challenge.payout-rules.maximum-cycle-profit-percent':
    'account.prop-challenge.payout-rules.help.maximum-percent',
  'account.prop-challenge.payout-rules.lifetime-unlock':
    'account.prop-challenge.payout-rules.lifetime-unlock-help',
  'account.prop-challenge.payout-rules.lifetime-unlock-days':
    'account.prop-challenge.payout-rules.help.lifetime-days',
  'account.prop-challenge.payout-rules.lifetime-unlock-availability':
    'account.prop-challenge.payout-rules.help.availability',
  'account.prop-challenge.payout-rules.lifetime-unlock-balance-floor':
    'account.prop-challenge.payout-rules.help.balance-floor',
  'account.prop-challenge.payout-rules.lifetime-unlock-request-percent':
    'account.prop-challenge.payout-rules.help.request-percent',
  'account.prop-challenge.payout-rules.lifetime-unlock-maximum':
    'account.prop-challenge.payout-rules.help.maximum',
  'account.prop-challenge.payout-rules.lifetime-unlock-maximum-amount':
    'account.prop-challenge.payout-rules.help.maximum-amount',
  'account.prop-challenge.payout-rules.lifetime-unlock-maximum-schedule':
    'account.prop-challenge.payout-rules.help.maximum-schedule',
  'account.prop-challenge.payout-rules.lifetime-unlock-maximum-cycle-profit-percent':
    'account.prop-challenge.payout-rules.help.maximum-percent',
  'account.prop-challenge.payout-rules.profit-split-model':
    'account.prop-challenge.payout-rules.help.split-model',
  'account.prop-challenge.payout-rules.profit-split':
    'account.prop-challenge.payout-rules.help.trader-share',
  'account.prop-challenge.payout-rules.profit-split.initial':
    'account.prop-challenge.payout-rules.help.trader-share',
  'account.prop-challenge.payout-rules.profit-split.thereafter':
    'account.prop-challenge.payout-rules.help.trader-share',
  'account.prop-challenge.payout-rules.profit-split.below':
    'account.prop-challenge.payout-rules.help.trader-share',
  'account.prop-challenge.payout-rules.profit-split.at-or-above':
    'account.prop-challenge.payout-rules.help.trader-share',
  'account.prop-challenge.payout-rules.profit-split.threshold-amount':
    'account.prop-challenge.payout-rules.help.cumulative-threshold',
  'account.prop-challenge.payout-rules.profit-split.threshold-profit':
    'account.prop-challenge.payout-rules.profit-split.account-profit-help',
  'account.prop-challenge.payout-rules.maximum-payouts':
    'account.prop-challenge.payout-rules.help.maximum-payouts',
  'account.prop-challenge.payout-rules.maximum-payout-outcome':
    'account.prop-challenge.payout-rules.help.maximum-outcome',
  'account.prop-challenge.payout-rules.aftermath':
    'account.prop-challenge.payout-rules.help.aftermath',
  'account.prop-challenge.payout-rules.drawdown-floor':
    'account.prop-challenge.payout-rules.help.drawdown-floor',
  'account.prop-challenge.payout-rules.first-payout-exempt':
    'account.prop-challenge.payout-rules.help.first-exempt',
  'account.prop-challenge.payout-rules.reset-cycle':
    'account.prop-challenge.payout-rules.help.reset-cycle',
} satisfies Partial<Record<Parameters<typeof t>[0], Parameters<typeof t>[0]>>;

type HelpLabelProps = {
  translationKey: keyof typeof FIELD_HELP;
  labelId: string;
  descriptionId: string;
};

export function PayoutPolicyFieldHelp({
  translationKey,
  labelId,
  descriptionId,
}: HelpLabelProps) {
  return (
    <PropChallengeFieldHelp
      title={t(translationKey)}
      description={t(FIELD_HELP[translationKey])}
      labelId={labelId}
      descriptionId={descriptionId}
    />
  );
}

type FieldProps = Pick<HelpLabelProps, 'translationKey'> &
  PropChallengeFieldControlProps;

export function PayoutPolicyField(props: FieldProps) {
  return (
    <PropChallengeField
      {...props}
      description={t(FIELD_HELP[props.translationKey])}
    />
  );
}
