

import React, { useMemo, useState } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import type JournalitPlugin from '../../../main';
import type { CustomFieldDefinition } from '../../../types/customFields';
import { t, tPlural } from '../../../lang/helpers';
import { Button } from '../../../components/ui/Button';
import { DropdownSelect } from '../../../components/shared/DropdownSelect';
import { SegmentedControl } from '../../../components/shared/SegmentedControl';
import { StarRating } from '../../../components/shared/StarRating';
import { JournalitModal } from '../../../components/modals/JournalitModal';
import { showConfirmationModal } from '../../../components/shared/ConfirmationModal';
import { cssVars } from '../../../styles/inlineStylePolicy';
import {
  RATING_SCALE_PRESETS,
  countRatingConversion,
  planRatingConversion,
  suggestRating,
  suggestRatingScale,
  summarizeSourceValues,
  type RatingConversionNote,
} from '../../../services/customFieldConversion/ratingConversion';
import {
  CustomFieldConversionService,
  type ConversionRunResult,
  type FieldRemoval,
} from '../../../services/customFieldConversion/CustomFieldConversionService';

const CUSTOM_SCALE = 'custom';

const REMOVAL_MESSAGES = {
  removed: 'settings.customization.custom-fields.convert.removed',
  kept: 'settings.customization.custom-fields.convert.remove-incomplete',
  'delete-failed':
    'settings.customization.custom-fields.convert.remove-field-failed',
} as const satisfies Record<FieldRemoval, string>;

type ConflictChoice = 'keep' | 'overwrite';

type Phase =
  | { kind: 'configure' }
  | { kind: 'running'; step: 'convert' | 'remove'; done: number; total: number }
  | { kind: 'converted'; result: ConversionRunResult }
  | {
      kind: 'removed';
      result: ConversionRunResult & { field: FieldRemoval };
    };

interface ConvertFieldToRatingProps {
  plugin: JournalitPlugin;
  field: CustomFieldDefinition;
  onClose: () => void;
  
  onBusyChange: (busy: boolean) => void;
  
  onFieldRemoved: () => void;
}

function formatScale(scale: number): string {
  return t('settings.customization.custom-fields.convert.scale-out-of', {
    max: String(scale),
  });
}

