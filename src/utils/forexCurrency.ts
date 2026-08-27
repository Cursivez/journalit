import { FOREX_SPECS, type ForexSpec } from '../data/instrumentSpecs';

const FOREX_PAIR_PATTERN = /^([A-Z]{3})[/_-]?([A-Z]{3})[A-Z0-9._-]*$/;
const ISO_CURRENCIES = new Set(
  'AED AFN ALL AMD ANG AOA ARS AUD AWG AZN BAM BBD BDT BGN BHD BIF BMD BND BOB BRL BSD BTN BWP BYN BZD CAD CDF CHF CLP CNY COP CRC CUC CUP CVE CZK DJF DKK DOP DZD EGP ERN ETB EUR FJD FKP GBP GEL GHS GIP GMD GNF GTQ GYD HKD HNL HRK HTG HUF IDR ILS INR IQD IRR ISK JMD JOD JPY KES KGS KHR KMF KPW KRW KWD KYD KZT LAK LBP LKR LRD LSL LYD MAD MDL MGA MKD MMK MNT MOP MRU MUR MVR MWK MXN MYR MZN NAD NGN NIO NOK NPR NZD OMR PAB PEN PGK PHP PKR PLN PYG QAR RON RSD RUB RWF SAR SBD SCR SDG SEK SGD SHP SLE SLL SOS SRD SSP STN SVC SYP SZL THB TJS TMT TND TOP TRY TTD TWD TZS UAH UGX USD UYU UZS VES VND VUV WST XAF XCD XCG XDR XOF XPF XSU YER ZAR ZMW ZWG ZWL'.split(
    ' '
  )
);


export function resolveForexQuoteCurrency(
  instrument: string | undefined,
  spec?: ForexSpec | null
): string | null {
  if (spec?.quoteCurrency) {
    return spec.quoteCurrency;
  }

  const normalized = instrument?.trim().toUpperCase();
  if (!normalized) {
    return null;
  }

  const builtInSpec = FOREX_SPECS[normalized];
  if (builtInSpec?.quoteCurrency) {
    return builtInSpec.quoteCurrency;
  }

  const match = FOREX_PAIR_PATTERN.exec(normalized);
  if (!match || !ISO_CURRENCIES.has(match[2])) {
    return null;
  }

  return match[2];
}
