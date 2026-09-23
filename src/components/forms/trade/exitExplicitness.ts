interface FormExitExplicitnessInput {
  price?: number | null;
  hasExplicitPrice?: boolean;
}

interface FormExitPlaceholderInput {
  price?: number | null;
  size?: number | null;
  hasExplicitPrice?: boolean;
}


export const resolveFormExitExplicitness = (
  exit: FormExitExplicitnessInput,
  useDirectPnLInput?: boolean
): boolean => {
  if (typeof exit.hasExplicitPrice === 'boolean') {
    return exit.hasExplicitPrice;
  }

  if (typeof exit.price !== 'number' || !Number.isFinite(exit.price)) {
    return false;
  }

  return !(useDirectPnLInput === true && exit.price === 0);
};


export const resolveFormHasExplicitExitPrice = (
  exits: ReadonlyArray<FormExitExplicitnessInput>,
  storedValue?: boolean
): boolean | undefined =>
  exits.length > 0
    ? exits.some((exit) => exit.hasExplicitPrice === true)
    : storedValue;


export const isEmptyExitPlaceholder = (
  exit: FormExitPlaceholderInput
): boolean =>
  exit.hasExplicitPrice !== true &&
  (exit.price === undefined || exit.price === null || exit.price === 0) &&
  (exit.size === undefined || exit.size === null || exit.size === 0);
