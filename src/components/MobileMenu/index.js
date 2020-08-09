import React, { Component } from "react";
import { connect } from "react-redux";
import { 
        Typography, WalletIcon,
        SettingsIcon, DepositsIcon, WithdrawIcon, BetsIcon, UserIcon, UsersIcon, ConfirmedIcon
       } from 'components';
import { CopyText } from "../../copy";
import { getApp, getAddOn } from "../../lib/helpers";
import { formatCurrency } from "../../utils/numberFormatation";
import _ from 'lodash';
import "./index.css";


class MobileMenu extends Component {

    constructor(props){
        super(props);
        this.state = {
            points: 0,
            itens : [
                { path: "/settings/account",        copyValue: 6,                                       icon: <UserIcon /> },
                { path: "/settings/security",       copyValue: 7,                                       icon: <ConfirmedIcon /> },
                { path: "/settings/bets",           copyValue: 5,                                       icon: <BetsIcon /> },
                { path: "/settings/wallet",         copyValue: 8,                                       icon: <WalletIcon /> },
                { path: "/settings/deposits",       copyValue: getApp().virtual === true ? 4 : 1,       icon: <DepositsIcon /> },
                { path: "/settings/withdraws",      copyValue: 2,                                       icon: <WithdrawIcon /> },
                { path: "/settings/affiliate",      copyValue: 3,                                       icon: <UsersIcon /> },
                { path: "/settings/preferences",    copyValue: 9,                                       icon: <SettingsIcon /> },
            ]
        }
    }

    componentDidMount(){
        this.projectData(this.props);
    }

    componentWillReceiveProps(props){
        this.projectData(props);
    }

    projectData = async (props) => {

        if(!_.isEmpty(props.profile)) {
            const user = props.profile;

            this.setState({
                points : await user.getPoints()
            });
        }

    }

    renderItens() {
        const { ln, onMenuItem, history } = this.props;
        const { itens } = this.state;
        const copy = CopyText.homepage[ln];

        return(
            <ul>
                {itens.map(item => {
                    return (
                        <li>
                            <a href="#" onClick={() => onMenuItem({history, path : item.path})} >
                                <span styleName="row">
                                    <div styleName="icon">
                                        {item.icon}
                                    </div>
                                    <Typography variant="x-small-body" color="grey">
                                        {copy.CONTAINERS.ACCOUNT.TITLE[item.copyValue]}
                                    </Typography>
                                </span>
                            </a>
                        </li>
                    )
                })}
            </ul>
        )


    }

    render() {
        const { points } = this.state;
        const { ln } = this.props;
        const copy = CopyText.homepage[ln];

        const isValidPoints = (getAddOn().pointSystem) ? getAddOn().pointSystem.isValid : false;
        const logoPoints = (getAddOn().pointSystem) ? getAddOn().pointSystem.logo : null;
        const namePoints = (getAddOn().pointSystem) ? getAddOn().pointSystem.name : null; 

        return (
            <div>
                {
                    isValidPoints == true
                    ?
                        <div styleName="points">
                            <div styleName="label-points">
                                {
                                    !_.isEmpty(logoPoints)
                                    ?
                                        <div styleName="currency-icon">
                                            <img src={logoPoints} width={20}/>
                                        </div>
                                    :
                                        null
                                }
                                <span>
                                    <Typography color="white" variant={'small-body'}>{`${formatCurrency(points)} ${namePoints}`}</Typography>
                                </span>
                            </div>
                        </div>
                    :
                        null
                }
                <div styleName="title">
                    <Typography variant={'body'} color={'white'}>{copy.CONTAINERS.ACCOUNT.TITLE[0]}</Typography>
                </div>
                {this.renderItens()}
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

export default connect(mapStateToProps)(MobileMenu);
