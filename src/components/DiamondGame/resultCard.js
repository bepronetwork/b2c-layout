import React from "react";

import "./index.css";

const handleCardResult = (marginTop, profit, chance) => {
  return (
    <div styleName="result-container-right" style={{ marginTop }}>
      <div>
        <p styleName="text-result">Lucro</p>
        <div styleName="result-right">
          <p styleName="text-result">{profit}</p>
        </div>
      </div>
      <div>
        <p styleName="text-result">Chance</p>
        <div styleName="result-right">
          <p styleName="text-result">{chance}</p>
          <p styleName="text-result">%</p>
        </div>
      </div>
    </div>
  );
};

export default handleCardResult;
