/**
 * Money Utilities
 * Helpers for converting between cents and formatted money strings
 */

/**
 * Convert cents (integer) to formatted money string
 * @param cents - Amount in cents (e.g., 6800)
 * @param currencyCode - ISO currency code (default: USD)
 * @returns Formatted string (e.g., "$68.00")
 */
export function formatMoney(
  cents: number,
  currencyCode: string = "USD"
): string {
  const amount = cents / 100;
  
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currencyCode,
  }).format(amount);
}

/**
 * Convert cents to decimal string
 * @param cents - Amount in cents (e.g., 6800)
 * @returns Decimal string (e.g., "68.00")
 */
export function centsToDecimal(cents: number): string {
  return (cents / 100).toFixed(2);
}

/**
 * Convert decimal/dollar amount to cents
 * @param amount - Decimal amount (e.g., 68.00 or "68.00")
 * @returns Amount in cents (e.g., 6800)
 */
export function dollarsToCents(amount: number | string): number {
  const numAmount = typeof amount === "string" ? parseFloat(amount) : amount;
  return Math.round(numAmount * 100);
}

/**
 * Format price range
 * @param minCents - Minimum price in cents
 * @param maxCents - Maximum price in cents
 * @param currencyCode - ISO currency code (default: USD)
 * @returns Formatted range (e.g., "$50.00 - $100.00" or "$50.00")
 */
export function formatPriceRange(
  minCents: number,
  maxCents: number,
  currencyCode: string = "USD"
): string {
  const minFormatted = formatMoney(minCents, currencyCode);
  const maxFormatted = formatMoney(maxCents, currencyCode);
  
  if (minCents === maxCents) {
    return minFormatted;
  }
  
  return `${minFormatted} - ${maxFormatted}`;
}

/**
 * Calculate discount percentage
 * @param originalPrice - Original price in cents
 * @param salePrice - Sale price in cents
 * @returns Discount percentage (e.g., 25)
 */
export function calculateDiscountPercent(
  originalPrice: number,
  salePrice: number
): number {
  if (originalPrice <= 0 || salePrice >= originalPrice) {
    return 0;
  }
  
  const discount = ((originalPrice - salePrice) / originalPrice) * 100;
  return Math.round(discount);
}

/**
 * Check if product is on sale
 * @param price - Current price in cents
 * @param compareAtPrice - Compare at price in cents
 * @returns True if on sale
 */
export function isOnSale(price: number, compareAtPrice: number): boolean {
  return compareAtPrice > 0 && price < compareAtPrice;
}
