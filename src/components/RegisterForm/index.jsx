import React, { Component } from "react";
import PropTypes from "prop-types";
import { Button, Typography, InputText } from "components";
import "./index.css";
import { connect } from "react-redux";
import { compose } from 'lodash/fp';
import Cache from "../../lib/cache/cache";
import { CopyText } from '../../copy';
import loading from 'assets/loading-circle.gif';

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
        isLoading: false
    };

    componentDidMount(){
    }

    componentWillReceiveProps(){
    }

    handleSubmit = async event => {
        this.setState({...this.state, isLoading : true });

        event.preventDefault();
        const { onSubmit } = this.props;
        const affiliateLink = Cache.getFromCache('affiliate');
        let data = {...this.state, affiliateLink : affiliateLink}
        if (onSubmit && this.formIsValid()) {
            await onSubmit(data);
        }

        this.setState({...this.state, isLoading : false});
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
        const { username, password, confirmPassword, email, isLoading } = this.state;
        const {ln} = this.props;
        const copy = CopyText.registerFormIndex[ln];

        return (
        <form onSubmit={this.handleSubmit}>
            <div styleName="username">
            <InputText
                name="username"
                label={copy.INDEX.INPUT_TEXT.LABEL[0]}
                onChange={this.onChange}
                value={username}
            />
            </div>
            <div styleName="password">
            <InputText
                name="password"
                type="password"
                label={copy.INDEX.INPUT_TEXT.LABEL[1]}
                onChange={this.onChange}
                value={password}
            />
            </div>
            <div styleName="password">
            <InputText
                name="confirmPassword"
                label= {copy.INDEX.INPUT_TEXT.LABEL[2]}
                type="password"
                onChange={this.onChange}
                value={confirmPassword}
            />
            </div>
            <InputText
            name="email"
            label={copy.INDEX.INPUT_TEXT.LABEL[3]}
            onChange={this.onEmailChange}
            value={email}
            />

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
                disabled={!this.formIsValid() || isLoading}
                type="submit"
            >
                {isLoading 
                    ?
                        <img src={loading} />
                    :
                        <Typography color="white">{copy.INDEX.TYPOGRAPHY.TEXT[0]}</Typography>
                }
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
