import { CurrencyCode } from "@/constants/currency";
import { useCurrency } from "@/providers/provider-currency";
import { formatCurrency } from "@/util/currency";
import { useMemo } from "react";

export const useCurrencyFormat = () => {
  const { currentCurrency } = useCurrency();

  const format = useMemo(() => {
    return {
      /**
       * Format amount to currency string
       * @param amount - The amount to format
       * @param currencyCode - Optional currency code (defaults to user's selected currency)
       * @param options - Additional formatting options
       */
      currency: (
        amount: number,
        currencyCode?: CurrencyCode,
        options?: Intl.NumberFormatOptions
      ) => formatCurrency(amount, currencyCode || currentCurrency, options),
    };
  }, [currentCurrency]);

  return {
    currentCurrency,
    format,
  };
};
