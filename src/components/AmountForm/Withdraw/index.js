import React, { Component } from "react";
// eslint-disable-next-line import/no-cycle
import "./index.css";
import { connect } from "react-redux";
import { compose } from 'lodash/fp';
import { InputNumber,  Typography, InformationBox, InputText } from 'components';
import { Col, Row } from 'reactstrap';
import store from "../../../containers/App/store";
import { setWithdrawInfo } from "../../../redux/actions/withdraw";
import info from 'assets/info.png';
import building from 'assets/blockchain.png';
import loading from 'assets/loading.gif';
import _ from 'lodash';

const defaultProps = {
    ticker : 'N/A',
    balance : 0,
    amount : 0,
    addressInitialized: false,
    isLoaded: false,
    toAddress: null
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

        this.setState({...this.state, 
            ticker : currency.ticker,
            amount : withdraw.amount,
            toAddress : withdraw.toAddress,
            balance
        })
    }

    onChangeAmount = async (amount) => {
        this.setState({...this.state, amount : parseFloat(amount)});
        await store.dispatch(setWithdrawInfo({key : "amount", value : parseFloat(amount)}));
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
        const { amount, balance, ticker, addressInitialized, isLoaded, toAddress } = this.state;
        const MIN_WITHDRAWAL = 0.00001;

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
                    <div style={{marginBottom : 20}}>
                        <Row>
                            <Col md={12}>
                                <div style={{marginBottom : 20, marginTop : 10}}>
                                    <InputText
                                        name="toAddress"
                                        onChange={(toAddress) => this.onToAddressChange(toAddress)}
                                        onChange={this.onToAddressChange}
                                        value={toAddress}
                                        placeholder="Address"
                                        weight="regular"
                                    />
                                </div>
                            </Col>
                        </Row>
                        <Row>
                            <Col md={10}>
                                <InputNumber
                                    name="amount"
                                    min={MIN_WITHDRAWAL}
                                    precision={6}
                                    title=""
                                    onChange={(amount) => this.onChangeAmount(amount)}
                                    icon="cross"
                                    value={amount}
                                />
                            </Col>
                            <Col md={2}>
                                <div style={{marginTop: 10, textAlign: "left"}}>
                                    <Typography variant={'body'} color={'white'}>{`${ticker}`}</Typography>
                                </div>
                            </Col>
                        </Row>
                        <div styleName='text-info-deposit'>
                            <Typography variant={'x-small-body'} color={'white'}>{`Minimum Withdrawal is ${MIN_WITHDRAWAL} ${ticker}`}</Typography>
                        </div>
                    </div>
                    <Row>
                        <Col md={4}>
                            {this.renderAmountWithdrawButton({disabled : (balance < 0.1),amount :'0.1', onChangeAmount : this.onChangeAmount, ticker})}
                        </Col>
                        <Col md={4}>
                            {this.renderAmountWithdrawButton({disabled : (balance < 10),amount :'10', onChangeAmount : this.onChangeAmount, ticker})}
                        </Col>
                        <Col md={4}>
                            {this.renderAmountWithdrawButton({disabled : (balance < 1000),amount :'100', onChangeAmount : this.onChangeAmount, ticker})}
                        </Col>
                    </Row>
                </div>
                :
                <div>
                        <img src={building} styleName="building-img"/>
                        <div styleName="building-info">
                            <Typography variant={'small-body'} color={`white`}>
                                Your Address is being created, wait a few minutes.
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
