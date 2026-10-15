// Brahma Handicrafts' own registered state (Uttar Pradesh) — the fixed point of comparison for
// deciding intra-state vs inter-state sales. Comparison is always by GST state code, never by name text.
export const SELLER_STATE_CODE = '09';

export interface GstBreakdown {
  taxableAmount: number;
  cgstRate: number;
  sgstRate: number;
  igstRate: number;
  cgstAmount: number;
  sgstAmount: number;
  igstAmount: number;
  totalTax: number;
  grandTotal: number;
}

/**
 * Intra-state (delivery state code === seller's): 2.5% CGST + 2.5% SGST, 0% IGST.
 * Inter-state (any other code): 5% IGST, 0% CGST/SGST.
 * `deliveryStateCode` is null when no delivery state is known yet (e.g. no shipping address
 * selected) — in that case every rate and amount is zero, and the grand total equals the taxable amount.
 */
export function calculateGst(taxableAmount: number, deliveryStateCode: string | null): GstBreakdown {
  const isIntraState = deliveryStateCode !== null && deliveryStateCode === SELLER_STATE_CODE;
  const isInterState = deliveryStateCode !== null && !isIntraState;

  const cgstRate = isIntraState ? 2.5 : 0;
  const sgstRate = isIntraState ? 2.5 : 0;
  const igstRate = isInterState ? 5 : 0;

  const cgstAmount = roundToPaise(taxableAmount * (cgstRate / 100));
  const sgstAmount = roundToPaise(taxableAmount * (sgstRate / 100));
  const igstAmount = roundToPaise(taxableAmount * (igstRate / 100));
  const totalTax = roundToPaise(cgstAmount + sgstAmount + igstAmount);

  return {
    taxableAmount,
    cgstRate,
    sgstRate,
    igstRate,
    cgstAmount,
    sgstAmount,
    igstAmount,
    totalTax,
    grandTotal: roundToPaise(taxableAmount + totalTax)
  };
}

function roundToPaise(value: number): number {
  return Math.round(value * 100) / 100;
}
