const leadingWithZero = index =>
  index >= 1 && index <= 9 ? `0${index}` : index;

export default leadingWithZero;
