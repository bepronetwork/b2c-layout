import React, { Component } from "react";
import PropTypes from "prop-types";
import { Button, Typography, InputText, Checkbox } from "components";
import { connect } from "react-redux";
import { compose } from 'lodash/fp';
import Cache from "../../lib/cache/cache";
import { CopyText } from '../../copy';
import loading from 'assets/loading-circle.gif';

import "./index.css";

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
        email: "",
        emailValid: false,
        isLoading: false,
        isConfirmed: false
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
        const { password, username, emailValid, isConfirmed } = this.state;
        return (
        username !== "" &&
        emailValid &&
        password !== "" &&
        isConfirmed === true
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

    onHandlerConfirm() {
        const { isConfirmed } = this.state;

        this.setState({ isConfirmed : !isConfirmed });
    }

    render() {
        const { error } = this.props;
        const { username, password, email, isLoading, isConfirmed } = this.state;
        const {ln} = this.props;
        const copy = CopyText.registerFormIndex[ln];

        return (
        <form onSubmit={this.handleSubmit}>
            <div styleName="username">
            <InputText
                name="username"
                placeholder={copy.INDEX.INPUT_TEXT.LABEL[0]}
                onChange={this.onChange}
                value={username}
            />
            </div>
            <div styleName="password">
            <InputText
                name="password"
                type="password"
                placeholder={copy.INDEX.INPUT_TEXT.LABEL[1]}
                onChange={this.onChange}
                value={password}
            />
            </div>
            <InputText
            name="email"
            placeholder={copy.INDEX.INPUT_TEXT.LABEL[3]}
            onChange={this.onEmailChange}
            value={email}
            />

            <div styleName="agree">
                <div>
                    <Checkbox onClick={() => this.onHandlerConfirm()} isSet={isConfirmed} id={'isConfirmed'}/>
                </div>
                <div styleName="agree-right">
                    <Typography color="white" variant="x-small-body">
                        I Agree with Terms & Conditions (See Footer)
                    </Typography>
                </div>
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
                disabled={!this.formIsValid() || isLoading}
                type="submit"
            >
                {isLoading 
                    ?
                        <img src={loading} />
                    :
                        <Typography color="fixedwhite">{copy.INDEX.TYPOGRAPHY.TEXT[0]}</Typography>
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
