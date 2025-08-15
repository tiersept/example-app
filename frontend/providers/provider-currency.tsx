import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  CurrencyCode,
  DEFAULT_CURRENCY,
  SUPPORTED_CURRENCIES,
} from "../constants/currency";

interface CurrencyContextType {
  currentCurrency: CurrencyCode;
  setCurrency: (currency: CurrencyCode) => void;
  isSupported: (currency: CurrencyCode) => boolean;
  getSupportedCurrencies: () => CurrencyCode[];
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(
  undefined
);

const CURRENCY_STORAGE_KEY = "@banking_app_currency";

export const ProviderCurrency = ({ children }: PropsWithChildren) => {
  const [currentCurrency, setCurrentCurrency] =
    useState<CurrencyCode>(DEFAULT_CURRENCY);

  useEffect(() => {
    // Load saved currency preference on mount
    loadSavedCurrency();
  }, []);

  const loadSavedCurrency = async () => {
    try {
      const savedCurrency = await AsyncStorage.getItem(CURRENCY_STORAGE_KEY);
      if (savedCurrency && isSupported(savedCurrency as CurrencyCode)) {
        setCurrentCurrency(savedCurrency as CurrencyCode);
      }
    } catch (error) {
      console.warn("Failed to load saved currency:", error);
    }
  };

  const setCurrency = async (currency: CurrencyCode) => {
    if (!isSupported(currency)) {
      throw new Error(`Unsupported currency: ${currency}`);
    }

    setCurrentCurrency(currency);

    try {
      await AsyncStorage.setItem(CURRENCY_STORAGE_KEY, currency);
    } catch (error) {
      console.warn("Failed to save currency preference:", error);
    }
  };

  const isSupported = (currency: CurrencyCode): boolean => {
    return Object.keys(SUPPORTED_CURRENCIES).includes(currency);
  };

  const getSupportedCurrencies = (): CurrencyCode[] => {
    return Object.keys(SUPPORTED_CURRENCIES) as CurrencyCode[];
  };

  const value: CurrencyContextType = {
    currentCurrency,
    setCurrency,
    isSupported,
    getSupportedCurrencies,
  };

  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = (): CurrencyContextType => {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error("useCurrency must be used within a CurrencyProvider");
  }
  return context;
};
