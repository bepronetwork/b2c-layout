import React from "react";
import { LinearProgress } from "@material-ui/core";
import { Typography, Button } from "components";
import PropTypes from "prop-types";
import "./index.css";

// GameCounter is just a dumb component to show how many
// games are being shown on the page
const GameCounter = ({ quantity, total, ...props }) =>
  quantity < total ? (
    <div styleName="progress">
      <div styleName="line">
        <LinearProgress
          variant="determinate"
          value={(quantity / total) * 100}
        />
      </div>
      <div styleName="text">
        <Typography variant="x-small-body" color="white">
          {`Displaying ${quantity} of ${total} games`}
        </Typography>
      </div>
      <Button size="x-small" theme="action" {...props}>
        <Typography color="white" variant="small-body">
          Load More
        </Typography>
      </Button>
    </div>
  ) : null;

GameCounter.propTypes = {
  quantity: PropTypes.number,
  total: PropTypes.number
};

GameCounter.defaultProps = {
  quantity: 0,
  total: 0
};

export default GameCounter;
