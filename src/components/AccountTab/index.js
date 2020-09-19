import React from "react";
import { connect } from "react-redux";
import { Typography, Button } from "components";
import { find } from "lodash";
import Cache from "../../lib/cache/cache";
import { isUserSet, getAppCustomization } from "../../lib/helpers";
import { CopyText } from "../../copy";
import "./index.css";

const defaultState = {
  username: "",
  email: "",
  clientId: "",
  flowId: ""
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
    this.getAppIntegration();
  }

  componentWillReceiveProps(props) {
    this.projectData(props);
  }

  getAppIntegration = () => {
    const appInfo = Cache.getFromCache("appInfo");
    const kycIntegration = appInfo.integrations.kyc;

    this.setState({
      clientId: kycIntegration.clientid,
      flowId: kycIntegration.flowId
    });
    console.log(kycIntegration.flowId);
  };

  projectData = props => {
    const { profile } = props;

    if (!isUserSet(profile)) {
      return null;
    }

    const id = profile.getID();
    const username = profile.getUsername();
    const email = profile.user.email
      ? profile.user.email
      : profile.user.user.email;
    const avatar = null;

    this.setState({ ...this.state, id, username, avatar, email });
  };

  render() {
    const { ln, onLogout } = this.props;
    const { username, email, id, clientId, flowId } = this.state;
    const copy = CopyText.registerFormIndex[ln];
    const copyLogout = CopyText.userMenuIndex[ln];
    const skin = getAppCustomization().skin.skin_type;
    console.log("OLHA AQUI " + flowId)

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
              {id}
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
        <mati-button clientid={clientId} flowId={flowId} metadata={{ id }} />
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
