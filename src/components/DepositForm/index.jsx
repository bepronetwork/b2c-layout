import React, { Component } from 'react';
import './index.css';
import { connect } from "react-redux";
import  QRCode from 'qrcode.react';
import { Typography } from 'components';
import classNames from "classnames";
import building from 'assets/blockchain.png';
import loading from 'assets/loading.gif';
import { getApp, getAddOn } from "../../lib/helpers";
import _ from 'lodash';
import { CopyText } from '../../copy';

class DepositForm extends Component {

    intervalID = 0;

    constructor(props) {
        super(props); 
        this.state = {
            addressInitialized: false,
            address: null,
            isLoaded: false,
            copied: false,
            price : null,
            virtualTicker : null,
            fee: 0,
            isTxFee: false
        }
    }

    componentDidMount(){
        this.projectData(this.props)
    }

    componentWillUnmount() {
        clearInterval(this.intervalID);
    }

    componentWillReceiveProps(props){
        this.setState({ isLoaded: false, addressInitialized: false});
        this.projectData(props);
    }

    getCurrencyAddress = async (wallet) => {
        const { profile, onAddress } = this.props;

        let response = await profile.getCurrencyAddress({ currency_id: wallet.currency._id });

        if(!_.isEmpty(response) && _.isEmpty(response.message)) {
            this.setState({ addressInitialized: true, address: response.address });
            onAddress(response.address);
            clearInterval(this.intervalID);
        }

        this.setState({ isLoaded: true });
    } 

    projectData = async (props) => {
        const { wallet } = props;

        if(wallet && !wallet.address) {
            this.getCurrencyAddress(wallet);

            this.intervalID = setInterval( async () => {
                this.getCurrencyAddress(wallet);
            }, 2*10000)
        }
        else {
            this.setState({ isLoaded: true, addressInitialized: true });
        }

        if (getApp().virtual === true) {
            const virtualCurrency = getApp().currencies.find(c => c.virtual === true);

            if(wallet.currency && virtualCurrency) {
                const virtualWallet = getApp().wallet.find(w => w.currency._id === virtualCurrency._id);
                const price = virtualWallet ? virtualWallet.price.find(p => p.currency === wallet.currency._id).amount : null;

                this.setState({ price, virtualTicker : virtualCurrency.ticker });
            }
        }

        const isTxFee = getAddOn().txFee.isTxFee;

        this.setState({ 
            copied: false, 
            address : wallet.address,
            isTxFee,
            fee: isTxFee === true ? getAddOn().txFee.deposit_fee.find(f => f.currency === wallet.currency._id).amount : null
         });
    }

    copyToClipboard = (e) => {
        const { address } = this.state;
        var textField = document.createElement('textarea');
        textField.innerText = address;
        document.body.appendChild(textField);
        textField.select();
        document.execCommand('copy');
        textField.remove();

        this.setState({ copied: true })
    };

    render() {
        const { wallet } = this.props;
        const { addressInitialized, address, isLoaded, copied, price, virtualTicker, isTxFee, fee } = this.state;
        const {ln} = this.props;
        const copy = CopyText.depositFormIndex[ln];
        const addressStyles = classNames("address", {"ad-copied": copied});

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
                        <div styleName="info">
                            {price   ?
                                <div styleName="price">
                                    <Typography variant={'small-body'} color={`white`} weight={`bold`}>
                                        {`1 ${virtualTicker} = ${price} ${wallet.currency.ticker}`}
                                    </Typography>
                                </div>
                            :
                                null    
                            }
                            <Typography variant={'x-small-body'} color={`white`}>
                                {copy.INDEX.TYPOGRAPHY.FUNC_TEXT[0]([wallet.currency.ticker, wallet.currency.ticker])}
                                <br/><br/>
                                {copy.INDEX.TYPOGRAPHY.TEXT[0]}
                            </Typography>
                            <div styleName="qrcode">
                                <QRCode value={address} />
                            </div>
                            {
                            isTxFee === true && fee > 0
                            ?
                                <div styleName="fee">
                                    <Typography variant={'x-small-body'} weight={"bold"} color={'grey'}>
                                        * Fee: {fee} {wallet.currency.ticker}
                                    </Typography>
                                </div>
                            :
                                null
                            }
                            {copied ? (
                                <div styleName="copied">
                                    <Typography variant="small-body" color={'white'}>
                                        Copied
                                    </Typography>
                                </div>
                            ) : null}
                            <div styleName={addressStyles}>
                                <div styleName='link-text-container'>
                                    <Typography variant={'x-small-body'} color={`casper`}>
                                        {address}
                                    </Typography>
                                </div>
                                <div>
                                    <button onClick={this.copyToClipboard} styleName='text-copy-container'>
                                        <Typography variant={'small-body'} color={'white'}>
                                            {copy.INDEX.TYPOGRAPHY.TEXT[1]}
                                        </Typography>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                :
                    <div styleName="building">
                        <img src={building} styleName="building-img"/>
                        <div styleName="building-info">
                            <Typography variant={'small-body'} color={`white`}>
                                {copy.INDEX.TYPOGRAPHY.TEXT[2]}
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

export default connect(mapStateToProps)(DepositForm);
