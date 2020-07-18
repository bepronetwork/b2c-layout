import React, { Component } from "react";
import { withRouter } from 'react-router-dom';
import { Typography, LanguageSelector, BetsIcon, DepositIcon, ChatIcon, CasinoIcon, UsersIcon } from "components";
import UserContext from "containers/App/UserContext";
import { connect } from "react-redux";
import { CopyText } from '../../copy';
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

    componentWillReceiveProps(props){
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

        return (
            <div styleName="bottom-menu">
                <ul styleName="bottom-menu-list">
                    <li>
                        {
                            gameType == "casino"
                            ?
                                <a href="#" onClick={() => this.homeClick("esports")}>
                                    <span styleName="item">
                                        <div styleName="icon">
                                            <UsersIcon/>
                                        </div>
                                        <Typography variant="x-small-body" color="grey">
                                            eSports
                                        </Typography>
                                    </span>
                                </a>  
                            :
                                <a href="#" onClick={() => this.homeClick("casino")}>
                                    <span styleName="item">
                                        <div styleName="icon">
                                            <CasinoIcon />
                                        </div>
                                        <Typography variant="x-small-body" color="grey">
                                            {copy.INDEX.TYPOGRAPHY.TEXT[3]}
                                        </Typography>
                                    </span>
                                </a>
                        }
                    </li>
                    <li>
                        <a href="#" onClick={this.openDeposit}>
                            <span styleName="item">
                                <div styleName="icon">
                                    <DepositIcon />
                                </div>
                                <Typography variant="x-small-body" color="grey">
                                    {copy.INDEX.TYPOGRAPHY.TEXT[2]}
                                </Typography>
                            </span>
                        </a>
                    </li>
                    <li>
                        <a href="#" onClick={() => onBetsList()}>
                            <span styleName="item">
                                <div styleName="icon">
                                    <BetsIcon/>
                                </div>
                                <Typography variant="x-small-body" color="grey">
                                    {copy.INDEX.TYPOGRAPHY.TEXT[5]}
                                </Typography>
                            </span>
                        </a>
                    </li>
                    <li>
                        <a href="#" onClick={() => onChat()}>
                            <span styleName="item">
                                <div styleName="icon">
                                    <ChatIcon />
                                </div>
                                <Typography variant="x-small-body" color="grey">
                                    {copy.INDEX.TYPOGRAPHY.TEXT[4]}
                                </Typography>
                            </span>
                        </a>
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