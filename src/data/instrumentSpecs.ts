


export interface FuturesSpec {
  
  dollarPerPoint: number;
  
  tickSize: number;
  
  tickValue: number;
  
  name: string;
  
  exchange?: string;
}


export interface ForexSpec {
  
  lotSize: number;
  
  pipValue: number;
  
  pipSize: number;
  
  name: string;
}


export const FUTURES_SPECS: Record<string, FuturesSpec> = {
  
  ES: {
    dollarPerPoint: 50,
    tickSize: 0.25,
    tickValue: 12.5,
    name: 'E-Mini S&P 500',
    exchange: 'CME',
  },
  MES: {
    dollarPerPoint: 5,
    tickSize: 0.25,
    tickValue: 1.25,
    name: 'Micro E-Mini S&P 500',
    exchange: 'CME',
  },
  NQ: {
    dollarPerPoint: 20,
    tickSize: 0.25,
    tickValue: 5.0,
    name: 'E-Mini NASDAQ-100',
    exchange: 'CME',
  },
  MNQ: {
    dollarPerPoint: 2,
    tickSize: 0.25,
    tickValue: 0.5,
    name: 'Micro E-Mini NASDAQ-100',
    exchange: 'CME',
  },
  YM: {
    dollarPerPoint: 5,
    tickSize: 1.0,
    tickValue: 5.0,
    name: 'E-Mini Dow',
    exchange: 'CBOT',
  },
  MYM: {
    dollarPerPoint: 0.5,
    tickSize: 1.0,
    tickValue: 0.5,
    name: 'Micro E-Mini Dow',
    exchange: 'CBOT',
  },
  RTY: {
    dollarPerPoint: 50,
    tickSize: 0.1,
    tickValue: 5.0,
    name: 'E-Mini Russell 2000',
    exchange: 'CME',
  },
  M2K: {
    dollarPerPoint: 5,
    tickSize: 0.1,
    tickValue: 0.5,
    name: 'Micro E-Mini Russell 2000',
    exchange: 'CME',
  },

  
  CL: {
    dollarPerPoint: 1000,
    tickSize: 0.01,
    tickValue: 10.0,
    name: 'Crude Oil',
    exchange: 'NYMEX',
  },
  MCL: {
    dollarPerPoint: 100,
    tickSize: 0.01,
    tickValue: 1.0,
    name: 'Micro Crude Oil',
    exchange: 'NYMEX',
  },
  NG: {
    dollarPerPoint: 10000,
    tickSize: 0.001,
    tickValue: 10.0,
    name: 'Natural Gas',
    exchange: 'NYMEX',
  },
  RB: {
    dollarPerPoint: 42000,
    tickSize: 0.0001,
    tickValue: 4.2,
    name: 'RBOB Gasoline',
    exchange: 'NYMEX',
  },
  HO: {
    dollarPerPoint: 42000,
    tickSize: 0.0001,
    tickValue: 4.2,
    name: 'Heating Oil',
    exchange: 'NYMEX',
  },

  
  GC: {
    dollarPerPoint: 100,
    tickSize: 0.1,
    tickValue: 10.0,
    name: 'Gold',
    exchange: 'COMEX',
  },
  MGC: {
    dollarPerPoint: 10,
    tickSize: 0.1,
    tickValue: 1.0,
    name: 'Micro Gold',
    exchange: 'COMEX',
  },
  SI: {
    dollarPerPoint: 5000,
    tickSize: 0.005,
    tickValue: 25.0,
    name: 'Silver',
    exchange: 'COMEX',
  },
  HG: {
    dollarPerPoint: 25000,
    tickSize: 0.0005,
    tickValue: 12.5,
    name: 'Copper',
    exchange: 'COMEX',
  },
  PL: {
    dollarPerPoint: 50,
    tickSize: 0.1,
    tickValue: 5.0,
    name: 'Platinum',
    exchange: 'NYMEX',
  },

  
  ZC: {
    dollarPerPoint: 50,
    tickSize: 0.25,
    tickValue: 12.5,
    name: 'Corn',
    exchange: 'CBOT',
  },
  ZS: {
    dollarPerPoint: 50,
    tickSize: 0.25,
    tickValue: 12.5,
    name: 'Soybeans',
    exchange: 'CBOT',
  },
  ZW: {
    dollarPerPoint: 50,
    tickSize: 0.25,
    tickValue: 12.5,
    name: 'Wheat',
    exchange: 'CBOT',
  },

  
  '6E': {
    dollarPerPoint: 12.5,
    tickSize: 0.00005,
    tickValue: 6.25,
    name: 'Euro FX',
    exchange: 'CME',
  },
  M6E: {
    dollarPerPoint: 1.25,
    tickSize: 0.00005,
    tickValue: 0.625,
    name: 'Micro Euro FX',
    exchange: 'CME',
  },
  '6B': {
    dollarPerPoint: 6.25,
    tickSize: 0.0001,
    tickValue: 6.25,
    name: 'British Pound',
    exchange: 'CME',
  },
  M6B: {
    dollarPerPoint: 0.625,
    tickSize: 0.0001,
    tickValue: 0.625,
    name: 'Micro British Pound',
    exchange: 'CME',
  },
  '6J': {
    dollarPerPoint: 12.5,
    tickSize: 0.0000005,
    tickValue: 6.25,
    name: 'Japanese Yen',
    exchange: 'CME',
  },
  M6J: {
    dollarPerPoint: 1.25,
    tickSize: 0.0000005,
    tickValue: 0.625,
    name: 'Micro Japanese Yen',
    exchange: 'CME',
  },
  '6A': {
    dollarPerPoint: 10,
    tickSize: 0.0001,
    tickValue: 10,
    name: 'Australian Dollar',
    exchange: 'CME',
  },
  M6A: {
    dollarPerPoint: 1,
    tickSize: 0.0001,
    tickValue: 1,
    name: 'Micro Australian Dollar',
    exchange: 'CME',
  },
  '6C': {
    dollarPerPoint: 10,
    tickSize: 0.00005,
    tickValue: 5,
    name: 'Canadian Dollar',
    exchange: 'CME',
  },
  M6C: {
    dollarPerPoint: 1,
    tickSize: 0.00005,
    tickValue: 0.5,
    name: 'Micro Canadian Dollar',
    exchange: 'CME',
  },
  '6S': {
    dollarPerPoint: 12.5,
    tickSize: 0.0001,
    tickValue: 12.5,
    name: 'Swiss Franc',
    exchange: 'CME',
  },
  M6S: {
    dollarPerPoint: 1.25,
    tickSize: 0.0001,
    tickValue: 1.25,
    name: 'Micro Swiss Franc',
    exchange: 'CME',
  },

  
  ZN: {
    dollarPerPoint: 1000,
    tickSize: 0.015625,
    tickValue: 15.625,
    name: '10-Year T-Note',
    exchange: 'CBOT',
  },
  ZB: {
    dollarPerPoint: 1000,
    tickSize: 0.03125,
    tickValue: 31.25,
    name: '30-Year T-Bond',
    exchange: 'CBOT',
  },
  ZF: {
    dollarPerPoint: 1000,
    tickSize: 0.0078125,
    tickValue: 7.8125,
    name: '5-Year T-Note',
    exchange: 'CBOT',
  },
};


