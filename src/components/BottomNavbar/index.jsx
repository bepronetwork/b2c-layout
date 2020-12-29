import React, { Component } from "react";
import { withRouter } from 'react-router-dom';
import { Typography, LanguageSelector, BetsIcon, DepositIcon, ChatIcon, CasinoIcon, UsersIcon, Button } from "components";
import UserContext from "containers/App/UserContext";
import { connect } from "react-redux";
import { CopyText } from '../../copy';
import { getIcon } from "../../lib/helpers";
import _ from 'lodash';
import "./index.css";

const defaultProps = {}

class BottomNavbar extends Component {
    static contextType = UserContext;

    constructor(props) {
        super(props);
        this.state = {  ...defaultProps,
            gameType: "casino"
        };
    }


    componentDidMount(){
        this.projectData(this.props)
    }

    UNSAFE_componentWillReceiveProps(props){
        this.projectData(props);
    }
    
    projectData = async (props) => {
        const curPath = props.location.pathname;

        this.setState({
            gameType: curPath.includes("esports") ? "esports" : "casino"
        })
    }

    openDeposit = () => {
        let { onMenuItem, onLoginRegister, profile, history } = this.props;
        
        !_.isEmpty(profile) ? onMenuItem({history, path : "/settings/wallet"}) : onLoginRegister('login');
    }

    homeClick = (homepage) => {
        this.setState({ gameType: homepage })
        this.props.history.push(`/${homepage}`);
    };


    render() {
        const { gameType } = this.state;
        const {ln, onChat, onBetsList} = this.props;
        const copy = CopyText.navbarIndex[ln]; 
        const chatIcon = getIcon(2);
        const betsIcon = getIcon(16);
        const casinoIcon = getIcon(32);
        const depositIcon = getIcon(18);
        const usersIcon = getIcon(1);

        return (
            <div styleName="bottom-menu">
                <ul styleName="bottom-menu-list">
                    <li>
                        {
                            gameType === "casino"
                            ?
                                <Button theme="link" onClick={() => this.homeClick("esports")}>
                                    <span styleName="item">
                                        <div styleName="icon">
                                            { usersIcon === null ? <UsersIcon /> : <img src={usersIcon} alt="Users" /> }
                                        </div>
                                        <Typography variant="x-small-body" color="grey">
                                            Esports
                                        </Typography>
                                    </span>
                                </Button>  
                            :
                                <Button theme="link" onClick={() => this.homeClick("")}>
                                    <span styleName="item">
                                        <div styleName="icon">
                                            { casinoIcon === null ? <CasinoIcon /> : <img src={casinoIcon} alt="Casino" /> }
                                        </div>
                                        <Typography variant="x-small-body" color="grey">
                                            {copy.INDEX.TYPOGRAPHY.TEXT[3]}
                                        </Typography>
                                    </span>
                                </Button>
                        }
                    </li>
                    <li>
                        <Button theme="link" onClick={this.openDeposit}>
                            <span styleName="item">
                                <div styleName="icon">
                                    { depositIcon === null ? <DepositIcon /> : <img src={depositIcon} alt="Deposit" /> }
                                </div>
                                <Typography variant="x-small-body" color="grey">
                                    {copy.INDEX.TYPOGRAPHY.TEXT[2]}
                                </Typography>
                            </span>
                        </Button>
                    </li>
                    <li>
                        <Button theme="link" onClick={() => onBetsList()}>
                            <span styleName="item">
                                <div styleName="icon">
                                    { betsIcon === null ? <BetsIcon /> : <img src={betsIcon} alt="Bets" /> }
                                </div>
                                <Typography variant="x-small-body" color="grey">
                                    {copy.INDEX.TYPOGRAPHY.TEXT[5]}
                                </Typography>
                            </span>
                        </Button>
                    </li>
                    <li>
                        <Button theme="link" onClick={() => onChat()}>
                            <span styleName="item">
                                <div styleName="icon">
                                    { chatIcon === null ? <ChatIcon /> : <img src={chatIcon} alt="Chat" /> }
                                </div>
                                <Typography variant="x-small-body" color="grey">
                                    {copy.INDEX.TYPOGRAPHY.TEXT[4]}
                                </Typography>
                            </span>
                        </Button>
                    </li>
                    <li>
                        <LanguageSelector expand="top" />
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

export default connect(mapStateToProps)(withRouter(BottomNavbar));