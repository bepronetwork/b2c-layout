import React from "react";
import { LinearProgress } from "@material-ui/core";
import { Typography, Button } from "components";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { CopyText } from "../../copy";
import "./index.css";

// GameCounter is just a dumb component to show how many
// games are being shown on the page
const GameCounter = ({ quantity, total, ln, ...props }) =>
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
          {CopyText.gameCounter[ln].DESCRIPTION.replace(
            /quantity/gi,
            quantity
          ).replace(/total/gi, total)}
        </Typography>
      </div>
      <Button size="x-small" theme="action" {...props}>
        <Typography color="white" variant="small-body">
          {CopyText.gameCounter[ln].BUTTON}
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

function mapStateToProps(state) {
  return {
    ln: state.language
  };
}

export default connect(mapStateToProps)(GameCounter);
