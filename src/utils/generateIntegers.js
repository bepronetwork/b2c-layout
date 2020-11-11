const generateIntegers = (from, to) => {
  const integers = [];

  for (let index = from; index < to + 1; index += 1) {
    integers.push(`0${index}`.slice(-2));
  }

  return integers;
};

export default generateIntegers;
