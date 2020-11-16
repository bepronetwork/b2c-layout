import moment from "moment";
import leadingWithZero from "./leadingWithZero";

const checkAge = birthDate => {
  const thisMoment = new Date();
  const thisYear = thisMoment.getFullYear();
  const thisMonth = thisMoment.getMonth();
  const thisDay = thisMoment.getDate();
  const ageFx = moment(
    `${thisYear}-${leadingWithZero(thisMonth)}-${thisDay}`
  ).diff(birthDate, "years");
  const isLegalAge = ageFx >= 18; // legal age
  const isUndefinedAge = ageFx > 72; // life expectancy
  const isValid = !isUndefinedAge && isLegalAge;

  return isValid;
};

export default checkAge;
