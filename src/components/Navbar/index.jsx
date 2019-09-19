import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { Button, SubtleButton, Typography, UserMenu, AnimationNumber, LanguagePicker } from "components";
import UserContext from "containers/App/UserContext";
import Bitcoin from "components/Icons/Bitcoin";
import { Numbers } from "../../lib/ethereum/lib";
import { getMetamaskAccount } from 'lib/metamask';
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
    false : 'Address not valid!',
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
        try{
            var user = !_.isEmpty(props.profile) ? props.profile : null;

            if(user){
                let userMetamaskAddress = await getMetamaskAccount();
                let metamaksAddress = userMetamaskAddress ? userMetamaskAddress : defaultProps.userMetamaskAddress;
                let difference = parseFloat(user.getBalance() - this.state.currentBalance);
                this.setState({...this.state, 
                    user    : user,
                    difference : (difference != 0) ? difference : this.state.difference,
                    currentBalance : user.getBalance(),
                    userFullAddress : user.getAddress(),
                    userAddress : user.getAddress() ? AddressConcat(user.getAddress()) : defaultProps.userAddress,
                    userMetamaskAddress : user ? AddressConcat(metamaksAddress) : defaultProps.userMetamaskAddress,
                    isValid : user ? new String(user.getAddress()).toLowerCase() == new String(metamaksAddress).toLowerCase() :  defaultProps.isValid     
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
        let { currentBalance, difference, user, userAddress, userMetamaskAddress, isValid, userFullAddress } = this.state;
        let infoText = !isValid ? (text[isValid] + ` Your User Address is : ${userFullAddress}`) : text[isValid] ;
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
                                <Col xs={2} md={1} lg={1}/>
                                <Col xs={2} md={4} lg={4}>
                                    <Row>
                                        <Col xs={6} md={6} lg={6}>
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
                                        <Col xs={6} md={6} lg={6}>
                                            <div styleName='button-deposit'>
                                                <Button onClick={onCashier} size={'x-small'} theme={'default'}>
                                                    <Typography color={'white'} variant={'small-body'}>Deposit</Typography>
                                                </Button>
                                            </div>
                                        </Col>
                                    </Row>
                                    
                                </Col>
                                <Col xs={1} md={6} lg={4}>
                                    <div styleName='address-box'>
                                        <Typography color="white">
                                            <Tooltip title={infoText}>
                                                <IconButton aria-label={infoText}>
                                                    {isValid ? 
                                                        <CheckCircleIcon styleName={'icon-green'} size={20}/>
                                                        :
                                                        <AlertCircleIcon styleName={'icon-red'}  size={20}/>
                                                    }
                                                </IconButton>
                                            </Tooltip>
                                            {userMetamaskAddress}
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
        profile: state.profile
    };
}

export default connect(mapStateToProps)(Navbar);
