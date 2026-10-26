import React, { useState } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import type JournalitPlugin from '../../../../main';
import { t } from '../../../../lang/helpers';
import { eventBus } from '../../../../services/events/EventBus';
import { NumberInput } from '../../../core/NumberInput';
import { Button } from '../../../ui/Button';
import { CollapsibleSection } from '../../../shared/CollapsibleSection';
import { JournalitModal } from '../../../modals/JournalitModal';

function BenchmarkEditor({
  value,
  onSave,
  onCancel,
}: {
  value: number | null;
  onSave: (value: number | null) => Promise<void>;
  onCancel: () => void;
}) {
  const [draft, setDraft] = useState(value);
  const [saving, setSaving] = useState(false);
  const [failed, setFailed] = useState(false);
  const valid = draft === null || Number.isFinite(draft);
  return (
    <form
      className="journalit-expectancy-editor"
      onSubmit={(event) => {
        event.preventDefault();
        if (!valid || saving) return;
        setSaving(true);
        setFailed(false);
        void onSave(draft)
          .catch((error: unknown) => {
            console.error('Unable to save expectancy benchmark:', error);
            setFailed(true);
          })
          .finally(() => setSaving(false));
      }}
    >
      <NumberInput
        variant="modal"
        label={t('expectancy-gap.expected')}
        value={draft ?? undefined}
        onChange={(next) => setDraft(next ?? null)}
        disabled={saving}
        autoFocus
        helperText={t('expectancy-gap.benchmark-help')}
        error={!valid ? t('expectancy-gap.invalid') : undefined}
      />
      <CollapsibleSection
        title={t('expectancy-gap.method-title')}
        defaultOpen={false}
      >
        <div className="journalit-expectancy-explanation">
          <div className="journalit-expectancy-formula">
            {t('expectancy-gap.formula')}
          </div>
          <p>{t('expectancy-gap.realized-help')}</p>
          <p>{t('expectancy-gap.interpretation')}</p>
        </div>
      </CollapsibleSection>
      {failed && (
        <div className="journalit-expectancy-error" role="alert">
          {t('expectancy-gap.save-failed')}
        </div>
      )}
      <div className="journalit-modal-actions">
        <Button type="button" disabled={saving} onClick={onCancel}>
          {t('button.cancel')}
        </Button>
        <Button
          type="submit"
          variant="primary"
          disabled={!valid || saving}
          loading={saving}
        >
          {t('button.save')}
        </Button>
      </div>
    </form>
  );
}

export class ExpectancyBenchmarkModal extends JournalitModal {
  private root: Root | null = null;
  readonly value: number | null;

  constructor(
    private readonly plugin: JournalitPlugin,
    private readonly didClose: () => void
  ) {
    super(plugin.app);
    this.value = plugin.settings.dashboard?.expectancyBenchmarkR ?? null;
  }

  onOpen(): void {
    this.modalEl.addClass('journalit-modal', 'journalit-expectancy-modal');
    this.titleEl.setText(t('metric.expectancyGap.name'));
    this.root = createRoot(this.contentEl.createDiv());
    this.root.render(
      <BenchmarkEditor
        value={this.value}
        onCancel={() => this.close()}
        onSave={async (value) => {
          const dashboard = this.plugin.settings.dashboard;
          if (!dashboard) return;
          const previous = dashboard.expectancyBenchmarkR;
          dashboard.expectancyBenchmarkR = value;
          try {
            await this.plugin.saveSettings();
          } catch (error) {
            dashboard.expectancyBenchmarkR = previous;
            throw error;
          }
          this.close();
          eventBus.publish('settings:changed', { section: 'dashboard' });
        }}
      />
    );
  }

  onClose(): void {
    this.root?.unmount();
    this.root = null;
    this.contentEl.empty();
    this.didClose();
  }
}
