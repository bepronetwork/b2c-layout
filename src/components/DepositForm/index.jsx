import React, { Component } from 'react';
import './index.css';
import { connect } from "react-redux";
import  QRCode from 'qrcode.react';
import { Typography, CopyIcon } from 'components';
import classNames from "classnames";
import building from 'assets/blockchain.png';
import loading from 'assets/loading.gif';
import { getApp, getAddOn, getAppCustomization, getIcon } from "../../lib/helpers";
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
            isTxFee: false,
            isDepositBonus: false,
            depositBonus: 0,
            maxBonusDeposit: 0,
            minBonusDeposit: 0

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
        const isTxFee = (getAddOn().txFee) ? getAddOn().txFee.isTxFee : false;
        const isDepositBonus = (getAddOn().depositBonus) ? getAddOn().depositBonus.isDepositBonus : false;

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

        this.setState({ 
            copied: false, 
            address : wallet.address,
            isTxFee,
            fee: isTxFee === true ? getAddOn().txFee.deposit_fee.find(f => f.currency === wallet.currency._id).amount : null,
            isDepositBonus,
            depositBonus: isDepositBonus === true ? getAddOn().depositBonus.percentage.find(d => d.currency === wallet.currency._id).amount : null,
            maxBonusDeposit: isDepositBonus === true ? getAddOn().depositBonus.max_deposit.find(d => d.currency === wallet.currency._id).amount : null,
            minBonusDeposit: isDepositBonus === true ? getAddOn().depositBonus.min_deposit.find(d => d.currency === wallet.currency._id).amount : null
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
        const { addressInitialized, address, isLoaded, copied, price, virtualTicker, isTxFee, fee, isDepositBonus, depositBonus, maxBonusDeposit, minBonusDeposit } = this.state;
        const {ln} = this.props;
        const copy = CopyText.depositFormIndex[ln];
        const addressStyles = classNames("address", {"ad-copied": copied});
        const { colors, skin } = getAppCustomization();
        const backgroundColor = colors.find(c => {
            return c.type == "backgroundColor"
        });
        const secondaryColor = colors.find(c => {
            return c.type == "secondaryColor"
        });

        if(!isLoaded){
            return (
                <div>
                    <img src={loading} styleName='loading-gif'/>
                </div>
            )
        }
        const copyIcon = getIcon(27);

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
                                <QRCode value={address} bgColor={skin.skin_type == "digital" ? backgroundColor.hex : "#fff" } fgColor={skin.skin_type == "digital" ? secondaryColor.hex : "#000"}/>
                            </div>
                            {copied ? (
                                <div styleName="copied">
                                    <Typography variant="small-body" color={'white'}>
                                        Copied
                                    </Typography>
                                </div>
                            ) : null}
                            <div styleName={addressStyles}>
                                <div styleName='link-text-container'>
                                    <Typography variant={'x-small-body'} color={skin.skin_type == "digital" ? `white` : `casper`}>
                                        {address}
                                    </Typography>
                                </div>
                                <div>
                                    <button onClick={this.copyToClipboard} styleName='text-copy-container'>
                                        {
                                            skin.skin_type == "digital"
                                            ?
                                                <div styleName="icon">
                                                    {copyIcon === null ? <CopyIcon /> : <img src={copyIcon} />}
                                                </div>
                                            :
                                                null
                                        }
                                        <Typography variant={'small-body'} color={'fixedwhite'}>
                                            {copy.INDEX.TYPOGRAPHY.TEXT[1]}
                                        </Typography>
                                    </button>
                                </div>
                            </div>
                            <div styleName="notice">
                                <div styleName="title">
                                    <Typography variant={'x-small-body'} color={'grey'} weight={'bold'}>
                                        {copy.NOTICE}
                                    </Typography>
                                </div>
                                {
                                    isTxFee === true || isDepositBonus === true 
                                    ?
                                        <ul>
                                            {
                                            isDepositBonus === true && depositBonus > 0
                                            ?
                                                <li>
                                                    <Typography variant={'x-small-body'} color={'grey'}>
                                                        Bonus {depositBonus}% (minimum amount {minBonusDeposit} {wallet.currency.ticker} and maximum amount {maxBonusDeposit} {wallet.currency.ticker} to qualify)
                                                    </Typography>
                                                </li>
                                            :
                                                null
                                            }
                                            {
                                            isTxFee === true && fee > 0
                                            ?
                                                <li>
                                                    <Typography variant={'x-small-body'} color={'grey'}>
                                                        Fee {fee} {wallet.currency.ticker}
                                                    </Typography>
                                                </li>
                                            :
                                                null
                                            }
                                        </ul>
                                    :
                                        null
                                }
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
