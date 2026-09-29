import React, { useCallback, useEffect, useId, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import JournalitPlugin from '../../../main';
import type { TranslationKey } from '../../../lang/locale/en';
import { cssVars } from '../../../styles/inlineStylePolicy';
import { t } from '../../../lang/helpers';
import {
  type ModalGuideIdentity,
  type ModalGuideStatus,
  saveModalGuideState,
  shouldAutoShowModalGuide,
} from '../../../guides/modalGuide/modalGuidePersistence';
import {
  getModalGuideTargetElement,
  type ModalGuidePlacement,
} from '../../../guides/modalGuide/modalGuidePopover';
import { ModalGuideOverlay } from '../../../guides/modalGuide/ModalGuideOverlay';
import { findNavigableModalGuideStep } from '../../../guides/modalGuide/modalGuideSteps';
import { useModalGuideTarget } from '../../../guides/modalGuide/useModalGuideTarget';

const TRADE_FORM_GUIDE_IDENTITY: ModalGuideIdentity = {
  guideId: 'trade-form.main',
  version: 1,
  dataKey: 'tradeFormGuide',
};

type TradeFormGuideStepId = 'customize-orb' | 'customization-modal' | 'finish';

interface TradeFormGuideStepDefinition {
  id: TradeFormGuideStepId;
  titleKey?: TranslationKey;
  descriptionKey?: TranslationKey;
  targetSelector?: string;
  placement?: ModalGuidePlacement;
  skipIfMissing?: boolean;
  orbOnly?: boolean;
}


const getGuidePortalTarget = (): Element => {
  const doc = window.activeDocument;
  const tradeFormModal = doc.querySelector('.modal.journalit-trade-form-modal');

  
  
  
  
  
  return tradeFormModal?.closest('.modal-container') ?? doc.body;
};

interface TradeFormGuideProps {
  plugin: JournalitPlugin;
}

const LAYOUT_MODAL_SELECTOR = '.journalit-trade-form-layout-modal';

const TRADE_FORM_GUIDE_STEPS: TradeFormGuideStepDefinition[] = [
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
    targetSelector: LAYOUT_MODAL_SELECTOR,
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

const isTargetPresent = (selector: string): boolean =>
  getModalGuideTargetElement(selector) !== null;




const closeLayoutModal = (): void => {
  getModalGuideTargetElement(
    '[data-journalit-guide-target="trade-form.layout-cancel"]'
  )?.click();
};

function useTradeFormGuideModel({ plugin }: TradeFormGuideProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const canAdvanceFromInitiallyOpenLayoutRef = useRef(true);
  const shouldSkipOrbOnUnmountRef = useRef(false);
  const terminalStatePersistedRef = useRef(false);

  useEffect(() => {
    let cancelled = false;
    const initialize = async () => {
      const shouldShow = await shouldAutoShowModalGuide(
        plugin,
        TRADE_FORM_GUIDE_IDENTITY
      );
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
  const isFirstStep =
    findNavigableModalGuideStep(
      TRADE_FORM_GUIDE_STEPS,
      stepIndex - 1,
      -1,
      isTargetPresent
    ) < 0;
  const isLastStep =
    findNavigableModalGuideStep(
      TRADE_FORM_GUIDE_STEPS,
      stepIndex + 1,
      1,
      isTargetPresent
    ) < 0;

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
        void saveModalGuideState(plugin, TRADE_FORM_GUIDE_IDENTITY, 'skipped');
      }
    };
  }, [plugin]);

  const overlayState = useModalGuideTarget(
    currentStep.targetSelector,
    isVisible
  );

  
  
  
  
  const moveToStep = useCallback(
    (direction: 1 | -1) => {
      const next = findNavigableModalGuideStep(
        TRADE_FORM_GUIDE_STEPS,
        stepIndex + direction,
        direction,
        isTargetPresent
      );
      if (next < 0) return;
      if (TRADE_FORM_GUIDE_STEPS[next].id === 'customize-orb') {
        closeLayoutModal();
      }
      setStepIndex(next);
    },
    [stepIndex]
  );

  useEffect(() => {
    if (!isVisible || currentStep.id !== 'customize-orb') {
      return;
    }

    
    
    
    
    let wasOpen = isTargetPresent(LAYOUT_MODAL_SELECTOR);
    if (wasOpen && canAdvanceFromInitiallyOpenLayoutRef.current) {
      canAdvanceFromInitiallyOpenLayoutRef.current = false;
      setStepIndex(
        TRADE_FORM_GUIDE_STEPS.findIndex(
          (step) => step.id === 'customization-modal'
        )
      );
      return;
    }
    canAdvanceFromInitiallyOpenLayoutRef.current = false;
    const interval = window.setInterval(() => {
      const isOpen = isTargetPresent(LAYOUT_MODAL_SELECTOR);
      if (isOpen && !wasOpen) {
        setStepIndex(
          TRADE_FORM_GUIDE_STEPS.findIndex(
            (step) => step.id === 'customization-modal'
          )
        );
      }
      wasOpen = isOpen;
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

    
    const timeout = window.setTimeout(() => moveToStep(1), 800);

    return () => {
      window.clearTimeout(timeout);
    };
  }, [
    currentStep.skipIfMissing,
    isVisible,
    moveToStep,
    overlayState.isWaitingForTarget,
  ]);

  const finish = useCallback(
    (status: ModalGuideStatus) => {
      terminalStatePersistedRef.current = true;
      setIsVisible(false);
      void saveModalGuideState(plugin, TRADE_FORM_GUIDE_IDENTITY, status);
    },
    [plugin]
  );

  const handlePrimaryClick = useCallback(() => {
    if (overlayState.isWaitingForTarget) return;
    if (isLastStep) {
      finish('completed');
      return;
    }
    moveToStep(1);
  }, [finish, isLastStep, moveToStep, overlayState.isWaitingForTarget]);

  const handleBack = useCallback(() => moveToStep(-1), [moveToStep]);

  const handleSkip = useCallback(() => {
    closeLayoutModal();
    finish('skipped');
  }, [finish]);

  return {
    currentStep,
    stepIndex,
    isVisible,
    isFirstStep,
    isLastStep,
    targetRect: overlayState.targetRect,
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
  const titleId = useId();
  const {
    currentStep,
    stepIndex,
    isVisible,
    isFirstStep,
    isLastStep,
    targetRect,
    isWaitingForTarget,
    handlePrimaryClick,
    handleBack,
    handleSkip,
  } = useTradeFormGuideModel(props);

  if (!isVisible) return null;

  if (currentStep.orbOnly) {
    return createPortal(
      <div
        className="journalit-trade-form-guide-orb-layer"
        data-journalit-modal-guide-overlay
      >
        {targetRect && (
          <div
            className="journalit-trade-form-guide-hover-highlight"
            style={cssVars({
              '--journalit-guide-highlight-top': `${targetRect.top}px`,
              '--journalit-guide-highlight-left': `${targetRect.left}px`,
              '--journalit-guide-highlight-width': `${targetRect.width}px`,
              '--journalit-guide-highlight-height': `${targetRect.height}px`,
            })}
          />
        )}
      </div>,
      getGuidePortalTarget()
    );
  }

  if (!currentStep.titleKey || !currentStep.descriptionKey) return null;

  return (
    <ModalGuideOverlay
      titleId={titleId}
      title={t(currentStep.titleKey)}
      description={t(currentStep.descriptionKey)}
      stepNumber={getVisibleGuideStepIndex(stepIndex)}
      stepCount={VISIBLE_GUIDE_STEP_COUNT}
      placement={currentStep.placement}
      targetRect={targetRect}
      isWaitingForTarget={isWaitingForTarget}
      isFirstStep={isFirstStep}
      isLastStep={isLastStep}
      onPrimary={handlePrimaryClick}
      onBack={handleBack}
      onSkip={handleSkip}
      portalTarget={getGuidePortalTarget()}
    />
  );
};
