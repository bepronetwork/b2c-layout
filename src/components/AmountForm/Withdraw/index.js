import React, { Component } from "react";
// eslint-disable-next-line import/no-cycle
import "./index.css";
import { connect } from "react-redux";
import { compose } from 'lodash/fp';
import { InputNumber,  Typography, InformationBox, InputText } from 'components';
import { Col, Row } from 'reactstrap';
import store from "../../../containers/App/store";
import { setWithdrawInfo } from "../../../redux/actions/withdraw";
import { getApp } from "../../../lib/helpers";
import building from 'assets/blockchain.png';
import loading from 'assets/loading.gif';
import _ from 'lodash';
import { CopyText } from '../../../copy';

const defaultProps = {
    ticker : 'N/A',
    balance : 0,
    amount : 0,
    addressInitialized: false,
    isLoaded: false,
    toAddress: null,
    maxWithdraw: 0
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

    getCurrencyAddress = async () => {
        const { profile, withdraw } = this.props;
        const { addressInitialized } = this.state;

        if (!addressInitialized) {
            let response = await profile.getCurrencyAddress({ currency_id: withdraw.currency._id });
            if(_.isEmpty(response.message)) {
                this.setState({ addressInitialized: true });
            }
        }

        this.setState({ isLoaded: true });
    }

    async projectData(props){
        const { withdraw, profile } = props;
        const { currency } = withdraw;

        this.getCurrencyAddress();
        let balance = profile.getBalance(currency);

        const w = getApp().wallet.find(w => w.currency._id === currency._id);

        this.setState({...this.state, 
            ticker : currency.ticker,
            amount : withdraw.amount,
            toAddress : withdraw.toAddress,
            balance,
            maxWithdraw : w.max_withdraw
        })
    }

    onChangeAmount = async (amount) => {
        this.setState({...this.state, amount});
        await store.dispatch(setWithdrawInfo({key : "amount", value : amount}));
    }

    onToAddressChange = async event => {
        const toAddress = event.target.value;
        this.setState({...this.state, toAddress});
        await store.dispatch(setWithdrawInfo({key : "toAddress", value : toAddress}));
    };

    renderAmountWithdrawButton({disabled, amount, onChangeAmount, ticker}){
        return (
            <button disabled={disabled} onClick={() => onChangeAmount(amount)}  styleName={`container-root ${disabled ? 'no-hover' : ''}`}>
                <Typography color={'white'} variant={'small-body'}>{`${amount} ${ticker}`}</Typography>
            </button>
        )
    }

    render() {
        const { amount, maxWithdraw, ticker, addressInitialized, isLoaded, toAddress } = this.state;
        const {ln} = this.props;
        const copy = CopyText.amountFormIndex[ln];

        if(!isLoaded){
            return (
                <div>
                    <img src={loading} styleName='loading-gif'/>
                </div>
            )
        }

        return (
            <div>
                {addressInitialized 
                ?
                <div>
                    <div styleName="box">
                        <Row>
                            <Col md={12}>
                                <div style={{marginBottom : 20, marginTop : 10}}>
                                    <InputText
                                        name="toAddress"
                                        onChange={(toAddress) => this.onToAddressChange(toAddress)}
                                        onChange={this.onToAddressChange}
                                        value={toAddress}
                                        placeholder={copy.INDEX.INPUT_TEXT.PLACEHOLDER[0]}
                                        weight="regular"
                                        type="slim"
                                    />
                                </div>
                            </Col>
                        </Row>
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
                                    type="currency"
                                />
                            </Col>
                            <Col md={2}>
                                <div style={{marginTop: 10, textAlign: "left"}}>
                                    <Typography variant={'body'} color={'white'}>{`${ticker}`}</Typography>
                                </div>
                            </Col>
                        </Row>
                        <div styleName='text-info-deposit'>
                            <Typography variant={'x-small-body'} color={'white'}>
                                {copy.INDEX.TYPOGRAPHY.FUNC_TEXT[1]([maxWithdraw, ticker]) }
                            </Typography>
                        </div>
                    </div>
                </div>
                :
                <div>
                        <img src={building} styleName="building-img"/>
                        <div styleName="building-info">
                            <Typography variant={'small-body'} color={`white`}>
                                {copy.INDEX.TYPOGRAPHY.TEXT[0]}
                            </Typography>
                        </div>
                </div>
                }
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
