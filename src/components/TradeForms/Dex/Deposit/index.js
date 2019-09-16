import React from "react";
import { connect } from "react-redux";
import { ActionBox } from "components";
import RadarRelaySingleton from "../../../../lib/ethereum/radarRelay/RadarRelay";
import { Numbers } from "../../../../lib/ethereum/lib";
import store from "../../../../containers/App/store";
import { setDepositInfo } from "../../../../redux/actions/deposit";
import wrap from 'assets/wrap.png';
import exchange from 'assets/exchange.png';
import './index.css';
import { getERC20TokenAmount, getETHBalance } from "../../../../lib/ethereum/lib/Ethereum";
import ethereum_info from "../../../../config/ethereum";
import powered0x from 'assets/powered-0x.png';
import { getMetamaskAccount } from "../../../../lib/metamask";
import { SLIPPAGE_ETH_PERCENTAGE } from "../../../../lib/api/apiConfig";

class TradeFormDexDeposit extends React.Component{
    constructor(props){
        super(props);
        this.state = { 
            hasTraded : false,
            hasEnoughEth : true,
            onLoading : {
                hasTraded : false,
                //hasWrapped : false,
                //isTokenUnlocked : false
            },
            updated : false,
            depositAmountInETH : 0,
            depositAmountInDAI : 0,
            slippage : 0
            //isTokenUnlocked : false,
            //hasWrapped : false,
        }
    }
    componentDidMount(){
        this.projectData(this.props)
    }

    projectData = async (props) => {
        await RadarRelaySingleton.__init__();
        const { profile, deposit } = props;
        let address = await getMetamaskAccount();
        let bid = await RadarRelaySingleton.getBestBidMarket({baseTokenSelector : 'WETH', quoteTokenSelector : 'DAI', liquidityNeededBuyToken : deposit.amount});
        let ownedETH = await getETHBalance({address});
        let ownedDAI = parseFloat(await profile.getTokenAmount());
        let hasEnoughDAI = (ownedDAI >= deposit.amount)
        let neededETH = parseFloat((deposit.amount/bid.price)+(deposit.amount/bid.price)*SLIPPAGE_ETH_PERCENTAGE);
        
        let hasEnoughEth = (ownedETH >= neededETH);
        let hasTraded = (ownedDAI >= parseFloat(deposit.amount));

        //let wrappedETH = parseFloat(await getERC20TokenAmount({tokenAddress : ethereum_info.weth_address}));
        //let isTokenUnlocked = await RadarRelaySingleton.isTokenUnlocked({tokenAddress : ethereum_info.weth_address, amount : neededETH});

        this.setState({...this.state, 
            hasEnoughEth,
            hasTraded,
            neededETH,
            bid,
            hasEnoughDAI,
            ownedDAI,
            updated : true
            //wrappedETH,
            //hasWrapped,
            //isTokenUnlocked,
        })
    }

    onLoading = (key, on=true) => {
        /* Set Loading */
        this.setState({...this.state,  onLoading : {...this.state.onLoading, [key] : on}});
    }

    wrapEth = async () => {
        try{
            this.onLoading('hasWrapped');
            /* Create Deposit Framework */
            let res = await RadarRelaySingleton.wrapEth({tokenAddress : ethereum_info.weth_address, amount : parseFloat(this.state.neededETH)});
            if(!res){throw new Error("Error on Transaction")};
            this.projectData(this.props);
            this.onLoading('hasWrapped', false);
        }catch(err){
            console.log(err);
            this.onLoading('hasWrapped', false);
        }
    }

    allowTokenUse = async () => {
        try{
            this.onLoading('isTokenUnlocked');
            /* Create Deposit Framework */
            let res = await RadarRelaySingleton.allowTokenUse({tokenAddress : ethereum_info.weth_address, amount : parseFloat(this.state.neededETH)});
            if(!res){throw new Error("Error on Transaction")};
            this.projectData(this.props);
            this.onLoading('isTokenUnlocked', false);
        }catch(err){
            console.log(err);
            this.onLoading('isTokenUnlocked', false);
        }
    }

    trade = async () => {
        try{
            this.onLoading('hasTraded');
            const { bid } = this.state;
            const { deposit } = this.props;
            /* Create Deposit Framework */
            let res = await RadarRelaySingleton.submitMarketOrder({bids : [bid], amount : parseFloat(deposit.amount).toFixed(6), side : 'BUY', isDirectETH : true});
            if(!res){throw new Error("Error on Transaction")};
            setInterval( async () =>{
                this.projectData(this.props);
                this.onLoading('hasTraded', false);
                await store.dispatch(setDepositInfo({key : 'hasTraded', value : true}))
            }, 3*1000);
        }catch(err){
            this.onLoading('hasTraded', false);
        }
    }

    render(){
        const { hasTraded, onLoading, updated, hasEnoughDAI, hasEnoughEth } = this.state;
        return (
            <div>
                {/*<ActionBox 
                    onClick={this.wrapEth}
                    onLoading={onLoading.hasWrapped}
                    disabled={!updated}
                    loadingMessage={'Metamask should prompt, click on it and Approve the Transaction'}
                    completed={hasWrapped} id={'wrapETH'} image={wrap} description={'Allow Trade'} title={'Wrap ETH'}
                />
                 <ActionBox 
                    onClick={this.allowTokenUse}
                    onLoading={onLoading.isTokenUnlocked}
                    disabled={!updated || !hasWrapped}
                    loadingMessage={'Metamask should prompt, click on it and Approve the Transaction'}
                    completed={isTokenUnlocked} id={'unlockWETH'} image={allow} description={'Allow Trade'} title={'Unlock WETH'}
                /> */}
                <ActionBox 
                    alertMessage={'You don´t have enough Ethereum'}
                    alertCondition={!hasEnoughEth && !hasEnoughDAI}
                    onClick={this.trade}
                    onLoading={onLoading.hasTraded}
                    disabled={!updated || !hasEnoughEth}
                    loadingMessage={'Metamask should prompt, click on it and Approve the Transfer'}
                    completed={hasEnoughDAI} id={'tradeETH-DAI'} image={exchange} description={'Allow Trade'} title={'Trade'}
                />
                <img src={powered0x} styleName='powered-image'/>
            </div>
        )
    }
}

function mapStateToProps(state){
    return {
        profile : state.profile,
        deposit : state.deposit
    };
}

export default connect(mapStateToProps)(TradeFormDexDeposit);
