
import React, { useEffect, useRef, useState } from 'react';
import { Notice, Platform, type App } from 'obsidian';
import type JournalitPlugin from '../../../../main';
import type { PartialTradeFrontmatter } from '../../../../types/TradeFrontmatter';
import { t } from '../../../../lang/helpers';
import { useDisplayFormatter } from '../../../../hooks/useDisplayPolicy';
import { writeClipboardPendingPng } from '../../../../utils/clipboard';
import { Button } from '../../../ui/Button';
import { useTradeMetrics } from '../../../trade/hooks';
import { downloadBlob } from '../../../tradelog/saveTradeLogExport';
import {
  MOTION_CARD_ROWS,
  MOTION_CARD_SIZES,
  resolveMotionCardSeconds,
} from './motionCardModel';
import {
  exportMotionCardGif,
  exportMotionCardVideo,
  renderMotionCardPng,
} from './exportMotionCard';
import {
  MotionCardBackgroundField,
  MotionCardOptionFields,
  type MotionCardOptions,
} from './MotionCardControls';
import {
  useMotionCardBackground,
  useMotionCardResources,
  useMotionCardScene,
  usePreviewLoop,
  useTradeVerification,
} from './useMotionCard';

const PREVIEW_SCALE = 0.5;

type MotionExportFormat = 'mp4' | 'gif';

async function saveExport(
  app: App,
  blob: Blob,
  filename: string,
  format: MotionExportFormat,
  doc: Document
) {
  if (Platform.isMobileApp) {
    await app.vault.createBinary(filename, await blob.arrayBuffer());
    new Notice(
      t(format === 'gif' ? 'share.motion.gif-saved' : 'share.motion.saved', {
        filename,
      })
    );
    return;
  }
  downloadBlob(doc, blob, filename);
}

function exportFilename(instrument: string, format: MotionExportFormat) {
  const name = instrument.replace(/[^\p{L}\p{N}_-]+/gu, '-');
  const stamp = new Date().toISOString().replace(/[:.]/g, '-');
  return `journalit-${name}-${stamp}.${format}`;
}

