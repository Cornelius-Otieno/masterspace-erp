/**
 * Masterspace document numbering: XXXNNNN-DDMMYY
 *  - XXX  : 3-letter document prefix (INV, LSO, QOT, POD, RCT, WOR, CRN)
 *  - NNNN : zero-padded auto-incrementing counter (min 4 digits)
 *  - DDMMYY : issue date
 *
 * Example: generateDocNumber('INV', 34, new Date('2026-08-31')) => "INV0034-310826"
 */
export function generateDocNumber(
  prefix: string,
  counter: number,
  date: Date = new Date(),
): string {
  const num = String(counter).padStart(4, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const yy = String(date.getFullYear()).slice(-2);
  return `${prefix.toUpperCase()}${num}-${dd}${mm}${yy}`;
}

/** Document prefixes keyed by document type. */
export const DOC_PREFIX = {
  INVOICE: 'INV',
  PURCHASE_ORDER: 'LSO',
  QUOTATION: 'QOT',
  DELIVERY_NOTE: 'POD',
  RECEIPT: 'RCT',
  WORK_ORDER: 'WOR',
  CREDIT_NOTE: 'CRN',
} as const;
