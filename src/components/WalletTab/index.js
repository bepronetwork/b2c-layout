import React from "react";
import { connect } from "react-redux";
import { Tabs, DepositForm, WithdrawForm, Typography, Button, EmailIcon } from "components";
import PaymentBox from "../PaymentBox";
import DepositList from "./DepositList";
import WithdrawList from "./WithdrawList";
import { CopyText } from '../../copy';
import { getApp } from "../../lib/helpers";
import { Col, Row } from 'reactstrap';
import { setMessageNotification } from "../../redux/actions/message";
import store from "../../containers/App/store";
import _ from 'lodash';
import './index.css';

const defaultState = {
    tab: "deposit",
    wallets : [],
    wallet: null,
    isEmailConfirmed: false,
    isConfirmationSent: false
}

class WalletTab extends React.Component{
    constructor(props){
        super(props);
        this.state = defaultState;
    }

    componentDidMount(){
        const { isCurrentPath } = this.props;

        if (isCurrentPath) {
            this.projectData(this.props);
        }
    }

    componentWillReceiveProps(props){
        const { isCurrentPath } = props;
        if(props !== this.props && isCurrentPath) {
            this.projectData(props);
        }
    }

    projectData = async (props) => {
        const { profile } = this.props;
        let { wallet } = this.state;
        var user = !_.isEmpty(props.profile) ? props.profile : null;
        const virtual = getApp().virtual;
        const wallets = virtual === true ? profile.getWallets().filter(w => new String(w.currency.ticker).toString().toLowerCase() !== 'eth') : profile.getWallets();

        if(wallets && !wallet) {
            wallet = wallets.find(w => w.currency.virtual === false);
        }

        this.setState({...this.state,
            wallets,
            wallet,
            virtual : getApp().virtual,
            isEmailConfirmed: await user.isEmailConfirmed()
        });
    }

    handleTabChange = name => {
        this.setState({ tab: name });
    };

    changeWallet = async (wallet) => {
        this.setState({ wallet });
    }

    handleAddress = address => {
        let { wallet } = this.state;

        if(wallet) {
            wallet.address = address;
            this.setState({ wallet });
        }
    };

    handleResendConfirmEmail = async () => {
        const { profile, ln } = this.props;
        const copy = CopyText.homepage[ln];

        try{
            this.setState({ isConfirmationSent : true });
            let res = await profile.resendConfirmEmail();
            let { message, status } = res.data;        

            if(status != 200){
                store.dispatch(setMessageNotification(message));
                throw message
            };

            store.dispatch(setMessageNotification(copy.CONTAINERS.APP.NOTIFICATION[2]));
            this.setState({ isConfirmationSent : false });

        } catch(err){
            console.log(err);
        }

    };

    renderPopSendEmailAlert = () => {
        const { ln } = this.props;
        const { isEmailConfirmed, isConfirmationSent } = this.state;
        const copyConfirmEmail = CopyText.homepage[ln];

        return(
            isEmailConfirmed === false
            ?
                <div styleName="email-confirmation">
                    <div styleName="email-title">
                        <span styleName="icon">
                            <EmailIcon/>
                        </span>
                        <Typography variant={'small-body'} color={'grey'} weight={"bold"}>
                            {copyConfirmEmail.CONTAINERS.APP.MODAL[2]}
                        </Typography>
                    </div>
                    <div styleName="email-content">
                        <div styleName="email-text">
                            <Typography variant={'x-small-body'} color={'white'}>
                                Your e-mail is not confirmed.
                            </Typography>
                            <Typography variant={'x-small-body'} color={'white'}>
                                Please click the button to send another e-mail confirmation.
                            </Typography>
                        </div>
                        <div styleName="email-buttons">
                            <div styleName="button">
                                <Button size={'x-small'} theme={'action'} disabled={isConfirmationSent} onClick={this.handleResendConfirmEmail}>
                                    <Typography color={'fixedwhite'} variant={'small-body'}>{copyConfirmEmail.CONTAINERS.APP.MODAL[2]}</Typography>
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            :
                null  
        )
    }

    render(){
        const { ln, isCurrentPath } = this.props;
        const { tab, wallets, wallet, virtual, isEmailConfirmed } = this.state;
        const copy = CopyText.cashierFormIndex[ln];

        if(!wallet) { return null };

        return (
            <div>
                <Row styleName={isEmailConfirmed === false ? "blur" : null}>
                    <Col md={12} lg={12} xl={4}>
                        <div>
                            {wallets.map( w => {
                                return (
                                    <PaymentBox 
                                        onClick={() => this.changeWallet(w)}
                                        isPicked={new String(wallet.currency._id).toString() == new String(w.currency._id).toString()}
                                        wallet={w}
                                    />
                                )
                            })}
                        </div>
                    </Col>
                    <Col md={12} lg={12} xl={8}>
                        <div>
                            <Tabs
                                selected={tab}
                                options={[
                                {
                                    value: "deposit",
                                    label: virtual === true ? copy.INDEX.TABS.LABEL[2] : copy.INDEX.TABS.LABEL[0]
                                },
                                {   
                                    value: "withdraw", 
                                    label: copy.INDEX.TABS.LABEL[1],
                                    disabled: virtual  === true
                                }
                                ]}
                                onSelect={this.handleTabChange}
                                style="full-background"
                            />
                        </div>
                        {
                        isEmailConfirmed === true
                        ?
                            tab === "deposit" ? 
                                <div><DepositForm  wallet={wallet} onAddress={this.handleAddress}/> <DepositList isCurrentPath={isCurrentPath} /></div> 
                            : 
                                <div><WithdrawForm wallet={wallet} onAddress={this.handleAddress}/> <WithdrawList isCurrentPath={isCurrentPath} /></div>
                        :
                            null
                        }
                    </Col>
                </Row>
                {this.renderPopSendEmailAlert()}
            </div>
        )
    }
}

function mapStateToProps(state){
    return {
        profile : state.profile,
        ln: state.language
    };
}

export default connect(mapStateToProps)(WalletTab);
