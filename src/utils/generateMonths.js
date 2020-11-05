import moment from "moment";
import "moment/locale/pt-br";

const generateMonths = (locale, format) => {
  moment.locale(locale);

  const userLocale = moment.locale();
  const months = [];
  const monthList = moment("2020");

  for (let index = 0; index < 12; index += 1) {
    months.push(monthList.month(index).format(format));
  }
  moment.locale(userLocale);

  return months.map(month => month.charAt(0).toUpperCase() + month.substr(1));
};

export default generateMonths;
