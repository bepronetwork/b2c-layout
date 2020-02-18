import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { Button, SubtleButton, Typography, UserMenu, AnimationNumber, LanguagePicker, TextContainer } from "components";
import UserContext from "containers/App/UserContext";
import { Numbers } from "../../lib/ethereum/lib";
import { connect } from "react-redux";
import _ from 'lodash';
import "./index.css";
import CoinSign from "../Icons/CoinSign";
import  AlertCircleIcon from 'mdi-react/AlertCircleIcon';
import  CheckCircleIcon from 'mdi-react/CheckCircleIcon';
import { Col, Row } from 'reactstrap';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import { etherscanLinkID } from "../../lib/api/apiConfig";
import { getAppCustomization, getApp } from "../../lib/helpers";
import CurrencyDropDown from "../CurrencyDropDown";


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
                let difference = parseFloat(user.getBalance() - this.state.currentBalance);
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
        return(
            <Row>
                <Col>
                    <div styleName='buttons'>
                        <div styleName="login">
                            <SubtleButton onClick={this.handleClick} name="login">
                            Login
                            </SubtleButton>
                        </div>
                        <Button size="x-small" onClick={this.handleClick} name="register">
                            <Typography color="white">Register</Typography>
                        </Button>
                    </div>
                </Col>
            </Row>
        )
    }


    render() {
        let { onLogout, onCashier, onAccount, history } = this.props;
        let { currentBalance, difference, user } = this.state;
        var currencies = getApp().currencies;
        const { logo } = getAppCustomization();
        return (
                <Row styleName="root">
                    <Col xs={3} md={3} lg={2}>
                        <Link className='logo-image' to="/">
                            <img styleName="image" alt="bet protocol logo" src={logo.id} />
                        </Link>
                    </Col>
                    <Col xs={7} md={8} lg={9}>
                        {user ? 
                            <Row>
                                <Col xs={7} md={8} lg={6}>
                                    <Row>
                                        <Col xs={6} md={6} lg={4}>
                                            {(!currencies || _.isEmpty(currencies) || currencies.length < 0) ?
                                                <div styleName="no-coin">
                                                    <Typography variant="x-small-body" color="grey">
                                                        no currencies available
                                                    </Typography>
                                                </div>
                                            :
                                                <div styleName="coin">
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
                                        </Col>
                                        <Col xs={0} md={6} lg={8}>
                                            <div styleName='button-deposit'>
                                                <Button onClick={onCashier} size={'x-small'} theme={'default'}>
                                                    <Typography color={'white'} variant={'small-body'}>Deposit</Typography>
                                                </Button>
                                            </div>
                                        </Col>
                                    </Row>
                                    
                                </Col>
                                <Col xs={5} md={4} lg={6}>
                                    <div styleName="buttons-1">
                                        <div styleName='user-menu'>
                                            <UserMenu
                                                onAccount={() => onAccount({history})}
                                                onLogout={onLogout}
                                                onCashier={onCashier}
                                                username={user.username}
                                            />
                                        </div>
                                    </div>
                                </Col>
                            </Row>
                        :  this.renderLoginOrRegister()
                    }
                    </Col>
                    <Col xs={2} md={1} lg={1}>
                        <div styleName='navbar-language'>
                            <LanguagePicker/>
                        </div>
                    </Col>
                </Row>
        );
    }
}

function mapStateToProps(state){
    return {
        profile: state.profile
    };
}

export default connect(mapStateToProps)(Navbar);