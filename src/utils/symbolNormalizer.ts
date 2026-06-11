


interface NormalizedSymbol {
  
  baseSymbol: string;

  
  monthCode?: string;

  
  year?: string;

  
  isMicro?: boolean;
}


const MONTH_CODES = [
  'F',
  'G',
  'H',
  'J',
  'K',
  'M',
  'N',
  'Q',
  'U',
  'V',
  'X',
  'Z',
] as const;

const MONTH_CODE_SET = new Set<string>(MONTH_CODES);


const MICRO_PREFIXES = [
  'M2K',
  'MES',
  'MNQ',
  'MYM',
  'MGC',
  'MCL', 
  'M6E',
  'M6B',
  'M6J',
  'M6A',
  'M6C',
  'M6S', 
] as const;


const SORTED_MICRO_PREFIXES = [...MICRO_PREFIXES].sort(
  (a, b) => b.length - a.length
);


const FULL_CONTRACT_REGEX =
  /^(?=.*[A-Z])([A-Z0-9]{1,4})([FGHJKMNQUVXZ])(\d{1,2})$/;


const BASE_ONLY_REGEX = /^(?=.*[A-Z])([A-Z0-9]{1,4})$/;


function normalizeSymbol(symbol: string): NormalizedSymbol | null {
  if (!symbol || typeof symbol !== 'string') {
    return null;
  }

  
  const normalized = symbol.trim().toUpperCase();

  if (normalized.length === 0) {
    return null;
  }

  
  
  for (const prefix of SORTED_MICRO_PREFIXES) {
    if (normalized.startsWith(prefix)) {
      
      const remainder = normalized.substring(prefix.length);

      if (remainder.length === 0) {
        
        return {
          baseSymbol: prefix,
          isMicro: true,
        };
      }

      
      const monthCode = MONTH_CODE_SET.has(remainder[0])
        ? remainder[0]
        : undefined;
      if (monthCode) {
        const yearCandidate = remainder.substring(1);
        const year =
          yearCandidate && /^\d{1,2}$/.test(yearCandidate)
            ? yearCandidate
            : undefined;
        return {
          baseSymbol: prefix,
          monthCode: monthCode,
          year: year,
          isMicro: true,
        };
      }

      
      return null;
    }
  }

  
  
  
  const fullMatch = normalized.match(FULL_CONTRACT_REGEX);

  if (fullMatch) {
    const [, base, month, year] = fullMatch;
    return {
      baseSymbol: base,
      monthCode: month,
      year: year,
      isMicro: false,
    };
  }

  
  
  const baseMatch = normalized.match(BASE_ONLY_REGEX);

  if (baseMatch) {
    return {
      baseSymbol: baseMatch[1],
      isMicro: false,
    };
  }

  return null;
}


export function extractBaseSymbol(symbol: string): string {
  const normalized = normalizeSymbol(symbol);
  return normalized ? normalized.baseSymbol : symbol;
}


