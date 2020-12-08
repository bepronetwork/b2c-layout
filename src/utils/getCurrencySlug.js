const getCurrencySlug = (symbol = "") => {
  switch (symbol) {
    case "ETH": {
      return "ethereum";
    }
    case "BTC": {
      return "bitcoin";
    }
    case "FAU": {
      return "ethereum";
    }
    default:
      break;
  }

  return null;
};

export default getCurrencySlug;
