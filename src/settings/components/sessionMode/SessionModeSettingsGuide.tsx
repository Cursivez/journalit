

import React, { useCallback, useEffect, useId, useRef, useState } from 'react';
import type JournalitPlugin from '../../../main';
import { t } from '../../../lang/helpers';
import type { TranslationKey } from '../../../lang/locale/en';
import { SESSION_MODE_SETTINGS_GUIDE_ID } from '../../../guides/sessionModeGuideIds';
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
import { useModalGuideTarget } from '../../../guides/modalGuide/useModalGuideTarget';
import {
  findNavigableModalGuideStep,
  type ModalGuideStepAvailability,
} from '../../../guides/modalGuide/modalGuideSteps';

const SESSION_MODE_SETTINGS_GUIDE_IDENTITY: ModalGuideIdentity = {
  guideId: SESSION_MODE_SETTINGS_GUIDE_ID,
  version: 1,
  dataKey: 'sessionModeSettingsGuide',
};

interface SettingsGuideStep extends ModalGuideStepAvailability {
  id: string;
  titleKey: TranslationKey;
  descriptionKey: TranslationKey;
  placement?: ModalGuidePlacement;
}

const STEPS: SettingsGuideStep[] = [
  {
    id: 'intro',
    titleKey: 'settings.session-mode.guide.intro.title',
    descriptionKey: 'settings.session-mode.guide.intro.description',
    placement: 'center',
  },
  {
    id: 'lead-time',
    titleKey: 'settings.session-mode.guide.lead-time.title',
    descriptionKey: 'settings.session-mode.guide.lead-time.description',
    targetSelector: '[data-journalit-guide-target="session-mode.lead-time"]',
  },
  {
    id: 'windows',
    titleKey: 'settings.session-mode.guide.windows.title',
    descriptionKey: 'settings.session-mode.guide.windows.description',
    targetSelector: '.journalit-session-mode-windows-heading',
  },
  {
    id: 'layout',
    titleKey: 'settings.session-mode.guide.layout.title',
    descriptionKey: 'settings.session-mode.guide.layout.description',
    targetSelector: '.journalit-session-mode-layout-settings',
    placement: 'right',
  },
  {
    id: 'trade-gate',
    titleKey: 'settings.session-mode.guide.trade-gate.title',
    descriptionKey: 'settings.session-mode.guide.trade-gate.description',
    targetSelector: '.journalit-session-mode-trade-gate-heading',
  },
  {
    id: 'trade-gate-editor',
    titleKey: 'settings.session-mode.guide.editor.title',
    descriptionKey: 'settings.session-mode.guide.editor.description',
    targetSelector:
      '[data-journalit-guide-target="session-mode.trade-gate-editor"]',
    placement: 'right',
    skipIfMissing: true,
  },
  {
    id: 'tags',
    titleKey: 'settings.session-mode.guide.tags.title',
    descriptionKey: 'settings.session-mode.guide.tags.description',
    targetSelector: '.journalit-session-mode-tags-heading',
  },
  {
    id: 'finish',
    titleKey: 'settings.session-mode.guide.finish.title',
    descriptionKey: 'settings.session-mode.guide.finish.description',
    placement: 'center',
  },
];

const isTargetPresent = (selector: string): boolean =>
  getModalGuideTargetElement(selector) !== null;

interface SessionModeSettingsGuideProps {
  plugin: JournalitPlugin;
  
  startImmediately: boolean;
}

export const SessionModeSettingsGuide: React.FC<
  SessionModeSettingsGuideProps
