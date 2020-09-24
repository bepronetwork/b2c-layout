import React from "react";
import { connect } from "react-redux";
import {
  Tabs,
  DepositForm,
  WithdrawForm,
  Typography,
  Button,
  EmailIcon
} from "components";
import { Col, Row } from "reactstrap";
import _ from "lodash";
import CloseCross from "components/Icons/CloseCross";

import PaymentBox from "../PaymentBox";
import DepositList from "./DepositList";
import WithdrawList from "./WithdrawList";
import CreditCard from "assets/icons/credit-card.png"
import { CopyText } from "../../copy";
import { getApp, getAppCustomization,  getIcon } from "../../lib/helpers";
import { setMessageNotification } from "../../redux/actions/message";
import store from "../../containers/App/store";
import "./index.css";

const defaultState = {
  tab: "deposit",
  wallets: [],
  wallet: null,
  isEmailConfirmed: false,
  isConfirmationSent: false,
  onOpenMoonpay: false,
  isMoonpayActive: null,
  colorHexCode: null,
  clientId: "",
  flowId: "",
  isKycNeeded: null,
  onClose: false
};

class WalletTab extends React.Component {
  constructor(props) {
    super(props);
    this.state = defaultState;
  }

  async componentDidMount(){
    const { isCurrentPath } = this.props;

    if (isCurrentPath) {
        this.projectData(this.props);
    }
}
  componentWillReceiveProps(props) {
    const { isCurrentPath } = props;

    if (props !== this.props && isCurrentPath) {
      this.projectData(props);
    }
  }

  onCloseTab = () => {
    this.setState({ onClose: true, tab: "deposit" });
}

  projectData = async props => {
    const { profile } = this.props;
    let { wallet } = this.state;

    const isKycStatus = await profile.kycStatus();
    const kycIntegration = getApp().integrations.kyc;
    const moonpayIntegration = getApp().integrations.moonpay;
    const user = !_.isEmpty(props.profile) ? props.profile : null;
    const virtual = getApp().virtual;
    const wallets =
      virtual === true
        ? profile
            .getWallets()
            .filter(
              w =>
                new String(w.currency.ticker).toString().toLowerCase() !== "eth"
            )
        : profile.getWallets();

    if (wallets && !wallet) {
      wallet = wallets.find(w => w.currency.virtual === false);
    }

    const userId = profile.getID();
    const isKycNeeded = await profile.isKycConfirmed();

    const { colors } = getAppCustomization();

    const primaryColor = colors.find(color => {
      return color.type === "primaryColor";
    });

    this.setState({
      ...this.state,
      clientId: kycIntegration.clientId,
      flowId: kycIntegration.flowId,
      isMoonpayActive: moonpayIntegration.isActive,
      isKycStatus:
          isKycStatus === null ? isKycStatus : isKycStatus.toLowerCase(),
      isKycNeeded,
      userId,
      colorHexCode: primaryColor.hex,
      wallets,
      wallet,
      virtual: getApp().virtual,
      isEmailConfirmed: await user.isEmailConfirmed()
    });
    this.caseKycStatus();
  };

  handleTabChange = name => {
    this.setState({ tab: name });
  };

  handleOpenMoonpay = () => {
    this.setState({ onOpenMoonpay: true });
  };

