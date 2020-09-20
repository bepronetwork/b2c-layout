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
  isKycAccountActive: false,
  isKycActive: false
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
    this.getAppIntegration(this.props);
  }

  componentWillReceiveProps(props) {
    this.projectData(props);
  }

  getAppIntegration = props => {
    const { profile } = props;

    const appInfo = Cache.getFromCache("appInfo");
    const kycIntegration = appInfo.integrations.kyc;

    this.setState({
      clientId: kycIntegration.clientId,
      flowId: kycIntegration.flowId,
      isKycAccountActive:  profile.user.isActive,
      isKycActive: kycIntegration.isActive
    });
  };

  projectData = props => {
    const { profile } = props;

    if (!isUserSet(profile)) {
      return null;
    }

    const userId = profile.getID();
    const username = profile.getUsername();
    const email = profile.user.email
      ? profile.user.email
      : profile.user.user.email;
    const avatar = null;

    this.setState({ ...this.state, userId, username, avatar, email });
  };

  render() {
    const { ln, onLogout } = this.props;
    const {
      username,
      email,
      userId,
      clientId,
      flowId,
      isKycAccountActive,
      isKycActive
    } = this.state;
    const copy = CopyText.registerFormIndex[ln];
    const copyLogout = CopyText.userMenuIndex[ln];
    const skin = getAppCustomization().skin.skin_type;

    return (
      <div styleName="box">
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
        {isKycActive === false ? null : (
          <div styleName="field">
            <div styleName="label">
              <Typography variant="small-body" color="white">
                {copy.INDEX.INPUT_TEXT.LABEL[5]}
              </Typography>
            </div>
            <div styleName="value">
              {isKycAccountActive ? (
                <Typography variant="small-body" color="green">
                  {copy.INDEX.TYPOGRAPHY.TEXT[1]}
                </Typography>
              ) : (
                <div>
                  <mati-button
                    clientid={clientId}
                    flowId={flowId}
                    metadata={{ user_id: userId }}
                  />
                </div>
              )}
            </div>
          </div>
        )}
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
