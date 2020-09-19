import React, { Component } from "react";
import { WithdrawIcon, Typography, Table, Button } from "components";
import { connect } from "react-redux";
import _, { flow } from "lodash";

import Cache from "../../lib/cache/cache";
import { dateToHourAndMinute, isUserSet } from "../../lib/helpers";
import { formatCurrency } from "../../utils/numberFormatation";
import { Numbers, AddressConcat } from "../../lib/ethereum/lib";
import { CopyText } from "../../copy";
import "./index.css";

const views = [
  { text: 10, value: 10 },
  { text: 25, value: 25 },
  { text: 50, value: 50 },
  { text: 100, value: 100 }
];

const rows = {
  withdraws: {
    titles: [],
    fields: [
      {
        value: "transactionHash",
        isLink: true,
        linkField: "link_url"
      },
      {
        value: "creation_timestamp"
      },
      {
        value: "amount",
        currency: true
      },
      {
        value: "done"
      },
      {
        value: "status"
      }
    ],
    rows: []
  }
};

const defaultProps = {
  withdraws: rows.withdraws,
  view: "withdraws",
  view_amount: views[0],
  isLoading: true,
  isListLoading: true,
  isKYCConfirmed: false,
  clientId: "",
  flowId: ""
};

class WithdrawTable extends Component {
  constructor(props) {
    super(props);
    this.state = defaultProps;
  }

  componentDidMount() {
    const { isCurrentPath } = this.props;

    if (isCurrentPath) {
      this.projectData(this.props);
    }

    this.getAppIntegration();
  }

  componentWillReceiveProps(props) {
    if (props !== this.props) {
      this.projectData(props);
    }
  }

  getAppIntegration = () => {
    const appInfo = Cache.getFromCache("appInfo");
    const kycIntegration = appInfo.integrations.kyc;

    this.setState({
      clientId: kycIntegration.clientid,
      flowId: kycIntegration.flowId,
      isKYCConfirmed: kycIntegration.isActive
    });
  };

  renderPopSendkycAlert = (clientId, flowId, userId) => {
    const { ln } = this.props;
    const { isKYCConfirmed } = this.state;
    const copy = CopyText.homepage[ln];

    return isKYCConfirmed === false ? (
      <div>
        <div styleName="kyc-confirmation-ctn" />
        <div styleName="kyc-confirmation">
          <div styleName="kyc-title">
            <Typography variant="small-body" color="grey" weight="bold">
              {copy.CONTAINERS.APP.MODAL[3]}
            </Typography>
          </div>
          <div styleName="kyc-content">
            <div styleName="kyc-text">
              <Typography variant="x-small-body" color="white">
                Your KYC is not confirmed.
              </Typography>
              <Typography variant="x-small-body" color="white">
                Seems like we have to know a bit more about you, please do your
                KYC to enable withdraws
              </Typography>
            </div>
            <div styleName="kyc-buttons">
              <div styleName="button">
                <mati-button
                  clientid={clientId}
                  flowId={flowId}
                  metadata={{ id: userId }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    ) : null;
  };

  projectData = async (props, options = null) => {
    const { profile, ln } = props;
    let { view_amount } = this.state;
    const copy = CopyText.withdrawspage[ln];
    let withdraws = [];

    if (options) {
      view_amount = options.view_amount ? options.view_amount : view_amount;
    }

    if (profile && !_.isEmpty(profile)) {
      withdraws = await profile.getWithdraws();
    }

    this.setState({
      ...this.state,
      ...options,
      isLoading: false,
      isListLoading: false,
      options: Object.keys(copy.TABLE).map(key => {
        return {
          value: new String(key).toLowerCase(),
          label: copy.TABLE[key].TITLE,
          icon: <WithdrawIcon />
        };
      }),
      withdraws: {
        ...this.state.withdraws,
        titles: copy.TABLE.WITHDRAWS.ITEMS,
        rows: withdraws.map(d => {
          return {
            amount: formatCurrency(Numbers.toFloat(d.amount)),
            transactionHash: d.transactionHash
              ? AddressConcat(d.transactionHash)
              : "N/A",
            creation_timestamp: dateToHourAndMinute(d.creation_timestamp),
            status: d.confirmed ? "Confirmed" : "Open",
            currency: d.currency,
            link_url: d.link_url,
            done: d.confirmed ? "Done" : "Unconfirmed"
          };
        })
      }
    });
  };

  setTimer = options => {
    this.projectData(this.props, options);
  };

  changeView = ({ option }) => {
    this.setState({ ...this.state, isListLoading: true });
    this.setTimer({ view_amount: option });
  };

  render() {
    const { isLoading, isListLoading, clientId, view, flowId } = this.state;
    const { profile } = this.props;
    const userId = profile.getID();

    if (!isUserSet(profile)) {
      return;
    }

    return (
      <div styleName="container">
        {/* isLoading ?
                    <SkeletonTheme color={ getSkeletonColors().color} highlightColor={ getSkeletonColors().highlightColor}>
                        <div styleName='lastBets' style={{opacity : '0.5'}}>
                            <div styleName='filters'>
                                <div styleName='bets-dropdown-game'>
                                    <Skeleton width={100} height={30}/>
                                </div>
                                <div styleName='bets-dropdown'>
                                    <Skeleton width={50} height={30}/>
                                </div>
                            </div>
                        </div>
                    </SkeletonTheme>
                :
                    <div styleName='lastBets'>
                        <Tabs
                            selected={view}
                            options={options}
                        />
                        <div styleName="filters">
                            <div styleName='bets-dropdown'>
                                <SelectBox
                                    onChange={(e) => this.changeView(e)}
                                    options={views}
                                    value={this.state.view_amount}
                                /> 
                            </div>
                        </div>
                    </div>
                */}
        <Table
          rows={this.state[view].rows}
          titles={this.state[view].titles}
          fields={this.state[view].fields}
          size={this.state.view_amount.value}
          isLoading={isListLoading}
        />
        {this.renderPopSendkycAlert(clientId, flowId, userId)}
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

export default connect(mapStateToProps)(WithdrawTable);
