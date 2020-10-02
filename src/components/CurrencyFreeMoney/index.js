import React from "react";

import { Typography } from "components";
import Timer from "assets/icons/timer.svg";
import "./index.css";

function CurrencyFreeMoney({ hour, minutes }) {
  return (
    <div styleName="container-root">
      <Typography variant="small-body" color="white" weight="bold">
        You can get ATH every 12 hours
      </Typography>
      <div styleName="container-button-timer">
        <div styleName="row-container">
          <div styleName="container-image">
            <img src={Timer} styleName="payment-image" alt="" />
          </div>
          <div styleName="digital-text">{`${hour}:${minutes}`}</div>
        </div>
        <Typography variant="x-small-body" color="white" weight="bold">
          To next replenish
        </Typography>
      </div>
    </div>
  );
}
export default CurrencyFreeMoney;
