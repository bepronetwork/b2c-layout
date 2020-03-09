import React, { Component } from "react";
import { Row, Col} from 'reactstrap';
import "./index.css";
import { Typography, TabedContainer, DepositTab, WithdrawTab, AccountInfoForm, SettingsTab, AffiliatesTab} from 'components';
import { connect } from "react-redux";
import MoneyIcon from 'mdi-react/MoneyIcon';
import ExitToAppIcon from 'mdi-react/ExitToAppIcon';
import SettingsIcon from 'mdi-react/SettingsIcon';
import GiftIcon from 'mdi-react/GiftIcon';
import { CopyText } from '../../copy';

class AccountPage extends Component {

    constructor(props){
        super(props);
        this.state = {}
    }

    render() {
        const {ln} = this.props;
        const copy = CopyText.homepage[ln];

        return (
            <div styleName='main-container'>
                <div styleName="root">
                    <hr></hr>
                    <TabedContainer 
                        tabTopContent={<AccountInfoForm/>}
                        items={
                            [
                                {
                                    title : copy.CONTAINERS.ACCOUNT.TITLE[0],
                                    container : <SettingsTab/>,
                                    icon : <SettingsIcon size={20}/>
                                },
                                {
                                    title : copy.CONTAINERS.ACCOUNT.TITLE[1],
                                    container : <DepositTab/>,
                                    icon : <MoneyIcon size={20}/>
                                },
                                {
                                    title : copy.CONTAINERS.ACCOUNT.TITLE[2],
                                    container : <WithdrawTab/>,
                                    icon : <ExitToAppIcon size={20}/>
                                },
                                {
                                    title : copy.CONTAINERS.ACCOUNT.TITLE[3],
                                    container : <AffiliatesTab/>,
                                    icon : <GiftIcon size={20}/>
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
