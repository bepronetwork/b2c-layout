import React from "react";
import { connect } from "react-redux";
import { AffiliateLinkContainer, DataContainer, WithdrawForm, DepositsIcon, AffiliateIcon } from "components";
import PaymentBox from "../PaymentBox";
import { CopyText } from '../../copy';
import { Col, Row } from 'reactstrap';
import { getApp, getIcon } from "../../lib/helpers";
import './index.css';

const defaultState = {
    percentageOnLevelOne : 0,
    userAmount : 0,
    id : '',
    wallets : [],
    wallet : null
}

class AffiliatesTab extends React.Component{
    constructor(props){
        super(props);
        this.state = defaultState;
    }

    componentDidMount(){
        const { isCurrentPath } = this.props;

        if (isCurrentPath) {
            this.projectData();
        }
    }

    UNSAFE_componentWillReceiveProps(props){
        const { isCurrentPath } = props;
        if(props !== this.props && isCurrentPath) {
            this.projectData();
        }
    }

    projectData = async () => {
        const { profile } = this.props;
        let { wallet } = this.state;
        const getCurrenciesApp = getApp().currencies;

        const resultCompare =  profile.getAffiliateWallets().filter(wallet =>
        getCurrenciesApp.some(
          getCurrenciesApp => wallet.currency._id === getCurrenciesApp._id
        ))

        const wallets = getApp().virtual === true ? profile.getAffiliateWallets().filter(w => w.currency.virtual === true) : resultCompare;
        const { id, userAmount, percentageOnLevelOne } = profile.getAffiliateInfo();

        if(wallets && !wallet) {
            wallet = wallets[0];
        }

        this.setState({
            wallets,
            wallet,
            percentageOnLevelOne,
            userAmount,
            id
        });
    }

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
        const { ln } = this.props;
        const { wallets, wallet, id, percentageOnLevelOne, userAmount } = this.state;
        const copy = CopyText.affiliatesTabIndex[ln];

        if(!wallet) { return null };

        const depositsIcon = getIcon(18);
        const affiliateReferralIcon = getIcon(22);

        return (
            <div>
                <Row>
                    <Col>
                        <AffiliateLinkContainer link={id} percentageOnLevelOne={percentageOnLevelOne}/>
                    </Col>
                </Row>
                <Row>
                    <Col md={12} lg={12} xl={4}>
                        <div>
                            {wallets.map( w => {
                                return (
                                    <PaymentBox 
                                        onClick={() => this.changeWallet(w)}
                                        isPicked={String(wallet.currency._id).toString() === String(w.currency._id).toString()}
                                        wallet={w}
                                    />
                                )
                            })}
                        </div>
                    </Col>
                    <Col md={12} lg={12} xl={8}>
                        <DataContainer title={copy.INDEX.DATA_CONTAINER.TITLE[1]} message={userAmount} image={affiliateReferralIcon === null ? <AffiliateIcon /> : <img src={affiliateReferralIcon} alt="Affiliate Icon" />} />
                        <DataContainer title={copy.INDEX.DATA_CONTAINER.TITLE[0]} message={`${wallet.playBalance} ${wallet.currency.ticker}`} image={depositsIcon === null ? <DepositsIcon /> : <img src={depositsIcon} alt="Deposits Icon" />} />
                        {
                        getApp().virtual !== true 
                        ?
                            <WithdrawForm wallet={wallet} isAffiliate={true} onAddress={this.handleAddress}/>
                        :
                            null
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

export default connect(mapStateToProps)(AffiliatesTab);
