import React, { Component } from "react";
import { connect } from "react-redux";
import { Button, Typography, InputText, EmailIcon } from "components";
import { CopyText } from "../../copy";
import { askResetPassword, setNewPassword } from "../../lib/api/users";
import handleError from "../../lib/api/handleError";
import { getIcon } from "../../lib/helpers";
import "./index.css";
import _ from "lodash";

class ResetPassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
      password: "",
      confirmPassword: "",
      user: "",
      token: "",
      error: "",
      disabled: true,
    };
  }

  componentDidMount = () => {
    const { params } = this.props;

    if (params) {
      this.setState({ token: params.token, user: params.userId });
    }
  };

  handleResetPassword = async () => {
    const { user } = this.state;
    const { onClose } = this.props;

    try {
      const response = await askResetPassword(user);

      if (response.message) {
        this.setState({ error: response.message });
      } else {
        onClose();
      }
    } catch (error) {
      handleError(error);
      return false;
    }
  };

  handleSetNewPassword = async () => {
    const { user, token, password } = this.state;
    const { onClose } = this.props;

    try {
      const response = await setNewPassword(user, token, password);

      if (response.message) {
        this.setState({ error: response.message });
      } else {
        onClose();
      }
    } catch (error) {
      handleError(error);
      return false;
    }
  };

  renderError(error) {
    return (
      <div styleName="error">
        {error ? (
          <Typography color="red" variant="small-body" weight="semi-bold">
            {error}
          </Typography>
        ) : null}
      </div>
    );
  }

  onUserChange = (event) => {
    this.setState({
      user: event.target.value,
      disabled: !_.isEmpty(event.target.value) ? false : true,
    });
  };

  onPasswordChange = (event) => {
    const { confirmPassword } = this.state;
    let disabled = true;

    if (
      !_.isEmpty(event.target.value) &&
      event.target.value === confirmPassword
    ) {
      disabled = false;
    }

    this.setState({ password: event.target.value, disabled });
  };

  onConfirmPasswordChange = (event) => {
    const { password } = this.state;
    let disabled = true;

    if (!_.isEmpty(event.target.value) && event.target.value === password) {
      disabled = false;
    }

    this.setState({ confirmPassword: event.target.value, disabled });
  };

  render() {
    const { password, confirmPassword, user, error, disabled } = this.state;
    const { ln, params, mode } = this.props;
    const copy = CopyText.loginFormIndex[ln];

    if ((!params && mode === "new") || !mode) return null;

    const emailIcon = getIcon(11);

    return (
      <div styleName="root">
        <div styleName="container">
          <div styleName="container-small">
            <div className="row" style={{ margin: 0 }}>
              <div styleName="box">
                <div styleName="reset-password-title">
                  <div styleName="reset-password-left">
                    {emailIcon === null ? (
                      <EmailIcon />
                    ) : (
                      <img src={emailIcon} alt="Email" />
                    )}
                  </div>
                  <div styleName="reset-password-right">
                    <Typography color="white" variant="small-body">
                      {copy.INDEX.TYPOGRAPHY.TEXT[6]}
                    </Typography>
                  </div>
                </div>
                <div styleName="reset-password">
                  {this.renderError(error)}
                  {mode === "new" ? (
                    <div>
                      <div styleName="username">
                        <InputText
                          name="password"
                          type="password"
                          label={copy.INDEX.INPUT_TEXT.LABEL[1]}
                          onChange={this.onPasswordChange}
                          value={password}
                        />
                      </div>
                      <div styleName="username">
                        <InputText
                          name="confirmPassword"
                          type="password"
                          label={copy.INDEX.INPUT_TEXT.LABEL[4]}
                          onChange={this.onConfirmPasswordChange}
                          value={confirmPassword}
                        />
                      </div>
                    </div>
                  ) : mode === "reset" ? (
                    <div styleName="username">
                      <InputText
                        name="user"
                        label={copy.INDEX.INPUT_TEXT.LABEL[3]}
                        onChange={this.onUserChange}
                        value={user}
                      />
                    </div>
                  ) : null}
                </div>

                <Button
                  size="medium"
                  theme="primary"
                  disabled={disabled}
                  onClick={
                    mode === "reset"
                      ? this.handleResetPassword.bind(this)
                      : this.handleSetNewPassword.bind(this)
                  }
                >
                  <Typography color="fixedwhite">
                    {mode === "reset"
                      ? copy.INDEX.TYPOGRAPHY.TEXT[7]
                      : copy.INDEX.TYPOGRAPHY.TEXT[8]}
                  </Typography>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    ln: state.language,
  };
}

export default connect(mapStateToProps)(ResetPassword);
