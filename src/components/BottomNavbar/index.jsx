import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Typography, LanguageSelector } from "components";
import UserContext from "containers/App/UserContext";
import { connect } from "react-redux";
import { CopyText } from '../../copy';
import _ from 'lodash';
import "./index.css";

import casinoIcon from 'assets/icons/casino.svg';
import walletIcon from 'assets/icons/wallet.svg';
import chatIcon from 'assets/icons/chat.svg';
import betsIcon from 'assets/icons/table.svg';

const defaultProps = {
    openChat : false,
    openBetsList : false
}

class BottomNavbar extends Component {
    static contextType = UserContext;

    constructor(props) {
        super(props);
        this.state = {  ...defaultProps };
    }

    openChatClick = () => {
        const { onChat } = this.props;
        const { openChat } = this.state;

        this.setState({ openChat : !openChat });
        onChat(!openChat);
    };

    openBetsListClick = () => {
        const { onBetsList } = this.props;
        const { openBetsList } = this.state;

        this.setState({ openBetsList : !openBetsList });
        onBetsList(!openBetsList);
    };


    homeClick = () => {
        const { onHome, history } = this.props;
        onHome({ history });
    };


    render() {
        let { onCashier } = this.props;
        const {ln} = this.props;
        const copy = CopyText.navbarIndex[ln]; 

        return (
            <div styleName="bottom-menu">
                <ul styleName="bottom-menu-list">
                    <li>
                        <a href="#" onClick={this.homeClick}>
                            <span styleName="item">
                                <img src={casinoIcon} style={{width : 24}}/>
                                <Typography variant="x-small-body" color="grey">
                                    {copy.INDEX.TYPOGRAPHY.TEXT[3]}
                                </Typography>
                            </span>
                        </a>
                    </li>
                    <li>
                        <a href="#" onClick={onCashier}>
                            <span styleName="item">
                                <img src={walletIcon} style={{width : 24}}/>
                                <Typography variant="x-small-body" color="grey">
                                    {copy.INDEX.TYPOGRAPHY.TEXT[2]}
                                </Typography>
                            </span>
                        </a>
                    </li>
                    <li>
                        <a href="#" onClick={this.openBetsListClick}>
                            <span styleName="item">
                                <img src={betsIcon} style={{width : 24}}/>
                                <Typography variant="x-small-body" color="grey">
                                    {copy.INDEX.TYPOGRAPHY.TEXT[5]}
                                </Typography>
                            </span>
                        </a>
                    </li>
                    <li>
                        <a href="#" onClick={this.openChatClick}>
                            <span styleName="item">
                                <img src={chatIcon} style={{width : 24}}/>
                                <Typography variant="x-small-body" color="grey">
                                    {copy.INDEX.TYPOGRAPHY.TEXT[4]}
                                </Typography>
                            </span>
                        </a>
                    </li>
                    <li>
                        <LanguageSelector showLabel={true} expand="top" />
                    </li>
                </ul>
            </div>
        );
    }
}

function mapStateToProps(state){
    return {
        profile: state.profile,
        ln: state.language
    };
}

export default connect(mapStateToProps)(BottomNavbar);