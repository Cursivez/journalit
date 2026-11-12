

import { Notice, type App } from 'obsidian';
import React, { useMemo, useState } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { t } from '../../../../lang/helpers';
import { DisplayPolicyProvider } from '../../../../contexts/DisplayPolicyContext';
import { useDisplayFormatter } from '../../../../hooks/useDisplayPolicy';
import type { AccountPageService } from '../../../../services/accountPage/AccountPageService';
import type { AccountTransaction } from '../../../../services/account/types';
import type { AccountTradeData } from '../../../../services/accountPage/types';
import {
  latestPropChallengeDrawdownFloor,
  removeLatestPropChallengeDrawdownFloor,
  type TrailingDrawdownRule,
} from '../../../../services/propChallenge/PropChallengeRuleEngine';
import {
  drawdownFloorState,
  planDrawdownFloor,
  planDrawdownFloorRemoval,
  withPropChallengePhase,
  type DrawdownFloorContext,
  type DrawdownFloorProblem,
} from '../../../../services/propChallenge/drawdownFloorPlan';
import { savePropChallengeConfig } from '../../../../services/propChallenge/PropChallengePersistence';
import type {
  PropChallengeConfig,
  PropChallengePhase,
} from '../../../../services/propChallenge/types';
import {
  formatDateDisplay,
  getUserDateFormat,
} from '../../../../utils/dateUtils';
import { Button } from '../../../ui/Button';
import { NumberInput } from '../../../core/NumberInput';
import { JournalitModal } from '../../../modals/JournalitModal';

export interface DrawdownFloorModalOptions {
  app: App;
  accountPageService: AccountPageService;
  accountName: string;
  accountId?: string;
  challenge: PropChallengeConfig;
  
  phase: PropChallengePhase;
  rule: TrailingDrawdownRule;
  trades: readonly AccountTradeData[];
  transactions: readonly AccountTransaction[];
  tradingDayCutoffTime?: string;
  currency: string;
  onSaved: () => void | Promise<void>;
}

function floorContext(
  options: DrawdownFloorModalOptions,
  now: Date
): DrawdownFloorContext {
  return {
    config: options.challenge,
    phase: options.phase,
    rule: options.rule,
    trades: options.trades,
    transactions: options.transactions,
    tradingDayCutoffTime: options.tradingDayCutoffTime,
    now,
  };
}

function problemMessage(
  problem: DrawdownFloorProblem,
  money: (amount: number) => string
): string {
  switch (problem.kind) {
    case 'at-balance':
      return t('account.prop-challenge.floor.error-at-balance', {
        balance: money(problem.balance),
      });
    case 'above-lock':
      return t('account.prop-challenge.floor.error-above-lock', {
        lock: money(problem.lock),
      });
    case 'too-low':
      return t('account.prop-challenge.floor.error-too-low', {
        amount: money(problem.amount),
      });
    case 'below-start':
      return t('account.prop-challenge.floor.error-below-start', {
        floor: money(problem.floor),
      });
  }
}

