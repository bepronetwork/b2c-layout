import React, { Component } from "react";
import { WithdrawIcon, Table, LoadMoreData, SelectBox } from "components";
import { connect } from "react-redux";
import _ from "lodash";
import { dateToHourAndMinute, isUserSet, getIcon } from "../../lib/helpers";
import { formatCurrency } from "../../utils/numberFormatation";
import { Numbers, AddressConcat } from "../../lib/ethereum/lib";
import { CopyText } from "../../copy";
import "./index.css";

const views = [
  { text: 5, value: 5 },
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
  view_amount: views[1],
  isLoading: true,
  isListLoading: true
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
    let { view_amount } = this.state;
    const copy = CopyText.withdrawspage[ln];
    let withdraws = [];

    if (options) {
      view_amount = options.view_amount ? options.view_amount : view_amount;
    }

    if (profile && !_.isEmpty(profile)) {
      const transactions = await profile.getMyTransactions({ size: 10, offset: 0 });

      withdraws = transactions && transactions.withdraws || [];
    }

    const withdrawIcon = getIcon(19);

    this.setState({
      ...this.state,
      ...options,
      isLoading: false,
      isListLoading: false,
      options: Object.keys(copy.TABLE).map(key => {
        return {
          value: new String(key).toLowerCase(),
          label: copy.TABLE[key].TITLE,
          icon: withdrawIcon === null ? <WithdrawIcon /> : <img src={withdrawIcon} />
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
    const { text, value } = option;
    const { withdraws } = this.state;
    const { rows } = withdraws;

    const size = Math.min(rows.length, value);

    this.setState({ view_amount: { text: size, value: size } });
  };

  formatWithdraws = withdraws => {
    const formatedWithdraws = withdraws.map(d => {
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

    return formatedWithdraws;
}

  loadMoreWithdraws = async () => {
    const { profile } = this.props;
    const { withdraws } = this.state;

    if (profile && !_.isEmpty(profile)) {
        this.setState({ isListLoading: true });

        const dataSize = withdraws.rows.length || 0;

        const transactions = await profile.getMyTransactions({ size: 10, offset: dataSize });
        const rawWithdrawsData = transactions && transactions.withdraws || [];
        
        const newWithdraws = _.concat(withdraws.rows, this.formatWithdraws(rawWithdrawsData));

        this.setState({ 
            withdraws: { ...withdraws, rows: newWithdraws }, 
            view_amount: { text: newWithdraws.length, value: newWithdraws.length }, 
            isListLoading: false 
        })
    }
  }

  createSlice = size => {
    const { withdraws } = this.state;
    const rows = withdraws.rows;

    const sliceIndex = Math.min(rows.length, size);

    return rows.slice(0, sliceIndex)
  }

  render() {
    const { isListLoading, view, view_amount } = this.state;
    const { profile } = this.props;
    const userId = profile.getID();

    if (!isUserSet(profile)) {
      return;
    }

    return (
      <div styleName="container">
        <div styleName='lastBets'>
          <div styleName="filters">
              <div styleName='bets-dropdown'>
                  <SelectBox
                      size='small'
                      onChange={(e) => this.changeView(e)}
                      options={views}
                      value={this.state.view_amount}
                  /> 
              </div>
          </div>
        </div>
        <Table
          rows={this.createSlice(view_amount.value)}
          titles={this.state[view].titles}
          fields={this.state[view].fields}
          size={view_amount.value}
          isLoading={isListLoading}
        />

        <LoadMoreData isLoading={isListLoading} onLoadMore={this.loadMoreWithdraws}/>
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
