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
import { Col, Row, CarouselControl } from "reactstrap";
import _ from "lodash";
import PaymentBox from "../PaymentBox";
import DepositList from "./DepositList";
import WithdrawList from "./WithdrawList";
import { CopyText } from "../../copy";
import { getApp, getAppCustomization } from "../../lib/helpers";
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
  colorHexCode: null
};

class WalletTab extends React.Component {
  constructor(props) {
    super(props);
    this.state = defaultState;
  }

  componentDidMount() {
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

  projectData = async props => {
    const { profile } = this.props;
    let { wallet } = this.state;
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

    const { colors } = getAppCustomization();

    const primaryColor = colors.find(color => {
      return color.type === "primaryColor";
    });

    this.setState({
      ...this.state,
      colorHexCode: primaryColor.hex,
      wallets,
      wallet,
      virtual: getApp().virtual,
      isEmailConfirmed: await user.isEmailConfirmed()
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

  handleMoonpay = () => {
    const { profile, currency } = this.props;
    const { colorHexCode } = this.state;
    const userEmail = profile.getUserEmail();
    const userId = profile.user.id;
    const resultMoonpay = getApp().integrations.moonpay;
    const resultWalletAddress = profile.getWallet({ currency }).currency
      .address;

    return (
      <div>
        <div styleName="bg-cnt">
          <div styleName="bg-cnt-2">
            <button
              onClick={() => this.handleOpenMoonpayFalse()}
              type="button"
              styleName="button-x"
            >
              <Typography color="secondary" variant="h2">
                X
              </Typography>
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

  renderPopSendEmailAlert = () => {
    const { ln, profile, currency  } = this.props;
    const { isEmailConfirmed, isConfirmationSent } = this.state;
    const copyConfirmEmail = CopyText.homepage[ln];
    const skin = getAppCustomization().skin.skin_type;
    const resultMoonpay = getApp().integrations.moonpay;
    const resultWalletAddress = profile.getWallet({ currency }).currency
    .address;

    console.log(resultWalletAddress);
    return isEmailConfirmed === false ? (
      <div styleName="email-confirmation">
        <div styleName="email-title">
          <span styleName="icon">
            <EmailIcon />
          </span>
          <Typography variant="small-body" color="grey" weight="bold">
            {copyConfirmEmail.CONTAINERS.APP.MODAL[2]}
          </Typography>
        </div>
        <div styleName="email-content">
          <div styleName="email-text">
            <Typography variant="x-small-body" color="white">
              Your e-mail is not confirmed.
            </Typography>
            <Typography variant="x-small-body" color="white">
              Please click the button to send another e-mail confirmation.
            </Typography>
          </div>
          <div styleName="email-buttons">
            <div styleName="button">
              <Button
                size="x-small"
                theme="action"
                disabled={isConfirmationSent}
                onClick={this.handleResendConfirmEmail}
              >
                <Typography
                  color={skin == "digital" ? "secondary" : "fixedwhite"}
                  variant="small-body"
                >
                  {copyConfirmEmail.CONTAINERS.APP.MODAL[2]}
                </Typography>
              </Button>

              {resultMoonpay.isValid ? (
                <div styleName="button">
                  <Button
                    size="x-small"
                    theme="action"
                    onClick={this.handleMoonpay}
                  >
                    <Typography
                      color={skin == "digital" ? "secondary" : "fixedwhite"}
                      variant="small-body"
                    >
                      {"Buy with creditcard"}
                    </Typography>
                  </Button>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    ) : null;
  };

  render() {
    const { ln, isCurrentPath } = this.props;
    const {
      tab,
      wallets,
      wallet,
      virtual,
      isEmailConfirmed,
      onOpenMoonpay
    } = this.state;
    const copy = CopyText.cashierFormIndex[ln];
    const skin = getAppCustomization().skin.skin_type;

    if (!wallet) {
      return null;
    }

    return (
      <>
        <div>
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
                    <div styleName="button">
                      <Button
                        size="x-small"
                        theme="action"
                        onClick={() => this.handleOpenMoonpay()}
                      >
                        <Typography
                          color={skin == "digital" ? "secondary" : "fixedwhite"}
                          variant="small-body"
                        >
                          {"Buy with creditcard"}
                        </Typography>
                      </Button>
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
          {this.renderPopSendEmailAlert()}
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
