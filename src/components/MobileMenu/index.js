import React, { Component } from "react";
import { connect } from "react-redux";
import {
  Typography,
  WalletIcon,
  SettingsIcon,
  DepositsIcon,
  WithdrawIcon,
  BetsIcon,
  UserIcon,
  UsersIcon,
  ConfirmedIcon,
} from "components";
import { CopyText } from "../../copy";
import {
  getApp,
  getAddOn,
  getIcon,
  getAppCustomization,
} from "../../lib/helpers";
import { formatCurrency } from "../../utils/numberFormatation";
import _ from "lodash";
import "./index.css";

class MobileMenu extends Component {
  constructor(props) {
    super(props);
    const userIcon = getIcon(0);
    const securityIcon = getIcon(15);
    const betsIcon = getIcon(16);
    const walletIcon = getIcon(17);
    const depositsIcon = getIcon(18);
    const withdrawIcon = getIcon(19);
    const affiliatesIcon = getIcon(20);
    const preferencesIcon = getIcon(21);

    this.state = {
      blankBool: false,
      points: 0,
      itens: [
        {
          path: "/settings/account",
          copyValue: 6,
          icon: userIcon === null ? <UserIcon /> : <img src={userIcon} alt="User" />,
        },
        {
          path: "/settings/security",
          copyValue: 7,
          icon:
            securityIcon === null ? (
              <ConfirmedIcon />
            ) : (
              <img src={securityIcon} />
            ),
        },
        {
          path: "/settings/bets",
          copyValue: 5,
          icon: betsIcon === null ? <BetsIcon /> : <img src={betsIcon} alt="Bets" />,
        },
        {
          path: "/settings/wallet",
          copyValue: 8,
          icon: walletIcon === null ? <WalletIcon /> : <img src={walletIcon} alt="Wallet" />,
        },
        {
          path: "/settings/deposits",
          copyValue: getApp().virtual === true ? 4 : 1,
          icon:
            depositsIcon === null ? (
              <DepositsIcon />
            ) : (
              <img src={depositsIcon} alt="Deposits" />
            ),
        },
        {
          path: "/settings/withdraws",
          copyValue: 2,
          icon:
            withdrawIcon === null ? (
              <WithdrawIcon />
            ) : (
              <img src={withdrawIcon} alt="Withdraw" />
            ),
        },
        {
          path: "/settings/affiliate",
          copyValue: 3,
          icon:
            affiliatesIcon === null ? (
              <UsersIcon />
            ) : (
              <img src={affiliatesIcon} alt="Affiliates" />
            ),
        },
        {
          path: "/settings/preferences",
          copyValue: 9,
          icon:
            preferencesIcon === null ? (
              <SettingsIcon />
            ) : (
              <img src={preferencesIcon} alt="Preferences" />
            ),
        },
      ],
      tabs: [],
    };
  }

  componentDidMount() {
    this.projectData(this.props);
  }

  UNSAFE_componentWillReceiveProps(props) {
    this.projectData(props);
  }

  projectData = async (props) => {
    const { ln } = props;
    let { topTab } = getAppCustomization();

    topTab = topTab.languages.find(
      (t) =>
        t.language.isActivated === true &&
        t.language.prefix === ln.toUpperCase(),
    );

    this.setState({
      tabs: _.isEmpty(topTab) ? [] : topTab.ids,
    });

    if (!_.isEmpty(props.profile)) {
      const user = props.profile;

      this.setState({
        points: await user.getPoints(),
      });
    }
  };

  homeClick = (homepage) => {
    this.props.history.push(`${homepage}`);

    const result = homepage.search("http");

    if (result >= 0) {
      this.setState({ blankBool: true });
    } else {
      this.setState({ blankBool: false });
    }
  };

  renderItens() {
    const { ln, onMenuItem, history } = this.props;
    const { itens } = this.state;
    const copy = CopyText.homepage[ln];

    return (
      <ul>
        {itens.map((item) => {
          return (
            <li key={item.path}>
              <a
                href="/"
                onClick={() => onMenuItem({ history, path: item.path })}
              >
                <span styleName="row">
                  <div styleName="icon">{item.icon}</div>
                  <Typography variant="x-small-body" color="grey">
                    {copy.CONTAINERS.ACCOUNT.TITLE[item.copyValue]}
                  </Typography>
                </span>
              </a>
            </li>
          );
        })}
      </ul>
    );
  }

  render() {
    const { points, tabs, blankBool } = this.state;
    const { ln } = this.props;
    const copy = CopyText.homepage[ln];

    const isValidPoints = getAddOn().pointSystem
      ? getAddOn().pointSystem.isValid
      : false;
    const logoPoints = getAddOn().pointSystem
      ? getAddOn().pointSystem.logo
      : null;
    const namePoints = getAddOn().pointSystem
      ? getAddOn().pointSystem.name
      : null;

    return (
      <div>
        {tabs.map((t) => {
          return (
            <div key={t.name}>
              <a
                styleName="title"
                href={blankBool ? t.link_url : null}
                onClick={() => this.homeClick(t.link_url)}
                target={blankBool ? "_blank" : null}
                rel="noopener"
              >
                {t.icon ? (
                  <div styleName="img">
                    <img src={t.icon} width="22" height="22" key={t.name} />
                  </div>
                ) : null}
                <Typography variant={"body"} color={"white"}>
                  {t.name}
                </Typography>
              </a>
            </div>
          );
        })}
        {isValidPoints === true ? (
          <div styleName="points">
            <div styleName="label-points">
              {!_.isEmpty(logoPoints) ? (
                <div styleName="currency-icon">
                  <img src={logoPoints} width={20} alt="Points" />
                </div>
              ) : null}
              <span>
                <Typography
                  color="white"
                  variant={"small-body"}
                >{`${formatCurrency(points)} ${namePoints}`}</Typography>
              </span>
            </div>
          </div>
        ) : null}
        <div styleName="title">
          <Typography variant={"body"} color={"white"}>
            {copy.CONTAINERS.ACCOUNT.TITLE[0]}
          </Typography>
        </div>
        {this.renderItens()}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    profile: state.profile,
    ln: state.language,
  };
}

export default connect(mapStateToProps)(MobileMenu);
