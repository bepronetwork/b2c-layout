// Created for avoid eslint/prettier "Do not nest ternary condition" rule.

const ternaryCondition = (condition, render, fallback) =>
  condition ? render : fallback;

export default ternaryCondition;
