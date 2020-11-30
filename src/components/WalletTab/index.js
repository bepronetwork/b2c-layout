import React from "react";
import { connect } from "react-redux";
import {
  Tabs,
  DepositForm,
  WithdrawForm,
  Typography,
  Button,
  EmailIcon,
  KycStatus
} from "components";
import { Col, Row } from "reactstrap";
import _ from "lodash";
import CloseCross from "components/Icons/CloseCross";
import Cache from "../../lib/cache/cache";
import PaymentBox from "../PaymentBox";
import DepositList from "./DepositList";
import WithdrawList from "./WithdrawList";
import CreditCard from "assets/icons/credit-card.svg"
import { CopyText } from "../../copy";
import { getApp, getAppCustomization,  getIcon } from "../../lib/helpers";
import { setMessageNotification } from "../../redux/actions/message";
import store from "../../containers/App/store";
import "./index.css";
import { KYC_IN_REVIEW, KYC_VERIFIED, NO_KYC } from "../../config/kycStatus";

const defaultState = {
  tab: "deposit",
  wallets: [],
  wallet: null,
  isEmailConfirmed: false,
  isConfirmationSent: false,
  onOpenMoonpay: false,
  isMoonpayActive: null,
  colorHexCode: null,
  isKycNeeded: null,
  onClose: false,
  kycStatus: ""
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

resultFilter = (firstArray, secondArray) => {
  return firstArray.filter(firstArrayItem =>
    !secondArray.some(
      secondArrayItem => firstArrayItem._user === secondArrayItem._user
    )
  );
};

  projectData = async props => {
    const { profile } = this.props;
    let { wallet, isEmailConfirmed } = this.state;
    const kycStatus = await profile.kycStatus();
    const moonpayIntegration = getApp().integrations.moonpay;
    const user = !_.isEmpty(props.profile) ? props.profile : null;
    const virtual = getApp().virtual;
    const getCurrenciesApp = getApp().currencies;
    const getUserWallet = profile.getWallets();

    const resultCompare =  getUserWallet.filter(wallet =>
      getCurrenciesApp.some(
        getCurrenciesApp => wallet.currency._id === getCurrenciesApp._id
      ))

    const wallets =
      virtual === true
        ? profile
            .getWallets()
            .filter(
              w =>
                new String(w.currency.ticker).toString().toLowerCase() !== "eth"
            )
        : resultCompare

    if (wallets && !wallet) {
      wallet = wallets.find(w => w.currency.virtual === false);
    }

    if(isEmailConfirmed !== user.isEmailConfirmed()){
      this.setState({ isEmailConfirmed: await user.isEmailConfirmed() })
    }
      
    const isKycNeeded = await profile.isKycConfirmed();

    const { colors } = getAppCustomization();

    const primaryColor = colors.find(color => {
      return color.type === "primaryColor";
    });

    this.setState({
      ...this.state,
      isMoonpayActive: moonpayIntegration.isActive,
      isKycNeeded,
      colorHexCode: primaryColor.hex,
      wallets,
      wallet,
      virtual: getApp().virtual,
      kycStatus
    });
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

  renderPopSendAlert = tab => {
    const { ln } = this.props;
    const { isConfirmationSent, kycStatus } = this.state;
    const copyConfirmEmail = CopyText.homepage[ln];
    const copy = CopyText.walletTab[ln];
    const skin = getAppCustomization().skin.skin_type;
    const emailIcon = getIcon(11);
    const kycStatusError =
      kycStatus !== NO_KYC &&
      kycStatus !== null &&
      kycStatus !== KYC_IN_REVIEW &&
      kycStatus !== KYC_VERIFIED;

    const renderKycStatus = status => {
      return status === KYC_IN_REVIEW ? (
        <div
          style={{ display: "inline-flex", alignItems: "center", width: 180 }}
        >
          <KycStatus />
        </div>
      ) : (
        <KycStatus />
      )
    };
    
    return(
            <div styleName="email-confirmation">
                {
                  tab === "deposit" ?
                      <div styleName="email-title">
                          <span styleName="icon">
                              {emailIcon === null ? <EmailIcon/> : <img src={emailIcon} alt="Email Icon" />}
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
                      <div styleName="container-direction email-title">
                          <div styleName="center-text">
                              <Typography variant={'small-body'} color={'grey'} weight={"bold"}>
                                  {copy.INDEX.TEXT[0]}
                              </Typography>
                          </div>
                      </div>
                    </>
                }
                <div styleName="email-content">
                    <div styleName="email-text">
                        <Typography variant={'x-small-body'} color={'white'}>
                           {tab === "deposit" ? copy.INDEX.TEXT[4] : copy.INDEX.TEXT[5]}
                        </Typography>
                        <Typography variant={'x-small-body'} color={'white'}>
                           {tab === "deposit" ? copy.INDEX.TEXT[1] : copy.INDEX.TEXT[2]}
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
                              <>
                                {kycStatusError &&
                                  <Typography
                                    color={'red'}
                                    variant={'small-body'}
                                    otherStyles={{ display: 'block', marginBottom: 16 }}
                                  >
                                    {copy.INDEX.TEXT[3]}
                                  </Typography>
                                }
                                {renderKycStatus(kycStatus)}
                              </>
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
                {isMoonpayActive ? (
                  <button
                    styleName="container-root"
                    onClick={() => this.handleOpenMoonpay()}
                  >
                    <Row>
                      <Col xs={4} md={4}>
                        <div styleName='container-image'>
                            <img src={CreditCard} styleName='payment-image' alt="Payment" />
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
