

import type { ForexSpec, FuturesSpec } from '../../data/instrumentSpecs';


export interface InstrumentContractFields {
  dollarPerPoint?: number;
  tickSize?: number;
  tickValue?: number;
  pipValue?: number;
  pipSize?: number;
  lotSize?: number;
  contractSize?: number;
}

interface InstrumentSpecLookup {
  getSpecsForSymbol(
    symbol: string,
    assetType: string
  ): FuturesSpec | ForexSpec | { contractSize: number } | null;
}

interface InstrumentCatalogLookup {
  getFuturesDataForInstrument(instrument: string):
    | {
        dollarPerPoint?: number;
        tickSize?: number;
        tickValue?: number;
      }
    | undefined;
  getCfdDataForInstrument(
    instrument: string
  ): { contractSize?: number } | undefined;
}


export const DEFAULT_OPTION_CONTRACT_SIZE = 100;

function futuresDefaults(
  instrument: string,
  specs: InstrumentSpecLookup | undefined,
  catalog: InstrumentCatalogLookup
): InstrumentContractFields {
  const spec = specs?.getSpecsForSymbol(instrument, 'futures');
  if (spec && 'dollarPerPoint' in spec) {
    return {
      dollarPerPoint: spec.dollarPerPoint,
      tickSize: spec.tickSize,
      tickValue: spec.tickValue,
    };
  }
  const data = catalog.getFuturesDataForInstrument(instrument);
  if (!data) return {};
  return {
    dollarPerPoint:
      data.dollarPerPoint !== undefined && data.dollarPerPoint !== 0
        ? data.dollarPerPoint
        : undefined,
    tickSize: data.tickSize,
    tickValue: data.tickValue,
  };
}

function forexDefaults(
  instrument: string,
  specs: InstrumentSpecLookup | undefined
): InstrumentContractFields {
  const spec = specs?.getSpecsForSymbol(instrument, 'forex');
  if (!spec || !('lotSize' in spec) || !('pipValue' in spec)) return {};
  return {
    pipValue: spec.pipValue,
    pipSize: spec.pipSize,
    lotSize: spec.lotSize,
  };
}

function cfdDefaults(
  instrument: string,
  specs: InstrumentSpecLookup | undefined,
  catalog: InstrumentCatalogLookup
): InstrumentContractFields {
  const spec = specs?.getSpecsForSymbol(instrument, 'cfd');
  if (spec && 'contractSize' in spec) {
    return { contractSize: spec.contractSize };
  }
  const contractSize =
    catalog.getCfdDataForInstrument(instrument)?.contractSize;
  return contractSize !== undefined && contractSize > 0 ? { contractSize } : {};
}


export function resolveInstrumentContractDefaults(
  instrument: string,
  assetType: string,
  sources: {
    specs: InstrumentSpecLookup | undefined;
    catalog: InstrumentCatalogLookup;
  }
): InstrumentContractFields {
  switch (assetType) {
    case 'futures':
      return futuresDefaults(instrument, sources.specs, sources.catalog);
    case 'forex':
      return forexDefaults(instrument, sources.specs);
    case 'cfd':
      return cfdDefaults(instrument, sources.specs, sources.catalog);
    case 'options':
      return { contractSize: DEFAULT_OPTION_CONTRACT_SIZE };
    default:
      return {};
  }
}
