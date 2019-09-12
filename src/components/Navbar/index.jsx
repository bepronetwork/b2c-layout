import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { Button, SubtleButton, Typography, UserMenu, AnimationNumber, LanguagePicker } from "components";
import UserContext from "containers/App/UserContext";
import Bitcoin from "components/Icons/Bitcoin";
import { Numbers } from "../../lib/ethereum/lib";
import logo from "assets/logo.png";
import { connect } from "react-redux";
import { compose } from 'lodash/fp'
import _ from 'lodash';
import "./index.css";
import CoinSign from "../Icons/CoinSign";
import  AlertCircleIcon from 'mdi-react/AlertCircleIcon';
import  CheckCircleIcon from 'mdi-react/CheckCircleIcon';
import { Col, Row } from 'reactstrap';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';


function AddressConcat(string){
    return  `${string.substring(0, 6)}...${string.substring(string.length - 2)}`;
}

const text = {
    false : 'Address not valid',
    true : 'You are running in your address'
}


const defaultProps = {
    user: null,
    userAddress : 'N/A',
    userMetamaskAddress : 'N/A',
    isValid : false,
    currentBalance : 0,
    depositOrWithdrawIDVerified : '',
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
        var user = !_.isEmpty(props.profile) ? props.profile : null ;
        if(user){
            let userMetamaskAddress = await user.getMetamaskAddress();
            let metamaksAddress = userMetamaskAddress ? userMetamaskAddress: defaultProps.userMetamaskAddress;
            this.setState({...this.state, 
                user    : user,
                difference : parseFloat(user.getBalance() - this.state.currentBalance),
                currentBalance : user.getBalance(),
                userAddress : user.getAddress() ? AddressConcat(user.getAddress()) : defaultProps.userAddress,
                userMetamaskAddress : user ? AddressConcat(metamaksAddress) : defaultProps.userMetamaskAddress,
                isValid : user ? new String(user.getAddress()).toLowerCase() == new String(metamaksAddress).toLowerCase() :  defaultProps.isValid     
            })
        }else{
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
                <Col xs={5} md={8}/>
                <Col xs={5} md={4}>
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
                <Col md={1}/>
            </Row>
        )
    }

    render() {
        let { onLogout, onCashier, onAccount } = this.props;
        let { currentBalance, difference, user } = this.state;
        return (
                <Row styleName="root">
                    <Col xs={3} md={2}>
                        <Link className='logo-image' to="/">
                            <img styleName="image" alt="bet protocol logo" src={logo} />
                        </Link>
                    </Col>
                    <Col xs={8} md={8}>
                        {user ? 
                            <Row>
                                <Col xs={2} md={1} lg={2}/>
                                <Col xs={2} md={3} lg={3}>
                                    <div styleName="coin">
                                        <AnimationNumber number={this.state.currentBalance}/>
                                        <div styleName="icon">
                                            <CoinSign />
                                        </div>
                                        {difference ? (
                                            <div
                                            key={currentBalance}
                                            styleName={difference > 0 ? "diff-won" : "diff-lost"}
                                            >
                                                <Typography variant="small-body">
                                                    {Numbers.toFloat(Math.abs(difference))}
                                                </Typography>
                                            </div>
                                        ) : null}
                                    </div>
                                </Col>
                                <Col xs={1} md={6} lg={4}>
                                    <div styleName='address-box'>
                                        <Typography color="white">
                                            <Tooltip title={text[this.state.isValid]}>
                                                <IconButton aria-label={text[this.state.isValid]}>
                                                    {this.state.isValid ? 
                                                        <CheckCircleIcon styleName={'icon-green'} size={20}/>
                                                        :
                                                        <AlertCircleIcon styleName={'icon-red'}  size={20}/>
                                                    }
                                                </IconButton>
                                            </Tooltip>
                                            {this.state.userMetamaskAddress}
                                        </Typography>
                                    </div>
                                </Col>
                                <Col xs={2} md={2} lg={2}>
                                    <div styleName="buttons-1">
                                        <div styleName='user-menu'>
                                            <UserMenu
                                                onAccount={onAccount}
                                                onLogout={onLogout}
                                                onCashier={onCashier}
                                                username={user.username}
                                            />
                                        </div>
                                    </div>
                                </Col>
                                <Col xs={1} md={0} lg={1}/>

                            </Row>
                        :  this.renderLoginOrRegister()
                    }
                    </Col>
                    <Col xs={0} md={2}>
                        <LanguagePicker/>
                    </Col>
                </Row>
        );
    }
}

function mapStateToProps(state){
    return {
        profile: state.profile,
        bet : state.bet,
        depositOrWithdraw : state.depositOrWithdraw
    };
}

export default connect(mapStateToProps)(Navbar);
