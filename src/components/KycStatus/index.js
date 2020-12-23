import React, { Component } from "react";
import { Typography, MatiButton } from "components";
import { CircularProgress } from "@material-ui/core";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { CopyText } from "../../copy";
import {
  KYC_COUNTRY_NOT_ALLOWED,
  KYC_INCONSISTENT_BIRTHDATE,
  KYC_INCONSISTENT_COUNTRY,
  KYC_IN_REVIEW,
  KYC_REJECTED,
  KYC_REVIEW_NEEDED,
  KYC_VERIFIED,
  NO_KYC
} from "../../config/kycStatus";
import Cache from "../../lib/cache/cache";

class KycStatus extends Component {
  static propTypes = {
    ln: PropTypes.string.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      clientId: "",
      flowId: "",
      userId: "",
      status: null
    };
  }

  componentDidMount() {
    this.projectData(this.props);
  }

  UNSAFE_componentWillReceiveProps(props) {
    this.projectData(props);
  }

  projectData = async props => {
    const { profile } = props;
    const isKycOnStorage = Cache.getFromCache("kyc");
    const appInfo = Cache.getFromCache("appInfo");
    const kycIntegration = appInfo.integrations.kyc;
    const status = isKycOnStorage
      ? isKycOnStorage.status
      : await profile.kycStatus();
    const userId = profile.getID();

    this.setState({
      userId,
      clientId: kycIntegration.clientId,
      flowId: kycIntegration.flowId,
      status: status === null ? status : status.toLowerCase()
    });
  };

  render() {
    const { ln } = this.props;
    const { status, clientId, flowId, userId } = this.state;
    const copy = CopyText.registerFormIndex[ln];

    const matiButton = () => (
      <MatiButton
        clientid={clientId}
        flowId={flowId}
        metadata={`{"id": "${userId}"}`}
      />
    );

    switch (status) {
      case NO_KYC:
        return matiButton();
      case KYC_REVIEW_NEEDED:
        return (
          <Typography variant="small-body" color="orange">
            {copy.INDEX.TYPOGRAPHY.TEXT[2]}
          </Typography>
        );
      case KYC_REJECTED:
        return (
          <Typography variant="small-body" color="red">
            {copy.INDEX.TYPOGRAPHY.TEXT[3]}
          </Typography>
        );
      case KYC_VERIFIED:
        return (
          <Typography variant="small-body" color="green">
            {copy.INDEX.TYPOGRAPHY.TEXT[1]}
          </Typography>
        );
      case KYC_COUNTRY_NOT_ALLOWED:
        return (
          <Typography variant="small-body" color="white">
            {copy.INDEX.TYPOGRAPHY.TEXT[6]}
          </Typography>
        );
      case KYC_INCONSISTENT_COUNTRY:
        return (
          <Typography variant="small-body" color="white">
            {copy.INDEX.TYPOGRAPHY.TEXT[7]}
          </Typography>
        );
      case KYC_INCONSISTENT_BIRTHDATE:
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
              {copy.INDEX.TYPOGRAPHY.TEXT[9]}
            </Typography>
          </>
        );
      case null:
        return matiButton();
      default:
        break;
    }

    return null;
  }
}

const mapStateToProps = ({ language, profile }) => ({
  profile,
  ln: language
});

export default connect(mapStateToProps)(KycStatus);
