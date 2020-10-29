export default class Keno {
  constructor({ n, d, x, y }) {
    this.n = n;
    this.d = d;
    this.x = x;
    this.y = y;
    this.r = x - y;
  }

  factorial(num) {
    var array = [];

    for (var i = 1, res = 1; i < num; array[i - 1] = i, res *= ++i);
    return res;
  }

  combination(n, r) {
    return this.factorial(n) / (this.factorial(n - r) * this.factorial(r));
  }

  probability() {
    return (
      (this.combination(this.n - this.x, this.d - this.y) *
        this.combination(this.x, this.y)) /
      this.combination(this.n, this.d)
    );
  }
}
