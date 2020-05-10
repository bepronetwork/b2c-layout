import React from "react";
import { connect } from "react-redux";
import { Tabs, DepositForm, WithdrawForm, WithdrawIcon, DepositIcon } from "components";
import PaymentBox from "../PaymentBox";
import DepositList from "./DepositList";
import WithdrawList from "./WithdrawList";
import { CopyText } from '../../copy';
import { getApp } from "../../lib/helpers";
import { Col, Row } from 'reactstrap';
import _ from 'lodash';
import './index.css';

const defaultState = {
    tab: "deposit",
    wallets : [],
    wallet: null
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
        this.projectData(props);
    }

    projectData = async (props) => {
        const { profile } = this.props;
        let { wallet } = this.state;
        const virtual = getApp().virtual;
        const wallets = virtual === true ? profile.getWallets().filter(w => new String(w.currency.ticker).toString().toLowerCase() !== 'eth') : profile.getWallets();

        if(wallets && !wallet) {
            wallet = wallets.find(w => w.currency.virtual === false);
        }

        this.setState({...this.state,
            wallets,
            wallet,
            virtual : getApp().virtual
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

    render(){
        const { ln, isCurrentPath } = this.props;
        const { tab, wallets, wallet, virtual } = this.state;
        const copy = CopyText.cashierFormIndex[ln];

        if(!wallet) { return null };

        return (
            <div>
                <Row>
                    <Col lg={4}>
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
                    <Col lg={8}>
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
                        {tab === "deposit" ? 
                            <div><DepositForm  wallet={wallet} onAddress={this.handleAddress}/> <DepositList isCurrentPath={isCurrentPath} /></div> 
                        : 
                            <div><WithdrawForm wallet={wallet} onAddress={this.handleAddress}/> <WithdrawList isCurrentPath={isCurrentPath} /></div>
                        }
                    </Col>
                </Row>
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
