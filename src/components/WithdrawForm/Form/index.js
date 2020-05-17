import React, { Component } from "react";
import { connect } from "react-redux";
import { compose } from 'lodash/fp';
import { InputNumber,  Typography, InputText } from 'components';
import { Col, Row } from 'reactstrap';
import { getApp, getAddOn } from "../../../lib/helpers";
import { setMessageNotification } from '../../../redux/actions/message';
import { setWithdrawInfo } from "../../../redux/actions/withdraw";
import store from 'containers/App/store';
import building from 'assets/blockchain.png';
import loading from 'assets/loading.gif';
import { CopyText } from '../../../copy';
import { formatCurrency } from '../../../utils/numberFormatation';
import _ from 'lodash';
import "../index.css";

const defaultProps = {
    ticker : 'N/A',
    balance : 0,
    amount : 0,
    image : null,
    addressInitialized: false,
    isLoaded: false,
    toAddress: null,
    maxWithdraw: 0,
    minWithdraw: 0,
    disabled: true,
    fee: null,
    isTxFee: false,
    maxBalance: 0,
    minBalance: 0
}

class Form extends Component {

    intervalID = 0;

    constructor(props){
        super(props);
        this.state = { ...defaultProps };
    }

    componentDidMount(){
        this.projectData(this.props);
    }

    componentWillUnmount() {
        clearInterval(this.intervalID);
    }

    componentWillReceiveProps(props){
        this.setState({ isLoaded: false, addressInitialized: false});
        this.projectData(props);
    }

    setWithdrawInfoInRedux = async ({id}) => {
        await store.dispatch(setWithdrawInfo({key : 'id', value : id}));
    }

    getCurrencyAddress = async (wallet) => {
        const { profile, onAddress } = this.props;
        const response = await profile.getCurrencyAddress({ currency_id: wallet.currency._id });

        if(!_.isEmpty(response) && _.isEmpty(response.message)) {
            this.setState({ addressInitialized: true });
            onAddress(response.address);
            clearInterval(this.intervalID);
        }

        this.setState({ isLoaded: true });
    }

    projectData = async (props) => {
        const { wallet, isAffiliate } = props;
        const { currency } = wallet;
        let isTxFee = false;

        if(wallet && !wallet.address) {
            this.getCurrencyAddress(wallet);

            this.intervalID = setInterval( async () => {
                this.getCurrencyAddress(wallet);
            }, 2*10000)
        }
        else {
            this.setState({ isLoaded: true, addressInitialized: true });
        }

        const appWallet = isAffiliate === true ? wallet : getApp().wallet.find(w => w.currency._id === currency._id);

        if(getAddOn().hasOwnProperty("txFee")) {
            isTxFee = getAddOn().txFee.isTxFee;
        }

        this.setState({ 
            ticker : currency.ticker,
            image : wallet.image ? wallet.image : wallet.currency.image,
            maxWithdraw : formatCurrency(appWallet.max_withdraw),
            minWithdraw : formatCurrency(appWallet.min_withdraw),
            isTxFee,
            fee: isTxFee === true ? getAddOn().txFee.withdraw_fee.find(f => f.currency === currency._id).amount : null,
            maxBalance : formatCurrency(appWallet.max_withdraw > wallet.playBalance ? wallet.playBalance : appWallet.max_withdraw),
            minBalance : formatCurrency(appWallet.min_withdraw > wallet.playBalance ? wallet.playBalance : appWallet.min_withdraw)
        })
    }

    onChangeAmount = async (amount) => {
        const { toAddress } = this.state;
        this.setState({...this.state, amount, disabled: !(amount && toAddress)});
    }

    onToAddressChange = async event => {
        const { amount } = this.state;
        const toAddress = event.target.value;
        this.setState({...this.state, toAddress, disabled: !(amount && toAddress)});
    };

