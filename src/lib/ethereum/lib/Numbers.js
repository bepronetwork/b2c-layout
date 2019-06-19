import accounting from "accounting";

Number.prototype.noExponents= function(){
    var data= String(this).split(/[eE]/);
    if(data.length== 1) return data[0]; 

    var  z= '', sign= this<0? '-':'',
    str= data[0].replace('.', ''),
    mag= Number(data[1])+ 1;

    if(mag<0){
        z= sign + '0.';
        while(mag++) z += '0';
        return z + str.replace(/^\-/,'');
    }
    mag -= str.length;  
    while(mag--) z += '0';
    return str + z;
}

class NumbersObject {
    toFloat(number) {
        return parseFloat(parseFloat(number).toFixed(2));
    }

    toMoney(number) {
        return accounting.formatMoney(number, { symbol: "EUR", format: "%v" });
    }

    formatNumber(number) {
        return accounting.formatNumber(number);
    }

    toSmartContractDecimals(value, decimals){
        let numberWithNoExponents = new Number(value*10**decimals).noExponents();
        return numberWithNoExponents;
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
}

const Numbers = new NumbersObject();

export default Numbers;
