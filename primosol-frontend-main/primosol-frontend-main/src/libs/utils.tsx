export function shortenAddress(address: string | undefined) {
  if (!address || address.length < 10)
    return address;
  return `${address.substring(0, 4)}...${address.substring(address.length-4, address.length)}`;
}

export const isJson = (str: any) => {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
};

export const copyToClipboard = (text: string, cb: () => void) => {
  if (navigator.clipboard && navigator.permissions) {
    navigator.clipboard.writeText(text).then(cb);
  } else if (document.queryCommandSupported("copy")) {
    const ele = document.createElement("textarea");
    ele.value = text;
    document.body.appendChild(ele);
    ele.select();
    document.execCommand("copy");
    document.body.removeChild(ele);
    cb?.();
  }
};

export const exponentToSubscript = (expo: number) => {
  const subscriptNumbers = ['₀', '₁', '₂', '₃', '₄', '₅', '₆', '₇', '₈', '₉'];

  const number = expo
    .toString()
    .split('')
    .map(n => subscriptNumbers[+n])
    .join('');
  return number || '';
};

export const shortenString = (string: string, maxLength: number = 15, ellipsis = true): string => {
  if (!string) return '';
  if (string.length <= maxLength) {
    return string;
  }
  return string.slice(0, maxLength) + (ellipsis ? '...' : '');
};

export const getTradeSide = (order: 'Buy' | 'Sell' | 'Add' | 'Remove', prefix: string = 'text') => {
  prefix = prefix || 'text';
  switch (order) {
    case 'Buy':
      return `${prefix}-green`;
    case 'Add':
      return `${prefix}-purple`;
    case 'Remove':
      return `${prefix}-yellow`;
    case 'Sell':
    default:
      return `${prefix}-red`;
  }
};

export const formatPercent = (percent: number | undefined) => {
  if (!percent) {
    return 0;
  }
  
  if (percent < 0) {
    return <span className="text-red">{ percent.toFixed(2) }%</span>
  } else {
    return <span className="text-primary">{ percent.toFixed(2) }%</span>
  }
}

export const formatPrice = (price: number | undefined, decimals: number = 4) => {
  if (!price) return `$0`;
  return `$${Number(price.toFixed(decimals))}`;
}