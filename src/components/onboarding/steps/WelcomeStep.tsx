

import React, { useMemo } from 'react';
import { Button } from '../../ui/Button';
import { SharedPnLChart } from '../../charts/SharedPnLChart';
import type { PnLChartDataPoint } from '../../../utils/chartUtils';
import { t } from '../../../lang/helpers';

interface WelcomeStepProps {
  onNext: () => void;
  onSkip: () => void;
}

export const WelcomeStep: React.FC<WelcomeStepProps> = ({ onNext, onSkip }) => {
  const demoData = useMemo<PnLChartDataPoint[]>(
    () => [
      {
        date: t('onboarding.welcome.chart.week', { count: '1' }),
        dateKey: 'demo-1',
        pnl: 0,
        tradePnL: 0,
        cumulativeR: 0,
        tradeR: 0,
      },
      {
        date: t('onboarding.welcome.chart.week', { count: '2' }),
        dateKey: 'demo-2',
        pnl: 250,
        tradePnL: 250,
        cumulativeR: 0.5,
        tradeR: 0.5,
      },
      {
        date: t('onboarding.welcome.chart.week', { count: '3' }),
        dateKey: 'demo-3',
        pnl: 500,
        tradePnL: 250,
        cumulativeR: 1.0,
        tradeR: 0.5,
      },
      {
        date: t('onboarding.welcome.chart.week', { count: '4' }),
        dateKey: 'demo-4',
        pnl: 300,
        tradePnL: -200,
        cumulativeR: 0.6,
        tradeR: -0.4,
      },
      {
        date: t('onboarding.welcome.chart.week', { count: '5' }),
        dateKey: 'demo-5',
        pnl: 750,
        tradePnL: 450,
        cumulativeR: 1.5,
        tradeR: 0.9,
      },
      {
        date: t('onboarding.welcome.chart.week', { count: '6' }),
        dateKey: 'demo-6',
        pnl: 1100,
        tradePnL: 350,
        cumulativeR: 2.2,
        tradeR: 0.7,
      },
      {
        date: t('onboarding.welcome.chart.week', { count: '7' }),
        dateKey: 'demo-7',
        pnl: 1400,
        tradePnL: 300,
        cumulativeR: 2.8,
        tradeR: 0.6,
      },
      {
        date: t('onboarding.welcome.chart.week', { count: '8' }),
        dateKey: 'demo-8',
        pnl: 1800,
        tradePnL: 400,
        cumulativeR: 3.6,
        tradeR: 0.8,
      },
    ],
    []
  );

  return (
    <div className="welcome-step-container">
      <div className="welcome-content">
        <div className="welcome-left">
          <h1>{t('onboarding.welcome.title')}</h1>
          <p className="welcome-subtitle">{t('onboarding.welcome.subtitle')}</p>
          <div className="welcome-actions">
            <Button variant="primary" size="large" onClick={onNext}>
              {t('onboarding.welcome.cta')}
            </Button>
          </div>
        </div>

        <div className="welcome-right">
          <div className="chart-container">
            <SharedPnLChart
              data={demoData}
              height="100%"
              width="100%"
              showTooltip={true}
            />
          </div>
        </div>
      </div>

      <Button
        variant="text"
        size="small"
        onClick={onSkip}
        className="skip-button"
        aria-label={t('onboarding.wizard.skip-aria')}
      >
        {t('onboarding.wizard.skip-onboarding')}
      </Button>
    </div>
  );
};
