import React, {
  createContext,
  use,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { WorkspaceLeaf } from 'obsidian';
import { createPortal } from 'react-dom';
import { getPluginInstance } from '../utils/pluginContext';
import { GuideDefinition, GuideStepDefinition } from './types';
import { cssVars } from '../styles/inlineStylePolicy';
import { t } from '../lang/helpers';

interface GuideRuntimeLayerProps {
  leaf: WorkspaceLeaf;
  viewType: string;
  children: React.ReactNode;
}

interface GuideBackTransition {
  fromStepId: string;
  toStepId: string;
  guideId: string;
}

interface GuideBackResult {
  toStepId?: string;
}

type GuideBackHandler = (
  transition: GuideBackTransition
) => void | GuideBackResult | Promise<void | GuideBackResult>;

interface GuideRuntimeContextValue {
  registerTarget: (targetId: string, element: HTMLElement | null) => void;
  notifyAction: (actionId: string) => void;
  registerBackHandler: (handler: GuideBackHandler) => () => void;
  currentStepId: string | null;
}

const GuideRuntimeContext = createContext<GuideRuntimeContextValue | null>(
  null
);

const NOOP = (): void => {
  // intentional
};

const externalTargets = new Map<string, HTMLElement>();
const externalTargetListeners = new Set<() => void>();

const emitExternalTargetChange = (): void => {
  for (const listener of externalTargetListeners) {
    listener();
  }
};

export const registerExternalGuideTarget = (
  targetId: string,
  element: HTMLElement | null
): void => {
  if (element) {
    externalTargets.set(targetId, element);
  } else {
    externalTargets.delete(targetId);
  }

  emitExternalTargetChange();
};

const getStepById = (
  steps: GuideStepDefinition[],
  stepId: string
): GuideStepDefinition | null => {
  return steps.find((step) => step.id === stepId) || null;
};

const getStepIndex = (steps: GuideStepDefinition[], stepId: string): number => {
  return steps.findIndex((step) => step.id === stepId);
};

const resolveGuideForLeaf = (
  viewType: string,
  resolvedGuideId: string | null,
  guideIds: string[],
  getGuideById: (guideId: string) => GuideDefinition | null,
  getPrimaryGuideForView: (targetViewType: string) => GuideDefinition | null
): GuideDefinition | null => {
  if (guideIds.length <= 1) {
    return getPrimaryGuideForView(viewType);
  }

  if (!resolvedGuideId) {
    return null;
  }

  if (!guideIds.includes(resolvedGuideId)) {
    return null;
  }

  const resolvedGuide = getGuideById(resolvedGuideId);
  if (!resolvedGuide || resolvedGuide.viewType !== viewType) {
    return null;
  }

  return resolvedGuide;
};

const getAnchoredPopoverPosition = (
  targetRect: DOMRect,
  placement: GuideStepDefinition['placement'] = 'auto'
): { top: number; left: number } => {
  const gap = 10;
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;
  const popoverWidth = Math.min(340, viewportWidth - 24);
  const estimatedPopoverHeight = 170;

  if (placement === 'right' || placement === 'right-top') {
    let top =
      placement === 'right-top'
        ? targetRect.top
        : targetRect.top + targetRect.height / 2 - estimatedPopoverHeight / 2;
    let left = targetRect.right + gap;

    if (left + popoverWidth > viewportWidth - 12) {
      left = Math.max(12, targetRect.left - popoverWidth - gap);
    }

    if (top < 12) {
      top = 12;
    }

    if (top + estimatedPopoverHeight > viewportHeight - 12) {
      top = Math.max(12, viewportHeight - estimatedPopoverHeight - 12);
    }

    return { top, left };
  }

  let top = targetRect.bottom + gap;
  let left = targetRect.left;

  if (left + popoverWidth > viewportWidth - 12) {
    left = viewportWidth - popoverWidth - 12;
  }

  if (left < 12) {
    left = 12;
  }

  if (top > viewportHeight - 190) {
    top = Math.max(12, targetRect.top - 160 - gap);
  }

  return { top, left };
};

export const useGuideTarget = (
  targetId: string
): ((element: HTMLElement | null) => void) => {
  const context = use(GuideRuntimeContext);

  return useCallback(
    (element: HTMLElement | null) => {
      context?.registerTarget(targetId, element);
    },
    [context, targetId]
  );
};

export const useGuideAction = (): ((actionId: string) => void) => {
  const context = use(GuideRuntimeContext);
  return context?.notifyAction || NOOP;
};

export const useGuideBackHandler = (handler: GuideBackHandler | null): void => {
  const context = use(GuideRuntimeContext);

  useEffect(() => {
    if (!context || !handler) {
      return;
    }

    return context.registerBackHandler(handler);
  }, [context, handler]);
};

export const useGuideCurrentStepId = (): string | null => {
  const context = use(GuideRuntimeContext);
  return context?.currentStepId ?? null;
};

const OFFSCREEN_MARGIN = 24;

const isTargetOffscreen = (targetRect: DOMRect): boolean => {
  return (
    targetRect.bottom < OFFSCREEN_MARGIN ||
    targetRect.top > window.innerHeight - OFFSCREEN_MARGIN ||
    targetRect.right < OFFSCREEN_MARGIN ||
    targetRect.left > window.innerWidth - OFFSCREEN_MARGIN
  );
};

const getOffscreenDirection = (targetRect: DOMRect): 'up' | 'down' | 'side' => {
  if (targetRect.bottom < OFFSCREEN_MARGIN) {
    return 'up';
  }

  if (targetRect.top > window.innerHeight - OFFSCREEN_MARGIN) {
    return 'down';
  }

  return 'side';
};

function useGuideRuntimeModel({
  leaf,
  viewType,
}: Omit<GuideRuntimeLayerProps, 'children'>) {
  const plugin = getPluginInstance();
  const guideService = plugin?.viewGuideService;
  const guideRegistry = plugin?.guideRegistry;
  const targetsRef = useRef(new Map<string, HTMLElement>());
  const backHandlersRef = useRef(new Set<GuideBackHandler>());
  const [, setVersion] = useState(0);

  useEffect(() => {}, []);

  useEffect(() => {
    if (!guideService) {
      return;
    }

    return guideService.subscribe(() => {
      setVersion((prev) => prev + 1);
    });
  }, [guideService]);

  const [targetVersion, setTargetVersion] = useState(0);
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
  const [offscreenPromptReady, setOffscreenPromptReady] = useState(false);
  const autoScrolledStepRef = useRef<string | null>(null);
  const lastAdvancedStepKeyRef = useRef<string | null>(null);

  const activeLeaf = guideService?.getActiveLeaf() ?? null;
  const guidesForView = guideRegistry?.getGuidesForView(viewType) || [];
  const guideIdsForView = guidesForView.map((candidate) => candidate.id);

  const runningSession =
    guideService?.getSessionForLeaf(leaf, viewType) ?? null;

  const resolvedGuideId = guideService?.getResolvedGuideForLeaf(leaf) ?? null;

  const resolvedGuide = guideRegistry
    ? resolveGuideForLeaf(
        viewType,
        resolvedGuideId,
        guideIdsForView,
        (guideId) => guideRegistry.getGuideById(guideId),
        (targetViewType) => guideRegistry.getPrimaryGuideForView(targetViewType)
      )
    : null;

  const isMultiGuideView = guideIdsForView.length > 1;

  const resolvedSession =
    isMultiGuideView && resolvedGuide && guideService
      ? (guideService.getSessionForGuideAndLeaf?.(resolvedGuide.id, leaf) ??
        null)
      : null;

  const shouldUseRunningSession =
    !!runningSession &&
    (!isMultiGuideView ||
      (resolvedGuide !== null && runningSession.guideId === resolvedGuide.id));

  const session = shouldUseRunningSession
    ? runningSession
    : isMultiGuideView
      ? resolvedSession
      : null;

  const guide =
    isMultiGuideView && !resolvedGuide
      ? null
      : session
        ? (guideRegistry?.getGuideById(session.guideId) ?? null)
        : resolvedGuide;

  useEffect(() => {
    if (!guide || !guideService || !guide.autoShow) {
      return;
    }

    if (activeLeaf !== leaf) {
      return;
    }

    if (session) {
      return;
    }

    if (!guideService.shouldAutoShowGuide(guide.id, guide.version)) {
      return;
    }

    void guideService.startOrResumeSession({
      guideId: guide.id,
      guideVersion: guide.version,
      leaf,
      initialStepId: guide.initialStepId,
    });
  }, [activeLeaf, guide, guideService, leaf, session]);

  const visible =
    !!guide && !!session && !!guideService?.isSessionVisible(session.sessionId);

  const currentStep =
    guide && session ? getStepById(guide.steps, session.currentStepId) : null;

  const stepIndex =
    guide && session ? getStepIndex(guide.steps, session.currentStepId) : -1;

  const isLastStep =
    !!guide && stepIndex >= 0 && stepIndex === guide.steps.length - 1;

  const registerTarget = useCallback(
    (targetId: string, element: HTMLElement | null) => {
      if (element) {
        targetsRef.current.set(targetId, element);
        setTargetVersion((prev) => prev + 1);
        return;
      }

      targetsRef.current.delete(targetId);
      setTargetVersion((prev) => prev + 1);
    },
    []
  );

  const registerBackHandler = useCallback((handler: GuideBackHandler) => {
    backHandlersRef.current.add(handler);
    return () => {
      backHandlersRef.current.delete(handler);
    };
  }, []);

  useEffect(() => {
    const listener = () => {
      setTargetVersion((prev) => prev + 1);
    };

    externalTargetListeners.add(listener);

    return () => {
      externalTargetListeners.delete(listener);
    };
  }, []);

  const getTargetElement = useCallback(
    (targetId: string): HTMLElement | null => {
      return (
        targetsRef.current.get(targetId) ??
        externalTargets.get(targetId) ??
        null
      );
    },
    []
  );

  const isWaitingForTarget =
    !!currentStep?.targetId && !getTargetElement(currentStep.targetId);

  useEffect(() => {
    if (!visible || !currentStep?.targetId) {
      setTargetRect(null);
      return;
    }

    const target = getTargetElement(currentStep.targetId);
    if (!target) {
      setTargetRect(null);
      return;
    }

    const updateRect = () => {
      setTargetRect(target.getBoundingClientRect());
    };

    updateRect();

    const handleWindowUpdate = () => {
      updateRect();
    };

    window.addEventListener('resize', handleWindowUpdate);
    window.addEventListener('scroll', handleWindowUpdate, true);

    const resizeObserver =
      'ResizeObserver' in window
        ? new ResizeObserver(() => {
            updateRect();
          })
        : null;

    if (resizeObserver) {
      resizeObserver.observe(target);
    }

    return () => {
      window.removeEventListener('resize', handleWindowUpdate);
      window.removeEventListener('scroll', handleWindowUpdate, true);
      resizeObserver?.disconnect();
    };
  }, [currentStep?.targetId, getTargetElement, targetVersion, visible]);

  const advanceStep = useCallback(async () => {
    if (!guideService || !guide || !session || stepIndex < 0) {
      return;
    }

    const currentStepKey = `${session.sessionId}:${session.currentStepId}`;
    if (lastAdvancedStepKeyRef.current === currentStepKey) {
      return;
    }

    lastAdvancedStepKeyRef.current = currentStepKey;

    try {
      if (isLastStep) {
        await guideService.completeSession(session.sessionId);
        return;
      }

      const nextStep = guide.steps[stepIndex + 1];
      if (!nextStep) {
        lastAdvancedStepKeyRef.current = null;
        return;
      }

      const updated = await guideService.updateSessionStep(
        session.sessionId,
        nextStep.id
      );

      if (!updated) {
        lastAdvancedStepKeyRef.current = null;
      }
    } catch (error) {
      lastAdvancedStepKeyRef.current = null;
      throw error;
    }
  }, [guideService, guide, session, stepIndex, isLastStep]);

  const notifyAction = useCallback(
    (actionId: string) => {
      if (!currentStep || !session || !guideService) {
        return;
      }

      if (
        !currentStep.requiredActionId ||
        currentStep.requiredActionId !== actionId
      ) {
        return;
      }

      void advanceStep();
    },
    [advanceStep, currentStep, guideService, session]
  );

  const targetIsOffscreen = !!targetRect && isTargetOffscreen(targetRect);
  const offscreenDirection = targetRect
    ? getOffscreenDirection(targetRect)
    : null;

  const scrollTargetIntoView = useCallback(() => {
    if (!currentStep?.targetId) {
      return;
    }

    const target = getTargetElement(currentStep.targetId);
    if (!target) {
      return;
    }

    target.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
      inline: 'nearest',
    });
  }, [currentStep?.targetId, getTargetElement]);

  useEffect(() => {
    setOffscreenPromptReady(false);
    autoScrolledStepRef.current = null;
  }, [currentStep?.id]);

  useEffect(() => {
    if (!visible || !currentStep?.id || !targetIsOffscreen) {
      return;
    }

    if (autoScrolledStepRef.current !== currentStep.id) {
      autoScrolledStepRef.current = currentStep.id;
      scrollTargetIntoView();
    }

    const timeout = window.setTimeout(() => {
      setOffscreenPromptReady(true);
    }, 900);

    return () => {
      window.clearTimeout(timeout);
    };
  }, [currentStep?.id, scrollTargetIntoView, targetIsOffscreen, visible]);

  const showOffscreenPrompt = targetIsOffscreen && offscreenPromptReady;

  const isFirstStep = stepIndex <= 0;

  const handleBack = useCallback(() => {
    if (!guideService || !guide || !session || isFirstStep) {
      return;
    }

    const previousStep = guide.steps[stepIndex - 1];
    if (!previousStep) {
      return;
    }

    const runBack = async () => {
      const transition = {
        fromStepId: session.currentStepId,
        toStepId: previousStep.id,
        guideId: guide.id,
      };
      let targetStepId = previousStep.id;
      for (const handler of backHandlersRef.current) {
        const result = await handler({ ...transition, toStepId: targetStepId });
        if (result?.toStepId) {
          targetStepId = result.toStepId;
        }
      }
      lastAdvancedStepKeyRef.current = null;
      await guideService.updateSessionStep(session.sessionId, targetStepId);
    };

    void runBack();
  }, [guideService, guide, session, isFirstStep, stepIndex]);

  const handlePrimaryClick = useCallback(() => {
    if (!currentStep || isWaitingForTarget) {
      return;
    }

    if (showOffscreenPrompt) {
      scrollTargetIntoView();
      return;
    }

    if (currentStep.progression === 'manual') {
      void advanceStep();
      return;
    }

    if (!currentStep.targetId) {
      return;
    }

    const target = getTargetElement(currentStep.targetId);
    if (!target) {
      return;
    }

    const clickableTarget = target.matches(
      'button, [role="button"], input, select, a'
    )
      ? target
      : target.querySelector<HTMLElement>(
          'button, [role="button"], input, select, a'
        );

    clickableTarget?.click();
  }, [
    advanceStep,
    currentStep,
    getTargetElement,
    isWaitingForTarget,
    scrollTargetIntoView,
    showOffscreenPrompt,
  ]);

  const handleSkip = useCallback(() => {
    if (!guideService || !session) {
      return;
    }

    void guideService.skipSession(session.sessionId);
  }, [guideService, session]);

  useEffect(() => {
    if (!visible || !isWaitingForTarget || !currentStep?.targetId) {
      return;
    }

    if (currentStep.skipIfTargetMissing === false) {
      return;
    }

    const timeout = window.setTimeout(() => {
      void advanceStep();
    }, 2000);

    return () => {
      window.clearTimeout(timeout);
    };
  }, [
    advanceStep,
    currentStep?.id,
    currentStep?.skipIfTargetMissing,
    currentStep?.targetId,
    isWaitingForTarget,
    visible,
  ]);

  const popoverPosition = (() => {
    if (
      currentStep?.placement === 'center' ||
      !currentStep?.targetId ||
      !targetRect ||
      showOffscreenPrompt
    ) {
      return {
        mode: 'center' as const,
        top: '50%',
        left: '50%',
        highlight: null as DOMRect | null,
      };
    }

    const anchored = getAnchoredPopoverPosition(
      targetRect,
      currentStep?.placement
    );

    return {
      mode: 'anchored' as const,
      top: `${anchored.top}px`,
      left: `${anchored.left}px`,
      highlight: targetRect,
    };
  })();

  const contextValue = useMemo<GuideRuntimeContextValue>(
    () => ({
      registerTarget,
      notifyAction,
      registerBackHandler,
      currentStepId: currentStep?.id ?? null,
    }),
    [currentStep?.id, notifyAction, registerBackHandler, registerTarget]
  );

  return {
    contextValue,
    visible,
    currentStep,
    popoverPosition,
    showOffscreenPrompt,
    isWaitingForTarget,
    offscreenDirection,
    stepIndex,
    guide,
    isLastStep,
    isFirstStep,
    handleSkip,
    handleBack,
    handlePrimaryClick,
  };
}