export const TradeMotionCardPanel: React.FC<{
  plugin: JournalitPlugin;
  data: PartialTradeFrontmatter;
  sourcePath: string;
  accountBalance: number | undefined;
  breakEvenAccountCurrentBalance: number | undefined;
}> = ({
  plugin,
  data,
  sourcePath,
  accountBalance,
  breakEvenAccountCurrentBalance,
}) => {
  const formatter = useDisplayFormatter();
  const { metrics } = useTradeMetrics({
    data,
    breakEvenRange: plugin.settings.trade,
    breakEvenAccountCurrentBalance,
  });
  const verification = useTradeVerification(plugin, data, metrics.pnl);
  const { mark, support, supportChecked } = useMotionCardResources();
  const backgroundState = useMotionCardBackground();
  const { background } = backgroundState;
  const [canvas, setCanvas] = useState<HTMLCanvasElement | null>(null);
  const [options, setOptions] = useState<MotionCardOptions>(() => ({
    aspect: 'landscape',
    pnlMode: plugin.settings.trade.displayRMultiples ? 'r' : 'currency',
    rows: new Set(MOTION_CARD_ROWS),
    selectedSeconds: null,
    dimPercent: 35,
    includeSound: true,
  }));
  const [exporting, setExporting] = useState<{
    format: MotionExportFormat;
    progress: number;
  } | null>(null);
  const [copying, setCopying] = useState(false);
  const exportAbort = useRef<AbortController | null>(null);
  
  useEffect(() => () => exportAbort.current?.abort(), []);

  const scene = useMotionCardScene({
    plugin,
    data,
    sourcePath,
    accountBalance,
    metrics,
    verification,
    canvas,
    mark,
    background,
    aspect: options.aspect,
    pnlMode: options.pnlMode,
    rows: options.rows,
    dimPercent: options.dimPercent,
    seconds: resolveMotionCardSeconds(
      options.selectedSeconds,
      background?.seconds ?? null
    ),
    formatter,
  });

  const busy = exporting !== null || copying || backgroundState.loading;
  
  usePreviewLoop(canvas, scene, background, exporting !== null || copying);

  const copyImage = () => {
    if (busy) return;
    setCopying(true);
    writeClipboardPendingPng(renderMotionCardPng(scene, background))
      .then(() => {
        new Notice(t('share.motion.copied'));
      })
      .catch((error: unknown) => {
        console.error('[Journalit] Failed to copy video card image:', error);
        new Notice(t('share.motion.copy-failed'));
      })
      .finally(() => setCopying(false));
  };

  const saveCard = (format: MotionExportFormat) => {
    if (!canvas || busy) return;
    const abort = new AbortController();
    const request = {
      scene,
      background,
      signal: abort.signal,
      onProgress: (progress: number) => setExporting({ format, progress }),
    };
    const run =
      format === 'gif'
        ? () => exportMotionCardGif(request)
        : support
          ? () =>
              exportMotionCardVideo({
                ...request,
                support,
                includeSound: options.includeSound,
              })
          : null;
    if (!run) return;
    exportAbort.current = abort;
    setExporting({ format, progress: 0 });
    run()
      .then((file) =>
        saveExport(
          plugin.app,
          file,
          exportFilename(scene.content.instrument, format),
          format,
          canvas.doc
        )
      )
      .catch((error: unknown) => {
        if (abort.signal.aborted) return;
        console.error(
          `[Journalit] Failed to export video card ${format}:`,
          error
        );
        new Notice(
          t(
            format === 'gif'
              ? 'share.motion.gif-failed'
              : 'share.motion.export-failed'
          )
        );
      })
      .finally(() => {
        exportAbort.current = null;
        setExporting(null);
      });
  };

  const exportButton = (
    format: MotionExportFormat,
    label: string,
    variant: 'primary' | 'secondary',
    unavailable: boolean
  ) =>
    exporting?.format === format ? (
      <Button
        variant={variant}
        fullWidth
        onClick={() => exportAbort.current?.abort()}
      >
        {t('share.motion.exporting', {
          percent: String(Math.round(exporting.progress * 100)),
        })}
      </Button>
    ) : (
      <Button
        variant={variant}
        fullWidth
        onClick={() => saveCard(format)}
        disabled={busy || unavailable}
      >
        {label}
      </Button>
    );

  const { width, height } = MOTION_CARD_SIZES[options.aspect];
  return (
    <div className="journalit-review-share-layout">
      <div className="journalit-review-share-preview">
        <canvas
          ref={setCanvas}
          className={`journalit-motion-card-preview is-${options.aspect}`}
          width={width * PREVIEW_SCALE}
          height={height * PREVIEW_SCALE}
          role="img"
          aria-label={t('share.motion.preview-label')}
        />
      </div>
      <div className="journalit-review-share-controls">
        <div className="journalit-motion-card-settings">
          <MotionCardBackgroundField state={backgroundState} busy={busy} />
          <MotionCardOptionFields
            options={options}
            onChange={(changes) =>
              setOptions((current) => ({ ...current, ...changes }))
            }
            disabled={exporting !== null}
            hasBackground={background !== null}
            hasSound={background?.audio != null}
            support={support}
            supportChecked={supportChecked}
          />
        </div>
        <div className="journalit-motion-card-actions">
          <Button
            variant="secondary"
            fullWidth
            onClick={copyImage}
            loading={copying}
            disabled={busy}
          >
            {t('share.motion.copy-image')}
          </Button>
          {exportButton('gif', t('share.motion.save-gif'), 'secondary', false)}
          {exportButton(
            'mp4',
            t('share.motion.save-video'),
            'primary',
            !support
          )}
        </div>
      </div>
    </div>
  );
};
