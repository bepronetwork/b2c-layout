import React, { Component } from "react";
import PropTypes from "prop-types";
import Typography from "../Typography";
import { CopyText } from "../../copy";
import { connect } from "react-redux";
import { getAppCustomization } from "../../lib/helpers";
import "./index.css";
import gameOperations from "../../utils/gameOperations";
import { isEmpty } from "lodash";

const propTypes = {
  onResult: PropTypes.func.isRequired,
  onBetAmount: PropTypes.func.isRequired,
  amount: PropTypes.number.isRequired,
  language: PropTypes.string.isRequired,
  profile: PropTypes.objectOf([PropTypes.object]).isRequired
};

class MultiplyMaxButton extends Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(event) {
    const { profile, onResult, amount, onBetAmount } = this.props;
    const { name } = event.currentTarget;
    let newAmount;

    if (isEmpty(profile)) {
      return null;
    }

    const balance = parseFloat(profile.getBalanceWithBonus());

    newAmount = gameOperations(name, amount, balance);

    if (newAmount.toString().length > 6) {
      newAmount = Number(newAmount.toFixed(6));
    }

    if (onBetAmount) {
      onBetAmount(newAmount);
    }

    return onResult(newAmount);
  }

  render() {
    const { language } = this.props;
    const copy = CopyText.multiplyMaxButtonIndex[language];
    const skin = getAppCustomization().skin.skin_type;

    return (
      <div styleName="root">
        <div styleName="container">
          <button
            name={0.5}
            onClick={this.handleClick}
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
            onClick={this.handleClick}
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
            onClick={this.handleClick}
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

const mapStateToProps = ({ profile, language }) => ({ profile, language });

MultiplyMaxButton.propTypes = propTypes;

export default connect(mapStateToProps)(MultiplyMaxButton);
