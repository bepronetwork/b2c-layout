import moment from "moment";

const getYearsAgo = diff => {
  return moment()
    .subtract(diff, "years")
    .format("YYYY");
};

export default getYearsAgo;
