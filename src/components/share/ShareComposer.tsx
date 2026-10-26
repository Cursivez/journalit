
import React, { useEffect, useState } from 'react';
import { Notice } from 'obsidian';
import type JournalitPlugin from '../../main';
import { t } from '../../lang/helpers';
import { DEFAULT_SETTINGS } from '../../settings/types';
import { eventBus } from '../../services/events/EventBus';
import {
  captureElementPng,
  hasShareLoadingContent,
  observeShareLoadingContent,
} from '../../services/share/brandedCapture';
import { writeClipboardPendingPng } from '../../utils/clipboard';
import { cssVars } from '../../styles/inlineStylePolicy';
import { Button } from '../ui/Button';


const CARD_WIDTH = 720;
const CARD_PIXEL_RATIO = 1.5;
const FALLBACK_PREVIEW_SCALE = 0.6;

function useLayoutSize(element: HTMLElement | null) {
  const [size, setSize] = useState({ width: 0, height: 0 });
  useEffect(() => {
    if (!element) return;
    const observer = new ResizeObserver(() => {
      setSize({ width: element.clientWidth, height: element.offsetHeight });
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, [element]);
  return size;
}

export const ShareComposer: React.FC<{
  plugin: JournalitPlugin;
  hasContent: boolean;
  children: React.ReactNode;
  renderCard: (
    ref: React.RefCallback<HTMLDivElement>,
    hideDollarAmounts: boolean
  ) => React.ReactNode;
  copiedMessage: string;
  failedMessage: string;
  allowHideDollarAmounts?: boolean;
  hideDollarAmountsHint?: string;
}> = ({
  plugin,
  hasContent,
  children,
  renderCard,
  copiedMessage,
  failedMessage,
  allowHideDollarAmounts,
  hideDollarAmountsHint,
}) => {
  const [copying, setCopying] = useState(false);
  const canHideDollarAmounts =
    allowHideDollarAmounts ?? Boolean(plugin.settings.trade.displayRMultiples);
  const [hideDollarPreference, setHideDollarAmounts] = useState(
    () => plugin.settings.display?.hideDollarAmountsInShares ?? false
  );
  const hideDollarAmounts = canHideDollarAmounts && hideDollarPreference;
  const changeHideDollarAmounts = (hide: boolean) => {
    setHideDollarAmounts(hide);
    plugin.settings.display = {
      ...(plugin.settings.display ?? DEFAULT_SETTINGS.display!),
      hideDollarAmountsInShares: hide,
    };
    void plugin
      .saveSettings()
      .then(() => {
        eventBus.publish('settings:changed', {
          section: 'display',
          source: 'share-hide-dollar-amounts',
        });
      })
      .catch((error: unknown) => {
        console.error('[Journalit] Failed to save share preference:', error);
        new Notice(
          t('notice.error.save-settings', {
            error: error instanceof Error ? error.message : String(error),
          })
        );
      });
  };
  const [frame, setFrame] = useState<HTMLDivElement | null>(null);
  const [card, setCard] = useState<HTMLDivElement | null>(null);
  const [preview, setPreview] = useState<HTMLDivElement | null>(null);
  const [cardLoading, setCardLoading] = useState(true);
  useEffect(() => {
    if (!card) return;
    return observeShareLoadingContent(card, setCardLoading);
  }, [card]);
  const cardHeight = useLayoutSize(card).height;
  const previewWidth = useLayoutSize(preview).width;
  const previewScale =
    previewWidth > 0
      ? Math.min(1, previewWidth / CARD_WIDTH)
      : FALLBACK_PREVIEW_SCALE;

  const copyCard = () => {
    if (
      !frame ||
      !card ||
      !hasContent ||
      copying ||
      cardLoading ||
      hasShareLoadingContent(card)
    )
      return;
    setCopying(true);
    const png = captureElementPng(plugin.app, card, frame, CARD_PIXEL_RATIO);
    png.catch((error: unknown) => {
      console.error('[Journalit] Failed to render share card:', error);
    });
    writeClipboardPendingPng(png)
      .then(() => {
        new Notice(copiedMessage);
      })
      .catch((error: unknown) => {
        console.error('[Journalit] Failed to copy share card:', error);
        new Notice(failedMessage);
      })
      .finally(() => setCopying(false));
  };

  return (
    <div className="journalit-review-share-layout">
      <div ref={setPreview} className="journalit-review-share-preview">
        <div
          className="journalit-review-share-preview-box"
          inert
          style={cssVars({
            '--journalit-share-preview-scale': previewScale,
            '--journalit-share-preview-height': `${cardHeight * previewScale}px`,
          })}
        >
          <div ref={setFrame} className="journalit-share-card-frame">
            {renderCard(setCard, hideDollarAmounts)}
          </div>
        </div>
      </div>
      <div className="journalit-review-share-controls">
        {children}
        <label
          className={`journalit-review-share-option${canHideDollarAmounts ? '' : ' is-disabled'}`}
        >
          <input
            type="checkbox"
            checked={hideDollarAmounts}
            disabled={!canHideDollarAmounts || copying}
            onChange={() => changeHideDollarAmounts(!hideDollarAmounts)}
          />
          <span className="journalit-review-share-option-text">
            <span>{t('share.review.hide-dollar-amounts')}</span>
            <span className="journalit-review-share-option-hint">
              {hideDollarAmountsHint ??
                (canHideDollarAmounts
                  ? t('share.review.hide-dollar-amounts-hint')
                  : t('share.review.hide-dollar-amounts-needs-r'))}
            </span>
          </span>
        </label>
        <Button
          variant="primary"
          fullWidth
          onClick={copyCard}
          loading={copying || (cardLoading && hasContent)}
          disabled={copying || cardLoading || !hasContent}
        >
          {t('share.review.copy')}
        </Button>
      </div>
    </div>
  );
};
