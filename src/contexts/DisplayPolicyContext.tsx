

import React, {
  createContext,
  ReactNode,
  use,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  createDisplayPolicy,
  formatDisplayValue,
  shouldMaskValue,
  type DisplayPolicy,
  type DisplayValueKind,
  type DisplayValueOptions,
} from '../services/display/DisplayPolicy';
import { eventBus } from '../services/events';
import { usePlugin } from '../hooks/usePlugin';
import { getPluginInstance } from '../utils/pluginContext';

interface DisplayPolicyContextValue {
  policy: DisplayPolicy;
  formatValue: (options: DisplayValueOptions) => string;
  shouldMask: (kind: DisplayValueKind) => boolean;
}

const DisplayPolicyContext = createContext<DisplayPolicyContextValue | null>(
  null
);

interface DisplayPolicyProviderProps {
  children?: ReactNode;
  privacyModeOverride?: boolean;
}

export const DisplayPolicyProvider: React.FC<DisplayPolicyProviderProps> = ({
  children,
  privacyModeOverride,
}) => {
  const plugin = usePlugin();
  const createCurrentPolicy = useCallback(() => {
    const settings = plugin?.settings ?? getPluginInstance()?.settings ?? {};
    const currentPolicy = createDisplayPolicy(settings);
    return privacyModeOverride === undefined
      ? currentPolicy
      : { ...currentPolicy, privacyMode: privacyModeOverride };
  }, [plugin, privacyModeOverride]);

  const [policy, setPolicy] = useState<DisplayPolicy>(createCurrentPolicy);

  const refreshPolicy = useCallback(() => {
    setPolicy(createCurrentPolicy());
  }, [createCurrentPolicy]);
  const refreshPolicyRef = useRef(refreshPolicy);

  useEffect(() => {
    refreshPolicyRef.current = refreshPolicy;
  }, [refreshPolicy]);

  useEffect(() => {
    refreshPolicy();
  }, [refreshPolicy]);

  useEffect(() => {
    const refreshCurrentPolicy = () => {
      refreshPolicyRef.current();
    };

    const unsubscribe = eventBus.subscribe(
      'settings:changed',
      refreshCurrentPolicy
    );

    window.addEventListener('journalit-currency-changed', refreshCurrentPolicy);

    return () => {
      unsubscribe();
      window.removeEventListener(
        'journalit-currency-changed',
        refreshCurrentPolicy
      );
    };
  }, []);

  const formatValue = useCallback(
    (options: DisplayValueOptions) => formatDisplayValue(options, policy),
    [policy]
  );

  const shouldMask = useCallback(
    (kind: DisplayValueKind) => shouldMaskValue(kind, policy),
    [policy]
  );

  const contextValue = useMemo(
    () => ({ policy, formatValue, shouldMask }),
    [policy, formatValue, shouldMask]
  );

  return (
    <DisplayPolicyContext.Provider value={contextValue}>
      {children}
    </DisplayPolicyContext.Provider>
  );
};

export function useDisplayPolicy(): DisplayPolicy {
  const context = use(DisplayPolicyContext);
  if (!context) {
    throw new Error(
      'useDisplayPolicy must be used within a DisplayPolicyProvider'
    );
  }

  return context.policy;
}

export function useDisplayFormatter(): Pick<
  DisplayPolicyContextValue,
  'formatValue' | 'shouldMask'
> {
  const context = use(DisplayPolicyContext);
  if (!context) {
    throw new Error(
      'useDisplayFormatter must be used within a DisplayPolicyProvider'
    );
  }

  return {
    formatValue: context.formatValue,
    shouldMask: context.shouldMask,
  };
}
