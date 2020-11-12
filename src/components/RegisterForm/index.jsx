import React, { Component } from "react";
import PropTypes from "prop-types";
import { Button, Typography, InputText, Checkbox, Toggle, SelectBox } from "components";
import { connect } from "react-redux";
import { compose } from 'lodash/fp';
import Cache from "../../lib/cache/cache";
import { CopyText } from '../../copy';
import { getAppCustomization, getApp } from "../../lib/helpers";
import loading from 'assets/loading-circle.gif';
import generateMonths from "../../utils/generateMonths";
import generateIntegers from "../../utils/generateIntegers";
import leadingWithZero from "../../utils/leadingWithZero";
import moment from "moment";
import { countries } from "countries-list"; 
import "./index.css";

class RegisterForm extends Component {
    static propTypes = {
        onSubmit: PropTypes.func.isRequired,
        error: PropTypes.number
    };

    static defaultProps = {
        error: null
    };

    constructor({ ln, ...props }) {
        super(props);
        const copy = CopyText.registerFormIndex[ln];
        
        this.state = {
            username: "",
            password: "",
            email: "",
            emailValid: false,
            isLoading: false,
            isConfirmed: false,
            terms: null,
            month: { text: copy.INDEX.INPUT_TEXT.LABEL[7] },
            day: { text: copy.INDEX.INPUT_TEXT.LABEL[6] },
            year: { text: copy.INDEX.INPUT_TEXT.LABEL[8] },
            restrictedCountries: [],
            userCountry: { text: copy.INDEX.INPUT_TEXT.LABEL[9] }
        };
    }

    componentDidMount = async () => {
        const { restrictedCountries } = await getApp();

        this.projectData(this.props)
        this.setState({ restrictedCountries });
    }

    componentWillReceiveProps(props){
        this.projectData(props);
    }

    projectData = async (props) => {
        const { ln } = props;
        const { footer } = await getAppCustomization();
        const supportLinks = footer.languages.find(f => f.language.isActivated === true && f.language.prefix === ln.toUpperCase()).supportLinks;
        const terms = supportLinks.find(s => { return s.name.trim().toLowerCase() === "terms of service"});

        this.setState({ terms });
    }

    handleSubmit = async event => {
        const { username, password, email, day, month, year, userCountry } = this.state;
        const birthDate = moment(`${year.value}-${month.value}-${day.value}`).format("L")
        this.setState({...this.state, isLoading : true });

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

        this.setState({...this.state, isLoading : false});
    };

    formIsValid = () => {
        const { password, username, emailValid, isConfirmed, terms, userCountry, day, month, year } = this.state;

        return (
        username !== "" &&
        emailValid &&
        password !== "" &&
        day.value &&
        month.value &&
        year.value && 
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
        console.log(month, day, year)
 
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
            <Typography color="grey" variant="small-body" otherStyles={{ marginTop: 16}}>
                Birth Date
            </Typography>
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
                    options={generateMonths(ln, "MMM").map((monthToObj, index) => ({
                        text: monthToObj,
                        value: leadingWithZero(index),
                        channel_id: monthToObj
                    }))}
                    value={month}
                />
                <SelectBox
                    onChange={event => this.onYearChange(event)}
                    options={generateIntegers(1930, 2002).map(yearToObj => ({
                        text: yearToObj,
                        value: yearToObj,
                        channel_id: yearToObj
                    }))}
                    value={year}
                />
            </div>
            <SelectBox
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
                                skin.skin_type == "digital" 
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
                        <img src={loading} />
                    :
                        <Typography color={skin.skin_type == "digital" ? 'secondary' : 'fixedwhite'}>{copy.INDEX.TYPOGRAPHY.TEXT[0]}</Typography>
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
