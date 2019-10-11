import React, { Component } from "react";
import { connect } from "react-redux";
import { DataContainer, AffiliateLinkContainer, Button, Typography } from 'components';
import { Row, Col } from 'reactstrap';
import "./index.css";
import wallet from 'assets/wallet.png';
import users from 'assets/users-white.png';
import store from "../../containers/App/store";
import { setModal } from "../../redux/actions/modal";
import { Numbers } from "../../lib/ethereum/lib";


const defaultState = {
    isWithdrawing : false
}

class AffiliatesTab extends Component {

    constructor(props) {
        super(props);
        this.state = defaultState;
    }

    componentDidMount(){
        this.projectData(this.props)
    }

    componentWillReceiveProps(props){
        this.projectData(props);
    }

    projectData = async (props) => {

    }

    withdrawAffiliate = async () => {
        await store.dispatch(setModal({key : 'AffiliateWithdrawForm', value : true}))
    }

    render() {
        const { profile, ln } = this.props;
        const { isWithdrawing } = this.state;
        const { id, wallet : walletBalance, userAmount, percentageOnLevelOne } = profile.getAffiliateInfo();
        const ticker = profile.getAppCurrencyTicker();

        return (
            <div styleName='root'>
                <Row>
                    <Col lg={6}>
                        <DataContainer title={'Wallet'} message={`${Numbers.toFloat(walletBalance)} ${ticker}`} image={wallet} button={
                             <Button
                                theme="default"
                                size={'x-small'}
                                disabled={ (walletBalance < 0) || isWithdrawing}
                                onClick={this.withdrawAffiliate}
                            >
                                <Typography color={'white'} variant={'small-body'}> Withdraw </Typography>
                            </Button>
                        }/>
                    </Col>
                    <Col lg={6}>
                        <DataContainer title={'Affiliates'} message={userAmount} image={users} />
                    </Col>
                </Row>
                <Row>
                    <Col lg={12}>
                        <AffiliateLinkContainer link={id} percentageOnLevelOne={percentageOnLevelOne}/>
                    </Col>
                </Row>
            </div>
        );
    }
}

function mapStateToProps(state){
    return {
        profile: state.profile,
        ln : state.language
    };
}

export default connect(mapStateToProps)(AffiliatesTab);
