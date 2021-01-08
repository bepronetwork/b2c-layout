import React, { useEffect, useCallback, createRef } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { KYC_IN_REVIEW } from "../../config/kycStatus";
import Cache from "../../lib/cache/cache";

const MatiButton = ({ profile, ...props }) => {
  const button = createRef(null);
  const handleLoaded = useCallback(() => {}, []);
  const handleExited = useCallback(() => {}, []);
  const handleFinished = useCallback(() => {
    profile.updateKYCStatus(KYC_IN_REVIEW);
    Cache.setToCache("kyc", { status: KYC_IN_REVIEW });
  }, []);

  useEffect(() => {
    const ref = button.current;

    if (ref) {
      ref.addEventListener("mati:loaded", handleLoaded);
      ref.addEventListener("mati:userFinishedSdk", handleFinished);
      ref.addEventListener("mati:exitedSdk", handleExited);
    }

    return () => {
      if (ref) {
        ref.removeEventListener("mati:loaded", handleLoaded);
        ref.removeEventListener("mati:userFinishedSdk", handleFinished);
        ref.removeEventListener("mati:exitedSdk", handleExited);
      }
    };
  }, [button, handleLoaded, handleFinished, handleExited]);

  return <mati-button ref={button} {...props} />;
};

MatiButton.propTypes = {
  profile: PropTypes.objectOf(
    PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
      PropTypes.func,
      PropTypes.bool,
      PropTypes.object,
    ]),
  ).isRequired,
};

export default connect(({ profile }) => ({ profile }))(MatiButton);
