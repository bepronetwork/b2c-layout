import React from "react";
import { connect } from "react-redux";
import PaymentBox from "../../PaymentBox";
import store from "../../../containers/App/store";
import { setWithdrawInfo } from "../../../redux/actions/withdraw";
import { getApp } from "../../../lib/helpers";
import { getContract } from "../../../lib/ethereum/lib/Ethereum";

class CurrencyWithdrawForm extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            currencies : []
        }
    }

    componentDidMount(){
        this.projectData(this.props);
    }

    componentWillReceiveProps(props){
        this.projectData(props);
    }

    projectData = async (props) => {
        let currencies = getApp().currencies;
        currencies = await Promise.all(currencies.map( async c => {
            let contract = await getContract({currency : c, bank_address : c.bank_address});
            let holdingToken = await contract.getBalance({});
            return {
                ...c,
                ownership : holdingToken,
                alertCondition : (holdingToken <= 0)
            }
        }))

        this.setState({...this.state,
            currencies
        })
    }

    changeCurrency = async (c) => {
        await store.dispatch(setWithdrawInfo({key : "currency", value : c}));
    }

    render(){
        const { currencies } = this.state;
        const { withdraw } = this.props;

        return (
            <div>
                {currencies.map( c => {
                    return (
                        <PaymentBox 
                            onClick={ () => this.changeCurrency(c)}
                            isPicked={new String(withdraw.currency._id).toString() == new String(c._id).toString()}
                            id={`${c.ticker}`}  
                            image={c.image} type={`${c.name}`} 
                            description={'Token'} time={'5-10 seconds'} 
                            alertMessage={`You Don´t Own Enough ${c.ticker}`} 
                            alertCondition={c.alertCondition} disabled={c.alertCondition} id={`${c.ticker}`}
                        />
                    )
                })}
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