> = ({ plugin, startImmediately }) => {
  const titleId = useId();
  
  
  
  const sentinelRef = useRef<HTMLSpanElement | null>(null);
  const [portalTarget, setPortalTarget] = useState<Element | null>(null);
  const [isVisible, setIsVisible] = useState(startImmediately);
  const [stepIndex, setStepIndex] = useState(0);
  const terminalStateRef = useRef(false);

  useEffect(() => {
    setPortalTarget(
      sentinelRef.current?.closest('.modal-container') ??
        window.activeDocument.body
    );
  }, []);

  useEffect(() => {
    if (startImmediately) return;
    let cancelled = false;
    void shouldAutoShowModalGuide(
      plugin,
      SESSION_MODE_SETTINGS_GUIDE_IDENTITY
    ).then((shouldShow) => {
      if (!cancelled && shouldShow) setIsVisible(true);
    });
    return () => {
      cancelled = true;
    };
  }, [plugin, startImmediately]);

  const finish = useCallback(
    (status: ModalGuideStatus) => {
      terminalStateRef.current = true;
      setIsVisible(false);
      void saveModalGuideState(
        plugin,
        SESSION_MODE_SETTINGS_GUIDE_IDENTITY,
        status
      );
    },
    [plugin]
  );

  
  
  const isVisibleRef = useRef(isVisible);
  useEffect(() => {
    isVisibleRef.current = isVisible;
  }, [isVisible]);
  useEffect(() => {
    return () => {
      if (isVisibleRef.current && !terminalStateRef.current) {
        void saveModalGuideState(
          plugin,
          SESSION_MODE_SETTINGS_GUIDE_IDENTITY,
          'skipped'
        );
      }
    };
  }, [plugin]);

  const step = STEPS[stepIndex];
  const isFirstStep =
    findNavigableModalGuideStep(STEPS, stepIndex - 1, -1, isTargetPresent) < 0;
  const isLastStep =
    findNavigableModalGuideStep(STEPS, stepIndex + 1, 1, isTargetPresent) < 0;

  
  useEffect(() => {
    if (!isVisible || !step.targetSelector) return;
    getModalGuideTargetElement(step.targetSelector)?.scrollIntoView({
      block: 'center',
    });
  }, [isVisible, step]);

  const { targetRect, isWaitingForTarget } = useModalGuideTarget(
    step.targetSelector,
    isVisible
  );

  const moveTo = useCallback((direction: 1 | -1) => {
    setStepIndex((current) => {
      const next = findNavigableModalGuideStep(
        STEPS,
        current + direction,
        direction,
        isTargetPresent
      );
      return next < 0 ? current : next;
    });
  }, []);

  const handlePrimary = useCallback(() => {
    if (isWaitingForTarget) return;
    if (isLastStep) {
      finish('completed');
      return;
    }
    moveTo(1);
  }, [finish, isLastStep, isWaitingForTarget, moveTo]);

  const handleBack = useCallback(() => moveTo(-1), [moveTo]);
  const handleSkip = useCallback(() => finish('skipped'), [finish]);

  
  
  
  const navigableSteps: number[] = [];
  for (
    let index = findNavigableModalGuideStep(STEPS, 0, 1, isTargetPresent);
    index >= 0;
    index = findNavigableModalGuideStep(STEPS, index + 1, 1, isTargetPresent)
  ) {
    navigableSteps.push(index);
  }
  
  
  const stepsBefore = navigableSteps.filter(
    (index) => index < stepIndex
  ).length;
  const total = navigableSteps.includes(stepIndex)
    ? navigableSteps.length
    : navigableSteps.length + 1;

  return (
    <>
      <span ref={sentinelRef} hidden />
      {isVisible && portalTarget && (
        <ModalGuideOverlay
          titleId={titleId}
          title={t(step.titleKey)}
          description={t(step.descriptionKey)}
          stepNumber={stepsBefore + 1}
          stepCount={total}
          placement={step.placement}
          targetRect={targetRect}
          isWaitingForTarget={isWaitingForTarget}
          isFirstStep={isFirstStep}
          isLastStep={isLastStep}
          onPrimary={handlePrimary}
          onBack={handleBack}
          onSkip={handleSkip}
          portalTarget={portalTarget}
        />
      )}
    </>
  );
};
