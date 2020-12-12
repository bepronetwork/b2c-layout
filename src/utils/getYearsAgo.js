import moment from "moment";

const getYearsAgo = (diff) =>
  Number(
    moment()
      .subtract(diff, "years")
      .format("YYYY"),
  );

export default getYearsAgo;
