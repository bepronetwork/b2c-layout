import React, { Component } from 'react';
import './index.css';
import { connect } from "react-redux";
import  QRCode from 'qrcode.react';
import { Typography } from 'components';
import building from 'assets/blockchain.png';
import loading from 'assets/loading.gif';
import _ from 'lodash';

class DepositForm extends Component {

    intervalID = 0;

    constructor(props) {
        super(props); 
        this.state = {
            addressInitialized: false,
            address: null,
            isLoaded: false
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
        var textField = document.createElement('textarea')
        textField.innerText = address;
        document.body.appendChild(textField)
        textField.select()
        document.execCommand('copy')
        textField.remove()
    };

    render() {
        const { deposit } = this.props;
        const { addressInitialized, address, isLoaded } = this.state;

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
                        <div styleName="info">
                            <Typography variant={'x-small-body'} color={`white`}>
                                Scan the QR code and transfer {deposit.currency.ticker} to it, 
                                only deposit {deposit.currency.ticker} in this address. 
                                <br/><br/>
                                Never send other currencies, we are not responsible for any mistake. 
                            </Typography>
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
                                <button onClick={this.copyToClipboard} styleName='text-copy-container'>
                                    <Typography variant={'small-body'} color={'white'}>
                                        Copy
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
                                    Your Deposit Address is being generated, please wait a few minutes.
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
