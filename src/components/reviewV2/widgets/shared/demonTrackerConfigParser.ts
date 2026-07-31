import type { DemonTrackerWidgetConfig } from '../../../../types/reviewV2';
import {
  isDemonTrackerStopThreshold,
  isDemonTrackerTrackingMethod,
} from '../../../../types/reviewV2';


export function parseDemonTrackerWidgetConfig(
  source: string
): DemonTrackerWidgetConfig {
  const config: DemonTrackerWidgetConfig = {};

  if (!source.trim()) {
    return config;
  }

  const lines = source.trim().split('\n');
  for (const line of lines) {
    const colonIndex = line.search(/:/);
    if (colonIndex <= 0) {
      continue;
    }

    const key = line.substring(0, colonIndex).trim();
    const value = line.substring(colonIndex + 1).trim();

    if (key === 'trackingMethod' && isDemonTrackerTrackingMethod(value)) {
      config.trackingMethod = value;
    }

    if (key === 'stopThreshold') {
      const stopThreshold = Number(value);
      if (isDemonTrackerStopThreshold(stopThreshold)) {
        config.stopThreshold = stopThreshold;
      }
    }
  }

  return config;
}
