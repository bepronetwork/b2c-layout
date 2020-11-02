import React, { Component } from "react";
import { WithdrawIcon, Table } from "components";
import { connect } from "react-redux";
import _ from "lodash";
import { dateToHourAndMinute, isUserSet, getIcon } from "../../lib/helpers";
import { formatCurrency } from "../../utils/numberFormatation";
import { Numbers, AddressConcat } from "../../lib/ethereum/lib";
import { CopyText } from "../../copy";
import "./index.css";

const views = [
  { text: 10, value: 10 },
  { text: 25, value: 25 },
  { text: 50, value: 50 },
  { text: 100, value: 100 },
];

const rows = {
  withdraws: {
    titles: [],
    fields: [
      {
        value: "transactionHash",
        isLink: true,
        linkField: "link_url",
      },
      {
        value: "creation_timestamp",
      },
      {
        value: "amount",
        currency: true,
      },
      {
        value: "done",
      },
      {
        value: "status",
      },
    ],
    rows: [],
  },
};

const defaultProps = {
  withdraws: rows.withdraws,
  view: "withdraws",
  view_amount: views[0],
  isLoading: true,
  isListLoading: true,
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
  }

  componentWillReceiveProps(props) {
    if (props !== this.props) {
      this.projectData(props);
    }
  }

  projectData = async (props, options = null) => {
    const { profile, ln } = props;
    const copy = CopyText.withdrawspage[ln];
    let withdraws = [];
    const withdrawIcon = getIcon(19);

    if (profile && !_.isEmpty(profile)) {
      withdraws = await profile.getWithdraws();
    }

    this.setState({
      ...this.state,
      ...options,
      isLoading: false,
      isListLoading: false,
      options: Object.keys(copy.TABLE).map((key) => {
        return {
          value: new String(key).toLowerCase(),
          label: copy.TABLE[key].TITLE,
          icon:
            withdrawIcon === null ? (
              <WithdrawIcon />
            ) : (
              <img src={withdrawIcon} alt="Withdraw Icon" />
            ),
        };
      }),
      withdraws: {
        ...this.state.withdraws,
        titles: copy.TABLE.WITHDRAWS.ITEMS,
        rows: withdraws.map((d) => {
          return {
            amount: formatCurrency(Numbers.toFloat(d.amount)),
            transactionHash: d.transactionHash
              ? AddressConcat(d.transactionHash)
              : "N/A",
            creation_timestamp: dateToHourAndMinute(d.creation_timestamp),
            status: d.confirmed ? "Confirmed" : "Open",
            currency: d.currency,
            link_url: d.link_url,
            done: d.confirmed ? "Done" : "Unconfirmed",
          };
        }),
      },
    });
  };

  setTimer = (options) => {
    this.projectData(this.props, options);
  };

  changeView = ({ option }) => {
    this.setState({ ...this.state, isListLoading: true });
    this.setTimer({ view_amount: option });
  };

  render() {
    const { isListLoading, view } = this.state;
    const { profile } = this.props;

    if (!isUserSet(profile)) {
      return;
    }

    return (
      <div styleName="container">
        <Table
          rows={this.state[view].rows}
          titles={this.state[view].titles}
          fields={this.state[view].fields}
          size={this.state.view_amount.value}
          isLoading={isListLoading}
        />
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

export default connect(mapStateToProps)(WithdrawTable);
