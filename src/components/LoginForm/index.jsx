import React, { Component } from "react";
import PropTypes from "prop-types";
import { Button, Typography, InputText } from "components";
import "./index.css";
import { getAppCustomization } from "../../lib/helpers";

export default class LoginForm extends Component {
    static propTypes = {
        onSubmit: PropTypes.func.isRequired,
        error: PropTypes.number
    };

    static defaultProps = {
        error: null
    };

    state = {
        username: "",
        password: ""
    };

    handleSubmit = event => {
        event.preventDefault();

        const { onSubmit } = this.props;

        if (onSubmit && this.formIsValid()) onSubmit(this.state);
    };

    onUsernameChange = event => {
        this.setState({ username: event.target.value });
    };

    onPasswordChange = event => {
        this.setState({ password: event.target.value });
    };

    formIsValid = () => {
        const { username, password } = this.state;

        return username !== "" && password !== "";
    };

    render() {
        const { username, password } = this.state;
        const { error } = this.props;
        const { logo } = getAppCustomization();

        return (
            <form onSubmit={this.handleSubmit}>
                <img src={logo.id} styleName="tkn_logo_login"/>

                <div styleName="username">
                    <InputText
                        name="username"
                        label="Username"
                        onChange={this.onUsernameChange}
                        value={username}
                    />
                </div>
                <InputText
                    name="password"
                    label="Password"
                    type="password"
                    onChange={this.onPasswordChange}
                    value={password}
                />

                <div styleName="error">
                {error ? (
                    <Typography color="red" variant="small-body" weight="semi-bold">
                    {error === 4
                        ? "User not found"
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
