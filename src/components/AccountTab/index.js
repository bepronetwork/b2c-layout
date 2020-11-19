import React from "react";
import { connect } from "react-redux";
import { Typography, Button } from "components";
import ReactCountryFlag from "react-country-flag";
import Cache from "../../lib/cache/cache";
import { isUserSet, getAppCustomization } from "../../lib/helpers";
import { CopyText } from "../../copy";
import "./index.css";
import classNames from 'classnames';
import { CircularProgress } from "@material-ui/core";
import { KYC_IN_REVIEW } from "../../config/kyc";

const defaultState = {
  username: "",
  email: "",
  country: {},
  birthDate: "",
  clientId: "",
  flowId: "",
  isKycStatus: null
};
// const cache = new Cache({
//   // Keep cached source failures for up to 7 days
//   sourceTTL: 7 * 24 * 3600 * 1000,
//   // Keep a maximum of 20 entries in the source cache
//   sourceSize: 20
// });

class AccountTab extends React.Component {

  constructor(props) {
    super(props);
    this.state = defaultState;
    this.handleKycVerification = this.handleKycVerification.bind(this);
  }

  componentDidMount() {
    this.projectData(this.props);
  }

  componentWillReceiveProps(props) {
    this.projectData(props);
  }

  projectData = async props => {
    const { profile } = props;
    const appInfo = Cache.getFromCache("appInfo");
    const isKycOnStorage = Cache.getFromCache("kyc");

    if (!isUserSet(profile)) {
      return null;
    }

    const kycIntegration = appInfo.integrations.kyc;
    const isKycStatus = isKycOnStorage
      ? isKycOnStorage.status
      : await profile.kycStatus();
    const userId = profile.getID();
    const username = profile.getUsername();
    const country = profile.getCountry();
    const birthDate = profile.getBirthDate();
    const email = profile.user.email
      ? profile.user.email
      : profile.user.user.email;
    const avatar = null;

    this.setState({
      ...this.state,
      userId,
      username,
      country,
      birthDate,
      avatar,
      email,
      isKycActive: kycIntegration.isActive,
      clientId: kycIntegration.clientId,
      flowId: kycIntegration.flowId,
      isKycStatus:
        isKycStatus === null ? isKycStatus : isKycStatus.toLowerCase()
    });
    this.caseKycStatus();
  };

  caseKycStatus = () => {
    const { isKycStatus, clientId, flowId, userId } = this.state;
    const { ln } = this.props;
    const copy = CopyText.registerFormIndex[ln];

    switch (isKycStatus) {
      case "no kyc":
        return (
          <mati-button
            clientid={clientId}
            flowId={flowId}
            metadata={`{"id": "${userId}"}`}
          />
        );
      case "reviewneeded":
        return (
          <Typography variant="small-body" color="orange">
            {copy.INDEX.TYPOGRAPHY.TEXT[2]}
          </Typography>
        );
      case "rejected":
        return (
          <Typography variant="small-body" color="red">
            {copy.INDEX.TYPOGRAPHY.TEXT[3]}
          </Typography>
        );
      case "verified":
        return (
          <Typography variant="small-body" color="green">
            {copy.INDEX.TYPOGRAPHY.TEXT[1]}
          </Typography>
        );
      case "country not allowed":
        return (
          <Typography variant="small-body" color="white">
            {copy.INDEX.TYPOGRAPHY.TEXT[6]}
          </Typography>
        );
      case "country other than registration":
        return (
          <Typography variant="small-body" color="white">
            {copy.INDEX.TYPOGRAPHY.TEXT[7]}
          </Typography>
        );
      case "different birthday data":
        return (
          <Typography variant="small-body" color="white">
            {copy.INDEX.TYPOGRAPHY.TEXT[8]}
          </Typography>
        );
      case KYC_IN_REVIEW:
        return (
          <>
            <CircularProgress size={24} style={{ marginRight: 16 }} />
            <Typography variant="small-body" color="white">
              KYC in review
            </Typography>
          </>
        );
      case null:
        return (
          <mati-button
            clientid={clientId}
            flowId={flowId}
            metadata={`{"id": "${userId}"}`}
          />
        );
      default:
        break;
    }
  };

