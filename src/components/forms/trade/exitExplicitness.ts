interface FormExitExplicitnessInput {
  price?: number | null;
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
