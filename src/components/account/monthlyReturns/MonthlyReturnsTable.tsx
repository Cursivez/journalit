import React, { useEffect, useId, useMemo, useState } from 'react';
import type { AccountData } from '../../../services/account/types';
import { calculateMonthlyReturns } from '../../../services/account/monthlyReturns';
import { useDisplayFormatter } from '../../../hooks/useDisplayPolicy';
import { getCurrentLanguage, t } from '../../../lang/helpers';


export type MonthlyReturnsPeriodHandler = (
  year: number,
  month: number | null
) => void;


const MAX_TIMER_MS = 2 ** 31 - 1;

const monthIndexOf = (date: Date) => date.getFullYear() * 12 + date.getMonth();


function useCurrentMonthIndex(): number {
  const [monthIndex, setMonthIndex] = useState(() => monthIndexOf(new Date()));
  useEffect(() => {
    let timer: number;
    const arm = () => {
      const now = new Date();
      const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
      timer = window.setTimeout(
        () => {
          setMonthIndex(monthIndexOf(new Date()));
          arm();
        },
        Math.min(nextMonth.getTime() - now.getTime() + 1000, MAX_TIMER_MS)
      );
    };
    arm();
    return () => window.clearTimeout(timer);
  }, []);
  return monthIndex;
}

export function MonthlyReturnsTable({
  accounts,
  excludedCurrencies,
  onOpenPeriod,
}: {
  
  accounts: AccountData[];
  
  excludedCurrencies: string[];
  onOpenPeriod: MonthlyReturnsPeriodHandler;
}) {
  const { formatValue, shouldMask } = useDisplayFormatter();
  const titleId = useId();
  const monthIndex = useCurrentMonthIndex();
  
  
  const rows = useMemo(
    () =>
      calculateMonthlyReturns(
        accounts,
        new Date(
          Math.floor(monthIndex / 12),
          (monthIndex % 12) + 1,
          0,
          23,
          59,
          59,
          999
        )
      ),
    [accounts, monthIndex]
  );
  const language = getCurrentLanguage();
  const { monthFormatter, periodFormatter } = useMemo(
    () => ({
      monthFormatter: new Intl.DateTimeFormat(language, {
        month: 'short',
        timeZone: 'UTC',
      }),
      periodFormatter: new Intl.DateTimeFormat(language, {
        month: 'long',
        year: 'numeric',
        timeZone: 'UTC',
      }),
    }),
    [language]
  );
  const masked = shouldMask('returnPercent');
  const exclusionNotice =
    excludedCurrencies.length > 0
      ? t('account.monthly-returns.unconverted', {
          currencies: excludedCurrencies.join(', '),
        })
      : null;

  if (rows.length === 0) {
    return (
      <p className="journalit-monthly-returns-empty">
        <span>{t('account.monthly-returns.empty')}</span>
        <span className="journalit-monthly-returns-empty-hint">
          {exclusionNotice ?? t('account.monthly-returns.empty-sub')}
        </span>
      </p>
    );
  }

  
  
  
  const renderPeriodButton = (
    year: number,
    month: number | null,
    content: React.ReactNode
  ) => (
    <button
      type="button"
      className="journalit-monthly-returns-cell"
      onClick={() => onOpenPeriod(year, month)}
    >
      <span className="journalit-sr-only">
        {t('account.monthly-returns.view-trades', {
          period:
            month === null
              ? String(year)
              : periodFormatter.format(new Date(Date.UTC(year, month, 1))),
        })}
        {': '}
      </span>
      {content}
    </button>
  );
  const renderValue = (
    year: number,
    month: number | null,
    raw: number | null
  ) => {
    
    
    const value = raw === null ? null : Math.round(raw * 100) / 100 || 0;
    const tone =
      masked || value === null
        ? 'is-empty'
        : value > 0
          ? 'is-positive'
          : value < 0
            ? 'is-negative'
            : 'is-flat';
    return (
      <td className={month === null ? `${tone} is-total` : tone}>
        {value === null
          ? masked
            ? formatValue({
                kind: 'returnPercent',
                value: 0,
                precision: 2,
                signed: false,
              })
            : '—'
          : renderPeriodButton(
              year,
              month,
              formatValue({
                kind: 'returnPercent',
                value,
                precision: 2,
                signed: false,
              })
            )}
      </td>
    );
  };

  return (
    <>
      <div
        className="journalit-monthly-returns-scroll"
        tabIndex={0}
        role="region"
        
        
        aria-labelledby={titleId}
      >
        <span id={titleId} className="journalit-sr-only">
          {t('account.monthly-returns.title')}
        </span>
        <table>
          <thead>
            <tr>
              <th scope="col">{t('common.year')}</th>
              {Array.from({ length: 12 }, (_, month) => (
                <th scope="col" key={month}>
                  {monthFormatter.format(new Date(Date.UTC(2024, month, 1)))}
                </th>
              ))}
              <th scope="col" className="is-total">
                {t('account.monthly-returns.total')}
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.year}>
                <th scope="row">
                  {renderPeriodButton(row.year, null, row.year)}
                </th>
                {row.months.map((value, month) => (
                  <React.Fragment key={month}>
                    {renderValue(row.year, month, value)}
                  </React.Fragment>
                ))}
                {renderValue(row.year, null, row.total)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {exclusionNotice && (
        <p className="journalit-monthly-returns-footnote">{exclusionNotice}</p>
      )}
    </>
  );
}
