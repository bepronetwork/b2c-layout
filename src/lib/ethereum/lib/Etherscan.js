import { ierc20, casino } from '../interfaces';
import { ethNetwork } from '../../api/apiConfig';
const abiDecoder = require('abi-decoder'); // NodeJS

var abiDecoderERC20 = abiDecoder;
abiDecoderERC20.addABI(ierc20.abi);

var abiDecoderCasino = abiDecoder;
abiDecoderCasino.addABI(casino.abi);

const URL = `https://api${ethNetwork != 'mainnet' ? ("-" + ethNetwork) : ''}.etherscan.io/api`
const KEY = '6V2VS4ZGQYS9W3X626A58KSGMMXGXD5P9C';

async function getPastTransactions(address){
    let URL_FETCH = `${URL}?module=account&action=txlist&address=${address}&sort=desc&apikey=${KEY}`;
    try{
        let response = await fetch(URL_FETCH, { method : 'GET' });
        return response.json();
    }catch(err){
        throw err;
    }
}


function getTransactionDataERC20(transaction_data_encoded){
    const input = transaction_data_encoded.input;
    const decodedInput = abiDecoderERC20.decodeMethod(input);
    if(!decodedInput){return null}
    const functionName = decodedInput.name;
    const functionParams = decodedInput.params;
    let tokensTransferedTo = functionParams[0].value;
  
    /* Response Object */
    let res = {
        tokensTransferedTo : tokensTransferedTo,
        functionName : functionName,
        from : transaction_data_encoded.from,
        tokenAmount : functionParams[1].value
    }

    return res;
    
}

function getTransactionDataCasino(transaction_data_encoded, transaction_recipt_encoded){
    try{
        const input = transaction_data_encoded.input;
        const decodedInput = abiDecoderCasino.decodeMethod(input);
        if(!decodedInput){return null}
        const functionName = decodedInput.name;
        const functionParams = decodedInput.params;

        let decodedLogs = abiDecoderCasino.decodeLogs(transaction_recipt_encoded.logs);
        let decodedLogsEventTransfer = decodedLogs[0].events;
        if(!decodedLogsEventTransfer){return null};
        let tokensTransferedTo = decodedLogsEventTransfer[1].value;
        /* Response Object */
        let res = {
            tokensTransferedTo : tokensTransferedTo,
            functionName : functionName,
            from : transaction_data_encoded.from,
            tokenAmount : functionParams[0].value
        }

        return res;
    }catch(err){
        return null;
    }
}


export {
    getPastTransactions,
    getTransactionDataERC20,
    getTransactionDataCasino
}