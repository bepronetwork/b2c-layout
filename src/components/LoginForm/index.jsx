import React, { Component } from "react";
import PropTypes from "prop-types";
import { Button, Typography, InputText } from "components";
import "./index.css";
import { getAppCustomization } from "../../lib/helpers";
import { CopyText } from '../../copy';
import { connect } from "react-redux";
import { askResetPassword } from "../../lib/api/users";
import email from 'assets/email.png';
import handleError from "../../lib/api/handleError";
class LoginForm extends Component {
    static propTypes = {
        onSubmit: PropTypes.func.isRequired,
        error: PropTypes.number,
        has2FA: PropTypes.bool,
        showResetPasswordBox: PropTypes.bool,
        error: PropTypes.string,
        onClose: PropTypes.func
    };

    static defaultProps = {
        error: null,
        has2FA: false,
        showResetPasswordBox: false
    };

    state = {
        username: "",
        password: "",
        token: "",
        username_or_email: "",
        resetError: ""
    };

    handleSubmit = event => {
        event.preventDefault();

        const { onSubmit } = this.props;

        if (onSubmit && this.formIsValid()) onSubmit(this.state);
    };

    handleResetPassword = async () => {
        const { username_or_email } = this.state;
        const { onClose } = this.props;
        
        try {
            const response = await askResetPassword(username_or_email); 

            if (response.status) {
                this.setState({ resetError: response.status });
            }
            else {
                onClose();
            }
            
        } catch (error) {
            handleError(error);
            return false;
        }
    };

    resetPasswordClick = () => {
        this.setState({ showResetPasswordBox : true });
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

    onUserChange = event => {
        this.setState({ username_or_email: event.target.value });
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

    renderResetPassword() {
        const { username_or_email } = this.state;
        const {ln} = this.props;
        const copy = CopyText.loginFormIndex[ln];

        return (
            <div>
                <div styleName="reset-password">
                    <div styleName="reset-password-title">
                        <div styleName="reset-password-left">
                            <img src={email} width="30"/>
                        </div>
                        <div styleName="reset-password-right">
                            <Typography color="white" variant="small-body">
                                {copy.INDEX.TYPOGRAPHY.TEXT[6]}
                            </Typography>
                        </div>
                    </div>
                    <div styleName="username">
                        <InputText
                            name="username_or_email"
                            label= {copy.INDEX.INPUT_TEXT.LABEL[3]}
                            onChange={this.onUserChange}
                            value={username_or_email}
                        />
                    </div>
                </div>
            </div>
        );
    }

    renderError(error) {
        const {ln} = this.props;
        const copy = CopyText.loginFormIndex[ln];

        return (
            <div styleName="error">
                {error && error !== 37 ? (
                    <Typography color="red" variant="small-body" weight="semi-bold">
                    {error === 4 || error === 55
                        ? copy.INDEX.TYPOGRAPHY.TEXT[1]
                        : 
                        error === 36 
                            ? copy.INDEX.TYPOGRAPHY.TEXT[2]
                            : copy.INDEX.TYPOGRAPHY.TEXT[3]}
                    </Typography>
                ) : null}
            </div>
        )
    }

    render() {
        const { error, has2FA } = this.props;
        const { showResetPasswordBox, resetError } = this.state;
        const { logo } = getAppCustomization();
        const {ln} = this.props;
        const copy = CopyText.loginFormIndex[ln];

        return (
            <div>
                {showResetPasswordBox 
                    ?
                    <div styleName="box">
                        {this.renderResetPassword()}

                        {this.renderError(resetError)}

                        <Button
                            size="medium"
                            theme="primary"
                            onClick={this.handleResetPassword.bind(this)}>
                            <Typography color="white">{copy.INDEX.TYPOGRAPHY.TEXT[7]}</Typography>
                        </Button>
                    </div>
                    :
                    <form onSubmit={showResetPasswordBox ? this.handleResetPassword : this.handleSubmit}>
                        <img src={logo.id} styleName="tkn_logo_login"/>

                        {this.renderStageOne()}
                        
                        {has2FA ? this.renderStageTwo() : null}

                        {this.renderError(error)}

                        <Button
                            size="medium"
                            theme="primary"
                            disabled={!this.formIsValid()}
                            type="submit">
                            <Typography color="white">{copy.INDEX.TYPOGRAPHY.TEXT[4]}</Typography>
                        </Button>

                        <div styleName="forgot">
                            <a href="#" onClick={this.resetPasswordClick}>
                                <Typography color="casper" variant="small-body">
                                    {copy.INDEX.TYPOGRAPHY.TEXT[5]}
                                </Typography>
                            </a>
                        </div>
                    </form>
                }
            </div>
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