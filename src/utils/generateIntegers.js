const generateIntegers = (from, to, descend) => {
  const integers = [];

  for (let index = from; index < to; index += 1) {
    integers.push(index);
  }

  return descend ? integers.reverse() : integers;
};

export default generateIntegers;
