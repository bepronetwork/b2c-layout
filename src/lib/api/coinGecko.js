import axios from "axios";
import { isEmpty, multiply } from "lodash";
import {
  formatCurrency,
  formatForCurrency,
} from "../../utils/numberFormatation";

async function getCurrencyConversion({ from = "", to = "", balance = 0 } = {}) {
  try {
    const { data } = await axios.get(
      `https://api.coingecko.com/api/v3/simple/price?ids=${from}&vs_currencies=${to}`,
    );
    let currencyConversion;

    if (isEmpty(data)) {
      currencyConversion = null;
    } else {
      const unity = data[from][to];
      const amount = multiply(formatCurrency(balance), unity);

      currencyConversion = {
        unity: formatForCurrency(to).format(unity),
        amount: formatForCurrency(to).format(amount),
      };
    }

    return currencyConversion;
  } catch (error) {
    return null;
  }
}

export { getCurrencyConversion };
