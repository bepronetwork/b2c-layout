import React, { Component } from "react";
import { Typography, TabedContainer, DepositTab, WithdrawTab } from 'components';
import { connect } from "react-redux";
import MoneyIcon from 'mdi-react/MoneyIcon';
import ExitToAppIcon from 'mdi-react/ExitToAppIcon';

import "./index.css";
import ReactMati from 'react-mati';

class AccountInfoModal extends Component {

    constructor(props) {
        super(props);
        this.state = {};
    }


    render() {
        const { profile } = this.props;
        const id = profile.getID();

        return (
            <div styleName="root" style={{ overflowY: 'auto', overflowX : 'hidden'}}>
                <Typography variant={'h4'} color={'white'}>
                    My Zone
                </Typography>
                <hr></hr>
                <TabedContainer 
                    items={
                        [
                            {
                                title : 'Deposits',
                                container : <DepositTab/>,
                                icon : <MoneyIcon size={20}/>
                            },
                            {
                                title : 'Withdraws',
                                container : <WithdrawTab/>,
                                icon : <ExitToAppIcon size={20}/>

                            }
                        ]
                    }
                />
                {/* <div styleName='mati-kyc-setup'>
                    <ReactMati clientId={'5d3ebd1ec2ca36001b912f42'} metadata={{ userId: id }} />}
                </div> */
                }

            </div>
        );
    }
}

function mapStateToProps(state){
    return {
        profile: state.profile
    };
}

export default connect(mapStateToProps)(AccountInfoModal);
