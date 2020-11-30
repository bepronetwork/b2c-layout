import React, { Component } from "react";
import { connect } from "react-redux";
import { images } from "../SlotsGame/images";
import "./index.css";

class SlotsBox extends Component {
  render() {
    const { result, multiplier, winAmount } = this.props;

    return (
      <div styleName="root">
        <div styleName="container-blocks">
          {result.map(num => {
            return (
              <img src={images[num.index]} alt="Slot" styleName="iconStatic" />
            );
          })}
        </div>
        <div styleName="resultCard">
          <div styleName="columnContainer">
            <p styleName="resultCardText">{multiplier}x</p>
            <p styleName="resultCardText">{winAmount}</p>
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    ln: state.language
  };
}

export default connect(mapStateToProps)(SlotsBox);
