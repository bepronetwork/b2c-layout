import React from "react";
import { connect } from "react-redux";
import { Typography, Button } from "components";
import moment from "moment";
import ReactCountryFlag from "react-country-flag";
import Cache from "../../lib/cache/cache";
import { isUserSet, getAppCustomization } from "../../lib/helpers";
import { CopyText } from "../../copy";
import "./index.css";

const defaultState = {
  username: "",
  email: "",
  userCountry: {},
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

    if (!isUserSet(profile)) {
      return null;
    }

    const kycIntegration = appInfo.integrations.kyc;
    const isKycStatus = await profile.kycStatus();
    const userId = profile.getID();
    const username = profile.getUsername();
    const userCountry = await profile.getUserCountry();
    const birthDate = await profile.getBirthDate();
    const email = profile.user.email
      ? profile.user.email
      : profile.user.user.email;
    const avatar = null;

    this.setState({
      ...this.state,
      userId,
      username,
      userCountry,
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
          <div styleName="value">
            <mati-button
              clientid={clientId}
              flowId={flowId}
              metadata={`{"id": "${userId}"}`}
            />
          </div>
        );
      case "reviewneeded":
        return (
          <div styleName="value">
            <Typography variant="small-body" color="orange">
              {copy.INDEX.TYPOGRAPHY.TEXT[2]}
            </Typography>
          </div>
        );
      case "rejected":
        return (
          <div styleName="value">
            <Typography variant="small-body" color="red">
              {copy.INDEX.TYPOGRAPHY.TEXT[3]}
            </Typography>
          </div>
        );
      case "verified":
        return (
          <div styleName="value">
            <Typography variant="small-body" color="green">
              {copy.INDEX.TYPOGRAPHY.TEXT[1]}
            </Typography>
          </div>
        );

      case null:
        return (
          <div styleName="value">
            <mati-button
              clientid={clientId}
              flowId={flowId}
              metadata={`{"id": "${userId}"}`}
            />
          </div>
        );
      default:
        break;
    }
  };

  render() {
    const { ln, onLogout } = this.props;
    const { username, email, userId, isKycStatus, isKycActive, userCountry, birthDate } = this.state;
    const copy = CopyText.registerFormIndex[ln];
    const copyLogout = CopyText.userMenuIndex[ln];
    const skin = getAppCustomization().skin.skin_type;

    console.log(userCountry, 'userCountry')

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
        {userCountry.text && (
          <div styleName="field">
            <div styleName="label">
              <Typography variant="small-body" color="white">
                {copy.INDEX.INPUT_TEXT.LABEL[9]}
              </Typography>
            </div>
            <div styleName="value field-label-country">
              <ReactCountryFlag
                  svg
                  countryCode={userCountry.value}
                  style={{
                      width: '24px',
                      height: '24px',
                      marginRight: '16px'
                  }} 
                />
              <Typography variant="small-body" color="white">
                {userCountry.text}
              </Typography>
            </div>
          </div>
        )}
        {
          isKycActive ? 
            <div styleName={`field ${isKycStatus === "no kyc" || isKycStatus === null ? "background-kyc-digital" : "background-kyc-digital"}`}>
              <div styleName={`label ${isKycStatus === "no kyc" || isKycStatus === null ? "flex-kyc " : "flex-kyc"}`}>
                <Typography variant="small-body" color="white">
                  {copy.INDEX.INPUT_TEXT.LABEL[5]}
                </Typography>
              </div>
              {this.caseKycStatus()}
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
