

import { App, Modal } from 'obsidian';
import React, { useState } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { t } from '../../../../lang/helpers';
import { FastDateTimeInput } from '../../../core/FastDateTimeInput';
import { Button } from '../../../ui/Button';

interface TransitionModalOptions {
  title: string;
  
  context?: string;
  targetReachedAt?: Date;
  startedAt?: Date;
  defaultAt?: Date;
  promotionAccountType?: string;
}

function parseInputDate(value: Date | string | undefined): Date | undefined {
  if (!value) return undefined;
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date;
}


export const PropChallengeTransitionModalContent: React.FC<{
  context?: string;
  targetReachedAt?: Date;
  startedAt?: Date;
  defaultAt?: Date;
  promotionAccountType?: string;
  onConfirm: (date: Date) => void;
  onCancel: () => void;
}> = ({
  context,
  targetReachedAt,
  startedAt,
  defaultAt,
  promotionAccountType,
  onConfirm,
  onCancel,
}) => {
  const [at, setAt] = useState(
    () => defaultAt ?? targetReachedAt ?? new Date()
  );

  return (
    <>
      {context && (
        <p className="journalit-prop-transition-modal__context">{context}</p>
      )}
      <div className="journalit-prop-transition-modal__field">
        <FastDateTimeInput
          label={t('account.prop-challenge.transition.time')}
          value={at}
          includeTime
          minDate={startedAt}
          onChange={(value) => {
            const next = parseInputDate(value);
            if (next) setAt(next);
          }}
        />
      </div>
      <div className="journalit-prop-transition-modal__shortcuts">
        <Button variant="plain" size="small" onClick={() => setAt(new Date())}>
          {t('account.prop-challenge.transition.now')}
        </Button>
        {targetReachedAt && (
          <Button
            variant="plain"
            size="small"
            onClick={() => setAt(targetReachedAt)}
          >
            {t('account.prop-challenge.transition.when-target-reached')}
          </Button>
        )}
      </div>
      {promotionAccountType && (
        <p className="journalit-prop-transition-modal__promotion">
          {t('account.prop-challenge.confirm.advance-with-promotion', {
            accountType: promotionAccountType,
          })}
        </p>
      )}
      <div className="journalit-prop-transition-modal__actions">
        <Button variant="plain" onClick={onCancel}>
          {t('button.cancel')}
        </Button>
        <Button
          variant="primary"
          
          
          
          
          onClick={() => onConfirm(at.getTime() > Date.now() ? new Date() : at)}
        >
          {t('button.confirm')}
        </Button>
      </div>
    </>
  );
};

class PropChallengeTransitionModal extends Modal {
  private root: Root | null = null;
  private settled = false;

  constructor(
    app: App,
    private options: TransitionModalOptions,
    private resolveChoice: (value: Date | null) => void
  ) {
    super(app);
    this.titleEl.setText(options.title);
    this.modalEl.addClass('journalit-prop-transition-modal');
  }

  onOpen(): void {
    const { contentEl } = this;
    contentEl.empty();
    const container = contentEl.createDiv({
      cls: 'journalit-prop-transition-modal__body',
    });
    this.root = createRoot(container);
    this.root.render(
      <PropChallengeTransitionModalContent
        context={this.options.context}
        targetReachedAt={this.options.targetReachedAt}
        startedAt={this.options.startedAt}
        defaultAt={this.options.defaultAt}
        promotionAccountType={this.options.promotionAccountType}
        onConfirm={(date) => this.settle(date)}
        onCancel={() => this.settle(null)}
      />
    );
  }

  onClose(): void {
    this.root?.unmount();
    this.root = null;
    if (this.settled) return;
    this.settled = true;
    this.resolveChoice(null);
  }

  private settle(value: Date | null): void {
    if (this.settled) return;
    this.settled = true;
    this.resolveChoice(value);
    this.close();
  }
}

export function openPropChallengeTransitionModal(
  app: App,
  options: TransitionModalOptions
): Promise<Date | null> {
  return new Promise((resolve) => {
    const modal = new PropChallengeTransitionModal(app, options, resolve);
    modal.open();
  });
}
