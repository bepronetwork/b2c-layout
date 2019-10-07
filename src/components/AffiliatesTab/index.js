import React, { Component } from "react";
import { connect } from "react-redux";
import { DataContainer, AffiliateLinkContainer } from 'components';
import { Row, Col } from 'reactstrap';
import "./index.css";
import wallet from 'assets/wallet.png';
import users from 'assets/users-white.png';

class AffiliatesTab extends Component {

    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount(){
        this.projectData(this.props)
    }

    componentWillReceiveProps(props){
        this.projectData(props);
    }

    projectData = async (props) => {

    }

    render() {
        const { profile, ln } = this.props;
        const { id, wallet : walletBalance, userAmount, percentageOnLevelOne } = profile.getAffiliateInfo();
        const ticker = profile.getAppCurrencyTicker();

        return (
            <div styleName='root'>
                <Row>
                    <Col lg={6}>
                        <DataContainer title={'Wallet'} message={`${walletBalance} ${ticker}`} image={wallet}/>
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
