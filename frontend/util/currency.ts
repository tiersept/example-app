import { CurrencyCode, SUPPORTED_CURRENCIES } from "@/constants/currency";

/**
 * Formats a number to currency format using Intl.NumberFormat
 * @param amount - The amount to format
 * @param currencyCode - The currency code (e.g., 'USD', 'EUR')
 * @param options - Additional formatting options
 * @returns Formatted currency string
 */
export const formatCurrency = (
  amount: number,
  currencyCode: CurrencyCode = "USD",
  options?: Intl.NumberFormatOptions
): string => {
  const currency = SUPPORTED_CURRENCIES[currencyCode];

  if (!currency) {
    throw new Error(`Unsupported currency: ${currencyCode}`);
  }

  const formatter = new Intl.NumberFormat(currency.locale, {
    style: "currency",
    currency: currencyCode,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    ...options,
  });

  return formatter.format(amount);
};
