import React, {
  createContext,
  use,
  useCallback,
  useEffect,
  useInsertionEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from 'react';
import { WorkspaceLeaf } from 'obsidian';
import { createPortal } from 'react-dom';
import { getPluginInstance } from '../utils/pluginContext';
import {
  resolveContextualGuideId,
  type ContextualGuideCandidate,
} from './contextualGuideResolution';
import { GuideDefinition, GuideStepDefinition } from './types';
import { guidesRequireResolution } from './GuideRegistry';
import { cssVars } from '../styles/inlineStylePolicy';
import { t } from '../lang/helpers';
import {
  getAnchoredPopoverPosition,
  getWindowViewport,
  type GuideViewport,
} from './viewGuidePopoverPosition';
import { trackElementRects } from './trackElementRects';
import {
  GuideStepProgressBar,
  useMeasuredPopoverHeight,
} from './GuidePopoverParts';
import {
  VIEW_GUIDE_BLOCKING_SELECTOR,
  VIEW_GUIDE_SUSPENDING_SELECTOR,
} from './suspendViewGuides';

interface GuideRuntimeLayerProps {
  
  leaf: WorkspaceLeaf | null;
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
  registerContextValue: (key: string, value: string | number | boolean) => void;
  notifyAction: (actionId: string) => void;
  registerBackHandler: (handler: GuideBackHandler) => () => void;
  
  leaf: WorkspaceLeaf | null;
  
  setResolvedGuide: (guideId: string | null) => void;
}


interface GuideStepContextValue {
  currentStepId: string | null;
  
  isVisible: boolean;
}

const GuideRuntimeContext = createContext<GuideRuntimeContextValue | null>(
  null
);

const GuideStepContext = createContext<GuideStepContextValue | null>(null);

const NOOP = (): void => {
  // intentional
};

interface ViewGuideSuspension {
  
  hidden: boolean;
  
  blocked: boolean;
}


const readViewGuideSuspension = (doc: Document): ViewGuideSuspension => ({
  hidden: doc.querySelector(VIEW_GUIDE_SUSPENDING_SELECTOR) !== null,
  blocked: doc.querySelector(VIEW_GUIDE_BLOCKING_SELECTOR) !== null,
});


const getLeafDocument = (leaf: WorkspaceLeaf | null): Document =>
  leaf?.view.containerEl?.ownerDocument ?? window.activeDocument;

const useViewGuideSuspension = (
  leaf: WorkspaceLeaf | null
): ViewGuideSuspension => {
  const doc = getLeafDocument(leaf);
  const [suspension, setSuspension] = useState(() =>
    readViewGuideSuspension(doc)
  );

  useEffect(() => {
    if (!leaf) return;
    const update = () => {
      const next = readViewGuideSuspension(doc);
      setSuspension((previous) =>
        previous.hidden === next.hidden && previous.blocked === next.blocked
          ? previous
          : next
      );
    };
    update();
    const observer = new MutationObserver(update);
    observer.observe(doc.body, {
      childList: true,
      subtree: true,
    });
    return () => observer.disconnect();
  }, [doc, leaf]);

  return suspension;
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

export const resolveGuidePrimaryClickTarget = (
  target: HTMLElement
): HTMLElement | null => {
  const explicitPrimaryTarget = target.matches('[data-guide-primary-action]')
    ? target
    : target.querySelector<HTMLElement>('[data-guide-primary-action]');
  if (explicitPrimaryTarget) {
    return explicitPrimaryTarget;
  }

  const controlledElementId = target.getAttribute('aria-controls');
  if (controlledElementId) {
    const controlledElement =
      target.ownerDocument.getElementById(controlledElementId);
    const controlledPrimaryTarget = controlledElement?.matches(
      '[data-guide-primary-action]'
    )
      ? controlledElement
      : controlledElement?.querySelector<HTMLElement>(
          '[data-guide-primary-action]'
        );
    if (controlledPrimaryTarget) {
      return controlledPrimaryTarget;
    }
  }

  return target.matches('button, [role="button"], input, select, a')
    ? target
    : target.querySelector<HTMLElement>(
        'button, [role="button"], input, select, a'
      );
};

const resolveGuideForLeaf = (
  viewType: string,
  resolvedGuideId: string | null,
  guideIds: string[],
  viewResolvesGuide: boolean,
  getGuideById: (guideId: string) => GuideDefinition | null,
  getPrimaryGuideForView: (targetViewType: string) => GuideDefinition | null
): GuideDefinition | null => {
  if (!viewResolvesGuide) {
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

export const useGuideContextValue = (
  key: string,
  value: string | number | boolean
): void => {
  const context = use(GuideRuntimeContext);

  useEffect(() => {
    context?.registerContextValue(key, value);
  }, [context, key, value]);
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
  const context = use(GuideStepContext);
  return context?.currentStepId ?? null;
};


export const useGuideLeaf = (): WorkspaceLeaf | null => {
  const context = use(GuideRuntimeContext);
  return context?.leaf ?? null;
};


export const useVisibleGuideStepId = (): string | null => {
  const context = use(GuideStepContext);
  return context?.isVisible ? context.currentStepId : null;
};


export const useResolvedViewGuide = (guideId: string | null): void => {
  const context = use(GuideRuntimeContext);
  const setResolvedGuide = context?.setResolvedGuide ?? null;

  useEffect(() => {
    if (!setResolvedGuide) return;
    setResolvedGuide(guideId);
  }, [guideId, setResolvedGuide]);

  useEffect(() => {
    return () => {
      setResolvedGuide?.(null);
    };
  }, [setResolvedGuide]);
};


export const useContextualGuideResolution = ({
  baseGuideId,
  contextualGuides,
}: {
  baseGuideId: string;
  contextualGuides: readonly ContextualGuideCandidate[];
}): void => {
  const context = use(GuideRuntimeContext);
  const plugin = getPluginInstance();
  const guideService = plugin?.viewGuideService ?? null;
  const leaf = context?.leaf ?? null;
  const setResolvedGuide = context?.setResolvedGuide ?? null;

  const subscribeToGuideChanges = useCallback(
    (listener: () => void) =>
      guideService?.subscribe(listener) ?? (() => undefined),
    [guideService]
  );
  const getGuideStateSnapshot = useCallback(() => {
    if (!guideService || !leaf) return '';
    return [baseGuideId, ...contextualGuides.map((c) => c.guideId)]
      .map((guideId) => {
        const state = guideService.getPersistedGuideState(guideId);
        const session = guideService.getSessionForGuideAndLeaf(guideId, leaf);
        return `${guideId}:${state?.status ?? ''}:${session?.status ?? ''}`;
      })
      .join('|');
  }, [baseGuideId, contextualGuides, guideService, leaf]);
  const guideStateSnapshot = useSyncExternalStore(
    subscribeToGuideChanges,
    getGuideStateSnapshot,
    () => ''
  );

  const resolvedGuideId = useMemo(() => {
    void guideStateSnapshot;
    if (!guideService || !leaf) return null;
    const activeSessionGuideId =
      [baseGuideId, ...contextualGuides.map((c) => c.guideId)]
        .map((guideId) => guideService.getSessionForGuideAndLeaf(guideId, leaf))
        .find((session) => session && session.status !== 'ended')?.guideId ??
      null;
    return resolveContextualGuideId({
      baseGuideId,
      contextualGuides,
      activeSessionGuideId,
      getPersistedState: (guideId) =>
        guideService.getPersistedGuideState(guideId),
    });
  }, [baseGuideId, contextualGuides, guideService, guideStateSnapshot, leaf]);

  useEffect(() => {
    if (!setResolvedGuide || !resolvedGuideId) return;
    setResolvedGuide(resolvedGuideId);
  }, [resolvedGuideId, setResolvedGuide]);

  useEffect(() => {
    return () => {
      setResolvedGuide?.(null);
    };
  }, [setResolvedGuide]);
};

const OFFSCREEN_MARGIN = 24;

const isTargetOffscreen = (
  targetRect: DOMRect,
  viewport: GuideViewport
): boolean => {
  return (
    targetRect.bottom < OFFSCREEN_MARGIN ||
    targetRect.top > viewport.height - OFFSCREEN_MARGIN ||
    targetRect.right < OFFSCREEN_MARGIN ||
    targetRect.left > viewport.width - OFFSCREEN_MARGIN
  );
};

const getOffscreenDirection = (
  targetRect: DOMRect,
  viewport: GuideViewport
): 'up' | 'down' | 'side' => {
  if (targetRect.bottom < OFFSCREEN_MARGIN) {
    return 'up';
  }

  if (targetRect.top > viewport.height - OFFSCREEN_MARGIN) {
    return 'down';
  }

  return 'side';
};

function useGuideRuntimeModel({
  leaf,
  viewType,
  viewGuidesHidden,
  viewGuidesBlocked,
}: Omit<GuideRuntimeLayerProps, 'children'> & {
  viewGuidesHidden: boolean;
  viewGuidesBlocked: boolean;
}) {
  const plugin = getPluginInstance();
  const guideService = plugin?.viewGuideService;
  const guideRegistry = plugin?.guideRegistry;
  const targetsRef = useRef(new Map<string, HTMLElement>());
  const [resolutionOwner] = useState(() => Symbol('guide-runtime-resolution'));
  const contextValuesRef = useRef(new Map<string, string | number | boolean>());
  const backHandlersRef = useRef(new Set<GuideBackHandler>());
  const [, setVersion] = useState(0);

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
  const autoShowSuppressed = guideService?.isAutoShowSuppressed() ?? false;
  const guidesForView = guideRegistry?.getGuidesForView(viewType) || [];
  const guideIdsForView = guidesForView.map((candidate) => candidate.id);

  const runningSession = leaf
    ? (guideService?.getSessionForLeaf(leaf, viewType) ?? null)
    : null;

  const resolvedGuideId = leaf
    ? (guideService?.getResolvedGuideForLeaf(leaf, resolutionOwner) ?? null)
    : null;

  
  
  const viewResolvesGuide = guidesRequireResolution(guidesForView);

  const resolvedGuide =
    leaf && guideRegistry
      ? resolveGuideForLeaf(
          viewType,
          resolvedGuideId,
          guideIdsForView,
          viewResolvesGuide,
          (guideId) => guideRegistry.getGuideById(guideId),
          (targetViewType) =>
            guideRegistry.getPrimaryGuideForView(targetViewType)
        )
      : null;

  const resolvedSession =
    leaf && viewResolvesGuide && resolvedGuide && guideService
      ? (guideService.getSessionForGuideAndLeaf?.(resolvedGuide.id, leaf) ??
        null)
      : null;

  const shouldUseRunningSession =
    !!runningSession &&
    (!viewResolvesGuide ||
      (resolvedGuide !== null && runningSession.guideId === resolvedGuide.id));

  const session = shouldUseRunningSession
    ? runningSession
    : viewResolvesGuide
      ? resolvedSession
      : null;

  const guide =
    viewResolvesGuide && !resolvedGuide
      ? null
      : session
        ? (guideRegistry?.getGuideById(session.guideId) ?? null)
        : resolvedGuide;

  
  
  const canControlGuide = useCallback(
    () =>
      !viewResolvesGuide ||
      (!!leaf &&
        !!guide &&
        guideService?.getResolvedGuideForLeaf(leaf, resolutionOwner) ===
          guide.id),
    [guide, guideService, leaf, resolutionOwner, viewResolvesGuide]
  );

  useEffect(() => {
    if (
      !leaf ||
      !guide ||
      !guideService ||
      !guide.autoShow ||
      autoShowSuppressed ||
      !canControlGuide()
    ) {
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
  }, [
    activeLeaf,
    autoShowSuppressed,
    canControlGuide,
    guide,
    guideService,
    leaf,
    session,
  ]);

  const visible =
    !!guide && !!session && !!guideService?.isSessionVisible(session.sessionId);

  const currentStep =
    guide && session ? getStepById(guide.steps, session.currentStepId) : null;

  const stepIndex =
    guide && session ? getStepIndex(guide.steps, session.currentStepId) : -1;

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

  const registerContextValue = useCallback(
    (key: string, value: string | number | boolean) => {
      if (contextValuesRef.current.get(key) === value) {
        return;
      }

      contextValuesRef.current.set(key, value);
      setVersion((prev) => prev + 1);
    },
    []
  );

  const isStepAvailable = useCallback((step: GuideStepDefinition): boolean => {
    const requirement = step.requiredContext;
    if (!requirement) {
      return true;
    }

    const value = contextValuesRef.current.get(requirement.key);
    if (requirement.equals !== undefined && value !== requirement.equals) {
      return false;
    }

    if (
      requirement.minNumber !== undefined &&
      (typeof value !== 'number' || value < requirement.minNumber)
    ) {
      return false;
    }

    return true;
  }, []);

  const hasMountedTarget = useCallback(
    (step: GuideStepDefinition): boolean =>
      !step.targetId ||
      !!targetsRef.current.get(step.targetId) ||
      !!externalTargets.get(step.targetId),
    []
  );

  
  const isStepReachable = useCallback(
    (step: GuideStepDefinition): boolean =>
      isStepAvailable(step) &&
      (!step.skipIfTargetMissing || hasMountedTarget(step)),
    [hasMountedTarget, isStepAvailable]
  );

  const findAvailableStepIndex = useCallback(
    (
      fromIndex: number,
      direction: 1 | -1,
      options: { skipMissingTargets: boolean } = { skipMissingTargets: true }
    ): number => {
      if (!guide) {
        return -1;
      }

      for (
        let index = fromIndex;
        index >= 0 && index < guide.steps.length;
        index += direction
      ) {
        const step = guide.steps[index];
        const reachable = options.skipMissingTargets
          ? isStepReachable(step)
          : isStepAvailable(step);
        if (reachable) {
          return index;
        }
      }

      return -1;
    },
    [guide, isStepAvailable, isStepReachable]
  );

  
  
  
  const isLastStep =
    !!guide &&
    stepIndex >= 0 &&
    isStepAvailable(guide.steps[stepIndex]) &&
    findAvailableStepIndex(stepIndex + 1, 1) < 0;

  
  
  const reachableSteps = guide
    ? guide.steps.filter(
        (step, index) =>
          index === stepIndex ||
          (isStepAvailable(step) &&
            (!step.skipIfTargetMissing || hasMountedTarget(step)))
      )
    : [];
  const reachableIndex = currentStep ? reachableSteps.indexOf(currentStep) : -1;

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

  const updateTargetRect = useCallback((rect: DOMRect | null) => {
    setTargetRect(rect);
  }, []);

  useEffect(() => {
    if (!visible || !currentStep?.targetId) {
      updateTargetRect(null);
      return;
    }

    const target = getTargetElement(currentStep.targetId);
    if (!target) {
      updateTargetRect(null);
      return;
    }

    return trackElementRects([target], ([rect]) => {
      updateTargetRect(rect);
    });
  }, [
    currentStep?.targetId,
    getTargetElement,
    targetVersion,
    updateTargetRect,
    visible,
  ]);

  const advanceStep = useCallback(async () => {
    if (
      !guideService ||
      !guide ||
      !session ||
      stepIndex < 0 ||
      !canControlGuide()
    ) {
      return;
    }

    
    
    
    
    
    const currentStepKey = `${session.sessionId}:${guide.steps[stepIndex].id}`;
    if (lastAdvancedStepKeyRef.current === currentStepKey) {
      return;
    }

    lastAdvancedStepKeyRef.current = currentStepKey;

    try {
      if (isLastStep) {
        await guideService.completeSession(session.sessionId);
        return;
      }

      
      
      
      const nextStepIndex = findAvailableStepIndex(stepIndex + 1, 1, {
        skipMissingTargets:
          guide.steps[stepIndex]?.progression !== 'action-required',
      });
      const nextStep = nextStepIndex >= 0 ? guide.steps[nextStepIndex] : null;
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
  }, [
    canControlGuide,
    findAvailableStepIndex,
    guideService,
    guide,
    session,
    stepIndex,
    isLastStep,
  ]);

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

  
  
  
  
  
  
  
  
  
  
  
  const latestNotifyActionRef = useRef(notifyAction);
  useInsertionEffect(() => {
    latestNotifyActionRef.current = notifyAction;
  });
  const stableNotifyAction = useCallback((actionId: string) => {
    latestNotifyActionRef.current(actionId);
  }, []);

  
  
  const guideDocument = getLeafDocument(leaf);
  const viewport = getWindowViewport(guideDocument.defaultView ?? window);
  const targetIsOffscreen =
    !!targetRect && isTargetOffscreen(targetRect, viewport);
  const offscreenDirection = targetRect
    ? getOffscreenDirection(targetRect, viewport)
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
    if (
      !guideService ||
      !guide ||
      !session ||
      isFirstStep ||
      !canControlGuide()
    ) {
      return;
    }

    const previousStepIndex = findAvailableStepIndex(stepIndex - 1, -1);
    const previousStep =
      previousStepIndex >= 0 ? guide.steps[previousStepIndex] : null;
    if (!previousStep) {
      return;
    }

    const runBack = async () => {
      try {
        const transition = {
          fromStepId: session.currentStepId,
          toStepId: previousStep.id,
          guideId: guide.id,
        };
        let targetStepId = previousStep.id;
        for (const handler of backHandlersRef.current) {
          const result = await handler({
            ...transition,
            toStepId: targetStepId,
          });
          if (result?.toStepId) {
            targetStepId = result.toStepId;
          }
        }
        lastAdvancedStepKeyRef.current = null;
        await guideService.updateSessionStep(session.sessionId, targetStepId);
      } catch (error) {
        lastAdvancedStepKeyRef.current = null;
        console.error('[ViewGuide] Failed to move to previous step:', error);
      }
    };

    void runBack();
  }, [
    canControlGuide,
    findAvailableStepIndex,
    guideService,
    guide,
    session,
    isFirstStep,
    stepIndex,
  ]);

  useEffect(() => {
    if (!visible || !currentStep || isStepAvailable(currentStep)) {
      return;
    }

    void advanceStep();
  }, [advanceStep, currentStep, isStepAvailable, visible]);

  const handlePrimaryClick = useCallback(() => {
    if (!currentStep || isWaitingForTarget || !canControlGuide()) {
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

    const clickableTarget = resolveGuidePrimaryClickTarget(target);

    clickableTarget?.click();
  }, [
    advanceStep,
    canControlGuide,
    currentStep,
    getTargetElement,
    isWaitingForTarget,
    scrollTargetIntoView,
    showOffscreenPrompt,
  ]);

  const handleSkip = useCallback(() => {
    if (!guideService || !session || !canControlGuide()) {
      return;
    }

    
    
    
    
    for (const step of guide?.steps ?? []) {
      step.onDismiss?.();
    }

    void guideService.skipSession(session.sessionId);
  }, [canControlGuide, guide, guideService, session]);

  const handleStepAction = useCallback(() => {
    if (
      !currentStep?.action ||
      !guideService ||
      !session ||
      !canControlGuide()
    ) {
      return;
    }

    currentStep.action.run();
    void guideService.completeSession(session.sessionId);
  }, [canControlGuide, currentStep, guideService, session]);

  const handleStepDismiss = useCallback(() => {
    if (!canControlGuide()) return;
    currentStep?.onDismiss?.();
    void advanceStep();
  }, [advanceStep, canControlGuide, currentStep]);

  useEffect(() => {
    
    
    if (
      !visible ||
      viewGuidesHidden ||
      !isWaitingForTarget ||
      !currentStep?.targetId
    ) {
      return;
    }

    if (currentStep.skipIfTargetMissing === false) {
      return;
    }

    
    
    const timeout = window.setTimeout(() => {
      void advanceStep();
    }, 600);

    return () => {
      window.clearTimeout(timeout);
    };
  }, [
    advanceStep,
    currentStep?.id,
    currentStep?.skipIfTargetMissing,
    currentStep?.targetId,
    isWaitingForTarget,
    viewGuidesHidden,
    visible,
  ]);

  const [popoverRef, popoverHeight] = useMeasuredPopoverHeight();
  const stepNumber = reachableIndex + 1;
  const stepCount = reachableSteps.length || 1;
  const popoverPosition = (() => {
    if (
      currentStep?.placement === 'center' ||
      currentStep?.placement === 'center-target' ||
      !currentStep?.targetId ||
      !targetRect ||
      showOffscreenPrompt
    ) {
      return {
        mode: 'center' as const,
        top: '50%',
        left: '50%',
        highlight:
          currentStep?.placement === 'center-target' && targetRect
            ? targetRect
            : (null as DOMRect | null),
      };
    }

    const anchored = getAnchoredPopoverPosition(
      targetRect,
      popoverHeight,
      viewport,
      currentStep?.placement
    );

    return {
      mode: 'anchored' as const,
      top: `${anchored.top}px`,
      left: `${anchored.left}px`,
      highlight: targetRect,
    };
  })();

  const setResolvedGuide = useCallback(
    (guideId: string | null) => {
      if (leaf)
        guideService?.setResolvedGuideForLeaf(leaf, guideId, resolutionOwner);
    },
    [guideService, leaf, resolutionOwner]
  );

  const contextValue = useMemo<GuideRuntimeContextValue>(
    () => ({
      registerTarget,
      registerContextValue,
      notifyAction: stableNotifyAction,
      registerBackHandler,
      leaf,
      setResolvedGuide,
    }),
    [
      leaf,
      registerBackHandler,
      registerContextValue,
      registerTarget,
      setResolvedGuide,
      stableNotifyAction,
    ]
  );

  const stepContextValue = useMemo<GuideStepContextValue>(
    () => ({
      currentStepId: currentStep?.id ?? null,
      isVisible: visible && !viewGuidesBlocked,
    }),
    [currentStep?.id, viewGuidesBlocked, visible]
  );

  return {
    contextValue,
    stepContextValue,
    visible,
    currentStep,
    popoverPosition,
    popoverRef,
    guideDocument,
    showOffscreenPrompt,
    isWaitingForTarget,
    offscreenDirection,
    stepNumber,
    stepCount,
    isLastStep,
    isFirstStep,
    handleSkip,
    handleStepAction,
    handleStepDismiss,
    handleBack,
    handlePrimaryClick,
  };
}

export const GuideRuntimeLayer: React.FC<GuideRuntimeLayerProps> = ({
  leaf,
  viewType,
  children,
}) => {
  const suspension = useViewGuideSuspension(leaf);
  const {
    contextValue,
    stepContextValue,
    visible,
    currentStep,
    popoverPosition,
    popoverRef,
    guideDocument,
    showOffscreenPrompt,
    isWaitingForTarget,
    offscreenDirection,
    stepNumber,
    stepCount,
    isLastStep,
    isFirstStep,
    handleSkip,
    handleStepAction,
    handleStepDismiss,
    handleBack,
    handlePrimaryClick,
  } = useGuideRuntimeModel({
    leaf,
    viewType,
    viewGuidesHidden: suspension.hidden,
    viewGuidesBlocked: suspension.blocked,
  });

  return (
    <GuideRuntimeContext.Provider value={contextValue}>
      <GuideStepContext.Provider value={stepContextValue}>
        {children}
      </GuideStepContext.Provider>

      {visible &&
        !suspension.hidden &&
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
              ref={popoverRef}
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
                <GuideStepProgressBar
                  stepNumber={stepNumber}
                  stepCount={stepCount}
                />

                <div className="journalit-view-guide-actions">
                  {currentStep.action ? (
                    <>
                      <button
                        className="journalit-view-guide-button journalit-view-guide-button--secondary"
                        onClick={handleStepDismiss}
                      >
                        {t('guide.action-step.dismiss')}
                      </button>
                      {!isFirstStep && (
                        <button
                          className="journalit-view-guide-button journalit-view-guide-button--back"
                          onClick={handleBack}
                        >
                          {t('button.back')}
                        </button>
                      )}
                      <button
                        className="journalit-view-guide-button journalit-view-guide-button--primary mod-cta"
                        onClick={handleStepAction}
                      >
                        {currentStep.action.label}
                      </button>
                    </>
                  ) : (
                    <>
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
                        className="journalit-view-guide-button journalit-view-guide-button--primary mod-cta"
                        onClick={handlePrimaryClick}
                        disabled={isWaitingForTarget}
                      >
                        {showOffscreenPrompt
                          ? t('guide.scroll-to-target.button')
                          : isLastStep
                            ? t('button.done')
                            : t('button.next')}
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>,
          guideDocument.body
        )}
    </GuideRuntimeContext.Provider>
  );
};
