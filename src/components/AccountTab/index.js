import React from "react";
import { connect } from "react-redux";
import { Typography, Button } from "components";
import Cache from "../../lib/cache/cache";
import { isUserSet, getAppCustomization } from "../../lib/helpers";
import { CopyText } from "../../copy";
import "./index.css";

const defaultState = {
  username: "",
  email: "",
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
    const email = profile.user.email
      ? profile.user.email
      : profile.user.user.email;
    const avatar = null;

    this.setState({
      ...this.state,
      userId,
      username,
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
          <div>
            <mati-button
              clientid={clientId}
              flowId={flowId}
              metadata={`{"id": "${userId}"}`}
            />
          </div>
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

      case null:
        return (
          <Typography variant="small-body" color="red">
            {"ERROR TO GET STATUS"}
          </Typography>
        );
      default:
        break;
    }
  };

  render() {
    const { ln, onLogout } = this.props;
    const { username, email, userId, isKycStatus, isKycActive } = this.state;
    const copy = CopyText.registerFormIndex[ln];
    const copyLogout = CopyText.userMenuIndex[ln];
    const skin = getAppCustomization().skin.skin_type;

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
        {
          isKycActive ? 
            <div styleName={`field ${skin == "digital" ? "background-kyc-digital" : "background-kyc"}`}>
              <div styleName={`label ${isKycStatus === "no kyc" ? "flex-kyc" : "label"}`}>
                <Typography variant="small-body" color="white">
                  {copy.INDEX.INPUT_TEXT.LABEL[5]}
                </Typography>
              </div>
              <div styleName="value">{this.caseKycStatus()}</div>
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
