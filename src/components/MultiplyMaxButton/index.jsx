import React, { Component } from "react";
import PropTypes from "prop-types";
import Typography from "../Typography";
import { CopyText } from "../../copy";
import { connect } from "react-redux";
import { getAppCustomization } from "../../lib/helpers";
import "./index.css";

class MultiplyMaxButton extends Component {
  static propTypes = {
    onSelect: PropTypes.func.isRequired
  };

  handleClick = event => {
    const { onSelect } = this.props;

    onSelect(event.currentTarget.name);
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

function mapStateToProps(state) {
  return {
    profile: state.profile,
    ln: state.language
  };
}

export default connect(mapStateToProps)(MultiplyMaxButton);
