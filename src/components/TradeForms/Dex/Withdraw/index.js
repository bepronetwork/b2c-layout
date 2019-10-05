import React from "react";
import { connect } from "react-redux";
import { ActionBox } from "components";
import RadarRelaySingleton from "lib/ethereum/radarRelay/RadarRelay";
import wrap from 'assets/wrap.png';
import allow from 'assets/allow.png';
import './index.css';
import powered0x from 'assets/powered-0x.png';
import { SLIPPAGE_ETH_PERCENTAGE } from "lib/api/apiConfig";
import store from "../../../../containers/App/store";
import { setWithdrawInfo } from "../../../../redux/actions/withdraw";

class TradeFormDexWithdraw extends React.Component{
    constructor(props){
        super(props);
        this.state = { 
            hasTraded : false,
            isAllowed : false,
            isTokenUnlocked : false,
            onLoading : {
                hasTraded : false,
                isAllowed : false,
                isTokenUnlocked : false
            },
            updated : false,
            withdrawAmountInETH : 0,
            withdrawAmountInDAI : 0
        }
    }
    componentDidMount(){
        this.projectData(this.props)
    }

    projectData = async (props) => {
        await RadarRelaySingleton.__init__();
        const { profile, withdraw } = props;

        const tokenAddress = profile.getAppTokenAddress();
        const isTokenUnlocked = await RadarRelaySingleton.isTokenUnlocked({tokenAddress, amount : withdraw.amount});

        const bid = await RadarRelaySingleton.getBestAskMarket({baseTokenSelector : 'WETH', quoteTokenSelector : 'DAI', liquidityNeededSellToken : withdraw.amount});
        const ownedDAI = parseFloat(await profile.getTokenAmount());
        const hasEnoughDAI = (ownedDAI >= withdraw.amount);
        const neededETH = parseFloat((withdraw.amount/bid.price)+(withdraw.amount/bid.price)*SLIPPAGE_ETH_PERCENTAGE);

        this.setState({...this.state, 
            neededETH,
            bid,
            tokenAddress,
            isTokenUnlocked,
            hasEnoughDAI,
            updated : true
        })
    }

    onLoading = (key, on=true) => {
        /* Set Loading */
        this.setState({...this.state,  onLoading : {...this.state.onLoading, [key] : on}});
    }

    allowTokenUse = async () => {
        try{
            const { tokenAddress } = this.state;
            this.onLoading('isTokenUnlocked');
            /* Create Deposit Framework */
            let res = await RadarRelaySingleton.allowTokenUse({tokenAddress : tokenAddress, amount : parseFloat(this.state.neededETH)});
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
            const { withdraw } = this.props;
            let amount = 1;
            /* Create Deposit Framework */
            let res = await RadarRelaySingleton.submitMarketOrder({bids : [bid], amount : parseFloat(amount).toFixed(6), side : 'SELL', isDirectETH : true});
            if(!res){throw new Error("Error on Transaction")};
            setInterval( async () => {
                this.projectData(this.props);
                this.onLoading('hasTraded', false);
                await store.dispatch(setWithdrawInfo({key : 'hasTraded', value : true}))
            }, 3*1000);
        }catch(err){
            this.onLoading('hasTraded', false);
        }
    }

    render(){

        const { hasTraded, onLoading, updated, hasEnoughDAI, isTokenUnlocked } = this.state;

        return (
            <div>
               <ActionBox 
                    onClick={this.allowTokenUse}
                    onLoading={onLoading.isTokenUnlocked}
                    disabled={!updated}
                    loadingMessage={'Metamask should prompt, click on it and Approve the Transaction'}
                    completed={isTokenUnlocked} id={'allowDAI'} image={allow} description={'Allow DAI'} title={'Allow DAI Use by the Contract'}
                />
                 <ActionBox 
                    onClick={this.trade}
                    onLoading={onLoading.hasTraded}
                    disabled={!updated || hasTraded}
                    loadingMessage={'Metamask should prompt, click on it and Approve the Transaction'}
                    completed={hasTraded} id={'tradeToETH'} image={wrap} description={'Get your Ethereum'} title={'Trade to ETH'}
                /> 
                <img src={powered0x} styleName='powered-image'/>
            </div>
        )
    }
}

function mapStateToProps(state){
    return {
        profile : state.profile,
        withdraw : state.withdraw
    };
}

export default connect(mapStateToProps)(TradeFormDexWithdraw);
