import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { createPortal } from 'react-dom';
import JournalitPlugin from '../../../main';
import { t } from '../../../lang/helpers';
import type { TranslationKey } from '../../../lang/locale/en';
import { cssVars } from '../../../styles/inlineStylePolicy';

export const TRADE_FORM_GUIDE_ID = 'trade-form.main';
export const TRADE_FORM_GUIDE_VERSION = 1;

const TRADE_FORM_GUIDE_DATA_KEY = 'tradeFormGuide';

type TradeFormGuideStatus = 'completed' | 'skipped';
type TradeFormGuidePlacement = 'center' | 'auto' | 'right';
type TradeFormGuideStepId = 'customize-orb' | 'customization-modal' | 'finish';

interface TradeFormGuidePersistedState {
  guideId: string;
  version: number;
  status: TradeFormGuideStatus;
  updatedAt: number;
}

interface TradeFormGuideStepDefinition {
  id: TradeFormGuideStepId;
  titleKey?: TranslationKey;
  descriptionKey?: TranslationKey;
  targetSelector?: string;
  placement?: TradeFormGuidePlacement;
  skipIfMissing?: boolean;
  orbOnly?: boolean;
}

interface TradeFormGuideProps {
  plugin: JournalitPlugin;
}

interface TradeFormGuideOverlayState {
  targetRect: DOMRect | null;
  isWaitingForTarget: boolean;
}

export const TRADE_FORM_GUIDE_STEPS: TradeFormGuideStepDefinition[] = [
  {
    id: 'customize-orb',
    targetSelector:
      '[data-journalit-guide-target="trade-form.customize-button"]',
    orbOnly: true,
  },
  {
    id: 'customization-modal',
    titleKey: 'trade-form.guide.customization-modal.title',
    descriptionKey: 'trade-form.guide.customization-modal.description',
    targetSelector: '.journalit-trade-form-layout-modal',
    placement: 'right',
    skipIfMissing: true,
  },
  {
    id: 'finish',
    titleKey: 'trade-form.guide.finish.title',
    descriptionKey: 'trade-form.guide.finish.description',
    placement: 'center',
  },
];

const asRecord = (value: unknown): Record<string, unknown> | null => {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? Object.fromEntries(Object.entries(value))
    : null;
};

const parsePersistedState = (
  value: unknown
): TradeFormGuidePersistedState | null => {
  const record = asRecord(value);
  if (
    !record ||
    record.guideId !== TRADE_FORM_GUIDE_ID ||
    typeof record.version !== 'number' ||
    typeof record.updatedAt !== 'number' ||
    (record.status !== 'completed' && record.status !== 'skipped')
  ) {
    return null;
  }

  return {
    guideId: TRADE_FORM_GUIDE_ID,
    version: record.version,
    status: record.status,
    updatedAt: record.updatedAt,
  };
};

const loadPersistedState = async (
  plugin: JournalitPlugin
): Promise<TradeFormGuidePersistedState | null> => {
  const pluginData = asRecord(await plugin.loadData());
  const localMeta = asRecord(pluginData?.localMeta);
  return parsePersistedState(localMeta?.[TRADE_FORM_GUIDE_DATA_KEY]);
};

const savePersistedState = async (
  plugin: JournalitPlugin,
  status: TradeFormGuideStatus
): Promise<void> => {
  const nextState = {
    guideId: TRADE_FORM_GUIDE_ID,
    version: TRADE_FORM_GUIDE_VERSION,
    status,
    updatedAt: Date.now(),
  } satisfies TradeFormGuidePersistedState;

  if (plugin.settingsManager?.updateLocalMetaSection) {
    await plugin.settingsManager.updateLocalMetaSection(
      TRADE_FORM_GUIDE_DATA_KEY,
      nextState
    );
    return;
  }

  const pluginData = asRecord(await plugin.loadData()) ?? {};
  const localMeta = asRecord(pluginData.localMeta) ?? {};
  localMeta[TRADE_FORM_GUIDE_DATA_KEY] = nextState;
  await plugin.saveData({
    ...pluginData,
    localMeta,
  });
};

const getTargetElement = (selector?: string): HTMLElement | null => {
  if (!selector) return null;
  return window.activeDocument.querySelector<HTMLElement>(selector);
};

const clickTarget = (selector?: string): void => {
  const target = getTargetElement(selector);
  if (!target) return;
  const clickable = target.matches('button, [role="button"], input, select, a')
    ? target
    : target.querySelector<HTMLElement>(
        'button, [role="button"], input, select, a'
      );
  clickable?.click();
};

const closeLayoutModal = (): void => {
  const modalContent = window.activeDocument.querySelector<HTMLElement>(
    '.journalit-trade-form-layout-modal'
  );
  const modal = modalContent?.closest('.modal');
  const closeButton = modal?.querySelector<HTMLElement>('.modal-close-button');
  closeButton?.click();
};

