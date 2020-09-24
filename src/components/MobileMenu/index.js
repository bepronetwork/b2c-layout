import React, { Component } from "react";
import { connect } from "react-redux";
import { 
        Typography, WalletIcon,
        SettingsIcon, DepositsIcon, WithdrawIcon, BetsIcon, UserIcon, UsersIcon, ConfirmedIcon
       } from 'components';
import { CopyText } from "../../copy";
import { getApp, getAddOn, getIcon } from "../../lib/helpers";
import { formatCurrency } from "../../utils/numberFormatation";
import _ from 'lodash';
import "./index.css";


class MobileMenu extends Component {

    constructor(props){
        super(props);
        const userIcon = getIcon(0);
        const securityIcon = getIcon(15);
        const betsIcon = getIcon(16);
        const walletIcon = getIcon(17);
        const depositsIcon = getIcon(18);
        const withdrawIcon = getIcon(19);
        const affiliatesIcon = getIcon(20);
        const preferencesIcon = getIcon(21);

        this.state = {
            points: 0,
            itens : [
                { path: "/settings/account",        copyValue: 6,                                       icon: userIcon === null ? <UserIcon /> : <img src={userIcon} /> },
                { path: "/settings/security",       copyValue: 7,                                       icon: securityIcon === null ? <ConfirmedIcon /> : <img src={securityIcon} /> },
                { path: "/settings/bets",           copyValue: 5,                                       icon: betsIcon === null ? <BetsIcon /> : <img src={betsIcon} /> },
                { path: "/settings/wallet",         copyValue: 8,                                       icon: walletIcon === null ? <WalletIcon /> : <img src={walletIcon} /> },
                { path: "/settings/deposits",       copyValue: getApp().virtual === true ? 4 : 1,       icon: depositsIcon === null ? <DepositsIcon /> : <img src={depositsIcon} /> },
                { path: "/settings/withdraws",      copyValue: 2,                                       icon: withdrawIcon === null ? <WithdrawIcon /> : <img src={withdrawIcon} /> },
                { path: "/settings/affiliate",      copyValue: 3,                                       icon: affiliatesIcon === null ? <UsersIcon /> : <img src={affiliatesIcon} /> },
                { path: "/settings/preferences",    copyValue: 9,                                       icon: preferencesIcon === null ? <SettingsIcon /> : <img src={preferencesIcon} /> },
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

    homeClick = (homepage) => {
        this.setState({ gameType: homepage })
        this.props.history.push(`/${homepage}`);
    };

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
                <div styleName="title" onClick={() => this.homeClick("casino")}>
                    <Typography variant={'body'} color={'white'}>Casino</Typography>
                </div>
                <div styleName="title" onClick={() => this.homeClick("esports")}>
                    <Typography variant={'body'} color={'white'}>Esports</Typography>
                </div>
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
