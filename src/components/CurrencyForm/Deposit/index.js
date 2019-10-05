import React from "react";
import { connect } from "react-redux";
import PaymentBox from "../../PaymentBox";
import currencies from "../../../config/currencies";
import { getMetamaskAccount } from "../../../lib/metamask";
import { getETHBalance } from "../../../lib/ethereum/lib/Ethereum";
import { setDepositInfo } from "../../../redux/actions/deposit";
import store from "../../../containers/App/store";

class CurrencyDepositForm extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            ownedDAI : 0,
            ownedETH : 0,
            updated : false
        }
    }

    componentDidMount(){
        this.projectData(this.props);
    }

    componentWillReceiveProps(props){
        this.projectData(props);
    }

    projectData = async (props) => {
        const { profile } = props;
        let address = await getMetamaskAccount();
        let ownedETH = await getETHBalance({address});
        let ownedDAI = parseFloat(await profile.getTokenAmount());
        this.setState({...this.state,
            ownedETH,
            ownedDAI,
            updated : true
        })
    }
    changeCurrency = async (id) => {
        await store.dispatch(setDepositInfo({key : "currency", value : id}));
    }

    render(){
        const { currency } = this.props.deposit;
        const { updated, ownedDAI, ownedETH } = this.state;

        const alertConditions = {
            dai : ownedDAI <= 0,
            eth : ownedETH <= 0
        }

        return (
            <div>
                <PaymentBox 
                    onClick={this.changeCurrency}
                    alertMessage={'You Don´t Own Enough Any Ethereum'} picked={currency} 
                    alertCondition={updated && alertConditions.eth} disabled={!updated || alertConditions.eth} id={"eth"}  
                    image={currencies.ethereum} type={'Ethereum'} 
                    description={'Native Currency of Ethereum'} time={'2-3 minutes'} />
                <PaymentBox 
                    onClick={this.changeCurrency}
                    alertMessage={'You Don´t Own Enough Any DAI'} picked={currency} 
                    alertCondition={updated && alertConditions.dai} disabled={!updated || alertConditions.dai}  id={"dai"} 
                    image={currencies.dai} type={'DAI'} 
                    description={'A Stable ERC20 Token that equals $1=1 DAI'} time={'1-2 minutes'} />
            </div>
        )
    }
}

function mapStateToProps(state){
    return {
        deposit : state.deposit,
        profile : state.profile
    };
}

export default connect(mapStateToProps)(CurrencyDepositForm);
