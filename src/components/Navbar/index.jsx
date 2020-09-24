import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Button, SubtleButton, Typography, LanguageSelector, NavigationBar, CurrencySelector, UserIcon} from "components";
import UserContext from "containers/App/UserContext";
import { connect } from "react-redux";
import { getAppCustomization, getApp, getAddOn, getIcon } from "../../lib/helpers";
import { formatCurrency } from "../../utils/numberFormatation";
import { CopyText } from '../../copy';
import Tooltip from '@material-ui/core/Tooltip';
import { withStyles } from "@material-ui/core/styles";
import classNames from "classnames";
import _ from 'lodash';
import "./index.css";

import nineDots from "assets/icons/nine.png";
import nineDotsLight from "assets/icons/nine-light.png";


function AddressConcat(string){
    return  `${string.substring(0, 6)}...${string.substring(string.length - 2)}`;
}

const defaultProps = {
    user: null,
    userAddress : 'N/A',
    currentBalance : 0,
    betIDVerified : '',
    openSettingsMenu : false,
    currentPoints : 0,
    isTransparent: false,
    isDefaultIcon: true
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
            const { topTab } = getAppCustomization();
            var user = !_.isEmpty(props.profile) ? props.profile : null;

            if(user){
                let difference = formatCurrency(user.getBalance() - this.state.currentBalance);
                // To not exist failed animation of difference and number animation
                var opts = {};
                if(difference != 0){
                    opts.difference = difference;
                    opts.currentBalance = user.getBalance();
                }

                const points = await user.getPoints();

                if(points) {
                    let differencePoints = formatCurrency(points - this.state.currentPoints);
                    if(differencePoints != 0){
                        opts.differencePoints = differencePoints;
                        opts.currentPoints = points;
                    }
                }
                
                this.setState({
                    ...opts,
                    user    : user,
                    userFullAddress : user.getAddress(),
                    userAddress : user.getAddress() ? AddressConcat(user.getAddress()) : defaultProps.userAddress,
                    isTransparent: _.isEmpty(topTab) ? false : topTab.isTransparent
                })
            }else{
                this.setState({user : null, isTransparent: _.isEmpty(topTab) ? false : topTab.isTransparent})
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
        let { user } = this.state;
        const {ln} = this.props;
        const copy = CopyText.navbarIndex[ln];
        const skin = getAppCustomization().skin.skin_type;

        return(
            <div styleName="buttons">
                <div styleName="login">
                    <SubtleButton onClick={this.handleClick} name="login" variant="small-body">
                    {copy.INDEX.SUBTLE_BUTTON.TEXT[0]}
                    </SubtleButton>
                </div>
                <Button size="x-small" onClick={this.handleClick} name="register" theme="primary">
                    <Typography color={skin == "digital" ? "secondary" : "fixedwhite"} variant="small-body">{copy.INDEX.TYPOGRAPHY.TEXT[0]}</Typography> 
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
        let { currentBalance, difference, currentPoints, differencePoints } = this.state;
        const { onMenuItem, history, ln } = this.props;
        const copy = CopyText.navbarIndex[ln]; 
        var currencies = getApp().currencies;
        const virtual = getApp().virtual;
        currencies = currencies.filter(c => c.virtual === virtual);

        const { colors } = getAppCustomization();

        const primaryColor = colors.find(c => {
            return c.type == "primaryColor"
        })
        const PrimaryTooltip = withStyles({
            tooltip: {
              color: getAppCustomization().theme === "light" ? "black" : "white",
              backgroundColor: primaryColor.hex
            }
        })(Tooltip);

        const isValidPoints = (getAddOn().pointSystem) ? getAddOn().pointSystem.isValid : false;
        const logoPoints = (getAddOn().pointSystem) ? getAddOn().pointSystem.logo : null;
        const namePoints = (getAddOn().pointSystem) ? getAddOn().pointSystem.name : null; 

        const skin = getAppCustomization().skin.skin_type;

        return(
            <div>
                <div styleName="currency-selector">
                    {(!currencies || _.isEmpty(currencies) || currencies.length < 0) ?
                        <div styleName="no-coin">
                            <Typography variant="x-small-body" color="grey">
                                {copy.INDEX.TYPOGRAPHY.TEXT[1]}
                            </Typography>
                        </div>
                    :
                        <div styleName="currency">
                            <CurrencySelector currentBalance={currentBalance}/>
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
                        <button onClick={() => onMenuItem({history, path : "/settings/wallet"})} type="submit" styleName="button">
                            <Typography variant="small-body" color={skin == "digital" ? "secondary" : "fixedwhite"}>
                                {virtual ? copy.INDEX.TYPOGRAPHY.TEXT[6] : copy.INDEX.TYPOGRAPHY.TEXT[2]}
                            </Typography>
                        </button>
                    </div>
                </div>
                {
                    isValidPoints == true
                    ?
                        <div styleName="points">
                            <PrimaryTooltip title={`${formatCurrency(currentPoints)} ${namePoints}`}>
                                <div styleName="label-points">
                                    {
                                        !_.isEmpty(logoPoints)
                                        ?
                                            <div styleName="currency-icon">
                                                <img src={logoPoints} height={20}/>
                                            </div>
                                        :
                                            null
                                    }
                                    <span>
                                        <Typography color="white" variant={'small-body'}>{formatCurrency(currentPoints)}</Typography>
                                    </span>
                                </div>
                            </PrimaryTooltip>
                            {differencePoints ? (
                                <div
                                key={currentPoints}
                                styleName={"diff-won"}
                                >
                                    <Typography variant="small-body">
                                        {parseFloat(Math.abs(differencePoints))}
                                    </Typography>
                                </div>
                            ) : null}
                        </div>
                    :
                        null
                }
            </div>
        )
    }

    renderProfileMenu = () => {
        const { profile, onAccount, history } = this.props;
        const userIcon = getIcon(0);

        return(
            <button styleName="profile" onClick={() => onAccount({history})} type="button">
                <div styleName="label">
                    <div styleName="user-icon">
                        { userIcon === null ? <UserIcon/> :  <img src={userIcon} /> }
                    </div>
                    <span>
                        <Typography color="white" variant={'small-body'}>{profile.getUsername()}</Typography>
                    </span>
                </div>
            </button>
        )
    }

    renderSettings = () => {
        const { onSettingsMenu } = this.props;
        return(
            <button styleName="settings" onClick={() => onSettingsMenu()} type="button">
                <div styleName="settings-icon">
                    <img src={getAppCustomization().theme === "light" ? nineDotsLight : nineDots} />
                </div>
            </button>
        )
    }

    renderLanguageSelector = () => {
        let { user } = this.state;

        return(
            <div styleName="language-container">
                <LanguageSelector showArrow={true} expand="bottom"/>
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
                {user ?
                    this.renderProfileMenu()
                :
                    this.renderLoginOrRegister()
                }
                {this.renderLanguageSelector()}
                {user ?
                    this.renderSettings()
                :
                    null
                }
            </div>
        )
    }

    render() {
        let { user, isTransparent } = this.state;

        const styles = classNames("top-menu", {
            "top-menu-transparent": isTransparent == true
        });

        return (
            <div  styleName={styles}>
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