  handleOpenMoonpayFalse = () => {
    this.setState({ onOpenMoonpay: false });
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
          <div>
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

  renderPopSendAlert = tab => {
    const { ln } = this.props;
    const { isConfirmationSent } = this.state;
    const copyConfirmEmail = CopyText.homepage[ln];
    const skin = getAppCustomization().skin.skin_type;
    const emailIcon = getIcon(11);

    return(
            <div styleName="email-confirmation">
                {
                    tab === "deposit" ?
                        <div styleName="email-title">
                            <span styleName="icon">
                                {emailIcon === null ? <EmailIcon/> : <img src={emailIcon} />}
                            </span>
                            <Typography variant={'small-body'} color={'grey'} weight={"bold"}>
                                {copyConfirmEmail.CONTAINERS.APP.MODAL[2]}
                            </Typography>
                        </div>
                        :
                        <>
                        <div styleName="container-end">
                            <button styleName="close-button" onClick={() => this.onCloseTab()}>
                                <CloseCross />
                            </button>
                        </div>
                        <div styleName="container-direction">
                            <div styleName="center-text">
                                <Typography variant={'small-body'} color={'grey'} weight={"bold"}>
                                    {"Confirm KYC"}
                                </Typography>
                            </div>
                        </div>
                        </>
                        }
                <div styleName="email-content">
                    <div styleName="email-text">
                        <Typography variant={'x-small-body'} color={'white'}>
                           {tab === "deposit" ? " Your e-mail is not confirmed." : "Your KYC account is not confirmed."}
                        </Typography>
                        <Typography variant={'x-small-body'} color={'white'}>
                           {tab === "deposit" ?
                                "Please click the button to send another e-mail confirmation." 
                            :
                                "Seems like we have to know a bit more about you, please do your KYC to enable withdraws"}
                        </Typography>
                    </div>
                    <div styleName="email-buttons"> 
                        <div styleName="button">
                            {
                                tab === "deposit" ?
                                    <Button size={'x-small'} theme={'action'} disabled={tab === "deposit"  ? isConfirmationSent : null} onClick={this.handleResendConfirmEmail}>
                                        <Typography
                                            color={skin == "digital" ? 'secondary' : 'fixedwhite'}
                                            variant={'small-body'}
                                        >
                                            {copyConfirmEmail.CONTAINERS.APP.MODAL[2]}
                                        </Typography>
                                    </Button>
                                :
                                <div styleName="button">
                                    {this.caseKycStatus()}
                                </div>
                            }
                        </div>
                    </div>
                </div>
            </div>
    )
}

  handleMoonpay = () => {
    const { profile } = this.props;
    const { colorHexCode, wallet } = this.state;
    const userEmail = profile.getUserEmail();
    const userId = profile.user.id;
    const resultMoonpay = getApp().integrations.moonpay;
    const resultWalletAddress = wallet.address;

    return (
      <div>
        <div styleName="bg-cnt">
          <div styleName="bg-cnt-2">
            <button
              onClick={() => this.handleOpenMoonpayFalse()}
              type="button"
              styleName="button-x"
            >
              <CloseCross />
            </button>
            <iframe
              styleName="bg-moonpay-box"
              allow="accelerometer; autoplay; camera; gyroscope; payment"
              frameBorder="0"
              src={`https://buy-staging.moonpay.io?apiKey=${resultMoonpay.key}&currencyCode=eth&walletAddress=${resultWalletAddress}&colorCode=%23${colorHexCode.slice(1, 7)}&email=${userEmail}&externalCustomerId=${userId}`}
            >
              <p>Your browser does not support iframes.</p>
            </iframe>
          </div>
        </div>
      </div>
    );
  };

  changeWallet = async wallet => {
    this.setState({ wallet });
  };

  handleAddress = address => {
    const { wallet } = this.state;

    if (wallet) {
      wallet.address = address;
      this.setState({ wallet });
    }
  };

  handleResendConfirmEmail = async () => {
    const { profile, ln } = this.props;
    const copy = CopyText.homepage[ln];

    try {
      this.setState({ isConfirmationSent: true });
      const res = await profile.resendConfirmEmail();
      const { message, status } = res.data;

      if (status != 200) {
        store.dispatch(setMessageNotification(message));
        throw message;
      }

      store.dispatch(
        setMessageNotification(copy.CONTAINERS.APP.NOTIFICATION[2])
      );
      this.setState({ isConfirmationSent: false });
    } catch (err) {
      console.log(err);
    }
  };

  render() {
    const { ln, isCurrentPath } = this.props;
    const {
      tab,
      wallets,
      wallet,
      virtual,
      isEmailConfirmed,
      onOpenMoonpay,
      isKycNeeded,
      isMoonpayActive
    } = this.state;
    const copy = CopyText.cashierFormIndex[ln];
    const skin = getAppCustomization().skin.skin_type;

    if (!wallet) {
      return null;
    }

    return (
      <>
        <div>
        <div styleName={isKycNeeded === true && tab === "withdraw" ? "blur" : null}>
          <Row styleName={isEmailConfirmed === false ? "blur" : null}>
            <Col md={12} lg={12} xl={4}>
              <div>
                {wallets.map(w => {
                  return (
                    <PaymentBox
                      onClick={() => this.changeWallet(w)}
                      isPicked={
                        new String(wallet.currency._id).toString() ==
                        new String(w.currency._id).toString()
                      }
                      wallet={w}
                    />
                  );
                })}
                {isMoonpayActive === true ? (
                  <button
                    styleName={`${skin === "digital" ? "container-root color-kyc" : "container-root"}`}
                    onClick={() => this.handleOpenMoonpay()}
                  >
                    <Row>
                      <Col xs={3} md={3}>
                        <div styleName='container-image'>
                            <img src={CreditCard} styleName='payment-image'/>
                        </div>
                      </Col>
                      <Col xs={8} md={8}>
                        <div styleName={'container-text'}>
                          <Typography variant={'small-body'} color={'white'}>
                              Credit Card
                          </Typography>
                          <div styleName='text-description'>
                              <Typography variant={'x-small-body'} color={'white'}>
                                Deposit with your Credit Card
                              </Typography>
                          </div>
                        </div>
                      </Col>
                    </Row>
                  </button>
                ) : null }
              </div>
            </Col>
            <Col md={12} lg={12} xl={8}>
              <div>
                <Tabs
                  selected={tab}
                  options={[
                    {
                      value: "deposit",
                      label:
                        virtual === true
                          ? copy.INDEX.TABS.LABEL[2]
                          : copy.INDEX.TABS.LABEL[0]
                    },
                    {
                      value: "withdraw",
                      label: copy.INDEX.TABS.LABEL[1],
                      disabled: virtual === true
                    }
                  ]}
                  onSelect={this.handleTabChange}
                  style="full-background"
                />
              </div>
              {isEmailConfirmed === true ? (
                tab === "deposit" ? (
                  <>
                    <div>
                      <DepositForm
                        wallet={wallet}
                        onAddress={this.handleAddress}
                      />
                      <DepositList isCurrentPath={isCurrentPath} />
                    </div>
                  </>
                ) : (
                  <div>
                    <WithdrawForm
                      wallet={wallet}
                      onAddress={this.handleAddress}
                    />{" "}
                    <WithdrawList isCurrentPath={isCurrentPath} />
                  </div>
                  
                )
              ) : null}
            </Col>
          </Row>
          </div>
          {isEmailConfirmed === false ? tab === "deposit" ? this.renderPopSendAlert("deposit") : null : null}
          {isKycNeeded === true ? tab === "withdraw" ? this.renderPopSendAlert("withdraw") : null : null}
        </div>
        {onOpenMoonpay === true ? this.handleMoonpay() : null}
      </>
    );
  }
}

function mapStateToProps(state) {
  return {
    profile: state.profile,
    ln: state.language,
    currency: state.currency
  };
}

export default connect(mapStateToProps)(WalletTab);
