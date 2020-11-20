import React from "react";
import { Typography } from "components";
import { CircularProgress } from "@material-ui/core";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { CopyText } from "../../copy";
import MatiButton from "../MatiButton";
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

const KycStatus = ({ isKycStatus, clientId, flowId, userId, ln }) => {
  const copy = CopyText.registerFormIndex[ln];

  switch (isKycStatus) {
    case NO_KYC:
      return (
        <MatiButton
          clientid={clientId}
          flowId={flowId}
          metadata={`{"id": "${userId}"}`}
        />
      );
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
      return (
        <MatiButton
          clientid={clientId}
          flowId={flowId}
          metadata={`{"id": "${userId}"}`}
        />
      );
    default:
      break;
  }

  return null;
};

KycStatus.propTypes = {
  isKycStatus: PropTypes.string,
  clientId: PropTypes.string.isRequired,
  flowId: PropTypes.string.isRequired,
  userId: PropTypes.string.isRequired,
  ln: PropTypes.string.isRequired
};

KycStatus.defaultProps = {
  isKycStatus: NO_KYC
};

function mapStateToProps({ language }) {
  return {
    ln: language
  };
}

export default connect(mapStateToProps)(KycStatus);
