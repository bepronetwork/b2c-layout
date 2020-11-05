import React, { Component } from "react";
import PropTypes from "prop-types";
import {
  Button,
  Typography,
  InputText,
  Checkbox,
  Toggle,
  SelectBox
} from "components";
import { connect } from "react-redux";
import { compose } from "lodash/fp";
import loading from "assets/loading-circle.gif";
import Cache from "../../lib/cache/cache";
import { CopyText } from "../../copy";
import { getAppCustomization } from "../../lib/helpers";
import "./index.css";
import generateMonths from "../../utils/generateMonths";
import generateIntegers from "../../utils/generateIntegers";

class RegisterForm extends Component {
  static propTypes = {
    onSubmit: PropTypes.func.isRequired,
    error: PropTypes.number
  };

  static defaultProps = {
    error: null
  };

  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: "",
      email: "",
      emailValid: false,
      isLoading: false,
      isConfirmed: false,
      terms: null,
      month: { text: "Month" },
      day: { text: "Day" },
      year: { text: "Year" }
    };
    this.onChange = this.onChange.bind(this);
  }

  componentDidMount() {
    this.projectData(this.props);
  }

  componentWillReceiveProps(props) {
    this.projectData(props);
  }

  onChange = event => {
    const isEmail = event && event.target.name === "email";
    const email = event.target.value;
    const emailValid = email.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i);

    this.setState({
      [event.target.name]: event.target.value
    });

    if (isEmail) {
      this.setState({ email, emailValid });
    }
  };

  onDayChange = ({ option }) => {
    this.setState({ day: option });
  };

  onMonthChange = ({ option }) => {
    this.setState({ month: option });
  };

  onHandlerConfirm() {
    const { isConfirmed } = this.state;

    this.setState({ isConfirmed: !isConfirmed });
  }

  handleSubmit = async event => {
    this.setState({ ...this.state, isLoading: true });

    event.preventDefault();
    const { onSubmit } = this.props;
    const affiliateLink = Cache.getFromCache("affiliate");
    const data = { ...this.state, affiliateLink };

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

  projectData = async props => {
    const { ln } = props;
    const { footer } = getAppCustomization();
    const { languages } = footer;
    const supportLinks = languages.find(({ language }) => {
      const { isActivated, prefix } = language;

      return isActivated && prefix === ln.toUpperCase();
    });
    const terms = supportLinks.supportLinks.find(
      ({ name }) => name.trim().toLowerCase() === "terms of service"
    );

    this.setState({ terms });
  };

  render() {
    const { error, ln } = this.props;
    const {
      username,
      password,
      email,
      isLoading,
      isConfirmed,
      terms,
      month,
      day,
      year
    } = this.state;
    const copy = CopyText.registerFormIndex[ln];
    const { skin } = getAppCustomization();
    const date = new Date();

    date.getFullYear(date.getFullYear() - 18);

    const months = () =>
      generateMonths("en-US", "MMM").map(monthToObj => ({
        text: monthToObj,
        value: monthToObj.toLowerCase(),
        channel_id: monthToObj
      }));
    const days = () =>
      generateIntegers().map(dayToObj => ({
        text: dayToObj,
        value: dayToObj,
        channel_id: dayToObj
      }));

    return (
      <form onSubmit={this.handleSubmit} styleName="root">
        <InputText
          gutterBottom
          name="username"
          placeholder={copy.INDEX.INPUT_TEXT.LABEL[0]}
          onChange={this.onChange}
          value={username}
        />
        <InputText
          gutterBottom
          name="password"
          type="password"
          placeholder={copy.INDEX.INPUT_TEXT.LABEL[1]}
          onChange={this.onChange}
          value={password}
        />
        <InputText
          gutterBottom
          name="email"
          placeholder={copy.INDEX.INPUT_TEXT.LABEL[3]}
          onChange={this.onChange}
          value={email}
        />
        <div styleName="birth-fields">
          <SelectBox
            onChange={event => this.onDayChange(event)}
            options={days()}
            value={day}
          />
          <SelectBox
            onChange={event => this.onMonthChange(event)}
            options={months()}
            value={month}
          />
          <SelectBox
            onChange={event => this.onYearChange(event)}
            options={months()}
            value={year}
          />
        </div>
        {terms && (
          <div styleName="agree">
            <div styleName="agree-main">
              <div>
                {skin.skin_type === "digital" ? (
                  <Toggle
                    id="isConfirmed"
                    checked={isConfirmed}
                    onChange={() => this.onHandlerConfirm()}
                    showText={false}
                  />
                ) : (
                  <Checkbox
                    onClick={() => this.onHandlerConfirm()}
                    isSet={isConfirmed}
                    id="isConfirmed"
                  />
                )}
              </div>
              <div styleName="agree-right">
                <Typography color="white" variant="x-small-body">
                  I Agree with the
                  <a
                    href={terms.href}
                    target="_blank"
                    rel="noreferrer noopener"
                  >
                    Terms & Conditions
                  </a>
                </Typography>
              </div>
            </div>
          </div>
        )}
        {error && (
          <div styleName="error">
            <Typography color="red" variant="small-body" weight="semi-bold">
              {error.message}
            </Typography>
          </div>
        )}
        <Button
          size="medium"
          theme="primary"
          onClick={this.handleSubmit}
          disabled={!this.formIsValid() || isLoading}
          type="submit"
          fullWidth
        >
          {isLoading ? (
            <img src={loading} alt="Loading GIF" style={{ width: 24 }} />
          ) : (
            <Typography
              color={skin.skin_type === "digital" ? "secondary" : "fixedwhite"}
            >
              {copy.INDEX.TYPOGRAPHY.TEXT[0]}
            </Typography>
          )}
        </Button>
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
