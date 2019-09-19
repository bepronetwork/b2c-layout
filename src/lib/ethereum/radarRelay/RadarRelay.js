import { ContractWrappers, MetamaskSubprovider, Web3ProviderEngine, RPCSubprovider, BigNumber, assetDataUtils } from '0x.js';
import { Web3Wrapper } from '@0x/web3-wrapper';
import { getMetamaskAccount } from '../../metamask';
import axios from "axios";
import _ from 'lodash';
import { INFURA_API, SLIPPAGE_ETH_TRADE } from '../../api/apiConfig';
import { getTransactionOptions } from '../lib/Ethereum';
var openrelayBaseURL = "https://api.radarrelay.com";

class RadarRelaay{

    constructor(){
    }   

    __init__ = async () => {
        const provider = new Web3ProviderEngine();
        const signerProvider = new MetamaskSubprovider(window.ethereum);
        const networkId = await new Web3Wrapper(window.ethereum).getNetworkIdAsync();
        provider.addProvider(signerProvider);
        provider.addProvider(new RPCSubprovider(INFURA_API, 2000));
        provider.start();
        this.contractWrappers = new ContractWrappers(provider, { networkId});
        this.web3Wrapper = new Web3Wrapper(provider);

    }   

    getBestBidMarket = async ({baseTokenSelector, quoteTokenSelector, liquidityNeededBuyToken}) => {
        let market = await this.getMarket({baseTokenSelector, quoteTokenSelector});
        return market.book.bids.find(
            bid => (parseFloat(bid.remainingQuoteTokenAmount) > liquidityNeededBuyToken*4)
        )
    }

    getBestAskMarket = async ({baseTokenSelector, quoteTokenSelector, liquidityNeededSellToken}) => {
        let market = await this.getMarket({quoteTokenSelector, baseTokenSelector});
        return market.book.bids.find(
            bid => (
                (parseFloat(bid.remainingQuoteTokenAmount) > liquidityNeededSellToken) 
                && (bid.signedOrder.takerAssetData == "0xf47261b0000000000000000000000000c02aaa39b223fe8d0a0e5c4f27ead9083c756cc2")
            )
        )
    }

    getMarket = async ({baseTokenSelector, quoteTokenSelector}) => {
        let markets = await this.getMarkets();
        let market = markets.find( market => market.id == (`${baseTokenSelector}-${quoteTokenSelector}` || `${quoteTokenSelector}-${baseTokenSelector}`));
        let book = await this.getMarketBook({marketId : market.id});
        return {...market, book : book};
    }

    getMarketBook = async ({marketId}) => {
        let res = await axios.get(openrelayBaseURL + `/v2/markets/${marketId}/book`)
        return res.data;

    }
 
    getMarkets = async () => {
        let res = await axios.get(openrelayBaseURL + "/v2/markets")
        return res.data;
    }

    isTokenUnlocked = async ({tokenAddress, amount}) => {
        try {
            if (!amount || amount === '0') {
                throw new Error("Amount Not Valid")
            }    
            let account = await getMetamaskAccount();
            const assetData = assetDataUtils.encodeERC20AssetData(tokenAddress);
            const balanceAndAllowance = await this.contractWrappers.orderValidator.getBalanceAndAllowanceAsync(account, assetData);
            const { allowance } = balanceAndAllowance;
            const isUnlocked = parseInt(allowance) > 0;
            return isUnlocked;
        } catch (err) {
            console.log(err);
            throw err;
        }
    }
   

    allowTokenUse = async ({tokenAddress, amount}) => {
        try {
            if (!amount || amount === '0') {
                throw new Error("Amount Not Valid")
            }    
            const account = await getMetamaskAccount();
            let tx = await this.contractWrappers.erc20Token.setUnlimitedProxyAllowanceAsync(
                tokenAddress,
                account
            );
            let res = await this.web3Wrapper.awaitTransactionSuccessAsync(tx);
            console.log(res);
            return res;
        } catch (err) {
            console.log(err);
            throw err;
        }
    }

     /**
     * Wrap Eth
     */

    wrapToken = async ({tokenAddress, amount}) => {
        try {
            if (!amount || amount === '0') {
                throw new Error("Amount Not Valid")
            }            

            const account = await getMetamaskAccount();
            const weiAmount = window.web3.eth.utils.toWei(new String(parseFloat(amount).toFixed(6)).toString());
            let tx = await this.contractWrappers.etherToken.depositAsync(
                tokenAddress,
                new String(weiAmount),
                account
            )
            let res = await this.web3Wrapper.awaitTransactionSuccessAsync(tx);
            console.log(res);
            return res;
        } catch (err) {
            throw err;
        }
    }

    submitMarketOrder = async ({amount, bids, side, isDirectETH}) => {
        try {
            if (!amount || amount === '0') {
                throw new Error("Amount Not Valid")
            }
            let account = await getMetamaskAccount();
            let ethAmount;
            let tx;
            let orders = bids.map( bid => bid.signedOrder);
            const isBuy = (side == 'BUY');
            console.log(orders[0])
            if(isDirectETH){
                ethAmount = new BigNumber(
                    parseFloat(window.web3.utils.toWei(
                        new String(
                            parseFloat((amount/bids[0].price)+SLIPPAGE_ETH_TRADE).toFixed(6)
                            ).toString()
                    , 'ether')).toFixed(5)
                );
                amount = new BigNumber(amount*10**18);
            }

            console.log(window.web3.utils.fromWei(new String(ethAmount).toString()), amount)
                
            if (isBuy && isDirectETH) {
                tx = await this.contractWrappers.forwarder.marketBuyOrdersWithEthAsync(
                    orders,
                    amount,
                    account,
                    ethAmount,
                    [],
                    0,
                    '0x801Ecff29a16C81f6F139A250D38526d60F4A301',
                    await getTransactionOptions('fast')
                );
            } else if (!isBuy && isDirectETH) {
                console.log("aqui")
                tx = await this.contractWrappers.forwarder.marketSellOrdersWithEthAsync(
                    orders,
                    account,
                    ethAmount,
                    [],
                    0,
                    '0x801Ecff29a16C81f6F139A250D38526d60F4A301',
                    await getTransactionOptions('fast'));
            } else {
                if (isBuy) {
                    tx = await this.contractWrappers.exchange.marketBuyOrdersAsync(
                        orders,
                        amount,
                        account,
                        await getTransactionOptions('fast')
                    );
                } else {
                    tx = await this.contractWrappers.exchange.marketSellOrdersAsync(
                        orders,
                        amount,
                        account,
                        await getTransactionOptions('fast')
                    );
                }
            }
            let res = await this.web3Wrapper.awaitTransactionSuccessAsync(tx);
            return res;

        } catch (err) {
            console.log(err);
            throw err;
        }
    };

  
    /**
     * Toggle a tokens allowance and update the UI
     * @param e The toggle clicked event
     */
    allowTokenExchange = async ({tokenAddress, amount}) => {
        try {
            return await this.sdk.account.setTokenAllowanceAsync(tokenAddress, new BigNumber(amount), { awaitTransactionMined: true });
        } catch (err) {
            throw err;
        }
    }


}


let RadarRelaySingleton = new RadarRelaay();

export default RadarRelaySingleton;