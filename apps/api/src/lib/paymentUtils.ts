// src/lib/paymentUtils.ts

/**
 * Utilities for monetary calculations.
 * Use integers (cents) inside the system to avoid floating point issues.
 */

export function amountToCents(amount: number) {
  return Math.round(amount * 100);
}

export function centsToAmount(cents: number) {
  return cents / 100;
}

/**
 * Safely parse numeric amount strings from provider payloads.
 * Accepts '100', '100.00', numeric values, and returns cents as integer.
 */
export function parseProviderAmountToCents(value: any) {
  if (value == null) return 0;
  if (typeof value === "number") return Math.round(value * 100);
  if (typeof value === "string") {
    const clean = value.replace(/[^0-9.-]/g, "");
    const v = Number(clean);
    if (Number.isNaN(v)) return 0;
    return Math.round(v * 100);
  }
  return 0;
}
