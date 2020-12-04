import React, { useEffect, useCallback } from "react";
import { connect } from "react-redux";
import { KYC_IN_REVIEW } from "../../config/kycStatus";
import Cache from "../../lib/cache/cache";

function MatiButton(props) {
  const button = React.createRef(null);

  const handleLoaded = useCallback(() => {}, []);

  const handleFinished = useCallback(() => {
    const { profile } = props;

    profile.updateKYCStatus(KYC_IN_REVIEW);
    Cache.setToCache("kyc", { status: KYC_IN_REVIEW });
  }, []);

  const handleExited = useCallback(() => {}, []);

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
}

function mapStateToProps({ profile }) {
  return {
    profile
  };
}

export default connect(mapStateToProps)(MatiButton);
