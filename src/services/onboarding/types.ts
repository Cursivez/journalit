

export const ONBOARDING_VERSION = 1;

export interface OnboardingData {
  version: number;
  completed: boolean;
  completedAt?: number;
  skipped: boolean;
  skippedAt?: number;
}
