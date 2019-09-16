import React, { Component } from "react";
// eslint-disable-next-line import/no-cycle
import "./index.css";
import { connect } from "react-redux";
import { compose } from 'lodash/fp';
import { InputNumber,  Typography } from 'components';
import { Col, Row } from 'reactstrap';
import dollar from 'assets/dollar.png';
import store from "../../../containers/App/store";
import { setWithdrawInfo } from "../../../redux/actions/withdraw";

const defaultProps = {
    ticker : 'DAI',
    maxWithdrawal : 0,
    balance : 0
}

class AmountWithdrawForm extends Component {

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
        const { withdraw, profile } = props;
        let balance = await profile.getBalanceAsync();
        let maxWithdrawal = await profile.getContract().getMaxWithdrawal();
        this.setState({...this.state, 
            ticker : profile.getAppCurrencyTicker(),   
            amount : withdraw.amount,
            maxWithdrawal,
            balance
        })
    }

    onChangeAmount = async (amount) => {
        this.setState({...this.state, amount : parseFloat(amount)});
        await store.dispatch(setWithdrawInfo({key : "amount", value : parseFloat(amount)}));
    }

    renderAmountWithdrawButton({disabled, amount, onChangeAmount}){
        return (
            <button disabled={disabled} onClick={() => onChangeAmount(amount)}  styleName={`container-root ${disabled ? 'no-hover' : ''}`}>
                <Typography color={'white'} variant={'small-body'}>{`${amount} $`}</Typography>
            </button>
        )
    }

    render() {
        const { amount, balance, maxWithdrawal } = this.state;
        let maxWithdrawInput = Math.min(balance, maxWithdrawal);

        return (
            <div>
                <div style={{marginBottom : 20}}>
                    <Row>
                        <Col md={10}>
                            <InputNumber
                                name="amount"
                                min={0.1}
                                max={maxWithdrawInput}
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
                </div>
                <Row>
                    <Col md={4}>
                        {this.renderAmountWithdrawButton({disabled : (maxWithdrawInput < 10),amount :'10.00', onChangeAmount : this.onChangeAmount})}
                    </Col>
                    <Col md={4}>
                        {this.renderAmountWithdrawButton({disabled : (maxWithdrawInput < 20),amount :'20.00', onChangeAmount : this.onChangeAmount})}
                    </Col>
                    <Col md={4}>
                        {this.renderAmountWithdrawButton({disabled : (maxWithdrawInput < 30),amount :'30.00', onChangeAmount : this.onChangeAmount})}
                    </Col>
                </Row>
            </div>
        );
    }
}




function mapStateToProps(state){
    return {
        withdraw : state.withdraw,
        profile : state.profile,
        ln : state.language
    };
}

export default compose(connect(mapStateToProps))(AmountWithdrawForm);
