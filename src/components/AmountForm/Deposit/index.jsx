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
    ticker : 'N/A',
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

        this.setState({...this.state, 
            ticker : deposit.currency.ticker,   
            amount : deposit.amount
        })
    }

    onChangeAmount = async (amount) => {
        this.setState({...this.state, amount : parseFloat(amount)});
        await store.dispatch(setDepositInfo({key : "amount", value : parseFloat(amount)}));
    }

    renderAmountDepositButton({disabled, amount, onChangeAmount, ticker}){
        return (
            <button disabled={disabled} onClick={() => onChangeAmount(amount)} styleName={`container-root ${disabled ? 'no-hover' : ''}`}>
                <Typography color={'white'} variant={'small-body'}>{`${amount} ${ticker}`}</Typography>
            </button>
        )
    }

    render() {
        const { amount, ticker } = this.state;
        const { deposit } = this.props;
        const { currency } = deposit;

        const {ln} = this.props;
        const copy = CopyText.amountFormIndex[ln];
        return (
            <div>
                <div style={{marginBottom : 20}}>
                    <Row>
                        <Col md={10}>
                            <InputNumber
                                name="amount"
                                min={0.00001}
                                precision={6}
                                title=""
                                onChange={(amount) => this.onChangeAmount(amount)}
                                icon="cross"
                                value={amount}
                            />
                        </Col>
                        <Col md={2}>
                            <img src={dollar} styleName='dollar-image' alt="Dollar" />
                        </Col>
                    </Row>
                    <div styleName='text-info-deposit'>
                            <Typography variant={'x-small-body'} color={'white'}>
                                {copy.INDEX.TYPOGRAPHY.FUNC_TEXT[0]([currency.ownership, currency.ticker]) }
                            </Typography>
                    </div>
                </div>
                <Row>
                    <Col md={4}>
                        {this.renderAmountDepositButton({amount :'0.1', onChangeAmount : this.onChangeAmount, ticker})}
                    </Col>
                    <Col md={4}>
                        {this.renderAmountDepositButton({amount :'25', onChangeAmount : this.onChangeAmount, ticker})}
                    </Col>
                    <Col md={4}>
                        {this.renderAmountDepositButton({amount :'50', onChangeAmount : this.onChangeAmount, ticker})}
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