    askForWithdraw = async () => {
        try{
            const { amount, toAddress } = this.state;
            const { wallet, profile, isAffiliate } = this.props;
            const { currency } = wallet;

            this.setState({...this.state, disabled : true});

            var res;
            if(isAffiliate === true){
                /* Create Withdraw Framework */
                res = await profile.askForWithdrawAffiliate({amount : parseFloat(amount), currency, address : toAddress});
            }else{
                /* Create Withdraw Framework */
                res = await profile.askForWithdraw({amount : parseFloat(amount), currency, address : toAddress});
                if(res.withdraw) { await profile.updateBalance({ userDelta: -res.withdraw.amount }) };
            }

            await store.dispatch( setMessageNotification(
                'Withdraw was Queued, you can see it in the Withdraws Tab',                
            ));
           
            this.setState({...this.state, amount: 0, toAddress: ''});
            await this.setWithdrawInfoInRedux({id : res.withdraw._id});

        }catch(err){
            console.log(err);
        }
    }

    render() {
        const { amount, image, maxWithdraw, minWithdraw, maxBalance, minBalance, ticker, addressInitialized, isLoaded, toAddress, disabled, isTxFee, fee } = this.state;
        const {ln, isAffiliate} = this.props;
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
                            <Col md={12}>
                                <div styleName="amount">
                                    <InputNumber
                                        name="amount"
                                        min={minWithdraw}
                                        max={maxWithdraw}
                                        precision={6}
                                        title=""
                                        onChange={(amount) => this.onChangeAmount(amount)}
                                        icon="customized"
                                        value={amount}
                                        type="currency"
                                        custmomizedIcon={image}
                                    />
                                    <div styleName="min-max" onClick={() => this.onChangeAmount(minBalance)}>
                                        <Typography variant={'x-small-body'} color={'grey'}>
                                            Min
                                        </Typography>
                                    </div>
                                    <div styleName="min-max" onClick={() => this.onChangeAmount(maxBalance)}>
                                        <Typography variant={'x-small-body'} color={'grey'}>
                                            Max
                                        </Typography>
                                    </div>
                                </div>
                            </Col>
                        </Row>
                        <div styleName='text-info-deposit'>
                            { isAffiliate !== true
                                ?
                                    <Typography variant={'x-small-body'} color={'grey'}>
                                        {copy.INDEX.TYPOGRAPHY.FUNC_TEXT[1]([maxWithdraw, ticker])}.
                                    </Typography>
                                :
                                    null
                            }
                            <Typography variant={'x-small-body'} color={'grey'}>
                                {copy.INDEX.TYPOGRAPHY.FUNC_TEXT[2]([minWithdraw, ticker])}.
                            </Typography>
                            {
                                isTxFee === true 
                                ?
                                    <div styleName="fee">
                                        <Typography variant={'x-small-body'} weight={"bold"} color={'grey'}>
                                            * Fee: {fee} {ticker}
                                        </Typography>
                                    </div>
                                :
                                    null
                            }
                        </div>
                        <div>
                            <button onClick={this.askForWithdraw} styleName='withdraw' disabled={disabled}>
                                <Typography variant={'small-body'} color={'white'}>
                                    {copy.INDEX.TYPOGRAPHY.TEXT[1]} Withdraw
                                </Typography>
                            </button>
                        </div>
                        <div styleName="disclaimer">
                            <div styleName="title">
                                <Typography variant={'x-small-body'} color={'grey'} weight={'bold'}>
                                    {copy.INDEX.DISCLAIMER.NOTICE}:
                                </Typography>
                            </div>
                            <ul>
                                <li>
                                    <Typography variant={'x-small-body'} color={'grey'}>
                                        {copy.INDEX.DISCLAIMER.LIST[0]}
                                    </Typography>
                                </li>
                                <li>
                                    <Typography variant={'x-small-body'} color={'grey'}>
                                        {copy.INDEX.DISCLAIMER.LIST[1]}
                                    </Typography>
                                </li>
                            </ul>
                        </div>
                    </div>
                    :
                    <div styleName="building">
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
        profile : state.profile,
        ln : state.language
    };
}

export default compose(connect(mapStateToProps))(Form);