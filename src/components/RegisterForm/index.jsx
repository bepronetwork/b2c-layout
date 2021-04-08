import React, { Component } from "react";
import PropTypes from "prop-types";
import {
  Button,
  Typography,
  InputText,
  Checkbox,
  Toggle,
  Select,
} from "components";
import { connect } from "react-redux";
import { compose } from "lodash/fp";
import loading from "assets/loading-circle.gif";
import Cache from "../../lib/cache/cache";
import { CopyText } from "../../copy";
import { getAppCustomization, getApp } from "../../lib/helpers";
import generateMonths from "../../utils/generateMonths";
import generateIntegers from "../../utils/generateIntegers";
import leadingWithZero from "../../utils/leadingWithZero";
import "./index.css";
import getYearsAgo from "../../utils/getYearsAgo";
import {
  isValidAge,
  isValidCountries,
  isValidEmail,
} from "../../utils/isValid";

class RegisterForm extends Component {
  constructor(props) {
    super(props);
    const copy = CopyText.registerFormIndex[props.ln];

    this.projectData = async () => {
      const { restrictedCountries } = await getApp();
      const { footer } = await getAppCustomization();
      const { supportLinks } = footer.languages.find(
        ({ language }) =>
          language.isActivated && language.prefix === props.ln.toUpperCase(),
      );
      const terms = supportLinks.find(
        ({ name }) => name.trim().toLowerCase() === "terms of service",
      );

      this.setState({ terms, restrictedCountries });
    };
    this.handleSubmit = async event => {
      event.preventDefault();
      this.setState({ isLoading: true });
      const {
        username,
        password,
        email,
        day,
        month,
        year,
        userCountry,
      } = this.state;
      const affiliateLink = Cache.getFromCache("affiliate");

      if (props.onSubmit && this.handleFormValidity()) {
        await props.onSubmit({
          username,
          password,
          email,
          birthDate: `${year.value}-${month.value}-${day.value}`,
          affiliateLink,
          userCountry,
        });
      }
    };
    this.handleFormValidity = () => {
      const {
        password,
        username,
        email,
        isConfirmed,
        terms,
        userCountry,
        day,
        month,
        year,
      } = this.state;

      return (
        username &&
        isValidEmail(email) &&
        password &&
        year.value &&
        month.value &&
        day.value &&
        isValidAge(`${year.value}-${month.value}-${day.value}`) &&
        userCountry.value &&
        (!terms || isConfirmed)
      );
    };
    this.handleMapSelection = value => ({
      text: value,
      value,
      channel_id: value,
    });
    this.handleTextChange = event => {
      this.setState({ [event.target.name]: event.target.value });
    };
    this.handleSelectChange = prop => ({ option }) => {
      this.setState({ [prop]: option });
    };
    this.handleConfirm = () => {
      this.setState(state => ({ isConfirmed: !state.isConfirmed }));
    };
    this.renderYearOptions = () =>
      generateIntegers({
        from: getYearsAgo(72),
        to: getYearsAgo(18),
        descend: true,
      }).map(this.handleMapSelection);
    this.renderMonthOptions = () =>
      generateMonths(props.ln, "MMM").map((month, index) => ({
        text: month,
        value: leadingWithZero(index + 1),
        channel_id: month,
      }));
    this.renderDayOptions = () =>
      generateIntegers({ from: 1, to: 31 }).map(this.handleMapSelection);
    this.renderCountryOptions = restrictedCountries =>
      isValidCountries(restrictedCountries).map(({ country, data }) => ({
        text: data.name,
        value: country,
        channel_id: country,
      }));
    this.state = {
      username: "",
      password: "",
      email: "",
      isLoading: false,
      isConfirmed: false,
      terms: null,
      month: { text: copy.INDEX.INPUT_TEXT.LABEL[7] },
      day: { text: copy.INDEX.INPUT_TEXT.LABEL[6] },
      year: { text: copy.INDEX.INPUT_TEXT.LABEL[8] },
      restrictedCountries: [],
      userCountry: { text: copy.INDEX.INPUT_TEXT.LABEL[9] },
    };
  }

