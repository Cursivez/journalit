

import type { PropFirmSummary } from '../../../../services/propChallenge/types';


function letters(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]/g, '');
}


export function matchFirm(
  typed: string,
  firms: readonly PropFirmSummary[]
): PropFirmSummary | undefined {
  const needle = letters(typed);
  if (needle.length < 3) return undefined;
  
  
  
  
  const exact = firms.find((firm) => letters(firm.name) === needle);
  if (exact) return exact;
  const partial = firms.filter((firm) => {
    const name = letters(firm.name);
    return name.includes(needle) || needle.includes(name);
  });
  return partial.length === 1 ? partial[0] : undefined;
}
