const gameOperations = (value, amount, operator) => {
  let operated = amount;

  if (value === "max") {
    operated = operator;

    return operated;
  }

  if (value === "2") {
    operated = operated > operator ? operator : operated * 2;

    return operated > operator ? operated / 2 : operated;
  }

  if (value === "0.5") {
    operated = operated <= 0.00001 ? 0 : operated * 0.5;

    return operated;
  }

  if (operated > operator) {
    operated = operator;

    return operated;
  }

  return null;
};

export default gameOperations;