export const GuideRuntimeLayer: React.FC<GuideRuntimeLayerProps> = ({
  leaf,
  viewType,
  children,
}) => {
  const {
    contextValue,
    visible,
    currentStep,
    popoverPosition,
    showOffscreenPrompt,
    isWaitingForTarget,
    offscreenDirection,
    stepIndex,
    guide,
    isLastStep,
    isFirstStep,
    handleSkip,
    handleBack,
    handlePrimaryClick,
  } = useGuideRuntimeModel({ leaf, viewType });

  return (
    <GuideRuntimeContext.Provider value={contextValue}>
      {children}

      {visible &&
        currentStep &&
        createPortal(
          <div className="journalit-view-guide-overlay">
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
              className={`journalit-view-guide-popover ${popoverPosition.mode === 'anchored' ? 'journalit-view-guide-popover--anchored' : ''}`}
              role="dialog"
              aria-labelledby="journalit-view-guide-title"
              style={cssVars({
                '--journalit-guide-popover-top': popoverPosition.top,
                '--journalit-guide-popover-left': popoverPosition.left,
              })}
              onMouseDown={(event) => {
                event.stopPropagation();
              }}
            >
              <h3
                id="journalit-view-guide-title"
                className="journalit-view-guide-title"
              >
                {showOffscreenPrompt
                  ? t('guide.scroll-to-target.title')
                  : currentStep.title}
              </h3>
              <p className="journalit-view-guide-description">
                {isWaitingForTarget
                  ? `${currentStep.description} ${t('common.loading')}`
                  : showOffscreenPrompt
                    ? t(
                        offscreenDirection === 'up'
                          ? 'guide.scroll-to-target.description-up'
                          : offscreenDirection === 'down'
                            ? 'guide.scroll-to-target.description-down'
                            : 'guide.scroll-to-target.description'
                      )
                    : currentStep.description}
              </p>

              <div className="journalit-view-guide-footer">
                <span className="journalit-view-guide-step">
                  {`${stepIndex + 1}/${guide?.steps.length ?? 1}`}
                </span>

                <div className="journalit-view-guide-actions">
                  {!isLastStep && (
                    <button
                      className="journalit-view-guide-button journalit-view-guide-button--secondary"
                      onClick={handleSkip}
                    >
                      {t('guide.skip-guide')}
                    </button>
                  )}
                  {!isFirstStep && (
                    <button
                      className="journalit-view-guide-button journalit-view-guide-button--back"
                      onClick={handleBack}
                    >
                      {t('button.back')}
                    </button>
                  )}
                  <button
                    className="journalit-view-guide-button journalit-view-guide-button--primary"
                    onClick={handlePrimaryClick}
                    disabled={isWaitingForTarget}
                  >
                    {showOffscreenPrompt
                      ? t('guide.scroll-to-target.button')
                      : isLastStep
                        ? t('button.done')
                        : t('button.next')}
                  </button>
                </div>
              </div>
            </div>
          </div>,
          window.activeDocument.body
        )}
    </GuideRuntimeContext.Provider>
  );
};
