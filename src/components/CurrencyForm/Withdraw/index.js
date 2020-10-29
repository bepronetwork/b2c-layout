import React from "react";
import { connect } from "react-redux";
import PaymentBox from "../../PaymentBox";
import store from "../../../containers/App/store";
import { setWithdrawInfo } from "../../../redux/actions/withdraw";
import { getApp } from "../../../lib/helpers";
import { CopyText } from "../../../copy";

class CurrencyWithdrawForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      wallets: []
    };
  }

  componentDidMount() {
    this.projectData(this.props);
  }

  componentWillReceiveProps(props) {
    this.projectData(props);
  }

  projectData = async props => {
    let wallets = getApp().wallet;

    this.setState({ ...this.state, wallets });
  };

  changeCurrency = async c => {
    await store.dispatch(setWithdrawInfo({ key: "currency", value: c }));
  };

  render() {
    const { wallets } = this.state;
    const { withdraw } = this.props;
    const { ln } = this.props;
    const copy = CopyText.currencyFormIndex[ln];

    return (
      <div>
        {wallets.map(w => {
          return (
            <PaymentBox
              onClick={() => this.changeCurrency(w.currency)}
              isPicked={
                new String(withdraw.currency._id).toString() ==
                new String(w.currency._id).toString()
              }
              id={`${w.currency.ticker}`}
              image={w.image ? w.image : w.currency.image}
              type={`${w.currency.name}`}
              description={copy.INDEX.PAYMENTBOX.DESCRIPTION[0]}
              time={"fast withdraw"}
              id={`${w.currency.ticker}`}
            />
          );
        })}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    withdraw: state.withdraw,
    profile: state.profile,
    ln: state.language
  };
}

export default connect(mapStateToProps)(CurrencyWithdrawForm);
