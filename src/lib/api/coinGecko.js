import axios from "axios";
import { multiply } from "lodash";
import {
  formatCurrency,
  formatForCurrency,
} from "../../utils/numberFormatation";

async function getCurrencyConversion(
  ids = "",
  vsCurrencies = "",
  amountToConvert = 0,
) {
  try {
    const { data } = await axios.get(
      `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=${vsCurrencies}`,
    );

    const unity = data[ids][vsCurrencies];
    const amount = multiply(formatCurrency(amountToConvert), unity);

    return {
      unity: formatForCurrency(vsCurrencies).format(unity),
      amount: formatForCurrency(vsCurrencies).format(amount),
    };
  } catch (error) {
    return null;
  }
}

export { getCurrencyConversion };
