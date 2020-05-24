export default class Keno {
    constructor({ n, d, x, i }) {
        this.n = n;
        this.d = d;
        this.x = x;
        this.i = i;
        this.r = x - i;
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
        return this.combination(this.n - this.x, this.d - this.i) * this.combination(this.x, this.x - this.i) / this.combination(this.n, this.d);
    }
}
