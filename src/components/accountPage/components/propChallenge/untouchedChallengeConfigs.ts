import type { PropChallengeConfig } from '../../../../services/propChallenge/types';


const untouchedConfigs = new WeakSet<PropChallengeConfig>();

export function markUntouchedChallengeConfig<T extends PropChallengeConfig>(
  config: T
): T {
  untouchedConfigs.add(config);
  return config;
}

export function isUntouchedChallengeConfig(
  config: PropChallengeConfig
): boolean {
  return untouchedConfigs.has(config);
}
