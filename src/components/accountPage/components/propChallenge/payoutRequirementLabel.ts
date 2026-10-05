import { t } from '../../../../lang/helpers';


export function payoutRequirementLabel(kind: string): string {
  switch (kind) {
    case 'qualifying_days':
      return t('account.prop-challenge.payout.requirement.qualifying-days');
    case 'cycle_days':
      return t('account.prop-challenge.payout.requirement.days');
    case 'cycle_profit':
      return t('account.prop-challenge.payout.requirement.cycle-profit');
    case 'minimum_balance':
      return t('account.prop-challenge.payout.requirement.minimum-balance');
    case 'positive_cycle_profit':
      return t(
        'account.prop-challenge.payout.requirement.positive-cycle-profit'
      );
    case 'consistency':
      return t('account.prop-challenge.payout.requirement.consistency');
    case 'minimum_request':
      return t('account.prop-challenge.payout.requirement.minimum');
    case 'payout_count':
      return t('account.prop-challenge.payout.requirement.payouts');
    case 'request_window':
      return t('account.prop-challenge.payout.requirement.request-window');
    case 'elapsed_hours':
      return t('account.prop-challenge.payout.requirement.elapsed-hours');
    default:
      return kind;
  }
}
