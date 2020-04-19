import React, { Component } from "react";
import "./index.css";
import { 
        TabedContainer, DepositTab, WithdrawTab, BetsTab, AccountInfoForm, SettingsTab, AffiliatesTab,
        SettingsIcon, DepositsIcon, WithdrawIcon, RefferalIcon, BetsIcon
       } from 'components';
import { connect } from "react-redux";
import { getApp } from "../../lib/helpers";
import { CopyText } from '../../copy';
import _ from "lodash";

class AccountPage extends Component {

    constructor(props){
        super(props);
        this.state = {}
    }

    componentDidMount(){
        const {profile, onHandleLoginOrRegister} = this.props;

        if (!profile || _.isEmpty(profile)) {
            this.props.history.push('/');
            return onHandleLoginOrRegister("login");
        }
    }

    render() {
        const {ln, profile} = this.props;
        const copy = CopyText.homepage[ln];
        if (!profile || _.isEmpty(profile)) return null;

        const virtual = getApp().virtual;

        return (
            <div styleName='main-container'>
                <div styleName="root">
                    <hr></hr>
                    <TabedContainer 
                        tabTopContent={<AccountInfoForm/>}
                        items={
                            [
                                {
                                    path: "settings",
                                    title : copy.CONTAINERS.ACCOUNT.TITLE[0],
                                    container : <SettingsTab/>,
                                    icon : <SettingsIcon />
                                },
                                {
                                    path: "deposits",
                                    title : virtual ? copy.CONTAINERS.ACCOUNT.TITLE[4] : copy.CONTAINERS.ACCOUNT.TITLE[1],
                                    container : <DepositTab/>,
                                    icon : <DepositsIcon />
                                },
                                {
                                    path: "withdraws",
                                    title : copy.CONTAINERS.ACCOUNT.TITLE[2],
                                    container : <WithdrawTab/>,
                                    icon : <WithdrawIcon />,
                                    disabled: virtual
                                },
                                {
                                    path: "bets",
                                    title : copy.CONTAINERS.ACCOUNT.TITLE[5],
                                    container : <BetsTab/>,
                                    icon : <BetsIcon />
                                },
                                {
                                    path: "affiliate",
                                    title : copy.CONTAINERS.ACCOUNT.TITLE[3],
                                    container : <AffiliatesTab/>,
                                    icon : <RefferalIcon />
                                },
                            ]
                        }
                        {...this.props}
                    />
                    {/* <div styleName='mati-kyc-setup'>
                        <ReactMati clientId={'5d3ebd1ec2ca36001b912f42'} metadata={{ userId: id }} />}
                    </div> */
                    }
                </div>
            </div>
        );
    }
}


function mapStateToProps(state) {
    return {
        profile: state.profile,
        ln: state.language
    };
}

export default connect(mapStateToProps)(AccountPage);
