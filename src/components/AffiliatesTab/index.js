import React, { Component } from "react";
import { connect } from "react-redux";
import { DataContainer, AffiliateLinkContainer, Button, Typography } from 'components';
import { Row, Col } from 'reactstrap';
import "./index.css";
import wallet from 'assets/wallet.png';
import users from 'assets/users-white.png';
import store from "../../containers/App/store";
import { setModal } from "../../redux/actions/modal";
import { CopyText } from '../../copy';

const defaultState = {
    isWithdrawing : false,
    ticker : 'N/A',
    percentageOnLevelOne : 0,
    userAmount : 0,
    affiliateBalance : 0,
    id : ''
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
        const { profile, currency } = props;
        const { id, wallet, userAmount, percentageOnLevelOne } = profile.getAffiliateInfo(currency);
        if(!wallet){return}
        this.setState({
            ticker : currency.ticker,
            percentageOnLevelOne,
            userAmount,
            affiliateBalance : wallet.playBalance,
            id
        })
    }

    withdrawAffiliate = async () => {
        await store.dispatch(setModal({key : 'AffiliateWithdrawForm', value : true}))
    }

    render() {
        const { profile, ln } = this.props;
        const { isWithdrawing, affiliateBalance, id, percentageOnLevelOne, userAmount, ticker } = this.state;
        // const { ln } = this.props;
        const copy = CopyText.affiliatesTabIndex[ln];

        return (
            <div styleName='root'>
                <Row>
                    <Col lg={6}>
                        <DataContainer title={copy.INDEX.DATA_CONTAINER.TITLE[0]} message={`${parseFloat(affiliateBalance)} ${ticker}`} image={wallet} button={
                             <Button
                                theme="default"
                                size={'x-small'}
                                disabled={ (affiliateBalance < 0) || isWithdrawing}
                                onClick={this.withdrawAffiliate}
                            >
                                <Typography color={'white'} variant={'small-body'}> {copy.INDEX.TYPOGRAPHY.TEXT[0]} </Typography>
                            </Button>
                        }/>
                    </Col>
                    <Col lg={6}>
                        <DataContainer title={copy.INDEX.DATA_CONTAINER.TITLE[1]} message={userAmount} image={users} />
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
        ln : state.language,
        currency : state.currency
    };
}

export default connect(mapStateToProps)(AffiliatesTab);
