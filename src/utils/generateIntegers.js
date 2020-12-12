const generateIntegers = ({ from = 0, to = 0, descend = false }) => {
  const integers = [];

  for (let index = from; index < to + 1; index += 1) {
    integers.push(index);
  }

  return descend ? integers.reverse() : integers;
};

export default generateIntegers;
