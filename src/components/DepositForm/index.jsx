import React, { Component } from 'react';
import './index.css';
import { connect } from "react-redux";
import  QRCode from 'qrcode.react';
import { Typography } from 'components';

class DepositForm extends Component {
    constructor(props) {
        super(props); 
    }

    componentDidMount(){
        this.projectData(this.props)
    }

    projectData = async (props) => {
        this.setState({...this.state})
    }

    copyToClipboard = (e) => {
        const { deposit } = this.props;
        var textField = document.createElement('textarea')
        textField.innerText = deposit.currency.address;
        document.body.appendChild(textField)
        textField.select()
        document.execCommand('copy')
        textField.remove()
    };

    render() {
        const { deposit } = this.props;
        return (
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
                        We are not responsible for any mistake. 
                    </Typography>
                </div>
                <div styleName="qrcode">
                    <QRCode value={deposit.currency.address} />
                </div>
                <div styleName="address">
                    <div styleName='link-text-container'>
                        <Typography variant={'x-small-body'} color={`casper`}>
                            {deposit.currency.address}
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
