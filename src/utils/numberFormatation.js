
export const formatCurrency = (value) => {
  return parseFloat(value).toFixed(6);
}

export const formatPercentage = (value) => {
  return parseFloat(value).toFixed(0);
}

export const formatForCurrency = currency =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency
  });