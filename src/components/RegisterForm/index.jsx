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
import "./index.css";
import getYearsAgo from '../../utils/getYearsAgo';
import { isValidAge, isValidCountries, isValidEmail } from "../../utils/isValid";

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
        event.preventDefault();
		this.setState({ isLoading: true });
		const { username, password, email, day, month, year, userCountry } = this.state;
        const birthDate = `${year.value}-${month.value}-${day.value}`;
        const { onSubmit } = this.props;
    	const affiliateLink = Cache.getFromCache("affiliate");


        if (onSubmit && this.handleFormValidity()) {
            await onSubmit({
                username,
                password,
                email,
                birthDate,
                affiliateLink,
                userCountry
              });
        }

    	this.setState({ isLoading: false });
    };

    handleFormValidity = () => {
        const { password, username, email, isConfirmed, terms, userCountry, day, month, year } = this.state;

        return (
            username !== "" &&
            isValidEmail(email) &&
            password !== "" &&
            isValidAge(`${year.value}-${month.value}-${day.value}`) && 
            userCountry.value && 
            (!terms || isConfirmed === true)
        );
    };

    handleTextChange = event => {
        this.setState({ [event.target.name]: event.target.value });
    };

    handleSelectChange = props => ({ option }) => {
        this.setState({ [props]: option });
    };

    handleConfirm = () => {
        const { isConfirmed } = this.state;

        this.setState({ isConfirmed : !isConfirmed });
    }

  renderCountryOptions = () => {
      const { restrictedCountries } = this.state;

    return isValidCountries(restrictedCountries).map(({ country, data }) => ({
      text: data.name,
      value: country,
      channel_id: country
    }));
  };

  renderYearOptions = () =>
    generateIntegers({
      from: getYearsAgo(72),
      to: getYearsAgo(18),
      descend: true
    }).map(year => ({ text: year, value: year, channel_id: year }));

  renderMonthOptions = () => {
    const { ln } = this.props;

    return generateMonths(ln, "MMM").map((month, index) => ({
      text: month,
      value: leadingWithZero(index),
      channel_id: month
    }));
  }

  renderDayOptions = () =>
    generateIntegers({ from: 0, to: 30 }).map(day => ({
      text: leadingWithZero(day),
      value: leadingWithZero(day),
      channel_id: leadingWithZero(day)
    }));

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
                maxlength={25}
            />
            <Typography weight="semi-bold" color="white" otherStyles={{ marginTop: 16, opacity: '0.5' }}>
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
                    options={this.renderMonthOptions({ language: ln })}
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
            <Typography weight="semi-bold" color="white" otherStyles={{ margin: "0 0 8px 0", opacity: '0.5' }}>
                {copy.INDEX.TYPOGRAPHY.TEXT[5]}
            </Typography>
            <Select
                fullWidth
                onChange={this.handleSelectChange("userCountry")}
                options={this.renderCountryOptions()}
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
                                    <Toggle id={'isConfirmed'} checked={isConfirmed} onChange={() => this.handleConfirm()} showText={false}/>
                                :
                                    <Checkbox onClick={() => this.handleConfirm()} isSet={isConfirmed} id={'isConfirmed'}/>
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
                disabled={!this.handleFormValidity() || isLoading}
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
