
import { useEffect, useMemo, useRef, useState } from 'react';
import type JournalitPlugin from '../../../../main';
import type { PartialTradeFrontmatter } from '../../../../types/TradeFrontmatter';
import { t } from '../../../../lang/helpers';
import type { useDisplayFormatter } from '../../../../hooks/useDisplayPolicy';
import { snapshotUnrealizedPnL } from '../../../trade/tradeHeaderOutcome';
import {
  verifyTradeForShare,
  type TradeVerification,
} from '../../../../services/tradeSync/tradeVerification';
import type { TradeSharePnlMode } from '../tradeShareModel';
import {
  buildMotionCardContent,
  resolveMotionCardOutcome,
  type MotionCardAspect,
  type MotionCardRow,
} from './motionCardModel';
import {
  drawMotionCard,
  loadMotionCardMark,
  MOTION_CARD_PLAIN_PALETTE,
  readMotionCardPalette,
  type MotionCardScene,
} from './drawMotionCard';
import { buildMotionCardSource } from './motionCardSource';
import {
  loadMotionBackgroundBlob,
  MotionBackgroundError,
  type MotionBackground,
} from './motionCardBackground';
import {
  probeMotionExportSupport,
  type MotionExportSupport,
} from './exportMotionCard';


export function useTradeVerification(
  plugin: JournalitPlugin,
  data: PartialTradeFrontmatter,
  shownPnl: number
): TradeVerification | null {
  const [verification, setVerification] = useState<TradeVerification | null>(
    null
  );
  useEffect(() => {
    let current = true;
    void verifyTradeForShare(plugin, data, shownPnl).then((result) => {
      if (current) setVerification(result);
    });
    return () => {
      current = false;
    };
  }, [plugin, data, shownPnl]);
  return verification;
}


export function useMotionCardResources(): {
  mark: CanvasImageSource | null;
  support: MotionExportSupport | null;
  supportChecked: boolean;
} {
  const [mark, setMark] = useState<CanvasImageSource | null>(null);
  const [support, setSupport] = useState<MotionExportSupport | null>(null);
  const [supportChecked, setSupportChecked] = useState(false);
  useEffect(() => {
    let current = true;
    loadMotionCardMark()
      .then((loaded) => {
        if (current) setMark(loaded);
      })
      .catch((error: unknown) => {
        console.error('[Journalit] Failed to load card logo:', error);
      });
    return () => {
      current = false;
    };
  }, []);
  useEffect(() => {
    let current = true;
    void probeMotionExportSupport()
      .catch((error: unknown) => {
        console.error('[Journalit] Video export check failed:', error);
        return null;
      })
      .then((result) => {
        if (!current) return;
        setSupport(result);
        setSupportChecked(true);
      });
    return () => {
      current = false;
    };
  }, []);
  return { mark, support, supportChecked };
}

function backgroundErrorMessage(error: unknown): string {
  if (error instanceof MotionBackgroundError) return t(error.messageKey);
  console.error('[Journalit] Failed to load card background:', error);
  return t('share.motion.error-unsupported');
}

export interface MotionCardBackgroundState {
  background: MotionBackground | null;
  loading: boolean;
  error: string | null;
  load: (file: File) => void;
  remove: () => void;
}


export function useMotionCardBackground(): MotionCardBackgroundState {
  const [background, setBackground] = useState<MotionBackground | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const pending = useRef<AbortController | null>(null);

  useEffect(() => () => background?.dispose(), [background]);
  
  useEffect(() => () => pending.current?.abort(), []);

  const load = (file: File) => {
    pending.current?.abort();
    const abort = new AbortController();
    pending.current = abort;
    setLoading(true);
    setError(null);
    loadMotionBackgroundBlob(file, file.name, abort.signal)
      .then((loaded) => {
        if (abort.signal.aborted) {
          loaded.dispose();
          return;
        }
        setBackground(loaded);
      })
      .catch((loadError: unknown) => {
        if (!abort.signal.aborted) setError(backgroundErrorMessage(loadError));
      })
      .finally(() => {
        if (!abort.signal.aborted) setLoading(false);
      });
  };
  return {
    background,
    loading,
    error,
    load,
    remove: () => setBackground(null),
  };
}

