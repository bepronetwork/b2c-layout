// Source https://github.com/MatiFace/mati-web-button
import React, { useEffect, useCallback } from "react";
import { connect } from "react-redux";
import { KYC_IN_REVIEW } from "../../config/kyc";
import Cache from "../../lib/cache/cache";

function MatiButton(props) {
  const button = React.createRef(null);

  // When user loads its modal fires this.
  const handleLoaded = useCallback(() => {}, []);

  // When user sends their info fires this.
  const handleFinished = useCallback(() => {
    const { profile } = props;

    profile.updateKYCStatus(KYC_IN_REVIEW);
    Cache.setToCache("kyc", { status: KYC_IN_REVIEW });
  }, []);

  // When user closes its modal fires this.
  const handleExited = useCallback(() => {}, []);

  useEffect(() => {
    const ref = button.current;

    if (ref) {
      // subscribe to callbacks
      ref.addEventListener("mati:loaded", handleLoaded);
      ref.addEventListener("mati:userFinishedSdk", handleFinished);
      ref.addEventListener("mati:exitedSdk", handleExited);
    }

    return () => {
      if (ref) {
        // unsubscribe from callbacks
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
