import React from "react";
import './index.css';
import { Row, Col } from 'reactstrap';
import { Typography, Button } from 'components';
import _, { result } from 'lodash';
import { connect } from "react-redux";
import classNames from 'classnames';


import { getApp, getAppCustomization } from "../../lib/helpers";
import { CopyText } from "../../copy";
import { formatCurrency } from '../../utils/numberFormatation';

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
            seconds: 0,
            amount: 0,
            secondsToCanvas: 0,
            isCanvasRenderer: false
        }
    }

    async componentDidMount(){
        this.projectData(this.props);
        this.setState({ isCanvasRenderer: true })
        setInterval(() => this.parseMillisecondsIntoReadableTime() , 0)
        this.timerInterval = setInterval(() => {
        const { seconds, minutes } = this.state;
        if (seconds > 0) {
            this.setState({ seconds: seconds - 1 });
        }
        
        if (seconds === 0) {
            if (minutes === 0) {

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
        this.setState({ isCanvasRenderer: true })
        if(props !== this.props) {
            this.projectData(props);
            this.parseMillisecondsIntoReadableTime();
        }
    }

    projectData = async (props) => {
        const { wallet } = props;
        const { isCanvasRenderer } = this.state;
        const virtual = getApp().virtual;
        this.setState({ isCanvasRenderer: false })
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
        this.funcToGetValue();
        this.funcVerificationCurrency();
        if(isCanvasRenderer){
            this.verifyTime();
        }
    }

    funcVerifyUserWalletDate = async() => {
        const { wallet, profile } = this.props;
        const resultWallet = await profile.lastTimeFree();

        if(resultWallet){
            const walletFind = resultWallet.find(w => w.currency === wallet.currency._id)

            return walletFind.date
        }else{
            return false;
         }
    }

    verifyTime = async() => {
        const { seconds, minutes, isCanvasRenderer } = this.state;
        const { wallet } = this.props;
        if(seconds === 0 && minutes === 0){
            this.setState({ disabledFreeButton: false });
        }else{
            this.startCountdown(document.getElementById(wallet.currency.name));
            this.setState({ disabledFreeButton: true });
        }
    }

    funcVerification = () => {
        const { wallet } = this.props;

        const freeCurrency = getApp().addOn.freeCurrency;

        if(freeCurrency){
            const wallets = freeCurrency.wallets;
            const walletFind = wallets.find(w => w.currency === wallet.currency._id)

            return walletFind ? walletFind.activated : false
        }else{
            return false;
        }
    }

    funcVerificationTime = () => {
        const { wallet } = this.props;

        const freeCurrency = getApp().addOn.freeCurrency;

        if(freeCurrency){
            const wallets = freeCurrency.wallets;
            const walletFind = wallets.find(w => w.currency === wallet.currency._id)

            return walletFind ? walletFind.time : 0
        }else{
            return false;
        }
    }

    funcVerificationCurrency = async () => {
        const { wallet } = this.props;

        const freeCurrency = getApp().addOn.freeCurrency;
        console.log(freeCurrency)
        if(freeCurrency){
            const wallets = freeCurrency.wallets;
            const walletFind = wallets.find(w => w.currency === wallet.currency._id)

            return walletFind ? walletFind.currency : ""
        }else{
            return false;
        }
    }

    startCountdown = async(canvas) => {
        const { secondsToCanvas } = this.state;
        const { colors } = getAppCustomization();

        const secondaryColor = colors.find(c => {
            return c.type == "secondaryColor"
        });
    
        const PI_BY_180 = Math.PI / 180;
        const THREE_PI_BY_TWO = 3 * Math.PI / 2;
        const DEFAULT_VALUE = -360;
        const TIMER_INTERVAL = 40;
      
        const ringTimer = canvas.getContext('2d');
        const {
          width,
          height
        } = canvas.getBoundingClientRect();
      
        const centerX = width / 2;
        const centerY = height / 2;
        const radius = Math.min(width, height) / 2;
      
        const startTime = Date.now();
        const endTime = startTime + (secondsToCanvas  * 1000);
      
        const renderCountdown = (currentValue) => {
          const start = THREE_PI_BY_TWO;
      
          ringTimer.clearRect(0, 0, width, height);
      
          // Draw outer track ring
          ringTimer.beginPath();
          ringTimer.moveTo(centerX, centerY);
          ringTimer.arc(
            centerX,
            centerY,
            radius,
            start - (360 - currentValue) * PI_BY_180,
            start,
            true // counter-clockwise
          );
          ringTimer.closePath();
          ringTimer.fillStyle = secondaryColor.hex;
          ringTimer.fill();
        }
      
        return new Promise(resolve => {
            renderCountdown(0);
          const id = setInterval(() => {
            const now = Date.now();
            if (now > endTime) {
              clearInterval(id);
              return resolve();
            }
      
            const elapsedTime = (Date.now() - startTime) / 1000;
            const currentValue = DEFAULT_VALUE * Math.max(0, secondsToCanvas - elapsedTime) /  secondsToCanvas
            renderCountdown(currentValue);
          }, TIMER_INTERVAL);
        });
      }

       
    funcToGetValue = () => {
        const { wallet } = this.props;

        const freeCurrency = getApp().addOn.freeCurrency;
        if(freeCurrency){
            const wallets = freeCurrency.wallets;
            const walletTest = wallets.find(w => w.currency === wallet.currency._id)

            return this.setState({ amount: walletTest ? walletTest.value : 0 }) 
        }else{
            return false;
        }
    }

    userUpdateBalance = async () => {
        const { profile } = this.props;
        const { amount } = this.state;
        
        await profile.updateBalanceWithoutBet({ amount });
        return new Promise(resolve => setTimeout(() => resolve(), 500));
      };
    

  handleSendCurrancyFree = async () => {
    try {
        const { profile, ln } = this.props;
        const resultCurrency = await this.funcVerificationCurrency();

        await profile.sendFreeCurrencyRequest({
          currency_id: resultCurrency
        });

        this.setState({ disabledFreeButton: true });
        await this.userUpdateBalance();
        await profile.getAllData(true);
        await this.verifyTime();
    } catch (err) {
      console.log(err);
      this.setState({ disabledFreeButton: false });
    }
  }

    parseMillisecondsIntoReadableTime = async () => {
            
        const resultUserDate =  await this.funcVerifyUserWalletDate();
        const miliseconds = resultUserDate + this.funcVerificationTime() - Date.now();
        const hours = miliseconds / (1000 * 60 * 60);


        if(hours< 0){
            this.setState({
                hours: 0,
                minutes: 0,
                seconds: 0,
                secondsToCanvas: 0
            });
        }else{
            const secondsToCanvas = (miliseconds / 1000);
            const hours = miliseconds / (1000 * 60 * 60);
            const absoluteHours = Math.floor(hours);
            const h = absoluteHours > 9 ? absoluteHours : absoluteHours;
            const minutes = (hours - absoluteHours) * 60;
            const absoluteMinutes = Math.floor(minutes);
            const m = absoluteMinutes > 9 ? absoluteMinutes : absoluteMinutes;
            const seconds = (minutes - absoluteMinutes) * 60;
            const absoluteSeconds = Math.floor(seconds);
            const s = absoluteSeconds > 9 ? absoluteSeconds : absoluteSeconds;

            this.setState({
                hours: h,
                minutes: m,
                seconds: s,
                secondsToCanvas: secondsToCanvas
            });

                if(s === 0 && s === 0){
                    this.setState({ disabledFreeButton: false });
                }else{
                    this.setState({ disabledFreeButton: true });
                }
            }
        };

    onClick = () => {
        const { id, onClick } = this.props;
        if(onClick){
            onClick(id)
            this.setState({ isCanvasRenderer: false });
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
                                <div styleName="border-radius">
                                    <canvas id={wallet.currency.name} width="30" height="30"></canvas>
                                </div>
                            </Col>
                            <Col xs={8} md={8} styleName="button-padding">
                                <Button size={'x-small'}
                                theme={'action'}
                                disabled={disabledFreeButton}
                                onClick={this.handleSendCurrancyFree}>
                                    <Typography color={'white'} variant={'small-body'}>Replenish</Typography>
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