const DrawdownFloorForm: React.FC<{
  options: DrawdownFloorModalOptions;
  onDone: () => void;
}> = ({ options, onDone }) => {
  const { formatValue } = useDisplayFormatter();
  const [entered, setEntered] = useState<number | undefined>();
  const [isSaving, setIsSaving] = useState(false);
  const [confirmRemoval, setConfirmRemoval] = useState(false);
  const { rule, phase, currency } = options;
  const [now] = useState(() => new Date());
  const money = (amount: number) =>
    formatValue({
      kind: 'money',
      value: amount,
      currencyCode: currency,
      signed: false,
    });

  const context = useMemo(() => floorContext(options, now), [options, now]);
  const current = useMemo(() => drawdownFloorState(context), [context]);
  const existing = latestPropChallengeDrawdownFloor(phase, rule.id);
  const dateFormat = getUserDateFormat();
  
  
  const removalBreach = useMemo(
    () => planDrawdownFloorRemoval(context, current)?.failsAt,
    [context, current]
  );
  const plan = useMemo(
    () =>
      entered === undefined
        ? undefined
        : planDrawdownFloor(context, entered, current),
    [context, entered, current]
  );
  const preview = plan?.after;
  const error = plan?.problem ? problemMessage(plan.problem, money) : undefined;

  const save = async (nextPhase: PropChallengePhase) => {
    setIsSaving(true);
    try {
      await savePropChallengeConfig({
        accountPageService: options.accountPageService,
        accountName: options.accountName,
        accountId: options.accountId,
        config: withPropChallengePhase(options.challenge, nextPhase),
        expectedConfig: options.challenge,
      });
      await options.onSaved();
      onDone();
    } catch (saveError) {
      console.error('Failed to save the drawdown floor:', saveError);
      new Notice(t('account.prop-challenge.actions.error'));
    } finally {
      setIsSaving(false);
    }
  };

  const canSave = preview !== undefined && !error && !isSaving;
  const saveFloor = () => {
    if (entered === undefined || !canSave) return;
    
    void save(
      planDrawdownFloor(floorContext(options, new Date()), entered).phase
    );
  };

  return (
    <form
      className="journalit-drawdown-floor-modal__form"
      onSubmit={(event) => {
        event.preventDefault();
        saveFloor();
      }}
    >
      <NumberInput
        variant="modal"
        label={t('account.prop-challenge.floor.field')}
        value={entered}
        onChange={setEntered}
        placeholder={current.rule ? current.rule.currentFloor.toFixed(2) : ''}
        disabled={isSaving}
        autoFocus
        error={error}
      />
      {preview && !error ? (
        <div className="journalit-prop-payout-detail__lines">
          <div className="journalit-prop-payout-detail__line">
            <span>{t('account.prop-challenge.floor.room')}</span>
            <strong>{money(Math.max(0, preview.remaining))}</strong>
          </div>
        </div>
      ) : null}
      {existing ? (
        <p className="journalit-drawdown-floor-modal__existing">
          <span>
            {t('account.prop-challenge.floor.existing', {
              floor: money(existing.floor),
              date: formatDateDisplay(
                new Date(existing.recordedAt),
                dateFormat
              ),
            })}
          </span>
          <Button
            type="button"
            variant={confirmRemoval ? 'danger' : 'plain'}
            size="small"
            disabled={isSaving}
            onClick={() => {
              if (removalBreach && !confirmRemoval) {
                setConfirmRemoval(true);
                return;
              }
              void save(removeLatestPropChallengeDrawdownFloor(phase, rule.id));
            }}
          >
            {confirmRemoval ? t('button.confirm') : t('button.remove')}
          </Button>
        </p>
      ) : null}
      {confirmRemoval && removalBreach ? (
        <p
          className="journalit-prop-payout-detail__notice is-danger"
          role="alert"
        >
          {t('account.prop-challenge.floor.remove-breach', {
            date: formatDateDisplay(removalBreach, dateFormat),
          })}
        </p>
      ) : null}
      <div className="journalit-modal-actions">
        <Button
          type="button"
          variant="plain"
          disabled={isSaving}
          onClick={onDone}
        >
          {t('button.cancel')}
        </Button>
        <Button
          type="submit"
          variant="primary"
          disabled={!canSave}
          loading={isSaving}
        >
          {t('account.prop-challenge.floor.save')}
        </Button>
      </div>
    </form>
  );
};

class DrawdownFloorModal extends JournalitModal {
  private root: Root | null = null;

  constructor(private options: DrawdownFloorModalOptions) {
    super(options.app);
    this.titleEl.setText(t('account.prop-challenge.floor.title'));
    this.modalEl.addClass('journalit-drawdown-floor-modal');
  }

  onOpen(): void {
    const { contentEl } = this;
    contentEl.empty();
    const container = contentEl.createDiv({
      cls: 'journalit-drawdown-floor-modal__body',
    });
    this.root = createRoot(container);
    
    this.root.render(
      <DisplayPolicyProvider privacyModeOverride={false}>
        <DrawdownFloorForm options={this.options} onDone={() => this.close()} />
      </DisplayPolicyProvider>
    );
  }

  onClose(): void {
    this.root?.unmount();
    this.root = null;
  }
}

export function openDrawdownFloorModal(
  options: DrawdownFloorModalOptions
): void {
  new DrawdownFloorModal(options).open();
}