const ConvertFieldToRating: React.FC<ConvertFieldToRatingProps> = ({
  plugin,
  field,
  onClose,
  onBusyChange,
  onFieldRemoved,
}) => {
  const service = useMemo(
    () => new CustomFieldConversionService(plugin),
    [plugin]
  );
  const [notes, setNotes] = useState<RatingConversionNote[]>(() =>
    service.collectNotes(field)
  );
  const { values, unreadableCount } = useMemo(
    () => summarizeSourceValues(notes),
    [notes]
  );
  const [initialScale] = useState(() =>
    suggestRatingScale(
      field,
      values.map((value) => value.valueKey)
    )
  );
  const [scale, setScale] = useState<number | null>(initialScale);
  const [scaleChoice, setScaleChoice] = useState<string>(() =>
    initialScale !== null &&
    (RATING_SCALE_PRESETS as readonly number[]).includes(initialScale)
      ? String(initialScale)
      : CUSTOM_SCALE
  );
  const [customScale, setCustomScale] = useState(
    initialScale === null ? '' : String(initialScale)
  );
  const [overrides, setOverrides] = useState<
    ReadonlyMap<string, number | null>
  >(() => new Map());
  const [conflictChoice, setConflictChoice] = useState<ConflictChoice>('keep');
  const [phase, setPhase] = useState<Phase>({ kind: 'configure' });

  const mapping = useMemo(() => {
    const result = new Map<string, number | null>();
    for (const { valueKey } of values) {
      result.set(
        valueKey,
        overrides.has(valueKey)
          ? (overrides.get(valueKey) ?? null)
          : scale === null
            ? null
            : suggestRating(valueKey, scale)
      );
    }
    return result;
  }, [values, overrides, scale]);
  const plan = useMemo(
    () => planRatingConversion(notes, mapping),
    [notes, mapping]
  );
  const counts = useMemo(() => countRatingConversion(plan), [plan]);
  const hasNumericValues = initialScale !== null;
  const toWrite =
    counts.convert + (conflictChoice === 'overwrite' ? counts.conflict : 0);
  const fieldLabel = field.label;

  
  
  const applyScale = (next: number | null) => {
    setScale(next);
    setOverrides(new Map());
  };

  const handleScaleChoice = (choice: string) => {
    setScaleChoice(choice);
    if (choice === CUSTOM_SCALE) {
      const parsed = Number(customScale);
      applyScale(Number.isFinite(parsed) && parsed > 0 ? parsed : null);
    } else {
      applyScale(Number(choice));
    }
  };

  const handleCustomScale = (text: string) => {
    setCustomScale(text);
    const parsed = Number(text);
    applyScale(Number.isFinite(parsed) && parsed > 0 ? parsed : null);
  };

  const setValueRating = (valueKey: string, rating: number | null) => {
    setOverrides((current) => new Map(current).set(valueKey, rating));
  };

  const runConvert = async () => {
    setPhase({ kind: 'running', step: 'convert', done: 0, total: toWrite });
    onBusyChange(true);
    const result = await service
      .convert(field, plan, conflictChoice === 'overwrite', (done, total) =>
        setPhase({ kind: 'running', step: 'convert', done, total })
      )
      .finally(() => onBusyChange(false));
    
    const written = new Set(result.written);
    const ratings = new Map(plan.map((note) => [note.path, note.rating]));
    setNotes((current) =>
      current.map((note) =>
        written.has(note.path)
          ? { ...note, tradeRating: ratings.get(note.path) }
          : note
      )
    );
    setPhase({ kind: 'converted', result });
  };

  const runRemove = async () => {
    const keepCount = plan.length - counts.converted;
    const confirmed = await showConfirmationModal(plugin.app, {
      message: [
        {
          text: tPlural(
            'settings.customization.custom-fields.convert.remove-confirm',
            counts.converted,
            { fieldLabel }
          ),
        },
        ...(keepCount > 0
          ? [
              {
                text: tPlural(
                  'settings.customization.custom-fields.convert.remove-keeps',
                  keepCount,
                  { fieldLabel }
                ),
              },
            ]
          : []),
        {
          text: t('settings.customization.custom-fields.convert.remove-views', {
            fieldLabel,
          }),
          destructive: true,
        },
      ],
      confirmLabel: t('settings.customization.custom-fields.convert.remove', {
        fieldLabel,
      }),
      cancelLabel: t('button.cancel'),
      destructive: true,
    });
    if (!confirmed) return;
    setPhase({
      kind: 'running',
      step: 'remove',
      done: 0,
      total: counts.converted,
    });
    onBusyChange(true);
    const result = await service
      .removeConvertedField(field, plan, (done, total) =>
        setPhase({ kind: 'running', step: 'remove', done, total })
      )
      .finally(() => onBusyChange(false));
    setPhase({ kind: 'removed', result });
    if (result.field === 'removed') onFieldRemoved();
  };

  if (phase.kind === 'running') {
    return <ConversionProgress phase={phase} fieldLabel={fieldLabel} />;
  }

  if (phase.kind === 'converted' || phase.kind === 'removed') {
    return (
      <ConversionOutcome
        phase={phase}
        fieldLabel={fieldLabel}
        convertedCount={counts.converted}
        keepCount={plan.length - counts.converted}
        onRemove={() => void runRemove()}
        onClose={onClose}
      />
    );
  }

  if (values.length === 0 && unreadableCount === 0) {
    return (
      <div className="journalit-convert-rating">
        <p className="journalit-convert-rating__muted">
          {t('settings.customization.custom-fields.convert.empty', {
            fieldLabel,
          })}
        </p>
        <div className="journalit-convert-rating__actions">
          <Button variant="primary" onClick={onClose}>
            {t('button.done')}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="journalit-convert-rating">
      <p className="journalit-convert-rating__intro">
        {t('settings.customization.custom-fields.convert.intro', {
          fieldLabel,
        })}
      </p>

      {hasNumericValues && (
        <ScalePicker
          fieldLabel={fieldLabel}
          choice={scaleChoice}
          customScale={customScale}
          onChoice={handleScaleChoice}
          onCustomScale={handleCustomScale}
        />
      )}

      <RatingMappingTable
        fieldLabel={fieldLabel}
        values={values}
        mapping={mapping}
        onChange={setValueRating}
      />
      {unreadableCount > 0 && (
        <p className="journalit-convert-rating__muted">
          {tPlural(
            'settings.customization.custom-fields.convert.unreadable',
            unreadableCount
          )}
        </p>
      )}

      {counts.conflict > 0 && (
        <ConflictChoicePicker
          fieldLabel={fieldLabel}
          conflictCount={counts.conflict}
          value={conflictChoice}
          onChange={setConflictChoice}
        />
      )}

      <div className="journalit-convert-rating__footer">
        <ConversionSummary
          toWrite={toWrite}
          alreadyRated={counts.converted}
          notConverted={
            counts.unmapped +
            counts['read-only'] +
            (conflictChoice === 'keep' ? counts.conflict : 0)
          }
        />
        <div className="journalit-convert-rating__actions">
          <Button variant="plain" onClick={onClose}>
            {t('button.cancel')}
          </Button>
          {toWrite === 0 && counts.converted > 0 ? (
            <Button
              variant="primary"
              onClick={() =>
                setPhase({
                  kind: 'converted',
                  result: {
                    written: [],
                    changed: [],
                    failed: [],
                    fieldChanged: false,
                  },
                })
              }
            >
              {t('settings.customization.custom-fields.convert.continue')}
            </Button>
          ) : (
            <Button
              variant="primary"
              disabled={toWrite === 0}
              onClick={() => void runConvert()}
            >
              {tPlural(
                'settings.customization.custom-fields.convert.submit',
                toWrite
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

const ConversionProgress: React.FC<{
  phase: Extract<Phase, { kind: 'running' }>;
  fieldLabel: string;
}> = ({ phase, fieldLabel }) => (
  <div className="journalit-convert-rating">
    <div
      className="journalit-convert-rating__progress"
      role="status"
      aria-live="polite"
    >
      <div className="journalit-convert-rating__progress-label">
        {t(
          phase.step === 'convert'
            ? 'settings.customization.custom-fields.convert.progress'
            : 'settings.customization.custom-fields.convert.remove-progress',
          {
            done: String(phase.done),
            total: String(phase.total),
            fieldLabel,
          }
        )}
      </div>
      <div className="journalit-convert-rating__progress-track">
        <div
          className="journalit-convert-rating__progress-fill"
          style={cssVars({
            '--journalit-convert-progress': `${phase.total === 0 ? 100 : (phase.done / phase.total) * 100}%`,
          })}
        />
      </div>
    </div>
  </div>
);

const ConversionOutcome: React.FC<{
  phase: Extract<Phase, { kind: 'converted' | 'removed' }>;
  fieldLabel: string;
  
  convertedCount: number;
  
  keepCount: number;
  onRemove: () => void;
  onClose: () => void;
}> = ({ phase, fieldLabel, convertedCount, keepCount, onRemove, onClose }) => {
  const canRemove =
    phase.kind === 'converted' &&
    !phase.result.fieldChanged &&
    convertedCount > 0;
  let message: string | null = null;
  if (phase.kind === 'removed') {
    message = t(REMOVAL_MESSAGES[phase.result.field], { fieldLabel });
  } else if (phase.result.written.length > 0) {
    message = tPlural(
      'settings.customization.custom-fields.convert.done',
      phase.result.written.length
    );
  }
  return (
    <div className="journalit-convert-rating">
      {message !== null && (
        <p className="journalit-convert-rating__result">{message}</p>
      )}
      <ConversionIssues result={phase.result} fieldLabel={fieldLabel} />
      {canRemove && (
        <div className="journalit-convert-rating__next">
          <div className="journalit-convert-rating__next-title">
            {t('settings.customization.custom-fields.convert.remove-title', {
              fieldLabel,
            })}
          </div>
          <div className="journalit-convert-rating__muted">
            {tPlural(
              'settings.customization.custom-fields.convert.remove-desc',
              convertedCount,
              { fieldLabel }
            )}
            {keepCount > 0 &&
              ` ${tPlural('settings.customization.custom-fields.convert.remove-keeps', keepCount, { fieldLabel })}`}
          </div>
        </div>
      )}
      <div className="journalit-convert-rating__actions">
        {canRemove && (
          <Button variant="danger" onClick={onRemove}>
            {t('settings.customization.custom-fields.convert.remove', {
              fieldLabel,
            })}
          </Button>
        )}
        <Button variant="primary" onClick={onClose}>
          {t('button.done')}
        </Button>
      </div>
    </div>
  );
};

const SCALE_OPTIONS_LABEL_ID = 'journalit-convert-rating-scale';

const ScalePicker: React.FC<{
  fieldLabel: string;
  choice: string;
  customScale: string;
  onChoice: (choice: string) => void;
  onCustomScale: (text: string) => void;
}> = ({ fieldLabel, choice, customScale, onChoice, onCustomScale }) => {
  const options = [
    ...RATING_SCALE_PRESETS.map((preset) => ({
      value: String(preset),
      label: formatScale(preset),
    })),
    {
      value: CUSTOM_SCALE,
      label: t('settings.customization.custom-fields.convert.scale-custom'),
    },
  ];
  const label = t('settings.customization.custom-fields.convert.scale-label', {
    fieldLabel,
  });
  const customLabel = t(
    'settings.customization.custom-fields.convert.scale-custom-max'
  );
  return (
    <div className="journalit-convert-rating__scale">
      <span
        id={SCALE_OPTIONS_LABEL_ID}
        className="journalit-convert-rating__scale-label"
      >
        {label}
      </span>
      <DropdownSelect
        value={choice}
        options={options}
        onChange={onChoice}
        ariaLabel={label}
        ariaLabelledBy={SCALE_OPTIONS_LABEL_ID}
        menuWidth="content"
      />
      {choice === CUSTOM_SCALE && (
        <input
          type="number"
          min="1"
          inputMode="decimal"
          className="journalit-convert-rating__scale-input"
          value={customScale}
          aria-label={customLabel}
          placeholder={customLabel}
          onChange={(event) => onCustomScale(event.target.value)}
        />
      )}
    </div>
  );
};

const RatingMappingTable: React.FC<{
  fieldLabel: string;
  values: ReadonlyArray<{ valueKey: string; noteCount: number }>;
  mapping: ReadonlyMap<string, number | null>;
  onChange: (valueKey: string, rating: number | null) => void;
}> = ({ fieldLabel, values, mapping, onChange }) => (
  <div className="journalit-convert-rating__table-scroll">
    <table className="journalit-convert-rating__table">
      <caption className="journalit-sr-only">
        {t('settings.customization.custom-fields.convert.table', {
          fieldLabel,
        })}
      </caption>
      <thead>
        <tr>
          <th scope="col">{fieldLabel}</th>
          <th scope="col" className="is-count">
            {t('settings.customization.custom-fields.convert.col-trades')}
          </th>
          <th scope="col">{t('trade.rating.label')}</th>
        </tr>
      </thead>
      <tbody>
        {values.map(({ valueKey, noteCount }) => {
          const rating = mapping.get(valueKey) ?? null;
          return (
            <tr key={valueKey}>
              <td className="journalit-convert-rating__value">{valueKey}</td>
              <td className="is-count">{noteCount}</td>
              <td>
                <div className="journalit-convert-rating__stars">
                  <StarRating
                    value={rating}
                    label={t(
                      'settings.customization.custom-fields.convert.value-rating',
                      { value: valueKey }
                    )}
                    hint={t('trade.rating.hint')}
                    clearable
                    onChange={(next) => onChange(valueKey, next)}
                  />
                  {rating === null && (
                    <span className="journalit-convert-rating__muted">
                      {t('settings.customization.custom-fields.convert.skip')}
                    </span>
                  )}
                </div>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  </div>
);

const ConflictChoicePicker: React.FC<{
  fieldLabel: string;
  conflictCount: number;
  value: ConflictChoice;
  onChange: (choice: ConflictChoice) => void;
}> = ({ fieldLabel, conflictCount, value, onChange }) => {
  const label = tPlural(
    'settings.customization.custom-fields.convert.conflict',
    conflictCount
  );
  return (
    <div className="journalit-convert-rating__conflict">
      <span>{label}</span>
      <SegmentedControl<ConflictChoice>
        size="small"
        value={value}
        onChange={onChange}
        ariaLabel={label}
        groupRole="radiogroup"
        options={[
          {
            value: 'keep',
            label: t(
              'settings.customization.custom-fields.convert.conflict-keep'
            ),
          },
          {
            value: 'overwrite',
            label: t(
              'settings.customization.custom-fields.convert.conflict-overwrite',
              { fieldLabel }
            ),
          },
        ]}
      />
    </div>
  );
};

const ConversionSummary: React.FC<{
  toWrite: number;
  alreadyRated: number;
  notConverted: number;
}> = ({ toWrite, alreadyRated, notConverted }) => (
  <div className="journalit-convert-rating__summary" aria-live="polite">
    {toWrite > 0 && (
      <span>
        {tPlural(
          'settings.customization.custom-fields.convert.summary-rate',
          toWrite
        )}
      </span>
    )}
    {alreadyRated > 0 && (
      <span className="journalit-convert-rating__muted">
        {tPlural(
          'settings.customization.custom-fields.convert.summary-done',
          alreadyRated
        )}
      </span>
    )}
    {notConverted > 0 && (
      <span className="journalit-convert-rating__muted">
        {tPlural(
          'settings.customization.custom-fields.convert.summary-skip',
          notConverted
        )}
      </span>
    )}
  </div>
);

const ConversionIssues: React.FC<{
  result: ConversionRunResult;
  fieldLabel: string;
}> = ({ result, fieldLabel }) => {
  if (
    !result.fieldChanged &&
    result.changed.length === 0 &&
    result.failed.length === 0
  ) {
    return null;
  }
  return (
    <div className="journalit-convert-rating__issues">
      {result.fieldChanged && (
        <div className="journalit-convert-rating__error">
          {t('settings.customization.custom-fields.convert.field-changed', {
            fieldLabel,
          })}
        </div>
      )}
      {result.changed.length > 0 && (
        <div>
          <div className="journalit-convert-rating__muted">
            {tPlural(
              'settings.customization.custom-fields.convert.changed',
              result.changed.length
            )}
          </div>
          <ul>
            {result.changed.map((path) => (
              <li key={path}>{path}</li>
            ))}
          </ul>
        </div>
      )}
      {result.failed.length > 0 && (
        <div>
          <div className="journalit-convert-rating__error">
            {tPlural(
              'settings.customization.custom-fields.convert.failed',
              result.failed.length
            )}
          </div>
          <ul>
            {result.failed.map(({ path, message }) => (
              <li key={path}>
                {path}: {message}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

class ConvertFieldToRatingModal extends JournalitModal {
  private root: Root | null = null;
  private busy = false;

  constructor(
    private readonly plugin: JournalitPlugin,
    private readonly field: CustomFieldDefinition,
    private readonly onFieldRemoved: () => void
  ) {
    super(plugin.app);
  }

  onOpen(): void {
    this.titleEl.setText(
      t('settings.customization.custom-fields.convert.title', {
        fieldLabel: this.field.label,
      })
    );
    this.modalEl.addClass('journalit-modal', 'journalit-convert-rating-modal');
    this.root = createRoot(this.contentEl.createDiv());
    this.root.render(
      <ConvertFieldToRating
        plugin={this.plugin}
        field={this.field}
        onClose={() => this.close()}
        onFieldRemoved={this.onFieldRemoved}
        onBusyChange={(busy) => {
          this.busy = busy;
          this.modalEl.toggleClass('is-busy', busy);
        }}
      />
    );
  }

  
  close(): void {
    if (!this.busy) super.close();
  }

  onClose(): void {
    this.root?.unmount();
    this.root = null;
    this.contentEl.empty();
  }
}

export function openConvertFieldToRatingModal(
  plugin: JournalitPlugin,
  field: CustomFieldDefinition,
  onFieldRemoved: () => void
): void {
  new ConvertFieldToRatingModal(plugin, field, onFieldRemoved).open();
}
