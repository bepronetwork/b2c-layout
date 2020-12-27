import React from "react";
import { connect } from "react-redux";
import PaymentBox from "../../PaymentBox";
import { setDepositInfo } from "../../../redux/actions/deposit";
import store from "../../../containers/App/store";
import { getApp } from "../../../lib/helpers";
import { CopyText } from "../../../copy";

class CurrencyDepositForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      wallets: [],
    };
  }

  componentDidMount() {
    this.projectData(this.props);
  }

  UNSAFE_componentWillReceiveProps(props) {
    this.projectData(props);
  }

  projectData = async () => {
    const wallets = getApp().wallet.filter((w) => w.currency.virtual === false);

    this.setState({
      wallets,
    });
  };
  changeCurrency = async (c) => {
    await store.dispatch(setDepositInfo({ key: "currency", value: c }));
  };

  render() {
    const { wallets } = this.state;
    const { deposit } = this.props;
    const { ln } = this.props;
    const copy = CopyText.currencyFormIndex[ln];

    return (
      <div>
        {wallets.map((w) => {
          return (
            <PaymentBox
              onClick={() => this.changeCurrency(w.currency)}
              isPicked={
                String(deposit.currency._id).toString() ===
                String(w.currency._id).toString()
              }
              id={`${w.currency.ticker}`}
              image={w.image ? w.image : w.currency.image}
              type={`${w.currency.name}`}
              description={copy.INDEX.PAYMENTBOX.DESCRIPTION[0]}
              currency={w.currency}
            />
          );
        })}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    deposit: state.deposit,
    profile: state.profile,
    ln: state.language,
  };
}

export default connect(mapStateToProps)(CurrencyDepositForm);
