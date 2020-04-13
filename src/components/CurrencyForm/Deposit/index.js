import React from "react";
import { connect } from "react-redux";
import PaymentBox from "../../PaymentBox";
import { setDepositInfo } from "../../../redux/actions/deposit";
import store from "../../../containers/App/store";
import { getApp } from "../../../lib/helpers";
import { CopyText } from '../../../copy';

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
        currencies = currencies.filter(c => c.virtual === false);

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
        const {ln} = this.props;
        const copy = CopyText.currencyFormIndex[ln];

        return (
            <div>
                {currencies.map( c => {
                    return (
                        <PaymentBox 
                            onClick={ () => this.changeCurrency(c)}
                            isPicked={new String(deposit.currency._id).toString() == new String(c._id).toString()}
                            id={`${c.ticker}`}  
                            image={c.image} type={`${c.name}`} 
                            description={copy.INDEX.PAYMENTBOX.DESCRIPTION[0]}
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
        profile : state.profile,
        ln: state.language
    };
}

export default connect(mapStateToProps)(CurrencyDepositForm);
