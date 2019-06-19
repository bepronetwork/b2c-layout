import React, { Component } from "react";
import PropTypes from "prop-types";
import { Button, Typography, InputText } from "components";
import "./index.css";

export default class RegisterForm extends Component {
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
        this.updateAddress();
    }

    componentWillReceiveProps(){
        this.updateAddress();
    }

    updateAddress = async () => {
        let accounts = await window.web3.eth.getAccounts();
        this.setState({...this.state, address : accounts[0]});
    }

    handleSubmit = event => {
        event.preventDefault();
        const { onSubmit } = this.props;
        if (onSubmit && this.formIsValid()) onSubmit(this.state);
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
                label="Address"
                onChange={this.onChange}
                value={address}
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
