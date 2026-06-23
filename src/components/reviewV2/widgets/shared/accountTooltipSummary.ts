import { t } from '../../../../lang/helpers';

const MAX_TOOLTIP_ACCOUNTS = 5;

export const formatAccountTooltipSummary = (
  accounts: Iterable<string>
): string | undefined => {
  const sortedAccounts = Array.from(accounts)
    .flatMap((account) => {
      const normalized = account.trim();
      return normalized ? [normalized] : [];
    })
    .sort();

  if (sortedAccounts.length === 0) return undefined;

  const visibleAccounts = sortedAccounts.slice(0, MAX_TOOLTIP_ACCOUNTS);
  const hiddenCount = sortedAccounts.length - visibleAccounts.length;
  const suffix =
    hiddenCount > 0
      ? `, ${t('chart.tooltip.more-accounts', { count: String(hiddenCount) })}`
      : '';

  return t('chart.tooltip.accounts-list', {
    accounts: `${visibleAccounts.join(', ')}${suffix}`,
  });
};
