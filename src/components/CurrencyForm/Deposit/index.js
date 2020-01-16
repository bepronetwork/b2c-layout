import React from "react";
import { connect } from "react-redux";
import PaymentBox from "../../PaymentBox";
import { setDepositInfo } from "../../../redux/actions/deposit";
import store from "../../../containers/App/store";
import { getApp } from "../../../lib/helpers";
import { getContract } from "../../../lib/ethereum/lib/Ethereum";

class CurrencyDepositForm extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            updated : false,
            currencies : [],
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
        await store.dispatch(setDepositInfo({key : "currency", value : c}));
    }

    render(){
        const { currencies } = this.state;
        const { deposit } = this.props;

        return (
            <div>
                {currencies.map( c => {
                    return (
                        <PaymentBox 
                            onClick={ () => this.changeCurrency(c)}
                            isPicked={new String(deposit.currency._id).toString() == new String(c._id).toString()}
                            alertMessage={`You Don´t Own Enough Any ${c.ticker}`} 
                            alertCondition={c.alertCondition} disabled={c.alertCondition} id={`${c.ticker}`}  
                            image={c.image} type={`${c.name}`} 
                            description={'Token'} time={'5-10 seconds'} 
                        />
                    )
                })}
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