  componentDidMount() {
    this.projectData();
  }

  render() {
    const {
      username,
      password,
      email,
      isLoading,
      isConfirmed,
      terms,
      month,
      day,
      year,
      userCountry,
      restrictedCountries,
    } = this.state;
    const { ln, error } = this.props;
    const copy = CopyText.registerFormIndex[ln];
    const { skin } = getAppCustomization();
    const renderToggle =
      skin.skin_type === "digital" ? (
        <Toggle
          id="isConfirmed"
          checked={isConfirmed}
          onChange={this.handleConfirm}
          showText={false}
        />
      ) : (
        <Checkbox
          onClick={this.handleConfirm}
          isSet={isConfirmed}
          id="isConfirmed"
        />
      );
    const renderTerms = terms && (
      <div styleName="agree">
        <div styleName="agree-main">
          <div>{renderToggle}</div>
          <div styleName="agree-right">
            <Typography color="white" variant="x-small-body">
              I Agree with the
              <a href={terms.href} target="_blank" rel="noreferrer">
                Terms & Conditions
              </a>
            </Typography>
          </div>
        </div>
      </div>
    );
    const renderError = error && (
      <div styleName="error">
        <Typography color="red" variant="small-body" weight="semi-bold">
          {error.message}
        </Typography>
      </div>
    );
    const renderLoader = isLoading ? (
      <img src={loading} alt="Loading" />
    ) : (
      <Typography
        color={skin.skin_type === "digital" ? "secondary" : "fixedwhite"}>
        {copy.INDEX.TYPOGRAPHY.TEXT[0]}
      </Typography>
    );

    return (
      <form onSubmit={this.handleSubmit}>
        <div styleName="username">
          <InputText
            name="username"
            placeholder={copy.INDEX.INPUT_TEXT.LABEL[0]}
            onChange={this.handleTextChange}
            value={username}
            maxlength={12}
          />
        </div>
        <div styleName="password">
          <InputText
            name="password"
            type="password"
            placeholder={copy.INDEX.INPUT_TEXT.LABEL[1]}
            onChange={this.handleTextChange}
            value={password}
            maxlength={15}
          />
        </div>
        <InputText
          name="email"
          placeholder={copy.INDEX.INPUT_TEXT.LABEL[3]}
          onChange={this.handleTextChange}
          value={email}
          maxlength={320}
        />
        <Typography
          weight="semi-bold"
          color="white"
          otherStyles={{ marginTop: 16, opacity: "0.5" }}>
          {copy.INDEX.TYPOGRAPHY.TEXT[4]}
        </Typography>
        <div styleName="birth-fields">
          <Select
            onChange={this.handleSelectChange("day")}
            options={this.renderDayOptions()}
            value={day}
          />
          <Select
            onChange={this.handleSelectChange("month")}
            options={this.renderMonthOptions()}
            value={month}
          />
        </div>
        <Select
          gutterBottom
          fullWidth
          onChange={this.handleSelectChange("year")}
          options={this.renderYearOptions()}
          value={year}
        />
        <Typography
          weight="semi-bold"
          color="white"
          otherStyles={{ margin: "0 0 8px 0", opacity: "0.5" }}>
          {copy.INDEX.TYPOGRAPHY.TEXT[5]}
        </Typography>
        <Select
          fullWidth
          onChange={this.handleSelectChange("userCountry")}
          options={this.renderCountryOptions(restrictedCountries)}
          value={userCountry}
        />
        {renderTerms}
        {renderError}
        <div styleName="button">
          <Button
            size="medium"
            theme="primary"
            onClick={this.handleSubmit}
            disabled={!this.handleFormValidity() || isLoading}
            type="submit">
            {renderLoader}
          </Button>
        </div>
      </form>
    );
  }
}
RegisterForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  error: PropTypes.number,
};
RegisterForm.defaultProps = {
  error: null,
};
export default compose(
  connect(state => ({ profile: state.profile, ln: state.language })),
)(RegisterForm);
