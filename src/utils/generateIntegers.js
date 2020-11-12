const generateIntegers = (from, to) => {
  const integers = [];

  for (let index = from; index < to + 1; index += 1) {
    integers.push(index);
  }

  return integers;
};

export default generateIntegers;
