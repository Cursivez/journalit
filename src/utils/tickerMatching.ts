


function normalizeTickerForMatching(ticker: string | null | undefined): string {
  return typeof ticker === 'string' ? ticker.trim().toLowerCase() : '';
}


export function createTickerMatcher(
  selectedTickers: string[]
): (instrument: string | null | undefined) => boolean {
  const normalizedSelectedTickers = new Set(
    selectedTickers.flatMap((ticker) => {
      const normalized = normalizeTickerForMatching(ticker);
      return normalized ? [normalized] : [];
    })
  );

  if (normalizedSelectedTickers.size === 0) {
    return () => true;
  }

  return (instrument: string | null | undefined): boolean => {
    const normalizedInstrument = normalizeTickerForMatching(instrument);
    if (!normalizedInstrument) {
      return false;
    }

    return normalizedSelectedTickers.has(normalizedInstrument);
  };
}
