import React, { Component } from 'react';
import './index.css';
import { connect } from "react-redux";
import  QRCode from 'qrcode.react';
import { Typography } from 'components';
import building from 'assets/blockchain.png';
import loading from 'assets/loading.gif';
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
            copied: false
        }
    }

    componentDidMount(){
        this.projectData(this.props)
    }

    componentWillUnmount() {
        clearInterval(this.intervalID);
    }

    getCurrencyAddress = async () => {
        const { profile, deposit } = this.props;

        let response = await profile.getCurrencyAddress({ currency_id: deposit.currency._id });
        if(_.isEmpty(response.message)) {
            this.setState({ addressInitialized: true, address: response.address });
            clearInterval(this.intervalID);
        }

        this.setState({ isLoaded: true });
    }

    projectData = async (props) => {

        this.getCurrencyAddress();

        this.intervalID = setInterval( async () => {
            this.getCurrencyAddress();
        }, 2*10000)

        this.setState({...this.state})
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
        const { deposit } = this.props;
        const { addressInitialized, address, isLoaded, copied } = this.state;
        const {ln} = this.props;
        const copy = CopyText.depositFormIndex[ln];

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
                            <div styleName="currency">
                                <div styleName="logo">
                                    <img src={deposit.currency.image} styleName="logo-img"/>
                                </div>
                                <div styleName="cur-name">
                                    <Typography variant={'body'} color={`white`}>
                                        {deposit.currency.ticker}
                                    </Typography>
                                </div>
                            </div>
                            <div>
                                <Typography variant={'x-small-body'} color={`white`}>
                                    {copy.INDEX.TYPOGRAPHY.FUNC_TEXT[0]([deposit.currency.ticker, deposit.currency.ticker])}
                                    <br/><br/>
                                    {copy.INDEX.TYPOGRAPHY.TEXT[0]}
                                </Typography>
                            </div>
                        </div>
                        <div styleName="qrcode">
                            <QRCode value={address} />
                        </div>
                        <div styleName="address">
                            <div styleName='link-text-container'>
                                <Typography variant={'x-small-body'} color={`casper`}>
                                    {address}
                                </Typography>
                            </div>
                            <div>
                                {copied ? (
                                    <div styleName="copied">
                                        <Typography variant="small-body" color={'white'}>
                                            Copied
                                        </Typography>
                                    </div>
                                ) : null}
                                <button onClick={this.copyToClipboard} styleName='text-copy-container'>
                                    <Typography variant={'small-body'} color={'white'}>
                                        {copy.INDEX.TYPOGRAPHY.TEXT[1]}
                                    </Typography>
                                </button>
                            </div>
                        </div>
                    </div>
                :
                    <div>
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
        deposit : state.deposit,
        profile : state.profile,
        ln : state.language
    };
}

export default connect(mapStateToProps)(DepositForm);
