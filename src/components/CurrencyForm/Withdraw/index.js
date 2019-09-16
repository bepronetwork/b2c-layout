import React from "react";
import { connect } from "react-redux";
import PaymentBox from "../../PaymentBox";
import currencies from "../../../config/currencies";
import store from "../../../containers/App/store";
import { setWithdrawInfo } from "../../../redux/actions/withdraw";

class CurrencyWithdrawForm extends React.Component{
    constructor(props){
        super(props);
        this.state = {
           
        }
    }

    componentDidMount(){
        this.projectData(this.props);
    }

    componentWillReceiveProps(props){
        this.projectData(props);
    }

    projectData = async (props) => {

    }

    changeCurrency = async (id) => {
        await store.dispatch(setWithdrawInfo({key : "currency", value : id}));
    }

    render(){
        const { currency } = this.props.withdraw;


        return (
            <div>
                <PaymentBox 
                    onClick={this.changeCurrency}
                    picked={currency} 
                    id={"withdraw-eth"}  
                    disabled={true}
                    image={currencies.ethereum} type={'Ethereum'} 
                    info={'Soon'}
                    description={'Native Currency of Ethereum'} time={'3-5 minutes'} />
                <PaymentBox 
                    onClick={this.changeCurrency}
                    picked={currency} 
                    id={"withdraw-dai"} 
                    image={currencies.dai} type={'DAI'} 
                    description={'A Stable ERC20 Token that equals $1=1 DAI'} time={'2-3 minutes'} />
            </div>
        )
    }
}

function mapStateToProps(state){
    return {
        withdraw : state.withdraw,
        profile : state.profile
    };
}

export default connect(mapStateToProps)(CurrencyWithdrawForm);
