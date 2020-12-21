import React, { useState, useEffect } from "react";
import { LinearProgress } from "@material-ui/core";
import { Typography, Button } from "components";
import PropTypes from "prop-types";
import "./index.css";

const GameCounter = ({ total, factorBase, buttonLabel, label, onMore }) => {
  const [more, setMore] = useState(factorBase);

  useEffect(() => {
    setMore(more);
    onMore(more);
  }, []);

  const handleMore = () => {
    const quantity = more + factorBase > total ? total : more + factorBase;

    setMore(quantity);
    onMore(quantity);
  };

  return more < total ? (
    <div styleName="progress">
      <div styleName="line">
        <LinearProgress variant="determinate" value={(more / total) * 100} />
      </div>
      <div styleName="text">
        <Typography variant="x-small-body" color="white">
          {label.replace(/quantity/gi, more).replace(/total/gi, total)}
        </Typography>
      </div>
      <Button size="x-small" theme="action" onClick={handleMore}>
        <Typography color="white" variant="small-body">
          {buttonLabel}
        </Typography>
      </Button>
    </div>
  ) : null;
};

GameCounter.propTypes = {
  total: PropTypes.number,
  factorBase: PropTypes.number,
  label: PropTypes.string,
  buttonLabel: PropTypes.string,
  onMore: PropTypes.func.isRequired,
};

GameCounter.defaultProps = {
  total: 0,
  factorBase: 18,
  buttonLabel: "More",
  label: "Showing quantity of total.",
};

export default GameCounter;
