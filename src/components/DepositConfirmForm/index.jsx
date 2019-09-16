import React from "react";
import { Row, Col } from 'reactstrap';
import { Typography, Checkbox } from 'components';
import { connect } from "react-redux";
import './index.css';
import loading from 'assets/loading.gif';
import transaction from 'assets/transaction.png';
import { getTransactionData } from "../../lib/ethereum/lib/Etherscan";
import { AddressConcat, Numbers } from "../../lib/ethereum/lib";
import { ProgressBarCircular } from "../ProgressBar";
import { setDepositInfo } from "../../redux/actions/deposit";
import { CONFIRMATIONS_NEEDED } from 'lib/api/apiConfig';
import store from "../../containers/App/store";

class DepositConfirmForm extends React.Component{
    constructor(props){
        super(props);
        this.state = { 
            confirmation : 0,
            onLoading : false
        }
    }

    componentDidMount(){
        this.projectData(this.props);
        setInterval( () => {
            this.projectData(this.props);
        }, 1*1000)
    }   

    projectData = async (props) => {
        const { profile, deposit } = props;
        // Get Transaction Confirmations
        let tx = await getTransactionData(deposit.tx);
        if(!tx){return null}
        this.setState({...this.state, confirmations : tx.confirmations})
    }

    onConfirm = async () => {
        try{
            this.setState({...this.state, onLoading : true});
            const { deposit, profile } = this.props;
            /* Create Deposit Confirm API */
            let res = await profile.confirmDeposit({amount : Numbers.toFloat(deposit.amount), transactionHash : deposit.tx});
            if(!res){throw new Error("Error on Transaction")};
            await profile.getAllData();
            await store.dispatch(setDepositInfo({key : 'isConfirmed', value : true}));
            this.setState({...this.state, onLoading : false, confirmed : true});
        }catch(err){
            this.setState({...this.state, onLoading : false});
        }

    }

    render(){
        const { 
            deposit
        } = this.props;

        const { tx } = deposit;
        const { confirmations, onLoading, confirmed } = this.state;

        let progress = parseInt(confirmations/CONFIRMATIONS_NEEDED*100);
        let completed = (progress >= 100);
        let disabled = (!completed || onLoading || confirmed);

        return (
            <div styleName='root'>
                <button disabled={disabled} onClick={this.onConfirm} styleName={`tx-box ${confirmed ? 'picked' : ''} ${disabled ? 'nohover' : ''} ${(onLoading || !completed) ? 'onLoading' : ''}`}>
                    <Row>
                        <Col xs={3} md={3}>
                            <div styleName='circle-confirmation'>
                                <ProgressBarCircular progress={progress}/>    
                            </div>
                            <div styleName='container-image'>
                                <img src={transaction} styleName='payment-image'/>
                            </div>
                        </Col>
                        <Col xs={5} md={6}>
                            <div styleName={'container-text'}>
                                <Typography variant={'body'} color={'white'}>
                                    Transaction
                                </Typography>
                                <div styleName='text-description '>
                                    <Typography variant={'x-small-body'} color={'casper'}>
                                        {AddressConcat(tx)}
                                    </Typography>
                                </div>
                            </div>
                        </Col>
                        <Col xs={4} md={3}>
                            <div>
                                {
                                    (confirmed || completed)
                                ?
                                    <Checkbox isSet={confirmed} id={'confirmation'}/>
                                : 
                                    <img src={loading} styleName='loading-gif'/>
                                }
                            </div>
                        </Col>
                    </Row>
                </button>
              
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

export default connect(mapStateToProps)(DepositConfirmForm);
