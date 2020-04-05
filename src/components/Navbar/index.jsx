import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Button, SubtleButton, Typography, ProfileMenu, LanguageSelector, NavigationBar } from "components";
import UserContext from "containers/App/UserContext";
import { connect } from "react-redux";
import { getAppCustomization, getApp } from "../../lib/helpers";
import CurrencyDropDown from "../CurrencyDropDown";
import { formatCurrency } from "../../utils/numberFormatation";
import { CopyText } from '../../copy';
import _ from 'lodash';
import "./index.css";


function AddressConcat(string){
    return  `${string.substring(0, 6)}...${string.substring(string.length - 2)}`;
}

const defaultProps = {
    user: null,
    userAddress : 'N/A',
    currentBalance : 0,
    betIDVerified : '',
};

class Navbar extends Component {
    static contextType = UserContext;

    constructor(props) {
        super(props);
        this.state = {
            ...defaultProps
        };
    }

    componentDidMount(){
        this.projectData(this.props)
    }

    componentWillReceiveProps(props){
        this.projectData(props);
    }
    
    projectData = async (props) => {
        try{
            var user = !_.isEmpty(props.profile) ? props.profile : null;

            if(user){
                let difference = formatCurrency(user.getBalance() - this.state.currentBalance);
                // To not exist failed animation of difference and number animation
                var opts = {};
                if(difference != 0){
                    opts.difference = difference;
                    opts.currentBalance = user.getBalance();
                }
                
                this.setState({
                    ...opts,
                    user    : user,
                    userFullAddress : user.getAddress(),
                    userAddress : user.getAddress() ? AddressConcat(user.getAddress()) : defaultProps.userAddress  
                })
            }else{
                this.setState({user : null})
            }
        }catch(err){
            console.log(err)
            this.setState({user : null})
        }
        
    }

    handleClick = event => {
        const { onLoginRegister } = this.props;
        if (onLoginRegister) onLoginRegister(event.currentTarget.name);
    };


    renderLoginOrRegister = () => {
        const {ln} = this.props;
        const copy = CopyText.navbarIndex[ln];

        return(
            <div styleName='buttons'>
                <div styleName="login">
                    <SubtleButton onClick={this.handleClick} name="login" variant="x-small-body">
                    {copy.INDEX.SUBTLE_BUTTON.TEXT[0]}
                    </SubtleButton>
                </div>
                <Button size="x-small" onClick={this.handleClick} name="register">
                    <Typography color="white" variant="x-small-body">{copy.INDEX.TYPOGRAPHY.TEXT[0]}</Typography>
                </Button>
            </div>
        )
    }

    renderLogo = () => {
        const { logo } = getAppCustomization();
        
        return(
            <div styleName="logo">
                <Link styleName='logo-image' to="/">
                    <img styleName="image" alt="bet protocol logo" src={logo.id} />
                </Link>
                {this.renderCasinoSportsSelector()}
            </div>
        )
    }

    renderCurrencySelector = () => {
        let {onCashier } = this.props;
        let { currentBalance, difference } = this.state;
        const {ln} = this.props;
        const copy = CopyText.navbarIndex[ln]; 
        var currencies = getApp().currencies;

        return(
            <div>
                 {(!currencies || _.isEmpty(currencies) || currencies.length < 0) ?
                    <div styleName="no-coin">
                        <Typography variant="x-small-body" color="grey">
                            {copy.INDEX.TYPOGRAPHY.TEXT[1]}
                        </Typography>
                    </div>
                :
                    <div styleName="currency">
                        <CurrencyDropDown currentBalance={currentBalance}/>
                        {difference ? (
                            <div
                            key={currentBalance}
                            styleName={difference > 0 ? "diff-won" : "diff-lost"}
                            >
                                <Typography variant="small-body">
                                    {parseFloat(Math.abs(difference))}
                                </Typography>
                            </div>
                        ) : null}
                    </div>
                 }
                <div styleName='button-deposit'>
                    <Button onClick={onCashier} size={'x-small'} theme={'default'}>
                        <Typography color={'white'} variant={'x-small-body'}>{copy.INDEX.TYPOGRAPHY.TEXT[2]}</Typography>
                    </Button>
                </div>
            </div>
        )
    }

    renderProfileMenu = () => {
        let { onLogout, onCashier, onAccount, history } = this.props;
        let { user } = this.state;

        return(
            <ProfileMenu
                onAccount={() => onAccount({history})}
                onLogout={onLogout}
                onCashier={onCashier}
                username={user.username}
            />
        )
    }

    renderLanguageSelector = () => {
        return(
            <div styleName="language-container">
                <LanguageSelector showLabel={false} expand="bottom"/>
            </div>
        )
    }

    renderCasinoSportsSelector = () => {
        let { history } = this.props;

        return(
            <div styleName="casino-sports">
                <div styleName="casino-sports-container">
                    <NavigationBar history={history}/>
                </div>
            </div>
        )
    }

    renderLanguageProfile = () => {
            let { user } = this.state;

        return(
            <div styleName="language-profile">
                {this.renderLanguageSelector()}
                {user ?
                    this.renderProfileMenu()
                :
                    this.renderLoginOrRegister()
                }
            </div>
        )
    }

    render() {
        let { user } = this.state;

        return (
                <div  styleName="top-menu">
                    {this.renderLogo()}
                    {user ?
                        [ this.renderCurrencySelector(), this.renderLanguageProfile() ]
                    :
                        [ <div/>, this.renderLanguageProfile() ]
                    }
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

export default connect(mapStateToProps)(Navbar);