import React, { Component } from "react";
import PropTypes from "prop-types";
import { Button, Typography, InputText, Checkbox, Toggle, Select } from "components";
import { connect } from "react-redux";
import { compose } from 'lodash/fp';
import Cache from "../../lib/cache/cache";
import { CopyText } from '../../copy';
import { getAppCustomization, getApp } from "../../lib/helpers";
import loading from 'assets/loading-circle.gif';
import generateMonths from "../../utils/generateMonths";
import generateIntegers from "../../utils/generateIntegers";
import leadingWithZero from "../../utils/leadingWithZero";
import { countries } from "countries-list"; 
import "./index.css";
import getYearsAgo from '../../utils/getYearsAgo';
import stringToNumber from '../../utils/stringToNumber';
import checkAge from "../../utils/checkAge";

const propTypes = {
    onSubmit: PropTypes.func.isRequired,
    error: PropTypes.number
}

const defaultProps = {
    error: null
}

class RegisterForm extends Component {
    constructor({ ln }) {
        super();
        
        this.copy = CopyText.registerFormIndex[ln];
        this.state = {
            username: "",
            password: "",
            email: "",
            emailValid: false,
            isLoading: false,
            isConfirmed: false,
            terms: null,
            month: { text: this.copy.INDEX.INPUT_TEXT.LABEL[7] },
            day: { text: this.copy.INDEX.INPUT_TEXT.LABEL[6] },
            year: { text: this.copy.INDEX.INPUT_TEXT.LABEL[8] },
            restrictedCountries: [],
            userCountry: { text: this.copy.INDEX.INPUT_TEXT.LABEL[9] }
        }
    }

    componentDidMount() {
        this.projectData(this.props);
    }

    projectData = async ({ ln }) => {
        const { restrictedCountries } = await getApp();
        const { footer: { languages } } = await getAppCustomization();
        const { supportLinks } = languages.find(({ language: { isActivated, prefix } }) => isActivated && prefix === ln.toUpperCase());
        const terms = supportLinks.find(({ name }) => name.trim().toLowerCase() === "terms of service");
 
        this.setState({ terms, restrictedCountries });
    }

    handleSubmit = async event => {
        const { username, password, email, day, month, year, userCountry } = this.state;
        const birthDate = `${year.value}-${month.value}-${day.value}`;
        this.setState({ isLoading : true });

        event.preventDefault();
        const { onSubmit } = this.props;
        const affiliateLink = Cache.getFromCache('affiliate');
        if (onSubmit && this.formIsValid()) {
            await onSubmit({
                username,
                password,
                email,
                birthDate,
                affiliateLink,
                userCountry
              });
        }

        this.setState({ isLoading : false});
    };

    formIsValid = () => {
        const { password, username, emailValid, isConfirmed, terms, userCountry, day, month, year } = this.state;
        const birthDate = `${year.value}-${month.value}-${day.value}`;

        return (
        username !== "" &&
        emailValid &&
        password !== "" &&
        checkAge(birthDate) && 
        userCountry.value && 
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

    onDayChange = ({ option }) => {
        this.setState({ day: option });
    };

    onMonthChange = ({ option }) => {
        this.setState({ month: option });
    };
    
    onYearChange = ({ option }) => {
        this.setState({ year: option });
    };

    onCountryChange = ({ option }) => {
        this.setState({ userCountry: option });
    };

    onHandlerConfirm() {
        const { isConfirmed } = this.state;

        this.setState({ isConfirmed : !isConfirmed });
    }

    availableCountries = () => {
        const { restrictedCountries } = this.state;
        const countriesEntries = [];
    
        Object.entries(countries).forEach(([key, value]) => {
          return countriesEntries.push({
            country: key,
            data: value
          });
        });
    
        const availableCountries = countriesEntries.filter(
          ({ country }) => !restrictedCountries.includes(country)
        );
    
        return availableCountries;
      };

    render() {
        const { error } = this.props;
        const { username, password, email, isLoading, isConfirmed, terms, month, day, year, userCountry } = this.state;
        const {ln} = this.props;
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
                maxLength={12}
            />
            </div>
            <div styleName="password">
            <InputText
                name="password"
                type="password"
                placeholder={copy.INDEX.INPUT_TEXT.LABEL[1]}
                onChange={this.onChange}
                value={password}
                maxLength={15}
            />
            </div>
            <InputText
                name="email"
                placeholder={copy.INDEX.INPUT_TEXT.LABEL[3]}
                onChange={this.onEmailChange}
                value={email}
                maxLength={25}
            />
            <Typography weight="semi-bold" color="white" otherStyles={{ marginTop: 16, opacity: '0.5' }}>
                {copy.INDEX.TYPOGRAPHY.TEXT[4]}
            </Typography>
            <div styleName="birth-fields">
                <Select
                    onChange={event => this.onDayChange(event)}
                    options={generateIntegers(0, 30).map(dayToObj => ({
                        text: leadingWithZero(dayToObj),
                        value: leadingWithZero(dayToObj),
                        channel_id: leadingWithZero(dayToObj) 
                    }))}
                    value={day}
                />
                <Select
                    onChange={event => this.onMonthChange(event)}
                    options={generateMonths(ln, "MMM").map((monthToObj, index) => ({
                        text: monthToObj,
                        value: leadingWithZero(index),
                        channel_id: monthToObj
                    }))}
                    value={month}
                />
            </div>
            <Select
                gutterBottom
                fullWidth
                onChange={event => this.onYearChange(event)}
                options={generateIntegers(stringToNumber(getYearsAgo(72)), stringToNumber(getYearsAgo(18)), true).map(yearToObj => ({
                    text: yearToObj,
                    value: yearToObj,
                    channel_id: yearToObj
                }))}
                value={year}
            />
            <Typography weight="semi-bold" color="white" otherStyles={{ margin: "0 0 8px 0", opacity: '0.5' }}>
                {copy.INDEX.TYPOGRAPHY.TEXT[5]}
            </Typography>
            <Select
                fullWidth
                onChange={event => this.onCountryChange(event)}
                options={this.availableCountries().map(({ country, data }) => ({
                    text: data.name,
                    value: country,
                    channel_id: country
                }))}
                value={userCountry}
            />
            {
            terms 
            ?
                <div styleName="agree">
                    <div styleName="agree-main">
                        <div>
                            {
                                skin.skin_type === "digital" 
                                ?
                                    <Toggle id={'isConfirmed'} checked={isConfirmed} onChange={() => this.onHandlerConfirm()} showText={false}/>
                                :
                                    <Checkbox onClick={() => this.onHandlerConfirm()} isSet={isConfirmed} id={'isConfirmed'}/>
                            }
                        </div>
                        <div styleName="agree-right">
                            <Typography color="white" variant="x-small-body">
                                I Agree with the <a href={terms.href} target={'_blank'}> Terms & Conditions </a>
                            </Typography>
                        </div>
                    </div>
                </div>
            :
                null
            }
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
                        <img src={loading} alt="Loading" />
                    :
                        <Typography color={skin.skin_type === "digital" ? 'secondary' : 'fixedwhite'}>{copy.INDEX.TYPOGRAPHY.TEXT[0]}</Typography>
                }
            </Button>
            </div>
        </form>
        );
    }
}

RegisterForm.propTypes = propTypes;
RegisterForm.defaultProps = defaultProps;

function mapStateToProps(state){
    return {
        ln : state.language
    };
}

export default compose(connect(mapStateToProps))(RegisterForm);
