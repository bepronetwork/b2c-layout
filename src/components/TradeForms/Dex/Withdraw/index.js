import React from "react";
import { connect } from "react-redux";
import { ActionBox } from "components";
import RadarRelaySingleton from "lib/ethereum/radarRelay/RadarRelay";
import exchange from 'assets/exchange.png';
import './index.css';
import powered0x from 'assets/powered-0x.png';
import { SLIPPAGE_ETH_PERCENTAGE } from "lib/api/apiConfig";

class TradeFormDexWithdraw extends React.Component{
    constructor(props){
        super(props);
        this.state = { 
            hasTraded : false,
            onLoading : {
                hasTraded : false,
              
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

        let bid = await RadarRelaySingleton.getBestAskMarket({baseTokenSelector : 'WETH', quoteTokenSelector : 'DAI', liquidityNeededSellToken : withdraw.amount});
        let ownedDAI = parseFloat(await profile.getTokenAmount());
        let hasEnoughDAI = (ownedDAI >= withdraw.amount);

        let neededETH = parseFloat((withdraw.amount/bid.price)+(withdraw.amount/bid.price)*SLIPPAGE_ETH_PERCENTAGE);

        this.setState({...this.state, 
            neededETH,
            bid,
            hasEnoughDAI,
            ownedDAI,
            updated : true
        })
    }

    onLoading = (key, on=true) => {
        /* Set Loading */
        this.setState({...this.state,  onLoading : {...this.state.onLoading, [key] : on}});
    }

    trade = async () => {
        try{
            this.onLoading('hasTraded');
            const { bid } = this.state;
            const { withdraw } = this.props;
            /* Create withdraw Framework */
            let res = await RadarRelaySingleton.submitMarketOrder({bids : [bid], amount : parseFloat(withdraw.amount).toFixed(6), side : 'SELL', isDirectETH : true});
            if(!res){throw new Error("Error on Transaction")};
            this.onLoading('hasTraded', false);
            this.setState({...this.state, hasTraded : true});
        }catch(err){
            this.onLoading('hasTraded', false);
        }
    }

    render(){
        const { hasTraded, onLoading, updated, hasEnoughDAI } = this.state;
        return (
            <div>
                <ActionBox 
                    onClick={this.trade}
                    onLoading={onLoading.hasTraded}
                    alertCondition={!hasEnoughDAI}
                    alertMessage={'You don´t have enought DAI'}
                    disabled={!updated || !hasEnoughDAI}
                    loadingMessage={'Metamask should prompt, click on it and Approve the Transfer'}
                    completed={hasTraded} id={'tradeDAI-ETH'} image={exchange} description={'Allow Trade'} title={'Trade'}
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
