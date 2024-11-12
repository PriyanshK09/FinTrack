// frontend/src/utils/currencyUtils.js
export const formatCurrency = (amount, currencyCode, symbol) => {
  return amount.toLocaleString('en-US', {
    style: 'currency',
    currency: currencyCode,
    currencyDisplay: 'symbol'
  });
};