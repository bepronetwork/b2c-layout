import React, { Component } from "react";
import PropTypes from "prop-types";
import { Button, Typography, InputText } from "components";
import "./index.css";
import { connect } from "react-redux";
import { compose } from 'lodash/fp';
import Cache from "../../lib/cache/cache";
class RegisterForm extends Component {
    static propTypes = {
        onSubmit: PropTypes.func.isRequired,
        error: PropTypes.number
    };

    static defaultProps = {
        error: null
    };

    state = {
        username: "",
        password: "",
        confirmPassword: "",
        email: "",
        emailValid: false,
        address: ""
    };

    componentDidMount(){
        this.getMetamaskInfo();
        this.updateAddress();
    }

    getMetamaskInfo(){
        if(window.ethereum){
            window.ethereum.on('accountsChanged', (accounts) => {
                this.updateAddress(accounts[0]);
            })
            
            window.ethereum.on('networkChanged', (netId) =>  {
                console.log(netId);
            })
        }  
    }

    componentWillReceiveProps(){
        this.updateAddress();
    }

    updateAddress = async (address=null) => {
        if(!address && window.web3 && window.web3.eth){
            address = (await window.web3.eth.getAccounts())[0];
        }
        this.setState({...this.state, address : address});
    }

    handleSubmit = event => {
        event.preventDefault();
        const { onSubmit } = this.props;
        const affiliateLink = Cache.getFromCache('affiliate');
        let data = {...this.state, affiliateLink : affiliateLink}
        if (onSubmit && this.formIsValid()) onSubmit(data);
    };

    formIsValid = () => {
        const { password, confirmPassword, username, emailValid } = this.state;
        return (
        username !== "" &&
        emailValid &&
        (password !== "" &&
            confirmPassword !== "" &&
            password === confirmPassword)
        );
    };

    onEmailChange = event => {
        const email = event.target.value;
        const emailValid = email.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i);

        this.setState({ email, emailValid });
    };

    onChange = event => {
        this.setState({ [event.target.name]: event.target.value });
    };

    onUsernameChange = event => {
        this.setState({ username: event.target.value });
    };

    onPasswordChange = event => {
        this.setState({ password: event.target.value });
    };

    onAddressChange = event => {
        this.setState({ address: event.target.value });
    };

    render() {
        const { error } = this.props;
        const { username, password, confirmPassword, email, address } = this.state;

        return (
        <form onSubmit={this.handleSubmit}>
            <div styleName="username">
            <InputText
                name="username"
                label="Username"
                onChange={this.onChange}
                value={username}
            />
            </div>
            <div styleName="password">
            <InputText
                name="password"
                type="password"
                label="Password"
                onChange={this.onChange}
                value={password}
            />
            </div>
            <div styleName="password">
            <InputText
                name="confirmPassword"
                label="Confirm Password"
                type="password"
                onChange={this.onChange}
                value={confirmPassword}
            />
            </div>
            <InputText
            name="email"
            label="Email"
            onChange={this.onEmailChange}
            value={email}
            />

            <div styleName="address">
            <InputText
                name="address"
                label="Ethereum Address"
                onChange={this.onChange}
                value={address}
                placeHolder={'0x23cab324ba2a24... '}
            />
            </div>

            <div styleName="error">
            {error ? (
                <Typography color="red" variant="small-body" weight="semi-bold">
                {error.message}
                </Typography>
            ) : null}
            </div>

            <div styleName="button">
            <Button
                size="medium"
                theme="primary"
                onClick={this.handleSubmit}
                disabled={!this.formIsValid()}
                type="submit"
            >
                <Typography color="white">Register</Typography>
            </Button>
            </div>
        </form>
        );
    }
}


function mapStateToProps(state){
    return {
        profile: state.profile,
        ln : state.language
    };
}

export default compose(connect(mapStateToProps))(RegisterForm);
