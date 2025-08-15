import { SUPPORTED_CURRENCIES } from "../../constants/currency";
import { formatCurrency } from "../currency";

// Mock Intl.NumberFormat to control the output
const mockFormat = jest.fn();
const mockNumberFormat = jest.fn();

// Create a proper mock for Intl.NumberFormat
const MockNumberFormat = jest.fn().mockImplementation(() => ({
  format: mockFormat,
}));

// Mock the global Intl.NumberFormat
Object.defineProperty(global, "Intl", {
  value: {
    NumberFormat: MockNumberFormat,
  },
  writable: true,
});

describe("formatCurrency", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockFormat.mockReturnValue("$1,234.56");
    MockNumberFormat.mockClear();
  });

  describe("basic functionality", () => {
    it("should format USD currency correctly", () => {
      const result = formatCurrency(1234.56, "USD");

      expect(MockNumberFormat).toHaveBeenCalledWith("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
      expect(mockFormat).toHaveBeenCalledWith(1234.56);
      expect(result).toBe("$1,234.56");
    });

    it("should use USD as default currency when no currency is specified", () => {
      const result = formatCurrency(1234.56);

      expect(MockNumberFormat).toHaveBeenCalledWith("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
      expect(result).toBe("$1,234.56");
    });
  });

  describe("custom options", () => {
    it("should apply custom formatting options", () => {
      const customOptions = {
        minimumFractionDigits: 0,
        maximumFractionDigits: 3,
      };

      const result = formatCurrency(1234.567, "USD", customOptions);

      expect(MockNumberFormat).toHaveBeenCalledWith("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 0,
        maximumFractionDigits: 3,
      });
      expect(result).toBe("$1,234.56");
    });
  });

  describe("error handling", () => {
    it("should throw error for unsupported currency codes", () => {
      // Use type assertion to test invalid currency codes
      const unsupportedCurrency = "GBP" as any;

      expect(() => {
        formatCurrency(1234.56, unsupportedCurrency);
      }).toThrow("Unsupported currency: GBP");
    });
  });

  describe("integration with SUPPORTED_CURRENCIES", () => {
    it("should use correct locale for each supported currency", () => {
      const currencies = Object.keys(SUPPORTED_CURRENCIES) as Array<
        keyof typeof SUPPORTED_CURRENCIES
      >;

      currencies.forEach((currencyCode) => {
        jest.clearAllMocks();
        mockFormat.mockReturnValue(`Formatted ${currencyCode}`);

        formatCurrency(100, currencyCode);

        const expectedLocale = SUPPORTED_CURRENCIES[currencyCode].locale;
        expect(MockNumberFormat).toHaveBeenCalledWith(
          expectedLocale,
          expect.objectContaining({
            currency: currencyCode,
          })
        );
      });
    });
  });
});
