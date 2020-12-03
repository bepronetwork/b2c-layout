import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { isEmpty, uniqueId } from "lodash";
import Typography from "../Typography";
import { CopyText } from "../../copy";
import { getAppCustomization } from "../../lib/helpers";
import "./index.css";
import gameOperations from "../../utils/gameOperations";

export const MultiplyMaxButton = ({
  profile,
  onResult,
  amount,
  onBetAmount,
  language
}) => {
  const copy = CopyText.multiplyMaxButtonIndex[language];
  const skin = getAppCustomization().skin.skin_type;
  const handleClick = event => {
    if (isEmpty(profile)) {
      return null;
    }

    const { name } = event.currentTarget;
    const balance = parseFloat(profile.getBalanceWithBonus());
    let newAmount;

    newAmount = gameOperations(name, amount, balance);

    if (newAmount.toString().length > 6) {
      newAmount = Number(newAmount.toFixed(6));
    }

    if (onBetAmount) {
      onBetAmount(newAmount);
    }

    return onResult(newAmount);
  };

  const multiplyButtons = [
    {
      name: 0.5,
      typography: "½"
    },
    {
      name: 2,
      typography: "2×"
    },
    {
      name: "max",
      typography: copy.INDEX.TYPOGRAPHY.TEXT[0]
    }
  ];

  return (
    <div styleName="root">
      <div styleName="container">
        {multiplyButtons.map(({ name, typography }) => (
          <button
            key={uniqueId("multiply_max_button_")}
            name={name}
            onClick={handleClick}
            styleName="button"
            type="button"
          >
            <div styleName="button-container">
              <Typography
                weight="semi-bold"
                variant="small-body"
                color={skin === "digital" ? "secondary" : "casper"}
              >
                {typography}
              </Typography>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

MultiplyMaxButton.propTypes = {
  onResult: PropTypes.func.isRequired,
  onBetAmount: PropTypes.func.isRequired,
  amount: PropTypes.number.isRequired,
  language: PropTypes.string.isRequired,
  profile: PropTypes.objectOf([PropTypes.object]).isRequired
};

const mapStateToProps = ({ profile, language }) => ({ profile, language });

export default connect(mapStateToProps)(MultiplyMaxButton);
