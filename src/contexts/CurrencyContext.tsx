

import React, {
  createContext,
  use,
  ReactNode,
  useEffect,
  useState,
  useCallback,
  useMemo,
} from 'react';
import { CurrencyCode } from '../utils/currencyConfig';
import { usePlugin } from '../hooks/usePlugin';


interface CurrencyContextType {
  
  currency: CurrencyCode;
}


const CurrencyContext = createContext<CurrencyContextType | undefined>(
  undefined
);


interface CurrencyProviderProps {
  children: ReactNode;
}


export const CurrencyProvider: React.FC<CurrencyProviderProps> = ({
  children,
}) => {
  const plugin = usePlugin();

  const getCurrentCurrency = useCallback(
    () => plugin?.settings?.general?.currency || CurrencyCode.USD,
    [plugin]
  );

  const [currency, setCurrency] = useState<CurrencyCode>(getCurrentCurrency);

  
  useEffect(() => {
    const handleCurrencyChange = () => {
      setCurrency(getCurrentCurrency());
    };

    window.addEventListener('journalit-currency-changed', handleCurrencyChange);

    return () => {
      window.removeEventListener(
        'journalit-currency-changed',
        handleCurrencyChange
      );
    };
  }, [getCurrentCurrency]);

  const contextValue: CurrencyContextType = useMemo(
    () => ({ currency }),
    [currency]
  );

  return (
    <CurrencyContext.Provider value={contextValue}>
      {children}
    </CurrencyContext.Provider>
  );
};


export const useCurrency = (): CurrencyContextType => {
  const context = use(CurrencyContext);

  if (context === undefined) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }

  return context;
};
