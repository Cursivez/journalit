

import React, {
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import type JournalitPlugin from '../../main';
import { t } from '../../lang/helpers';
import type { TranslationKey } from '../../lang/locale/en';
import {
  type ModalGuideIdentity,
  type ModalGuideStatus,
  saveModalGuideState,
  shouldAutoShowModalGuide,
} from './modalGuidePersistence';
import {
  getModalGuidePopoverPosition,
  getModalGuideTargetElement,
  type ModalGuidePlacement,
} from './modalGuidePopover';
import { ModalGuideOverlay } from './ModalGuideOverlay';
import { useModalGuideTarget } from './useModalGuideTarget';
import {
  findNavigableModalGuideStep,
  type ModalGuideStepAvailability,
} from './modalGuideSteps';

export interface ModalGuideStep extends ModalGuideStepAvailability {
  id: string;
  titleKey: TranslationKey;
  descriptionKey: TranslationKey;
  placement?: ModalGuidePlacement;
}

interface ModalGuideProps {
  plugin: JournalitPlugin;
  identity: ModalGuideIdentity;
  steps: readonly ModalGuideStep[];
  
  startImmediately?: boolean;
}

const isTargetPresent = (selector: string): boolean =>
  getModalGuideTargetElement(selector) !== null;

export const ModalGuide: React.FC<ModalGuideProps> = ({
  plugin,
  identity,
  steps,
  startImmediately = false,
}) => {
  const titleId = useId();
  const sentinelRef = useRef<HTMLSpanElement | null>(null);
  const [portalTarget, setPortalTarget] = useState<Element | null>(null);
  const [isVisible, setIsVisible] = useState(startImmediately);
  const [stepIndex, setStepIndex] = useState(0);
  const terminalStateRef = useRef(false);

  const findStep = useCallback(
    (from: number, direction: 1 | -1) =>
      findNavigableModalGuideStep(steps, from, direction, isTargetPresent),
    [steps]
  );

  useLayoutEffect(() => {
    if (!isVisible) return;
    setStepIndex((current) => {
      const navigable = findStep(current, 1);
      return navigable < 0 ? current : navigable;
    });
  }, [findStep, isVisible]);

  useEffect(() => {
    setPortalTarget(
      sentinelRef.current?.closest('.modal-container') ??
        window.activeDocument.body
    );
  }, []);

  useEffect(() => {
    if (startImmediately) return;
    let cancelled = false;
    void shouldAutoShowModalGuide(plugin, identity).then((shouldShow) => {
      if (!cancelled && shouldShow) setIsVisible(true);
    });
    return () => {
      cancelled = true;
    };
  }, [identity, plugin, startImmediately]);

  const finish = useCallback(
    (status: ModalGuideStatus) => {
      terminalStateRef.current = true;
      setIsVisible(false);
      void saveModalGuideState(plugin, identity, status);
    },
    [identity, plugin]
  );

  
  
  const isVisibleRef = useRef(isVisible);
  useEffect(() => {
    isVisibleRef.current = isVisible;
  }, [isVisible]);
  useEffect(() => {
    return () => {
      if (isVisibleRef.current && !terminalStateRef.current) {
        void saveModalGuideState(plugin, identity, 'skipped');
      }
    };
  }, [identity, plugin]);

  const step = steps[stepIndex];
  const isFirstStep = findStep(stepIndex - 1, -1) < 0;
  const isLastStep = findStep(stepIndex + 1, 1) < 0;
  const navigableStepIndexes = steps.flatMap((candidate, index) =>
    candidate.skipIfMissing &&
    candidate.targetSelector &&
    !isTargetPresent(candidate.targetSelector)
      ? []
      : [index]
  );
  const navigablePosition = navigableStepIndexes.indexOf(stepIndex);

  useEffect(() => {
    if (!isVisible || !step?.targetSelector) return;
    getModalGuideTargetElement(step.targetSelector)?.scrollIntoView({
      block: 'center',
    });
  }, [isVisible, step]);

  const { targetRect, isWaitingForTarget } = useModalGuideTarget(
    step?.targetSelector,
    isVisible
  );

  const moveTo = useCallback(
    (direction: 1 | -1) => {
      setStepIndex((current) => {
        const next = findStep(current + direction, direction);
        return next < 0 ? current : next;
      });
    },
    [findStep]
  );

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

  const position = useMemo(
    () => getModalGuidePopoverPosition(step?.placement, targetRect),
    [step?.placement, targetRect]
  );

  if (!step) return null;

  return (
    <>
      <span ref={sentinelRef} hidden />
      {isVisible && portalTarget && (
        <ModalGuideOverlay
          titleId={titleId}
          title={t(step.titleKey)}
          description={t(step.descriptionKey)}
          stepLabel={`${Math.max(0, navigablePosition) + 1}/${navigableStepIndexes.length}`}
          position={position}
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
