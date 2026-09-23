

import React from 'react';
import { createPortal } from 'react-dom';
import { t } from '../../lang/helpers';
import { cssVars } from '../../styles/inlineStylePolicy';
import type { ModalGuidePopoverPosition } from './modalGuidePopover';

interface ModalGuideOverlayProps {
  titleId: string;
  title: string;
  description: string;
  stepLabel: string;
  position: ModalGuidePopoverPosition;
  isWaitingForTarget: boolean;
  isFirstStep: boolean;
  isLastStep: boolean;
  onPrimary: () => void;
  onBack: () => void;
  onSkip: () => void;
  portalTarget: Element;
}

export const ModalGuideOverlay: React.FC<ModalGuideOverlayProps> = ({
  titleId,
  title,
  description,
  stepLabel,
  position,
  isWaitingForTarget,
  isFirstStep,
  isLastStep,
  onPrimary,
  onBack,
  onSkip,
  portalTarget,
}) =>
  createPortal(
    <div
      className="journalit-view-guide-overlay"
      data-journalit-modal-guide-overlay
    >
      {position.highlight && (
        <div
          className="journalit-view-guide-highlight"
          style={cssVars({
            '--journalit-guide-highlight-top': `${position.highlight.top - 4}px`,
            '--journalit-guide-highlight-left': `${position.highlight.left - 4}px`,
            '--journalit-guide-highlight-width': `${position.highlight.width + 8}px`,
            '--journalit-guide-highlight-height': `${position.highlight.height + 8}px`,
          })}
        />
      )}
      <div
        className={`journalit-view-guide-popover ${position.anchored ? 'journalit-view-guide-popover--anchored' : ''}`}
        role="dialog"
        aria-labelledby={titleId}
        style={cssVars({
          '--journalit-guide-popover-top': position.top,
          '--journalit-guide-popover-left': position.left,
        })}
        onMouseDown={(event) => event.stopPropagation()}
      >
        <h3 id={titleId} className="journalit-view-guide-title">
          {title}
        </h3>
        <p className="journalit-view-guide-description">
          {isWaitingForTarget
            ? `${description} ${t('common.loading')}`
            : description}
        </p>
        <div className="journalit-view-guide-footer">
          <span className="journalit-view-guide-step">{stepLabel}</span>
          <div className="journalit-view-guide-actions">
            {!isLastStep && (
              <button
                type="button"
                className="journalit-view-guide-button journalit-view-guide-button--secondary"
                onClick={onSkip}
              >
                {t('guide.skip-guide')}
              </button>
            )}
            {!isFirstStep && (
              <button
                type="button"
                className="journalit-view-guide-button journalit-view-guide-button--back"
                onClick={onBack}
              >
                {t('button.back')}
              </button>
            )}
            <button
              type="button"
              className="journalit-view-guide-button journalit-view-guide-button--primary"
              onClick={onPrimary}
              disabled={isWaitingForTarget}
            >
              {isLastStep ? t('button.done') : t('button.next')}
            </button>
          </div>
        </div>
      </div>
    </div>,
    portalTarget
  );