const getPopoverPosition = (
  step: TradeFormGuideStepDefinition,
  targetRect: DOMRect | null
): {
  top: string;
  left: string;
  highlight: DOMRect | null;
  anchored: boolean;
} => {
  if (step.placement === 'center' || !targetRect) {
    return {
      top: '50%',
      left: '50%',
      highlight: null,
      anchored: false,
    };
  }

  const gap = 10;
  const popoverWidth = Math.min(340, window.innerWidth - 24);
  const estimatedHeight = 170;
  let top = targetRect.bottom + gap;
  let left = targetRect.left;

  if (step.placement === 'right') {
    top = targetRect.top + targetRect.height / 2 - estimatedHeight / 2;
    left = targetRect.right + gap;
  }

  if (left + popoverWidth > window.innerWidth - 12) {
    left = Math.max(12, targetRect.left - popoverWidth - gap);
  }
  if (left < 12) left = 12;
  if (top < 12) top = 12;
  if (top + estimatedHeight > window.innerHeight - 12) {
    top = Math.max(12, window.innerHeight - estimatedHeight - 12);
  }

  return {
    top: `${top}px`,
    left: `${left}px`,
    highlight: targetRect,
    anchored: true,
  };
};

function useTradeFormGuideModel({ plugin }: TradeFormGuideProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [overlayState, setOverlayState] = useState<TradeFormGuideOverlayState>({
    targetRect: null,
    isWaitingForTarget: false,
  });
  const shouldSkipOrbOnUnmountRef = useRef(false);
  const terminalStatePersistedRef = useRef(false);

  useEffect(() => {
    let cancelled = false;
    const initialize = async () => {
      const persisted = await loadPersistedState(plugin);
      const shouldShow =
        !persisted || persisted.version !== TRADE_FORM_GUIDE_VERSION;
      if (!cancelled && shouldShow) {
        setIsVisible(true);
      }
    };

    void initialize();
    return () => {
      cancelled = true;
    };
  }, [plugin]);

  const currentStep = TRADE_FORM_GUIDE_STEPS[stepIndex];
  const isFirstStep = stepIndex === 0;
  const isLastStep = stepIndex === TRADE_FORM_GUIDE_STEPS.length - 1;

  useEffect(() => {
    shouldSkipOrbOnUnmountRef.current =
      isVisible && currentStep.id === 'customize-orb';
  }, [currentStep.id, isVisible]);

  useEffect(() => {
    return () => {
      if (
        shouldSkipOrbOnUnmountRef.current &&
        !terminalStatePersistedRef.current
      ) {
        void savePersistedState(plugin, 'skipped');
      }
    };
  }, [plugin]);

  useEffect(() => {
    if (!isVisible) return;

    const updateTarget = () => {
      if (!currentStep.targetSelector) {
        setOverlayState({ targetRect: null, isWaitingForTarget: false });
        return;
      }

      const target = getTargetElement(currentStep.targetSelector);
      setOverlayState({
        targetRect: target?.getBoundingClientRect() ?? null,
        isWaitingForTarget: !target,
      });
    };

    updateTarget();
    const interval = window.setInterval(updateTarget, 150);
    window.addEventListener('resize', updateTarget);
    window.addEventListener('scroll', updateTarget, true);
    return () => {
      window.clearInterval(interval);
      window.removeEventListener('resize', updateTarget);
      window.removeEventListener('scroll', updateTarget, true);
    };
  }, [currentStep, isVisible]);

  const moveToStep = useCallback((nextIndex: number) => {
    const nextStep = TRADE_FORM_GUIDE_STEPS[nextIndex];
    if (nextStep.id === 'customization-modal') {
      const customizeStep = TRADE_FORM_GUIDE_STEPS.find(
        (step) => step.id === 'customize-orb'
      );
      clickTarget(customizeStep?.targetSelector);
    }
    if (nextStep.id === 'customize-orb') {
      closeLayoutModal();
    }
    setStepIndex(nextIndex);
  }, []);

  useEffect(() => {
    if (!isVisible || currentStep.id !== 'customize-orb') {
      return;
    }

    const interval = window.setInterval(() => {
      if (getTargetElement('.journalit-trade-form-layout-modal')) {
        setStepIndex(1);
      }
    }, 150);

    return () => {
      window.clearInterval(interval);
    };
  }, [currentStep.id, isVisible]);

  useEffect(() => {
    if (
      !isVisible ||
      !currentStep.skipIfMissing ||
      !overlayState.isWaitingForTarget
    ) {
      return;
    }

    const timeout = window.setTimeout(() => {
      moveToStep(Math.min(stepIndex + 1, TRADE_FORM_GUIDE_STEPS.length - 1));
    }, 800);

    return () => {
      window.clearTimeout(timeout);
    };
  }, [
    currentStep.skipIfMissing,
    isVisible,
    moveToStep,
    overlayState.isWaitingForTarget,
    stepIndex,
  ]);

  const finish = useCallback(
    (status: TradeFormGuideStatus) => {
      terminalStatePersistedRef.current = true;
      setIsVisible(false);
      void savePersistedState(plugin, status);
    },
    [plugin]
  );

  const handlePrimaryClick = useCallback(() => {
    if (overlayState.isWaitingForTarget) return;
    if (isLastStep) {
      finish('completed');
      return;
    }
    if (currentStep.id === 'customize-orb') {
      clickTarget(currentStep.targetSelector);
      return;
    }
    moveToStep(stepIndex + 1);
  }, [
    currentStep.id,
    currentStep.targetSelector,
    finish,
    isLastStep,
    moveToStep,
    overlayState.isWaitingForTarget,
    stepIndex,
  ]);

  const handleBack = useCallback(() => {
    if (isFirstStep) return;
    moveToStep(stepIndex - 1);
  }, [isFirstStep, moveToStep, stepIndex]);

  const handleSkip = useCallback(() => {
    closeLayoutModal();
    finish('skipped');
  }, [finish]);

  const popoverPosition = useMemo(
    () => getPopoverPosition(currentStep, overlayState.targetRect),
    [currentStep, overlayState.targetRect]
  );

  return {
    currentStep,
    stepIndex,
    isVisible,
    isFirstStep,
    isLastStep,
    popoverPosition,
    isWaitingForTarget: overlayState.isWaitingForTarget,
    handlePrimaryClick,
    handleBack,
    handleSkip,
  };
}

