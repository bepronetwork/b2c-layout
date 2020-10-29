import React, { Component } from "react";
import PropTypes from "prop-types";
import { Typography, ToggleButton, InputNumber } from "components";
import { CopyText } from "../../copy";
import { connect } from "react-redux";
import "./index.css";

class OnWinLoss extends Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    value: PropTypes.number
  };

  static defaultProps = {
    value: 0
  };

  constructor(props) {
    super(props);

    this.state = {
      side: "reset",
      value: props.value ? props.value : 0
    };
  }

  handleSelect = side => {
    const { onChange } = this.props;

    this.setState({ side }, () => {
      const { value } = this.state;

      onChange(side === "reset" ? null : value);
    });
  };

  handleChange = sideValue => {
    const { onChange } = this.props;

    this.setState({ value: sideValue }, () => {
      const { value } = this.state;

      onChange(value);
    });
  };

  render() {
    const { title } = this.props;
    const { side, value } = this.state;
    const { ln } = this.props;
    const copy = CopyText.onWinLossIndex[ln];

    return (
      <div>
        <Typography weight="semi-bold" variant="small-body" color="casper">
          {title}
        </Typography>
        <div styleName="container">
          <ToggleButton
            config={{
              left: {
                value: "reset",
                title: copy.INDEX.TOGGLE_BUTTON.TITLE[0]
              },
              right: {
                value: "increase",
                title: copy.INDEX.TOGGLE_BUTTON.TITLE[1]
              }
            }}
            variant="x-small-body"
            selected={side}
            onSelect={this.handleSelect}
            differentBorders
          />
        </div>
        <div styleName="container">
          <div styleName="input">
            <InputNumber
              disabled={side === "reset"}
              name="value"
              precision={2}
              variant="x-small-body"
              unit="%"
              value={value}
              onChange={this.handleChange}
            />
          </div>
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

export default connect(mapStateToProps)(OnWinLoss);
