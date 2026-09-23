

export interface ModalGuideStepAvailability {
  targetSelector?: string;
  
  skipIfMissing?: boolean;
}

export function findNavigableModalGuideStep<
  Step extends ModalGuideStepAvailability,
>(
  steps: readonly Step[],
  fromIndex: number,
  direction: 1 | -1,
  isTargetPresent: (selector: string) => boolean
): number {
  for (
    let index = fromIndex;
    index >= 0 && index < steps.length;
    index += direction
  ) {
    const step = steps[index];
    if (
      step.skipIfMissing &&
      step.targetSelector &&
      !isTargetPresent(step.targetSelector)
    ) {
      continue;
    }
    return index;
  }
  return -1;
}
