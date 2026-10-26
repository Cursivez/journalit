import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type JournalitPlugin from '../main';
import {
  normalizeTradeTagColors,
  type TradeLabelColors,
} from '../contexts/TradeLabelColorContext';
import { useEventBus } from './useEventBus';
import { LabelColor } from '../types/labelColor';
import { logger } from '../utils/logger';

export function useTradeLabelColorData(
  plugin: JournalitPlugin | null
): TradeLabelColors {
  const [optionsVersion, setOptionsVersion] = useState(0);
  const [setupColors, setSetupColors] = useState<Record<string, LabelColor>>(
    {}
  );
  const isMountedRef = useRef(true);
  const setupRefreshVersionRef = useRef(0);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const refreshSetupColors = useCallback(async () => {
    const refreshVersion = ++setupRefreshVersionRef.current;
    if (!plugin) {
      setSetupColors({});
      return;
    }

    try {
      const setupService = await plugin.serviceManager.getSetupService();
      const nextColors = await setupService.getSetupLabelColors();
      if (
        !isMountedRef.current ||
        refreshVersion !== setupRefreshVersionRef.current
      )
        return;

      setSetupColors(nextColors);
    } catch (error) {
      logger.debug('Failed to load setup label colors', error);
    }
  }, [plugin]);

  useEffect(() => {
    void refreshSetupColors();
  }, [refreshSetupColors]);

  useEventBus('setup:changed', refreshSetupColors, Boolean(plugin));
  useEventBus(
    'options:changed',
    () => {
      setOptionsVersion((current) => current + 1);
    },
    Boolean(plugin)
  );

  const tagColors = useMemo(() => {
    void optionsVersion;
    return plugin
      ? normalizeTradeTagColors(plugin.optionsService.getTagColors())
      : {};
  }, [optionsVersion, plugin]);

  return useMemo(
    () => ({ setups: setupColors, tags: tagColors }),
    [setupColors, tagColors]
  );
}
