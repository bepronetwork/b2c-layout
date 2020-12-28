import accounting from "accounting";

class NumbersObject {
    toFloat(number) {
        return parseFloat(parseFloat(number));
    }

    toMoney(number) {
        return accounting.formatMoney(number, { symbol: "EUR", format: "%v" });
    }

    formatNumber(number) {
        return accounting.formatNumber(number);
    }

    fromBigNumberToInteger(value, decimals=18){
        return value/ Math.pow(10, decimals)*1000000000000000000;
    }
    fromDecimals(value, decimals) {
        return value / 10 ** decimals;
    }


    fromExponential(x) {
        if (Math.abs(x) < 1.0) {
        const exp = parseInt(x.toString().split("e-")[1]);

        if (exp) {
            x *= Math.pow(10, exp - 1);
            x = "0." + new Array(exp).join("0") + x.toString().substring(2);
        }
        } else {
        let exp = parseInt(x.toString().split("+")[1]);

        if (exp > 20) {
            exp -= 20;
            x /= Math.pow(10, exp);
            x += new Array(exp + 1).join("0");
        }
        }

        return x;
    }

    fromSmartContractTimeToSeconds(time){
        return time;
    }
}

const Numbers = new NumbersObject();

export default Numbers;
