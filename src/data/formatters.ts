import type { Language } from '../types';

export const toBengaliDigits = (num: number | string): string => {
  const bengaliDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  return num
    .toString()
    .replace(/[0-9]/g, (digit) => bengaliDigits[parseInt(digit, 10)]);
};

export const formatPrice = (
  usd: number,
  bdt: number,
  lang: Language,
  options?: { perSqft?: boolean; decimals?: boolean }
): string => {
  const perSqft = options?.perSqft ?? false;
  const decimals = options?.decimals ?? false;

  if (lang === 'BN') {
    const formattedNum = Math.round(bdt).toLocaleString('en-IN');
    const bdtWithDigits = toBengaliDigits(formattedNum);
    return `৳${bdtWithDigits}${perSqft ? '/বর্গফুট' : ''}`;
  } else {
    const formattedNum = decimals ? usd.toFixed(2) : usd.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    return `$${formattedNum}${perSqft ? '/sq.ft' : ''}`;
  }
};

export const formatNumberOnly = (num: number, lang: Language): string => {
  const formatted = num.toLocaleString('en-US');
  return lang === 'BN' ? toBengaliDigits(formatted) : formatted;
};
