import React, { Component } from "react";
import "./index.css";
import { 
        TabedContainer, DepositTab, WithdrawTab, BetsTab, SecurityTab, SettingsTab, AffiliatesTab, AccountTab, WalletTab, WalletIcon,
        SettingsIcon, DepositsIcon, WithdrawIcon, BetsIcon, UserIcon, UsersIcon, ConfirmedIcon
       } from 'components';
import { connect } from "react-redux";
import { getApp, getIcon } from "../../lib/helpers";
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

    isCurrentPath(path) {
        const pathName = this.props.location.pathname.toLowerCase();
        const pathArr = pathName.split('/');

        return pathArr.some(function(elem) {
            if (elem.toLowerCase() === path.toLowerCase()) {
                return true;
            }
            return false;
        });
    }

    render() {
        const {ln, profile, onLogout, onTableDetails} = this.props;
        const copy = CopyText.homepage[ln];
        if (!profile || _.isEmpty(profile)) return null;

        const virtual = getApp().virtual;
        const userIcon = getIcon(0);
        const securityIcon = getIcon(15);
        const betsIcon = getIcon(16);
        const walletIcon = getIcon(17);
        const depositsIcon = getIcon(18);
        const withdrawIcon = getIcon(19);
        const affiliatesIcon = getIcon(20);
        const preferencesIcon = getIcon(21);

        return (
            <div styleName='main-container'>
                <div styleName="root">
                    <hr></hr>
                    <TabedContainer 
                        items={
                            [
                                {
                                    path: "account",
                                    title : copy.CONTAINERS.ACCOUNT.TITLE[6],
                                    container : <AccountTab onLogout={onLogout} />,
                                    icon : userIcon === null ? <UserIcon/> : <img src={userIcon} />
                                },
                                {
                                    path: "security",
                                    title : copy.CONTAINERS.ACCOUNT.TITLE[7],
                                    container : <SecurityTab/>,
                                    icon : securityIcon === null ? <ConfirmedIcon /> : <img src={securityIcon} />
                                },
                                {
                                    path: "bets",
                                    title : copy.CONTAINERS.ACCOUNT.TITLE[5],
                                    container : <BetsTab onTableDetails={onTableDetails} isCurrentPath={this.isCurrentPath("bets")} />,
                                    icon : betsIcon === null ? <BetsIcon /> : <img src={betsIcon} />
                                },
                                {
                                    path: "wallet",
                                    title : copy.CONTAINERS.ACCOUNT.TITLE[8],
                                    container : <WalletTab isCurrentPath={this.isCurrentPath("wallet")} />,
                                    icon : walletIcon === null ? <WalletIcon /> : <img src={walletIcon} />
                                },
                                {
                                    path: "deposits",
                                    title : virtual ? copy.CONTAINERS.ACCOUNT.TITLE[4] : copy.CONTAINERS.ACCOUNT.TITLE[1],
                                    container : <DepositTab isCurrentPath={this.isCurrentPath("deposits")} />,
                                    icon : depositsIcon === null ? <DepositsIcon /> : <img src={depositsIcon} />
                                },
                                {
                                    path: "withdraws",
                                    title : copy.CONTAINERS.ACCOUNT.TITLE[2],
                                    container : <WithdrawTab  isCurrentPath={this.isCurrentPath("withdraws")} />,
                                    icon : withdrawIcon === null ? <WithdrawIcon /> : <img src={withdrawIcon} /> ,
                                    disabled: virtual
                                },
                                {
                                    path: "affiliate",
                                    title : copy.CONTAINERS.ACCOUNT.TITLE[3],
                                    container : <AffiliatesTab isCurrentPath={this.isCurrentPath("affiliate")} />,
                                    icon : affiliatesIcon === null ? <UsersIcon /> : <img src={affiliatesIcon} />
                                },
                                {
                                    path: "preferences",
                                    title : copy.CONTAINERS.ACCOUNT.TITLE[9],
                                    container : <SettingsTab/>,
                                    icon : preferencesIcon === null ? <SettingsIcon /> : <img src={preferencesIcon} />
                                }
                            ]
                        }
                        {...this.props}
                    />
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
