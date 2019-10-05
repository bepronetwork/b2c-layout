import React, { Component } from "react";
// eslint-disable-next-line import/no-cycle
import "./index.css";
import { connect } from "react-redux";
import { compose } from 'lodash/fp';
import { InputNumber, Button, Typography } from 'components';
import { CopyText } from "../../../copy";
import { Col, Row } from 'reactstrap';
import dollar from 'assets/dollar.png';
import store from "../../../containers/App/store";
import { setDepositInfo } from "../../../redux/actions/deposit";

const defaultProps = {
    ticker : 'DAI',
    isDAIDeposit : false,
    maxDeposit : 0,
    ownedDAI : 0
}

class AmountDepositForm extends Component {

    constructor(props){
        super(props);
        this.state = { ...defaultProps };
    }

    componentDidMount(){
        this.projectData(this.props)
    }

    componentWillReceiveProps(props){
        this.projectData(props);
    }

    async projectData(props){
        const { deposit, profile } = props;

        let ownedDAI = parseFloat(await profile.getTokenAmount());
        let isDAIDeposit = (new String(deposit.currency).toLowerCase() == 'dai');
        let maxDeposit = await profile.getContract().getMaxDeposit();
        this.setState({...this.state, 
            ticker : profile.getAppCurrencyTicker(),   
            amount : deposit.amount,
            isDAIDeposit,
            ownedDAI,
            maxDeposit
        })
    }

    onChangeAmount = async (amount) => {
        this.setState({...this.state, amount : parseFloat(amount)});
        await store.dispatch(setDepositInfo({key : "amount", value : parseFloat(amount)}));
    }

    renderAmountDepositButton({disabled, amount, onChangeAmount}){
        return (
            <button disabled={disabled} onClick={() => onChangeAmount(amount)} styleName={`container-root ${disabled ? 'no-hover' : ''}`}>
                <Typography color={'white'} variant={'small-body'}>{`${amount} $`}</Typography>
            </button>
        )
    }

    render() {
        const { amount, ownedDAI, isDAIDeposit, maxDeposit, ticker } = this.state;
        let maxInputDeposit = isDAIDeposit ? Math.min(ownedDAI, maxDeposit) : maxDeposit;

        return (
            <div>
                <div style={{marginBottom : 20}}>
                    <Row>
                        <Col md={10}>
                            <InputNumber
                                name="amount"
                                min={0.1}
                                max={maxInputDeposit}
                                precision={2}
                                title=""
                                onChange={(amount) => this.onChangeAmount(amount)}
                                icon="cross"
                                value={amount}
                            />
                           
                        </Col>
                        <Col md={2}>
                            <img src={dollar} styleName='dollar-image'/>
                        </Col>
                    </Row>
                    {isDAIDeposit ? 
                        <div styleName='text-info-deposit'>
                                <Typography variant={'x-small-body'} color={'white'}>{`You only have ${ownedDAI} ${ticker}`}</Typography>
                        </div>
                    : null }
                </div>
                <Row>
                    <Col md={4}>
                        {this.renderAmountDepositButton({disabled : (maxInputDeposit < 10), amount :'10.00', onChangeAmount : this.onChangeAmount})}
                    </Col>
                    <Col md={4}>
                        {this.renderAmountDepositButton({disabled : (maxInputDeposit < 25),amount :'25.00', onChangeAmount : this.onChangeAmount})}
                    </Col>
                    <Col md={4}>
                        {this.renderAmountDepositButton({disabled : (maxInputDeposit < 50) ,amount :'50.00', onChangeAmount : this.onChangeAmount})}
                    </Col>
                </Row>
            </div>
        );
    }
}




function mapStateToProps(state){
    return {
        deposit : state.deposit,
        profile : state.profile,
        ln : state.language
    };
}

export default compose(connect(mapStateToProps))(AmountDepositForm);