const VISIBLE_GUIDE_STEP_COUNT = TRADE_FORM_GUIDE_STEPS.filter(
  (step) => !step.orbOnly
).length;

const getVisibleGuideStepIndex = (stepIndex: number): number => {
  return TRADE_FORM_GUIDE_STEPS.slice(0, stepIndex + 1).filter(
    (step) => !step.orbOnly
  ).length;
};

export const TradeFormGuide: React.FC<TradeFormGuideProps> = (props) => {
  const {
    currentStep,
    stepIndex,
    isVisible,
    isFirstStep,
    isLastStep,
    popoverPosition,
    isWaitingForTarget,
    handlePrimaryClick,
    handleBack,
    handleSkip,
  } = useTradeFormGuideModel(props);

  if (!isVisible) return null;

  if (currentStep.orbOnly) {
    return createPortal(
      <div className="journalit-trade-form-guide-orb-layer">
        {popoverPosition.highlight && (
          <div
            className="journalit-trade-form-guide-hover-highlight"
            style={cssVars({
              '--journalit-guide-highlight-top': `${popoverPosition.highlight.top}px`,
              '--journalit-guide-highlight-left': `${popoverPosition.highlight.left}px`,
              '--journalit-guide-highlight-width': `${popoverPosition.highlight.width}px`,
              '--journalit-guide-highlight-height': `${popoverPosition.highlight.height}px`,
            })}
          />
        )}
      </div>,
      window.activeDocument.body
    );
  }

  if (!currentStep.titleKey || !currentStep.descriptionKey) return null;

  return createPortal(
    <div className="journalit-view-guide-overlay journalit-trade-form-guide-overlay">
      {popoverPosition.highlight && (
        <div
          className="journalit-view-guide-highlight"
          style={cssVars({
            '--journalit-guide-highlight-top': `${popoverPosition.highlight.top - 4}px`,
            '--journalit-guide-highlight-left': `${popoverPosition.highlight.left - 4}px`,
            '--journalit-guide-highlight-width': `${popoverPosition.highlight.width + 8}px`,
            '--journalit-guide-highlight-height': `${popoverPosition.highlight.height + 8}px`,
          })}
        />
      )}
      <div
        className={`journalit-view-guide-popover ${popoverPosition.anchored ? 'journalit-view-guide-popover--anchored' : ''}`}
        role="dialog"
        aria-labelledby="journalit-trade-form-guide-title"
        style={cssVars({
          '--journalit-guide-popover-top': popoverPosition.top,
          '--journalit-guide-popover-left': popoverPosition.left,
        })}
        onMouseDown={(event) => event.stopPropagation()}
      >
        <h3
          id="journalit-trade-form-guide-title"
          className="journalit-view-guide-title"
        >
          {t(currentStep.titleKey)}
        </h3>
        <p className="journalit-view-guide-description">
          {isWaitingForTarget
            ? `${t(currentStep.descriptionKey)} ${t('common.loading')}`
            : t(currentStep.descriptionKey)}
        </p>
        <div className="journalit-view-guide-footer">
          <span className="journalit-view-guide-step">
            {`${getVisibleGuideStepIndex(stepIndex)}/${VISIBLE_GUIDE_STEP_COUNT}`}
          </span>
          <div className="journalit-view-guide-actions">
            {!isLastStep && (
              <button
                type="button"
                className="journalit-view-guide-button journalit-view-guide-button--secondary"
                onClick={handleSkip}
              >
                {t('guide.skip-guide')}
              </button>
            )}
            {!isFirstStep && (
              <button
                type="button"
                className="journalit-view-guide-button journalit-view-guide-button--back"
                onClick={handleBack}
              >
                {t('button.back')}
              </button>
            )}
            <button
              type="button"
              className="journalit-view-guide-button journalit-view-guide-button--primary"
              onClick={handlePrimaryClick}
              disabled={isWaitingForTarget}
            >
              {isLastStep ? t('button.done') : t('button.next')}
            </button>
          </div>
        </div>
      </div>
    </div>,
    window.activeDocument.body
  );
};