export const FOREX_SPECS: Record<string, ForexSpec> = {
  EURUSD: {
    lotSize: 100000,
    pipValue: 10.0,
    pipSize: 0.0001,
    name: 'Euro / US Dollar',
  },
  GBPUSD: {
    lotSize: 100000,
    pipValue: 10.0,
    pipSize: 0.0001,
    name: 'British Pound / US Dollar',
  },
  USDJPY: {
    lotSize: 100000,
    pipValue: 9.09,
    pipSize: 0.01,
    name: 'US Dollar / Japanese Yen',
  },
  USDCHF: {
    lotSize: 100000,
    pipValue: 11.0,
    pipSize: 0.0001,
    name: 'US Dollar / Swiss Franc',
  },
  AUDUSD: {
    lotSize: 100000,
    pipValue: 10.0,
    pipSize: 0.0001,
    name: 'Australian Dollar / US Dollar',
  },
  USDCAD: {
    lotSize: 100000,
    pipValue: 7.5,
    pipSize: 0.0001,
    name: 'US Dollar / Canadian Dollar',
  },
  NZDUSD: {
    lotSize: 100000,
    pipValue: 10.0,
    pipSize: 0.0001,
    name: 'New Zealand Dollar / US Dollar',
  },
  EURGBP: {
    lotSize: 100000,
    pipValue: 13.0,
    pipSize: 0.0001,
    name: 'Euro / British Pound',
  },
  EURJPY: {
    lotSize: 100000,
    pipValue: 9.09,
    pipSize: 0.01,
    name: 'Euro / Japanese Yen',
  },
  GBPJPY: {
    lotSize: 100000,
    pipValue: 9.09,
    pipSize: 0.01,
    name: 'British Pound / Japanese Yen',
  },
  XAUUSD: {
    lotSize: 100,
    pipValue: 10.0,
    pipSize: 0.01,
    name: 'Gold / US Dollar',
  },
};
