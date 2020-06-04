import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import Typography from "components/Typography";
import { reduce } from "lodash";
import Coin from "components/Icons/Coin";
import "./index.css";

export default class TableCell extends Component {
  static propTypes = {
    label: PropTypes.string,
    focused: PropTypes.bool,
    color: PropTypes.oneOf([
      "auto",
      "red",
      "japanese-laurel",
      "pickled-bluewood",
      "pickled-bluewood-light",
      "pickled-bluewood-dark"
    ]),
    isResult: PropTypes.bool,
    betHistory: PropTypes.arrayOf(
      PropTypes.shape({ cell: PropTypes.string, chip: PropTypes.number })
    ).isRequired,
    id: PropTypes.string
  };

  static defaultProps = {
    label: "",
    color: "auto",
    focused: false,
    isResult: false,
    id: null
  };

  getRoundChipValue = (chipSelected, denominator, fixed) => {
    const amount = (chipSelected / denominator).toFixed(
      fixed || fixed === 0 ? fixed : 1
    );

    return amount - parseInt(amount, 10) === 0 ? parseInt(amount, 10) : amount;
  };

  getChipValue = chipSelected => {
    if (!chipSelected) return null;

    if (chipSelected >= 10000) {
      return [`${this.getRoundChipValue(chipSelected, 1000)}K`, "10K"];
    }

    if (chipSelected >= 1000) {
      return [`${this.getRoundChipValue(chipSelected, 1000)}K`, "1K"];
    }

    if (chipSelected >= 100) {
      return [`${this.getRoundChipValue(chipSelected, 1, 0)}`, "100"];
    }

    if (chipSelected >= 10) {
      return [`${this.getRoundChipValue(chipSelected, 1)}`, "10"];
    }

    if (chipSelected >= 1) {
      return [`${this.getRoundChipValue(chipSelected, 1, 2)}`, "1"];
    }

    if (chipSelected >= 0.1) {
      return [`${this.getRoundChipValue(chipSelected, 1, 2)}`, "01"];
    }

    if (chipSelected >= 0.01) {
      return [`${this.getRoundChipValue(chipSelected, 1, 2)}`, "001"];
    }

    return [`${this.getRoundChipValue(chipSelected, 1, 3)}`, "0001"];
  };

  render() {
    const { label, color, focused, betHistory, id, isResult } = this.props;

    const chipSelected = reduce(
      betHistory,
      (sum, { cell, chip }) => {
        if (cell === id || cell === label) {
          return sum + chip;
        }

        return sum;
      },
      0
    );

    const chipLabelAndValue = this.getChipValue(chipSelected);

    const cellClasses = classNames("cell", {
      [color]: true,
      focused,
      "is-result": isResult,
      active: chipSelected
    });

    return (
      <div styleName={cellClasses}>
        <Typography
          weight="semi-bold"
          variant={chipSelected ? "x-small-body" : "small-body"}
          color={chipSelected ? "gable-green" : "fixedwhite"}
        >
          {chipLabelAndValue ? chipLabelAndValue[0] : label}
        </Typography>
        <Coin
          value={chipLabelAndValue ? chipLabelAndValue[1].toString() : "1"}
        />
      </div>
    );
  }
}
