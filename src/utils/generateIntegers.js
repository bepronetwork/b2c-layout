import leadingWithZero from "./leadingWithZero";

const generateIntegers = ({ from = 0, to = 0, descend = false }) => {
  const integers = [];

  for (let index = from; index <= to; index += 1) {
    integers.push(leadingWithZero(index));
  }

  return descend ? integers.reverse() : integers;
};

export default generateIntegers;
