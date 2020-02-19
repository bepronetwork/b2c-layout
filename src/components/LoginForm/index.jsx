import React, { Component } from "react";
import PropTypes from "prop-types";
import { Button, Typography, InputText } from "components";
import "./index.css";
import { getAppCustomization } from "../../lib/helpers";
import { CopyText } from '../../copy';
import { connect } from "react-redux";
class LoginForm extends Component {
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
        const {ln} = this.props;
const copy = CopyText.loginFormIndex[ln];

        return (
            <div styleName={has2FA ? "disabled" : null}>
                <div styleName="username">
                    <InputText
                        name="username"
                        label= {copy.INDEX.INPUT_TEXT.LABEL[0]}
                        onChange={this.onUsernameChange}
                        value={username}
                        disabled={has2FA}
                    />
                </div>
                <InputText
                    name="password"
                    label= {copy.INDEX.INPUT_TEXT.LABEL[1]}
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
        const {ln} = this.props;
const copy = CopyText.loginFormIndex[ln];

        if (!has2FA) { return null };

        return (
            <div>
                <div styleName="token2FA">
                    <InputText
                        name="token2fa"
                        label={copy.INDEX.INPUT_TEXT.LABEL[2]}
                        onChange={this.on2FATokenChange}
                        value={token}
                        maxlength="6"
                        placeholder={copy.INDEX.INPUT_TEXT.PLACEHOLDER[0]}
                    />
                </div>
                <div styleName="token2FA-info">
                    <Typography color={'grey'} variant={'small-body'}>
                        {copy.INDEX.TYPOGRAPHY.TEXT[0]}
                    </Typography>
                </div>
            </div>
        );
    }

    render() {
        const { error, has2FA } = this.props;
        const { logo } = getAppCustomization();
        const {ln} = this.props;
const copy = CopyText.loginFormIndex[ln];

        return (
            <form onSubmit={this.handleSubmit}>
                <img src={logo.id} styleName="tkn_logo_login"/>
                
                {this.renderStageOne()}
                
                {has2FA ? this.renderStageTwo() : null}

                <div styleName="error">
                {error && error !== 37 ? (
                    <Typography color="red" variant="small-body" weight="semi-bold">
                    {error === 4
                        ? copy.INDEX.TYPOGRAPHY.TEXT[1]
                        : 
                        error === 36 
                            ? copy.INDEX.TYPOGRAPHY.TEXT[2]
                            : copy.INDEX.TYPOGRAPHY.TEXT[3]}
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
                    <Typography color="white">{copy.INDEX.TYPOGRAPHY.TEXT[4]}</Typography>
                </Button>
                </div>
            </form>
        );
    }
}

function mapStateToProps(state){
    return {
        profile : state.profile,
        ln: state.language
    };
}

export default connect(mapStateToProps)(LoginForm);