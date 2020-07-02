// eslint-disable-next-line import/prefer-default-export

const arrayColumn = (arr, number) => arr.map(x => x[number]);

const twoDimensionalArray = [
  [1, 2, 3, 4, 5],
  [6, 7, 8, 9, 10],
  [11, 12, 13, 14, 15],
  [11, 12, 13, 14, 15],
  [11, 12, 13, 14, 15],
  [11, 12, 13, 14, 15],
  [11, 12, 13, 14, 15]
];

console.log(arrayColumn(twoDimensionalArray, 0));

export default twoDimensionalArray;
