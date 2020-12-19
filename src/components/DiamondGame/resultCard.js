import React from "react";
import "./index.css";

const handleCardResult = (
  marginTop,
  profit,
  chance,
  ProfitTitle,
  ProbabilityTitle
) => {
  return (
    <div styleName="result-container-right" style={{ marginTop }}>
      <div>
        <p styleName="text-result">{ProfitTitle}</p>
        <div styleName="result-right">
          <p styleName="text-result">{`${profit}`}</p>
        </div>
      </div>
      <div>
        <p styleName="text-result">{ProbabilityTitle}</p>
        <div styleName="result-right">
          <p styleName="text-result">{`${chance}`}</p>
          <p styleName="text-result-percent">%</p>
        </div>
      </div>
    </div>
  );
};

export default handleCardResult;
