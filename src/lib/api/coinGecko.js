import axios from "axios";
import { isEmpty, isUndefined, multiply } from "lodash";
import {
  formatCurrency,
  formatForCurrency,
} from "../../utils/numberFormatation";

const URL = "https://api.coingecko.com/api/v3";

async function getCoinConversion({ from = "", to = "", balance = 0 } = {}) {
  try {
    const { data } = await axios.get(
      `${URL}/simple/price?ids=${from}&vs_currencies=${to}`,
    );

    if (isEmpty(data)) return null;

    const unity = data[from][to];
    const amount = multiply(formatCurrency(balance), unity);

    return {
      unity: formatForCurrency(to).format(unity),
      amount: formatForCurrency(to).format(amount),
    };
  } catch (error) {
    return null;
  }
}

async function getCoinList({ filter = "" } = {}) {
  try {
    const { data } = await axios.get(`${URL}/coins/list`);

    if (isEmpty(data)) return null;

    if (!isEmpty(filter)) {
      const index = data
        .map(({ symbol }) => symbol)
        .indexOf(filter.toLowerCase());

      if (isUndefined(data[index])) return null;

      return data[index];
    }

    return data;
  } catch (error) {
    return null;
  }
}

export { getCoinConversion, getCoinList };
