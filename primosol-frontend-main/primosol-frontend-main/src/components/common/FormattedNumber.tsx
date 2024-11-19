import millify from 'millify';
import { MillifyOptions } from 'millify/dist/options';
import React from 'react';
import { cn } from '../../helpers/utils';
import { exponentToSubscript } from '../../libs/utils';

export const formatNumber = (value: number, precision: number = 4, shouldMillify = true) => {
  try {
    const isSafeIntegerRange = (value: number) => value >= Number.MIN_SAFE_INTEGER && value <= Number.MAX_SAFE_INTEGER;

    if (shouldMillify && value > 1_000_000 && isSafeIntegerRange(value)) {
      return millify(value, { precision: precision || 0 + 1 });
    }

    if (!isSafeIntegerRange(value)) {
      // Handle values outside of the safe integer range
      const valueStr = value.toExponential();
      return valueStr.includes('e') ? valueStr.replace('e', ' x 10^') : valueStr;
    }

    let [base, exponent] = value
      .toExponential()
      .split('e')
      .map(part => parseFloat(part));

    let isNegative = '';

    if (base < 0) {
      isNegative = '-';
    }

    let significantDigits = Math.abs(base).toFixed(precision);
    significantDigits = significantDigits.toString().replace('.', '').slice(0, precision);
    const absExponent = Math.abs(exponent) - 1;

    const subscript = exponentToSubscript(absExponent);

    if (exponent < -precision) {
      return `${isNegative}0.0${subscript}${significantDigits}`;
    } else if (exponent >= -precision && exponent < 0) {
      const precedingZeros = Array(absExponent).fill('0').join('');
      return `${isNegative}0.${precedingZeros}${significantDigits}`;
    }

    return new Intl.NumberFormat('en-US', { maximumFractionDigits: precision }).format(value);
  } catch (err) {
    console.error('formatted number error ', value, err);
    return '';
  }
};

export interface FormattedNumberProps extends React.HtmlHTMLAttributes<HTMLElement> {
  value?: number;
  options?: Partial<MillifyOptions>;
  precedingValues?: number;
  isCurrency?: boolean;
  isPercent?: boolean;
  prefix?: string;
  suffix?: string;
  shouldMillify?: boolean;
}

const FormattedNumber = ({ value, options, isCurrency, isPercent, className, prefix, suffix, shouldMillify = true }: FormattedNumberProps) => {
  const currency = isCurrency ? '$' : '';
  const percent = isPercent ? '%' : '';

  if (!value) return '-';

  return (
    <span className={cn(className, 'whitespace-nowrap text-nowrap')}>
      {prefix}
      {currency}
      {formatNumber(value, options?.precision || 4)}
      {percent}
      {suffix}
    </span>
  );
};

export default FormattedNumber;
