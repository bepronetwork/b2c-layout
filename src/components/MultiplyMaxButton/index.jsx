import React, { Component } from "react";
import PropTypes from "prop-types";
import Typography from "../Typography";
import { CopyText } from "../../copy";
import { connect } from "react-redux";
import { getAppCustomization } from "../../lib/helpers";
import "./index.css";
import gameOperations from "../../utils/gameOperations";
import _ from "lodash";

class MultiplyMaxButton extends Component {
  static propTypes = {
    onResult: PropTypes.func.isRequired,
    amount: PropTypes.number.isRequired
  };

  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick = event => {
    const { profile, currency, onResult, amount } = this.props;
    const { name } = event.currentTarget;
    const wallet = profile.getWallet({ currency });
    const balance = _.isEmpty(wallet) ? 0 : wallet.playBalance;
    const hadBonus =
      wallet.bonusAmount > 0
        ? Number(wallet.bonusAmount) + Number(balance)
        : balance;
    const bonusPlusBalance = _.isEmpty(wallet) ? 0 : hadBonus;

    let newAmount;

    if (_.isEmpty(profile)) {
      return null;
    }

    if (balance <= 0) {
      newAmount = gameOperations(name, amount, bonusPlusBalance);
    } else {
      newAmount = gameOperations(name, amount, balance);
    }

    console.log(
      amount,
      "profile() handleMultiply"
    );

    return onResult(newAmount);
  };

  render() {
    const { ln } = this.props;
    const copy = CopyText.multiplyMaxButtonIndex[ln];
    const skin = getAppCustomization().skin.skin_type;

    return (
      <div styleName="root">
        <div styleName="container">
          <button
            name={0.5}
            onClick={event => this.handleClick(event)}
            styleName="button"
            type="button"
          >
            <div styleName="button-container">
              <Typography
                weight="semi-bold"
                variant="small-body"
                color={skin == "digital" ? "secondary" : "casper"}
              >
                ½
              </Typography>
            </div>
          </button>
          <button
            name={2}
            onClick={event => this.handleClick(event)}
            styleName="button"
            type="button"
          >
            <div styleName="button-container">
              <Typography
                weight="semi-bold"
                variant="small-body"
                color={skin == "digital" ? "secondary" : "casper"}
              >
                2×
              </Typography>
            </div>
          </button>
          <button
            name="max"
            onClick={event => this.handleClick(event)}
            styleName="button"
            type="button"
          >
            <div styleName="button-container">
              <Typography
                weight="semi-bold"
                variant="x-small-body"
                color={skin == "digital" ? "secondary" : "casper"}
              >
                {copy.INDEX.TYPOGRAPHY.TEXT[0]}
              </Typography>
            </div>
          </button>
        </div>
      </div>
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

export default connect(mapStateToProps)(MultiplyMaxButton);
