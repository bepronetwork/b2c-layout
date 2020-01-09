import React, { Component } from "react";
import PropTypes from "prop-types";
import { Button, Typography, InputText } from "components";
import "./index.css";
import { getAppCustomization } from "../../lib/helpers";

export default class LoginForm extends Component {
    static propTypes = {
        onSubmit: PropTypes.func.isRequired,
        error: PropTypes.number,
        has2FA: PropTypes.bool
    };

    static defaultProps = {
        error: null,
        has2FA: false
    };

    state = {
        username: "",
        password: "",
        token: ""
    };

    handleSubmit = event => {
        event.preventDefault();

        const { onSubmit } = this.props;

        if (onSubmit && this.formIsValid()) onSubmit(this.state);
    };

    on2FATokenChange = event => {
        this.setState({ token: event.target.value });
    };

    onUsernameChange = event => {
        this.setState({ username: event.target.value });
    };

    onPasswordChange = event => {
        this.setState({ password: event.target.value });
    };

    formIsValid = () => {
        const { username, password, token } = this.state;
        const { has2FA } = this.props;

        return (username !== "" && password !== "" && !has2FA) || (token.length === 6 && has2FA); 
    };

    renderStageOne() {
        const { username, password } = this.state;
        const { has2FA } = this.props;

        return (
            <div styleName={has2FA ? "disabled" : null}>
                <div styleName="username">
                    <InputText
                        name="username"
                        label="Username"
                        onChange={this.onUsernameChange}
                        value={username}
                        disabled={has2FA}
                    />
                </div>
                <InputText
                    name="password"
                    label="Password"
                    type="password"
                    onChange={this.onPasswordChange}
                    value={password}
                    disabled={has2FA}
                />
            </div>
        );
    }

    renderStageTwo() {
        const { has2FA } = this.props;
        const { token } = this.state;

        if (!has2FA) { return null };

        return (
            <div>
                <div styleName="token2FA">
                    <InputText
                        name="token2fa"
                        label="Your 2FA Code"
                        onChange={this.on2FATokenChange}
                        value={token}
                        maxlength="6"
                        placeholder="6 digit code"
                    />
                </div>
                <div styleName="token2FA-info">
                    <Typography color={'grey'} variant={'small-body'}>
                        Insert the 6 digit from your 2FA Key Management App
                    </Typography>
                </div>
            </div>
        );
    }

    render() {
        const { error, has2FA } = this.props;
        const { logo } = getAppCustomization();

        return (
            <form onSubmit={this.handleSubmit}>
                <img src={logo.id} styleName="tkn_logo_login"/>
                
                {this.renderStageOne()}
                
                {has2FA ? this.renderStageTwo() : null}

                <div styleName="error">
                {error && error !== 37 ? (
                    <Typography color="red" variant="small-body" weight="semi-bold">
                    {error === 4
                        ? "User not found"
                        : 
                        error === 36 
                            ? "2FA Key is Wrong"
                            : `Please provide a valid password`}
                    </Typography>
                ) : null}
                </div>

                <div styleName="button">
                <Button
                    size="medium"
                    theme="primary"
                    disabled={!this.formIsValid()}
                    type="submit"
                >
                    <Typography color="white">Sign In</Typography>
                </Button>
                </div>
            </form>
        );
    }
}
