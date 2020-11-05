import React, { Component } from "react";
import PropTypes from "prop-types";
import { Button, Typography, InputText } from "components";
import { connect } from "react-redux";
import loading from "assets/loading-circle.gif";
import { CopyText } from "../../copy";
import { getAppCustomization } from "../../lib/helpers";
import "./index.css";

class LoginForm extends Component {
  static propTypes = {
    onSubmit: PropTypes.func.isRequired,
    has2FA: PropTypes.bool,
    error: PropTypes.string,
    onClose: PropTypes.func.isRequired,
    onHandleResetPassword: PropTypes.func.isRequired
  };

  static defaultProps = {
    error: null,
    has2FA: false
  };

  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: "",
      token2fa: "",
      isLoading: false
    };
    this.onInputChange = this.onInputChange.bind(this);
    this.onPasswordReset = this.onPasswordReset.bind(this);
  }

  handleSubmit = async event => {
    this.setState({ ...this.state, isLoading: true });

    event.preventDefault();

    const { onSubmit } = this.props;

    if (onSubmit && this.formIsValid()) {
      await onSubmit(this.state);
    }

    this.setState({ ...this.state, isLoading: false });
  };

  onPasswordReset = () => {
    const { onClose, onHandleResetPassword } = this.props;

    onClose();
    onHandleResetPassword({ mode: "reset" });
  };

  onInputChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  formIsValid = () => {
    const { username, password, token2fa } = this.state;
    const { has2FA } = this.props;

    return (
      (username !== "" && password !== "" && !has2FA) ||
      (token2fa.length === 6 && has2FA)
    );
  };

  renderStageOne() {
    const { username, password } = this.state;
    const { has2FA } = this.props;
    const { ln } = this.props;
    const copy = CopyText.loginFormIndex[ln];
    const fields = () => (
      <>
        <InputText
          gutterBottom
          name="username"
          placeholder={copy.INDEX.INPUT_TEXT.LABEL[0]}
          onChange={this.onInputChange}
          value={username}
          disabled={has2FA}
        />
        <InputText
          gutterBottom
          name="password"
          placeholder={copy.INDEX.INPUT_TEXT.LABEL[1]}
          type="password"
          onChange={this.onInputChange}
          value={password}
          disabled={has2FA}
        />
      </>
    );

    return has2FA ? <div styleName="disabled">{fields()}</div> : fields();
  }

  renderStageTwo() {
    const { has2FA } = this.props;
    const { token } = this.state;
    const { ln } = this.props;
    const copy = CopyText.loginFormIndex[ln];

    if (!has2FA) {
      return null;
    }

    return (
      <>
        <InputText
          name="token2fa"
          onChange={this.on2FATokenChange}
          value={token}
          maxlength="6"
          placeholder={`${copy.INDEX.INPUT_TEXT.LABEL[2]} - ${copy.INDEX.INPUT_TEXT.PLACEHOLDER[0]}`}
        />
        <div styleName="token2FA-info">
          <Typography color="grey" variant="small-body">
            {copy.INDEX.TYPOGRAPHY.TEXT[0]}
          </Typography>
        </div>
      </>
    );
  }

  renderError(error) {
    const { ln } = this.props;
    const copy = CopyText.loginFormIndex[ln];
    const renderError36 =
      error === 36
        ? copy.INDEX.TYPOGRAPHY.TEXT[2]
        : copy.INDEX.TYPOGRAPHY.TEXT[3];

    return (
      <div styleName="error">
        {error && error !== 37 ? (
          <Typography color="red" variant="small-body" weight="semi-bold">
            {error === 4 || error === 55
              ? copy.INDEX.TYPOGRAPHY.TEXT[1]
              : renderError36}
          </Typography>
        ) : null}
      </div>
    );
  }

  render() {
    const { error, has2FA, ln } = this.props;
    const { isLoading } = this.state;
    const copy = CopyText.loginFormIndex[ln];
    const { skin } = getAppCustomization();
    const renderError36 =
      error === 36
        ? copy.INDEX.TYPOGRAPHY.TEXT[2]
        : copy.INDEX.TYPOGRAPHY.TEXT[3];

    return (
      <form onSubmit={this.handleSubmit} styleName="root">
        {this.renderStageOne()}
        {has2FA && this.renderStageTwo()}
        {error && error !== 37 && (
          <div styleName="error">
            <Typography color="red" variant="small-body" weight="semi-bold">
              {error === 4 ? copy.INDEX.TYPOGRAPHY.TEXT[1] : renderError36}
            </Typography>
          </div>
        )}
        <Button
          size="medium"
          theme="primary"
          disabled={!this.formIsValid() || isLoading}
          type="submit"
        >
          {isLoading ? (
            <img src={loading} alt="Loading GIF" style={{ width: 24 }} />
          ) : (
            <Typography
              color={skin.skin_type === "digital" ? "secondary" : "fixedwhite"}
            >
              {copy.INDEX.TYPOGRAPHY.TEXT[4]}
            </Typography>
          )}
        </Button>
        <div styleName="forgot">
          <a href="#" onClick={this.onPasswordReset}>
            <Typography color="casper" variant="small-body">
              {copy.INDEX.TYPOGRAPHY.TEXT[5]}
            </Typography>
          </a>
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

export default connect(mapStateToProps)(LoginForm);
