import React from "react";
import './index.css';
import { Row, Col } from 'reactstrap';
import { Typography, Button } from 'components';
import _, { result } from 'lodash';
import { connect } from "react-redux";
import classNames from 'classnames';


import { getApp } from "../../lib/helpers";
import { CopyText } from "../../copy";
import { formatCurrency } from '../../utils/numberFormatation';
import store from "../../containers/App/store";

import { setMessageNotification } from "../../redux/actions/message";

class PaymentBox extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            checked : false,
            price : null,
            virtualTicker: null,
            walletImage: null,
            disabledFreeButton: true,
            minutes: 0,
            seconds: 0
        }
    }

    async componentDidMount(){
        this.projectData(this.props);
        await this.parseMillisecondsIntoReadableTime();
        this.timerInterval = setInterval(() => {
        const { seconds, minutes } = this.state;

        if (seconds > 0) {
            this.setState({ seconds: seconds - 1 });
        }

        if (seconds === 0) {
            if (minutes === 0) {
            clearInterval(this.timerInterval);
            this.setState({ disabledFreeButton: false })
            } else {
            this.setState(({ minutes }) => ({
                minutes: minutes - 1,
                seconds: 59,
                disabledFreeButton: true
            }));
            }
        }
        }, 1000);
    }

    componentWillReceiveProps(props){
        this.projectData(props);
    }

    projectData = async (props) => {
        const { wallet } = props;
        const virtual = getApp().virtual;

        if (virtual === true) {
            const virtualCurrency = getApp().currencies.find(c => c.virtual === true);

            if(wallet.currency.virtual !== true && virtualCurrency) {
                const virtualWallet = getApp().wallet.find(w => w.currency._id === virtualCurrency._id);
                const price = virtualWallet ? virtualWallet.price.find(p => p.currency === wallet.currency._id).amount : null;
                this.setState({ price, virtualTicker : virtualCurrency.ticker });
            }
        }

        const appWallet = getApp().wallet.find(w => w.currency._id === wallet.currency._id);

        this.setState({
            walletImage : _.isEmpty(appWallet.image) ? wallet.currency.image : appWallet.image
        });
    }

    funcVerification = () => {
        const { wallet } = this.props;

        const freeCurrency = getApp().addOn.freeCurrency;

        if(freeCurrency){
            const wallets = freeCurrency.wallets;
            const walletTest = wallets.find(w => w.currency === wallet.currency._id)

            return walletTest ? walletTest.activated : false
        }else{
            return false;
        }
    }

    funcVerificationTime = () => {
        const { wallet } = this.props;

        const freeCurrency = getApp().addOn.freeCurrency;

        if(freeCurrency){
            const wallets = freeCurrency.wallets;
            const walletTest = wallets.find(w => w.currency === wallet.currency._id)

            return walletTest ? walletTest.time : 0
        }else{
            return false;
        }
    }

    funcVerificationCurrency = async () => {
        const { wallet } = this.props;

        const freeCurrency = getApp().addOn.freeCurrency;

        if(freeCurrency){
            const wallets = freeCurrency.wallets;
            const walletTest = wallets.find(w => w.currency === wallet.currency._id)

            return walletTest ? walletTest.currency : ""
        }else{
            return false;
        }
    }

  handleSendCurrancyFree = async () => {
    const { profile, ln } = this.props;
    const resultCurrency = await this.funcVerificationCurrency();
    const copy = CopyText.homepage[ln];

    this.setState({ disabledFreeButton: true })
    try {
      const res = await profile.sendFreeCurrencyRequest({
        currency_id: resultCurrency
      });
      const { message, status } = res.data;
      if (status != 200) {
        store.dispatch(setMessageNotification(message));
        throw message;
      }

      store.dispatch(
        setMessageNotification(copy.CONTAINERS.APP.NOTIFICATION[2])
      );
    } catch (err) {
      console.log(err);
    }
    this.setState({ disabledFreeButton: false });
  }

    parseMillisecondsIntoReadableTime = async () => {
        const miliseconds = this.funcVerificationTime();
    
        const hours = miliseconds / (1000 * 60 * 60);
        const absoluteHours = Math.floor(hours);
        const h = absoluteHours > 9 ? absoluteHours : absoluteHours;
        const minutes = (hours - absoluteHours) * 60;
        const absoluteMinutes = Math.floor(minutes);
        const m = absoluteMinutes > 9 ? absoluteMinutes : absoluteMinutes;
        const seconds = (minutes - absoluteMinutes) * 60;
        const absoluteSeconds = Math.floor(seconds);
        const s = absoluteSeconds > 9 ? absoluteSeconds : absoluteSeconds;

        this.setState({ minutes: m, seconds: s })
      };

    onClick = () => {
        const { id, onClick } = this.props;
        if(onClick){
            onClick(id)
        }
    }

    render(){
        let { isPicked, wallet } = this.props;
        const { price, virtualTicker, walletImage, disabledFreeButton } = this.state;
        const styles = classNames("container-root", {
            selected: isPicked
        });

        const walletValid = this.funcVerification();

        return (
            <button onClick={this.onClick} styleName={styles} disabled={wallet.currency.virtual}>
                <Col>
                <Row>
                    <Col xs={4} md={4}>
                        <div styleName='container-image'>
                            <img src={walletImage} styleName='payment-image'/>
                        </div>
                    </Col>
                    <Col xs={8} md={8}>
                        <div styleName={'container-text'}>
                            <Typography variant={'small-body'} color={'white'}>
                                {`${wallet.currency.name} (${wallet.currency.ticker})`}
                            </Typography>
                            <div styleName='text-description'>
                                <Typography variant={'x-small-body'} color={'white'}>
                                    {`${formatCurrency(wallet.playBalance)} ${wallet.currency.ticker}`}
                                </Typography>
                            </div>
                            {price ? 
                                <div styleName='text-description'>
                                    <Typography variant={'x-small-body'} color={'white'}>
                                        {`1 ${virtualTicker} = ${price} ${wallet.currency.ticker}`}
                                    </Typography>
                                </div>
                            : null}
                        </div>
                    </Col>
                </Row>
                {
                    walletValid ?
                        <div styleName="bottom-line">
                            <Col xs={4} md={4} styleName="button-padding">
                                <div styleName="border-radius" />
                            </Col>
                            <Col xs={8} md={8} styleName="button-padding">
                                <Button size={'x-small'} theme={'action'} disabled={disabledFreeButton} onClick={this.handleSendCurrancyFree}>
                                    <Typography color={'white'} variant={'small-body'}>Replanish</Typography>
                                </Button>
                            </Col>
                        </div> 
                    : null
                }
                </Col>
            </button>
        )
    }
}

function mapStateToProps(state){
    return {
        deposit : state.deposit,
        profile : state.profile
    };
}

export default connect(mapStateToProps)(PaymentBox);