export interface MotionCardSceneInput {
  plugin: JournalitPlugin;
  data: PartialTradeFrontmatter;
  sourcePath: string;
  accountBalance: number | undefined;
  metrics: { pnl: number; isProfit?: boolean; isLoss?: boolean };
  verification: TradeVerification | null;
  canvas: HTMLCanvasElement | null;
  mark: CanvasImageSource | null;
  background: MotionBackground | null;
  aspect: MotionCardAspect;
  pnlMode: TradeSharePnlMode;
  rows: ReadonlySet<MotionCardRow>;
  dimPercent: number;
  seconds: number;
  formatter: ReturnType<typeof useDisplayFormatter>;
}


export function useMotionCardScene(
  input: MotionCardSceneInput
): MotionCardScene {
  const {
    plugin,
    data,
    sourcePath,
    accountBalance,
    metrics: { pnl, isProfit, isLoss },
    verification,
    canvas,
    mark,
    background,
    aspect,
    pnlMode,
    rows,
    dimPercent,
    seconds,
    formatter: { formatValue, shouldMask },
  } = input;
  const palette = useMemo(
    () => (canvas ? readMotionCardPalette(canvas) : MOTION_CARD_PLAIN_PALETTE),
    [canvas]
  );
  const fontFamily = canvas
    ? canvas.win.getComputedStyle(canvas).fontFamily
    : 'sans-serif';
  return useMemo<MotionCardScene>(() => {
    const unrealizedPnL = snapshotUnrealizedPnL(plugin, data);
    const outcome = resolveMotionCardOutcome(data, pnl, unrealizedPnL);
    const source = buildMotionCardSource({
      verification,
      pnlMode,
      isClosed:
        data.tradeStatus === 'CLOSED' &&
        !outcome.isLiveOpen &&
        outcome.status === null,
      masked: shouldMask('pnl'),
    });
    return {
      aspect,
      dim: dimPercent / 100,
      seconds,
      fontFamily,
      palette,
      mark,
      backgroundSize: background,
      source,
      content: buildMotionCardContent({
        data,
        pnl,
        unrealizedPnL,
        verified: source?.kind === 'verified',
        outcomeClass: isProfit ? 'win' : isLoss ? 'loss' : 'breakeven',
        currency: data.currency ?? plugin.settings.general?.currency ?? 'USD',
        defaultRiskAmount: plugin.settings.trade.defaultRiskAmount,
        accountBalance,
        pnlMode,
        rows,
        fallbackInstrument:
          sourcePath.split('/').pop()?.replace(/\.md$/, '') ?? '',
        dateLocale: undefined,
        formatValue,
        shouldMask,
      }),
    };
  }, [
    aspect,
    dimPercent,
    seconds,
    fontFamily,
    palette,
    mark,
    background,
    verification,
    data,
    pnl,
    isProfit,
    isLoss,
    plugin,
    accountBalance,
    pnlMode,
    rows,
    sourcePath,
    formatValue,
    shouldMask,
  ]);
}


export function usePreviewLoop(
  canvas: HTMLCanvasElement | null,
  scene: MotionCardScene,
  background: MotionBackground | null,
  paused: boolean
): void {
  const startedAt = useRef<number | null>(null);
  
  useEffect(() => {
    startedAt.current = null;
    if (!paused) background?.restartPreview();
  }, [background, paused]);
  useEffect(() => {
    if (!canvas || paused) return;
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;
    const win = canvas.win;
    let frameRequest = 0;
    background?.startPreview();
    const tick = (now: number) => {
      startedAt.current ??= now;
      let time = (now - startedAt.current) / 1000;
      if (time >= scene.seconds) {
        startedAt.current = now;
        time = 0;
        background?.restartPreview();
      }
      drawMotionCard(ctx, scene, background?.frameNow(time) ?? null, time);
      frameRequest = win.requestAnimationFrame(tick);
    };
    frameRequest = win.requestAnimationFrame(tick);
    return () => {
      win.cancelAnimationFrame(frameRequest);
      background?.stopPreview();
    };
  }, [canvas, scene, background, paused]);
}