  handleKycVerification = () => {
    const { profile } = this.props;

    profile.updateKYCStatus(KYC_IN_REVIEW);
    Cache.setToCache("kyc", { status: KYC_IN_REVIEW });
  }

  render() {
    const { ln, onLogout } = this.props;
    const { username, email, userId, isKycStatus, isKycActive, country, birthDate } = this.state;
    const copy = CopyText.registerFormIndex[ln];
    const copyLogout = CopyText.userMenuIndex[ln];
    const skin = getAppCustomization().skin.skin_type;
    const noKyc = isKycStatus === "no kyc" || isKycStatus === null;
    const isKycVerifying = isKycStatus === "kyc in review";

    return (
      <div styleName={`box ${skin == "digital" ? "box-digital-kyc" : "background-kyc"}`}>
        <div styleName="field">
            <div styleName="label">
              <Typography variant="small-body" color="white">
                {copy.INDEX.INPUT_TEXT.LABEL[4]}
              </Typography>
            </div>
            <div styleName="value">
              <Typography variant="small-body" color="white">
                {userId}
              </Typography>
            </div>
          </div>
          <div styleName="field">
            <div styleName="label">
              <Typography variant="small-body" color="white">
                {copy.INDEX.INPUT_TEXT.LABEL[0]}
              </Typography>
            </div>
            <div styleName="value">
              <Typography variant="small-body" color="white">
                @{username}
              </Typography>
            </div>
          </div>
          <div styleName="field">
            <div styleName="label">
              <Typography variant="small-body" color="white">
                {copy.INDEX.INPUT_TEXT.LABEL[3]}
              </Typography>
            </div>
            <div styleName="value">
              <Typography variant="small-body" color="white">
                {email}
              </Typography>
            </div>
          </div>
          {birthDate && (
            <div styleName="field">
              <div styleName="label">
                <Typography variant="small-body" color="white">
                {copy.INDEX.TYPOGRAPHY.TEXT[4]}
                </Typography>
              </div>
              <div styleName="value">
                <Typography variant="small-body" color="white">
                  {birthDate}
                </Typography>
              </div>
            </div>
          )}
          {country.text && (
            <div styleName="field">
              <div styleName="label">
                <Typography variant="small-body" color="white">
                  {copy.INDEX.INPUT_TEXT.LABEL[9]}
                </Typography>
              </div>
              <div styleName="value flex">
                <ReactCountryFlag
                    svg
                    countryCode={country.value}
                    style={{
                        width: '24px',
                        height: '24px',
                        marginRight: '16px'
                    }} 
                  />
                <Typography variant="small-body" color="white">
                  {country.text}
                </Typography>
              </div>
            </div>
          )}
          {
            isKycActive ? 
              <div styleName='field background-kyc-digital'>
                <div styleName='label flex-kyc'>
                  <Typography variant="small-body" color="white">
                    {copy.INDEX.INPUT_TEXT.LABEL[5]}
                  </Typography>
                </div>
                <div styleName={classNames("value", { "flex": isKycVerifying })} onClick={noKyc ? this.handleKycVerification : null}>
                  {this.caseKycStatus()}
                </div>
              </div>
            : null
          }
          <div styleName="button" onClick={onLogout}>
            <Button size="x-small" theme="primary">
              <Typography
                color={skin == "digital" ? "secondary" : "fixedwhite"}
                variant="small-body"
              >
                {copyLogout.INDEX.TYPOGRAPHY.TEXT[2]}
              </Typography>
            </Button>
          </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    profile: state.profile,
    ln: state.language
  };
}

export default connect(mapStateToProps)(AccountTab);
