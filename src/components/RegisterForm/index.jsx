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
import moment from "moment";
import Cache from "../../lib/cache/cache";
import { CopyText } from "../../copy";
import { getAppCustomization } from "../../lib/helpers";
import "./index.css";
import generateMonths from "../../utils/generateMonths";
import generateIntegers from "../../utils/generateIntegers";
import leadingWithZero from "../../utils/leadingWithZero";

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
      isValidEmail: false,
      isLoading: false,
      isConfirmed: false,
      terms: null,
      month: { text: "Month" },
      day: { text: "Day" },
      year: "",
      age: "",
      isValidBirthdate: false
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
    const isEmail = event.target.name === "email";
    const email = event.target.value;
    const isValidEmail = email.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i);

    this.setState(
      {
        [event.target.name]: event.target.value
      },
      this.checkAge
    );

    if (isEmail) {
      this.setState({ email, isValidEmail });
    }
  };

  onDayChange = ({ option }) => {
    this.setState({ day: option }, this.checkAge);
  };

  onMonthChange = ({ option }) => {
    this.setState({ month: option }, this.checkAge);
  };

  onHandlerConfirm() {
    const { isConfirmed } = this.state;

    this.setState({ isConfirmed: !isConfirmed });
  }

  checkAge = () => {
    const { year, month, day } = this.state;
    const thisMoment = new Date();
    const thisYear = thisMoment.getFullYear();
    const thisMonth = thisMoment.getMonth();
    const thisDay = thisMoment.getDay();
    const dateFx = moment(
      `${thisYear}-${leadingWithZero(thisMonth)}-${leadingWithZero(thisDay)}`
    ).diff(moment(`${year}-${month.value}-${day.value}`), "years");
    const isLegalAge = dateFx >= 18;
    const isUndefinedAge = dateFx > 50;
    const isValidDate = year.length === 4 && !isUndefinedAge && isLegalAge;

    if (isValidDate) {
      this.setState({ age: dateFx });
    }

    this.setState({ isValidBirthdate: isValidDate });
  };

  handleSubmit = async event => {
    this.setState({ ...this.state, isLoading: true });

    event.preventDefault();
    const { onSubmit } = this.props;
    const affiliateLink = Cache.getFromCache("affiliate");
    const data = { ...this.state, affiliateLink };

    if (onSubmit && this.isValidForm()) {
      await onSubmit(data);
    }

    this.setState({ ...this.state, isLoading: false });
  };

  isValidForm = () => {
    const {
      password,
      username,
      isValidEmail,
      isConfirmed,
      terms,
      isValidBirthdate
    } = this.state;
    const isValidUsername = username !== "";
    const isValidPassword = password !== "";

    return (
      isValidUsername &&
      isValidPassword &&
      isValidEmail &&
      isValidBirthdate &&
      (!terms || isConfirmed)
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
            options={generateIntegers(1, 31).map(dayToObj => ({
              text: dayToObj,
              value: dayToObj,
              channel_id: dayToObj
            }))}
            value={day}
          />
          <SelectBox
            onChange={event => this.onMonthChange(event)}
            options={generateMonths("en-US", "MMM").map(
              (monthToObj, index) => ({
                text: monthToObj,
                value: leadingWithZero(index),
                channel_id: monthToObj
              })
            )}
            value={month}
          />
          <InputText
            name="year"
            placeholder="Year"
            onChange={this.onChange}
            value={year}
            maxlength={4}
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
          disabled={!this.isValidForm() || isLoading}
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
