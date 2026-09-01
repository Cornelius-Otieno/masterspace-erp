/**
 * Convert a monetary amount to words (English), e.g.
 *   29875.16, 'DOLLARS', 'CENTS' => "TWENTY NINE THOUSAND EIGHT HUNDRED AND SEVENTY FIVE DOLLARS AND SIXTEEN CENTS ONLY"
 */
const ONES = [
  '', 'ONE', 'TWO', 'THREE', 'FOUR', 'FIVE', 'SIX', 'SEVEN', 'EIGHT', 'NINE',
  'TEN', 'ELEVEN', 'TWELVE', 'THIRTEEN', 'FOURTEEN', 'FIFTEEN', 'SIXTEEN',
  'SEVENTEEN', 'EIGHTEEN', 'NINETEEN',
];
const TENS = [
  '', '', 'TWENTY', 'THIRTY', 'FORTY', 'FIFTY', 'SIXTY', 'SEVENTY', 'EIGHTY', 'NINETY',
];
const SCALES = ['', 'THOUSAND', 'MILLION', 'BILLION', 'TRILLION'];

function threeDigitsToWords(n: number): string {
  let str = '';
  const hundreds = Math.floor(n / 100);
  const rest = n % 100;
  if (hundreds) str += `${ONES[hundreds]} HUNDRED`;
  if (rest) {
    if (str) str += ' AND ';
    if (rest < 20) {
      str += ONES[rest];
    } else {
      str += TENS[Math.floor(rest / 10)];
      if (rest % 10) str += ` ${ONES[rest % 10]}`;
    }
  }
  return str;
}

function integerToWords(num: number): string {
  if (num === 0) return 'ZERO';
  const groups: number[] = [];
  let n = num;
  while (n > 0) {
    groups.push(n % 1000);
    n = Math.floor(n / 1000);
  }
  const parts: string[] = [];
  for (let i = groups.length - 1; i >= 0; i--) {
    if (groups[i] === 0) continue;
    const words = threeDigitsToWords(groups[i]);
    parts.push(SCALES[i] ? `${words} ${SCALES[i]}` : words);
  }
  return parts.join(' ');
}

export function numberToWords(
  amount: number,
  currencyLabel = 'SHILLINGS',
  centsLabel = 'CENTS',
): string {
  const rounded = Math.round(amount * 100) / 100;
  const whole = Math.floor(rounded);
  const cents = Math.round((rounded - whole) * 100);
  let words = `${integerToWords(whole)} ${currencyLabel}`;
  if (cents > 0) {
    words += ` AND ${integerToWords(cents)} ${centsLabel}`;
  }
  return `${words} ONLY`;
}
