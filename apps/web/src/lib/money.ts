/**
 * money.ts
 * ----------
 * Lightweight currency formatter for the SisimoveGo frontend.
 * Supports:
 *   - KES (default)
 *   - USD
 *   - NGN
 *   - ZAR
 *   - UGX
 *   - TZS
 *
 * Automatically handles:
 *   - rounding
 *   - localization
 *   - fallback for server-side rendering
 */

export type CurrencyCode =
  | "KES"
  | "USD"
  | "NGN"
  | "ZAR"
  | "UGX"
  | "TZS";

const DEFAULT_CURRENCY: CurrencyCode = "KES";

/**
 * Format a price into readable currency
 */
export function money(
  amount: number | string | null | undefined,
  currency: CurrencyCode = DEFAULT_CURRENCY
): string {
  if (amount === null || amount === undefined) return "—";

  const value = typeof amount === "string" ? parseFloat(amount) : amount;

  if (isNaN(value)) return "—";

  try {
    return new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency,
      minimumFractionDigits: 0
    }).format(value);
  } catch (err) {
    // Fallback for unsupported currencies or SSR
    return `${currency} ${value.toFixed(0)}`;
  }
}

/**
 * Convert raw M-PESA / API integers into money
 */
export function moneyFromCents(
  cents: number,
  currency: CurrencyCode = DEFAULT_CURRENCY
): string {
  return money(cents / 100, currency);
}

/**
 * Strip formatting → number (useful before sending to API)
 */
export function parseMoney(str: string): number {
  if (!str) return 0;

  // Remove commas, spaces, currency symbols
  const cleaned = str.replace(/[^\d.-]/g, "");

  return parseFloat(cleaned) || 0;
}
