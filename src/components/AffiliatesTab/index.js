import React from "react";
import { connect } from "react-redux";
import { AffiliateLinkContainer, DataContainer, WithdrawForm, DepositsIcon, AffiliateIcon } from "components";
import PaymentBox from "../PaymentBox";
import { CopyText } from '../../copy';
import { Col, Row } from 'reactstrap';
import _ from 'lodash';
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
            this.projectData(this.props);
        }
    }

    componentWillReceiveProps(props){
        this.projectData(props);
    }

    projectData = async (props) => {
        const { profile } = this.props;
        let { wallet } = this.state;
        const wallets = profile.getAffiliateWallets();
        const { id, userAmount, percentageOnLevelOne } = profile.getAffiliateInfo();

        if(wallets && !wallet) {
            wallet = wallets[0];
        }

        this.setState({...this.state,
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

    render(){
        const { ln } = this.props;
        const { wallets, wallet, id, percentageOnLevelOne, userAmount } = this.state;
        const copy = CopyText.affiliatesTabIndex[ln];

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
                        <DataContainer title={copy.INDEX.DATA_CONTAINER.TITLE[1]} message={userAmount} image={<AffiliateIcon/>} />
                        <DataContainer title={copy.INDEX.DATA_CONTAINER.TITLE[0]} message={`${wallet.playBalance} ${wallet.currency.ticker}`} image={<DepositsIcon/>} />
                        <WithdrawForm wallet={wallet} isAffiliate={true} />
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <AffiliateLinkContainer link={id} percentageOnLevelOne={percentageOnLevelOne}/>
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
