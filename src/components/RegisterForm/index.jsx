import React, { Component } from "react";
import PropTypes from "prop-types";
import { Button, Typography, InputText, Checkbox, Toggle } from "components";
import { connect } from "react-redux";
import { compose } from "lodash/fp";
import Cache from "../../lib/cache/cache";
import { CopyText } from "../../copy";
import { getAppCustomization } from "../../lib/helpers";
import loading from "assets/loading-circle.gif";
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
    isConfirmed: false,
    terms: null
  };

  componentDidMount() {
    this.projectData(this.props);
  }

  componentWillReceiveProps(props) {
    this.projectData(props);
  }

  projectData = async props => {
    const { ln } = props;
    const { footer } = getAppCustomization();
    const supportLinks = footer.languages.find(
      f =>
        f.language.isActivated === true &&
        f.language.prefix === ln.toUpperCase()
    ).supportLinks;
    const terms = supportLinks.find(s => {
      return s.name.trim().toLowerCase() === "terms of service";
    });

    this.setState({ terms });
  };

  handleSubmit = async event => {
    this.setState({ ...this.state, isLoading: true });

    event.preventDefault();
    const { onSubmit } = this.props;
    const affiliateLink = Cache.getFromCache("affiliate");
    let data = { ...this.state, affiliateLink: affiliateLink };
    if (onSubmit && this.formIsValid()) {
      await onSubmit(data);
    }

    this.setState({ ...this.state, isLoading: false });
  };

  formIsValid = () => {
    const { password, username, emailValid, isConfirmed, terms } = this.state;
    return (
      username !== "" &&
      emailValid &&
      password !== "" &&
      (!terms || isConfirmed === true)
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

    this.setState({ isConfirmed: !isConfirmed });
  }

  render() {
    const { error } = this.props;
    const {
      username,
      password,
      email,
      isLoading,
      isConfirmed,
      terms
    } = this.state;
    const { ln } = this.props;
    const copy = CopyText.registerFormIndex[ln];
    const { skin } = getAppCustomization();

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
        {terms ? (
          <div styleName="agree">
            <div styleName="agree-main">
              <div>
                {skin.skin_type == "digital" ? (
                  <Toggle
                    id={"isConfirmed"}
                    checked={isConfirmed}
                    onChange={() => this.onHandlerConfirm()}
                    showText={false}
                  />
                ) : (
                  <Checkbox
                    onClick={() => this.onHandlerConfirm()}
                    isSet={isConfirmed}
                    id={"isConfirmed"}
                  />
                )}
              </div>
              <div styleName="agree-right">
                <Typography color="white" variant="x-small-body">
                  I Agree with the{" "}
                  <a href={terms.href} target={"_blank"}>
                    {" "}
                    Terms & Conditions{" "}
                  </a>
                </Typography>
              </div>
            </div>
          </div>
        ) : null}
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
            {isLoading ? (
              <img src={loading} alt='Loading Icon' />
            ) : (
              <Typography
                color={skin.skin_type == "digital" ? "secondary" : "fixedwhite"}
              >
                {copy.INDEX.TYPOGRAPHY.TEXT[0]}
              </Typography>
            )}
          </Button>
        </div>
      </form>
    );
  }
}

function mapStateToProps(state) {
  return {
    profile: state.profile,
    ln: state.language
  };
}

export default compose(connect(mapStateToProps))(RegisterForm);
