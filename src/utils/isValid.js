import moment from "moment";
import { countries } from "countries-list"; 
import leadingWithZero from "./leadingWithZero";

const isValidCountries = (restrictedCountries = []) => {
  const countriesEntries = [];

  Object.entries(countries).forEach(([key, value]) => {
    return countriesEntries.push({
      country: key,
      data: value,
    });
  });

  const availableCountries = countriesEntries.filter(
    ({ country }) => !restrictedCountries.includes(country),
  );

  return availableCountries;
};

const isValidEmail = (email) =>
  email.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i);

const isValidAge = (birthDate) => {
  const thisMoment = new Date();
  const thisYear = thisMoment.getFullYear();
  const thisMonth = thisMoment.getMonth();
  const thisDay = thisMoment.getDate();
  const ageFx = moment(
    `${thisYear}-${leadingWithZero(thisMonth)}-${thisDay}`,
  ).diff(birthDate, "years");
  const isLegalAge = ageFx >= 18;
  const isUndefinedAge = ageFx > 72;

  return !isUndefinedAge && isLegalAge;
};

export { isValidAge, isValidEmail, isValidCountries };
