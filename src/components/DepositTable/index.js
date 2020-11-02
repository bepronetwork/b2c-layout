import React, { Component } from "react";
import { DepositsIcon, Table } from "components";
import { connect } from "react-redux";
import { dateToHourAndMinute, isUserSet, getIcon } from "../../lib/helpers";
import { formatCurrency } from "../../utils/numberFormatation";
import { Numbers, AddressConcat } from "../../lib/ethereum/lib";
import { CopyText } from "../../copy";
import _ from "lodash";
import "./index.css";

const views = [
  { text: 10, value: 10 },
  { text: 25, value: 25 },
  { text: 50, value: 50 },
  { text: 100, value: 100 },
];

const rows = {
  deposits: {
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
        value: "bonusAmount",
      },
      {
        value: "status",
      },
    ],
    rows: [],
  },
};

const defaultProps = {
  deposits: rows.deposits,
  view: "deposits",
  view_amount: views[0],
  isLoading: true,
  isListLoading: true,
};
class DepositTable extends Component {
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
    const copy = CopyText.depositspage[ln];
    let deposits = [];

    if (profile && !_.isEmpty(profile)) {
      deposits = await profile.getDeposits();
    }

    const depositsIcon = getIcon(18);

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
            depositsIcon === null ? (
              <DepositsIcon />
            ) : (
              <img src={depositsIcon} alt="Deposits Icon" />
            ),
        };
      }),
      deposits: {
        ...this.state.deposits,
        titles: copy.TABLE.DEPOSITS.ITEMS,
        rows: deposits.map((d) => {
          return {
            amount: formatCurrency(Numbers.toFloat(d.amount)),
            transactionHash: d.transactionHash
              ? AddressConcat(d.transactionHash)
              : "N/A",
            creation_timestamp: dateToHourAndMinute(d.creation_timestamp),
            status: d.transactionHash ? "Confirmed" : "Confirm",
            currency: d.currency,
            link_url: d.link_url,
            bonusAmount: d.bonusAmount,
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

  confirmDeposit = async (deposit) => {
    try {
      const { profile } = this.props;
      /* Create Deposit Framework */
      let res = await profile.confirmDeposit(deposit);
      let { message, status } = res.data;
      if (status != 200) {
        throw message;
      }
      /* Update user Data */
      await profile.getAllData(true);
    } catch (err) {
      console.log(err);
    }
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

export default connect(mapStateToProps)(DepositTable);
