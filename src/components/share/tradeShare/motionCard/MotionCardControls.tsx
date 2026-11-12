
import React, { useRef } from 'react';
import type { Lang } from '../../../../lang/locale/en';
import { t } from '../../../../lang/helpers';
import { Select } from '../../../core/Select';
import { SegmentedControl } from '../../../shared/SegmentedControl';
import { Button } from '../../../ui/Button';
import type { TradeSharePnlMode } from '../tradeShareModel';
import { TRADE_SHARE_PNL_OPTIONS } from '../tradeShareModel';
import {
  MOTION_CARD_MAX_SECONDS,
  MOTION_CARD_ROWS,
  type MotionCardAspect,
  type MotionCardRow,
} from './motionCardModel';
import type { MotionExportSupport } from './exportMotionCard';
import type { MotionCardBackgroundState } from './useMotionCard';

const LENGTH_CHOICES = [5, 10, 15, 30, MOTION_CARD_MAX_SECONDS];

const ROW_LABELS: Record<MotionCardRow, keyof Lang> = {
  entry: 'trade.details.entry',
  exit: 'trade.details.exit',
  size: 'widget.trade-review.field.position-size',
  return: 'share.motion.return',
};

const ASPECT_LABELS: Record<MotionCardAspect, keyof Lang> = {
  landscape: 'share.motion.format-landscape',
  square: 'share.motion.format-square',
  portrait: 'share.motion.format-portrait',
};

export const MotionCardBackgroundField: React.FC<{
  state: MotionCardBackgroundState;
  busy: boolean;
}> = ({ state, busy }) => {
  const fileInput = useRef<HTMLInputElement | null>(null);
  return (
    <div className="journalit-motion-card-field">
      <span className="journalit-motion-card-label">
        {t('share.motion.background')}
      </span>
      <input
        ref={fileInput}
        type="file"
        accept="image/*,video/*"
        className="journalit-motion-card-file"
        aria-label={t('share.motion.choose-file')}
        onChange={(event) => {
          const file = event.target.files?.[0];
          event.target.value = '';
          if (file) state.load(file);
        }}
      />
      <Button
        variant="secondary"
        size="small"
        fullWidth
        disabled={busy}
        loading={state.loading}
        onClick={() => fileInput.current?.click()}
      >
        {t('share.motion.choose-file')}
      </Button>
      {state.error && (
        <span className="journalit-motion-card-error" role="alert">
          {state.error}
        </span>
      )}
      {state.background && (
        <div className="journalit-motion-card-current">
          <span className="journalit-motion-card-current-name">
            {state.background.name}
          </span>
          <Button
            variant="text"
            size="small"
            disabled={busy}
            onClick={state.remove}
          >
            {t('share.motion.remove-background')}
          </Button>
        </div>
      )}
    </div>
  );
};

export interface MotionCardOptions {
  aspect: MotionCardAspect;
  pnlMode: TradeSharePnlMode;
  rows: ReadonlySet<MotionCardRow>;
  selectedSeconds: number | null;
  dimPercent: number;
  includeSound: boolean;
}

export const MotionCardOptionFields: React.FC<{
  options: MotionCardOptions;
  onChange: (changes: Partial<MotionCardOptions>) => void;
  disabled: boolean;
  hasBackground: boolean;
  hasSound: boolean;
  support: MotionExportSupport | null;
  supportChecked: boolean;
}> = ({
  options,
  onChange,
  disabled,
  hasBackground,
  hasSound,
  support,
  supportChecked,
}) => (
  <>
    <SegmentedControl<MotionCardAspect>
      ariaLabel={t('share.motion.format')}
      fullWidth
      size="small"
      disabled={disabled}
      value={options.aspect}
      onChange={(aspect) => onChange({ aspect })}
      options={(['landscape', 'square', 'portrait'] as const).map((value) => ({
        value,
        label: t(ASPECT_LABELS[value]),
      }))}
    />
    <Select
      label={t('template.editor.metric.pnl')}
      value={options.pnlMode}
      disabled={disabled}
      options={TRADE_SHARE_PNL_OPTIONS.map(({ value, label }) => ({
        value,
        label: t(label),
      }))}
      onChange={(value) => {
        const option = TRADE_SHARE_PNL_OPTIONS.find(
          (candidate) => candidate.value === value
        );
        if (option) onChange({ pnlMode: option.value });
      }}
    />
    <div className="journalit-review-share-sections">
      <div className="journalit-review-share-section is-flat">
        {MOTION_CARD_ROWS.map((row) => (
          <label key={row} className="journalit-review-share-item-row">
            <input
              type="checkbox"
              checked={options.rows.has(row)}
              disabled={disabled}
              onChange={() => {
                const rows = new Set(options.rows);
                if (rows.has(row)) rows.delete(row);
                else rows.add(row);
                onChange({ rows });
              }}
            />
            <span className="journalit-review-share-row-label">
              {t(ROW_LABELS[row])}
            </span>
          </label>
        ))}
      </div>
    </div>
    <Select
      label={t('share.motion.length')}
      value={
        options.selectedSeconds === null
          ? 'auto'
          : String(options.selectedSeconds)
      }
      disabled={disabled}
      options={[
        { value: 'auto', label: t('share.motion.length-auto') },
        ...LENGTH_CHOICES.map((choice) => ({
          value: String(choice),
          label: t('share.motion.length-seconds', { seconds: String(choice) }),
        })),
      ]}
      onChange={(value) =>
        onChange({ selectedSeconds: value === 'auto' ? null : Number(value) })
      }
    />
    <label className="journalit-motion-card-field">
      <span className="journalit-motion-card-label">
        {t('share.motion.dim')}
      </span>
      <input
        type="range"
        className="slider"
        min={0}
        max={80}
        step={5}
        value={options.dimPercent}
        disabled={disabled || !hasBackground}
        onChange={(event) =>
          onChange({ dimPercent: Number(event.target.value) })
        }
      />
    </label>
    {hasSound && support?.audioCodec && (
      <label className="journalit-review-share-option">
        <input
          type="checkbox"
          checked={options.includeSound}
          disabled={disabled}
          onChange={() => onChange({ includeSound: !options.includeSound })}
        />
        <span className="journalit-review-share-option-text">
          <span>{t('share.motion.sound')}</span>
          {support.audioCodec === 'opus' && (
            <span className="journalit-review-share-option-hint">
              {t('share.motion.sound-opus-hint')}
            </span>
          )}
        </span>
      </label>
    )}
    {supportChecked && !support && (
      <span className="journalit-review-share-option-hint">
        {t('share.motion.video-unavailable')}
      </span>
    )}
  </>
);
